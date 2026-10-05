import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
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

const CarShowcase = ({ onLoadingProgress, onReady }) => {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const slotRef = useRef(null);
  const sizeRef = useRef(null);
  const geometryRef = useRef(null);
  const progressRef = useRef(0);
  const lastFrameRef = useRef(-1);
  const loadingProgressRef = useRef(onLoadingProgress);
  const readyRef = useRef(onReady);

  loadingProgressRef.current = onLoadingProgress;
  readyRef.current = onReady;

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = frameRef.current;
    const slot = slotRef.current;
    const size = sizeRef.current;

    if (!section || !stage || !canvas || !slot || !size) return;
    if (!frameLoaders.length) {
      loadingProgressRef.current?.(100);
      readyRef.current?.();
      return;
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // IMPORTANT: don't create/decode 144 images at startup.
    // Keep a small rolling cache around the current frame instead.
    const imageCache = new Map();
    const loading = new Map();
    const CACHE_RADIUS = window.innerWidth <= 768 ? 3 : 5;
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
        image.src = src;
      });

      loading.set(index, promise);
      return promise;
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
      const priority = [center - 1, center + 1, center - 2, center + 2];

      priority.forEach((index) => {
        if (index >= first && index <= last && !imageCache.has(index)) loadFrame(index);
      });

      const warm = () => {
        for (let index = first; index <= last; index += 1) {
          if (!imageCache.has(index)) loadFrame(index);
        }
      };

      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(warm, { timeout: 120 });
      } else {
        window.setTimeout(warm, 60);
      }
    };

    const updateFromProgress = (progress) => {
      const geometry = geometryRef.current;
      if (!geometry) return;

      const safeProgress = clamp(progress, 0, 1);
      progressRef.current = safeProgress;

      const x = geometry.startX + (geometry.targetX - geometry.startX) * safeProgress;
      const y = geometry.startY + (geometry.targetY - geometry.startY) * safeProgress;
      const scale = 1 + (geometry.targetScale - 1) * safeProgress;

      gsap.set(canvas, {
        x,
        y,
        xPercent: -50,
        yPercent: -50,
        scale,
        force3D: true,
      });

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

    const createScrollAnimation = () => {
      const geometry = geometryRef.current;
      if (!geometry) return;

      const proxy = { progress: progressRef.current };

      gsap.set(canvas, {
        x: geometry.startX,
        y: geometry.startY,
        xPercent: -50,
        yPercent: -50,
        scale: 1,
        force3D: true,
      });

      const render = () => {
        updateFromProgress(proxy.progress);
      };

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'center center',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          proxy.progress = self.progress;
          render();
        },
        onRefresh: () => {
          measure();
        },
      });

      return trigger;
    };

    const preloadAllFrames = async () => {
      let loadedCount = 0;
      const total = frameLoaders.length;

      const updateProgress = () => {
        loadedCount += 1;
        loadingProgressRef.current?.(Math.round((loadedCount / total) * 100));
      };

      for (let start = 0; start < total; start += 8) {
        const batch = frameLoaders.slice(start, start + 8).map((_, offset) => {
          const index = start + offset;
          return loadFrame(index).finally(updateProgress);
        });
        await Promise.all(batch);
      }

      loadingProgressRef.current?.(100);
      readyRef.current?.();
    };

    // Draw the first frame immediately, while the full sequence preloads for the loader.
    lastFrameRef.current = 0;
    loadFrame(0).then((image) => {
      if (image && lastFrameRef.current === 0) drawImage(image);
      warmNearbyFrames(0);
    });
    preloadAllFrames();

    measure();
    const scrollTrigger = createScrollAnimation();
    requestAnimationFrame(() => ScrollTrigger.refresh());
    window.addEventListener('resize', measure);
    window.addEventListener('load', () => ScrollTrigger.refresh());

    return () => {
      scrollTrigger?.kill();
      window.removeEventListener('resize', measure);
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
