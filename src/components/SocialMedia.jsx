import React from 'react';
import { Share2 } from 'lucide-react';
import { InstagramIcon, FacebookIcon, TwitterIcon, YoutubeIcon, LinkedinIcon } from './SocialIcons';
import './SocialMedia.css';

const SocialMedia = () => {
  const socialPlatforms = [
    {
      name: 'Instagram',
      handle: '@auraluxurymotors',
      icon: InstagramIcon,
      url: '#',
      description: 'Exclusive gallery & behind-the-scenes delivery videos'
    },
    {
      name: 'Facebook',
      handle: 'Aura Luxury Motors',
      icon: FacebookIcon,
      url: '#',
      description: 'Community news, VIP drive events & luxury car launches'
    },
    {
      name: 'X (Twitter)',
      handle: '@AuraMotors',
      icon: TwitterIcon,
      url: '#',
      description: 'Real-time inventory arrivals & automotive industry news'
    },
    {
      name: 'YouTube',
      handle: 'Aura Luxury Motors Official',
      icon: YoutubeIcon,
      url: '#',
      description: 'High-definition exhaust sounds & detailed hypercar reviews'
    },
    {
      name: 'LinkedIn',
      handle: 'Aura Luxury Motors Group',
      icon: LinkedinIcon,
      url: '#',
      description: 'Corporate news, executive acquisitions & career opportunities'
    }
  ];

  return (
    <section id="social" className="social-section">
      <div className="container">
        <div className="social-header">
          <span className="section-tag">Stay Connected</span>
          <h2 className="section-title">Follow The Elite Journey</h2>
          <p className="section-subtitle">
            Join our online private circle for daily showcases of extraordinary engineering, rare hypercars, and exclusive private showroom previews.
          </p>
        </div>

        <div className="social-cards-container">
          {socialPlatforms.map((platform, index) => {
            const IconComponent = platform.icon;
            return (
              <a
                key={index}
                href={platform.url}
                className="social-card"
                aria-label={`Visit our ${platform.name} page (Placeholder link)`}
              >
                <div className="social-icon-wrapper">
                  <IconComponent size={28} />
                </div>
                <div className="social-info">
                  <h3 className="social-name">{platform.name}</h3>
                  <span className="social-handle">{platform.handle}</span>
                  <p className="social-desc">{platform.description}</p>
                </div>
                <div className="social-arrow">
                  <Share2 size={18} />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SocialMedia;
