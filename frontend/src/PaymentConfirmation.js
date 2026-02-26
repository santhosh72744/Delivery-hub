import React, { useState } from "react";
import "./PaymentConfirmation.css";

export default function PaymentConfirmation({
  shipmentId,
  onSuccess,
  onBack
}) {
  const [paymentReference, setPaymentReference] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Keep paymentDate internally
  const paymentDate = new Date().toISOString();

  const handleSubmit = async () => {
    setError("");

    const trimmedReference = paymentReference.trim();

    // Basic validation
    if (!trimmedReference || trimmedReference.length < 6) {
      setError("Please enter a valid Zelle confirmation code.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `/api/shipments/${shipmentId}/submit-payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentReference: trimmedReference,
            paymentDate
          })
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Payment submission failed.");
        setLoading(false);
        return;
      }

      setLoading(false);

      onSuccess({
        paymentReference: trimmedReference,
        paymentDate
      });

    } catch (err) {
      console.error("Payment submission error:", err);
      setError("Server error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container payment-confirmation-page">
      <div className="payment-card shadow-premium">
        <div className="payment-header">
          <div className="zelle-icon">Z</div>
          <h2 className="payment-title">Confirm Your Zelle Payment</h2>
          <p className="payment-subtitle">
            Enter the confirmation code from your Zelle receipt.
          </p>
        </div>

        <div className="payment-form">
          <div className="input-group">
            <label className="input-label">
              Zelle Confirmation Code
            </label>
            <input
              type="text"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              placeholder="Enter confirmation code from Zelle receipt"
              className="premium-input"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-message">⚠️ {error}</div>
          )}

          <div className="button-group">
            <button
              onClick={onBack}
              className="btn-secondary"
              disabled={loading}
            >
              Back
            </button>

            <button
              onClick={handleSubmit}
              className="btn-primary-3d"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Confirm Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}