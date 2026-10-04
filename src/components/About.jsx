import React from 'react';
import { Award, Shield, Compass, Clock, CheckCircle2 } from 'lucide-react';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="container">

        <div className="about-grid">

          {/* Left Column: Story & Industry Experience */}
          <div className="about-content">
            <span className="section-tag">About Our Showroom</span>
            <h2 className="section-title">
              Crafting Automotive Dreams With Uncompromising Distinction
            </h2>

            <p className="about-text">
              <strong>AURA Luxury Motors</strong> specializes in procuring, preserving, and presenting the finest automotive engineering in the world. From iconic vintage classics to contemporary hypercars, our luxury showroom offers an unparalleled standard of quality and exclusivity.
            </p>

            <p className="about-subtext">
              Every automobile in our collection undergoes an exhaustive multi-point technical inspection and historical verification before entering our showroom floor.
            </p>

            {/* Key Service Highlights */}
            <div className="about-points">
              <div className="point-item">
                <CheckCircle2 size={20} color="#FF6D1F" />
                <span>Curated Luxury & Supercar Selection</span>
              </div>
              <div className="point-item">
                <CheckCircle2 size={20} color="#FF6D1F" />
                <span>Bespoke Concierge & Global Delivery</span>
              </div>
              <div className="point-item">
                <CheckCircle2 size={20} color="#FF6D1F" />
                <span>Complete Service & Provenance Records</span>
              </div>
            </div>

            {/* Experience Banner Callout */}
            <div className="experience-callout">
              <div className="experience-number">25+</div>
              <div className="experience-details">
                <span className="experience-title">Years of Automotive Excellence</span>
                <span className="experience-sub">Delivering trust, discretion, and unmatched passion for luxury automobiles worldwide.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Trust Pillars */}
          <div className="trust-cards-grid">

            <div className="trust-card">
              <div className="trust-icon-box">
                <Award size={28} color="#FF6D1F" />
              </div>
              <h3 className="trust-card-title">Bespoke Acquisition</h3>
              <p className="trust-card-desc">
                Our global network allows us to source limited-run hypercars and rare collector vehicles tailored directly to your desire.
              </p>
            </div>

            <div className="trust-card">
              <div className="trust-icon-box">
                <Shield size={28} color="#FF6D1F" />
              </div>
              <h3 className="trust-card-title">Certified Authenticity</h3>
              <p className="trust-card-desc">
                Uncompromising integrity with thorough provenance verification and comprehensive diagnostic authentication.
              </p>
            </div>

            <div className="trust-card">
              <div className="trust-icon-box">
                <Compass size={28} color="#FF6D1F" />
              </div>
              <h3 className="trust-card-title">Private Consultation</h3>
              <p className="trust-card-desc">
                Enjoy a confidential, personalized showroom experience guided by knowledgeable automotive specialists.
              </p>
            </div>

            <div className="trust-card">
              <div className="trust-icon-box">
                <Clock size={28} color="#FF6D1F" />
              </div>
              <h3 className="trust-card-title">Tailored Financing</h3>
              <p className="trust-card-desc">
                Flexible structures, competitive financing solutions, and luxury lease terms crafted around your personal goals.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default About;
