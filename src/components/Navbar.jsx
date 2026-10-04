import React, { useState, useEffect } from 'react';
import { Shield, Menu, X, Phone, Car } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        {/* Brand / Logo */}
        <a href="#" className="navbar-brand" onClick={closeMobileMenu}>
          <div className="brand-icon">
            <Car size={26} color="#FF6D1F" />
          </div>
          <div className="brand-text">
            <span className="brand-title">AURA</span>
            <span className="brand-subtitle">LUXURY MOTORS</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <a href="#hero" className="nav-link">Showroom</a>
          <a href="#about" className="nav-link">About Us</a>
          <a href="#experience" className="nav-link">Experience</a>
          <a href="#social" className="nav-link">Connect</a>
          <a href="#inquiry" className="nav-link btn-inquiry-nav">Inquire Now</a>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X size={28} color="#FAF3E1" /> : <Menu size={28} color="#FAF3E1" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          <a href="#hero" className="mobile-nav-link" onClick={closeMobileMenu}>Showroom</a>
          <a href="#about" className="mobile-nav-link" onClick={closeMobileMenu}>About Us</a>
          <a href="#experience" className="mobile-nav-link" onClick={closeMobileMenu}>Experience</a>
          <a href="#social" className="mobile-nav-link" onClick={closeMobileMenu}>Connect</a>
          <a href="#inquiry" className="mobile-nav-link mobile-cta" onClick={closeMobileMenu}>Inquire Now</a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
