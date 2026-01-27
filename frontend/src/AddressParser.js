import React, { useState } from "react";
import "./AddressParser.css";


const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir",
  "Ladakh","Lakshadweep","Puducherry"
];


const normalize = (s) => s.replace(/\s+/g, " ").trim();
const extractPIN = (t) => (t.match(/\b\d{6}\b/g) || []).pop() || "";
const extractPhone = (t) => {
  const re = /(?:\+91[\s-]*)?0?([6-9]\d{9})\b/g;
  let m, last = "";
  while ((m = re.exec(t))) last = m[1];
  return last || "";
};
const extractCareOf = (t) =>
  (t.match(/\b(?:c\/o|care\s*of|s\/o|w\/o|d\/o)\s*[:\-]?\s*([^\n,]+)/i) || [])[1] || "";
const extractLandmark = (t) =>
  (t.match(/\b(?:landmark|near|opp|opposite|beside|behind)\s*[:\-]?\s*([^\n,]+)/i) || [])[1] || "";
const extractState = (t) =>
  STATES.find((st) => new RegExp(`\\b${st.replace(/\s/g, "\\s+")}\\b`, "i").test(t)) || "";
const extractCity = (t) => {
  const m = t.match(/\bcity\s*[:\-]\s*([A-Za-z.\s'-]{1,40})\b/i);
  return m ? normalize(m[1]) : "";
};
const guessName = (t) => {
  const lines = t.split(/\n|,/).map(normalize).filter(Boolean);
  const bad = /^(to|attn|address|flat|apartment|house|no\.?|door|street|st\.?|road|rd\.?|area|layout|block|sector|lane|near|landmark|c\/o|care|s\/o|w\/o|d\/o|city)\b/i;
  for (const line of lines) {
    if (!/\d{3,}/.test(line) && !bad.test(line) && line.split(" ").length <= 6) {
      const cleaned = line.replace(/[^a-zA-Z.\-\s]/g, "").replace(/\s+/g, " ").trim();
      if (cleaned) return cleaned;
    }
  }
  return "";
};
const splitName = (full) => {
  const parts = full.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts.slice(0, -1).join(" "), lastName: parts.at(-1) };
};


const removeSegments = (t, segs) => {
  let out = t;
  segs.filter(Boolean).forEach((s) => {
    const esc = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(esc, "ig"), " ");
  });
 
  out = out.replace(/[\s,.:;\-]+/g, " ");
  return normalize(out);
};


const parseIndianAddress = (raw) => {
  const input = String(raw || "").trim();
  const phone = extractPhone(input);
  const pin = extractPIN(input);
  const careOf = extractCareOf(input);
  const state = extractState(input);
  const landmark = extractLandmark(input);
  const city = extractCity(input);
  const fullName = guessName(input);
  const { firstName, lastName } = splitName(fullName);

 
  let unmapped = removeSegments(input, [
    phone, pin, careOf, state, landmark, fullName, city, "city", "phone"
  ]);
  unmapped = unmapped.replace(/^[,.:;\s-]+|[,.:;\s-]+$/g, "");

  return {
    firstName,
    lastName,
    phoneNumber: phone,
    pinCode: pin,
    state,
    city,
    landmark,
    careOf,
    unmappedText: unmapped 
  };
};


export default function AddressParser({ label = "Enter Address", onParsed }) {
  const [text, setText] = useState("");

  const handleParse = () => {
    if (!text.trim()) return;
    const parsedData = parseIndianAddress(text);
    if (onParsed) onParsed(parsedData);
  };

  const handleClear = () => {
    setText("");
    if (onParsed) onParsed({});
  };

  return (
    <section className="address-parser" style={{ flex: 1, marginRight: "10px" }}>
      <h2>{label}</h2>
      <textarea
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste address here"
        style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 6 }}
      />
      <div style={{ marginTop: 8 }}>
        <button type="button" onClick={handleParse}>Parse</button>
        <button type="button" onClick={handleClear} style={{ marginLeft: 8 }}>Clear</button>
      </div>
    </section>
  );
}
