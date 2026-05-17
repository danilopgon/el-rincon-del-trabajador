/* global React, LogoMark, NeedleSVG, CornerFold, Icon */
const { useState, useEffect } = React;

/* ========== HEADER ========== */
function Header({ onCtaClick }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className={"hdr" + (scrolled ? " is-scrolled" : "")}>
      <div className="wrap hdr__inner">
        <a href="#" className="hdr__logo">
          <LogoMark size={52} />
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
          <a href="https://blog.elrincondeltrabajador.es" target="_blank" rel="noopener">Blog</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <div className="hdr__cta">
          <a href="tel:+34614446827" className="hdr__phone">
            <Icon.phone className="icon" /> 614 44 68 27
          </a>
          <a href="#contacto" className="btn btn--gold">
            Pedir presupuesto <Icon.arrowUR className="icon" />
          </a>
        </div>
      </div>
    </header>
  );
}

/* ========== HERO ========== */
const HERO_IMG = {
  // Worker hands w/ tools (orange gloves)
  worker: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80&auto=format&fit=crop",
  // Embroidery close-up
  embroidery: "https://images.unsplash.com/photo-1558818498-28c1e002b655?w=1200&q=80&auto=format&fit=crop",
  // Workwear / factory wide
  factory: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1400&q=80&auto=format&fit=crop",
  // Tailor / sewing
  sewing: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=1200&q=80&auto=format&fit=crop",
  // Storefront placeholder
  store: "https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?w=1200&q=80&auto=format&fit=crop",
};

function HeroA() {
  return (
    <section className="hero section">
      <div className="wrap hero__container">
        <div className="heroA__grid">
          <div className="reveal is-in">
            <span className="eyebrow">Tarancón · Cuenca · 15 años de oficio</span>
            <h1 className="heroA__title" style={{ marginTop: 28 }}>
              Vestimos a quien<br /><em>trabaja de verdad.</em>
            </h1>
            <p className="heroA__sub">
              Ropa laboral, EPI certificado y personalización con bordado o DTF
              desde una sola unidad. Asesoramiento de toda la vida, en la tienda
              o por WhatsApp.
            </p>
            <div className="heroA__actions">
              <a href="#contacto" className="btn btn--primary btn--lg">
                Pedir presupuesto <Icon.arrowRight className="icon" />
              </a>
              <a href="https://wa.me/34614446827" className="btn btn--ghost btn--lg">
                <Icon.whatsapp className="icon" /> Hablamos por WhatsApp
              </a>
            </div>
            <div className="heroA__meta">
              <div className="heroA__meta-item">
                <strong>+15</strong><span>años en el sector</span>
              </div>
              <div className="heroA__meta-item">
                <strong>1 ud.</strong><span>mínimo para bordar</span>
              </div>
              <div className="heroA__meta-item">
                <strong>Tarancón</strong><span>tienda física en Cuenca</span>
              </div>
            </div>
          </div>
          <div className="heroA__media reveal is-in" style={{ position: "relative" }}>
            <image-slot
              id="hero-a"
              src={HERO_IMG.worker}
              style={{ width: "100%", height: "100%", borderRadius: 20 }}
              placeholder="Arrastra aquí tu mejor foto de obra/taller"
            ></image-slot>
            <div className="heroA__sticker">
              <strong>15+</strong>
              años cosiendo<br/>vuestra confianza
            </div>
            <div style={{
              position: "absolute", top: -24, right: 32,
              transform: "rotate(8deg)", opacity: 0.6
            }}>
              <NeedleSVG width={14} height={120} color="var(--c-navy)" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroB() {
  return (
    <section className="hero section">
      <div className="wrap hero__container">
        <div className="heroB reveal is-in">
          <span className="eyebrow">Tarancón · Cuenca · 15 años de oficio</span>
          <h1 className="heroB__title" style={{ marginTop: 24 }}>
            <span>Vestuario laboral,</span>
            <span>EPI y <span className="gold">bordado</span></span>
            <span>de toda la vida.</span>
          </h1>
          <p className="heroB__sub">
            Llevamos quince años vistiendo a empresas, autónomos y particulares
            de Tarancón y toda Cuenca. Atención cercana, marcas de confianza,
            personalización desde una unidad.
          </p>
          <div className="heroB__actions">
            <a href="#contacto" className="btn btn--primary btn--lg">
              Pedir presupuesto <Icon.arrowRight className="icon" />
            </a>
            <a href="#tienda" className="btn btn--ghost btn--lg">Visitar la tienda</a>
          </div>
          <div className="heroB__frame">
            <div className="heroB__frame-inner">
              <image-slot
                id="hero-b"
                src={HERO_IMG.factory}
                style={{ width: "100%", height: "100%" }}
                placeholder="Foto panorámica de la tienda o de un cliente trabajando"
              ></image-slot>
            </div>
            <div className="heroB__corner"></div>
            <div className="heroB__needle">
              <NeedleSVG width={14} height={200} color="var(--c-navy)" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroC() {
  return (
    <section className="hero section">
      <div className="wrap hero__container">
        <div className="heroC__header reveal is-in">
          <span className="eyebrow">Tarancón · Cuenca · 15 años de oficio</span>
          <h1 className="heroC__title" style={{ marginTop: 24 }}>
            Dos puertas.<br/>El mismo oficio.
          </h1>
          <p className="heroC__sub">
            Equipamos empresas con uniformes y EPI personalizados; y vestimos a
            particulares desde una sola prenda. Elige por dónde quieres empezar.
          </p>
        </div>
        <div className="heroC__grid reveal is-in">
          <a href="#empresas" className="heroC__path">
            <image-slot
              id="hero-c-empresa"
              src={HERO_IMG.factory}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              placeholder="Foto de empresa/equipo cliente"
            ></image-slot>
            <div className="heroC__path-body">
              <div className="heroC__path-tag">Empresas</div>
              <h2 className="heroC__path-title">Uniformamos<br/>tu equipo.</h2>
              <p className="heroC__path-desc">
                Catálogo para industria, hostelería, sanitarios y logística.
                Bordado con tu logo, asesoramiento de tallas y entregas en plazo.
              </p>
              <span className="heroC__path-cta">
                Solicitar presupuesto <Icon.arrowRight className="icon" />
              </span>
            </div>
          </a>
          <a href="#particulares" className="heroC__path">
            <image-slot
              id="hero-c-part"
              src={HERO_IMG.sewing}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              placeholder="Foto de prenda particular / interior tienda"
            ></image-slot>
            <div className="heroC__path-body">
              <div className="heroC__path-tag">Particulares</div>
              <h2 className="heroC__path-title">Una prenda,<br/>tu nombre.</h2>
              <p className="heroC__path-desc">
                Mono, chaqueta o sudadera bordada desde una sola unidad. Pasa
                por la tienda o pídelo por WhatsApp: lo tienes listo en días.
              </p>
              <span className="heroC__path-cta">
                Cómo encargarlo <Icon.arrowRight className="icon" />
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ========== MARQUEE (trust strip) ========== */
function Marquee() {
  const items = [
    "Bordado desde 1 unidad",
    "DTF en color a partir de 5 prendas",
    "EPI certificado CE",
    "Asesoramiento en tienda",
    "Entregas 48–72 h en Cuenca",
    "Marcas Velilla · Issa · Panoply",
    "15 años en Tarancón",
  ];
  const all = [...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee__track">
        {all.map((t, i) => (
          <span key={i} className="marquee__item">
            <span className="dot"></span>{t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ========== SERVICIOS ========== */
function Servicios() {
  const items = [
    {
      n: "01",
      title: "Ropa de trabajo",
      desc: "Monos, pantalones, chaquetillas y prendas técnicas para cualquier sector.",
      list: ["Industria y obra", "Hostelería y cocina", "Sanitario y limpieza", "Logística y reparto"],
      img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=900&q=80&auto=format&fit=crop",
    },
    {
      n: "02",
      title: "EPI certificado",
      desc: "Calzado de seguridad, guantes, gafas, auriculares y arneses con marcado CE.",
      list: ["Calzado S1P · S3", "Protección manos", "Protección ocular y auditiva", "Anticaídas y altura"],
      img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=900&q=80&auto=format&fit=crop",
    },
    {
      n: "03",
      title: "Bordado y DTF",
      desc: "Personalizamos con tu logo desde una sola prenda. Pruebas digitales antes de coser.",
      list: ["Bordado profesional", "DTF a todo color", "Vinilo textil", "Etiquetado y tallaje"],
      img: "https://images.unsplash.com/photo-1558818498-28c1e002b655?w=900&q=80&auto=format&fit=crop",
    },
    {
      n: "04",
      title: "Asesoramiento",
      desc: "Te ayudamos a elegir según normativa, sector y presupuesto. En persona o por WhatsApp.",
      list: ["Análisis de necesidades", "Tallaje en tienda", "Renovación de uniformes", "Postventa cercana"],
      img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80&auto=format&fit=crop",
    },
  ];
  return (
    <section id="servicios" className="section">
      <div className="wrap">
        <div className="svc__head reveal">
          <div>
            <span className="eyebrow">Qué hacemos</span>
            <h2 style={{ marginTop: 16 }}>Cuatro patas,<br/>una misma tienda.</h2>
          </div>
          <p className="lead">
            Todo lo que tu equipo necesita para empezar el lunes vestido:
            prenda, protección, identidad bordada y alguien al teléfono cuando
            hace falta resolver algo.
          </p>
        </div>
        <div className="svc__grid">
          {items.map((it, i) => (
            <article className="svc__card reveal" key={i} style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="svc__card-img">
                <img src={it.img} alt="" loading="lazy"/>
              </div>
              <div className="svc__card-num">{it.n} / 04</div>
              <h3>{it.title}</h3>
              <p>{it.desc}</p>
              <ul className="svc__card-list">
                {it.list.map((l, j) => <li key={j}>{l}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== SECTORES ========== */
function Sectores() {
  const cells = [
    { icon: Icon.sIndustry, title: "Industria", meta: "Fabricación · talleres" },
    { icon: Icon.sHorec,    title: "Hostelería", meta: "Cocina · sala" },
    { icon: Icon.sHealth,   title: "Sanitario", meta: "Clínicas · residencias" },
    { icon: Icon.sLogi,     title: "Logística", meta: "Almacén · reparto" },
    { icon: Icon.sConstr,   title: "Construcción", meta: "Obra · reformas" },
    { icon: Icon.sShop,     title: "Comercio", meta: "Tiendas · oficinas" },
  ];
  return (
    <section id="sectores" className="section section--paper">
      <div className="wrap">
        <div className="svc__head reveal">
          <div>
            <span className="eyebrow">Para quién trabajamos</span>
            <h2 style={{ marginTop: 16 }}>Cada sector,<br/>su propia prenda.</h2>
          </div>
          <p className="lead">
            En Tarancón se mueven polígonos, restaurantes, residencias y obra
            grande. Conocemos las normativas y los materiales que aguantan en
            cada uno.
          </p>
        </div>
        <div className="sect__grid reveal">
          {cells.map((c, i) => (
            <div className="sect__cell" key={i}>
              <c.icon className="sect__cell-icon" />
              <div className="sect__cell-arrow">
                <Icon.arrowUR width="20" height="20"/>
              </div>
              <span className="sect__cell-meta">{c.meta}</span>
              <span className="sect__cell-title">{c.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ========== PERSONALIZACIÓN (galería + tabs) ========== */
function Personalizacion() {
  const [tab, setTab] = useState("bordado");
  const galleries = {
    bordado: [
      { src: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80&auto=format&fit=crop", tag: "Bordado · Logo empresa" },
      { src: "https://images.unsplash.com/photo-1558818498-28c1e002b655?w=900&q=80&auto=format&fit=crop", tag: "Polo bordado" },
      { src: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=900&q=80&auto=format&fit=crop", tag: "Hilatura industrial" },
      { src: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&q=80&auto=format&fit=crop", tag: "Prueba en blanco" },
      { src: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&q=80&auto=format&fit=crop", tag: "Camisetas terminadas" },
    ],
    dtf: [
      { src: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=1200&q=80&auto=format&fit=crop", tag: "DTF · Diseño a todo color" },
      { src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80&auto=format&fit=crop", tag: "Sudadera personalizada" },
      { src: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&q=80&auto=format&fit=crop", tag: "Camiseta evento" },
      { src: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&q=80&auto=format&fit=crop", tag: "Prensa térmica" },
      { src: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=900&q=80&auto=format&fit=crop", tag: "Detalle impresión" },
    ],
  };
  const slots = galleries[tab];
  return (
    <section id="personalizacion" className="section">
      <div className="wrap">
        <div className="pers__layout">
          <div className="pers__copy reveal">
            <span className="eyebrow">Personalización</span>
            <h2>Tu logo,<br/>cosido en su sitio.</h2>
            <p className="lead">
              Bordamos en máquina industrial con hilos de calidad y aplicamos
              DTF de gran resistencia al lavado. Te enseñamos la prueba digital
              antes de tocar el primer hilo.
            </p>
            <div className="pers__tabs" role="tablist">
              <button
                className={"pers__tab" + (tab === "bordado" ? " is-active" : "")}
                onClick={() => setTab("bordado")}>Bordado profesional</button>
              <button
                className={"pers__tab" + (tab === "dtf" ? " is-active" : "")}
                onClick={() => setTab("dtf")}>DTF a color</button>
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
          <div className="pers__gallery reveal">
            {slots.map((s, i) => (
              <div key={`${tab}-${i}`}>
                <img src={s.src} alt={s.tag} loading="lazy"/>
                <span className="pers__gallery-tag">{s.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== QUIÉNES SOMOS ========== */
function About() {
  return (
    <section id="nosotros" className="section section--paper">
      <div className="wrap">
        <div className="about__grid">
          <div className="about__media reveal">
            <image-slot
              id="about-shop"
              src={HERO_IMG.store}
              style={{ width: "100%", height: "100%" }}
              placeholder="Foto del escaparate o del interior de la tienda"
            ></image-slot>
            <div className="about__badge">
              <strong>+15</strong>años de oficio<br/>en el sector
            </div>
            <div style={{
              position: "absolute", bottom: -1, left: -1,
              width: 96, height: 96,
              background: "var(--c-gold)",
              clipPath: "polygon(0 0, 100% 100%, 0 100%)",
              zIndex: 2
            }}></div>
          </div>
          <div className="about__copy reveal">
            <span className="eyebrow">Quiénes somos</span>
            <h2>Una tienda nueva<br/>con mucho oficio detrás.</h2>
            <p>
              El Rincón del Trabajador es la tienda en Tarancón; el oficio,
              en cambio, lleva quince años puesto. Antes de abrir aquí
              vestíamos a empresas y particulares en otra tienda del sector,
              aprendiendo qué prenda aguanta el lunes y qué hilo no se va al
              segundo lavado.
            </p>
            <p>
              Hoy seguimos con la misma idea: que ninguna empresa ni autónomo
              de Cuenca tenga que comprar uniforme por internet y rezar para
              que llegue. Tenemos máquina de bordar propia, prensa de DTF y
              alguien al WhatsApp cuando hace falta.
            </p>
            <p>
              No vendemos catálogos: vendemos prendas que aguantan y respondemos
              al teléfono el lunes a las nueve.
            </p>
            <div className="about__sign">
              <div className="about__sign-img">
                <image-slot
                  id="about-sign"
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80&auto=format&fit=crop"
                  style={{ width: "100%", height: "100%" }}
                  placeholder="Foto"
                ></image-slot>
              </div>
              <div>
                <div className="about__sign-name">El equipo</div>
                <div className="about__sign-role">Tarancón · Cuenca</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== TIENDA FÍSICA ========== */
function Tienda() {
  return (
    <section id="tienda" className="section">
      <div className="wrap">
        <div className="svc__head reveal" style={{ marginBottom: 40 }}>
          <div>
            <span className="eyebrow">La tienda</span>
            <h2 style={{ marginTop: 16 }}>Pásate, te atendemos<br/>como toda la vida.</h2>
          </div>
          <p className="lead">
            Estamos en pleno centro de Tarancón, a un paso de la N-400.
            Aparcamiento fácil en la zona. Vente con la prenda vieja y te la
            comparamos.
          </p>
        </div>
        <div className="shop__grid">
          <div className="shop__map reveal">
            <iframe
              title="Mapa El Rincón del Trabajador"
              src="https://www.google.com/maps?q=Calle+Juli%C3%A1n+Garc%C3%ADa+9+Taranc%C3%B3n+Cuenca&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="shop__info reveal">
            <div className="shop__row">
              <div className="shop__row-icon"><Icon.pin width="20" height="20"/></div>
              <div className="shop__row-body">
                <strong>Dirección</strong>
                <p>C. Julián García, 9 · Local<br/>16400 Tarancón, Cuenca</p>
              </div>
            </div>
            <div className="shop__row">
              <div className="shop__row-icon"><Icon.clock width="20" height="20"/></div>
              <div className="shop__row-body">
                <strong>Horario</strong>
                <p>Lunes a viernes: 9:00–14:00 · 16:00–19:00<br/>Sábados: cerrado (encargos por WhatsApp)</p>
              </div>
            </div>
            <div className="shop__row">
              <div className="shop__row-icon"><Icon.phone width="20" height="20"/></div>
              <div className="shop__row-body">
                <strong>Teléfono</strong>
                <p>
                  <a href="tel:+34614446827">614 44 68 27</a> &nbsp;·&nbsp;
                  <a href="https://wa.me/34614446827">WhatsApp</a>
                </p>
              </div>
            </div>
            <div className="shop__row">
              <div className="shop__row-icon"><Icon.mail width="20" height="20"/></div>
              <div className="shop__row-body">
                <strong>Correo</strong>
                <p><a href="mailto:hola@elrincondeltrabajador.es">hola@elrincondeltrabajador.es</a></p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <a href="https://maps.google.com/?q=Calle+Juli%C3%A1n+Garc%C3%ADa+9+Taranc%C3%B3n" className="btn btn--primary">
                Cómo llegar <Icon.arrowUR className="icon"/>
              </a>
              <a href="https://wa.me/34614446827" className="btn btn--ghost">
                <Icon.whatsapp className="icon"/> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== FAQ ========== */
function FAQ() {
  const [open, setOpen] = useState(0);
  const qs = [
    { q: "¿Bordáis a partir de cuántas unidades?", a: "Desde una sola prenda. Si es para una empresa con varias tallas, te asesoramos sobre cuántas piezas pedir para ajustar el coste por unidad." },
    { q: "¿Cuánto tarda un pedido personalizado?", a: "El plazo habitual es 48–72 horas desde la aprobación de la prueba digital. En pedidos grandes (a partir de 30 piezas) lo concretamos al hacer presupuesto." },
    { q: "¿Trabajáis con empresas de fuera de Tarancón?", a: "Sí. Tenemos clientes en toda Cuenca, Madrid y Toledo. Enviamos por agencia y, si necesitas tomar tallas, podemos coordinarlo en tu instalación." },
    { q: "¿Qué diferencia hay entre bordado y DTF?", a: "El bordado da un acabado de calidad superior y aguanta mejor el lavado industrial; es ideal para logos pequeños. El DTF permite imprimir cualquier diseño a todo color, perfecto para camisetas de evento o gráficos complejos." },
    { q: "¿Aceptáis devoluciones?", a: "Las prendas sin personalizar admiten cambio o devolución en 15 días. Las prendas bordadas o impresas, al ser únicas, no se cambian salvo defecto de fabricación." },
    { q: "¿Puedo hacer el pedido sin pasar por la tienda?", a: "Claro. Mándanos por WhatsApp tu logo, tallas y prenda de referencia y te pasamos presupuesto el mismo día. Enviamos a domicilio o lo recoges cuando puedas." },
  ];
  return (
    <section id="faq" className="section section--paper">
      <div className="wrap">
        <div className="faq__layout">
          <div className="reveal">
            <span className="eyebrow">Preguntas frecuentes</span>
            <h2 style={{ marginTop: 16 }}>Lo que más<br/>nos preguntáis.</h2>
            <p style={{ marginTop: 20, opacity: 0.8 }}>
              ¿No encuentras tu duda? <a href="https://wa.me/34614446827" style={{ color: "var(--c-gold-deep)", fontWeight: 600 }}>Escríbenos por WhatsApp →</a>
            </p>
          </div>
          <div className="faq__list reveal">
            {qs.map((it, i) => (
              <div
                key={i}
                className={"faq__item" + (open === i ? " is-open" : "")}
                onClick={() => setOpen(open === i ? -1 : i)}>
                <div className="faq__item-q">
                  <span>{it.q}</span>
                  <span className="faq__item-icon"><Icon.plus width="20" height="20"/></span>
                </div>
                <div className="faq__item-a">{it.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ========== CTA banner ========== */
function CTABanner() {
  return (
    <section id="contacto" className="cta-banner">
      <div className="wrap cta-banner__inner reveal">
        <div>
          <span className="eyebrow" style={{ color: "var(--c-gold)" }}>Empezar un pedido</span>
          <h2 className="cta-banner__title" style={{ marginTop: 16 }}>
            ¿Listos para vestir<br/>a vuestro <span className="gold">equipo?</span>
          </h2>
          <p className="cta-banner__sub">
            Cuéntanos qué sector, cuántas personas y si necesitáis bordado. En
            menos de 24 horas tienes presupuesto y muestrario en pantalla.
          </p>
        </div>
        <div className="cta-banner__actions">
          <a href="https://wa.me/34614446827?text=Hola%2C+me+gustar%C3%ADa+pedir+presupuesto" className="btn btn--gold btn--lg">
            <Icon.whatsapp className="icon"/> Presupuesto por WhatsApp
          </a>
          <a href="tel:+34614446827" className="btn btn--ghost btn--lg" style={{ color: "var(--c-cream)", borderColor: "rgba(247,239,217,0.3)" }}>
            <Icon.phone className="icon"/> 614 44 68 27
          </a>
          <a href="mailto:hola@elrincondeltrabajador.es" className="btn btn--ghost btn--lg" style={{ color: "var(--c-cream)", borderColor: "rgba(247,239,217,0.3)" }}>
            <Icon.mail className="icon"/> Escribir email
          </a>
        </div>
      </div>
      <div className="cta-banner__corner"></div>
    </section>
  );
}

/* ========== FOOTER ========== */
function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr__top">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <LogoMark size={64} />
              <div style={{ lineHeight: 0.95 }}>
                <div style={{ fontFamily: "var(--f-display)", fontWeight: 800, fontSize: 22, textTransform: "uppercase", letterSpacing: "0.02em", color: "var(--c-cream)" }}>El Rincón</div>
                <div style={{ fontFamily: "var(--f-display)", fontWeight: 600, fontSize: 13, letterSpacing: "0.2em", color: "var(--c-gold)", textTransform: "uppercase", marginTop: 4 }}>del Trabajador</div>
              </div>
            </div>
            <p className="ftr__brand-text">
              Vestuario laboral, EPI certificado y personalización con bordado y
              DTF. Tarancón, Cuenca · 15 años de oficio en el sector.
            </p>
          </div>
          <div>
            <h4>Servicios</h4>
            <ul>
              <li><a href="#servicios">Ropa de trabajo</a></li>
              <li><a href="#servicios">EPI certificado</a></li>
              <li><a href="#personalizacion">Bordado profesional</a></li>
              <li><a href="#personalizacion">DTF a color</a></li>
            </ul>
          </div>
          <div>
            <h4>Sectores</h4>
            <ul>
              <li><a href="#sectores">Industria</a></li>
              <li><a href="#sectores">Hostelería</a></li>
              <li><a href="#sectores">Sanitario</a></li>
              <li><a href="#sectores">Construcción</a></li>
            </ul>
          </div>
          <div>
            <h4>Contacto</h4>
            <ul>
              <li>C. Julián García, 9 · Tarancón</li>
              <li><a href="tel:+34614446827">614 44 68 27</a></li>
              <li><a href="mailto:hola@elrincondeltrabajador.es">hola@elrincondeltrabajador.es</a></li>
              <li><a href="https://blog.elrincondeltrabajador.es" target="_blank" rel="noopener">Blog ↗</a></li>
            </ul>
            <div className="ftr__social" style={{ marginTop: 18 }}>
              <a href="#" aria-label="Instagram"><Icon.ig width="18" height="18"/></a>
              <a href="#" aria-label="Facebook"><Icon.fb width="18" height="18"/></a>
              <a href="https://wa.me/34614446827" aria-label="WhatsApp"><Icon.whatsapp width="18" height="18"/></a>
            </div>
          </div>
        </div>
        <div className="ftr__bottom">
          <div>© 2026 El Rincón del Trabajador · Tarancón, Cuenca</div>
          <div style={{ display: "flex", gap: 18 }}>
            <a href="#">Aviso legal</a>
            <a href="#">Privacidad</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ========== WhatsApp FAB ========== */
function WhatsAppFab() {
  return (
    <a href="https://wa.me/34614446827" className="wa-fab" target="_blank" rel="noopener">
      <Icon.whatsapp />
      <span>WhatsApp</span>
    </a>
  );
}

Object.assign(window, {
  Header, HeroA, HeroB, HeroC, Marquee, Servicios, Sectores,
  Personalizacion, About, Tienda, FAQ, CTABanner, Footer, WhatsAppFab,
});
