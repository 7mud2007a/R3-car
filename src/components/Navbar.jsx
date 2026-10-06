import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Navbar.css';

const navItems = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Collection', href: '#collection' },
  { label: 'Contact', href: '#inquiry' },
];

const Navbar = () => {
  const navRef = useRef(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return undefined;

    const list = nav.querySelector('.main-nav-list');
    const buttons = [...nav.querySelectorAll('.main-nav-list button')];
    const items = [...nav.querySelectorAll('.main-nav-list li')];

    if (!list || !buttons.length) return undefined;

    const activeElement = document.createElement('div');
    activeElement.className = 'active-element';
    activeElement.innerHTML = `
      <svg viewBox="0 0 116 5" preserveAspectRatio="none" class="beam" aria-hidden="true">
        <defs>
          <linearGradient id="veltrix-beam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#d2691e" stop-opacity="0"/>
            <stop offset=".35" stop-color="#d2691e"/>
            <stop offset="1" stop-color="#faf3e1"/>
          </linearGradient>
        </defs>
        <path d="M0 2.5 L113 0.5 Q116 2.5 113 4.5 Z" fill="url(#veltrix-beam)"/>
      </svg>
      <div class="strike" aria-hidden="true">
        <svg viewBox="0 0 114 12" preserveAspectRatio="none">
          <path d="M1 7 C15 1, 27 11, 42 5 S69 2, 82 7 S102 10, 113 4"
            fill="none" stroke="#faf3e1" stroke-width=".75" stroke-linecap="round"/>
        </svg>
      </div>
    `;
    nav.appendChild(activeElement);

    let activeIndex = Math.max(
      0,
      items.findIndex((item) => item.classList.contains('active'))
    );

    let scrollRaf = 0;
    let resizeRaf = 0;
    let unlockTimer = 0;
    let navigationLock = false;

    const getButtonPosition = (button) => {
      const buttonRect = button.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();

      return {
        left: buttonRect.left - navRect.left,
        width: buttonRect.width,
      };
    };

    const renderIndicator = (index, animate = true) => {
      const button = buttons[index];
      if (!button) return;

      const { left, width } = getButtonPosition(button);

      gsap.killTweensOf(activeElement);

      if (!animate) {
        gsap.set(activeElement, {
          x: left,
          width,
          '--active-element-show': 1,
          '--active-element-opacity': 0,
          rotateY: 0,
        });
        return;
      }

      gsap.set(activeElement, {
        '--active-element-show': 1,
        '--active-element-opacity': 1,
      });

      gsap.to(activeElement, {
        x: left,
        width,
        duration: 0.68,
        ease: 'power3.out',
        overwrite: true,
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
        setActive(nextIndex, true);
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
        setActive(index, true);

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
