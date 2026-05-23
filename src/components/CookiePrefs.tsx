import { useState, useEffect } from "react";
import { getConsent, setConsent } from "../lib/consent";
import type { ConsentValue } from "../lib/consent";

export default function CookiePrefs() {
  const [current, setCurrent] = useState<ConsentValue | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setCurrent(getConsent());
  }, []);

  function handle(v: ConsentValue) {
    setConsent(v);
    setCurrent(v);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  let label = "Sin decidir";
  if (current === "accepted") label = "✓ Aceptadas";
  else if (current === "rejected") label = "✗ Rechazadas";

  return (
    <div className="legal__prefs">
      <h2>Tus preferencias</h2>
      <p className="legal__prefs-status">
        Estado actual: <strong>{label}</strong>
        {saved && (
          <span style={{ color: "var(--color-gold)", marginLeft: 10, fontSize: 14 }}>Guardado</span>
        )}
      </p>
      <div className="legal__prefs-actions">
        <button
          className="btn btn--primary"
          onClick={() => handle("accepted")}
          disabled={current === "accepted"}
        >
          Aceptar cookies
        </button>
        <button
          className="btn btn--ghost"
          onClick={() => handle("rejected")}
          disabled={current === "rejected"}
        >
          Rechazar cookies
        </button>
      </div>
    </div>
  );
}
