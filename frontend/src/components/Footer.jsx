import { Link } from "react-router-dom";
import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">Schatzen</div>
          <p>Professional photography services for your most important moments. Capturing memories that last forever.</p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="footer-col">
          <h4>Get in Touch</h4>
          <p>hello@schatzen.com</p>
          <p>+977 (000) 000-0000</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Schatzen. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
