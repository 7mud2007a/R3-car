import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Navbar.css';

const navItems = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Collection', href: '#collection' },
  { label: 'Contact', href: '#inquiry' },
];

const lightningPath = `M113.5 6.5L109.068 8.9621C109.023 8.98721 108.974 9.00516 108.923 9.01531L106.889 9.42219C106.661 9.46776 106.432 9.35034 106.336 9.1388L104.045 4.0986C104.015 4.03362 104 3.96307 104 3.8917V2.12268C104 1.6898 103.487 1.46145 103.166 1.75103L99.2887 5.24019C99.1188 5.39305 98.867 5.41132 98.6768 5.28457L95.0699 2.87996C94.7881 2.69205 94.4049 2.83291 94.3118 3.15862L92.6148 9.09827C92.5483 9.33084 92.3249 9.48249 92.0843 9.45843L87.7087 9.02087C87.5752 9.00752 87.4419 9.04839 87.3389 9.13428L84.9485 11.1263C84.7128 11.3227 84.3575 11.2625 84.1996 10.9994L81.7602 6.93359C81.617 6.69492 81.3064 6.61913 81.0694 6.76501L75.3165 10.3052C75.1286 10.4209 74.8871 10.3997 74.7223 10.2531L70.6678 6.64917C70.5611 6.55429 70.5 6.41829 70.5 6.27547V1.20711C70.5 1.0745 70.4473 0.947322 70.3536 0.853553L70.2185 0.718508C70.0846 0.584592 69.8865 0.537831 69.7068 0.59772L69.2675 0.744166C68.9149 0.861705 68.8092 1.30924 69.0721 1.57206L69.605 2.10499C69.8157 2.31571 69.7965 2.66281 69.5638 2.84897L67.5 4.5L65.2715 6.28282C65.1083 6.41338 64.8811 6.42866 64.7019 6.32113L60.3621 3.71725C60.153 3.59179 59.8839 3.63546 59.7252 3.8206L57.0401 6.95327C57.0135 6.9843 56.9908 7.01849 56.9725 7.05505L55.2533 10.4934C55.1188 10.7624 54.779 10.8526 54.5287 10.6858L50.7686 8.17907C50.6051 8.07006 50.3929 8.06694 50.2263 8.17109L46.7094 10.3691C46.5772 10.4516 46.4145 10.468 46.2688 10.4133L42.6586 9.05949C42.5558 9.02091 42.4684 8.94951 42.4102 8.85633L40.1248 5.1997C40.0458 5.07323 40.0273 4.91808 40.0745 4.77659L40.6374 3.08777C40.7755 2.67359 40.3536 2.29381 39.9562 2.47447L35.5 4.5L32.2657 5.88613C32.1013 5.95658 31.9118 5.93386 31.7687 5.82656L30.1904 4.64279C30.0699 4.55245 29.9152 4.5212 29.7691 4.55772L26.2009 5.44977C26.0723 5.48193 25.9617 5.56388 25.8934 5.67759L23.1949 10.1752C23.0796 10.3673 22.8507 10.459 22.6346 10.4003L17.6887 9.05148C17.5674 9.01838 17.463 8.94076 17.3963 8.83409L15.3331 5.53299C15.1627 5.26032 14.7829 5.21707 14.5556 5.44443L12.1464 7.85355C12.0527 7.94732 11.9255 8 11.7929 8H8.15139C8.05268 8 7.95617 7.97078 7.87404 7.91603L3.74143 5.16095C3.59214 5.06142 3.40096 5.04952 3.24047 5.12976L0.5 6.5`;

const createSVG = (element) => {
  element.innerHTML = `
    <svg viewBox="0 0 116 5" preserveAspectRatio="none" class="beam" aria-hidden="true">
      <path d="M0.5 2.5L113 0.534929C114.099 0.515738 115 1.40113 115 2.5C115 3.59887 114.099 4.48426 113 4.46507L0.5 2.5Z" fill="url(#gradient-beam)"/>
      <defs>
        <linearGradient id="gradient-beam" x1="2" y1="2.5" x2="115" y2="2.5" gradientUnits="userSpaceOnUse">
          <stop stop-color="#ff5500"/>
          <stop offset="1" stop-color="#fff1e6"/>
        </linearGradient>
      </defs>
    </svg>
    <div class="strike" aria-hidden="true">
      <svg viewBox="0 0 114 12" preserveAspectRatio="none">
        <g fill="none" stroke="#fff1e6" stroke-width="0.75" stroke-linecap="round">
          <path d="${lightningPath}"/><path d="${lightningPath}"/><path d="${lightningPath}"/>
        </g>
      </svg>
      <svg viewBox="0 0 114 12" preserveAspectRatio="none">
        <g fill="none" stroke="#fff1e6" stroke-width="0.75" stroke-linecap="round">
          <path d="${lightningPath}"/><path d="${lightningPath}"/><path d="${lightningPath}"/>
        </g>
      </svg>
    </div>
  `;
};

const Navbar = () => {
  const navRef = useRef(null);

  useEffect(() => {
    const nav = navRef.current;
    const navElement = nav;
    if (!nav) return undefined;

    const list = nav.querySelector('.main-nav-list');
    const buttons = [...nav.querySelectorAll('.main-nav-list button')];
    const items = [...nav.querySelectorAll('.main-nav-list li')];

    if (!list || !buttons.length) return undefined;

    const activeElement = document.createElement('div');
    activeElement.className = 'active-element';
    navElement.appendChild(activeElement);

    let activeIndex = Math.max(
      0,
      items.findIndex((item) => item.classList.contains('active'))
    );

    let scrollRaf = 0;
    let resizeRaf = 0;
    let unlockTimer = 0;
    let navigationLock = false;

    const getOffsetLeft = (button) => {
      const buttonRect = button.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();

      return (
        buttonRect.left -
        navRect.left +
        (buttonRect.width - activeElement.offsetWidth) / 2
      );
    };

    const renderIndicator = (index, animate = true) => {
      const button = buttons[index];
      if (!button) return;

      const x = getOffsetLeft(button);

      if (!animate) {
        gsap.killTweensOf(activeElement);
        gsap.set(activeElement, {
          x,
          '--active-element-show': '1',
          '--active-element-opacity': '0',
          '--active-element-width': '32px',
          '--active-element-scale-x': '1',
          '--active-element-scale-y': '1',
          '--active-element-strike-x': '0%',
          '--active-element-mask-position': '0%',
          rotateY: 0,
        });
        return;
      }

      gsap.to(activeElement, {
        x,
        duration: 0.6,
        ease: 'power2.inOut',
        overwrite: true,
      });
    };

    const animateTo = (button, index) => {
      const active = navElement.querySelector('ul li.active');
      if (!active || index === activeIndex) return;

      if (navElement.classList.contains('before') || navElement.classList.contains('after')) {
        return;
      }

      const oldIndex = [...active.parentElement.children].indexOf(active);
      const x = getOffsetLeft(button);
      const oldX = getOffsetLeft(active.querySelector('button'));
      const spacing = Math.abs(x - oldX);
      const direction = index > oldIndex ? 'after' : 'before';

      navElement.classList.add(direction);
      active.classList.remove('active');
      button.parentElement.classList.add('active');
      activeIndex = index;

      gsap.killTweensOf(activeElement);

      gsap.set(activeElement, {
        rotateY: direction === 'before' ? '180deg' : '0deg',
        '--active-element-scale-x': '1',
        '--active-element-scale-y': '1',
        '--active-element-width': '32px',
        '--active-element-mask-position': '0%',
        '--active-element-strike-x': '0%',
      });

      gsap.to(activeElement, {
        keyframes: [
          {
            '--active-element-width': `${Math.min(
              spacing,
              Math.max(navElement.offsetWidth - 60, 32)
            )}px`,
            duration: 0.3,
            ease: 'power2.out',
            onStart: () => {
              createSVG(activeElement);
              gsap.to(activeElement, {
                '--active-element-opacity': 1,
                duration: 0.1,
              });
            },
          },
          {
            '--active-element-scale-x': '0',
            '--active-element-scale-y': '.25',
            '--active-element-width': '0px',
            duration: 0.3,
            onStart: () => {
              gsap.to(activeElement, {
                '--active-element-mask-position': '40%',
                duration: 0.5,
              });
              gsap.to(activeElement, {
                '--active-element-opacity': 0,
                delay: 0.45,
                duration: 0.25,
              });
            },
            onComplete: () => {
              activeElement.innerHTML = '';
              navElement.classList.remove('before', 'after');
              activeElement.removeAttribute('style');
              gsap.set(activeElement, {
                x: getOffsetLeft(button),
                '--active-element-show': '1',
              });
            },
          },
        ],
        overwrite: true,
      });

      gsap.to(activeElement, {
        x,
        '--active-element-strike-x': '-50%',
        duration: 0.6,
        ease: 'power2.inOut',
        overwrite: false,
      });
    };

    const setActive = (index, animate = true) => {
      if (index < 0 || index >= items.length || index === activeIndex) {
        if (index === activeIndex) renderIndicator(index, animate);
        return;
      }

      activeIndex = index;

      items.forEach((item, itemIndex) => {
        item.classList.toggle('active', itemIndex === index);
      });

      renderIndicator(index, animate);
    };

    const getCurrentSectionIndex = () => {
      const viewportLine = Math.min(
        window.innerHeight * 0.34,
        Math.max(nav.getBoundingClientRect().bottom + 24, 120)
      );

      let currentIndex = 0;

      navItems.forEach((item, index) => {
        const section = document.querySelector(item.href);
        if (!section) return;

        if (section.getBoundingClientRect().top <= viewportLine) {
          currentIndex = index;
        }
      });

      return currentIndex;
    };

    const updateScrollSpy = () => {
      if (navigationLock) return;

      const nextIndex = getCurrentSectionIndex();

      if (nextIndex !== activeIndex) {
        animateTo(buttons[nextIndex], nextIndex);
      }
    };

    const onScroll = () => {
      if (scrollRaf) return;

      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        updateScrollSpy();
      });
    };

    const onResize = () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);

      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0;
        renderIndicator(activeIndex, false);
      });
    };

    buttons.forEach((button, index) => {
      const handleClick = () => {
        const target = document.querySelector(button.dataset.href);
        if (!target) return;

        if (unlockTimer) {
          window.clearTimeout(unlockTimer);
        }

        navigationLock = true;
        animateTo(button, index);

        const navHeight = nav.getBoundingClientRect().height;
        const targetTop =
          window.scrollY +
          target.getBoundingClientRect().top -
          navHeight -
          8;

        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: 'smooth',
        });

        unlockTimer = window.setTimeout(() => {
          navigationLock = false;

          const correctIndex = getCurrentSectionIndex();
          setActive(correctIndex, false);
        }, 850);
      };

      button.addEventListener('click', handleClick);
      button._veltrixHandler = handleClick;
    });

    const resizeObserver = new ResizeObserver(() => {
      renderIndicator(activeIndex, false);
    });

    resizeObserver.observe(nav);
    resizeObserver.observe(list);

    document.fonts.ready.then(() => {
      const correctIndex = getCurrentSectionIndex();
      activeIndex = correctIndex;

      items.forEach((item, index) => {
        item.classList.toggle('active', index === correctIndex);
      });

      renderIndicator(correctIndex, false);
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    requestAnimationFrame(() => {
      const correctIndex = getCurrentSectionIndex();
      activeIndex = correctIndex;

      items.forEach((item, index) => {
        item.classList.toggle('active', index === correctIndex);
      });

      renderIndicator(correctIndex, false);
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);

      buttons.forEach((button) => {
        if (button._veltrixHandler) {
          button.removeEventListener('click', button._veltrixHandler);
        }
      });

      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      if (unlockTimer) window.clearTimeout(unlockTimer);

      resizeObserver.disconnect();
      gsap.killTweensOf(activeElement);
      activeElement.remove();
    };
  }, []);

  return (
    <header className="navbar-header">
      <nav ref={navRef} className="veltrix-nav" aria-label="Main navigation">
        <ul className="main-nav-list">
          {navItems.map((item, index) => (
            <li className={index === 0 ? 'active' : ''} key={item.href}>
              <button type="button" data-href={item.href}>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
