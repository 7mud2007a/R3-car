import React, { useEffect, useMemo, useRef, useState } from 'react';
import car01 from '../assets/car-01.png';
import car02 from '../assets/car-02.png';
import car03 from '../assets/car-03.png';
import background from '../assets/hero-car-background.jpg';
import './CarShowcase.css';

const frameModules = import.meta.glob('../assets/car-frames/frame_*.png', { eager: true, import: 'default' });
const frames = Object.entries(frameModules).sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true })).map(([, src]) => src);
const cars = [car01, car02, null, car03];
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const CarShowcase = () => {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const slotRef = useRef(null);
  const sizeRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [motion, setMotion] = useState(null);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      const stage = stageRef.current, frame = frameRef.current, slot = slotRef.current, ref = sizeRef.current;
      if (!stage || !frame || !slot || !ref) return;
      const s = stage.getBoundingClientRect(), f = frame.getBoundingClientRect(), t = slot.getBoundingClientRect(), r = ref.getBoundingClientRect();
      setMotion({ startX: f.left + f.width / 2 - s.left, startY: f.top + f.height / 2 - s.top, targetX: t.left + t.width / 2 - s.left, targetY: t.top + t.height / 2 - s.top, targetScale: r.width / f.width });
    };
    const update = () => {
      raf = 0;
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      setProgress(clamp(-rect.top / travel, 0, 1));
      measure();
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    return () => { if (raf) cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', update); window.removeEventListener('load', update); };
  }, []);

  const frameIndex = useMemo(() => frames.length ? Math.min(frames.length - 1, Math.floor(progress * frames.length)) : 0, [progress]);
  const transform = motion
    ? 'translate3d(' + (motion.startX + (motion.targetX - motion.startX) * progress) + 'px, ' + (motion.startY + (motion.targetY - motion.startY) * progress) + 'px, 0) translate(-50%, -50%) scale(' + (1 + (motion.targetScale - 1) * progress) + ')'
    : 'translate3d(-50%, -50%, 0)';

  return (
    <section ref={sectionRef} className="car-motion-section" aria-label="Featured vehicle collection">
      <div ref={stageRef} className="car-motion-sticky">
        <div className="car-motion-stage">
          <div className="car-motion-image-wrap">
            <img src={background} alt="Luxury vehicle scene" className="car-motion-background" />
            {frames.length > 0 && <img ref={frameRef} src={frames[frameIndex]} alt="" aria-hidden="true" className="car-motion-frame" style={{ transform }} />}
          </div>
          <div className="car-collection">
            {cars.map((car, index) => (
              <div ref={index === 2 ? slotRef : undefined} className={'car-slot ' + (car ? '' : 'car-slot-empty')} key={index}>
                {car ? <img ref={index === 0 ? sizeRef : undefined} src={car} alt={'Luxury vehicle ' + (index + 1)} /> : <span className="slot-marker">FEATURED</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarShowcase;