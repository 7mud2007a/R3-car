import React from 'react';
import { ArrowRight, ChevronDown, Award, ShieldCheck, Sparkles } from 'lucide-react';
import CarPlaceholder from './CarPlaceholder';
import './Hero.css';

const Hero = () => {
  return (
    <section id="hero" className="hero-section">
      <div className="container hero-container">

        {/* Top Tagline & Headline */}
        <div className="hero-header">
          <div className="hero-badge">
            <Sparkles size={16} color="#FF6D1F" />
            <span>VELTRIX</span>
          </div>

          <h1 className="hero-title">
            VELTRIX
          </h1>

          <p className="hero-description hero-tagline">
            Redefining Luxury & Performance
          </p>

          <p className="hero-description">
            Welcome to <strong>AURA Luxury Motors</strong>, where unparalleled engineering meets timeless sophistication. Discover a curated collection of elite hypercars, rare supercars, and bespoke luxury sedans crafted for the discerning driver.
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

        {/* Car Image Placeholder Section */}
        <div className="hero-car-wrapper">
          <CarPlaceholder />
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
