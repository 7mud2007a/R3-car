import React, { useEffect, useState } from 'react';
import './Navbar.css';

const navItems = [
  { label: 'Showroom', short: 'Home', href: '#hero' },
  { label: 'About Us', short: 'About', href: '#about' },
  { label: 'Experience', short: 'Drive', href: '#experience' },
  { label: 'Connect', short: 'Connect', href: '#social' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [direction, setDirection] = useState('down');

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const updateScrollState = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY;

      setIsScrolled(currentY > 40);

      if (Math.abs(delta) > 3 && !isMobileMenuOpen) {
        setDirection(delta > 0 ? 'down' : 'up');
        if (currentY > 120) setIsBottomNavVisible(delta < 0);
        if (currentY < 80) setIsBottomNavVisible(false);
      }

      lastY = currentY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0.05, 0.2, 0.5, 0.8] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', isMobileMenuOpen);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    };

    if (isMobileMenuOpen) document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('menu-open');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen((open) => !open);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleBottomNavClick = (href) => {
    const target = document.querySelector(href);
    if (!target) return;

    setActiveSection(href.slice(1));
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
            <span>VELTRIX / NAVIGATION</span>
            <span>04 DESTINATIONS</span>
          </div>
        </div>
      </div>

      <nav
        className={`bottom-nav ${isBottomNavVisible ? 'is-visible' : ''} direction-${direction}`}
        aria-label="Section navigation"
      >
        <div className="bottom-nav-shell">
          <div className="bottom-nav-orbit" aria-hidden="true" />
          <div className="bottom-nav-glow" aria-hidden="true" />

          <div className="bottom-nav-brand" aria-hidden="true">
            <span className="bottom-brand-dot" />
            <span>VLTX</span>
          </div>

          <div className="bottom-nav-items">
            {navItems.map((item, index) => {
              const isActive = activeSection === item.href.slice(1);

              return (
                <button
                  key={item.href}
                  type="button"
                  className={`bottom-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleBottomNavClick(item.href)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="bottom-item-index">0{index + 1}</span>
                  <span className="bottom-item-icon">
                    <span />
                    <span />
                  </span>
                  <span className="bottom-item-label">{item.short}</span>
                  <span className="bottom-item-line" />
                </button>
              );
            })}
          </div>

          <div className="bottom-nav-progress" aria-hidden="true">
            <span
              style={{
                transform: `translateX(${navItems.findIndex((item) => item.href.slice(1) === activeSection) * 100}%)`
              }}
            />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
