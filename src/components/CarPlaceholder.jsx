import React from 'react';
import { Camera, Image, Sparkles } from 'lucide-react';
import './CarPlaceholder.css';

const CarPlaceholder = () => {
  return (
    <div className="car-placeholder-container">
      <div className="car-placeholder-frame">
        <div className="car-placeholder-content">
          <div className="car-placeholder-icon-wrapper">
            <Camera size={48} className="car-placeholder-icon" />
            <Sparkles size={24} className="sparkle-icon" />
          </div>
          <h3 className="car-placeholder-title">Main Car Image Placeholder</h3>
          <p className="car-placeholder-hint">
            Replace this section with your high-resolution luxury vehicle photograph.
          </p>
          <div className="badge-wrapper">
            <span className="placeholder-badge">Recommended: 1920 x 1080px PNG or WEBP</span>
          </div>
        </div>

        {/* Decorative Luxury Lines & Grids */}
        <div className="placeholder-grid-overlay"></div>
        <div className="corner-accent top-left"></div>
        <div className="corner-accent top-right"></div>
        <div className="corner-accent bottom-left"></div>
        <div className="corner-accent bottom-right"></div>
      </div>
    </div>
  );
};

export default CarPlaceholder;
