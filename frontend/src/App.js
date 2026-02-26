import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import Header from "./Header";
import CheckoutForm from "./CheckoutForm";
import PaymentModal from "./PaymentModal";
import StepNavigator from "./stepNavigator";
import HeroCarousel from "./HeroCarousel";
import Footer from "./Footer";
import ServiceBlocks from "./ServiceBlocks";
import ServiceDetailsStep from "./ServiceDetailsStep";
import ServiceSelectionStep from "./ServiceSelectionStep";
import FAQ from "./FAQ";
import PaymentConfirmation from "./PaymentConfirmation";
import TrackShipment from "./TrackShipment";
import AdminApp from "./AdminApp";

function App() {
  const path = window.location.pathname;

if (path.startsWith("/admin")) {
  return <AdminApp />;
}
  const [showEstimate, setShowEstimate] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [selectedService, setSelectedService] = useState(null);
  const [shipmentConfig, setShipmentConfig] = useState(null);

  const [finalAmount, setFinalAmount] = useState(null);
  const [route, setRoute] = useState("US_TO_IN");
  const [showTrackPage, setShowTrackPage] = useState(false);
 
  const [trackPrefill, setTrackPrefill] = useState("");

  // Backend Shipment State
  const [shipmentId, setShipmentId] = useState(null);
  const [referenceCode, setReferenceCode] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [showFAQ, setShowFAQ] = useState(false);

  const dynamicBlockRef = useRef(null);

  const resetAll = () => {
  setShowTrackPage(false);
setTrackPrefill("");
setRoute("US_TO_IN");
  setShowEstimate(false);
  setCurrentStep(1);
  setSelectedService(null);
  setShipmentConfig(null);
  setFinalAmount(null);
  setRoute(null);
  setShipmentId(null);
  setReferenceCode(null);
  setPaymentInfo(null);
};

  // ✅ Scroll only to the block that just appeared
 useEffect(() => {
  if (!dynamicBlockRef.current) return;

  const element = dynamicBlockRef.current;
  const rect = element.getBoundingClientRect();

  const headerOffset = 80; // adjust if your header height is different
  const isAbove = rect.top < headerOffset;
  const isBelow = rect.bottom > window.innerHeight;

  if (isAbove || isBelow) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
}, [currentStep, selectedService]);

useEffect(() => {
  if (currentStep >= 3 && !shipmentId) {
    setCurrentStep(1);
  }
}, [currentStep, shipmentId]);

useEffect(() => {
  if (currentStep === 5 && !paymentInfo) {
    setCurrentStep(3);
  }
}, [currentStep, paymentInfo]);


useEffect(() => {
  if (showTrackPage) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}, [showTrackPage]);

  return (
    <>
      <Header 
  onHome={resetAll}
  onTrack={() => {
    setShowTrackPage(true);
    setShowEstimate(false);
  }}
/>

{showTrackPage && (
  <TrackShipment
    prefillReference={trackPrefill}
    onClose={() => setShowTrackPage(false)}
  />
)}

      <HeroCarousel
        onStart={() => {
          setShowEstimate(true);
          setCurrentStep(1);
        }}
      />

      {!showEstimate && !selectedService && (
        <section id="services">
          <ServiceBlocks onCreateShipment={setSelectedService} />
        </section>
      )}

      {/* SERVICE DETAILS PAGE */}
      {selectedService && (
        <div ref={dynamicBlockRef}>
          <ServiceDetailsStep
            service={selectedService}
            onBack={() => setSelectedService(null)}
            onNext={(config) => {
              setShipmentConfig(config);

              const lockedAmount =
                config.pricing.unitPrice * config.pricing.quantity;

              setFinalAmount(lockedAmount);

              setSelectedService(null);
              setShowEstimate(true);
              setCurrentStep(1);
            }}
          />
        </div>
      )}

     {showEstimate && currentStep <= 3 && (
  <StepNavigator
    currentStep={currentStep}
    onStepClick={setCurrentStep}
    onHome={resetAll}
  />
)}

      {/* STEP 1 – Route Selection */}
      {showEstimate && currentStep === 1 && (
        <div ref={dynamicBlockRef}>
          <ServiceSelectionStep
            shipmentConfig={shipmentConfig}
            route={route}
            setRoute={setRoute}
            setCurrentStep={setCurrentStep}
            resetAll={resetAll}
          />
        </div>
      )}

      {/* STEP 2 – Checkout */}
      {showEstimate && currentStep === 2 && (
        <div ref={dynamicBlockRef}>
          <CheckoutForm
  route={route}
  onNext={async ({ fromData, toData }) => {
              try {
                const res = await fetch("/api/shipments", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
   body: JSON.stringify({
  route,
  serviceId: shipmentConfig.serviceId,
  deliveryTier: shipmentConfig.deliveryTier,
  quantity: shipmentConfig.pricing.quantity,
 senderAddress: fromData,
receiverAddress: toData,
}),
                });

                const data = await res.json();

               if (data.success) {
  setShipmentId(data.shipmentId);
  setReferenceCode(data.referenceCode);
  setFinalAmount(data.finalAmount); // 🔥 use backend amount
  setCurrentStep(3);
} else {
                  alert("Shipment creation failed.");
                }
              } catch (err) {
                console.error(err);
                alert("Server error while creating shipment.");
              }
            }}
          />
        </div>
      )}

      {/* STEP 3 – Payment */}
{showEstimate &&
  currentStep === 3 &&
  finalAmount &&
  shipmentId &&
  referenceCode && (
    <div ref={dynamicBlockRef}>
      <PaymentModal
        amount={finalAmount}
        shipmentId={shipmentId}
        referenceCode={referenceCode}
        onBack={() => setCurrentStep(2)}
        onNext={() => setCurrentStep(4)}   
      />
    </div>
)}

{showEstimate &&
  currentStep === 4 &&
  shipmentId &&
  !paymentInfo && (
    <div ref={dynamicBlockRef}>
      <PaymentConfirmation
        shipmentId={shipmentId}
        onSuccess={(info) => {
  setPaymentInfo(info);
  setCurrentStep(5);
}}
        onBack={() => setCurrentStep(3)}
      />
    </div>
)}

{showEstimate &&
  currentStep === 5 &&
  paymentInfo && (
    <div ref={dynamicBlockRef}>
      <div className="checkout-container">
        <h2 className="title">Payment Submitted Successfully</h2>

        <div className="preview-box" style={{ maxWidth: 600, margin: "0 auto" }}>
          <h4>Shipment Details</h4>
          <p><strong>Reference Code:</strong> {referenceCode}</p>
          <p><strong>Amount Paid:</strong> ${finalAmount} USD</p>

          <hr style={{ margin: "20px 0" }} />

          <h4>Payment Details</h4>
          <p><strong>Transaction ID:</strong> {paymentInfo.paymentReference}</p>
          
          <p><strong>Submitted On:</strong> {new Date(paymentInfo.paymentDate).toLocaleString()}</p>
          <hr style={{ margin: "20px 0" }} />

          <h4>Status</h4>
          <p>Your payment is under manual verification.</p>
          <p>Verification typically takes 1–4 hours during business hours.</p>
          <p>You will receive your shipping label via WhatsApp once verified.</p>
        </div>

      <div className="reference-save-card" style={{
  marginTop: 40,
  padding: "30px",
  borderRadius: "24px",
  background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
  border: "1px solid #e2e8f0",
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
  textAlign: "left"
}}>
  <div style={{ marginBottom: "20px" }}>
    <h4 style={{ 
      margin: 0, 
      fontSize: "1.1rem", 
      fontWeight: "800", 
      color: "#1e293b",
      letterSpacing: "-0.02em" 
    }}>
      Save Your Reference Code
    </h4>
    <p style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "4px" }}>
      Use this ID to track your cargo in real-time.
    </p>
  </div>

  <div style={{
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    alignItems: "center"
  }}>
    <div style={{ position: "relative", flex: "1", minWidth: "280px" }}>
      <input
        value={referenceCode}
        readOnly
        style={{
          width: "100%",
          padding: "14px 18px",
          borderRadius: "14px",
          border: "2px solid #f1f5f9",
          background: "#ffffff",
          fontSize: "1rem",
          fontWeight: "700",
          color: "#6366f1",
          outline: "none",
          boxSizing: "border-box",
          letterSpacing: "0.05em"
        }}
      />
    </div>

    <button
      onClick={() => {
        navigator.clipboard.writeText(referenceCode);
        // You can replace this alert with a toast notification for a better feel
        alert("Reference copied!");
      }}
      style={{
        padding: "14px 24px",
        borderRadius: "14px",
        border: "1px solid #e2e8f0",
        background: "#ffffff",
        fontWeight: "700",
        color: "#475569",
        cursor: "pointer",
        transition: "all 0.2s ease",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}
      onMouseOver={(e) => e.currentTarget.style.background = "#f8fafc"}
      onMouseOut={(e) => e.currentTarget.style.background = "#ffffff"}
    >
      Copy
    </button>

    <button
      onClick={() => {
        setTrackPrefill(referenceCode);
        setShowTrackPage(true);
      }}
      style={{
        padding: "14px 28px",
        borderRadius: "14px",
        border: "none",
        background: "#1e293b",
        fontWeight: "700",
        color: "#ffffff",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 12px rgba(30, 41, 59, 0.2)"
      }}
      onMouseOver={(e) => e.currentTarget.style.background = "#6366f1"}
      onMouseOut={(e) => e.currentTarget.style.background = "#1e293b"}
    >
      Track Shipment Now
    </button>
  </div>
</div>

        <button
          className="submit-btn"
          style={{ marginTop: 25 }}
          onClick={resetAll}
        >
          Start New Shipment
        </button>
      </div>
    </div>
)}


      <section id="help">
        {!showFAQ ? (
          <div className="faq-cta">
            <h3>Need Help?</h3>
            <p>
              Find answers about shipping, pricing, payments, supported PIN
              codes, and tracking.
            </p>
            <button
              className="faq-btn"
              onClick={() => setShowFAQ(true)}
            >
              Visit FAQ
            </button>
          </div>
        ) : (
          <FAQ onClose={() => setShowFAQ(false)} />
        )}
      </section>

      <section id="contact">
        <Footer />
      </section>
    </>
  );
}

export default App;
