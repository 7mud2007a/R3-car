import React, { useEffect, useRef } from 'react';
import car01 from '../assets/car-01.png';
import car02 from '../assets/car-02.png';
import car03 from '../assets/car-03.png';
import background from '../assets/hero-car-background.jpg';
import './CarShowcase.css';

const frameModules = import.meta.glob('../assets/car-frames/frame_*.webp', {
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
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const slotRef = useRef(null);
  const sizeRef = useRef(null);
  const geometryRef = useRef(null);
  const lastFrameRef = useRef(-1);
  const rafRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const frame = frameRef.current;
    const slot = slotRef.current;
    const size = sizeRef.current;

    if (!section || !stage || !frame || !slot || !size || !frames.length) return;

    const measure = () => {
      const stageRect = stage.getBoundingClientRect();
      const imageWrap = stage.querySelector('.car-motion-image-wrap');
      const imageRect = imageWrap.getBoundingClientRect();
      const slotRect = slot.getBoundingClientRect();
      const sizeRect = size.getBoundingClientRect();

      const baseFrameWidth = frame.offsetWidth;

      geometryRef.current = {
        startX: imageRect.left + imageRect.width / 2 - stageRect.left,
        startY: imageRect.top + imageRect.height / 2 - stageRect.top,
        targetX: slotRect.left + slotRect.width / 2 - stageRect.left,
        targetY: slotRect.bottom - sizeRect.height / 2 - stageRect.top,
        targetScale: sizeRect.width / baseFrameWidth,
        travel: Math.max(section.offsetHeight - window.innerHeight, 1),
      };

      update();
    };

    const update = () => {
      rafRef.current = 0;
      const geometry = geometryRef.current;
      if (!geometry) return;

      const progress = clamp(
        -section.getBoundingClientRect().top / geometry.travel,
        0,
        1,
      );

      const x = geometry.startX + (geometry.targetX - geometry.startX) * progress;
      const y = geometry.startY + (geometry.targetY - geometry.startY) * progress;
      const scale = 1 + (geometry.targetScale - 1) * progress;

      frame.style.transform =
        'translate3d(' + x + 'px,' + y + 'px,0) translate(-50%,-50%) scale(' + scale + ')';

      const frameIndex = Math.min(
        frames.length - 1,
        Math.round(progress * (frames.length - 1)),
      );

      if (frameIndex !== lastFrameRef.current) {
        frame.src = frames[frameIndex];
        lastFrameRef.current = frameIndex;
      }
    };

    const requestUpdate = () => {
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(update);
      }
    };

    const onResize = () => measure();

    measure();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('load', onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onResize);
    };
  }, []);

  return (
    <section ref={sectionRef} className="car-motion-section" aria-label="Featured vehicle collection">
      <div ref={stageRef} className="car-motion-sticky">
        <div className="car-motion-stage">
          <div className="car-motion-image-wrap">
            <img src={background} alt="Luxury vehicle scene" className="car-motion-background" />
          </div>

          {frames.length > 0 && (
            <img ref={frameRef} src={frames[0]} alt="" aria-hidden="true" className="car-motion-frame" />
          )}

          <div className="car-collection">
            {cars.map((car, index) => (
              <div ref={index === 2 ? slotRef : undefined} className="car-slot" key={index}>
                {car ? (
                  <img ref={index === 0 ? sizeRef : undefined} src={car} alt={'Luxury vehicle ' + (index + 1)} />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarShowcase;
