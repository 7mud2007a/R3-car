import React from 'react';
import { ArrowRight, ChevronDown, Award, ShieldCheck } from 'lucide-react';
import './Hero.css';
import heroCarMobile from '../assets/hero-car.png';
import heroCarDesktop from '../assets/hero-car-desktop.png';

const Hero = () => {
  return (
    <section id="hero" className="hero-section">
      <div className="container hero-container">

        {/* Hero Branding */}
        <div className="hero-header">
          <h1 className="hero-title">
            VELTRIX
          </h1>

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

        {/* Hero Car Image */}
        <div className="hero-car-wrapper">
          <picture>
            <source
              media="(min-width: 769px)"
              srcSet={heroCarDesktop}
            />
            <img
              src={heroCarMobile}
              alt="Luxury performance car"
              className="hero-car-image"
            />
          </picture>
        </div>

        {/* Hero Features Bar */}
        <div className="hero-highlights">
          <div className="highlight-item">
            <Award className="highlight-icon" size={24} />
            <div>
              <span className="highlight-title">Exclusive Inventory</span>
              <span className="highlight-sub">Handpicked pristine luxury models</span>
            </div>
          </div>
          <div className="highlight-divider"></div>
          <div className="highlight-item">
            <ShieldCheck className="highlight-icon" size={24} />
            <div>
              <span className="highlight-title">Certified Authenticity</span>
              <span className="highlight-sub">Full provenance & multi-point inspections</span>
            </div>
          </div>
        </div>

      </div>

      {/* Scroll Indicator */}
      <a href="#about" className="scroll-indicator" aria-label="Scroll to About section">
        <ChevronDown size={24} color="#F5E7C6" />
      </a>
    </section>
  );
};

export default Hero;
