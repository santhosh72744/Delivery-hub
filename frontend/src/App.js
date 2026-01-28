import React, { useState, useEffect } from "react";
import "./App.css";

import CheckoutForm from "./CheckoutForm";
import PaymentModal from "./PaymentModal";
import ShippingLabel from "./ShippingLabel";
import StepNavigator from "./stepNavigator";
import { validateInputs } from "./validations";
import HeroCarousel from "./HeroCarousel";
import Footer from "./Footer";
import ServiceBlocks from "./ServiceBlocks";
import ServiceModal from "./ServiceModal";
import logo from "./assets/logo.jpeg";


function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showEstimate, setShowEstimate] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // fast | normal | air | sea
  const [shippingType, setShippingType] = useState("fast");
  const [sourceCountry] = useState("USA");
  const [zipCode, setZipCode] = useState("");
  const [destinationCountry] = useState("india");
  const [pinCode, setPinCode] = useState("");

  const [chooseCourier] = useState("fedex");
  const [details, setDetails] = useState(null);

  
  const [modalOpen, setModalOpen] = useState(false);

  const [pickup, setPickup] = useState({
    name: "",
    phone: "",
    address1: "",
    city: "",
    state: "",
    zip: "",
  });

  const [toAddr, setToAddr] = useState({
    name: "",
    phone: "",
    address1: "",
    city: "",
    state: "",
    pin: "",
    aadhaar: "",
  });

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const [trackingNumber, setTrackingNumber] = useState("");
  const [paymentRef, setPaymentRef] = useState("");


  const supportedPins = [
    { city: "New Delhi", range: "110001 – 110097" },
    { city: "Mumbai", range: "400001 – 400014" },
    { city: "Navi Mumbai", range: "400601 – 400708" },
    { city: "Bengaluru", range: "560001 – 560105" },
    { city: "Chennai", range: "600001 – 600127" },
    { city: "Kolkata", range: "700001 – 700156" },
    { city: "Hyderabad", range: "500001 – 500096" },
    { city: "Ahmedabad", range: "380001 – 382481" },
    { city: "Pune", range: "411001 – 411062" },
    { city: "Surat", range: "394000 – 395999" },
    { city: "Jaipur", range: "302001 – 302039" },
    { city: "Visakhapatnam", range: "530001" },
  ];


  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("docshipData"));
      if (!saved) return;

      setCurrentStep(saved.currentStep || 1);
      setShippingType(saved.shippingType || "fast");
      setZipCode(saved.zipCode || "");
      setPinCode(saved.pinCode || "");
      setPickup(saved.pickup || pickup);
      setToAddr(saved.toAddr || toAddr);
      setPaymentForm(saved.paymentForm || paymentForm);
      setDetails(saved.details || null);
      setTrackingNumber(saved.trackingNumber || "");
      setPaymentRef(saved.paymentRef || "");
    } catch {}
  }, []);


  useEffect(() => {
    localStorage.setItem(
      "docshipData",
      JSON.stringify({
        currentStep,
        shippingType,
        zipCode,
        pinCode,
        pickup,
        toAddr,
        paymentForm,
        details,
        trackingNumber,
        paymentRef,
      })
    );
  }, [
    currentStep,
    shippingType,
    zipCode,
    pinCode,
    pickup,
    toAddr,
    paymentForm,
    details,
    trackingNumber,
    paymentRef,
  ]);

  const resetAll = () => {
    localStorage.removeItem("docshipData");
    window.location.reload();
  };

  const clearEstimation = () => {
    setDetails(null);
    setZipCode("");
    setPinCode("");
    setCurrentStep(1);
    setShowEstimate(false);
  };

  const validate = async () => {
    const { valid } = await validateInputs({
      shippingType,
      sourceCountry,
      zipCode,
      destinationCountry,
      pinCode,
      chooseCourier,
    });
    return valid;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(await validate())) return;

    let usd = 0;
    let days = 0;

    if (shippingType === "fast") {
      usd = 65;
      days = 5;
    } else if (shippingType === "normal") {
      usd = 55;
      days = 10;
    } else if (shippingType === "air") {
      usd = 10;
      days = 20;
    } else if (shippingType === "sea") {
      usd = 180;
      days = 120;
    }

    const inr = usd * 84;
    setDetails({ usd, inr, days });
  };

  const handlePaymentNext = async () => {
    setCurrentStep(4);
  };

  return (
    <>
      <header className="page-header">
  <div className="header-content">
    <img src={logo} alt="Delivery Hub Logo" className="app-logo" />
    <span className="app-title">DeliveryHub</span>
  </div>
</header>


      <HeroCarousel onStart={() => setShowEstimate(true)} />

      
      {!showEstimate && !selectedService && (
        <ServiceBlocks onCreateShipment={setSelectedService} />
      )}

      
      {selectedService && (
        <ServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onCreate={(type) => {
            setSelectedService(null);
            setShippingType(type);
            setShowEstimate(true);
          }}
        />
      )}

      
      {showEstimate && (
  <StepNavigator
    currentStep={currentStep}
    onStepClick={setCurrentStep}
    onHome={() => {
      setShowEstimate(false);
      setSelectedService(null);
      setCurrentStep(1);
      setDetails(null);
      setZipCode("");
      setPinCode("");
    }}
  />
)}


      
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>Supported PIN Codes</h2>
            <ul className="pin-list">
              {supportedPins.map((item) => (
                <li key={item.city}>
                  <strong>{item.city}:</strong> {item.range}
                </li>
              ))}
            </ul>
            <button
              className="modal-close-btn"
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

    
      <div className="doc" id="estimate">
        {showEstimate && currentStep === 1 && (
          <div className="estimate-container">
            <form onSubmit={handleSubmit} className="estimate-left">
              <h2 className="section-title">Delivery Hub</h2>

              <div className="form-grid">
                <div>
                  <label>Delivery Type</label>
                  <select
                    value={shippingType}
                    onChange={(e) => setShippingType(e.target.value)}
                  >
                    <option value="fast">Fast Delivery</option>
                    <option value="normal">Normal Delivery</option>
                    <option value="air">Air Cargo</option>
                    <option value="sea">Sea Cargo</option>
                  </select>
                </div>

                <div>
                  <label>Zip Code</label>
                 <input
  value={zipCode}
  onChange={(e) =>
    /^\d{0,5}$/.test(e.target.value) &&
    setZipCode(e.target.value)
  }
  placeholder="5-digit ZIP"
/>

                </div>

                <div>
                  <label>
                    Pin Code
                    <span
                      onClick={() => setModalOpen(true)}
                      style={{
                        marginLeft: 10,
                        color: "#584fd9",
                        cursor: "pointer",
                        fontSize: 13,
                        textDecoration: "underline",
                      }}
                    >
                      Supported PIN codes
                    </span>
                  </label>
                  <input
  value={pinCode}
  onChange={(e) =>
    /^\d{0,6}$/.test(e.target.value) &&
    setPinCode(e.target.value)
  }
  placeholder="6-digit PIN"
/>

                </div>
              </div>

              <button type="submit" className="get-est-btn">
                Get Estimate
              </button>
            </form>

            {details && (
              <div className="estimate-right">
                <h3>Shipment Estimation</h3>
                <p>Delivery: {details.days} days</p>
                <p>${details.usd} / ₹{details.inr}</p>

                <button onClick={() => setCurrentStep(2)}>
                  Confirm & Continue
                </button>

                <button onClick={clearEstimation}>
                  Start New Estimation
                </button>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <CheckoutForm
            pickup={pickup}
            setPickup={setPickup}
            toAddr={toAddr}
            setToAddr={setToAddr}
            onNext={() => setCurrentStep(3)}
          />
        )}

        {currentStep === 3 && (
          <PaymentModal
            amount={details?.inr}
            form={paymentForm}
            setForm={setPaymentForm}
            onBack={() => setCurrentStep(2)}
            onNext={handlePaymentNext}
          />
        )}

        {currentStep === 4 && (
          <ShippingLabel
            amount={details?.inr}
            courier="FedEx"
            pickup={pickup}
            toAddr={toAddr}
            details={{ trackingNumber, paymentRef }}
            onFinish={resetAll}
          />
        )}
      </div>

      <Footer />
    </>
  );
}

export default App;
