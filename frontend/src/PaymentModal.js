import React, { useState } from "react";
import "./PaymentModal.css";
import zelleQR from "./images/zelle-QR.jpeg";

export default function PaymentModal({
  amount,
  referenceCode,
  onBack,
  onNext,
}) {
  const [clicked, setClicked] = useState(false);

  const handleContinue = () => {
    if (clicked) return; // prevent double click
    setClicked(true);
    onNext();
  };

  return (
    <div className="payment-step">
      <h2 className="step-title">Secure Payment</h2>

      <div className="amount-box">
        <span className="amount-label">Total Amount</span>
        <span className="amount-usd">
          ${Number(amount).toFixed(2)} USD
        </span>
      </div>

      <div className="zelle-box">
        <h3>Pay via Zelle</h3>

        <img
          src={zelleQR}
          alt="Zelle QR Code"
          className="zelle-qr"
        />

        <div className="payment-details">
          <p>
            <strong>Zelle Email:</strong> deliveryhubca@gmail.com
          </p>

          <p>
            <strong> Reference Code:</strong> {referenceCode}
          </p>

         

        

          <p className="zelle-note">
            After completing the transfer in your banking app,
            click below to confirm your payment details.
          </p>
        </div>
      </div>

      <div className="actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={onBack}
          disabled={clicked}
        >
          Back
        </button>

        <button
          className="btn-primary-3d"
          onClick={handleContinue}
          disabled={clicked}
        >
          I’ve Paid – Continue
        </button>
      </div>
    </div>
  );
}