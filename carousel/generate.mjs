/**
 * generate.mjs — Builds carrusel/index.html from slides-data.mjs.
 *
 * Run via:  node carrusel/build.mjs   (recommended)
 *       or: node carrusel/generate.mjs  (standalone)
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { meta, slides } from "./slides-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── CSS (verbatim from index.html) ─────────────────────────────────────────

const CSS = `      /* ============================================================
   TOKENS
   ============================================================ */
      :root {
        --navy: #24303f;
        --navy-deep: #181f2a;
        --gold: #cca43b;
        --gold-deep: #a8842a;
        --brown: #4d341f;
        --cream: #f7efd9;
        --cream-deep: #efe3c4;
        --paper: #faf6eb;
        --ink: #1a222d;
        --muted: #6f6a5c;
        --line: rgba(36, 48, 63, 0.14);
        --line-cream: rgba(247, 239, 217, 0.18);
        --font-display: "Saira Condensed", system-ui, sans-serif;
        --font-sans: "Inter Tight", system-ui, sans-serif;
      }

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      html {
        scroll-behavior: smooth;
      }

      /* ============================================================
   PAGE SHELL
   ============================================================ */
      body {
        background: #0e0e10;
        font-family: var(--font-sans);
        min-height: 100vh;
      }

      /* Export mode: ?mode=export&slide=N → single slide at full resolution */
      body.export-mode {
        background: transparent;
      }
      body.export-mode .sidebar,
      body.export-mode .page-header,
      body.export-mode .page-footer {
        display: none !important;
      }
      body.export-mode .canvas {
        padding: 0;
        gap: 0;
      }
      body.export-mode .slide-outer {
        display: none;
      }
      body.export-mode .slide-outer.export-target {
        display: block;
        width: 1080px;
        height: 1350px;
        box-shadow: none;
        border-radius: 0;
      }
      body.export-mode .slide-outer.export-target .frame {
        transform: none;
        width: 1080px;
        height: 1350px;
      }

      /* ============================================================
   NAVIGATION SIDEBAR
   ============================================================ */
      .sidebar {
        position: fixed;
        right: 32px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        gap: 18px;
        z-index: 100;
      }
      .sidebar a {
        display: flex;
        align-items: center;
        gap: 10px;
        text-decoration: none;
        opacity: 0.35;
        transition: opacity 0.2s;
      }
      .sidebar a:hover,
      .sidebar a.active {
        opacity: 1;
      }
      .sidebar .nav-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--gold);
        flex: 0 0 auto;
        transition: transform 0.2s;
      }
      .sidebar a.active .nav-dot {
        transform: scale(1.4);
      }
      .sidebar .nav-label {
        font-family: var(--font-sans);
        font-size: 11px;
        font-weight: 600;
        color: var(--cream);
        letter-spacing: 0.07em;
        text-transform: uppercase;
        white-space: nowrap;
      }

      /* ============================================================
   PAGE HEADER
   ============================================================ */
      .page-header {
        text-align: center;
        padding: 56px 40px 0;
        color: rgba(247, 239, 217, 0.35);
        font-family: var(--font-sans);
        font-size: 13px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
      }
      .page-header strong {
        display: block;
        font-size: 16px;
        color: rgba(247, 239, 217, 0.7);
        margin-bottom: 8px;
        font-weight: 600;
      }

      /* ============================================================
   CANVAS — slide list at 45 % preview scale
   ============================================================ */
      .canvas {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 64px;
        padding: 60px 200px 80px 80px;
      }

      /* Outer container sets the collapsed size for the 45% scaled frame */
      .slide-outer {
        width: 486px; /* 1080 × 0.45 */
        height: 607.5px; /* 1350 × 0.45 */
        position: relative;
        flex: 0 0 auto;
        box-shadow: 0 40px 90px -24px rgba(0, 0, 0, 0.75);
        border-radius: 4px;
        overflow: hidden;
        cursor: pointer;
      }
      .slide-outer:hover {
        box-shadow: 0 48px 100px -20px rgba(0, 0, 0, 0.85);
      }

      /* ============================================================
   SLIDE FRAME — 1080 × 1350 scaled to 45%
   ============================================================ */
      .frame {
        width: 1080px;
        height: 1350px;
        position: absolute;
        top: 0;
        left: 0;
        transform: scale(0.45);
        transform-origin: top left;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        padding: 92px 88px 88px;
        font-family: var(--font-sans);
        color: var(--ink);
        -webkit-font-smoothing: antialiased;
      }

      /* Backgrounds */
      .bg-cream {
        background: var(--cream);
      }
      .bg-paper {
        background: var(--paper);
      }
      .bg-navy {
        background: var(--navy);
      }
      .bg-navydeep {
        background: var(--navy-deep);
      }
      .on-dark {
        color: var(--cream);
      }

      /* ============================================================
   TOP BAR
   ============================================================ */
      .topbar {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        position: relative;
        z-index: 3;
        flex: 0 0 auto;
      }
      .lockup {
        display: flex;
        flex-direction: column;
        line-height: 1;
        flex: 0 0 auto;
      }
      .l1 {
        font-family: var(--font-display);
        font-weight: 800;
        font-size: 26px;
        line-height: 1;
        letter-spacing: 0.005em;
        text-transform: uppercase;
        color: var(--navy);
        white-space: nowrap;
      }
      .on-dark .l1 {
        color: var(--cream);
      }
      .l2 {
        font-family: var(--font-display);
        font-weight: 600;
        font-size: 14px;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--gold-deep);
        margin-top: 7px;
        white-space: nowrap;
      }
      .on-dark .l2 {
        color: var(--gold);
      }
      .counter {
        font-family: var(--font-display);
        font-weight: 700;
        font-size: 26px;
        letter-spacing: 0.06em;
        color: var(--navy);
        display: flex;
        align-items: center;
        gap: 9px;
      }
      .on-dark .counter {
        color: var(--cream);
      }
      .now {
        color: var(--gold-deep);
      }
      .on-dark .now {
        color: var(--gold);
      }
      .tot {
        opacity: 0.38;
      }

      /* ============================================================
   TYPOGRAPHY
   ============================================================ */
      .eyebrow {
        font-family: var(--font-sans);
        font-size: 25px;
        font-weight: 600;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--gold-deep);
        display: inline-flex;
        align-items: center;
        gap: 16px;
        white-space: nowrap;
        flex: 0 0 auto;
      }
      .on-dark .eyebrow {
        color: var(--gold);
      }
      .eyebrow::before {
        content: "";
        width: 42px;
        height: 2px;
        background: var(--gold);
        flex: 0 0 auto;
      }

      .display {
        font-family: var(--font-display);
        font-weight: 800;
        text-transform: uppercase;
        line-height: 0.9;
        letter-spacing: -0.012em;
        color: var(--navy);
      }
      .on-dark .display {
        color: var(--cream);
      }

      /* Gold highlight (like the site hero) */
      .hl {
        position: relative;
        display: inline-block;
        color: var(--gold);
      }
      .hl::after {
        content: "";
        position: absolute;
        left: -0.04em;
        right: -0.04em;
        bottom: 0.08em;
        height: 0.34em;
        background: var(--gold);
        opacity: 0.22;
        z-index: -1;
      }

      .lead {
        font-family: var(--font-sans);
        font-size: 33px;
        line-height: 1.42;
        font-weight: 400;
        color: var(--ink);
      }
      .on-dark .lead {
        color: rgba(247, 239, 217, 0.86);
      }

      .body-copy {
        font-family: var(--font-sans);
        font-size: 29px;
        line-height: 1.5;
        color: var(--muted);
      }
      .on-dark .body-copy {
        color: rgba(247, 239, 217, 0.68);
      }

      .micro {
        font-family: var(--font-sans);
        font-size: 23px;
        font-weight: 500;
        letter-spacing: 0.02em;
        color: var(--muted);
        display: inline-flex;
        align-items: center;
        gap: 12px;
        position: relative;
        z-index: 3;
      }
      .on-dark .micro {
        color: rgba(247, 239, 217, 0.55);
      }

      .swipe-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        position: relative;
        z-index: 3;
      }
      .swipe-cta {
        font-family: var(--font-display);
        font-weight: 700;
        font-size: 24px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--gold-deep);
        display: inline-flex;
        align-items: center;
        gap: 12px;
      }
      .on-dark .swipe-cta {
        color: var(--gold);
      }

      .spacer {
        flex: 1 1 auto;
      }

      /* ============================================================
   MOTIFS
   ============================================================ */
      .corner-fold {
        position: absolute;
        right: 0;
        bottom: 0;
        background: var(--gold);
        clip-path: polygon(100% 0, 100% 100%, 0 100%);
        z-index: 1;
      }
      .corner-fold.sm {
        width: 132px;
        height: 132px;
      }

      /* ============================================================
   SLIDE 05 — COLOR SWATCHES
   ============================================================ */
      .sw-row {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        border: 1px solid var(--line);
        border-radius: 6px;
        overflow: hidden;
        flex: 0 0 auto;
      }
      .sw {
        height: 130px;
        position: relative;
        display: flex;
        align-items: flex-end;
        padding: 16px;
        border-right: 1px solid rgba(36, 48, 63, 0.12);
      }
      .sw:last-child {
        border-right: none;
      }
      .sw-name {
        position: absolute;
        top: 16px;
        left: 16px;
        font-family: var(--font-sans);
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 0.05em;
        text-transform: uppercase;
      }
      .sw-hex {
        font-family: var(--font-display);
        font-weight: 600;
        font-size: 18px;
        letter-spacing: 0.04em;
      }

      /* ============================================================
   PAGE FOOTER
   ============================================================ */
      .page-footer {
        text-align: center;
        padding: 0 40px 64px;
        color: rgba(247, 239, 217, 0.25);
        font-family: var(--font-sans);
        font-size: 13px;
        line-height: 1.7;
        letter-spacing: 0.04em;
      }
      .page-footer a {
        color: rgba(204, 164, 59, 0.5);
        text-decoration: none;
      }
      .page-footer a:hover {
        color: var(--gold);
      }`;

// ── Brand SVG constants ────────────────────────────────────────────────────

// S01 decorative needle (Aguja.svg Illustrator path, translucent gold)
const SVG_NEEDLE_DECO = (n) => `<svg
            style="
              position: absolute;
              top: ${n.top}px;
              right: ${n.right}px;
              transform: rotate(${n.rotate}deg);
              opacity: ${n.opacity};
              display: block;
              pointer-events: none;
            "
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 595.28 841.89"
            width="28"
            height="248"
          >
            <path
              fill="#CCA43B"
              d="M287.17,151.78c-30.66,3.85-14.25,110.63-14.76,133.73-2.83,126.95-21.51,273.45-16.23,398,
         .36,8.4,1.29,14.51,4.69,28.12,5.21-11.96,6.31-19.12,7.51-27.43,18.24-126.07,14.04-276.35,
         24.5-405.68,1.49-18.38,30.85-131.33-5.71-126.75Z
         M295.56,196.43c-.54,10.6-4.29,19-8.37,18.77-4.09-.23-6.96-9.01-6.43-19.61.54-10.6,
         4.29-19.01,8.37-18.77,4.09.23,6.96,9.01,6.43,19.61Z"
            />
          </svg>`;

// S03 element SVGs (brand design-system assets)
const ELEMENT_SVGS = {
  rincon: `<svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 595.28 841.89"
                  width="74"
                  height="92"
                >
                  <polyline
                    points="55 418.29 55 111.06 548.61 111.06 548.61 610.78 247.49 610.78"
                    fill="none"
                    stroke="#24303F"
                    stroke-width="24"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                  />
                  <polygon
                    points="247.77 619.96 46.67 418.14 247.77 418.14 247.77 619.96"
                    fill="#CCA43B"
                  />
                  <line
                    x1="71.11"
                    y1="111.06"
                    x2="232.51"
                    y2="111.06"
                    fill="none"
                    stroke="#24303F"
                    stroke-width="24"
                    stroke-linecap="round"
                  />
                </svg>`,
  aguja: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 200" width="14" height="92">
                  <ellipse
                    cx="7"
                    cy="8"
                    rx="3.8"
                    ry="5.2"
                    fill="none"
                    stroke="#24303F"
                    stroke-width="2.2"
                  />
                  <path d="M 9.1 13 L 9.8 192 L 7 199 L 4.2 192 L 4.9 13 Z" fill="#24303F" />
                </svg>`,
  peto: `<svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="130 160 340 570"
                  width="55"
                  height="92"
                >
                  <path
                    fill="#4D341F"
                    d="M392.11,181.43c4.14.68,2.99,8.06,2.8,11.59-.62,11.7-2.35,22.81-2.66,34.92-.14,5.49-1.91,15.88-.71,20.83
               .34,1.41,5.9,1.88,6.66,10.06.36,3.91-.6,23.82-1.38,27.28-1,4.46-4.68,4.46-5.8,6.28-1.35,2.18,1.93,22.74,
               2.87,26.79,5.85,25.47,19.59,57.81,36.64,77.61,4.07,4.72,8.09,3.9,9.28,12.69,1.75,12.9.61,30.47,1.14,43.89,
               2.79,70.29,6.6,141.28,9.89,212.02.34,7.3,4.46,40.32.86,44.16-4.98,5.3-29.96,1.31-37.61,1.31-20.09,0-45.04,
               3.08-64.85,1.21-4.48-.42-7.57-1.24-10.44-4.94l-30.16-157.7-31.79,159.36c-2.26,2.4-5.59,3.2-8.81,3.27
               -30.6-2.03-64.34,2.56-94.55,0-11.71-.99-11.96-3.99-11.54-14.92,3.06-79.44,9.09-159.11,13.21-238.34
               .55-10.6-.14-50.06,3.91-56.51,3.12-4.99,11.27-11.09,15.68-17.28,12.25-17.22,31.61-69.55,28.82-89.94
               -.52-3.77-2.6-3.86-3.6-6.29-2.38-5.8-3.35-30.21-.72-35.25,1.83-3.5,6.68-3.66,6.56-7.81l-4.49-51.66
               c.39-3.89-1.73-9.87,2.44-11.82,2.65-1.24,30.38-1.42,32.7-.27,4.32,2.14,1.91,11.18,2.2,14.28,
               1.61,17.08,4.42,34.22,4.31,51.51.19.7,7.2,1.65,9.12,6.45,1.37,3.4,1.46,25.5.77,29.86-.79,4.96-5.52,
               6.33-6.32,9.07-.93,3.17.89,6.13-.21,9.11h82.39c-.53-3.32.75-8.35.02-11.31-.25-1.01-2.77-1.52-3.86-2.96
               -2.38-3.17-2.23-24.13-1.66-29.12,1.16-10.24,8.93-9.86,9.75-12.22l4.56-61.35c-.08-1.15,2.14-3.87,2.72-3.87,
               8.91,0,23.85-1.31,31.86,0Z"
                  />
                  <path
                    fill="#CCA43B"
                    d="M256.07,345.29c-2.19.73-2.71,3.8-2.95,5.84-1.52,13.2-1.19,43.61.04,57.12,1.3,14.31,12.61,27.15,
               26.99,29.04,12.36,1.62,42.01,1.21,54.87.13,43-3.59,25.49-58.93,29.13-87.43.05-1.31-.2-2.3-1.13-3.26
               -3.96-4.08-94.35-.38-106.95-1.44Z"
                  />
                </svg>`,
};

// ── Shared render helpers ──────────────────────────────────────────────────

function topbar(slide) {
  const counter = slide.counter
    ? `<div class="counter"><span class="now">${String(slide.counter).padStart(2, "0")}</span><span class="tot">/ ${String(meta.totalSlides).padStart(2, "0")}</span></div>`
    : "";
  return `
          <div class="topbar">
            <div class="lockup">
              <span class="l1">${meta.lockupL1}</span>
              <span class="l2">${meta.lockupL2}</span>
            </div>
            ${counter}
          </div>`;
}

const cornerFold = () => `\n          <div class="corner-fold sm"></div>`;

// ── Slide template functions ───────────────────────────────────────────────

function renderCover(s) {
  return `${topbar(s)}

          ${SVG_NEEDLE_DECO(s.needle)}

          <div style="margin-top: ${s.eyebrowMarginTop}px; flex: 0 0 auto">
            <span class="eyebrow">${s.eyebrow}</span>
          </div>

          <h1 class="display" style="margin-top: ${s.headlineMarginTop}px; font-size: ${s.headlineFontSize}px">
            ${s.headlineHtml}
          </h1>

          <div class="spacer"></div>

          <p class="lead" style="font-size: ${s.leadFontSize}px; max-width: ${s.leadMaxWidth}">
            ${s.lead}
          </p>

          <div class="swipe-row" style="margin-top: ${s.swipeRowMarginTop}px">
            <span class="micro">
              <span
                style="
                  width: 7px;
                  height: 7px;
                  border-radius: 50%;
                  background: var(--gold);
                  display: inline-block;
                  flex: 0 0 auto;
                "
              ></span>
              ${s.microdot}
            </span>
            <span class="swipe-cta">
              ${s.swipeCta}
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </div>`;
}

function renderContentStats(s) {
  const statsHtml = s.stats
    .map(
      (st) => `
            <div>
              <div
                style="
                  font-family: var(--font-display);
                  font-weight: 800;
                  font-size: ${st.valueFontSize}px;
                  color: var(--navy);
                  line-height: 0.9;
                "
              >
                ${st.value}
              </div>
              <div
                style="
                  font-size: 20px;
                  color: var(--muted);
                  margin-top: 10px;
                  text-transform: uppercase;
                  letter-spacing: 0.06em;
                  font-weight: 600;
                "
              >
                ${st.label}
              </div>
            </div>`
    )
    .join("");

  return `${topbar(s)}

          <div style="margin-top: ${s.eyebrowMarginTop}px">
            <span class="eyebrow">${s.eyebrow}</span>
            <h2 class="display" style="margin-top: ${s.headlineMarginTop}px; font-size: ${s.headlineFontSize}px">
              ${s.headlineHtml}
            </h2>
            <p class="body-copy" style="max-width: ${s.bodyMaxWidth}; margin-top: ${s.bodyMarginTop}px">
              ${s.bodyHtml}
            </p>
          </div>

          <div class="spacer"></div>

          <div
            style="
              display: flex;
              gap: 52px;
              border-top: 1px solid var(--line);
              padding-top: 40px;
              flex: 0 0 auto;
            "
          >
            ${statsHtml}
          </div>
          ${s.cornerFold ? cornerFold() : ""}`;
}

function renderElementsGrid(s) {
  const elementsHtml = s.elements
    .map(
      (el) => `
            <div style="display: flex; flex-direction: column; gap: 20px">
              <div style="height: 92px; display: flex; align-items: flex-end">
                ${ELEMENT_SVGS[el.svgType]}
              </div>
              <div
                style="
                  font-family: var(--font-display);
                  font-weight: 800;
                  font-size: 28px;
                  text-transform: uppercase;
                  color: var(--navy);
                  letter-spacing: -0.01em;
                "
              >
                ${el.name}
              </div>
              <div style="font-size: 22px; line-height: 1.45; color: var(--muted)">
                ${el.desc}
              </div>
            </div>`
    )
    .join("");

  return `${topbar(s)}

          <div style="margin-top: ${s.eyebrowMarginTop}px">
            <span class="eyebrow">${s.eyebrow}</span>
            <h2 class="display" style="margin-top: ${s.headlineMarginTop}px; font-size: ${s.headlineFontSize}px">
              ${s.headlineHtml}
            </h2>
            <p class="body-copy" style="max-width: ${s.bodyMaxWidth}; margin-top: ${s.bodyMarginTop}px">
              ${s.body}
            </p>
          </div>

          <div class="spacer"></div>

          <div
            style="
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 44px;
              border-top: 1px solid var(--line);
              padding-top: 44px;
              flex: 0 0 auto;
            "
          >
            ${elementsHtml}
          </div>
          ${s.cornerFold ? cornerFold() : ""}`;
}

function renderLogoShowcase(s) {
  const sizesHtml = s.logoSizes
    .map(
      (sz) => `
              <div style="display: flex; flex-direction: column; align-items: center; gap: 12px">
                <img
                  src="${s.logoSrc}"
                  alt=""
                  style="width: ${sz.width}px; height: ${sz.height}px; object-fit: contain"
                />
                <span
                  style="
                    font-size: 16px;
                    color: var(--muted);
                    font-family: var(--font-display);
                    font-weight: 600;
                    letter-spacing: 0.05em;
                  "
                  >${sz.label}</span
                >
              </div>`
    )
    .join("");

  return `${topbar(s)}

          <div style="margin-top: ${s.eyebrowMarginTop}px; flex: 0 0 auto">
            <span class="eyebrow">${s.eyebrow}</span>
          </div>

          <div
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              flex: 1 1 auto;
              margin-top: 18px;
              min-height: 0;
            "
          >
            <img
              src="${s.logoSrc}"
              alt="${s.logoAlt}"
              style="width: 440px; height: 621px; object-fit: contain"
            />
          </div>

          <div
            style="
              display: flex;
              align-items: flex-end;
              gap: 36px;
              border-top: 1px solid var(--line);
              padding-top: 38px;
              flex: 0 0 auto;
            "
          >
            <div style="display: flex; gap: 32px; align-items: flex-end">
              ${sizesHtml}
            </div>
            <p class="body-copy" style="font-size: ${s.captionFontSize}px; max-width: ${s.captionMaxWidth}; margin-left: 20px">
              ${s.caption}
            </p>
          </div>
          ${s.cornerFold ? cornerFold() : ""}`;
}

function renderSystem(s) {
  const swatchesHtml = s.swatches
    .map(
      (sw) => `
            <div class="sw" style="background: ${sw.bg}">
              <span class="sw-name" style="color: ${sw.textColor}">${sw.name}</span>
              <span class="sw-hex" style="color: ${sw.hexColor}">${sw.hex}</span>
            </div>`
    )
    .join("");

  return `${topbar(s)}

          <div style="margin-top: ${s.eyebrowMarginTop}px; flex: 0 0 auto">
            <span class="eyebrow">${s.eyebrow}</span>
            <h2 class="display" style="margin-top: ${s.headlineMarginTop}px; font-size: ${s.headlineFontSize}px; line-height: 1">
              ${s.headlineHtml}
            </h2>
          </div>

          <div class="sw-row" style="margin-top: ${s.swatchesMarginTop}px">
            ${swatchesHtml}
          </div>

          <div
            style="
              display: grid;
              grid-template-columns: 1.3fr 1fr;
              gap: 30px;
              margin-top: ${s.typeGridMarginTop}px;
              flex: 1 1 auto;
              min-height: 0;
            "
          >
            <div
              style="
                border: 1px solid var(--line);
                border-radius: 8px;
                padding: 30px 32px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                overflow: hidden;
              "
            >
              <div>
                <div
                  style="
                    font-size: 16px;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--gold-deep);
                    font-weight: 600;
                  "
                >
                  ${s.displayFontLabel}
                </div>
                <div
                  style="
                    font-family: var(--font-display);
                    font-weight: 900;
                    font-size: 108px;
                    line-height: 0.86;
                    color: var(--navy);
                    text-transform: uppercase;
                    margin-top: 6px;
                  "
                >
                  ${s.displaySample}
                </div>
                <div
                  style="
                    font-family: var(--font-display);
                    font-weight: 700;
                    font-size: 28px;
                    letter-spacing: 0.02em;
                    text-transform: uppercase;
                    color: var(--navy);
                    margin-top: 4px;
                  "
                >
                  ${s.displaySampleSubtitle}
                </div>
              </div>
              <div style="border-top: 1px solid var(--line); padding-top: 20px; margin-top: 16px">
                <div
                  style="
                    font-size: 16px;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--gold-deep);
                    font-weight: 600;
                  "
                >
                  ${s.bodyFontLabel}
                </div>
                <div
                  style="font-size: 23px; line-height: 1.42; color: var(--ink); margin-top: 10px"
                >
                  ${s.bodySample}
                </div>
              </div>
            </div>

            <div
              style="
                border: 1px solid var(--line);
                border-radius: 8px;
                padding: 28px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 22px;
                background: var(--paper);
              "
            >
              <img
                src="${s.logoSrc}"
                alt=""
                style="width: 128px; height: 181px; object-fit: contain"
              />
              <div style="width: 100%; height: 1px; background: var(--line)"></div>
              <div class="lockup" style="align-items: center; text-align: center">
                <span class="l1" style="font-size: 26px; color: var(--navy)">${meta.lockupL1}</span>
                <span class="l2" style="font-size: 13px">${meta.lockupL2}</span>
              </div>
            </div>
          </div>`;
}

function renderWebScreenshot(s) {
  const featuresHtml = s.features
    .map(
      (f) => `
            <div style="display: flex; gap: 14px">
              <span
                style="
                  color: var(--gold);
                  font-family: var(--font-display);
                  font-weight: 700;
                  font-size: 22px;
                  flex: 0 0 auto;
                  line-height: 1.1;
                  margin-top: 2px;
                "
                >↗</span
              >
              <div>
                <div
                  style="
                    font-family: var(--font-display);
                    font-weight: 700;
                    font-size: 22px;
                    text-transform: uppercase;
                    color: var(--cream);
                    letter-spacing: 0.01em;
                  "
                >
                  ${f.title}
                </div>
                <div
                  style="
                    font-size: 18px;
                    color: rgba(247, 239, 217, 0.58);
                    margin-top: 4px;
                    line-height: 1.3;
                  "
                >
                  ${f.desc}
                </div>
              </div>
            </div>`
    )
    .join("");

  return `${topbar(s)}

          <div style="margin-top: ${s.eyebrowMarginTop}px; flex: 0 0 auto">
            <span class="eyebrow">${s.eyebrow}</span>
            <h2 class="display" style="margin-top: ${s.headlineMarginTop}px; font-size: ${s.headlineFontSize}px">
              ${s.headlineHtml}
            </h2>
            <p class="lead" style="margin-top: ${s.leadMarginTop}px; font-size: ${s.leadFontSize}px; max-width: ${s.leadMaxWidth}">
              ${s.lead}
            </p>
          </div>

          <div
            style="
              margin-top: ${s.browserMarginTop}px;
              flex: 1 1 auto;
              display: flex;
              flex-direction: column;
              min-height: 0;
              border-radius: 12px;
              overflow: hidden;
              border: 1.5px solid rgba(247, 239, 217, 0.14);
            "
          >
            <div
              style="
                background: rgba(247, 239, 217, 0.07);
                padding: 14px 22px;
                display: flex;
                align-items: center;
                gap: 16px;
                flex: 0 0 auto;
                border-bottom: 1px solid rgba(247, 239, 217, 0.1);
              "
            >
              <div style="display: flex; gap: 8px; flex: 0 0 auto">
                <span style="width: 13px; height: 13px; border-radius: 50%; background: #ff5f57; display: block;"></span>
                <span style="width: 13px; height: 13px; border-radius: 50%; background: #febc2e; display: block;"></span>
                <span style="width: 13px; height: 13px; border-radius: 50%; background: #28c840; display: block;"></span>
              </div>
              <div
                style="
                  flex: 1;
                  background: rgba(247, 239, 217, 0.06);
                  border-radius: 7px;
                  padding: 8px 18px;
                  font-size: 19px;
                  color: rgba(247, 239, 217, 0.42);
                  font-family: var(--font-sans);
                  letter-spacing: 0.02em;
                "
              >
                ${s.browserUrl}
              </div>
            </div>
            <div style="flex: 1 1 auto; overflow: hidden; min-height: 0; position: relative">
              <img
                src="${s.screenshotSrc}"
                alt="${s.browserUrl}"
                style="
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  object-position: top center;
                  display: block;
                "
              />
            </div>
          </div>

          <div
            style="
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: ${s.featureGridGap};
              margin-top: ${s.featureGridMarginTop}px;
              flex: 0 0 auto;
            "
          >
            ${featuresHtml}
          </div>
          ${s.cornerFold ? cornerFold() : ""}`;
}

function renderClosing(s) {
  return `${topbar(s)}

          <div class="spacer"></div>

          <span class="eyebrow">${s.eyebrow}</span>

          <h2 class="display" style="margin-top: ${s.headlineMarginTop}px; font-size: ${s.headlineFontSize}px">
            ${s.headlineHtml}
          </h2>

          <p class="lead" style="margin-top: ${s.leadMarginTop}px; max-width: ${s.leadMaxWidth}">
            ${s.lead}
          </p>

          <div class="spacer"></div>

          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              border-top: 1px solid var(--line-cream);
              padding-top: 38px;
              flex: 0 0 auto;
            "
          >
            <div>
              <div
                style="
                  font-size: 18px;
                  text-transform: uppercase;
                  letter-spacing: 0.12em;
                  color: var(--gold);
                  font-weight: 600;
                "
              >
                ${s.creditTitle}
              </div>
              <div
                style="
                  font-family: var(--font-display);
                  font-weight: 800;
                  font-size: 44px;
                  color: var(--cream);
                  margin-top: 8px;
                  text-transform: uppercase;
                  letter-spacing: -0.01em;
                "
              >
                ${s.creditName}
              </div>
              <div style="font-size: 21px; color: rgba(247, 239, 217, 0.5); margin-top: 8px">
                ${s.creditContact}
              </div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 12px">
              <div
                style="
                  width: 92px;
                  height: 92px;
                  border-radius: 18px;
                  background: var(--cream);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex: 0 0 auto;
                "
              >
                <img
                  src="${s.creditLogoSrc}"
                  alt=""
                  style="width: 52px; height: 74px; object-fit: contain"
                />
              </div>
              <span style="font-size: 18px; color: rgba(247, 239, 217, 0.45); white-space: nowrap">
                ${s.callToAction}
              </span>
            </div>
          </div>`;
}

// ── Template dispatch ──────────────────────────────────────────────────────

const RENDER = {
  cover: renderCover,
  "content-stats": renderContentStats,
  "elements-grid": renderElementsGrid,
  "logo-showcase": renderLogoShowcase,
  system: renderSystem,
  "web-screenshot": renderWebScreenshot,
  closing: renderClosing,
};

function renderSlide(slide) {
  const render = RENDER[slide.type];
  if (!render) throw new Error(`Unknown slide type: "${slide.type}"`);
  const bgClass = `bg-${slide.bg}`;
  const darkClass = slide.onDark ? " on-dark" : "";
  return `      <!-- ================================================================
     ${slide.slideTitle.toUpperCase()}
     ================================================================ -->
      <div id="${slide.id}" class="slide-outer" title="${slide.slideTitle}">
        <div class="frame ${bgClass}${darkClass}">
          ${render(slide)}
        </div>
      </div>`;
}

// ── HTML assembly ──────────────────────────────────────────────────────────

const VIEWER_SCRIPT = `      /* Active nav highlight */
      const navLinks = document.querySelectorAll(".sidebar a");
      const slides = document.querySelectorAll(".slide-outer");

      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              navLinks.forEach((l) => l.classList.remove("active"));
              const a = document.querySelector(\`.sidebar a[href="#\${e.target.id}"]\`);
              if (a) a.classList.add("active");
            }
          });
        },
        { threshold: 0.5 }
      );

      slides.forEach((s) => obs.observe(s));

      /* Click to open slide at full 1080×1350 for export.
   Abrimos el mismo HTML con ?mode=export&slide=ID para que los assets carguen normalmente. */
      slides.forEach((outer) => {
        outer.addEventListener("click", () => {
          const base = location.href.split("?")[0];
          const url = \`\${base}?mode=export&slide=\${outer.id}\`;
          window.open(url, "_blank");
        });
      });

      /* Export mode: ?slide=N shows just that slide full-size */
      const p = new URLSearchParams(location.search);
      if (p.get("mode") === "export") {
        const target = document.getElementById(p.get("slide"));
        if (target) {
          document.body.classList.add("export-mode");
          target.classList.add("export-target");
        }
      }`;

function buildHTML() {
  const nav = slides
    .map(
      (s) =>
        `      <a href="#${s.id}"><span class="nav-dot"></span><span class="nav-label">${s.nav}</span></a>`
    )
    .join("\n");

  const canvas = slides.map(renderSlide).join("\n\n");

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1280" />
    <title>${meta.title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@500;600;700;800;900&family=Inter+Tight:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <style>
${CSS}
    </style>
  </head>
  <body>
    <!-- ============================================================
     NAVIGATION SIDEBAR
     ============================================================ -->
    <nav class="sidebar" aria-label="Slides">
${nav}
    </nav>

    <!-- ============================================================
     PAGE HEADER
     ============================================================ -->
    <header class="page-header">
      <strong>${meta.title}</strong>
      ${meta.subtitle}
    </header>

    <!-- ============================================================
     CANVAS
     ============================================================ -->
    <main class="canvas">
${canvas}
    </main>
    <!-- /canvas -->

    <!-- ============================================================
     PAGE FOOTER
     ============================================================ -->
    <footer class="page-footer">
      ${meta.footerText} ·
      <a href="https://${meta.studioUrl}">${meta.studioUrl}</a><br />
      Para exportar cada slide a 1080×1350 px: clic en la slide → se abre en nueva pestaña a tamaño
      real → captura con herramienta del sistema
    </footer>

    <!-- ============================================================
     SCRIPT — navegación activa + export on click
     ============================================================ -->
    <script>
${VIEWER_SCRIPT}
    </script>
  </body>
</html>`;
}

// ── Entry point ────────────────────────────────────────────────────────────

export async function generate() {
  const html = buildHTML();
  await fs.writeFile(path.join(__dirname, "index.html"), html, "utf-8");
  console.log("  ✓ index.html generado");
}

// Allow running standalone: node carrusel/generate.mjs
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generate().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
