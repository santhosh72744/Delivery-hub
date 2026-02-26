import React, { useState, useEffect } from "react";
import "./HeroCarousel.css";

export default function HeroCarousel() {
  const images = ["/carousel-offer.jpeg", "/carousel-offer1.jpeg"];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto Slide (every 4 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const goPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goNext = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="hero">
      <div className="hero-background-glow"></div>

      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            USA <span className="title-arrow">↔</span> INDIA
            <span className="highlight"> Express Shipping</span>
          </h1>

          <p className="hero-subtext">
            The premium bridge for your cargo. Fast, secure door-to-door
            delivery between the <strong>USA and India</strong> in as little as 3–5 days.
          </p>

          <div className="hero-badges">
            <div className="badge-item">🌍 Bidirectional Routes</div>
            <div className="badge-item">⚡ Powered by FedEx</div>
            <div className="badge-item">🛡️ Fast & Secure</div>
          </div>
        </div>
      </div>

      {/* IMAGE CAROUSEL */}
      <div className="hero-image-section">
        <div className="image-wrapper carousel-wrapper">

          <img
            src={images[currentIndex]}
            alt="DeliveryHub Promotional Offer"
            className="hero-image"
          />

          {/* Arrows */}
          <button className="carousel-arrow left" onClick={goPrev}>
            ‹
          </button>

          <button className="carousel-arrow right" onClick={goNext}>
            ›
          </button>

        </div>
      </div>
    </section>
  );
}