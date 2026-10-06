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
    nav.appendChild(activeElement);
    activeRef.current = activeElement;

    const getOffsetLeft = (element) => {
      const elementRect = element.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();

      return elementRect.left - navRect.left +
        (elementRect.width - activeElement.offsetWidth) / 2;
    };

    const buttons = [...nav.querySelectorAll('li button')];

    const setInitial = () => {
      const activeButton = nav.querySelector('li.active button');
      if (!activeButton) return;

      gsap.set(activeElement, {
        x: getOffsetLeft(activeButton),
        '--active-element-show': 1,
        '--active-element-width': '42px',
      });
    };

    const createSVG = () => {
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
    };

    const activate = (button, index, immediate = false) => {
      const current = nav.querySelector('li.active');
      const oldIndex = current ? [...current.parentElement.children].indexOf(current) : index;
      const x = getOffsetLeft(button);
      const spacing = Math.abs(x - (current ? getOffsetLeft(current.querySelector('button')) : x));

      nav.querySelectorAll('li').forEach((item) => item.classList.remove('active'));
      button.parentElement.classList.add('active');

      if (immediate) {
        gsap.set(activeElement, {
          x,
          '--active-element-show': 1,
          '--active-element-width': '42px',
          '--active-element-opacity': 0,
          '--active-element-scale-x': 1,
          '--active-element-scale-y': 1,
        });
        return;
      }

      const direction = index > oldIndex ? 'after' : 'before';
      nav.classList.add(direction);
      gsap.set(activeElement, { rotateY: direction === 'before' ? 180 : 0 });

      createSVG();

      gsap.to(activeElement, {
        x,
        '--active-element-show': 1,
        '--active-element-opacity': 1,
        '--active-element-width': `${Math.min(Math.max(spacing, 42), nav.offsetWidth - 60)}px`,
        '--active-element-strike-x': '-50%',
        duration: .55,
        ease: 'power2.out',
      });

      gsap.to(activeElement, {
        '--active-element-scale-x': 0,
        '--active-element-scale-y': .25,
        '--active-element-opacity': 0,
        delay: .42,
        duration: .32,
        ease: 'power2.in',
        onComplete: () => {
          activeElement.innerHTML = '';
          nav.classList.remove('before', 'after');
          gsap.set(activeElement, {
            x: getOffsetLeft(button),
            '--active-element-show': 1,
            '--active-element-width': '42px',
            '--active-element-scale-x': 1,
            '--active-element-scale-y': 1,
          });
        },
      });
    };

    const handleClick = (event, button, index) => {
      event.preventDefault();
      const href = button.dataset.href;
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      activate(button, index);
    };

    buttons.forEach((button, index) => {
      button.addEventListener('click', (event) => handleClick(event, button, index));
    });

    const resize = () => {
      const activeButton = nav.querySelector('li.active button');
      if (activeButton) gsap.set(activeElement, { x: getOffsetLeft(activeButton) });
    };

    document.fonts.ready.then(setInitial);
    window.addEventListener('resize', resize);

    return () => {
      buttons.forEach((button, index) => {
        button.removeEventListener('click', (event) => handleClick(event, button, index));
      });
      window.removeEventListener('resize', resize);
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
