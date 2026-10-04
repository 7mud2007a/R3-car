import React from 'react';
import { Car, Mail, ArrowUp } from 'lucide-react';
import { InstagramIcon, FacebookIcon, TwitterIcon, YoutubeIcon, LinkedinIcon } from './SocialIcons';
import './Footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-section">
      <div className="container">

        {/* Main Footer Row */}
        <div className="footer-main">

          {/* Brand Info */}
          <div className="footer-brand-col">
            <a href="#" className="footer-brand">
              <div className="brand-icon">
                <Car size={24} color="#FF6D1F" />
              </div>
              <div className="brand-text">
                <span className="brand-title">AURA</span>
                <span className="brand-subtitle">LUXURY MOTORS</span>
              </div>
            </a>
            <p className="footer-brand-desc">
              Pinnacle automotive engineering and bespoke luxury showroom. Delivering world-class supercars and luxury automobiles to refined clientele worldwide.
            </p>
            <div className="footer-email-badge">
              <Mail size={16} color="#FF6D1F" />
              <a href="mailto:bznsman77@gmail.com">bznsman77@gmail.com</a>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links-list">
              <li><a href="#hero">Showroom</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#about">Heritage</a></li>
              <li><a href="#social">Connect</a></li>
              <li><a href="#inquiry">Inquire Now</a></li>
            </ul>
          </div>

          {/* Social Quick Icons */}
          <div className="footer-links-col">
            <h4 className="footer-col-title">Social Circle</h4>
            <div className="footer-social-icons">
              <a href="#" aria-label="Instagram"><InstagramIcon size={20} /></a>
              <a href="#" aria-label="Facebook"><FacebookIcon size={20} /></a>
              <a href="#" aria-label="Twitter"><TwitterIcon size={20} /></a>
              <a href="#" aria-label="YouTube"><YoutubeIcon size={20} /></a>
              <a href="#" aria-label="LinkedIn"><LinkedinIcon size={20} /></a>
            </div>
            <p className="footer-social-note">
              Follow for confidential private showroom updates and inventory releases.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} <strong>AURA Luxury Motors</strong>. All Rights Reserved. Crafted with Automotive Perfection.
          </p>

          <button onClick={scrollToTop} className="scroll-top-btn" aria-label="Scroll back to top">
            <span>Back To Top</span>
            <ArrowUp size={16} />
          </button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
