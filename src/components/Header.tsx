import { useState, useEffect, useRef } from "react";
import { CONTACT } from "../lib/contact";

const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#sectores", label: "Sectores" },
  { href: "#tienda", label: "Tienda" },
  { href: CONTACT.blog, label: "Blog ↗", external: true },
  { href: "#contacto", label: "Contacto" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    if (menuOpen) closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const toInert = [
      document.querySelector<HTMLElement>("main"),
      document.querySelector<HTMLElement>("footer"),
      document.querySelector<HTMLElement>(".wa-fab"),
    ].filter(Boolean) as HTMLElement[];

    toInert.forEach((el) => {
      if (menuOpen) {
        el.setAttribute("inert", "");
      } else {
        el.removeAttribute("inert");
      }
    });

    return () => {
      toInert.forEach((el) => el.removeAttribute("inert"));
    };
  }, [menuOpen]);

  function close() {
    setMenuOpen(false);
  }

  return (
    <>
      <header className={`hdr${scrolled ? " is-scrolled" : ""}`}>
        <div className="wrap hdr__inner">
          <a href="/" className="hdr__logo">
            <img src="/logo-marca.png" alt="El Rincón del Trabajador" width={37} height={52} />
            <div className="hdr__logo-text">
              <strong>El Rincón</strong>
              <span>del Trabajador</span>
            </div>
          </a>

          <nav className="hdr__nav">
            {NAV_LINKS.map(({ href, label, external }) => (
              <a
                key={href}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="hdr__cta">
            <a href={`tel:${CONTACT.phone}`} className="hdr__phone">
              <svg
                aria-hidden={true}
                className="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.9 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" />
              </svg>
              {CONTACT.phoneDisplay}
            </a>
            <a href="#contacto" className="btn btn--gold">
              Pedir presupuesto
              <svg
                aria-hidden={true}
                className="icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </a>
          </div>

          <button
            type="button"
            ref={burgerRef}
            className={`hdr__burger${menuOpen ? " is-open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            <span className="hdr__burger-line" />
            <span className="hdr__burger-line" />
            <span className="hdr__burger-line" />
          </button>
        </div>
      </header>

      <div
        className={`nav-overlay${menuOpen ? " is-open" : ""}`}
        onClick={close}
        aria-hidden="true"
      />

      <nav
        id="mobile-nav"
        className={`nav-drawer${menuOpen ? " is-open" : ""}`}
        aria-label="Menú de navegación"
        aria-hidden={!menuOpen}
      >
        <div className="nav-drawer__header">
          <a href="/" className="hdr__logo" onClick={close}>
            <img src="/logo-marca.png" alt="El Rincón del Trabajador" width={30} height={42} />
            <div className="hdr__logo-text">
              <strong>El Rincón</strong>
              <span>del Trabajador</span>
            </div>
          </a>
          <button
            ref={closeRef}
            className="nav-drawer__close"
            onClick={close}
            aria-label="Cerrar menú"
          >
            <svg
              aria-hidden={true}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <ul className="nav-drawer__links">
          {NAV_LINKS.map(({ href, label, external }) => (
            <li key={href}>
              <a
                href={href}
                onClick={close}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-drawer__footer">
          <a href={`tel:${CONTACT.phone}`} className="nav-drawer__phone">
            <svg
              aria-hidden={true}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.9 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" />
            </svg>
            {CONTACT.phoneDisplay}
          </a>
          <a
            href="#contacto"
            className="btn btn--gold btn--lg"
            style={{ justifyContent: "center" }}
            onClick={close}
          >
            Pedir presupuesto
            <svg
              aria-hidden={true}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
        </div>
      </nav>
    </>
  );
}
