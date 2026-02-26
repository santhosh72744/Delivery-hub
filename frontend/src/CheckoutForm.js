import React, { useState } from "react";
import "./CheckoutForm.css";
import {
  validateAndNormalizeUSPhone,
  validateAndNormalizeIndiaPhone
} from "./validations";

/* ============================================
   SMART INTERNATIONAL ADDRESS PARSER
============================================ */

function parseAddress(raw, country) {
  const text = String(raw || "").trim();

  if (!text) return { error: "Please paste address." };

  const lines = text.split(/\n|,/).map(l => l.trim()).filter(Boolean);

  if (lines.length < 3) {
    return { error: "Incomplete address. Please enter full details." };
  }

  const fullName = lines[0];

  const phoneLine = lines.find(line => {
    const digits = line.replace(/\D/g, "");
    return digits.length >= 10;
  });

  if (!phoneLine) {
    return { error: "Phone number not found." };
  }

  let phone;

  if (country === "INDIA") {
    phone = validateAndNormalizeIndiaPhone(phoneLine);
    if (!phone) {
      return { error: "Please enter valid Indian phone number." };
    }
  } else {
    phone = validateAndNormalizeUSPhone(phoneLine);
    if (!phone) {
      return { error: "Please enter valid US phone number." };
    }
  }

  let postal;

  if (country === "INDIA") {
    const matches = text.match(/\b\d{6}\b/g);
    if (!matches) {
      return { error: "Please enter valid 6-digit PIN." };
    }
    postal = matches[matches.length - 1];
  } else {
    const matches = text.match(/\b\d{5}\b/g);
    if (!matches) {
      return { error: "Please enter valid 5-digit ZIP." };
    }
    postal = matches[matches.length - 1];
  }

  const cleanedLines = lines.slice(1).filter(line => {
    const digitsOnly = line.replace(/\D/g, "");
    const isPhoneLine = digitsOnly.length >= 10;
    return !isPhoneLine;
  });

  const addressLine = cleanedLines.join(", ");

  if (addressLine.length < 5) {
    return { error: "Please enter proper street / door number." };
  }

  return {
    fullName,
    phone,
    postal,
    addressLine
  };
}

/* ============================================
              CHECKOUT FORM
============================================ */

export default function CheckoutForm({ route, onNext }) {
  const [fromRaw, setFromRaw] = useState("");
  const [toRaw, setToRaw] = useState("");

  const [fromData, setFromData] = useState(null);
  const [toData, setToData] = useState(null);

  const [error, setError] = useState("");

  const [isEditingFrom, setIsEditingFrom] = useState(false);
  const [isEditingTo, setIsEditingTo] = useState(false);

  const [tempFromData, setTempFromData] = useState(null);
  const [tempToData, setTempToData] = useState(null);

  const [fromEditError, setFromEditError] = useState("");
  const [toEditError, setToEditError] = useState("");

  const handlePreview = () => {
    setError("");

    const fromCountry = route === "US_TO_IN" ? "USA" : "INDIA";
    const toCountry = route === "US_TO_IN" ? "INDIA" : "USA";

    const parsedFrom = parseAddress(fromRaw, fromCountry);
    if (parsedFrom.error) {
      setError("From Address: " + parsedFrom.error);
      return;
    }

    const parsedTo = parseAddress(toRaw, toCountry);
    if (parsedTo.error) {
      setError("To Address: " + parsedTo.error);
      return;
    }

    setFromData(parsedFrom);
    setToData(parsedTo);
  };

  const handleContinue = () => {
    if (!fromData || !toData) {
      setError("Please preview address before continuing.");
      return;
    }

    onNext({
      fromData,
      toData
    });
  };

  /* ============================
        FROM EDIT
  ============================ */

  const handleEditFrom = () => {
    setTempFromData({ ...fromData });
    setFromEditError("");
    setIsEditingFrom(true);
  };

  const handleSaveFrom = () => {
    if (!tempFromData.phone) {
      setFromEditError("Please enter mobile number.");
      return;
    }

    const isUSRoute = route === "US_TO_IN";

    if (!tempFromData.postal) {
      setFromEditError(
        isUSRoute
          ? "Please enter ZIP code for US address."
          : "Please enter PIN number for Indian address."
      );
      return;
    }

    setFromData(tempFromData);
    setIsEditingFrom(false);
    setFromEditError("");
  };

  /* ============================
        TO EDIT
  ============================ */

  const handleEditTo = () => {
    setTempToData({ ...toData });
    setToEditError("");
    setIsEditingTo(true);
  };

  const handleSaveTo = () => {
    if (!tempToData.phone) {
      setToEditError("Please enter mobile number.");
      return;
    }

    const isUSRoute = route === "US_TO_IN";

    if (!tempToData.postal) {
      setToEditError(
        isUSRoute
          ? "Please enter PIN number for Indian address."
          : "Please enter ZIP code for US address."
      );
      return;
    }

    setToData(tempToData);
    setIsEditingTo(false);
    setToEditError("");
  };

  return (
    <div className="checkout-container">
      <h2 className="title">Enter Shipment Addresses</h2>

      <div className="parser-row">
        <div className="parser-box">
          <h3>
            {route === "US_TO_IN" ? "From (USA)" : "From (India)"}
          </h3>
          <textarea
            className="parser-input"
            placeholder="Paste full address with name, phone and postal code"
            value={fromRaw}
            onChange={(e) => setFromRaw(e.target.value)}
          />
        </div>

        <div className="parser-box">
          <h3>
            {route === "US_TO_IN" ? "To (India)" : "To (USA)"}
          </h3>
          <textarea
            className="parser-input"
            placeholder="Paste full address with name, phone and postal code"
            value={toRaw}
            onChange={(e) => setToRaw(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="btn-row">
        <button className="preview-btn" onClick={handlePreview}>
          Preview Address
        </button>

        <button
          className="submit-btn"
          onClick={handleContinue}
          disabled={isEditingFrom || isEditingTo}
        >
          Continue to Payment
        </button>
      </div>

      {fromData && toData && (
        <div className="preview-section">

          {/* FROM PREVIEW */}
          <div className="preview-box">
            <h4>
              From Address Preview{" "}
              {!isEditingFrom && (
                <button onClick={handleEditFrom}>Edit</button>
              )}
            </h4>

            {!isEditingFrom ? (
              <>
                <p><strong>Name:</strong> {fromData.fullName}</p>
                <p><strong>Phone:</strong> {fromData.phone}</p>
                <p>
                  <strong>
                    {route === "US_TO_IN" ? "ZIP Code:" : "PIN Code:"}
                  </strong>{" "}
                  {fromData.postal}
                </p>
                <p><strong>Address:</strong> {fromData.addressLine}</p>
              </>
            ) : (
              <>
                <input
                  value={tempFromData.fullName}
                  onChange={(e) =>
                    setTempFromData({
                      ...tempFromData,
                      fullName: e.target.value
                    })
                  }
                />
                <input
                  value={tempFromData.phone}
                  onChange={(e) =>
                    setTempFromData({
                      ...tempFromData,
                      phone: e.target.value
                    })
                  }
                />
                <input
                  value={tempFromData.postal}
                  onChange={(e) =>
                    setTempFromData({
                      ...tempFromData,
                      postal: e.target.value
                    })
                  }
                />
                <textarea
                  value={tempFromData.addressLine}
                  onChange={(e) =>
                    setTempFromData({
                      ...tempFromData,
                      addressLine: e.target.value
                    })
                  }
                />
                {fromEditError && (
                  <p className="error">{fromEditError}</p>
                )}
                <button className="save-btn" onClick={handleSaveFrom}>Save</button>
              </>
            )}
          </div>

          {/* TO PREVIEW */}
          <div className="preview-box">
            <h4>
              To Address Preview{" "}
              {!isEditingTo && (
                <button onClick={handleEditTo}>Edit</button>
              )}
            </h4>

            {!isEditingTo ? (
              <>
                <p><strong>Name:</strong> {toData.fullName}</p>
                <p><strong>Phone:</strong> {toData.phone}</p>
                <p>
                  <strong>
                    {route === "US_TO_IN" ? "PIN Code:" : "ZIP Code:"}
                  </strong>{" "}
                  {toData.postal}
                </p>
                <p><strong>Address:</strong> {toData.addressLine}</p>
              </>
            ) : (
              <>
                <input
                  value={tempToData.fullName}
                  onChange={(e) =>
                    setTempToData({
                      ...tempToData,
                      fullName: e.target.value
                    })
                  }
                />
                <input
                  value={tempToData.phone}
                  onChange={(e) =>
                    setTempToData({
                      ...tempToData,
                      phone: e.target.value
                    })
                  }
                />
                <input
                  value={tempToData.postal}
                  onChange={(e) =>
                    setTempToData({
                      ...tempToData,
                      postal: e.target.value
                    })
                  }
                />
                <textarea
                  value={tempToData.addressLine}
                  onChange={(e) =>
                    setTempToData({
                      ...tempToData,
                      addressLine: e.target.value
                    })
                  }
                />
                {toEditError && (
                  <p className="error">{toEditError}</p>
                )}
                <button className="save-btn" onClick={handleSaveTo}>Save</button>
              </>
            )}
          </div>

        </div>
      )}
    </div>
  );
}