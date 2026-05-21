import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuthContext } from "../AuthProvider";

function Home() {
  const { user } = useContext(UserAuthContext);
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-eyebrow">Photography Studio</div>
          <h1 className="hero-title">
            Capture Your <span className="accent">Special Moments</span>
          </h1>
          <p className="hero-subtitle">
            Professional photography services tailored for your most important events and celebrations
          </p>
          <div className="hero-buttons">
            <button onClick={() => navigate("/services")} className="btn btn-primary btn-lg">
              Explore Services
            </button>
            {!user && (
              <button onClick={() => navigate("/auth/signup")} className="btn btn-secondary btn-lg">
                Get Started
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section featured-section">
        <div className="section-inner">
          <h2 className="section-title">Our Services</h2>
          <p className="section-subtitle">From intimate portraits to grand celebrations — we cover it all with care and artistry</p>
          <div style={{textAlign:'center'}}>
            <button onClick={() => navigate("/services")} className="btn btn-secondary">View All Services</button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="section-inner">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-num">1</div>
              <h3>Choose a Service</h3>
              <p>Browse our curated selection of professional photography packages</p>
            </div>
            <div className="step-card">
              <div className="step-num">2</div>
              <h3>Book Your Date</h3>
              <p>Pick a date, share your location, and tell us about your vision</p>
            </div>
            <div className="step-card">
              <div className="step-num">3</div>
              <h3>Get Your Photos</h3>
              <p>We deliver stunning, professionally edited photos to you</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="section-inner">
          <div className="cta-section">
            <h2>Ready to Capture Your Moments?</h2>
            <p>Book your session today and let us tell your story through the lens.</p>
            <button onClick={() => navigate("/services")} className="btn btn-primary btn-lg">Book Now</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
