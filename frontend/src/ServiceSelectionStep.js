import React, { useState } from "react";
import "./ServiceSelectionStep.css";

export default function ServiceSelectionStep({
  services = [],
  shipmentConfig,
  setShipmentConfig,
  route,
  setRoute,
  resetAll,
  onServiceConfirm,
  mode,   // 🔥 NEW PROP
}) {
  const [routeError, setRouteError] = useState("");
  const [serviceError, setServiceError] = useState("");

  const serviceLocked = !!shipmentConfig;

  const handleContinue = (e) => {
  e.preventDefault();
  setRouteError("");
  setServiceError("");

  if (mode === "service") {
    if (!shipmentConfig) {
      setServiceError("Please select a service.");
      return;
    }
    onServiceConfirm(shipmentConfig);
    return;
  }

  if (mode === "route") {
    if (!route) {
      setRouteError("Please select route.");
      return;
    }
    onServiceConfirm();
  }
};

  return (
    <div className="service-selection-wrapper">
      <form onSubmit={handleContinue} className="service-selection-card">
        <h2 className="section-title">Create Shipment</h2>

        {/* SERVICE SELECTION (ONLY IF NOT PRESELECTED) */}
       {mode === "service" && (
  <div className="form-group">
    <label>Select Service</label>

    <select
      value={shipmentConfig?.id || ""}
      onChange={(e) => {
        const selected = services.find(
          (s) => s.id === e.target.value
        );
        setShipmentConfig(selected || null);
      }}
    >
      <option value="" disabled>
        Choose service
      </option>

      {services.map((service) => (
        <option key={service.id} value={service.id}>
          {service.title}
        </option>
      ))}
    </select>

    {serviceError && <p className="error">{serviceError}</p>}
  </div>
)}

        {/* LOCKED SERVICE DISPLAY */}
        {serviceLocked && (
          <div className="form-group">
            <label>Selected Service</label>
            <input value={shipmentConfig?.title || ""} disabled />
          </div>
        )}

        {/* ROUTE SELECTION (ONLY AFTER SERVICE DETAILS CONFIRMED) */}
{mode === "route" && (
  <>
    <h3 style={{ marginBottom: "20px" }}>Select Route</h3>

    <div className="route-selector">
      <button
        type="button"
        className={
          route === "US_TO_IN" ? "route-btn active" : "route-btn"
        }
        onClick={() => {
          setRoute("US_TO_IN");
          setRouteError("");
        }}
      >
        USA → India
      </button>

      <button
        type="button"
        className={
          route === "IN_TO_US" ? "route-btn active" : "route-btn"
        }
        onClick={() => {
          setRoute("IN_TO_US");
          setRouteError("");
        }}
      >
        India → USA
      </button>
    </div>

    {routeError && <p className="error">{routeError}</p>}
  </>
)}

        {/* CONTINUE BUTTON */}
        <button type="submit" className="btn-primary continue-btn">
          Continue
        </button>

        {/* RESET BUTTON */}
        <button
          type="button"
          className="btn-secondary"
          onClick={resetAll}
        >
          Start Over
        </button>
      </form>
    </div>
  );
}