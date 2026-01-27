const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ----------------------
// File paths
// ----------------------
const pincodesFile = path.join(__dirname, "data/pincodes.json");
const shipmentsFile = path.join(__dirname, "data/shipments.json");
const paymentsFile = path.join(__dirname, "data/payments.json");

// ----------------------
// Safe JSON Reader
// ----------------------
function safeRead(file) {
  try {
    const data = fs.readFileSync(file, "utf8").trim();
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
}

// ----------------------
// 1) Validate PIN using pincodes.json
// ----------------------
app.get("/api/validate-pin/:pin", (req, res) => {
  const pin = Number(req.params.pin);
  const list = safeRead(pincodesFile);

  const isValid = list.some((item) => Number(item.pincode) === pin);

  res.json({ valid: isValid });
});

// ----------------------
// 2) Supported Location (true/false)
// ----------------------
app.get("/api/supported-location/:pin", (req, res) => {
  const pin = Number(req.params.pin);
  const list = safeRead(pincodesFile);

  const supported = list.some((item) => Number(item.pincode) === pin);

  res.json({ supported });
});

// ----------------------
// 3) Validate ZIP (USA)
// ----------------------
app.get("/api/validate-zip/:zip", (req, res) => {
  const zip = req.params.zip;
  const isValid = /^[0-9]{5}$/.test(zip);
  res.json({ valid: isValid });
});

// ----------------------
// Helper Functions
// ----------------------
function generateTracking() {
  return "PMB-" + Math.floor(100000000 + Math.random() * 900000000);
}

function generatePaymentRef() {
  return "PMB-PMT-" + Math.floor(10000000 + Math.random() * 90000000);
}

// ----------------------
// 4) Save Shipment
// ----------------------
app.post("/api/save-shipment", (req, res) => {
  const shipments = safeRead(shipmentsFile);

  const tracking = generateTracking();
  const date = new Date().toISOString();

  const shipment = {
    id: tracking,
    pickup: req.body.pickup,
    toAddr: req.body.toAddr,
    courier: req.body.courier,
    amount: req.body.amount,
    days: req.body.days,
    date,
  };

  shipments.push(shipment);

  fs.writeFileSync(shipmentsFile, JSON.stringify(shipments, null, 2));

  res.json({ success: true, tracking });
});

// ----------------------
// 5) Save Payment
// ----------------------
app.post("/api/save-payment", (req, res) => {
  const payments = safeRead(paymentsFile);

  const paymentRef = generatePaymentRef();
  const date = new Date().toISOString();

  const last4 = req.body.cardNumber.slice(-4);
  const masked = "**** **** **** " + last4;

  const payment = {
    paymentRef,
    trackingNumber: req.body.trackingNumber,
    amount: req.body.amount,
    card: masked,
    name: req.body.name,
    expiry: req.body.expiry,
    date,
  };

  payments.push(payment);

  fs.writeFileSync(paymentsFile, JSON.stringify(payments, null, 2));

  res.json({ success: true, paymentRef });
});

// ----------------------
// 6) Estimate Price
// ----------------------
app.post("/api/estimate", (req, res) => {
  const { zip, pin, courier } = req.body;

  const zipNum = parseInt(zip);
  const pinNum = parseInt(pin);

  let basePrice = 800;
  let pinVariation = Math.abs(zipNum - pinNum) % 400;

  let price = basePrice + pinVariation;

  if (courier === "FedEx") {
    price += 200;
  } else if (courier === "UPS") {
    price += 100;
  }

  res.json({ success: true, price });
});

// ----------------------
// Root Route
// ----------------------
app.get("/", (req, res) => {
  res.send("DocShip Backend is Running 🚚");
});

// ----------------------
// Start Server
// ----------------------
app.listen(5000, () => {
  console.log("Backend API running at http://localhost:5000");
});
