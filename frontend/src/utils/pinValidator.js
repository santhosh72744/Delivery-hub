import pinData from "../data/pincodes.json";

export function isValidPIN(pin) {
  return pinData.some(item => String(item.Pincode) === String(pin));
}
