/**
 * Integration tests for public/og-image.png
 *
 * These tests verify the generated static asset meets spec requirements:
 *   - File exists at public/og-image.png
 *   - Is valid PNG (magic bytes 0x89 0x50 0x4E 0x47)
 *   - Is exactly 1200×630 pixels
 *   - Is ≤ 300 KB (307200 bytes)
 *
 * TDD: Write RED first — the current og-image.png is the wrong portrait logo.
 * Run `pnpm og:generate` to regenerate, then these tests should be GREEN.
 */

import { describe, it, expect } from "vitest";
import { existsSync, statSync, readFileSync } from "fs";
import { resolve } from "path";
import sharp from "sharp";

// process.cwd() is available in the Vitest Node runtime — suppress ESLint no-undef
// eslint-disable-next-line no-undef
const OG_IMAGE_PATH = resolve(process.cwd(), "public/og-image.png");
const MAX_SIZE_BYTES = 307200; // 300 KB

describe("public/og-image.png — asset spec", () => {
  it("file exists at public/og-image.png", () => {
    expect(existsSync(OG_IMAGE_PATH)).toBe(true);
  });

  it("file is not empty", () => {
    const stat = statSync(OG_IMAGE_PATH);
    expect(stat.size).toBeGreaterThan(0);
  });

  it("file is valid PNG (magic bytes \\x89PNG)", () => {
    const buffer = readFileSync(OG_IMAGE_PATH);
    // PNG magic bytes: 0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A
    expect(buffer[0]).toBe(0x89);
    expect(buffer[1]).toBe(0x50); // P
    expect(buffer[2]).toBe(0x4e); // N
    expect(buffer[3]).toBe(0x47); // G
  });

  it("image is exactly 1200 pixels wide", async () => {
    const metadata = await sharp(OG_IMAGE_PATH).metadata();
    expect(metadata.width).toBe(1200);
  });

  it("image is exactly 630 pixels tall", async () => {
    const metadata = await sharp(OG_IMAGE_PATH).metadata();
    expect(metadata.height).toBe(630);
  });

  it("file size is ≤ 300 KB (307200 bytes)", () => {
    const stat = statSync(OG_IMAGE_PATH);
    expect(stat.size).toBeLessThanOrEqual(MAX_SIZE_BYTES);
  });
});
