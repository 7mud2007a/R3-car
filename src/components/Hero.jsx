import React from 'react';
import { ArrowRight, Award, ShieldCheck } from 'lucide-react';
import './Hero.css';
import heroCarMobile from '../assets/hero-car.png';
import heroCarDesktop from '../assets/hero-car-desktop.png';

const Hero = () => {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-background" aria-hidden="true">
        <picture>
          <source media="(min-width: 769px)" srcSet={heroCarDesktop} />
          <img
            src={heroCarMobile}
            alt=""
            className="hero-background-image"
          />
        </picture>
        <div className="hero-background-overlay" />
      </div>

      <div className="container hero-container">
        <div className="hero-header">
          <h1 className="hero-title">VELTRIX</h1>

          <p className="hero-description hero-tagline">
            Redefining Luxury & Performance
          </p>

          <div className="hero-cta-group">
            <a href="#inquiry" className="btn-primary hero-btn">
              <span>Book Private Viewing</span>
              <ArrowRight size={18} />
            </a>
            <a href="#about" className="btn-secondary hero-btn">
              <span>Our Heritage</span>
            </a>
          </div>
        </div>

        <div className="hero-highlights">
          <div className="highlight-item">
            <Award className="highlight-icon" size={24} />
            <div>
              <span className="highlight-title">Exclusive Inventory</span>
              <span className="highlight-sub">Handpicked pristine luxury models</span>
            </div>
          </div>
          <div className="highlight-divider" />
          <div className="highlight-item">
            <ShieldCheck className="highlight-icon" size={24} />
            <div>
              <span className="highlight-title">Certified Authenticity</span>
              <span className="highlight-sub">Full provenance & multi-point inspections</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
