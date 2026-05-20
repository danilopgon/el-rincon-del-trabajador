import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { CONTACT } from "../lib/contact";

const questions = [
  {
    q: "¿Bordáis a partir de cuántas unidades?",
    a: "Desde una sola prenda. Si es para una empresa con varias tallas, te asesoramos sobre cuántas piezas pedir para ajustar el coste por unidad.",
  },
  {
    q: "¿Cuánto tarda un pedido personalizado?",
    a: "El plazo habitual es 48–72 horas desde la aprobación de la prueba digital. En pedidos grandes (a partir de 30 piezas) lo concretamos al hacer presupuesto.",
  },
  {
    q: "¿Trabajáis con empresas de fuera de Tarancón?",
    a: "Sí. Tenemos clientes en toda Cuenca, Madrid y Toledo. Enviamos por agencia y, si necesitas tomar tallas, podemos coordinarlo en tu instalación.",
  },
  {
    q: "¿Qué diferencia hay entre bordado y DTF?",
    a: "El bordado da un acabado de calidad superior y aguanta mejor el lavado industrial; es ideal para logos pequeños. El DTF permite imprimir cualquier diseño a todo color, perfecto para camisetas de evento o gráficos complejos.",
  },
  {
    q: "¿Aceptáis devoluciones?",
    a: "Las prendas sin personalizar admiten cambio o devolución en 15 días. Las prendas bordadas o impresas, al ser únicas, no se cambian salvo defecto de fabricación.",
  },
  {
    q: "¿Puedo hacer el pedido sin pasar por la tienda?",
    a: "Claro. Mándanos por WhatsApp tu logo, tallas y prenda de referencia y te pasamos presupuesto el mismo día. Enviamos a domicilio o lo recoges cuando puedas.",
  },
];

function FAQItem({
  q,
  a,
  isOpen,
  onToggle,
  index,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const btnId = `faq-btn-${index}`;
  const panelId = `faq-panel-${index}`;

  useEffect(() => {
    if (!panelRef.current) return;
    gsap.to(panelRef.current, {
      maxHeight: isOpen ? panelRef.current.scrollHeight : 0,
      paddingTop: isOpen ? 16 : 0,
      duration: 0.32,
      ease: "power2.inOut",
    });
  }, [isOpen]);

  return (
    <div className={`faq__item${isOpen ? " is-open" : ""}`}>
      <button
        id={btnId}
        type="button"
        className="faq__item-btn"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <div className="faq__item-q">
          <span>{q}</span>
          <span className="faq__item-icon" aria-hidden="true">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
        </div>
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        className="faq__item-a"
        ref={panelRef}
        style={{ maxHeight: 0, overflow: "hidden" }}
      >
        {a}
      </div>
    </div>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState(-1);

  return (
    <section id="faq" className="section section--paper">
      <div className="wrap">
        <div className="faq__layout">
          <div>
            <span className="eyebrow">Preguntas frecuentes</span>
            <h2 style={{ marginTop: 16 }}>
              Lo que más
              <br />
              nos preguntáis.
            </h2>
            <p style={{ marginTop: 20, opacity: 0.8 }}>
              ¿No encuentras tu duda?{" "}
              <a
                href={CONTACT.whatsapp}
                style={{ color: "var(--color-gold-deep)", fontWeight: 600 }}
              >
                Escríbenos por WhatsApp →
              </a>
            </p>
          </div>
          <div className="faq__list">
            {questions.map((item, i) => (
              <FAQItem
                key={i}
                index={i}
                q={item.q}
                a={item.a}
                isOpen={open === i}
                onToggle={() => setOpen(open === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
