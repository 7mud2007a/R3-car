import React, { useEffect, useMemo, useRef, useState } from 'react';
import car01 from '../assets/car-01.png';
import car02 from '../assets/car-02.png';
import car03 from '../assets/car-03.png';
import background from '../assets/hero-car-background.jpg';
import './CarShowcase.css';

const frameModules = import.meta.glob('../assets/car-frames/frame_*.png', {
  eager: true,
  import: 'default',
});

const frames = Object.entries(frameModules)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, src]) => src);

const cars = [car01, car02, null, car03];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const CarShowcase = () => {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      setProgress(clamp(-rect.top / travel, 0, 1));
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
    };
  }, []);

  const frameIndex = useMemo(() => {
    if (!frames.length) return 0;
    return Math.min(frames.length - 1, Math.floor(progress * (frames.length - 1)));
  }, [progress]);

  const eased = 1 - Math.pow(1 - progress, 3);
  const scale = 1 - eased * 0.72;
  const translateY = eased * 58;

  return (
    <section ref={sectionRef} className="car-motion-section" aria-label="Featured vehicle collection">
      <div className="car-motion-sticky">
        <div className="car-motion-stage">
          <div className="car-motion-image-wrap">
            <img src={background} alt="Luxury vehicle scene" className="car-motion-background" />
            {frames.length > 0 && (
              <img
                src={frames[frameIndex]}
                alt=""
                aria-hidden="true"
                className="car-motion-frame"
                style={{
                  transform: `translate3d(-50%, ${translateY}vh, 0) scale(${scale})`,
                }}
              />
            )}
          </div>

          <div className="car-collection">
            {cars.map((car, index) => (
              <div
                className={`car-slot ${car ? '' : 'car-slot-empty'}`}
                key={index}
                aria-label={car ? `Collection vehicle ${index + 1}` : 'Featured vehicle destination'}
              >
                {car ? (
                  <img src={car} alt={`Luxury vehicle ${index + 1}`} />
                ) : (
                  <span className="slot-marker">FEATURED</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarShowcase;
