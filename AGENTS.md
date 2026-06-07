# El Rincón del Trabajador — Project Context for AI Agents

## Stack

- **Framework**: Astro 6.3.6 (SSG — no SSR, no server routes)
- **Islands**: React 19.x via `@astrojs/react` (only where interactivity is required)
- **Styling**: TailwindCSS 4.x (CSS-first config, no `tailwind.config.js`)
- **Language**: TypeScript 6.x (strict)
- **Animations**: GSAP 3.x
- **Build tool**: Vite 7.3.3 (internal to Astro)
- **Package manager**: pnpm 10.18.0 — use pnpm, never npm or yarn
- **Node**: >=22.12.0
- **Sitemap**: `@astrojs/sitemap`

## Component Architecture

### Astro components (pure, no client JS unless explicitly noted)

`Hero`, `Marquee`, `Servicios`, `Sectores`, `About`, `Tienda`, `CTABanner`, `Footer`, `WhatsAppFab`, `LegalShell`

### React TSX islands (client-side interactivity)

`Header.tsx`, `FAQ.tsx`, `Personalizacion.tsx`, `CookieBanner.tsx`, `CookiePrefs.tsx`, `MapEmbed.tsx`

### Pure TS libraries (`src/lib/`)

`anim.ts`, `contact.ts`, `consent.ts`

**Rule**: Default to Astro components. Reach for React only when the component genuinely needs client-side state or event handling. Never add `client:*` directives to components that don't need them.

## Testing

**Strict TDD mode is active.** Tests go before or alongside implementation — never after.

| Layer                    | Tool                                          | Command              |
| ------------------------ | --------------------------------------------- | -------------------- |
| Unit + Component (React) | Vitest 4.1.8 + jsdom + @testing-library/react | `pnpm test:unit`     |
| E2E                      | Playwright 1.60                               | `pnpm test:e2e`      |
| Coverage                 | @vitest/coverage-v8                           | `pnpm test:coverage` |

**Watch mode**: `pnpm test:unit:watch`

Config files: `vitest.config.ts`, `playwright.config.ts`, `src/test/setup.ts`

No `.astro` unit tests — only React TSX islands and pure TS libs are unit-tested.

### Gotcha — Vitest version

Vitest 3.x is broken on npm (no `vite-node@3.x` on registry). This project pins **Vitest 4.1.8** — the only version compatible with Vite 7 at install time. Do not upgrade without checking registry availability.

### Gotcha — ESLint globals in tests

ESLint has no `localStorage` in its globals config. Use `window.localStorage` in test files to avoid `no-undef`. Do not modify `eslint.config.js`.

### Gotcha — @vitejs/plugin-react version

Use `@vitejs/plugin-react@5.2.0` for Vite 7. v6 requires Vite ^8 and is incompatible.

## Quality Gate

```
pnpm quality    # lint + typecheck + format:check + test:unit (runs on pre-commit via simple-git-hooks)
pnpm lint       # ESLint 10
pnpm typecheck  # astro check + tsc --noEmit
pnpm format:check  # Prettier 3
```

`pnpm test:unit` is part of `pnpm quality` and therefore runs on every commit via the pre-commit hook.

## Dev Workflow

### Commit convention

No intermediate commits during implementation. Accumulate all changes and commit at the end of the session, either manually or when the user explicitly requests it. Never call `git commit` or `git add` autonomously during implementation.

Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `perf:`, `refactor:`, `test:`, `docs:`, `chore:`. No AI attribution in commit messages.

### Pre-commit hook

`simple-git-hooks` runs `pnpm quality` on every commit. If it fails, fix the underlying issue — never bypass with `--no-verify`.

## Deploy

Push to `main` — GitHub Actions runs quality gate, E2E tests, and deploys automatically via SSH.
See `.github/workflows/deploy.yml` for details.
