import React from 'react';
import './CarGallery.css';

const cars = [
  {
    src: '/Cars/IMG_20261006_145112.jpg',
    name: 'R3 GT',
    type: 'Grand Touring',
    specs: ['V8 Twin Turbo', '620 HP', 'AWD'],
    price: '$184,900',
  },
  {
    src: '/Cars/IMG_20261006_145026.jpg',
    name: 'R3 Blackline',
    type: 'Performance Coupe',
    specs: ['V8 4.0L', '603 HP', '0–100 km/h 3.4s'],
    price: '$209,500',
  },
  {
    src: '/Cars/IMG_20261006_145036.jpg',
    name: 'R3 Apex',
    type: 'Sport Series',
    specs: ['V8 Hybrid', '671 HP', 'AWD'],
    price: '$238,000',
  },
  {
    src: '/Cars/IMG_20261006_145048.jpg',
    name: 'R3 Executive',
    type: 'Luxury Sedan',
    specs: ['V6 Twin Turbo', '480 HP', 'AWD'],
    price: '$156,900',
  },
  {
    src: '/Cars/IMG_20261006_145055.jpg',
    name: 'R3 Sovereign',
    type: 'Luxury Performance',
    specs: ['V8 4.4L', '625 HP', '0–100 km/h 3.8s'],
    price: '$224,900',
  },
];

const CarGallery = () => (
  <section id="collection" className="car-gallery" aria-label="R3 car collection">
    <div className="car-gallery-shell">
      <header className="car-gallery-header">
        <div>
          <span className="car-gallery-eyebrow">R3 / COLLECTION</span>
          <h2>Choose Your <em>Drive.</em></h2>
        </div>
        <p>
          A curated selection of performance and luxury machines,
          presented with the R3 signature.
        </p>
      </header>

      <div className="car-gallery-grid">
        {cars.map((car, index) => (
          <article className="car-card" key={car.src}>
            <div className="car-card-image">
              <img src={car.src} alt={car.name} loading={index < 2 ? 'eager' : 'lazy'} draggable="false" />
              <div className="car-card-overlay" />
              <span className="car-card-number">0{index + 1}</span>
              <span className="car-card-type">{car.type}</span>
            </div>

            <div className="car-card-content">
              <div className="car-card-heading">
                <div>
                  <span className="car-card-label">R3 SERIES</span>
                  <h3>{car.name}</h3>
                </div>
                <strong>{car.price}</strong>
              </div>

              <div className="car-card-specs">
                {car.specs.map((spec) => (
                  <span key={spec}>{spec}</span>
                ))}
              </div>

              <button type="button" className="car-card-action">
                <span>Explore vehicle</span>
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default CarGallery;
