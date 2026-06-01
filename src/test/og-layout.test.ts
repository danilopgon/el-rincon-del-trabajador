/**
 * Unit tests for scripts/og-layout.mjs
 * og-image: 1200×630 PNG — regenerate with pnpm og:generate
 *
 * Corrected design (post user review):
 *   - Split layout: cream (#f7efd9) logo zone LEFT, navy (#24303f) text zone RIGHT
 *   - Gold accent separator: #cca43b
 *   - Logo source: src/assets/logo-completo.png (rasterized, preserves original colors)
 *
 * TDD cycle: tests written FIRST to assert the corrected design.
 */

import { describe, it, expect } from "vitest";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — plain ESM module, no type declarations
import { cardLayout, brandColors, fileSizeOk, cardText } from "../../scripts/og-layout.mjs";

// ---------------------------------------------------------------------------
// cardLayout()
// ---------------------------------------------------------------------------

describe("cardLayout()", () => {
  it("returns a canvas of exactly 1200×630", () => {
    const layout = cardLayout();
    expect(layout.canvas.width).toBe(1200);
    expect(layout.canvas.height).toBe(630);
  });

  it("logo zone starts at x=0 and spans up to ~480px (left zone)", () => {
    const layout = cardLayout();
    expect(layout.logoZone.x).toBe(0);
    expect(layout.logoZone.width).toBeGreaterThanOrEqual(360);
    expect(layout.logoZone.width).toBeLessThanOrEqual(520);
  });

  it("logo zone height equals canvas height (full height split)", () => {
    const layout = cardLayout();
    expect(layout.logoZone.height).toBe(630);
  });

  it("separator line is within logo zone right edge area", () => {
    const layout = cardLayout();
    // Separator sits at the boundary between zones
    expect(layout.separator.x).toBeGreaterThanOrEqual(layout.logoZone.width - 10);
    expect(layout.separator.x).toBeLessThanOrEqual(layout.logoZone.width + 10);
    expect(layout.separator.width).toBeGreaterThanOrEqual(3);
    expect(layout.separator.width).toBeLessThanOrEqual(6);
  });

  it("text zone starts after logo zone + separator and has positive width", () => {
    const layout = cardLayout();
    expect(layout.textZone.x).toBeGreaterThan(layout.logoZone.width);
    expect(layout.textZone.width).toBeGreaterThan(0);
    // text zone must not exceed canvas width
    expect(layout.textZone.x + layout.textZone.width).toBeLessThanOrEqual(1200);
  });

  it("text zone height equals canvas height", () => {
    const layout = cardLayout();
    expect(layout.textZone.height).toBe(630);
  });

  it("padding is at least 40px (safe zone)", () => {
    const layout = cardLayout();
    expect(layout.padding).toBeGreaterThanOrEqual(40);
  });
});

// ---------------------------------------------------------------------------
// brandColors — corrected design (post user review)
// ---------------------------------------------------------------------------

describe("brandColors", () => {
  it("navy background (text zone) is #24303f", () => {
    expect(brandColors.navy).toBe("#24303f");
  });

  it("gold accent (separator + tagline) is #cca43b", () => {
    expect(brandColors.gold).toBe("#cca43b");
  });

  it("cream background (logo zone) is #f7efd9", () => {
    expect(brandColors.cream).toBe("#f7efd9");
  });

  it("white text is #ffffff", () => {
    expect(brandColors.white).toBe("#ffffff");
  });
});

// ---------------------------------------------------------------------------
// cardText — Option A: tagline + city only (no business name in text zone)
// ---------------------------------------------------------------------------

describe("cardText", () => {
  it("exports a tagline string (non-empty)", () => {
    expect(typeof cardText.tagline).toBe("string");
    expect(cardText.tagline.length).toBeGreaterThan(0);
  });

  it("tagline is 'Vestuario laboral y EPI'", () => {
    expect(cardText.tagline).toBe("Vestuario laboral y EPI");
  });

  it("exports a city string (non-empty)", () => {
    expect(typeof cardText.city).toBe("string");
    expect(cardText.city.length).toBeGreaterThan(0);
  });

  it("city is 'Tarancón'", () => {
    expect(cardText.city).toBe("Tarancón");
  });

  it("does NOT export a businessName property", () => {
    expect(cardText).not.toHaveProperty("businessName");
    expect(cardText).not.toHaveProperty("name");
  });
});

// ---------------------------------------------------------------------------
// fileSizeOk()
// ---------------------------------------------------------------------------

describe("fileSizeOk()", () => {
  it("returns true for a file exactly at the 300 KB limit (307200 bytes)", () => {
    expect(fileSizeOk(307200)).toBe(true);
  });

  it("returns false for a file one byte over the 300 KB limit (307201 bytes)", () => {
    expect(fileSizeOk(307201)).toBe(false);
  });

  it("returns true for a small file (1000 bytes)", () => {
    expect(fileSizeOk(1000)).toBe(true);
  });

  it("returns false for zero bytes (no content)", () => {
    expect(fileSizeOk(0)).toBe(false);
  });
});
