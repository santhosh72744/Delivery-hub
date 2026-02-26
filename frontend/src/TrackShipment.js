import React, { useState, useEffect } from "react";
import "./TrackShipment.css";

export default function TrackShipment({ onClose, prefillReference }) {
  const [reference, setReference] = useState(prefillReference || "");
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNotFound, setShowNotFound] = useState(false);

const steps = [
  "Shipment Created",
  "Verified",
  "Label Generated",
  "In Transit",
  "Delivered",
  "Closed"
];

 const getActiveStep = (status) => {
  switch (status) {
    case "NEW":
      return 0;
    case "VERIFIED":
      return 1;
    case "LABEL_GENERATED":
      return 2;
    case "IN_TRANSIT":
      return 3;
    case "DELIVERED":
      return 4;
    case "FEEDBACK_PENDING":
      return 4; // still delivered but waiting feedback
    case "CLOSED":
      return 5;
    default:
      return 0;
  }
}; 

  const formatRoute = (route) => {
    if (route === "US_TO_IN") return "USA → India";
    if (route === "IN_TO_US") return "India → USA";
    return route;
  };

  const autoTrack = async (ref) => {
  if (!ref) return;

  try {
    setLoading(true);
    setShipment(null);
    setShowNotFound(false);

    const res = await fetch(`/api/track/${ref}`);
    const data = await res.json();

    if (!res.ok || !data.success) {
      setShowNotFound(true);
      setLoading(false);
      return;
    }

    setShipment(data.shipment);
    setLoading(false);

  } catch (err) {
    console.error("Tracking error:", err);
    setLoading(false);
    setShowNotFound(true);
  }
};

  const handleTrack = async () => {
    if (!reference.trim()) return;

    try {
      setLoading(true);
      setShipment(null);
      setShowNotFound(false);

      const res = await fetch(`/api/track/${reference.trim()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setShowNotFound(true);
        setLoading(false);
        return;
      }

      setShipment(data.shipment);
      setLoading(false);

    } catch (err) {
      console.error("Tracking error:", err);
      setLoading(false);
      setShowNotFound(true);
    }
  };

 useEffect(() => {
  if (prefillReference) {
    setReference(prefillReference);
    autoTrack(prefillReference);
  } else {
    setReference("");
    setShipment(null);
    setShowNotFound(false);
  }
}, [prefillReference]);

  return (
    <div className="track-section">

      <button onClick={onClose} className="track-close-btn">
        Close
      </button>

      <h2>Track Your Shipment</h2>
      <p className="track-subtitle">
        Real-time updates for your international cargo
      </p>

      <div className="search-container">
        <input
          className="track-input"
          type="text"
          placeholder="Enter Reference Code"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />
        <button
          className="track-btn"
          onClick={handleTrack}
          disabled={loading}
        >
          {loading ? "Tracking..." : "Track"}
        </button>
      </div>

      {shipment && (
        <div className="tracking-result">

          <div className="tracking-header">
            <h3>Reference: {shipment.reference_code}</h3>
            <p className="route-info">
              Route: {formatRoute(shipment.route)}
            </p>
          </div>

          <div className="timeline-container">

            <div className="timeline-line-bg"></div>

            <div
              className="timeline-line-progress"
              style={{
                width: `${
                  (getActiveStep(shipment.workflow_status) / (steps.length - 1)) * 100
                }%`
              }}
            ></div>

            <div className="timeline-steps">
             {steps.map((step, index) => {
  const activeIndex = getActiveStep(shipment.workflow_status);
  const isCompleted = index <= activeIndex;
  const isCurrent = index === activeIndex; // Check if this is exactly the current status

  return (
    <div 
      key={index} 
      className={`timeline-step ${isCurrent ? "active-step" : ""}`}
    >
      <div className={`timeline-circle ${isCompleted ? "completed" : ""}`}>
        {/* The CSS handle the rest! */}
      </div>
      <div className={`timeline-label ${isCompleted ? "active-label" : ""}`}>
        {step}
      </div>
    </div>
  );
})}
            </div>

          </div>
        </div>
      )}

      {showNotFound && (
        <div className="error-overlay">
          <div className="error-modal">
            <h3>Shipment Not Found</h3>
            <p>
              There is no shipment with reference ID{" "}
              <strong>{reference}</strong>.
            </p>
            <button onClick={() => setShowNotFound(false)}>
              Try Again
            </button>
          </div>
        </div>
      )}

    </div>
  );
}