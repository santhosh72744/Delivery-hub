import React, { useState } from "react";
import "./PaymentModal.css";
import zelleQR from "./images/zelle-QR.jpeg"; // ✅ CORRECT

export default function PaymentModal({ amount, onBack, onNext }) {
  const [paid, setPaid] = useState(false);

  const usdAmount = (amount / 84).toFixed(2);

  const handlePaid = () => {
    setPaid(true);
  };

  return (
    <div className="payment-step">
      {!paid ? (
        <>
          <h2 className="step-title">Payment</h2>

          {/* AMOUNT */}
          <div className="amount-box">
            <span className="amount-usd">${usdAmount} USD</span>
            <span className="amount-inr">₹{amount} INR</span>
          </div>

          {/* ZELLE PAYMENT */}
          <div className="zelle-box">
            <h3>Pay via Zelle</h3>

            <img
              src={zelleQR}
              alt="Zelle QR Code"
              className="zelle-qr"
            />

            <p>
              Zelle Email: <strong>deliveryhubca@gmail.com</strong>
            </p>

            <p className="zelle-note">
              After completing payment, click below.
            </p>
          </div>

          <div className="actions">
            <button type="button" onClick={onBack}>
              Back
            </button>

            <button className="sub" onClick={handlePaid}>
              I’ve Paid – Continue
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="step-title">✅ Payment Submitted</h2>
          <p>
            Payment of <strong>${usdAmount}</strong> received.
            <br />
            We’ll verify and proceed.
          </p>

          <div className="actions">
            <button className="sub" onClick={onNext}>
              Continue to Label
            </button>
          </div>
        </>
      )}
    </div>
  );
}
