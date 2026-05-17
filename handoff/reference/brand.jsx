/* global React */

/* ============================================================
   Brand components — vectorized recreations of the brand marks
   ============================================================ */

// Full lockup mark — use the actual PNG logo for fidelity. The component
// keeps the same name/API so existing usages don't change.
// Logo mark — renders the official PNGs.
//   variant="icon" → just the framed icon (aspect ~0.71 wide / tall)
//   variant="full" → icon + wordmark (aspect ~0.71 wide / tall)
//   size = height in px. Width derived from aspect.
function LogoMark({ size = 64, variant = "icon", style = {} }) {
  const src = variant === "full" ? "assets/logo-completo.png" : "assets/logo-marca.png";
  // Both PNGs share the same aspect ratio (1860x2631 ≈ 0.707)
  const w = Math.round(size * 0.707);
  return (
    <img
      src={src}
      alt="El Rincón del Trabajador"
      style={{ display: "block", width: w, height: size, objectFit: "contain", ...style }}
    />
  );
}

// Decorative needle for hero/section accents
function NeedleSVG({ width = 14, height = 200, color }) {
  const c = color || "currentColor";
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 200"
      className="needle-svg"
      style={{ display: "block" }}
    >
      <ellipse cx="7" cy="6" rx="3.4" ry="4.4" fill="none" stroke={c} strokeWidth="1.5" />
      <path d="M 8.4 10 L 9 196 L 7 198 L 5 196 L 5.6 10 Z" fill={c} />
    </svg>
  );
}

// Gold corner triangle — works as a section accent
function CornerFold({ size = 120, color = "#CCA43B", style = {} }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: color,
        clipPath: "polygon(0 0, 100% 100%, 0 100%)",
        ...style,
      }}
    />
  );
}

// Inline icon set — outline only, navy/currentColor
const Icon = {
  arrowUR: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  ),
  arrowRight: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  whatsapp: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2zm5.4 14.3c-.2.6-1.2 1.1-1.7 1.2-.5.1-1 .2-3.2-.7-2.7-1.1-4.4-3.9-4.5-4.1-.1-.2-1.1-1.4-1.1-2.7 0-1.3.7-1.9 1-2.2.3-.3.6-.3.8-.3h.6c.2 0 .5 0 .7.5l1 2.3c.1.2.1.4 0 .5l-.4.5-.5.5c-.1.1-.3.3-.1.6.2.3.9 1.5 2 2.4 1.3 1.2 2.5 1.5 2.8 1.7.3.1.5.1.7-.1l.8-.9c.2-.2.4-.2.7-.1l2.2 1c.3.2.4.2.5.4.1.2.1 1-.2 1.5z" />
    </svg>
  ),
  phone: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L7.9 9.7a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z" />
    </svg>
  ),
  mail: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6 12 13 2 6" />
    </svg>
  ),
  pin: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  clock: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  plus: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  ig: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  ),
  fb: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M13 22v-8h3l.5-4H13V7.5c0-1.1.3-1.9 2-1.9h2V2.1A28 28 0 0 0 14.6 2C12 2 10 3.6 10 6.7V10H7v4h3v8h3z" />
    </svg>
  ),
  // Sector icons — abstract, monochrome
  sIndustry: (p) => (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" {...p}>
      <path d="M4 28V14l8 4V14l8 4V10h8v18z" strokeLinejoin="round"/>
      <path d="M10 28v-4M16 28v-4M22 28v-4"/>
    </svg>
  ),
  sHorec: (p) => (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M8 4v10a4 4 0 0 0 4 4 4 4 0 0 0 4-4V4M12 4v10M22 4c-2 0-4 2-4 5v3a3 3 0 0 0 3 3h1v13M12 18v10"/>
    </svg>
  ),
  sHealth: (p) => (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M16 4c-3 0-5 2-5 5v3H6v8h5v8h10v-8h5v-8h-5V9c0-3-2-5-5-5z"/>
    </svg>
  ),
  sLogi: (p) => (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" {...p}>
      <path d="M2 8h16v14H2zM18 13h8l4 5v4h-12z"/>
      <circle cx="8" cy="24" r="2.5"/><circle cx="24" cy="24" r="2.5"/>
    </svg>
  ),
  sConstr: (p) => (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M4 22v-4c0-5 5-9 12-9s12 4 12 9v4M4 22h24M4 22v4h24v-4"/>
      <path d="M16 9V5"/>
    </svg>
  ),
  sShop: (p) => (
    <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" {...p}>
      <path d="M4 12v16h24V12M2 12l3-6h22l3 6M16 6v6"/>
      <path d="M10 28v-8h12v8"/>
    </svg>
  ),
};

Object.assign(window, { LogoMark, NeedleSVG, CornerFold, Icon });
