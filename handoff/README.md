# Handoff — Landing **El Rincón del Trabajador**

Paquete de entrega para implementar la landing en **Astro + Tailwind + GSAP**.

## Qué hay aquí

| Archivo | Para qué |
|---|---|
| `DESIGN.md` | Especificación de diseño completa: tokens, tipografía, secciones, componentes, copy y comportamientos. |
| `SETUP.md` | Cómo inicializar el proyecto (Astro + Tailwind v4 + GSAP) e integrar los tokens. |
| `tailwind.config.mjs` | Config de Tailwind con la paleta, tipografías y escala de espaciado del diseño. |
| `tokens.css` | Custom properties listas para `src/styles/tokens.css`. |
| `reference/` | Prototipo HTML+React original que ha aprobado el cliente. Sirve como **referencia visual y de comportamiento**, no como código a copiar. |
| `assets/` | Logos en PNG y SVG (icono, lockup completo, motivos sueltos). |

## Fidelidad

**Hi-fi.** Los mocks de `reference/` están pixel-perfect en su versión por defecto (Hero Editorial · paleta Crema · Saira Condensed + Inter Tight · densidad Confort). Esa es la dirección **aprobada y a implementar**. Las otras variantes del panel de Tweaks (Hero Marco, Hero Dos rutas, paleta Kraft/Limpio/Night, tipografías alternativas) fueron exploración y **no entran en producción**.

## Lo que se espera del dev

1. Inicializar el repo siguiendo `SETUP.md`.
2. Implementar las secciones descritas en `DESIGN.md` como componentes Astro (con islas React solo donde haga falta interactividad — ver "State e interactividad" en `DESIGN.md`).
3. Reproducir el resultado visual exactamente como se ve en `reference/index.html` en su configuración por defecto.
4. Las animaciones de scroll-reveal y micro-interacciones se reimplementan con **GSAP + ScrollTrigger** (el prototipo usa IntersectionObserver — sustituir).

## Aclaraciones de contenido (ya aplicadas al copy)

- La tienda física es nueva en Tarancón; **los 15 años de oficio** vienen de experiencia previa en otra tienda del sector. El copy en `DESIGN.md` ya lo refleja correctamente — no inventar antigüedades de la tienda.
- Personalización **desde 1 unidad**. Bordado y DTF.
- El blog vive en `blog.elrincondeltrabajador.es` (subdominio externo en WordPress). En la nav y el footer apunta ahí con `target="_blank"`.
- Sin tienda online por ahora — dejar arquitectura abierta para añadirla en el futuro.

## Contacto

WhatsApp: 614 44 68 27 · Tarancón, Cuenca.
