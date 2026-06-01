import { useState, useRef } from "react";
import { gsap } from "gsap";

type Tab = "bordado" | "dtf";

const galleries: Record<Tab, { tag: string }[]> = {
  bordado: [
    { tag: "Bordado · Logo empresa" },
    { tag: "Polo bordado" },
    { tag: "Hilatura industrial" },
    { tag: "Prueba en blanco" },
    { tag: "Camisetas terminadas" },
  ],
  dtf: [
    { tag: "DTF · Diseño a todo color" },
    { tag: "Sudadera personalizada" },
    { tag: "Camiseta evento" },
    { tag: "Prensa térmica" },
    { tag: "Detalle impresión" },
  ],
};

export default function Personalizacion() {
  const [tab, setTab] = useState<Tab>("bordado");
  const galleryRef = useRef<HTMLDivElement>(null);

  function switchTab(next: Tab) {
    if (next === tab) return;
    setTab(next);
    // Animate new items in after React re-renders
    requestAnimationFrame(() => {
      if (!galleryRef.current) return;
      const items = galleryRef.current.querySelectorAll<HTMLElement>(".pers__gallery > div");
      gsap.fromTo(
        items,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, stagger: 0.06, ease: "power2.out" }
      );
    });
  }

  const slots = galleries[tab];

  return (
    <section id="personalizacion" className="section">
      <div className="wrap">
        <div className="pers__layout">
          <div className="pers__copy">
            <span className="eyebrow">Personalización</span>
            <h2>
              Tu logo,
              <br />
              con la calidad que merece.
            </h2>
            <p className="lead">
              Bordamos en máquina industrial con hilos de calidad y aplicamos DTF de gran
              resistencia al lavado. Te enseñamos la prueba digital antes de hacer nada en tu prenda.
            </p>
            <div className="pers__tabs" role="tablist">
              <button
                className={`pers__tab${tab === "bordado" ? " is-active" : ""}`}
                onClick={() => switchTab("bordado")}
                role="tab"
                aria-selected={tab === "bordado"}
              >
                Bordado profesional
              </button>
              <button
                className={`pers__tab${tab === "dtf" ? " is-active" : ""}`}
                onClick={() => switchTab("dtf")}
                role="tab"
                aria-selected={tab === "dtf"}
              >
                DTF a color
              </button>
            </div>
            <div className="pers__stats">
              <div>
                <strong>1 ud.</strong>
                <span>pedido mínimo</span>
              </div>
              <div>
                <strong>48 h</strong>
                <span>plazo habitual de prueba</span>
              </div>
            </div>
          </div>

          <div className="pers__gallery" ref={galleryRef}>
            {slots.map((s, i) => (
              <div key={`${tab}-${i}`} style={{ position: "relative" }}>
                {/* TODO: Replace with client photo */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "var(--color-cream-deep)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-gold)"
                    strokeWidth="1.5"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                </div>
                <span className="pers__gallery-tag">{s.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
