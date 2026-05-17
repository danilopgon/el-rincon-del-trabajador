# SETUP.md — Astro + Tailwind v4 + GSAP

> Pasos para arrancar el repo de producción. Probado a 17 de mayo de 2026.

---

## 1. Crear el proyecto

```bash
npm create astro@latest elrincondeltrabajador -- --template minimal --typescript strict --no-git --install
cd elrincondeltrabajador
```

> Si vas a desplegar en Vercel / Netlify, añade después su adapter oficial (`npx astro add vercel` o similar).

---

## 2. Añadir Tailwind v4 (vía Vite plugin — la forma actual)

Tailwind v4 ya no usa el integration de Astro; se mete como plugin de Vite.

```bash
npm install tailwindcss @tailwindcss/vite
```

Edita `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
});
```

Crea `src/styles/global.css`:

```css
@import "tailwindcss";
@import "./tokens.css";
```

Copia `handoff/tokens.css` a `src/styles/tokens.css` y `handoff/tailwind.config.mjs` (sirve de referencia para el `@theme` de Tailwind v4) o, directamente, usa el bloque `@theme` que está abajo dentro de `tokens.css`.

Importa el CSS global desde un layout (`src/layouts/Base.astro`):

```astro
---
import '../styles/global.css';
---
<!doctype html>
<html lang="es">
  <head>…</head>
  <body><slot /></body>
</html>
```

---

## 3. React (solo para islas)

```bash
npx astro add react
```

Acepta los prompts. Usar `client:visible` o `client:idle` en las islas que lo necesiten:

```astro
<FAQ client:visible />
<Personalizacion client:visible />
<Header client:load />
```

---

## 4. GSAP + ScrollTrigger

```bash
npm install gsap
```

`src/lib/anim.ts`:

```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
```

Helper de reveal universal — añadir a un `<script>` en el layout base:

```astro
<script>
  import { gsap, ScrollTrigger } from '../lib/anim';

  document.querySelectorAll('[data-reveal]').forEach((el, i) => {
    gsap.fromTo(
      el,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out',
        delay: (Number(el.getAttribute('data-reveal-delay')) || 0) / 1000,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
</script>
```

Para stagger de cards (Servicios, Sectores):

```astro
<script>
  import { gsap, ScrollTrigger } from '../lib/anim';

  gsap.utils.toArray<HTMLElement>('[data-reveal-stagger] > *').forEach((el) => {
    gsap.fromTo(el,
      { y: 32, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 92%' },
      }
    );
  });
</script>
```

---

## 5. Tipografías

Usar `@fontsource-variable/saira-condensed` y `@fontsource-variable/inter-tight` (autohostadas — mejor performance y privacidad que Google Fonts).

```bash
npm install @fontsource-variable/saira-condensed @fontsource-variable/inter-tight
```

En `src/styles/global.css` (encima de los imports):

```css
@import "@fontsource-variable/saira-condensed/wght.css";
@import "@fontsource-variable/inter-tight/wght.css";
```

> Saira Condensed no tiene variable font oficial; si el paquete no existe con ese nombre, instala `@fontsource/saira-condensed` y mete los weights 700/800/900 a mano.

---

## 6. Estructura de carpetas recomendada

```
src/
  assets/                  # logos, motivos SVG (importados, no en /public)
  components/
    Header.tsx             (island)
    Hero.astro
    Marquee.astro
    Servicios.astro
    Sectores.astro
    Personalizacion.tsx    (island — tabs)
    About.astro
    Tienda.astro
    FAQ.tsx                (island — accordion)
    CTABanner.astro
    Footer.astro
    WhatsAppFab.astro
    icons/                 # un .astro por icono o un único Icon.astro con name=
  layouts/
    Base.astro
  pages/
    index.astro
  lib/
    anim.ts
  styles/
    global.css
    tokens.css
public/
  fonts/                   # solo si autohostas a pelo
  og-image.png
```

---

## 7. Componentes a las islas mínimas

| Componente | Tipo | Por qué |
|---|---|---|
| Header | `client:load` | Listener de scroll + futuro toggle de menú móvil. |
| Personalizacion | `client:visible` | useState para tabs + galería. |
| FAQ | `client:visible` | useState para acordeón (también vale `<details>` puro Astro si quieres ahorrar JS — ver siguiente apartado). |
| Resto | Astro estático | Sin JS, sin hidratación. |

**Truco**: la FAQ se puede hacer **sin React** con `<details>` + `<summary>` + un poquito de CSS para la rotación del `+`. Ahorra una isla entera. Considera esa opción.

---

## 8. WhatsApp y CTAs

Centraliza el teléfono y el WA en `src/lib/contact.ts`:

```ts
export const CONTACT = {
  phone: '+34614446827',
  phoneDisplay: '614 44 68 27',
  whatsapp: 'https://wa.me/34614446827',
  whatsappCta: 'https://wa.me/34614446827?text=Hola%2C+me+gustar%C3%ADa+pedir+presupuesto',
  email: 'hola@elrincondeltrabajador.es',
  address: 'C. Julián García, 9, 16400 Tarancón, Cuenca',
  hoursWeek: 'L–V 9:00–14:00 · 16:00–19:00',
  hoursWeekend: 'Sábados: cerrado',
};
```

Y úsalo en todos los componentes. **Verificar dirección y horario reales con el cliente antes de publicar.**

---

## 9. Performance checklist

- [ ] Imágenes con `<Image>` de Astro o `<Picture>` (lazy + responsive por defecto).
- [ ] OG image 1200×630 generada y referenciada.
- [ ] Tipografías subseteadas a `latin` + `latin-ext` (incluye ñ y acentos).
- [ ] `font-display: swap`.
- [ ] Marquee con `will-change: transform` para evitar repaints.
- [ ] GSAP solo se carga en páginas que lo necesitan (importar dinámicamente si vais a más páginas).

---

## 10. Variables de entorno

No hay backend de momento. Si más adelante hay form de contacto, montar endpoint Astro `src/pages/api/contacto.ts` y un servicio de email transaccional (Resend / Postmark) con la API key en `.env`.

---

## 11. Despliegue sugerido

- **Vercel** (más cómodo si vais a iterar mucho) o **Netlify**.
- DNS:
  - `elrincondeltrabajador.es` → Astro.
  - `blog.elrincondeltrabajador.es` → WordPress existente (ya está configurado, no tocar).
  - `www.elrincondeltrabajador.es` → redirect 301 a apex.

---

## 12. Smoke test

Antes de hacer merge:

1. `npm run build && npm run preview` corre limpio.
2. Lighthouse mobile ≥ 95 en Performance, 100 en SEO/Best Practices/Accessibility.
3. Probar todos los CTAs en móvil real (WhatsApp abre la app, `tel:` lanza el dialer, `mailto:` abre cliente de correo).
4. El embed del mapa carga.
5. El link del blog se abre en pestaña nueva.
6. Reveal animations no saltan al hacer scroll rápido (poner `toggleActions: 'play none none none'`).
