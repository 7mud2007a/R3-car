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
  const touchRef = useRef(null);
  const rafRef = useRef(0);
  const progressRef = useRef(0);
  const lastFrameRef = useRef(-1);
  const loadedFramesRef = useRef([]);
  const drawReadyRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const frame = frameRef.current;
    const slot = slotRef.current;
    const size = sizeRef.current;

    if (!section || !stage || !frame || !slot || !size || !frames.length) return;

    const images = frames.map((src) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = src;
      return image;
    });
    loadedFramesRef.current = images;

    const drawFrame = (index) => {
      const image = images[index];
      if (!image || !image.complete || !image.naturalWidth) return;

      const ctx = frame.getContext('2d');
      if (!ctx) return;

      if (frame.width !== image.naturalWidth || frame.height !== image.naturalHeight) {
        frame.width = image.naturalWidth;
        frame.height = image.naturalHeight;
      }

      ctx.clearRect(0, 0, frame.width, frame.height);
      ctx.drawImage(image, 0, 0);
      drawReadyRef.current = true;
    };

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

      updateFromProgress(progressRef.current);
    };

    const updateFromProgress = (progress) => {
      const geometry = geometryRef.current;
      if (!geometry) return;

      const safeProgress = clamp(progress, 0, 1);
      progressRef.current = safeProgress;

      const x = geometry.startX + (geometry.targetX - geometry.startX) * safeProgress;
      const y = geometry.startY + (geometry.targetY - geometry.startY) * safeProgress;
      const scale = 1 + (geometry.targetScale - 1) * safeProgress;

      frame.style.transform =
        'translate3d(' + x + 'px,' + y + 'px,0) translate(-50%,-50%) scale(' + scale + ')';

      const frameIndex = Math.min(
        frames.length - 1,
        Math.floor(safeProgress * (frames.length - 1) + 0.00001),
      );

      if (frameIndex !== lastFrameRef.current) {
        lastFrameRef.current = frameIndex;
        drawFrame(frameIndex);
      }
    };

    const updateFromScroll = () => {
      rafRef.current = 0;
      const geometry = geometryRef.current;
      if (!geometry) return;

      const progress = clamp(
        -section.getBoundingClientRect().top / geometry.travel,
        0,
        1,
      );

      updateFromProgress(progress);
    };

    const requestScrollUpdate = () => {
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(updateFromScroll);
      }
    };

    const onTouchStart = (event) => {
      const touch = event.touches[0];
      if (!touch) return;

      const geometry = geometryRef.current;
      if (!geometry) return;

      touchRef.current = {
        startY: touch.clientY,
        startProgress: progressRef.current,
        travel: geometry.travel,
      };
    };

    const onTouchMove = (event) => {
      const touch = event.touches[0];
      const gesture = touchRef.current;
      if (!touch || !gesture) return;

      // Update immediately from the finger movement itself instead of waiting
      // for the browser to finish the scroll gesture.
      const deltaY = gesture.startY - touch.clientY;
      const nextProgress = gesture.startProgress + deltaY / gesture.travel;
      updateFromProgress(nextProgress);
    };

    const onTouchEnd = () => {
      touchRef.current = null;
      requestScrollUpdate();
    };

    images.forEach((image, index) => {
      image.onload = () => {
        if (index === 0 && !drawReadyRef.current) drawFrame(0);
      };
    });

    measure();
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', requestScrollUpdate);
      window.removeEventListener('resize', measure);
      window.removeEventListener('load', measure);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []);

  return (
    <section ref={sectionRef} className="car-motion-section" aria-label="Featured vehicle collection">
      <div ref={stageRef} className="car-motion-sticky">
        <div className="car-motion-stage">
          <div className="car-motion-image-wrap">
            <img src={background} alt="Luxury vehicle scene" className="car-motion-background" />
          </div>

          <canvas
            ref={frameRef}
            aria-hidden="true"
            className="car-motion-frame"
          />

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
