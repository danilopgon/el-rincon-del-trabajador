<p align="center">
  <img src="public/logo-marca.png" alt="El Rincón del Trabajador" height="96" />
</p>

<h1 align="center">El Rincón del Trabajador</h1>

<p align="center">
  Sitio web de <strong>El Rincón del Trabajador</strong> — tienda de vestuario laboral, EPI certificado y personalización con bordado y DTF en Tarancón, Cuenca.
</p>

<p align="center">
  <a href="https://elrincondeltrabajador.com" target="_blank">elrincondeltrabajador.com</a>
</p>

---

## Stack

| Capa               | Tecnología                                          |
| ------------------ | --------------------------------------------------- |
| Framework          | Astro 6 (SSG)                                       |
| Islas interactivas | React 19 vía `@astrojs/react`                       |
| Estilos            | TailwindCSS 4 (CSS-first, sin `tailwind.config.js`) |
| Animaciones        | GSAP 3                                              |
| Lenguaje           | TypeScript 6 (strict)                               |
| Build              | Vite 7 (interno de Astro)                           |
| Gestor de paquetes | pnpm 10                                             |
| Node               | ≥ 22.12.0                                           |

## Inicio rápido

```bash
pnpm install
pnpm dev        # http://localhost:4321
```

## Comandos

| Comando              | Acción                                      |
| -------------------- | ------------------------------------------- |
| `pnpm dev`           | Servidor de desarrollo en `localhost:4321`  |
| `pnpm build`         | Genera el sitio estático en `./dist/`       |
| `pnpm preview`       | Previsualiza el build antes de desplegar    |
| `pnpm quality`       | Lint + typecheck + format (gate de calidad) |
| `pnpm test:unit`     | Tests unitarios con Vitest                  |
| `pnpm test:e2e`      | Tests E2E con Playwright                    |
| `pnpm test:coverage` | Cobertura de tests                          |

## Calidad

`pnpm quality` ejecuta lint + typecheck + format check. Este comando corre automáticamente en cada commit vía `simple-git-hooks`.

Los tests **no** forman parte del gate de pre-commit — se ejecutan en CI o manualmente.

## Arquitectura de componentes

- **Componentes Astro** — sin JS en cliente salvo indicación explícita: `Hero`, `Marquee`, `Servicios`, `Sectores`, `About`, `Tienda`, `CTABanner`, `Footer`, `WhatsAppFab`, `LegalShell`
- **Islas React** — con estado o interactividad en cliente: `Header`, `FAQ`, `Personalizacion`, `CookieBanner`, `CookiePrefs`, `MapEmbed`
- **Librerías TS puras** (`src/lib/`): `anim.ts`, `contact.ts`, `consent.ts`

## Despliegue

El sitio se despliega como SSG en hosting compartido (Apache) vía SCP con autenticación por clave SSH. La configuración de conexión se guarda en `.deploy.json` (gitignored).

```bash
# requiere .deploy.json configurado
pnpm deploy
```

---

<p align="center">
  Creado por <a href="https://danilopgon.com" target="_blank">danilopgon</a> y <a href="https://grajoestudio.dev/" target="_blank">Grajo Estudio</a>
</p>
