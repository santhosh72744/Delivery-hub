import React from "react";
import "./ServiceModal.css"; 

const SERVICE_DETAILS = {
  documents: {
    id: "documents",
    title: "Document Services",
    tagline: "Secure & Certified Courier",
    description: "Specialized handling for high-priority legal, academic, and personal identification papers with end-to-end tracking.",
    delivery: [
      { label: "Express Shipping", value: "3–5 Business Days", price: "$65", icon: "🚀" },
      { label: "Standard Shipping", value: "7–10 Business Days", price: "$55", icon: "📦" },
    ],
    points: ["Passports & ID Cards", "University Transcripts", "Legal Contracts & Deeds", "Bank Statements"],
    shippingType: "fast",
  },
  parcels: {
    id: "parcels",
    title: "Parcel Delivery",
    tagline: "Door-to-Door Reliability",
    description: "Global shipping for personal belongings, gifts, and small inventory with real-time status updates.",
    delivery: [
      { label: "Air Priority", value: "5–7 Business Days", price: "Market Rate", icon: "✈️" },
      { label: "Standard Parcel", value: "10–14 Business Days", price: "Weight Based", icon: "🚚" },
    ],
    points: ["Personal Items & Clothes", "Electronic Gadgets", "E-commerce Returns", "Care Packages"],
    shippingType: "normal",
  },
  air: {
    id: "air",
    title: "Air Cargo",
    tagline: "Bulk Business Logistics",
    description: "Heavy-duty air freight solutions for commercial goods, machinery, and medium-to-large cargo shipments.",
    delivery: [
      { label: "Priority Freight", value: "12–15 Days", price: "$12/lb", icon: "🛩️" },
      { label: "Economy Air", value: "20–25 Days", price: "$10/lb", icon: "☁️" },
    ],
    points: ["Commercial Inventory", "Medium Cargo Boxes", "Palletized Shipments", "Industrial Parts"],
    shippingType: "air",
  },
  sea: {
    id: "sea",
    title: "Sea Cargo",
    tagline: "Economical Ocean Freight",
    description: "The most cost-effective solution for massive shipments, relocations, and bulk commercial containers.",
    delivery: [
      { label: "Standard Container", value: "3–4 Months", price: "$150/Box", icon: "🚢" },
      { label: "LCL (Less than Container)", value: "Variable", price: "Quotes Only", icon: "⚓" },
    ],
    points: ["Full House Relocation", "Bulk Commercial Goods", "Oversized Machinery", "Vehicle Shipping"],
    shippingType: "sea",
  }
};

export default function ServiceModal({ service, onClose, onCreate }) {
  if (!service) return null;
  const data = SERVICE_DETAILS[service.id] || SERVICE_DETAILS.documents;

  return (
    <div className="service-modal-overlay" onClick={(e) => e.target.className === "service-modal-overlay" && onClose()}>
      <div className="service-modal expanded">
        <button className="close-icon-btn" onClick={onClose} title="Close">&times;</button>
        
        <div className="modal-content-wrapper">
          {/* Left Side: Info & Features */}
          <div className="modal-info-panel">
            <span className="premium-badge">Official Carrier</span>
            <h2>{data.title}</h2>
            <p className="tagline">{data.tagline}</p>
            <p className="modal-description">{data.description}</p>
            
            <div className="points-section">
              <span className="section-label">Included Coverage</span>
              <ul className="points-list">
                {data.points.map((p) => (
                  <li key={p}><span className="check-bullet">✦</span> {p}</li>
                ))}
              </ul>
            </div>
          </div>

         
          <div className="modal-action-panel">
            <span className="section-label">Select Shipping Tier</span>
            <div className="pricing-container">
              {data.delivery.map((item, index) => (
                <div key={index} className="pricing-card">
                  <div className="tier-header">
                    <span className="tier-icon">{item.icon}</span>
                    <div className="tier-text">
                      <span className="tier-label">{item.label}</span>
                      <span className="tier-time">{item.value}</span>
                    </div>
                  </div>
                  <span className="tier-price">{item.price}</span>
                </div>
              ))}
            </div>

            <button className="premium-create-btn" onClick={() => onCreate(data.shippingType)}>
              Confirm Shipment Details
              <span className="btn-arrow">→</span>
            </button>
            <p className="security-note">🔒 Secured by 256-bit SSL Encryption</p>
          </div>
        </div>
      </div>
    </div>
  );
}