/**
 * slides-data.mjs — Editable content source for the IG carousel.
 *
 * Edit this file to change copy, layout values, or colors.
 * Then run:  node carrusel/build.mjs
 *
 * Markup allowed in *Html fields:
 *   <br />                      — line break
 *   <span class="hl">word</span>  — gold highlight (like site hero)
 *   <span style="color:var(--gold-deep)">word</span>  — gold-deep color
 *   <strong style="color:var(--ink);font-weight:600">name</strong>  — emphasis
 */

export const meta = {
  title: "El Rincón del Trabajador — Carrusel IG · Grajo Estudio",
  lockupL1: "El Rincón",
  lockupL2: "del Trabajador",
  subtitle:
    "7 slides · 1080 × 1350 px · Formato 4:5 · Para exportar: clic en la slide → se abre a tamaño real",
  footerText: "Carrusel IG · El Rincón del Trabajador · Grajo Estudio",
  studioUrl: "grajoestudio.dev",
  totalSlides: 7,
};

export const slides = [
  // ─── S01 · PORTADA ───────────────────────────────────────────────────────
  {
    id: "s01",
    type: "cover",
    nav: "01 · Portada",
    slideTitle: "Slide 01 · Portada — clic para exportar",
    bg: "cream",
    needle: { top: 148, right: 80, rotate: 10, opacity: 0.38 },
    eyebrow: "Caso de estudio · Marca + Web",
    eyebrowMarginTop: 74,
    headlineHtml: 'Vestir una<br />marca de<br /><span class="hl">oficio</span>.',
    headlineFontSize: 144,
    headlineMarginTop: 44,
    lead: "El Rincón del Trabajador, identidad visual y web para una tienda de ropa de trabajo en Tarancón, Cuenca.",
    leadFontSize: 35,
    leadMaxWidth: "23ch",
    swipeRowMarginTop: 54,
    microdot: "elrincondeltrabajador.com",
    swipeCta: "Desliza",
  },

  // ─── S02 · EL ENCARGO ────────────────────────────────────────────────────
  {
    id: "s02",
    type: "content-stats",
    nav: "02 · Encargo",
    slideTitle: "Slide 02 · El encargo",
    bg: "cream",
    counter: 2,
    eyebrow: "El encargo",
    eyebrowMarginTop: 64,
    headlineHtml: "Una tienda nueva,<br />con quince<br />años detrás.",
    headlineFontSize: 92,
    headlineMarginTop: 36,
    bodyHtml:
      'Al frente está <strong style="color: var(--ink); font-weight: 600">Rosa González</strong>, que lleva más de quince años vistiendo a empresas y autónomos de toda la región. El reto: que la tienda nueva transmitiese la misma confianza que ya tenía ella. Trato de toda la vida.',
    bodyMaxWidth: "30ch",
    bodyMarginTop: 38,
    stats: [
      { value: "+15", label: "años de oficio", valueFontSize: 54 },
      { value: "1 ud.", label: "mínimo para DTF", valueFontSize: 54 },
      { value: "Tarancón", label: "Cuenca", valueFontSize: 48 },
    ],
    cornerFold: true,
  },

  // ─── S03 · LA IDEA ───────────────────────────────────────────────────────
  {
    id: "s03",
    type: "elements-grid",
    nav: "03 · La idea",
    slideTitle: "Slide 03 · La idea",
    bg: "paper",
    counter: 3,
    eyebrow: "La idea",
    eyebrowMarginTop: 64,
    headlineHtml:
      'Una etiqueta,<br />una aguja<br />y un <span style="color: var(--gold-deep)">peto</span>.',
    headlineFontSize: 92,
    headlineMarginTop: 36,
    body: "Tres símbolos en una sola marca. Cada uno cuenta una parte del oficio.",
    bodyMaxWidth: "30ch",
    bodyMarginTop: 34,
    // SVG types are rendered by generate.mjs (hardcoded brand assets)
    elements: [
      {
        svgType: "rincon",
        name: "La etiqueta",
        desc: "El rincón hecho forma: el espacio y la etiqueta en un solo símbolo.",
      },
      {
        svgType: "aguja",
        name: "La aguja",
        desc: "La personalización, el bordado que hace única una prenda de trabajo.",
      },
      { svgType: "peto", name: "El peto", desc: "A quien vestimos cada mañana, en cada sector." },
    ],
    cornerFold: true,
  },

  // ─── S04 · LA MARCA ──────────────────────────────────────────────────────
  {
    id: "s04",
    type: "logo-showcase",
    nav: "04 · La marca",
    slideTitle: "Slide 04 · La marca",
    bg: "cream",
    counter: 4,
    eyebrow: "La marca",
    eyebrowMarginTop: 60,
    logoSrc: "assets/logo-marca.png",
    logoAlt: "Logo El Rincón del Trabajador",
    logoSizes: [
      { label: "Grande", width: 64, height: 90 },
      { label: "Normal", width: 41, height: 58 },
      { label: "Pequeño", width: 23, height: 32 },
    ],
    caption:
      "Funciona bordada en una prenda, pintada en el escaparate o reducida al tamaño de un favicon.",
    captionFontSize: 24,
    captionMaxWidth: "20ch",
    cornerFold: true,
  },

  // ─── S05 · EL SISTEMA ────────────────────────────────────────────────────
  {
    id: "s05",
    type: "system",
    nav: "05 · Sistema",
    slideTitle: "Slide 05 · El sistema",
    bg: "cream",
    counter: 5,
    eyebrow: "El sistema",
    eyebrowMarginTop: 56,
    headlineHtml: "Paleta, tipo y marca",
    headlineFontSize: 58,
    headlineMarginTop: 26,
    swatchesMarginTop: 38,
    swatches: [
      {
        name: "Navy",
        bg: "#24303f",
        textColor: "rgba(247, 239, 217, 0.65)",
        hex: "#24303F",
        hexColor: "rgba(247, 239, 217, 0.65)",
      },
      {
        name: "Oro",
        bg: "#cca43b",
        textColor: "var(--navy)",
        hex: "#CCA43B",
        hexColor: "var(--navy)",
      },
      {
        name: "Tierra",
        bg: "#4d341f",
        textColor: "rgba(247, 239, 217, 0.65)",
        hex: "#4D341F",
        hexColor: "rgba(247, 239, 217, 0.65)",
      },
      {
        name: "Crema",
        bg: "#f7efd9",
        textColor: "var(--navy)",
        hex: "#F7EFD9",
        hexColor: "var(--muted)",
      },
    ],
    typeGridMarginTop: 30,
    displayFontLabel: "Display · Saira Condensed",
    displaySample: "Aa",
    displaySampleSubtitle: "Vestuario laboral",
    bodyFontLabel: "Texto · Inter Tight",
    bodySample: "Ropa laboral, EPI certificado y personalización desde una sola prenda.",
    logoSrc: "assets/logo-marca.png",
  },

  // ─── S06 · EN PANTALLA ───────────────────────────────────────────────────
  {
    id: "s06",
    type: "web-screenshot",
    nav: "06 · Web",
    slideTitle: "Slide 06 · En pantalla",
    bg: "navy",
    onDark: true,
    counter: 6,
    eyebrow: "En pantalla",
    eyebrowMarginTop: 42,
    headlineHtml: 'Te vestimos<br /><span class="hl">para tu trabajo</span>.',
    headlineFontSize: 82,
    headlineMarginTop: 22,
    lead: "La voz de la marca, en una web rápida y hecha a medida.",
    leadFontSize: 26,
    leadMaxWidth: "28ch",
    leadMarginTop: 18,
    browserUrl: "elrincondeltrabajador.com",
    screenshotSrc: "assets/web-screenshot.png",
    browserMarginTop: 28,
    features: [
      { title: "Hero editorial", desc: "Foto a sangre y tipografía que manda." },
      { title: "Cuatro servicios", desc: "Ropa, EPI, bordado y asesoramiento." },
      { title: "WhatsApp a un toque", desc: "Presupuesto sin pasar por la tienda." },
      { title: "Rápida y accesible", desc: "Posicionada en Google desde el primer día." },
    ],
    featureGridMarginTop: 22,
    featureGridGap: "16px 26px",
    cornerFold: true,
  },

  // ─── S07 · CIERRE ────────────────────────────────────────────────────────
  {
    id: "s07",
    type: "closing",
    nav: "07 · Cierre",
    slideTitle: "Slide 07 · Cierre",
    bg: "navydeep",
    onDark: true,
    counter: 7,
    eyebrow: "El resultado",
    headlineHtml: 'Marca, sistema<br />y web de <span class="hl">oficio</span>.',
    headlineFontSize: 108,
    headlineMarginTop: 38,
    lead: "El Rincón del Trabajador, vestido de arriba a abajo.",
    leadMaxWidth: "26ch",
    leadMarginTop: 36,
    creditTitle: "Diseño y desarrollo",
    creditName: "Grajo Estudio",
    creditContact: "grajoestudio.dev · administracion@rincondeltrabajador",
    creditLogoSrc: "assets/logo-marca.png",
    callToAction: "Guárdalo · Compártelo",
  },
];
