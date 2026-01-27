import React from "react";
import "./ServiceBlocks.css";

const services = [
  {
    id: "documents",
    title: "Documents",
    desc: "Passports, certificates, papers",
    tag: "Fast Delivery",
    icon: "📄",
    type: "fast",
  },
  {
    id: "parcels",
    title: "Parcels",
    desc: "Gifts & personal items",
    tag: "Door to Door",
    icon: "📦",
    type: "normal",
  },
  {
    id: "air",
    title: "Air Cargo",
    desc: "Business & bulk shipments",
    tag: "Business",
    icon: "✈️",
    type: "air",
  },
  {
    id: "sea",
    title: "Sea Cargo",
    desc: "Heavy & relocation cargo",
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
          >
            <div className="icon">{s.icon}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <span className="tag">{s.tag}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
