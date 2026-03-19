import React, { useEffect, useState } from "react";
import { enableAnalytics } from "./utils/analytics";
import "./CookieBanner.css";

function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");

    if (!consent) {
      setVisible(true);

      // auto hide after 1 minute
      const timer = setTimeout(() => {
        setVisible(false);
      }, 60000);

      return () => clearTimeout(timer);
    }

    if (consent === "accepted") {
      enableAnalytics();
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    enableAnalytics();
    setVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <p>
        We use cookies to improve your experience, analyze traffic and
        understand how visitors interact with our website.
      </p>

      <div className="cookie-actions">
        <button className="cookie-accept" onClick={acceptCookies}>
          Accept
        </button>

        <button className="cookie-decline" onClick={declineCookies}>
          Decline
        </button>
      </div>
    </div>
  );
}

export default CookieBanner;