/**
 * export.mjs — Playwright headless PNG export for all slides.
 *
 * Uses the existing @playwright/test chromium (no extra dependencies).
 * Navigates to each slide's export URL and screenshots at 1080×1350.
 *
 * Run via:  node carrusel/build.mjs   (recommended)
 *       or: node carrusel/export.mjs  (standalone — requires index.html to exist)
 */

import { chromium } from "@playwright/test";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { slides } from "./slides-data.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SLIDES_DIR = path.join(__dirname, "slides");
const HTML_FILE = path.join(__dirname, "index.html");

export async function exportSlides() {
  await fs.mkdir(SLIDES_DIR, { recursive: true });

  // pathToFileURL correctly handles Windows backslashes → forward slashes
  const baseUrl = pathToFileURL(HTML_FILE).href;

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  // deviceScaleFactor: 1 keeps output at exactly 1080×1350 (not 2×)
  await page.setViewportSize({ width: 1080, height: 1350 });

  try {
    for (const slide of slides) {
      const url = `${baseUrl}?mode=export&slide=${slide.id}`;
      await page.goto(url, { waitUntil: "networkidle" });
      // Ensure web fonts (Saira Condensed, Inter Tight) are fully rendered
      await page.evaluate(() => document.fonts.ready);

      const num = slide.id.replace("s", "").padStart(2, "0");
      const outPath = path.join(SLIDES_DIR, `slide-${num}.png`);

      await page.screenshot({
        path: outPath,
        clip: { x: 0, y: 0, width: 1080, height: 1350 },
      });

      console.log(`  ✓ slide-${num}.png  (${slide.nav})`);
    }
  } finally {
    await browser.close();
  }
}

// Allow running standalone: node carrusel/export.mjs
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  exportSlides().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
