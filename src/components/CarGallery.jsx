import React, { useEffect, useRef, useState } from 'react';
import './CarGallery.css';

const cars = [
  { src: '/cars/car-01.jpg', alt: 'Luxury car 01' },
  { src: '/cars/car-02.jpg', alt: 'Luxury car 02' },
  { src: '/cars/car-03.jpg', alt: 'Luxury car 03' },
  { src: '/cars/car-04.jpg', alt: 'Luxury car 04' },
  { src: '/cars/car-05.jpg', alt: 'Luxury car 05' },
];

const CarGallery = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;

    const updateGallery = () => {
      raf = 0;
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const rect = section.getBoundingClientRect();
      const maxScroll = section.offsetHeight - window.innerHeight;
      const travelled = Math.min(Math.max(-rect.top, 0), maxScroll);
      const nextProgress = maxScroll > 0 ? travelled / maxScroll : 0;
      setProgress(nextProgress);

      const maxTranslate = Math.max(track.scrollWidth - window.innerWidth, 0);
      track.style.transform = `translate3d(-${maxTranslate * nextProgress}px, 0, 0)`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(updateGallery);
    };

    const onResize = () => {
      if (!raf) raf = requestAnimationFrame(updateGallery);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    updateGallery();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="car-gallery"
      aria-label="Luxury car collection"
      style={{ '--car-count': cars.length }}
    >
      <div className="car-gallery-sticky">
        <div className="car-gallery-intro">
          <span>VELTRIX / COLLECTION</span>
          <i>{String(Math.min(cars.length, Math.floor(progress * cars.length) + 1)).padStart(2, '0')} / {String(cars.length).padStart(2, '0')}</i>
        </div>

        <div ref={trackRef} className="car-gallery-track">
          {cars.map((car, index) => (
            <article className="car-gallery-card" key={car.src}>
              <div className="car-gallery-frame">
                <img src={car.src} alt={car.alt} draggable="false" />
                <div className="car-gallery-shade" />
                <div className="car-gallery-index">0{index + 1}</div>
              </div>
            </article>
          ))}
        </div>

        <div className="car-gallery-hint" aria-hidden="true">
          <span className="hint-line" />
          <span>KEEP SCROLLING</span>
        </div>
      </div>
    </section>
  );
};

export default CarGallery;
