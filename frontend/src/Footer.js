import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer-dark">
      <div className="footer-container">
        
        <div className="footer-col">
          <h3 className="footer-title">Delivery Hub</h3>
          <p className="footer-text">
            Providing top-tier international logistics from the United States to
            India. Solutions built around your specific requirements.
          </p>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Customer Support</h4>

          <p className="footer-label">Email us:</p>
          <a href="mailto:deliveryhubca@gmail.com" className="footer-link">
            deliveryhubca@gmail.com
          </a>

          <p className="footer-label" style={{ marginTop: "1rem" }}>
            Call us:
          </p>
          <p className="footer-phone">510 714 6946</p>
        </div>

        
        <div className="footer-col">
          <h4 className="footer-heading">Service Area</h4>
          <p className="footer-text italic">
            Available for pickups across California and nationwide shipping to
            all major cities in India.
          </p>

          <div className="footer-socials">
            <i className="fab fa-whatsapp"></i>
            <i className="fab fa-facebook"></i>
            <i className="fab fa-instagram"></i>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 DELIVERY HUB SHIPPING SERVICES. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}
