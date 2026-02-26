require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const { v4: uuidv4 } = require("uuid");

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const multer = require('multer');
const path = require('path');

const { exec } = require("child_process");
const Tesseract = require("tesseract.js");
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/labels');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files allowed'));
    }
    cb(null, true);
  }
});

const app = express();
app.use(cors());
app.use(express.json());

const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

const allowedTransitions = {
  NEW: ["VERIFIED"],
  VERIFIED: ["LABEL_GENERATED"],
  LABEL_GENERATED: ["IN_TRANSIT"],
  IN_TRANSIT: ["DELIVERED"],
  DELIVERED: ["FEEDBACK_PENDING"],
  FEEDBACK_PENDING: ["CLOSED"],
  CLOSED: []
};

const canTransition = (current, next) => {
  return allowedTransitions[current]?.includes(next);
};
// ----------------------
// PostgreSQL Connection
// ----------------------
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: false,
});

pool.on("connect", () => {
  console.log("PostgreSQL connected");
});

pool.on("error", (err) => {
  console.error("Unexpected DB error:", err);
  process.exit(1);
});

// ----------------------
// SERVICE PRICING (USD ONLY)
// ----------------------
const SERVICE_PRICING = {
  documents: {
    mode: "flat",
    tiers: [65, 55],
  },
  parcels: {
    mode: "flat",
    tiers: [10, 8],
  },
  air: {
    mode: "flat",
    tiers: [12, 10],
  },
  sea: {
    mode: "per_box",
    tiers: [150, 180],
  },
};

// ----------------------
// E.164 Phone Validation
// ----------------------
const isValidE164US = (phone) => /^\+1[2-9]\d{2}[2-9]\d{6}$/.test(phone);
const isValidE164India = (phone) => /^\+91[6-9]\d{9}$/.test(phone);
// ----------------------
// Create Shipments Table
// ----------------------
const initDB = async () => {
  await pool.query(`
   CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY,
  reference_code VARCHAR(30) UNIQUE,
  route VARCHAR(50) NOT NULL,

  sender_name VARCHAR(150),
  sender_phone VARCHAR(20),
  sender_postal VARCHAR(20),
  sender_address_line TEXT,

  receiver_name VARCHAR(150),
  receiver_phone VARCHAR(20),
  receiver_postal VARCHAR(20),
  receiver_address_line TEXT,

  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  final_amount NUMERIC(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  status VARCHAR(50) NOT NULL,
  payment_method VARCHAR(50),

  payment_reference VARCHAR(100) UNIQUE,
  payment_sender_name VARCHAR(100),
  payment_submitted_at TIMESTAMP,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
  `);

  console.log("Shipments table ready");
};

initDB();

// ----------------------
// Generate Professional Reference Code
// ----------------------
const generateReference = async () => {
  const today = new Date();
  const datePart = today.toISOString().slice(0, 10).replace(/-/g, "");

  const result = await pool.query(
    `SELECT COUNT(*) FROM shipments WHERE DATE(created_at) = CURRENT_DATE`
  );

  const count = parseInt(result.rows[0].count) + 1;
  const sequence = count.toString().padStart(4, "0");

  return `DH-${datePart}-${sequence}`;
};

// ----------------------
// Create Shipment (SECURE PRICING)
// ----------------------
app.post("/api/shipments", async (req, res) => {
  try {
    const {
      route,
      serviceId,
      deliveryTier,
      quantity,
      senderAddress,
      receiverAddress,
    } = req.body;

    // Basic validation
    if (!route || !serviceId || deliveryTier == null || !quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid shipment data",
      });
    }

    // Validate service
    const service = SERVICE_PRICING[serviceId];
    if (!service) {
      return res.status(400).json({
        success: false,
        message: "Invalid service type",
      });
    }

    // Validate tier
    const unitPrice = service.tiers[deliveryTier];
    if (unitPrice == null) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery tier",
      });
    }

    // Calculate final amount
    let finalAmount;

    if (service.mode === "flat") {
      finalAmount = unitPrice;
    } else {
      finalAmount = unitPrice * quantity;
    }



/* ===============================
   ✅ ADD SAFETY VALIDATION HERE
================================ */

if (
  !senderAddress ||
  !receiverAddress ||
  !senderAddress.fullName ||
  !senderAddress.phone ||
  !senderAddress.postal ||
  !senderAddress.addressLine ||
  !receiverAddress.fullName ||
  !receiverAddress.phone ||
  !receiverAddress.postal ||
  !receiverAddress.addressLine
) {
  return res.status(400).json({
    success: false,
    message: "Invalid or incomplete address data",
  });
}

/* =============================== */

// ----------------------
// Phone Format Validation (Backend Authority)
// ----------------------
if (route === "US_TO_IN") {
  if (!isValidE164US(senderAddress.phone)) {
    return res.status(400).json({
      success: false,
      message: "Invalid US sender phone format",
    });
  }

  if (!isValidE164India(receiverAddress.phone)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Indian receiver phone format",
    });
  }
}

if (route === "IN_TO_US") {
  if (!isValidE164India(senderAddress.phone)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Indian sender phone format",
    });
  }

  if (!isValidE164US(receiverAddress.phone)) {
    return res.status(400).json({
      success: false,
      message: "Invalid US receiver phone format",
    });
  }
}

const id = uuidv4();
const referenceCode = await generateReference();

    await pool.query(
  `
  INSERT INTO shipments 
  (
    id,
    reference_code,
    route,

    sender_name,
    sender_phone,
    sender_postal,
    sender_address_line,

    receiver_name,
    receiver_phone,
    receiver_postal,
    receiver_address_line,

    quantity,
    unit_price,
    final_amount,
    status,
    payment_method
  )
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
  `,
  [
    id,
    referenceCode,
    route,

    senderAddress.fullName,
    senderAddress.phone,
    senderAddress.postal,
    senderAddress.addressLine,

    receiverAddress.fullName,
    receiverAddress.phone,
    receiverAddress.postal,
    receiverAddress.addressLine,

    quantity,
    unitPrice,
    finalAmount,
    "PAYMENT_PENDING",
    "ZELLE",
  ]
);

    res.json({
      success: true,
      shipmentId: id,
      referenceCode,
      finalAmount,
      currency: "USD",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Shipment creation failed",
    });
  }
});

// ----------------------
// Mark As Paid
// ----------------------
app.patch("/api/shipments/:id/mark-paid", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `
      UPDATE shipments
      SET status = 'AWAITING_VERIFICATION',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND status = 'PAYMENT_PENDING'
      `,
      [id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// ----------------------
// Submit Payment Details (Zelle)
// ----------------------
app.post("/api/shipments/:id/submit-payment", async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentReference } = req.body;

    if (!paymentReference) {
      return res.status(400).json({
        success: false,
        message: "Missing payment reference",
      });
    }

    const result = await pool.query(
      `
      UPDATE shipments
      SET 
        payment_reference = $1,
        payment_submitted_at = CURRENT_TIMESTAMP,
        status = 'AWAITING_VERIFICATION',
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
        AND status = 'PAYMENT_PENDING'
      RETURNING id
      `,
      [paymentReference, id]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid shipment or already submitted",
      });
    }

    res.json({ success: true });

  } catch (err) {
    console.error("Submit payment error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
// ----------------------
// Admin Verify Payment
// ----------------------
app.patch("/api/shipments/:id/verify", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { comments } = req.body || {};

    const result = await pool.query(
      "SELECT workflow_status FROM shipments WHERE id = $1",
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ success: false, message: "Shipment not found" });
    }

    const currentStatus = result.rows[0].workflow_status;

    if (!canTransition(currentStatus, "VERIFIED")) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from ${currentStatus} to VERIFIED`
      });
    }

    await pool.query(
      "UPDATE shipments SET workflow_status = 'VERIFIED', updated_at = CURRENT_TIMESTAMP WHERE id = $1",
      [id]
    );

    await pool.query(
      "INSERT INTO shipment_logs (shipment_id, action, comments, updated_by) VALUES ($1, $2, $3, $4)",
      [id, "VERIFIED", comments || null, req.admin.email]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});



// ----------------------
// Generate Label
// ----------------------
app.patch(
  "/api/shipments/:id/generate-label",
  adminAuth,
  upload.single("label"),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "PDF label file required",
        });
      }

      const result = await pool.query(
        "SELECT workflow_status FROM shipments WHERE id = $1",
        [id]
      );

      if (!result.rows.length) {
        return res.status(404).json({
          success: false,
          message: "Shipment not found",
        });
      }

      const currentStatus = result.rows[0].workflow_status;

      if (!canTransition(currentStatus, "LABEL_GENERATED")) {
        return res.status(400).json({
          success: false,
          message: `Cannot transition from ${currentStatus} to LABEL_GENERATED`,
        });
      }

      const filePath = req.file.path;

      // Read uploaded PDF
// ---------- OCR BASED TRACKING EXTRACTION ----------

const absolutePath = path.join(__dirname, filePath);
const outputBase = absolutePath.replace(".pdf", "");

// Convert first page of PDF to PNG
await new Promise((resolve, reject) => {
  exec(
    `pdftoppm -png -f 1 -singlefile "${absolutePath}" "${outputBase}"`,
    (error) => {
      if (error) {
        console.error("PDF to image conversion failed:", error);
        reject(error);
      } else {
        resolve();
      }
    }
  );
});

const imagePath = `${outputBase}.png`;

// Run OCR
const {
  data: { text },
} = await Tesseract.recognize(imagePath, "eng");

console.log("----- OCR TEXT START -----");
console.log(text);
console.log("----- OCR TEXT END -----");

// Extract digits only
const digitsOnly = text.replace(/\D/g, "");

// FedEx tracking usually 12–20 digits
const trackingMatch = digitsOnly.match(/\d{12,20}/);

let trackingNumber = null;

if (trackingMatch) {
  trackingNumber = trackingMatch[0];
}

if (!trackingNumber) {
  return res.status(400).json({
    success: false,
    message: "Valid FedEx tracking number not found in label",
  });
}


      await pool.query(
  `UPDATE shipments
   SET workflow_status = 'LABEL_GENERATED',
       label_file = $1,
       tracking_number = $2,
       courier = 'FEDEX',
       updated_at = CURRENT_TIMESTAMP
   WHERE id = $3`,
  [filePath, trackingNumber, id]
);

      await pool.query(
        "INSERT INTO shipment_logs (shipment_id, action, updated_by) VALUES ($1, $2, $3)",
        [id, "LABEL_GENERATED", req.admin.email]
      );

      res.json({ success: true });

    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false });
    }
  }
);

app.patch("/api/shipments/:id/start-transit", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { trackingNumber, courier } = req.body;

    if (!trackingNumber || !courier) {
      return res.status(400).json({
        success: false,
        message: "Tracking number and courier required"
      });
    }

    const result = await pool.query(
      "SELECT workflow_status FROM shipments WHERE id = $1",
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found"
      });
    }

    const currentStatus = result.rows[0].workflow_status;

    if (!canTransition(currentStatus, "IN_TRANSIT")) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from ${currentStatus} to IN_TRANSIT`
      });
    }

    await pool.query(
      `UPDATE shipments 
       SET workflow_status = 'IN_TRANSIT',
           tracking_number = $1,
           courier = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [trackingNumber, courier, id]
    );

    await pool.query(
      "INSERT INTO shipment_logs (shipment_id, action, updated_by) VALUES ($1, $2, $3)",
      [id, "IN_TRANSIT", req.admin.email]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.patch("/api/shipments/:id/mark-delivered", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT workflow_status FROM shipments WHERE id = $1",
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found"
      });
    }

    const currentStatus = result.rows[0].workflow_status;

    if (!canTransition(currentStatus, "DELIVERED")) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from ${currentStatus} to DELIVERED`
      });
    }

    await pool.query(
      `UPDATE shipments 
       SET workflow_status = 'DELIVERED',
           delivery_date = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [id]
    );

    await pool.query(
      "INSERT INTO shipment_logs (shipment_id, action, updated_by) VALUES ($1, $2, $3)",
      [id, "DELIVERED", req.admin.email]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.patch("/api/shipments/:id/request-feedback", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT workflow_status FROM shipments WHERE id = $1",
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found"
      });
    }

    const currentStatus = result.rows[0].workflow_status;

    if (!canTransition(currentStatus, "FEEDBACK_PENDING")) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from ${currentStatus} to FEEDBACK_PENDING`
      });
    }

    await pool.query(
      `UPDATE shipments
       SET workflow_status = 'FEEDBACK_PENDING',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [id]
    );

    await pool.query(
      "INSERT INTO shipment_logs (shipment_id, action, updated_by) VALUES ($1, $2, $3)",
      [id, "FEEDBACK_PENDING", req.admin.email]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.patch("/api/shipments/:id/close", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT workflow_status FROM shipments WHERE id = $1",
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found"
      });
    }

    const currentStatus = result.rows[0].workflow_status;

    if (!canTransition(currentStatus, "CLOSED")) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from ${currentStatus} to CLOSED`
      });
    }

    await pool.query(
      `UPDATE shipments
       SET workflow_status = 'CLOSED',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [id]
    );

    await pool.query(
      "INSERT INTO shipment_logs (shipment_id, action, updated_by) VALUES ($1, $2, $3)",
      [id, "CLOSED", req.admin.email]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});


// ----------------------
// Root Route
// ----------------------
app.get("/", (req, res) => {
  res.send("DeliveryHub Backend Running");
});

// ----------------------
// Public Track Shipment
// ----------------------
app.get("/api/track/:referenceCode", async (req, res) => {
  try {
    const { referenceCode } = req.params;

    const result = await pool.query(
      `
    SELECT
  reference_code,
  route,
  workflow_status,
  tracking_number,
  courier,
  created_at,
  updated_at
FROM shipments
WHERE reference_code = $1
      `,
      [referenceCode]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    const shipment = result.rows[0];

    res.json({
      success: true,
      shipment,
    });

  } catch (err) {
    console.error("Track shipment error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM admins WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = result.rows[0];

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { adminId: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/admin/shipments', adminAuth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        s.id,
        s.reference_code,
        s.route,
        s.final_amount,
        s.workflow_status,
        s.tracking_number,
        s.courier,
        s.created_at,
        s.updated_at,
        (
          SELECT updated_by
          FROM shipment_logs
          WHERE shipment_id = s.id
          ORDER BY created_at DESC
          LIMIT 1
        ) AS last_updated_by
      FROM shipments s
      ORDER BY s.created_at DESC
    `);

    res.json({
      success: true,
      shipments: result.rows,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});
// ----------------------
// Start Server
// ----------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${PORT}`);
});