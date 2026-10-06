import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle Navigation Menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <X size={28} color="#FAF3E1" />
          ) : (
            <Menu size={28} color="#FAF3E1" />
          )}
        </button>
      </div>

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
