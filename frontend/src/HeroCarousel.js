import React, { useEffect, useState } from "react";
import "./HeroCarousel.css";

const slides = [
  {
    badge: "US → IN   USA TO INDIA",
    title: "Solutions Based On",
    highlight: "Customer Needs",
    subtitle:
      "Reliable door-to-door logistics. Documents, Parcels, and Heavy Cargo.",
  },
  {
    badge: "FAST & SECURE",
    title: "Express Shipping",
    highlight: "You Can Trust",
    subtitle:
      "FedEx powered delivery with full tracking and priority handling.",
  },
  {
    badge: "AIR & SEA CARGO",
    title: "Flexible Logistics",
    highlight: "Best Pricing",
    subtitle:
      "Affordable air and ocean cargo solutions for every shipment size.",
  },
];

export default function HeroCarousel({ onStart }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[index];

  return (
    <section className="hero-carousel">
      <div className="hero-inner">
        <span className="hero-badge">{slide.badge}</span>

        <h1 className="hero-title">
          {slide.title} <br />
          <span>{slide.highlight}</span>
        </h1>

        <p className="hero-subtitle">{slide.subtitle}</p>

       
      </div>
    </section>
  );
}
