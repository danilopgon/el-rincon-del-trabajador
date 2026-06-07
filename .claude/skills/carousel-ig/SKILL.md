# Skill: Instagram Carousel Generator

## Trigger

Load this skill when the user asks to:
- Generate, update, or create an Instagram carousel
- Add a new slide or change slide content/copy
- Export carousel slides as PNGs
- Create a carousel for a new client

## System Overview

The carousel pipeline lives in `carousel/` and has three layers:

| File | Role | Edit? |
|---|---|---|
| `carousel/slides-data.mjs` | All slide content + layout values | **Yes — content changes go here** |
| `carousel/generate.mjs` | Templates + CSS → `index.html` | Only for structural/layout changes |
| `carousel/export.mjs` | Playwright headless PNG export | Rarely |
| `carousel/build.mjs` | Orchestrator (`generate` + `export`) | No |

Assets live in `carousel/assets/`. PNG output goes to `carousel/slides/` (gitignored).

## Workflow

### To update content for an existing client:
1. Read `carousel/slides-data.mjs` — understand the current structure
2. Edit the relevant slide(s) in `slides-data.mjs`
3. Run: `node carousel/build.mjs`
4. PNGs appear in `carousel/slides/`

### To create a carousel for a new client:
1. Read `carousel/slides-data.mjs` as a reference template
2. Create a new copy, e.g. `carousel-newclient/slides-data.mjs`
3. Copy the build/generate/export scripts (they're client-agnostic)
4. Add new assets to `carousel-newclient/assets/`
5. Run the build

## slides-data.mjs Structure

### meta object
```js
export const meta = {
  title:        '…',      // <title> + page header
  lockupL1:     '…',      // top-left brand — line 1 (display font, uppercase)
  lockupL2:     '…',      // top-left brand — line 2 (smaller, gold)
  subtitle:     '…',      // page header subtitle
  footerText:   '…',      // page footer text
  studioUrl:    '…',      // studio URL (e.g. grajoestudio.dev)
  totalSlides:  7,         // used for "/ 07" counter
};
```

### Slide types and their key fields

**`cover`** — S01 portada
- `needle` — decorative SVG position: `{ top, right, rotate, opacity }`
- `eyebrow`, `eyebrowMarginTop`
- `headlineHtml`, `headlineFontSize`, `headlineMarginTop`
- `lead`, `leadFontSize`, `leadMaxWidth`
- `swipeRowMarginTop`, `microdot`, `swipeCta`

**`content-stats`** — S02 el encargo
- `counter`, `eyebrow`, `eyebrowMarginTop`
- `headlineHtml`, `headlineFontSize`, `headlineMarginTop`
- `bodyHtml`, `bodyMaxWidth`, `bodyMarginTop`
- `stats: [{ value, label, valueFontSize }]`
- `cornerFold: true`

**`elements-grid`** — S03 la idea
- `counter`, `eyebrow`, `eyebrowMarginTop`
- `headlineHtml`, `headlineFontSize`, `headlineMarginTop`
- `body`, `bodyMaxWidth`, `bodyMarginTop`
- `elements: [{ svgType: 'rincon'|'aguja'|'peto', name, desc }]`
  - SVGs are brand assets hardcoded in `generate.mjs`
- `cornerFold: true`

**`logo-showcase`** — S04 la marca
- `counter`, `eyebrow`, `eyebrowMarginTop`
- `logoSrc`, `logoAlt`
- `logoSizes: [{ label, width, height }]`
- `caption`, `captionFontSize`, `captionMaxWidth`
- `cornerFold: true`

**`system`** — S05 el sistema
- `counter`, `eyebrow`, `eyebrowMarginTop`
- `headlineHtml`, `headlineFontSize`, `headlineMarginTop`
- `swatchesMarginTop`
- `swatches: [{ name, bg, textColor, hex, hexColor }]`
- `typeGridMarginTop`
- `displayFontLabel`, `displaySample`, `displaySampleSubtitle`
- `bodyFontLabel`, `bodySample`
- `logoSrc`

**`web-screenshot`** — S06 en pantalla (on-dark)
- `bg: 'navy'`, `onDark: true`
- `counter`, `eyebrow`, `eyebrowMarginTop`
- `headlineHtml`, `headlineFontSize`, `headlineMarginTop`
- `lead`, `leadFontSize`, `leadMaxWidth`, `leadMarginTop`
- `browserUrl`, `screenshotSrc`, `browserMarginTop`
- `features: [{ title, desc }]`
- `featureGridMarginTop`, `featureGridGap`
- `cornerFold: true`

**`closing`** — S07 cierre (on-dark)
- `bg: 'navydeep'`, `onDark: true`
- `counter`, `eyebrow`
- `headlineHtml`, `headlineFontSize`, `headlineMarginTop`
- `lead`, `leadMaxWidth`, `leadMarginTop`
- `creditTitle`, `creditName`, `creditContact`
- `creditLogoSrc`, `callToAction`

## Markup allowed in `*Html` fields

```
<br />                                      — line break
<span class="hl">word</span>               — gold highlight with glow
<span style="color:var(--gold-deep)">…</span>  — gold-deep color
<strong style="color:var(--ink);font-weight:600">name</strong>  — emphasis
```

## Design tokens (CSS variables in generate.mjs)

| Token | Value | Use |
|---|---|---|
| `--navy` | `#24303f` | Primary dark |
| `--navy-deep` | `#181f2a` | Deeper dark (S07 bg) |
| `--gold` | `#cca43b` | Accent, highlights |
| `--gold-deep` | `#a8842a` | Eyebrow, swipe CTA |
| `--brown` | `#4d341f` | Peto SVG color |
| `--cream` | `#f7efd9` | Light bg, on-dark text |
| `--paper` | `#faf6eb` | Slightly warmer light bg |
| `--ink` | `#1a222d` | Body text |
| `--muted` | `#6f6a5c` | Secondary text |

## Fonts

- **Display**: Saira Condensed (wght 500–900) — `var(--font-display)`
- **Body**: Inter Tight (wght 400–700) — `var(--font-sans)`
- Loaded via Google Fonts in the generated HTML

## Output format

- **Size**: 1080 × 1350 px (Instagram 4:5)
- **Format**: PNG
- **Path**: `carousel/slides/slide-01.png` … `slide-07.png`

## Notes

- `build.mjs` overwrites all 7 PNGs on every run
- Playwright uses `document.fonts.ready` to ensure web fonts render before capture
- The viewer (`index.html`) also works manually: click a slide → export URL opens at full size
- Generated `slides/*.png` and `index.html.bak` are gitignored
