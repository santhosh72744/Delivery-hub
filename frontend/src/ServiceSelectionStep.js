import React, { useState } from "react";
import "./ServiceSelectionStep.css";

export default function ServiceSelectionStep({
  shipmentConfig,
  setShipmentConfig,
  route,
  setRoute,
  setCurrentStep,
  resetAll,
}) {
  const [routeError, setRouteError] = useState("");
  const [serviceError, setServiceError] = useState("");

  const serviceLocked = !!shipmentConfig;

  const handleContinue = (e) => {
    e.preventDefault();
    setRouteError("");
    setServiceError("");

    if (!shipmentConfig) {
      setServiceError("Please select a service.");
      return;
    }

    if (!route) {
      setRouteError("Please select route.");
      return;
    }

    setCurrentStep(2);
  };

  return (
    <div className="service-selection-wrapper">
      <form onSubmit={handleContinue} className="service-selection-card">
        <h2 className="section-title">Create Shipment</h2>

        {/* SERVICE SELECTION (ONLY IF NOT PRESELECTED) */}
        {!serviceLocked && (
          <div className="form-group">
            <label>Select Service</label>
            <select
              defaultValue=""
              onChange={(e) => {
                if (!e.target.value) return;
                setShipmentConfig(JSON.parse(e.target.value));
              }}
            >
              <option value="" disabled>
                Choose service
              </option>

              {/* Replace with dynamic services if needed */}
              <option
                value={JSON.stringify({
                  serviceId: "DH-STD",
                  deliveryLabel: "Standard Delivery",
                })}
              >
                Standard Delivery
              </option>

              <option
                value={JSON.stringify({
                  serviceId: "DH-EXP",
                  deliveryLabel: "Express Delivery",
                })}
              >
                Express Delivery
              </option>
            </select>

            {serviceError && <p className="error">{serviceError}</p>}
          </div>
        )}

        {/* LOCKED SERVICE DISPLAY */}
        {serviceLocked && (
          <div className="form-group">
            <label>Selected Service</label>
            <input
              value={`${shipmentConfig?.serviceId} – ${shipmentConfig?.deliveryLabel}`}
              disabled
            />
          </div>
        )}

        {/* ROUTE SELECTION */}
        <div className="route-selector">
          <button
            type="button"
            className={route === "US_TO_IN" ? "route-btn active" : "route-btn"}
            onClick={() => {
              setRoute("US_TO_IN");
              setRouteError("");
            }}
          >
            USA → India
          </button>

          <button
            type="button"
            className={route === "IN_TO_US" ? "route-btn active" : "route-btn"}
            onClick={() => {
              setRoute("IN_TO_US");
              setRouteError("");
            }}
          >
            India → USA
          </button>
        </div>

        {routeError && <p className="error">{routeError}</p>}

        {/* CONTINUE BUTTON */}
        <button type="submit" className="btn-primary continue-btn">
          Continue to Address
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
