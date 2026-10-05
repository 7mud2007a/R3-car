import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import car01 from '../assets/car-01.png';
import car02 from '../assets/car-02.png';
import car03 from '../assets/car-03.png';
import background from '../assets/hero-car-background.jpg';
import './CarShowcase.css';

gsap.registerPlugin(ScrollTrigger);

const frameModules = import.meta.glob('../assets/car-frames/frame_*.webp', {
  import: 'default',
});
const frameLoaders = Object.entries(frameModules)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, loader]) => loader);

const cars = [car01, car02, null, car03];

const CarShowcase = () => {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const slotRef = useRef(null);
  const sizeRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const canvas = frameRef.current;
    const slot = slotRef.current;
    const size = sizeRef.current;

    if (!section || !stage || !canvas || !slot || !size || !frameLoaders.length) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const cache = new Map();
    const loading = new Map();
    const maxWidth = window.innerWidth <= 768 ? 820 : 1200;
    const preloadRadius = window.innerWidth <= 768 ? 5 : 8;
    let currentFrame = -1;

    const loadFrame = (index) => {
      if (index < 0 || index >= frameLoaders.length) return Promise.resolve(null);
      if (cache.has(index)) return Promise.resolve(cache.get(index));
      if (loading.has(index)) return loading.get(index);

      const promise = frameLoaders[index]()
        .then((src) => new Promise((resolve) => {
          const image = new Image();
          image.decoding = 'async';
          image.onload = () => {
            cache.set(index, image);
            loading.delete(index);
            resolve(image);
          };
          image.onerror = () => {
            loading.delete(index);
            resolve(null);
          };
          image.src = src;
        }))
        .catch(() => {
          loading.delete(index);
          return null;
        });

      loading.set(index, promise);
      return promise;
    };

    const drawFrame = (index) => {
      if (index === currentFrame && canvas.width) return;
      currentFrame = index;

      const cached = cache.get(index);
      if (!cached) {
        loadFrame(index).then((image) => {
          if (image && index === currentFrame) drawFrame(index);
        });
        return;
      }

      const ratio = cached.naturalHeight / cached.naturalWidth;
      const width = Math.min(cached.naturalWidth, maxWidth);
      const height = Math.max(1, Math.round(width * ratio));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(cached, 0, 0, width, height);
    };

    const preloadAround = (center) => {
      const first = Math.max(0, center - preloadRadius);
      const last = Math.min(frameLoaders.length - 1, center + preloadRadius);
      for (let i = first; i <= last; i += 1) {
        if (!cache.has(i)) loadFrame(i);
      }
    };

    const measure = () => {
      const stageRect = stage.getBoundingClientRect();
      const imageRect = stage.querySelector('.car-motion-image-wrap').getBoundingClientRect();
      const slotRect = slot.getBoundingClientRect();
      const sizeRect = size.getBoundingClientRect();

      return {
        startX: imageRect.left + imageRect.width / 2 - stageRect.left,
        startY: imageRect.top + imageRect.height / 2 - stageRect.top + window.innerHeight * 0.07,
        targetX: slotRect.left + slotRect.width / 2 - stageRect.left,
        targetY: slotRect.bottom - sizeRect.height / 2 - stageRect.top,
        targetScale: sizeRect.width / Math.max(canvas.offsetWidth, 1),
      };
    };

    const drawFirstFrame = async () => {
      const image = await loadFrame(0);
      if (!image) return;
      drawFrame(0);
      preloadAround(0);
    };

    const ctxSafe = gsap.context(() => {
      drawFirstFrame();

      const geometry = measure();
      const proxy = { progress: 0 };

      gsap.set(canvas, {
        x: geometry.startX,
        y: geometry.startY,
        xPercent: -50,
        yPercent: -50,
        scale: 1,
        force3D: true,
      });

      const render = () => {
        const p = proxy.progress;
        const x = geometry.startX + (geometry.targetX - geometry.startX) * p;
        const y = geometry.startY + (geometry.targetY - geometry.startY) * p;
        const scale = 1 + (geometry.targetScale - 1) * p;

        gsap.set(canvas, { x, y, scale });

        const frameIndex = Math.min(
          frameLoaders.length - 1,
          Math.round(p * (frameLoaders.length - 1)),
        );
        drawFrame(frameIndex);
        preloadAround(frameIndex);
      };

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.32,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          proxy.progress = self.progress;
          render();
        },
        onRefresh: () => {
          Object.assign(geometry, measure());
          render();
        },
      });

      window.addEventListener('load', ScrollTrigger.refresh);
      ScrollTrigger.refresh();

      return () => window.removeEventListener('load', ScrollTrigger.refresh);
    }, stage);

    return () => ctxSafe.revert();
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
