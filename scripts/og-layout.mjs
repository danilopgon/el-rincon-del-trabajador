/**
 * og-layout.mjs — pure layout helpers for the OG social card generator.
 *
 * All exports are PURE functions or constants (no side effects, no I/O).
 * This makes them trivially testable with Vitest.
 *
 * Corrected card design (post user review):
 *   Split layout — cream logo zone (left) | navy text zone (right)
 *   Card spec: 1200×630 px
 *     - Logo zone: cream #f7efd9 background, ~380px wide
 *     - Separator: 3–4px vertical gold #cca43b line
 *     - Text zone: navy #24303f background, remaining width
 *
 * Logo source: src/assets/logo-completo.png (rasterized, preserves original
 * brown overalls + gold frame colors on cream background).
 */

// ---------------------------------------------------------------------------
// Brand color constants — from tokens.css (corrected post-review)
// ---------------------------------------------------------------------------

export const brandColors = {
  navy: "#24303f", // text zone background
  gold: "#cca43b", // separator line + accent text
  cream: "#f7efd9", // logo zone background
  white: "#ffffff", // primary text
};

// ---------------------------------------------------------------------------
// Text content constants — Option A: tagline + city only (no business name)
// The logo-completo.png already shows the business name in the cream zone.
// ---------------------------------------------------------------------------

export const cardText = {
  tagline: "Vestuario laboral y EPI",
  city: "Tarancón",
};

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 630;
const PADDING = 56;

// Left zone: logo with cream background — ~380px wide
const LOGO_ZONE_WIDTH = 380;

// Separator: 4px vertical gold line between zones
const SEPARATOR_WIDTH = 4;
const SEPARATOR_X = LOGO_ZONE_WIDTH;

// Right zone: navy background, text left-aligned
const TEXT_ZONE_X = SEPARATOR_X + SEPARATOR_WIDTH;
const TEXT_ZONE_WIDTH = CANVAS_WIDTH - TEXT_ZONE_X;

// ---------------------------------------------------------------------------
// cardLayout() — returns zone coordinates and dimensions
// ---------------------------------------------------------------------------

/**
 * Returns the spatial layout for the 1200×630 OG card.
 *
 * Split layout:
 *   logoZone  — cream (#f7efd9) background, left side
 *   separator — 4px gold (#cca43b) vertical line
 *   textZone  — navy (#24303f) background, right side
 *
 * @returns {{
 *   canvas: { width: number, height: number },
 *   logoZone: { x: number, y: number, width: number, height: number },
 *   separator: { x: number, y: number, width: number, height: number },
 *   textZone: { x: number, y: number, width: number, height: number },
 *   padding: number
 * }}
 */
export function cardLayout() {
  return {
    canvas: {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
    },
    logoZone: {
      x: 0,
      y: 0,
      width: LOGO_ZONE_WIDTH,
      height: CANVAS_HEIGHT,
    },
    separator: {
      x: SEPARATOR_X,
      y: 0,
      width: SEPARATOR_WIDTH,
      height: CANVAS_HEIGHT,
    },
    textZone: {
      x: TEXT_ZONE_X,
      y: 0,
      width: TEXT_ZONE_WIDTH,
      height: CANVAS_HEIGHT,
    },
    padding: PADDING,
  };
}

// ---------------------------------------------------------------------------
// fileSizeOk() — validates output file size against the 300 KB limit
// ---------------------------------------------------------------------------

const MAX_FILE_SIZE_BYTES = 307200; // 300 KB

/**
 * Returns true if the file size is within the 300 KB limit (inclusive).
 * Returns false for zero bytes or anything above 307200 bytes.
 *
 * @param {number} bytes
 * @returns {boolean}
 */
export function fileSizeOk(bytes) {
  return bytes > 0 && bytes <= MAX_FILE_SIZE_BYTES;
}
