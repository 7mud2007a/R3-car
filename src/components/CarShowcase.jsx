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
  const touchRafRef = useRef(0);
  const pendingProgressRef = useRef(null);
  const progressRef = useRef(0);
  const lastFrameRef = useRef(-1);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = frameRef.current;
    const slot = slotRef.current;
    const size = sizeRef.current;

    if (!section || !stage || !canvas || !slot || !size || !frames.length) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Preload every frame once. The files are compact WebP assets, so the
    // animation can change frames immediately while the finger is moving.
    const images = frames.map((src) => {
      const image = new Image();
      image.decoding = 'async';
      image.loading = 'eager';
      image.src = src;
      return image;
    });

    const drawFrame = (index) => {
      const image = images[index];
      if (!image || !image.complete || !image.naturalWidth) return;

      if (canvas.width !== image.naturalWidth || canvas.height !== image.naturalHeight) {
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);
    };

    const updateFromProgress = (progress) => {
      const geometry = geometryRef.current;
      if (!geometry) return;

      const safeProgress = clamp(progress, 0, 1);
      progressRef.current = safeProgress;

      const x = geometry.startX + (geometry.targetX - geometry.startX) * safeProgress;
      const y = geometry.startY + (geometry.targetY - geometry.startY) * safeProgress;
      const scale = 1 + (geometry.targetScale - 1) * safeProgress;

      canvas.style.transform =
        'translate3d(' + x + 'px,' + y + 'px,0) translate(-50%,-50%) scale(' + scale + ')';

      const frameIndex = Math.min(
        frames.length - 1,
        Math.floor(safeProgress * (frames.length - 1)),
      );

      if (frameIndex !== lastFrameRef.current) {
        lastFrameRef.current = frameIndex;
        drawFrame(frameIndex);
      }
    };

    const measure = () => {
      const stageRect = stage.getBoundingClientRect();
      const imageRect = stage.querySelector('.car-motion-image-wrap').getBoundingClientRect();
      const slotRect = slot.getBoundingClientRect();
      const sizeRect = size.getBoundingClientRect();

      geometryRef.current = {
        startX: imageRect.left + imageRect.width / 2 - stageRect.left,
        // Start slightly lower inside the hero background.
        startY: imageRect.top + imageRect.height / 2 - stageRect.top + window.innerHeight * 0.07,
        targetX: slotRect.left + slotRect.width / 2 - stageRect.left,
        targetY: slotRect.bottom - sizeRect.height / 2 - stageRect.top,
        targetScale: sizeRect.width / canvas.offsetWidth,
        travel: Math.max(section.offsetHeight - window.innerHeight, 1),
      };

      updateFromProgress(progressRef.current);
    };

    const updateFromScroll = () => {
      rafRef.current = 0;
      const geometry = geometryRef.current;
      if (!geometry || touchRef.current) return;

      updateFromProgress(
        clamp(-section.getBoundingClientRect().top / geometry.travel, 0, 1),
      );
    };

    const requestScrollUpdate = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(updateFromScroll);
    };

    const flushTouch = () => {
      touchRafRef.current = 0;
      const progress = pendingProgressRef.current;
      if (progress !== null) {
        pendingProgressRef.current = null;
        updateFromProgress(progress);
      }
    };

    const onTouchStart = (event) => {
      const touch = event.touches[0];
      const geometry = geometryRef.current;
      if (!touch || !geometry) return;

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

      const deltaY = gesture.startY - touch.clientY;

      // Slightly faster than the native 1:1 finger distance, while keeping
      // the movement directly tied to the finger.
      pendingProgressRef.current = clamp(
        gesture.startProgress + (deltaY * 1.12) / gesture.travel,
        0,
        1,
      );

      if (!touchRafRef.current) {
        touchRafRef.current = requestAnimationFrame(flushTouch);
      }
    };

    const onTouchEnd = () => {
      // Do not cancel native scrolling. Mobile browsers keep their natural
      // momentum after the finger leaves the screen, so the car follows it
      // smoothly until the scroll comes to rest.
      touchRef.current = null;
      requestScrollUpdate();
    };

    images.forEach((image, index) => {
      image.onload = () => {
        if (index === 0 && lastFrameRef.current < 0) {
          lastFrameRef.current = 0;
          drawFrame(0);
        }
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
      if (touchRafRef.current) cancelAnimationFrame(touchRafRef.current);
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

          <canvas ref={frameRef} aria-hidden="true" className="car-motion-frame" />

          <div className="car-collection">
            {cars.map((car, index) => (
              <div ref={index === 2 ? slotRef : undefined} className="car-slot" key={index}>
                {car ? (
                  <img
                    ref={index === 0 ? sizeRef : undefined}
                    src={car}
                    alt={'Luxury vehicle ' + (index + 1)}
                  />
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
