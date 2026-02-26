import React, { useState } from "react";
import logo from "./assets/logo.jpeg";
import "./Header.css";

export default function Header({ onHome, onTrack }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="logo-box" onClick={onHome} style={{ cursor: "pointer" }}>
          <img src={logo} alt="DeliveryHub" />
          <span>DeliveryHub</span>
        </div>

        {/* Desktop Navigation */}
        <nav className={`nav-links ${isMenuOpen ? "mobile-open" : ""}`}>
          <a href="#services" onClick={() => setIsMenuOpen(false)}>Services</a>
          <a href="#help" onClick={() => setIsMenuOpen(false)}>Help</a>
          <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
          
          {/* Track button stays inside the menu on mobile, or moves depending on CSS */}
          <button 
            onClick={() => { onTrack(); setIsMenuOpen(false); }} 
            className="nav-btn mobile-nav-btn"
          >
            Track Shipment
          </button>
        </nav>

        {/* Mobile Actions: Track Icon + Hamburger */}
        <div className="mobile-controls">
          <button onClick={onTrack} className="icon-btn track-icon-only" title="Track">
            🔍
          </button>
          <button className="hamburger" onClick={toggleMenu} aria-label="Toggle Menu">
            <span className={`bar ${isMenuOpen ? "active" : ""}`}></span>
            <span className={`bar ${isMenuOpen ? "active" : ""}`}></span>
            <span className={`bar ${isMenuOpen ? "active" : ""}`}></span>
          </button>
        </div>
      </div>
    </header>
  );
}