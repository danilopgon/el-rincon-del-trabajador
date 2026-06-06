import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";
import { describe, expect, it } from "vitest";

const readSource = (path: string) => readFileSync(join(cwd(), path), "utf8");

describe("static accessibility safeguards", () => {
  it("keeps decorative Astro SVG icon components hidden from assistive tech", () => {
    const files = ["src/components/icons/Icon.astro", "src/components/icons/NeedleSVG.astro"];

    for (const file of files) {
      const source = readSource(file);
      const svgTags = source.match(/<svg\b[\s\S]*?>/g) ?? [];
      const exposedSvgTags = svgTags.filter((tag) => !tag.includes('aria-hidden="true"'));

      expect(exposedSvgTags, `${file} has exposed decorative SVG tags`).toEqual([]);
    }
  });

  it("does not override sector card labels with mismatching aria-label text", () => {
    const source = readSource("src/components/Sectores.astro");

    expect(source).not.toContain("aria-label={`${s.title}:");
  });

  it("places the skip link inside a navigation landmark", () => {
    const source = readSource("src/layouts/Base.astro");

    expect(source).toContain('<nav class="skip-nav" aria-label="Accesos rápidos">');
    expect(source).toContain('<a href="#main-content" class="skip-link">Saltar al contenido</a>');
  });

  it("uses accessible contrast for brand gold and footer headings", () => {
    const tokens = readSource("src/styles/tokens.css");
    const global = readSource("src/styles/global.css");

    expect(tokens).toContain("--color-gold-deep: #765a16;");
    expect(global).toContain(".ftr h3");
    expect(global).toContain("color: var(--c-gold);");
  });
});
