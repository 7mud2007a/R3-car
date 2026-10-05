import React, { useEffect, useRef } from 'react';
import car01 from '../assets/car-01.png';
import car02 from '../assets/car-02.png';
import car03 from '../assets/car-03.png';
import background from '../assets/hero-car-background.jpg';
import './CarShowcase.css';

const frameModules = import.meta.glob('../assets/car-frames/frame_*.webp', {
  import: 'default',
});
const frameLoaders = Object.entries(frameModules)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, loader]) => loader);

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

    if (!section || !stage || !canvas || !slot || !size || !frameLoaders.length) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // IMPORTANT: don't create/decode 144 images at startup.
    // Keep a small rolling cache around the current frame instead.
    const imageCache = new Map();
    const loading = new Map();
    const CACHE_RADIUS = window.innerWidth <= 768 ? 4 : 6;
    const MAX_CANVAS_WIDTH = window.innerWidth <= 768 ? 820 : 1200;

    const loadFrame = (index) => {
      if (index < 0 || index >= frameLoaders.length) return Promise.resolve(null);
      if (imageCache.has(index)) return Promise.resolve(imageCache.get(index));
      if (loading.has(index)) return loading.get(index);

      const promise = new Promise(async (resolve) => {
        let src = null;
        try {
          src = await frameLoaders[index]();
        } catch {
          loading.delete(index);
          resolve(null);
          return;
        }
        const image = new Image();
        image.decoding = 'async';
        image.onload = () => {
          imageCache.set(index, image);
          loading.delete(index);
          resolve(image);
        };
        image.onerror = () => {
          loading.delete(index);
          resolve(null);
        };
        image.src = frames[index];
      });

      loading.set(index, promise);
      return promise;
    };

    const trimCache = (center) => {
      for (const index of imageCache.keys()) {
        if (Math.abs(index - center) > CACHE_RADIUS + 4) {
          imageCache.delete(index);
        }
      }
    };

    const drawImage = (image) => {
      if (!image || !image.naturalWidth) return;

      const ratio = image.naturalHeight / image.naturalWidth;
      const width = Math.min(image.naturalWidth, MAX_CANVAS_WIDTH);
      const height = Math.max(1, Math.round(width * ratio));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(image, 0, 0, width, height);
    };

    const requestFrame = async (index) => {
      const image = await loadFrame(index);
      if (image && index === lastFrameRef.current) drawImage(image);
    };

    const warmNearbyFrames = (center) => {
      const first = Math.max(0, center - CACHE_RADIUS);
      const last = Math.min(frameLoaders.length - 1, center + CACHE_RADIUS);

      for (let index = first; index <= last; index += 1) {
        if (!imageCache.has(index)) loadFrame(index);
      }

      trimCache(center);
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
        frameLoaders.length - 1,
        Math.floor(safeProgress * (frameLoaders.length - 1)),
      );

      if (frameIndex !== lastFrameRef.current) {
        lastFrameRef.current = frameIndex;

        const cached = imageCache.get(frameIndex);
        if (cached) {
          drawImage(cached);
        } else {
          requestFrame(frameIndex);
        }

        warmNearbyFrames(frameIndex);
      }
    };

    const measure = () => {
      const stageRect = stage.getBoundingClientRect();
      const imageRect = stage.querySelector('.car-motion-image-wrap').getBoundingClientRect();
      const slotRect = slot.getBoundingClientRect();
      const sizeRect = size.getBoundingClientRect();

      geometryRef.current = {
        startX: imageRect.left + imageRect.width / 2 - stageRect.left,
        startY: imageRect.top + imageRect.height / 2 - stageRect.top + window.innerHeight * 0.07,
        targetX: slotRect.left + slotRect.width / 2 - stageRect.left,
        targetY: slotRect.bottom - sizeRect.height / 2 - stageRect.top,
        targetScale: sizeRect.width / Math.max(canvas.offsetWidth, 1),
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
      touchRef.current = null;
      requestScrollUpdate();
    };

    // Only load the first frame immediately.
    lastFrameRef.current = 0;
    loadFrame(0).then((image) => {
      if (image && lastFrameRef.current === 0) drawImage(image);
      warmNearbyFrames(0);
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
      imageCache.clear();
      loading.clear();
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
