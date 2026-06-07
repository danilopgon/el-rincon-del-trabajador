/**
 * build.mjs — Full carousel pipeline.
 *
 * Usage:
 *   node carrusel/build.mjs
 *
 * Steps:
 *   1. Reads slides-data.mjs
 *   2. Generates carrusel/index.html via generate.mjs
 *   3. Launches Playwright headless chromium
 *   4. Screenshots all slides at 1080×1350 → carrusel/slides/slide-XX.png
 *   5. Exits
 *
 * Edit slides-data.mjs for content changes.
 * Edit generate.mjs only for structural / template changes.
 */

import { generate } from "./generate.mjs";
import { exportSlides } from "./export.mjs";

console.log("\n[carousel] Generating index.html…");
await generate();

console.log("[carousel] Exporting slides via Playwright…");
await exportSlides();

console.log("[carousel] Done.\n");
