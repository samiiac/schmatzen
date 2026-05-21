import { Link } from "react-router-dom";
import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>Schatzen</h3>
          <p>Professional photography services for your special moments.</p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="footer-contact">
          <h4>Contact</h4>
          <p>Email: hello@schatzen.com</p>
            <p>Contact us at your convenience</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Schatzen. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
