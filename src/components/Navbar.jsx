import React, { useState, useEffect } from 'react';
import './Navbar.css';

const navItems = [
  { label: 'Showroom', href: '#hero' },
  { label: 'About Us', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Connect', href: '#social' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', isMobileMenuOpen);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.classList.remove('menu-open');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((open) => !open);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''} ${isMobileMenuOpen ? 'menu-is-open' : ''}`}>
      <div className="container navbar-container">
        <button
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'is-open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          aria-expanded={isMobileMenuOpen}
        >
          <span className="menu-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="menu-label">{isMobileMenuOpen ? 'Close' : 'Menu'}</span>
        </button>
      </div>

      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`} aria-hidden={!isMobileMenuOpen}>
        <div className="menu-atmosphere" aria-hidden="true">
          <span className="menu-orbit menu-orbit-one" />
          <span className="menu-orbit menu-orbit-two" />
          <span className="menu-glow" />
          <span className="menu-grid" />
        </div>

        <div className="mobile-nav">
          <p className="menu-eyebrow">VELTRIX / NAVIGATION</p>

          <div className="menu-links">
            {navItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                className="mobile-nav-link"
                onClick={closeMobileMenu}
                style={{ '--item-index': index }}
              >
                <span className="menu-link-number">0{index + 1}</span>
                <span className="menu-link-text">{item.label}</span>
                <span className="menu-link-arrow">↗</span>
              </a>
            ))}
          </div>

          <a href="#inquiry" className="mobile-cta" onClick={closeMobileMenu}>
            <span>Start a Conversation</span>
            <span className="cta-arrow">→</span>
          </a>

          <div className="menu-footer">
            <span>Luxury in motion</span>
            <span>Scroll / Explore</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
