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
    activeElement.innerHTML = '<span class="active-beam"></span><span class="active-flare"></span>';
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
        '--active-width': '44px',
        '--active-scale': 1,
      });

      gsap.timeline({
        onComplete: () => nav.classList.remove('before', 'after'),
      })
        .to(activeElement, {
          x: x,
          '--active-width': Math.min(Math.max(distance + 44, 90), 240) + 'px',
          duration: 0.38,
          ease: 'power2.inOut',
        })
        .to(activeElement, {
          '--active-scale': 0.18,
          '--active-opacity': 0,
          duration: 0.24,
          ease: 'power3.out',
        }, '-=0.04')
        .set(activeElement, {
          x,
          '--active-width': '44px',
          '--active-scale': 1,
          '--active-opacity': 1,
        });
    };

    buttons.forEach((button, index) => {
      button.addEventListener('click', () => {
        const active = nav.querySelector('li.active');
        const oldIndex = active ? [...active.parentElement.children].indexOf(active) : index;
        if (index === oldIndex) return;

        const target = document.querySelector(button.dataset.href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        triggerLight(button, index, oldIndex);
      });
    });

    document.fonts.ready.then(setInitial);

    const onResize = () => {
      const activeButton = nav.querySelector('li.active button');
      if (activeButton) gsap.set(activeElement, { x: getOffsetLeft(activeButton) });
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
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
