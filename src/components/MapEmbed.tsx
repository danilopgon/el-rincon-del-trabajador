import { useState, useEffect } from "react";
import { getConsent, setConsent, onConsentChange } from "../lib/consent";

interface Props {
  src: string;
  mapsUrl: string;
}

export default function MapEmbed({ src, mapsUrl }: Props) {
  const [consent, setConsentState] = useState<"accepted" | "rejected" | null>(null);

  useEffect(() => {
    setConsentState(getConsent());
    return onConsentChange((v) => setConsentState(v));
  }, []);

  if (consent === "accepted") {
    return (
      <iframe
        title="Mapa El Rincón del Trabajador"
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        style={{ border: 0, width: "100%", height: "100%" }}
      />
    );
  }

  return (
    <div className="map-placeholder">
      <svg
        className="map-placeholder__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
      <p className="map-placeholder__title">Mapa bloqueado</p>
      <p className="map-placeholder__desc">
        Acepta las cookies para ver el mapa interactivo de Google Maps.
      </p>
      <div className="map-placeholder__actions">
        <button className="btn btn--primary" onClick={() => setConsent("accepted")}>
          Aceptar cookies y ver mapa
        </button>
        <a href={mapsUrl} className="btn btn--ghost" target="_blank" rel="noopener noreferrer">
          Abrir en Google Maps
          <span className="sr-only"> (abre en nueva pestaña)</span>
        </a>
      </div>
    </div>
  );
}
