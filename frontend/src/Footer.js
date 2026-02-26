import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
   <footer class="footer" role="contentinfo" aria-label="Delivery Hub website footer">
  <div class="footer-container">

    <section class="footer-section" aria-labelledby="footer-company">
      <h2 id="footer-company">Delivery Hub</h2>
      <p>
        Delivery Hub provides <strong>international logistics and shipping services</strong>
        from the <strong>United States to India</strong>. We offer secure, reliable,
        and customized shipping solutions for personal and commercial needs.
      </p>
    </section>

    
    <section class="footer-section" aria-labelledby="footer-support">
      <h2 id="footer-support">Customer Support</h2>

      <address>
        <p>
          <span class="sr-only">Email support at </span>
          <strong>Email:</strong>
          <a
            href="mailto:deliveryhubca@gmail.com"
            aria-label="Email Delivery Hub customer support"
          >
            deliveryhubca@gmail.com
          </a>
        </p>

        <p>
          <span class="sr-only">Call customer support at </span>
          <strong>Phone:</strong>
          <a
            href="tel:+15107146946"
            aria-label="Call Delivery Hub customer support at +1 510 714 6946"
          >
            +1 (510) 714-6946
          </a>
        </p>
      </address>
    </section>

   
    <section class="footer-section" aria-labelledby="footer-service-area">
      <h2 id="footer-service-area">Service Area</h2>
      <p>
        We provide <strong>pickup services across California</strong> and
        <strong>nationwide shipping</strong> from the USA to all major cities in India,
        including Hyderabad, Bangalore, Chennai, Mumbai, and Delhi.
      </p>
    </section>

  </div>

 
  <div class="footer-bottom" role="region" aria-label="Legal information">
    <p>
      &copy; 2026 <span itemprop="name">Delivery Hub</span>.
      All rights reserved.
    </p>
  </div>
</footer>
  );
}
