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
  const activeRef = useRef(null);

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
    activeRef.current = activeElement;

    const getOffsetLeft = (button) => {
      const buttonRect = button.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();
      return buttonRect.left - navRect.left + (buttonRect.width - activeElement.offsetWidth) / 2;
    };

    const buttons = [...nav.querySelectorAll('li button')];

    const setInitial = () => {
      const activeButton = nav.querySelector('li.active button');
      if (!activeButton) return;
      gsap.set(activeElement, {
        x: getOffsetLeft(activeButton),
        '--active-show': 1,
        '--active-width': '44px',
      });
    };

    const triggerLight = (button, index, oldIndex) => {
      const x = getOffsetLeft(button);
      const oldButton = nav.querySelector('li.active button');
      const oldX = oldButton ? getOffsetLeft(oldButton) : x;
      const distance = Math.abs(x - oldX);
      const direction = index > oldIndex ? 1 : -1;

      nav.classList.add(direction > 0 ? 'after' : 'before');
      nav.querySelectorAll('li').forEach((item) => item.classList.remove('active'));
      button.parentElement.classList.add('active');

      gsap.killTweensOf(activeElement);
      gsap.set(activeElement, {
        x: oldX,
        '--active-show': 1,
        '--active-opacity': 1,
        '--active-element-scale-x': 1,
        '--active-element-scale-y': 1,
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
        '--active-element-show': 1,
        '--active-element-opacity': 1,
        '--active-element-width': `${Math.min(Math.max(distance, 42), nav.offsetWidth - 60)}px`,
        '--active-element-strike-x': '-50%',
        duration: .65,
        ease: 'power2.out',
      });

      // Smoothly retract the travelling light instead of killing it at the end.
      gsap.to(activeElement, {
        '--active-element-width': '42px',
        '--active-element-scale-x': 1,
        '--active-element-scale-y': 1,
        '--active-element-opacity': 1,
        delay: .48,
        duration: .72,
        ease: 'power2.inOut',
        onComplete: () => {
          nav.classList.remove('before', 'after');
          gsap.set(activeElement, {
            x,
            '--active-element-show': 1,
            '--active-element-width': '42px',
            '--active-element-scale-x': 1,
            '--active-element-scale-y': 1,
            '--active-element-opacity': 1,
          });
        },
      });
    };

    buttons.forEach((button, index) => {
      const handleClick = () => {
        const active = nav.querySelector('li.active');
        const oldIndex = active ? [...active.parentElement.children].indexOf(active) : index;
        if (index === oldIndex) return;

        const target = document.querySelector(button.dataset.href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        triggerLight(button, index, oldIndex);
      };
      button.addEventListener('click', handleClick);
      button._veltrixHandler = handleClick;
    });

    document.fonts.ready.then(setInitial);

    const onResize = () => {
      const activeButton = nav.querySelector('li.active button');
      if (activeButton) gsap.set(activeElement, { x: getOffsetLeft(activeButton) });
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      buttons.forEach((button) => {
        if (button._veltrixHandler) button.removeEventListener('click', button._veltrixHandler);
      });
      activeElement.remove();
    };
  }, []);

  return (
    <header className="navbar-header">
      <nav ref={navRef} className="veltrix-nav" aria-label="Main navigation">
        <ul>
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
