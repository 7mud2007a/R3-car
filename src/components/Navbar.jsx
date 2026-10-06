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
    if (!nav) return;

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

    const getOffsetLeft = (button) => {
      const buttonRect = button.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();
      return buttonRect.left - navRect.left + (buttonRect.width - activeElement.offsetWidth) / 2;
    };

    const buttons = [...nav.querySelectorAll('.main-nav-list li button')];
    let navigationLock = null;
    const setInitial = () => {
      const activeButton = nav.querySelector('.main-nav-list li.active button');
      if (!activeButton) return;

      const activeIndex = [...nav.querySelectorAll('.main-nav-list li')].indexOf(activeButton.parentElement);
      gsap.set(activeElement, {
        x: getOffsetLeft(activeButton),
        '--active-element-show': 1,
        '--active-element-width': '44px',
      });
    };

    const setActiveFromScroll = () => {
      if (navigationLock) return;

      const sections = navItems
        .map((item) => document.querySelector(item.href))
        .filter(Boolean);

      if (!sections.length) return;

      const viewportPoint = window.innerHeight * 0.35;
      let closestIndex = 0;
      let closestDistance = Infinity;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs((rect.top + rect.height / 2) - viewportPoint);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      const active = nav.querySelector('.main-nav-list li.active');
      const currentIndex = active ? [...active.parentElement.children].indexOf(active) : -1;

      if (currentIndex !== closestIndex) {
        const button = buttons[closestIndex];
        if (button) triggerLight(button, closestIndex, currentIndex < 0 ? closestIndex : currentIndex);
      }
    };

    const triggerLight = (button, index, oldIndex) => {
      const x = getOffsetLeft(button);
      const oldButton = nav.querySelector('.main-nav-list li.active button');
      const oldX = oldButton ? getOffsetLeft(oldButton) : x;
      const distance = Math.abs(x - oldX);
      const direction = index > oldIndex ? 1 : -1;

      nav.classList.add(direction > 0 ? 'after' : 'before');
      nav.querySelectorAll('.main-nav-list li').forEach((item) => item.classList.remove('active'));
      button.parentElement.classList.add('active');

      gsap.killTweensOf(activeElement);
      gsap.set(activeElement, {
        x: oldX,
        '--active-element-show': 1,
        '--active-element-opacity': 1,
        '--active-element-width': '42px',
      });

      gsap.set(activeElement, { rotateY: direction < 0 ? 180 : 0 });

      activeElement.innerHTML = `
        <svg viewBox="0 0 116 5" preserveAspectRatio="none" class="beam" aria-hidden="true">
          <defs>
            <linearGradient id="veltrix-beam-transition" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="#d2691e" stop-opacity="0"/>
              <stop offset=".35" stop-color="#d2691e"/>
              <stop offset="1" stop-color="#faf3e1"/>
            </linearGradient>
          </defs>
          <path d="M0 2.5 L113 0.5 Q116 2.5 113 4.5 Z" fill="url(#veltrix-beam-transition)"/>
        </svg>
        <div class="strike" aria-hidden="true">
          <svg viewBox="0 0 114 12" preserveAspectRatio="none">
            <path d="M1 7 C15 1, 27 11, 42 5 S69 2, 82 7 S102 10, 113 4"
              fill="none" stroke="#faf3e1" stroke-width=".75" stroke-linecap="round"/>
          </svg>
        </div>
      `;

      gsap.to(activeElement, {
        x,
        '--active-element-width': `${Math.min(Math.max(distance, 42), nav.offsetWidth - 60)}px`,
        duration: .65,
        ease: 'power2.out',
      });

      gsap.to(activeElement, {
        '--active-element-width': '42px',
        '--active-element-opacity': 0,
        delay: .5,
        duration: .75,
        ease: 'power2.inOut',
        onComplete: () => {
          activeElement.innerHTML = '';
          nav.classList.remove('before', 'after');
          gsap.set(activeElement, {
            x,
            '--active-element-show': 1,
            '--active-element-width': '42px',
            '--active-element-opacity': 0,
          });
        },
      });
    };

    buttons.forEach((button, index) => {
      const handleClick = () => {
        const active = nav.querySelector('.main-nav-list li.active');
        const oldIndex = active ? [...active.parentElement.children].indexOf(active) : index;

        if (index === oldIndex) return;

        const target = document.querySelector(button.dataset.href);
        triggerLight(button, index, oldIndex);

        if (navigationLock) window.clearTimeout(navigationLock);
        navigationLock = window.setTimeout(() => {
          navigationLock = null;
          setActiveFromScroll();
        }, 900);

        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };

      button.addEventListener('click', handleClick);
      button._veltrixHandler = handleClick;
    });

    document.fonts.ready.then(setInitial);

    const onResize = () => {
      const activeButton = nav.querySelector('.main-nav-list li.active button');
      if (activeButton) gsap.set(activeElement, { x: getOffsetLeft(activeButton) });
    };

    window.addEventListener('resize', onResize);

    let scrollTicking = false;
    const onScroll = () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          setActiveFromScroll();
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.requestAnimationFrame(setActiveFromScroll);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);

      buttons.forEach((button) => {
        if (button._veltrixHandler) {
          button.removeEventListener('click', button._veltrixHandler);
        }
      });

      if (navigationLock) window.clearTimeout(navigationLock);
      activeElement.remove();
    };
  }, []);

  const renderItems = (className = '') => (
    <ul className={className}>
      {navItems.map((item, index) => (
        <li className={index === 0 ? 'active' : ''} key={item.href}>
          <button type="button" data-href={item.href}>{item.label}</button>
        </li>
      ))}
    </ul>
  );

  return (
    <header className="navbar-header">
      <nav ref={navRef} className="veltrix-nav" aria-label="Main navigation">
        {renderItems('main-nav-list')}

      </nav>
    </header>
  );
};

export default Navbar;
