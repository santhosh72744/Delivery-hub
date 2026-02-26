import React from "react";
import "./StepNavigator.css";

export default function StepNavigator({
  currentStep,
  onStepClick,
  onHome,
}) {
  const steps = [
    { id: 1, label: "Shipment" },
    { id: 2, label: "Shipment Details" },
    { id: 3, label: "Payment" },
  ];

  return (
    <div className="step-nav">
    
      <div className="step-wrapper">
  <div
    className="step-btn clickable"
    onClick={onHome}
  >
     Home
  </div>
  <span className="step-arrow">›</span>
</div>


      {steps.map((step, index) => (
        <div key={step.id} className="step-wrapper">
          <div
            className={`step-btn 
              ${currentStep === step.id ? "active" : ""}
              ${step.id < currentStep ? "clickable" : ""}
            `}
            onClick={() => {
              if (step.id < currentStep) onStepClick(step.id);
            }}
          >
            <span>{step.label}</span>
          </div>

          {index < steps.length - 1 && (
            <span className="step-arrow">›</span>
          )}
        </div>
      ))}
    </div>
  );
}
