import React, { useEffect, useState } from 'react';
import './Navbar.css';

const navItems = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Collection', href: '#collection' },
  { label: 'Contact', href: '#inquiry' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.classList.toggle('nav-menu-open', open);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('nav-menu-open');
    };
  }, [open]);

  const navigateTo = (href) => {
    const target = document.querySelector(href);
    if (!target) return;

    setOpen(false);

    window.setTimeout(() => {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 80);
  };

  return (
    <header className="navbar-header">
      <nav className={`veltrix-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">
        <button
          type="button"
          className="hamburger-toggle"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="hamburger-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="hamburger-label">MENU</span>
        </button>

        <div className="nav-menu-panel" aria-hidden={!open}>
          <div className="nav-menu-inner">
            <div className="nav-menu-kicker">R3 / AUTOMOTIVE</div>

            <ul className="nav-menu-list">
              {navItems.map((item, index) => (
                <li key={item.href} style={{ '--item-index': index }}>
                  <button
                    type="button"
                    tabIndex={open ? 0 : -1}
                    onClick={() => navigateTo(item.href)}
                  >
                    <span className="nav-menu-number">0{index + 1}</span>
                    <span className="nav-menu-title">{item.label}</span>
                    <span className="nav-menu-arrow" aria-hidden="true">↗</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="nav-menu-footer">
              <span>PRECISION / PERFORMANCE / PRESENCE</span>
              <span>R3</span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
