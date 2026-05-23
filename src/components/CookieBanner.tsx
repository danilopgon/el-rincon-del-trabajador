import { useState, useEffect } from "react";
import { getConsent, setConsent, onConsentChange } from "../lib/consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (getConsent() === null) setVisible(true);
    return onConsentChange(() => setVisible(false));
  }, []);

  function accept() {
    setConsent("accepted");
    setVisible(false);
  }

  function reject() {
    setConsent("rejected");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="region" aria-label="Aviso de cookies" aria-live="polite">
      <p className="cookie-banner__text">
        Usamos tecnologías propias y de terceros (Google Maps) para mejorar tu experiencia en la
        web. Puedes aceptarlas, rechazarlas o <a href="/cookies">leer más</a>.
      </p>
      <div className="cookie-banner__actions">
        <button onClick={reject} className="cookie-banner__btn cookie-banner__btn--ghost">
          Rechazar
        </button>
        <button onClick={accept} className="cookie-banner__btn cookie-banner__btn--primary">
          Aceptar todo
        </button>
      </div>
    </div>
  );
}
