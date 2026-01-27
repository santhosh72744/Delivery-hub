// -----------------------------
// Backend Calls
// -----------------------------

// Validate PIN through backend API
export async function isValidPIN(pin) {
  if (!/^\d{6}$/.test(pin)) return false;

  try {
    const res = await fetch(`http://localhost:5000/api/validate-pin/${pin}`);
    const data = await res.json();
    return data.valid;
  } catch (err) {
    console.error("PIN API error:", err);
    return false;
  }
}

// Validate ZIP (USA) - Only 5 digits rule
export function isValidZIP(zip) {
  return /^[0-9]{5}$/.test(zip);
}

// Phone 10-digit
export const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

// Aadhaar 12-digit
export const isValidAadhaar = (aadhaar) => /^\d{12}$/.test(aadhaar);

// Card Number 16-digit
export const isValidCardNumber = (num) => {
  const clean = num.replace(/\s+/g, "");
  return /^\d{16}$/.test(clean);
};

// Expiry date (MM/YY)
export const isValidExpiry = (exp) => {
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp)) return false;

  const [month, year] = exp.split("/").map(Number);
  const now = new Date();
  const expiry = new Date(2000 + year, month);

  return expiry > now;
};

// CVV 3 digits
export const isValidCVV = (cvv) => /^\d{3}$/.test(cvv);

// -----------------------------
// MAIN INPUT VALIDATION
// -----------------------------
export async function validateInputs({
  shippingType,
  sourceCountry,
  zipCode,
  destinationCountry,
  pinCode,
  chooseCourier,
}) {
  const e = {};

  if (!shippingType) e.shippingType = "Please select shipping type";
  if (!sourceCountry) e.sourceCountry = "Please select source country";
  if (!isValidZIP(zipCode)) e.zipCode = "Enter valid 5-digit ZIP code";

  if (!destinationCountry)
    e.destinationCountry = "Please select destination country";

  // PIN format + backend check
  if (!/^\d{6}$/.test(pinCode)) {
    e.pinCode = "Enter valid 6-digit PIN code";
  } else {
    const valid = await isValidPIN(pinCode);
    if (!valid) e.pinCode = "Delivery to this PIN code is not available. Please use a supported PIN code.";
  }

  if (!chooseCourier)
    e.chooseCourier = "Please select a courier";

  return { valid: Object.keys(e).length === 0, errors: e };
}

// -----------------------------
// CHECKOUT VALIDATION
// -----------------------------
export async function validateCheckout({ pickup, toAddr }) {
  const e = {};

  // Pickup
  if (!pickup.name) e.pickupName = "Pickup name required";
  if (!isValidPhone(pickup.phone)) e.pickupPhone = "Enter valid phone number";
 
  if (!isValidZIP(pickup.zip)) e.pickupZip = "Valid 5-digit ZIP required";

  // To Address
  if (!toAddr.name) e.toName = "Receiver name required";
  if (!isValidPhone(toAddr.phone)) e.toPhone = "Enter valid phone number";
 
  if (!toAddr.city) e.toCity = "Receiver city required";
  if (!toAddr.state) e.toState = "Receiver state required";

  // PIN Format + backend check
  if (!/^\d{6}$/.test(toAddr.pin)) {
    e.toPin = "Valid 6-digit PIN required";
  } else {
    const valid = await isValidPIN(toAddr.pin);
    if (!valid) e.toPin = "Please enter correct PIN";
  }

  if (!isValidAadhaar(toAddr.aadhaar))
    e.aadhaar = "Valid 12-digit Aadhaar required";

  return { valid: Object.keys(e).length === 0, errors: e };
}

// -----------------------------
// PAYMENT VALIDATION
// -----------------------------
export function validatePayment({ cardNumber, name, expiry, cvv }) {
  const e = {};

  if (!isValidCardNumber(cardNumber)) {
    e.cardNumber = "Invalid card number (16 digits)";
  }

  if (!name || !name.trim()) {
    e.name = "Cardholder name is required";
  }

  if (!isValidExpiry(expiry)) {
    e.expiry = "Invalid or expired date (MM/YY)";
  }

  if (!isValidCVV(cvv)) {
    e.cvv = "Invalid CVV (3 digits)";
  }

  return { valid: Object.keys(e).length === 0, errors: e };
}
