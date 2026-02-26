import React from "react";
import "./ServiceBlocks.css";

const services = [
  {
    id: "documents",
    title: "Documents",
    desc: "Passports, certificates, legal papers",
    bestFor: "Urgent & sensitive documents",
    tag: "Fast Delivery",
    icon: "📄",
    type: "fast",
  },
  {
    id: "parcels",
    title: "Parcels",
    desc: "Gifts & personal items",
    bestFor: "Family packages & personal shipments",
    tag: "Door to Door",
    icon: "📦",
    type: "normal",
  },
  {
    id: "air",
    title: "Air Cargo",
    desc: "Business & bulk shipments",
    bestFor: "Commercial & time-sensitive cargo",
    tag: "Business",
    icon: "✈️",
    type: "air",
  },
  {
    id: "sea",
    title: "Sea Cargo",
    desc: "Heavy & relocation cargo",
    bestFor: "Large volume & cost-effective shipping",
    tag: "Lowest Cost",
    icon: "🚢",
    type: "sea",
  },
];

export default function ServiceBlocks({ onCreateShipment }) {
  return (
    <section className="service-section">
      <h2 className="service-title">Our Services</h2>

      <div className="service-grid">
        {services.map((s) => (
          <div
            key={s.id}
            className="service-card"
            onClick={() => onCreateShipment(s)}
            role="button"
            aria-label={`Create shipment for ${s.title}`}
          >
           <span className="tag">{s.tag}</span>

<div className="icon">{s.icon}</div>

<h3 className="service-card-title">{s.title}</h3>

<p className="service-desc">{s.desc}</p>

<p className="service-best">
  Best for: <span>{s.bestFor}</span>
</p>

          </div>
        ))}
      </div>
    </section>
  );
}
