import { useState, useEffect } from 'react';
import { CONTACT } from '../lib/contact';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`hdr${scrolled ? ' is-scrolled' : ''}`}>
      <div className="wrap hdr__inner">
        <a href="/" className="hdr__logo">
          <img
            src="/logo-marca.png"
            alt="El Rincón del Trabajador"
            width={37}
            height={52}
          />
          <div className="hdr__logo-text">
            <strong>El Rincón</strong>
            <span>del Trabajador</span>
          </div>
        </a>

        <nav className="hdr__nav">
          <a href="#servicios">Servicios</a>
          <a href="#sectores">Sectores</a>
          <a href="#personalizacion">Personalización</a>
          <a href="#tienda">Tienda</a>
          <a href={CONTACT.blog} target="_blank" rel="noopener noreferrer">
            Blog ↗
          </a>
          <a href="#contacto">Contacto</a>
        </nav>

        <div className="hdr__cta">
          <a href={`tel:${CONTACT.phone}`} className="hdr__phone">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.9 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" />
            </svg>
            {CONTACT.phoneDisplay}
          </a>
          <a href="#contacto" className="btn btn--gold">
            Pedir presupuesto
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
