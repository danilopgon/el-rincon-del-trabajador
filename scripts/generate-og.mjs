/**
 * generate-og.mjs — OG social card generator for El Rincón del Trabajador.
 *
 * Usage: node scripts/generate-og.mjs
 *        pnpm og:generate
 *
 * Output: public/og-image.png (1200×630, ≤300 KB)
 *
 * NOT wired into `build`, `dev`, or `quality`. Run manually and commit the PNG.
 *
 * Card layout (split design, corrected post user review):
 *   ┌──────────────────────────────────────────────────────┐
 *   │  CREAM #f7efd9   │ │  NAVY #24303f                   │
 *   │   (380px wide)   │ │   (remaining width)              │
 *   │                  │ │                                  │
 *   │  [logo-completo  │ │  Vestuario laboral y EPI         │
 *   │   .png centered] │ │  Tarancón                        │
 *   │                  │ │                                  │
 *   │                  │ │  (business name in logo image)   │
 *   └──────────────────────────────────────────────────────┘
 *
 * Text rendering: SVG composite via sharp.
 * Accented chars (ñ, ó) are embedded as UTF-8 in the SVG buffer.
 */

import { statSync } from "fs";
import { resolve, join, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { cardLayout, brandColors, cardText, fileSizeOk } from "./og-layout.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// Asset paths
// ---------------------------------------------------------------------------

const LOGO_PNG_PATH = join(ROOT, "src/assets/logo-completo.png");
const OUTPUT_PATH = join(ROOT, "public/og-image.png");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Converts a hex color string to {r, g, b} components.
 * @param {string} hex — e.g. "#24303f"
 * @returns {{ r: number, g: number, b: number }}
 */
function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

/**
 * Creates a solid-color PNG buffer using sharp.create.
 * @param {number} width
 * @param {number} height
 * @param {string} hexColor
 * @returns {Promise<Buffer>}
 */
async function solidColorBuffer(width, height, hexColor) {
  const { r, g, b } = hexToRgb(hexColor);
  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r, g, b },
    },
  })
    .png()
    .toBuffer();
}

/**
 * Builds an SVG string for the text overlay on the right (navy) zone.
 * Text is rendered in the correct brand font stack.
 * The SVG dimensions match the text zone; it will be composited at textZone.x.
 *
 * @param {{ canvas: object, textZone: { x: number, y: number, width: number, height: number }, padding: number }} layout
 * @returns {string}
 */
function buildTextSvg(layout) {
  const { textZone, padding } = layout;
  const w = textZone.width;
  const h = textZone.height;
  const p = padding; // left padding within text zone

  // Font stack — system fonts available on most platforms
  // Saira Condensed is not embedded (avoids base64 bloat + Windows librsvg issues)
  // Arial Narrow / Impact approximate the condensed look; acceptable fallback
  const fontFamily = "'Arial Narrow', 'Arial', sans-serif";

  // Option A layout: tagline (primary, top) + city (secondary, below)
  // Business name is already shown inside logo-completo.png — not repeated here.
  const taglineSize = 52; // primary — larger
  const citySize = 30; // secondary — smaller
  const lineGap = 24; // vertical gap between tagline and city

  // Block height: tagline line + gap + city line
  const blockHeight = taglineSize + lineGap + citySize;

  const blockStartY = Math.round((h - blockHeight) / 2);

  const taglineY = blockStartY + taglineSize;
  const cityY = taglineY + lineGap + citySize;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <!-- Transparent background — composited over navy zone -->
  <rect width="${w}" height="${h}" fill="none"/>

  <!-- Tagline — primary text (white, larger) -->
  <text
    x="${p}"
    y="${taglineY}"
    font-family="${fontFamily}"
    font-weight="bold"
    font-size="${taglineSize}"
    fill="${brandColors.white}"
  >${cardText.tagline}</text>

  <!-- City — secondary text (white, smaller, muted) -->
  <text
    x="${p}"
    y="${cityY}"
    font-family="${fontFamily}"
    font-weight="bold"
    font-size="${citySize}"
    fill="${brandColors.white}"
    opacity="0.8"
  >${cardText.city}</text>
</svg>`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("Generating OG social card (split layout)...");

  const layout = cardLayout();
  const { canvas, logoZone, separator, textZone } = layout;

  // 1. Create navy background (full canvas)
  console.log("  1/6 Building navy background...");
  const navyBg = await solidColorBuffer(canvas.width, canvas.height, brandColors.navy);

  // 2. Create cream rectangle for logo zone
  console.log("  2/6 Building cream logo zone...");
  const creamRect = await solidColorBuffer(logoZone.width, logoZone.height, brandColors.cream);

  // 3. Create gold separator
  console.log("  3/6 Building gold separator...");
  const goldSep = await solidColorBuffer(separator.width, separator.height, brandColors.gold);

  // 4. Prepare logo PNG — resize to fit inside logo zone with padding
  console.log("  4/6 Compositing logo-completo.png...");
  const logoPadding = Math.round(layout.padding * 0.8);
  const logoMaxW = logoZone.width - logoPadding * 2;
  const logoMaxH = canvas.height - logoPadding * 2;

  const logoBuffer = await sharp(LOGO_PNG_PATH)
    .resize(logoMaxW, logoMaxH, { fit: "inside", withoutEnlargement: false })
    .png()
    .toBuffer();

  // Get actual resized logo dimensions to center it
  const logoMeta = await sharp(logoBuffer).metadata();
  const logoOffsetX = Math.round((logoZone.width - logoMeta.width) / 2);
  const logoOffsetY = Math.round((canvas.height - logoMeta.height) / 2);

  // 5. Build text SVG overlay for right zone
  console.log("  5/6 Building text overlay...");
  const textSvgStr = buildTextSvg(layout);
  const textSvgBuffer = Buffer.from(textSvgStr, "utf8");

  // 6. Composite all layers onto navy background
  console.log("  6/6 Compositing layers and writing output...");
  await sharp(navyBg)
    .composite([
      // Cream logo zone background
      { input: creamRect, left: logoZone.x, top: logoZone.y },
      // Logo image centered in cream zone
      { input: logoBuffer, left: logoOffsetX, top: logoOffsetY },
      // Gold separator line
      { input: goldSep, left: separator.x, top: separator.y },
      // Text overlay on the right (navy) zone
      { input: textSvgBuffer, left: textZone.x, top: textZone.y },
    ])
    .png({ compressionLevel: 9 })
    .toFile(OUTPUT_PATH);

  // 7. Verify output
  const stat = statSync(OUTPUT_PATH);
  const sizeKB = (stat.size / 1024).toFixed(1);

  console.log(`\nOutput: ${OUTPUT_PATH}`);
  console.log(`Size:   ${sizeKB} KB (${stat.size} bytes)`);

  if (!fileSizeOk(stat.size)) {
    console.error(`ERROR: File size ${stat.size} bytes exceeds 300 KB limit (307200 bytes).`);
    console.error("Try: increase compressionLevel or reduce bit depth.");
    process.exit(1);
  }

  const metadata = await sharp(OUTPUT_PATH).metadata();
  if (metadata.width !== 1200 || metadata.height !== 630) {
    console.error(
      `ERROR: Output dimensions are ${metadata.width}×${metadata.height}, expected 1200×630.`
    );
    process.exit(1);
  }

  console.log(`Dimensions: ${metadata.width}×${metadata.height} px`);
  console.log("Done. Inspect public/og-image.png for visual quality.");
  console.log("IMPORTANT: Verify ñ, ó accents and split layout visually before committing.");
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
