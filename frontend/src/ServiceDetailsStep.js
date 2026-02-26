import React, { useState } from "react";
import "./ServiceDetailsStep.css";


const SERVICE_DETAILS = {
documents: {
  id: "documents",
  title: "Document Services",
  tagline: "Secure, Verified & Time-Critical Delivery",
  description:
    "End-to-end secure courier solutions for sensitive legal, academic, and personal documents. Designed for confidentiality, speed, and compliance with international handling standards.",

  delivery: [
    {
      label: "Express Shipping",
      value: "3–5 Business Days",
      price: 65,
      icon: "🚀",
    },
    {
      label: "Standard Shipping",
      value: "7–10 Business Days",
      price: 55,
      icon: "📦",
    },
  ],

  points: [
    "Passports, Visas & ID Cards",
    "University Transcripts & Certificates",
    "Legal Contracts, Affidavits & Deeds",
    "Bank Statements & Financial Records",
    "Government & Embassy Documents",
    "Medical & Insurance Papers",
  ],

  bestFor: [
    "Urgent international submissions",
    "High-value or irreplaceable papers",
    "Visa, PR, and immigration filings",
    "Academic & employment verification",
    "Time-sensitive legal deliveries",
  ],

  handling: [
    "Tamper-proof packaging",
    "Manual handling only (no automated sorting)",
    "Signature-required delivery",
    "Real-time tracking with status updates",
  ],

  compliance: [
    "KYC-verified sender details",
    "Customs-safe documentation checks",
    "Carrier compliance with international courier regulations",
  ],

  notAllowed: [
    "Laminated or altered IDs",
    "Damaged or incomplete documents",
    "Cash, cheques, or negotiable instruments",
    "Illegal, forged, or restricted papers",
  ],

  shippingType: "fast",
},


  parcels: {
  id: "parcels",
  title: "Parcel Delivery",
  tagline: "Reliable Door-to-Door Shipping",
  description:
    "Flexible and affordable international parcel delivery for everyday shipments. Ideal for personal items, gifts, and small business orders with full tracking and delivery confirmation.",

  delivery: [
    {
      label: "Air Priority",
      value: "5–7 Business Days",
      price: 10,
      icon: "✈️",
    },
    {
      label: "Standard Parcel",
      value: "10–14 Business Days",
      price: 8,
      icon: "🚚",
    },
  ],

  points: [
    "Personal Items & Clothing",
    "Electronic Gadgets & Accessories",
    "E-commerce Returns & Orders",
    "Gifts & Care Packages",
    "Small Household Items",
    "Non-fragile Consumer Goods",
  ],

  bestFor: [
    "Personal international shipping",
    "Family & friend deliveries",
    "Online sellers & small businesses",
    "Cost-effective parcel shipping",
    "Non-urgent but reliable delivery",
  ],

  handling: [
    "Secure packaging and labeling",
    "Door-to-door pickup and delivery",
    "End-to-end shipment tracking",
    "Delivery confirmation upon arrival",
  ],

  compliance: [
    "Basic customs documentation support",
    "Carrier-compliant packaging guidelines",
    "Country-specific import restrictions applied",
  ],

  notAllowed: [
    "Liquids & gels",
    "Lithium batteries (loose)",
    "Perishable food items",
    "Flammable or hazardous materials",
    "Cash, jewelry, or valuables",
  ],

  shippingType: "normal",
},


  air: {
  id: "air",
  title: "Air Cargo",
  tagline: "Fast & Scalable Business Logistics",
  description:
    "Professional air freight solutions for medium-to-large commercial shipments. Designed for speed, reliability, and compliance across international trade lanes.",

  delivery: [
    {
      label: "Priority Freight",
      value: "12–15 Business Days",
      price: 12,
      icon: "🛩️",
    },
    {
      label: "Economy Air",
      value: "20–25 Business Days",
      price: 10,
      icon: "☁️",
    },
  ],

  points: [
    "Commercial Inventory & Stock Replenishment",
    "Medium Cargo Boxes & Crates",
    "Palletized Shipments",
    "Industrial Components & Spare Parts",
    "Electronics & Manufacturing Supplies",
  ],

  bestFor: [
    "Business-to-business shipments",
    "High-value or time-sensitive cargo",
    "Regular commercial exports",
    "Manufacturing & distribution logistics",
    "Urgent bulk consignments",
  ],

  handling: [
    "Priority airport handling",
    "Cargo consolidation and palletization",
    "Secure loading and unloading procedures",
    "Real-time shipment tracking",
  ],

  compliance: [
    "Commercial invoice and packing list support",
    "Customs documentation guidance",
    "Carrier and airline compliance checks",
    "Export regulation adherence",
  ],

  notAllowed: [
    "Hazardous or explosive materials",
    "Flammable liquids or gases",
    "Loose lithium batteries",
    "Perishable or temperature-sensitive goods",
    "Illegal or restricted items",
  ],

  shippingType: "air",
},


  sea: {
  id: "sea",
  title: "Sea Cargo",
  tagline: "Cost-Effective Ocean Freight",
  description:
    "Affordable ocean freight solutions for large-volume shipments, household relocations, and heavy commercial cargo. Ideal when cost efficiency matters more than delivery speed.",

  delivery: [
    {
      label: "Standard Box",
      value: "3–4 Months",
      unitPrice: 150,
      icon: "📦",
    },
    {
      label: "Heavy Box",
      value: "3–4 Months",
      unitPrice: 180,
      icon: "📦",
    },
  ],

  points: [
    "Full Household Relocation Shipments",
    "Bulk Commercial Goods & Inventory",
    "Oversized Machinery & Equipment",
    "Automobile & Two-Wheeler Shipping",
    "Industrial Materials & Raw Goods",
  ],

  bestFor: [
    "Large and heavy consignments",
    "International relocation projects",
    "Non-urgent commercial cargo",
    "Cost-sensitive bulk shipping",
    "Long-term logistics planning",
  ],

  handling: [
    "Containerized or boxed cargo handling",
    "Port-to-port or door-to-port shipping options",
    "Secure loading and container sealing",
    "Shipment tracking at major transit milestones",
  ],

  compliance: [
    "Export and import customs documentation guidance",
    "Country-specific shipping regulations applied",
    "Container and cargo compliance checks",
  ],

  notAllowed: [
    "Perishable or temperature-sensitive goods",
    "Restricted or prohibited imports",
    "Hazardous or flammable materials",
    "Live animals or biological materials",
    "Illegal or unregistered items",
  ],

  shippingType: "sea",
},

};

export default function ServiceDetailsStep({ service, onNext, onBack })
 {
  const [selectedTier, setSelectedTier] = useState(0);
  const [boxCount, setBoxCount] = useState(1);

  if (!service) return null;

  const data = SERVICE_DETAILS[service.id];
  const selectedDelivery = data.delivery[selectedTier];
  const isSea = data.id === "sea";

  const displayTotal = isSea
    ? selectedDelivery.unitPrice * boxCount
    : null;

  return (
   
      <div className="service-page-wrapper">
  <div className="service-page-container">
    <div className="service-header-actions">
  <button className="back-btn" onClick={onBack}>
    ← Back to Services
  </button>
</div>


        <div className="modal-content-wrapper">
          <div className="modal-info-panel">
            <span className="premium-badge">Official Carrier</span>
            <h2>{data.title}</h2>
            <p className="tagline">{data.tagline}</p>
            <p className="modal-description">{data.description}</p>

            <span className="section-label">Included Coverage</span>
            <ul className="points-list">
              {data.points.map((p) => (
                <li key={p}>✦ {p}</li>
              ))}
            </ul>

            <span className="section-label warn">Not Allowed</span>
            <ul className="points-list warn">
              {data.notAllowed.map((p) => (
                <li key={p}>• {p}</li>
              ))}
            </ul>
          </div>

          <div className="modal-action-panel">
            <span className="section-label">Select Shipping Tier</span>

            <div className="pricing-container">
              {data.delivery.map((item, index) => (
                <div
                  key={index}
                  className="pricing-card"
                  style={{
                    borderColor: selectedTier === index ? "#2563eb" : undefined,
                  }}
                  onClick={() => setSelectedTier(index)}
                ><div className="tier-header">
  <span className="tier-icon">{item.icon}</span>
  <div className="tier-text">
    <span className="tier-label">{item.label}</span>
    <span className="tier-time">{item.value}</span>
  </div>
</div>


                  <span className="tier-price">
                    {isSea ? `$${item.unitPrice}` : `$${item.price}`}
                  </span>
                </div>
              ))}
            </div>

            {isSea && (
              <div style={{ marginBottom: "32px" }}>
  <label style={{ 
    fontSize: "0.75rem", 
    fontWeight: 700, 
    color: "var(--text-muted)", 
    textTransform: "uppercase", 
    letterSpacing: "0.05em" 
  }}>
    Number of Boxes
  </label>
  
  <div className="quantity-selector">
    <button 
      type="button"
      className="qty-btn" 
      onClick={() => setBoxCount(Math.max(1, boxCount - 1))}
    >
      −
    </button>
    
    <span className="qty-count">{boxCount}</span>
    
    <button 
      type="button"
      className="qty-btn" 
      onClick={() => setBoxCount(boxCount + 1)}
    >
      +
    </button>
  </div>

  <div className="total-price-tag">
    Total Amount: <span>${displayTotal}</span>
  </div>
</div>
            )}

            <button
              className="premium-create-btn"
              onClick={() =>
                onNext({

                  serviceId: data.id,
                  shippingType: data.shippingType,

                  deliveryTier: selectedTier,
                  deliveryLabel: selectedDelivery.label,
                  estimatedDays: selectedDelivery.value,

                  pricing: {
                    mode: isSea ? "per_box" : "flat",
                    unitPrice: isSea
                      ? selectedDelivery.unitPrice
                      : selectedDelivery.price,
                    quantity: isSea ? boxCount : 1,
                  },
                })
              }
            >
              Confirm Shipment Details →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
