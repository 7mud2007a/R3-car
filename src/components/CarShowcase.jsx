import React, { useEffect, useRef, useState } from 'react';
import { CarFront, ChevronDown } from 'lucide-react';
import heroCarMobile from '../assets/hero-car.png';
import heroCarDesktop from '../assets/hero-car-desktop.png';
import './CarShowcase.css';

const CarShowcase = () => {
  const sectionRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { threshold: 0.28 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`car-showcase ${isActive ? 'is-active' : ''}`}>
      <div className="car-showcase-inner">
        <div className="showcase-heading">
          <span>THE COLLECTION</span>
          <h2>One Place Reserved</h2>
          <p>Scroll to reveal the centerpiece.</p>
        </div>

        <div className="showcase-main">
          <picture>
            <source media="(min-width: 769px)" srcSet={heroCarDesktop} />
            <img src={heroCarMobile} alt="Featured luxury vehicle" className="showcase-main-image" />
          </picture>
          <div className="showcase-glow" />
        </div>

        <div className="showcase-line" />

        <div className="mini-car-row" aria-label="Luxury vehicle collection">
          <div className="mini-car"><CarFront size={30} /><span>01</span></div>
          <div className="mini-car"><CarFront size={30} /><span>02</span></div>
          <div className="mini-car mini-car-slot" aria-label="Reserved space for featured vehicle"><span>03</span></div>
          <div className="mini-car"><CarFront size={30} /><span>04</span></div>
          <div className="mini-car"><CarFront size={30} /><span>05</span></div>
        </div>

        <div className="showcase-scroll-note">
          <ChevronDown size={18} />
          <span>Keep scrolling</span>
        </div>

        <div className="floating-featured-car" aria-hidden="true">
          <picture>
            <source media="(min-width: 769px)" srcSet={heroCarDesktop} />
            <img src={heroCarMobile} alt="" />
          </picture>
        </div>
      </div>
    </section>
  );
};

export default CarShowcase;
