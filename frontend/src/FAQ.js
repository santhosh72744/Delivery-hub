import React, { useState } from "react";
import "./FAQ.css";

const faqs = [
  {
    q: "How long does delivery take from USA to India?",
    a: "Delivery time depends on the service you choose. Fast delivery takes 3–5 days, Normal delivery takes 7–10 days, Air Cargo takes around 20 days, and Sea Cargo can take up to 3–4 months."
  },
  {
    q: "What items can I send through DeliveryHub?",
    a: "You can send documents such as passports, certificates, legal papers, university documents, and also parcels depending on the selected service."
  },
  {
    q: "Which courier does DeliveryHub use?",
    a: "DeliveryHub currently uses FedEx for reliable international delivery from USA to India."
  },
  {
    q: "How is the shipping cost calculated?",
    a: "Shipping cost is calculated based on the delivery type, route, and service selected. The price and delivery time are shown instantly before confirmation."
  },
  {
    q: "What payment methods are supported?",
    a: "We currently support Zelle QR-based payment for fast and secure transactions."
  },
  {
    q: "Is Zelle payment safe?",
    a: "Yes. Zelle is a secure bank-to-bank payment method. Once payment is confirmed, your shipment is processed immediately."
  },
  {
    q: "What if my PIN code is not supported?",
    a: "If your destination PIN code is not supported, the shipment cannot be processed. You can check supported PIN codes using the link provided on the form."
  },
  {
    q: "Can I change shipment details after payment?",
    a: "No. Once payment is completed, shipment details cannot be modified. Please verify all details before confirming payment."
  },
  {
    q: "When will I receive my shipping label?",
    a: "Your shipping label is generated immediately after successful payment and can be downloaded instantly."
  },
  {
    q: "How can I track my shipment?",
    a: "A unique tracking number is generated for every shipment. You can use this number to track your shipment through the courier."
  }
];

export default function FAQ({ onClose }) {

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="faq-container">
      <h2 className="faq-title">Frequently Asked Questions</h2>

      {faqs.map((item, index) => (
        <div className="faq-item" key={index}>
          <div
            className="faq-question"
            onClick={() =>
              setOpenIndex(openIndex === index ? null : index)
            }
          >
            {item.q}
            <span>{openIndex === index ? "−" : "+"}</span>
          </div>

          {openIndex === index && (
            <div className="faq-answer">{item.a}</div>
          )}
        </div>
      ))}

      {/* ✅ ADD THIS */}
      <div className="faq-back">
        <button className="faq-back-btn" onClick={onClose}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
