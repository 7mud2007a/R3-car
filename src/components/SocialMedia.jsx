import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { InstagramIcon, FacebookIcon, TwitterIcon, YoutubeIcon, LinkedinIcon } from './SocialIcons';
import './SocialMedia.css';

const socialPlatforms = [
  {
    name: 'Instagram',
    handle: '@veltrix',
    icon: InstagramIcon,
    url: '#',
    description: 'Exclusive gallery & behind-the-scenes delivery videos'
  },
  {
    name: 'Facebook',
    handle: 'VELTRIX',
    icon: FacebookIcon,
    url: '#',
    description: 'Community news, VIP drive events & luxury car launches'
  },
  {
    name: 'X',
    handle: '@VELTRIX',
    icon: TwitterIcon,
    url: '#',
    description: 'Real-time arrivals & automotive industry news'
  },
  {
    name: 'YouTube',
    handle: 'VELTRIX Official',
    icon: YoutubeIcon,
    url: '#',
    description: 'Exhaust sounds & detailed hypercar reviews'
  },
  {
    name: 'LinkedIn',
    handle: 'VELTRIX Group',
    icon: LinkedinIcon,
    url: '#',
    description: 'Corporate news, acquisitions & career opportunities'
  }
];

const SocialMedia = () => {
  return (
    <section id="social" className="social-section">
      <div className="social-circuit-shell">
        <div className="social-header">
          <span className="section-tag">Stay Connected</span>
          <h2 className="section-title">Enter The Private Circuit</h2>
          <p className="section-subtitle">
            Five signals. One world. Follow VELTRIX beyond the showroom.
          </p>
        </div>

        <div className="social-circuit" aria-label="VELTRIX social network">
          <div className="circuit-rings" aria-hidden="true">
            <span className="circuit-ring ring-one" />
            <span className="circuit-ring ring-two" />
            <span className="circuit-ring ring-three" />
            <span className="circuit-cross cross-one" />
            <span className="circuit-cross cross-two" />
          </div>

          <div className="circuit-core">
            <span className="core-status"><i /> LIVE</span>
            <strong>VELTRIX</strong>
            <span className="core-caption">PRIVATE NETWORK</span>
          </div>

          <div className="orbit orbit-one">
            {socialPlatforms.slice(0, 3).map((platform, index) => {
              const Icon = platform.icon;
              return (
                <a
                  key={platform.name}
                  href={platform.url}
                  className="signal-node"
                  style={{ '--node-index': index }}
                  aria-label={`Visit VELTRIX on ${platform.name}`}
                >
                  <span className="signal-line" />
                  <span className="signal-number">0{index + 1}</span>
                  <span className="signal-icon"><Icon size={22} /></span>
                  <span className="signal-copy">
                    <b>{platform.name}</b>
                    <small>{platform.handle}</small>
                    <em>{platform.description}</em>
                  </span>
                  <ArrowUpRight className="signal-arrow" size={17} />
                </a>
              );
            })}
          </div>

          <div className="orbit orbit-two">
            {socialPlatforms.slice(3).map((platform, index) => {
              const Icon = platform.icon;
              return (
                <a
                  key={platform.name}
                  href={platform.url}
                  className="signal-node"
                  style={{ '--node-index': index }}
                  aria-label={`Visit VELTRIX on ${platform.name}`}
                >
                  <span className="signal-line" />
                  <span className="signal-number">{String(index + 4).padStart(2, '0')}</span>
                  <span className="signal-icon"><Icon size={22} /></span>
                  <span className="signal-copy">
                    <b>{platform.name}</b>
                    <small>{platform.handle}</small>
                    <em>{platform.description}</em>
                  </span>
                  <ArrowUpRight className="signal-arrow" size={17} />
                </a>
              );
            })}
          </div>
        </div>

        <div className="social-footer-note">
          <span>VELTRIX / DIGITAL PRESENCE</span>
          <span>05 CHANNELS / 01 CIRCUIT</span>
        </div>
      </div>
    </section>
  );
};

export default SocialMedia;
