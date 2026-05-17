# DESIGN.md — Landing El Rincón del Trabajador

> Especificación de diseño hi-fi. La fuente visual de verdad es `reference/index.html` (defaults: Hero Editorial · paleta Crema · Saira+Inter · densidad Confort).

---

## 1. Marca

### 1.1 Logos disponibles

| Archivo | Uso |
|---|---|
| `assets/logo-marca.png` | Icono cuadrado (frame + aguja + mono). Header, favicon, og-image. |
| `assets/logo-completo.png` | Lockup vertical icono + "EL RINCÓN DEL TRABAJADOR". Footer alternativo, materiales impresos. |
| `assets/Aguja.svg` | Aguja suelta. Úsala como motivo decorativo (acentos en hero, dividers). |
| `assets/Rincon.svg` | Marco con esquina doblada. Sirve de inspiración para clip-paths decorativos. |
| `assets/Mono.svg`, `assets/Sin-texto.svg` | Variantes adicionales del icono. |

**Reglas**
- Tamaño mínimo del icono: 32×45 px (mantener proporción ~0.71).
- Espacio de respeto: equivalente al ancho del bucle de la aguja.
- Nunca recolorear el PNG. Para versiones mono usar el SVG.

### 1.2 Paleta (paleta "Crema clásica", la que va a producción)

| Token | Hex | Uso |
|---|---|---|
| `--c-navy` | `#24303F` | Texto principal, botones, fondos de CTA, banner footer. |
| `--c-navy-deep` | `#181F2A` | Hover del primary, fondo del footer. |
| `--c-gold` | `#CCA43B` | Acento principal: subrayados, esquinas, badges, marcas activas. |
| `--c-gold-deep` | `#A8842A` | Hover del gold y para texto-acento sobre crema (más contraste). |
| `--c-brown` | `#4D341F` | Reservado para detalles (peto del mono en ilustraciones). No usar para UI. |
| `--c-cream` | `#F7EFD9` | Fondo principal. |
| `--c-cream-deep` | `#EFE3C4` | Placeholders de imagen, fondos de iconos. |
| `--c-paper` | `#FAF6EB` | Fondo de secciones alternas (`.section--paper`). |
| `--c-ink` | `#1A222D` | Texto cuerpo. |
| `--c-muted` | `#6F6A5C` | Texto secundario, captions, metadatos. |
| `--c-line` | `rgba(36,48,63,0.12)` | Bordes y separadores. |

Verdes adicionales para WhatsApp FAB: fondo `#25D366`, texto `#0A2E1E`.

### 1.3 Tipografía

| Rol | Font | Weights | Donde |
|---|---|---|---|
| Display | **Saira Condensed** | 700, 800, 900 | Todos los H1–H3, eyebrows mayúsculas, números grandes, botones. |
| Body | **Inter Tight** | 400, 500, 600, 700 | Texto cuerpo, botones, navegación. |
| Mono (opcional) | JetBrains Mono | 400 | Reservado para futuro (referencias, códigos de producto). |

**Características OpenType**: `font-feature-settings: "ss01", "cv11"` en `<body>`.

**Escala**
```
h1        clamp(56px, 7.6vw, 132px)   line-height 0.95   letter-spacing -0.01em   UPPER
heroA__t  clamp(64px, 9.5vw, 168px)   line-height 0.86   letter-spacing -0.02em   UPPER
h2        clamp(40px,  5vw,  84px)   line-height 0.95   letter-spacing -0.01em   UPPER
h3        clamp(22px, 1.8vw,  28px)   line-height 1.05                            UPPER
lead      clamp(18px, 1.4vw,  22px)   line-height 1.45
body      17px / 1.55
eyebrow   13px UPPER  letter-spacing 0.14em  weight 600  color: gold-deep
```

Todos los headings llevan `text-wrap: balance`; los párrafos `text-wrap: pretty`.

### 1.4 Espaciado y radios

```
--d-pad-y   96px     (vertical de sección)
--d-pad-x   64px     (horizontal de wrap)
--d-gap     24px     (gap de grids)
--d-radius  14px
--d-radius-lg 28px
--max-w     1320px
```

### 1.5 Motivos gráficos recurrentes

1. **Esquina dorada (triángulo)** — derivada del logo. Aparece en:
   - Hero Editorial: sticker dorado sobre la imagen.
   - Hero Marco: triángulo en esquina inferior-izquierda del marco.
   - About: triángulo en esquina inferior-izquierda de la foto.
   - CTA banner: triángulo enorme en esquina inferior-derecha.
   - Implementación: `clip-path: polygon(0 0, 100% 100%, 0 100%);` sobre un `div` con `background: var(--c-gold)`.

2. **Aguja decorativa** — silueta vertical (asa redondeada + cuerpo cónico). En el hero como acento sutil rotado.

3. **Marco dorado** — `border: 8px solid var(--c-gold)` en el hero "Marco" (variante opcional).

---

## 2. Layout global

### 2.1 Container

```css
.wrap { max-width: 1320px; margin: 0 auto; padding: 0 64px; }
```

### 2.2 Secciones

- `.section { padding: 96px 0; position: relative; }`
- `.section--paper { background: var(--c-paper); }` — fondo levemente más cálido para alternancia.
- `.section--navy` — fondo navy, texto crema.

**Patrón de alternancia**: Hero (cream) → Marquee (paper) → Servicios (cream) → Sectores (paper) → Personalización (cream) → About (paper) → Tienda (cream) → FAQ (paper) → CTA (navy) → Footer (navy-deep).

### 2.3 Responsive

- `≤ 1100px`: grids de 4 cols → 2 cols; sectores 6→3.
- `≤ 800px`: todo a 1 col; nav y teléfono del header se ocultan (poner hamburguesa en producción); padding lateral a 22px.

---

## 3. Header

Sticky, `backdrop-filter: blur(10px)`, fondo `color-mix(in oklab, var(--bg) 88%, transparent)`. Cuando `window.scrollY > 12` añadir clase `is-scrolled` que muestra el borde inferior.

**Estructura** (`flex; justify-content: space-between; padding: 16px 0`):
1. **Logo** (izq): `LogoMark size=52` + bloque de texto con "El Rincón" (Saira 800, 18px) y "del Trabajador" (Saira 600, 12px, letter-spacing 0.18em, color gold-deep, uppercase).
2. **Nav** (centro): Servicios · Sectores · Personalización · Tienda · **Blog ↗** · Contacto. Cada link es 14px / weight 500 / opacity 0.85. Hover: subrayado dorado de 2px que crece de izq a der (300ms).
3. **CTA stack** (der):
   - Teléfono clic-llamada `614 44 68 27` con icono.
   - Botón `Pedir presupuesto` (variant gold) con icono arrow-up-right.

El link "Blog" abre `https://blog.elrincondeltrabajador.es` en `target="_blank"` con `rel="noopener"`.

---

## 4. Hero (variante Editorial — la que va a producción)

Grid de 2 columnas `1.1fr 0.9fr`, gap 48px, alineadas al fondo.

**Columna izquierda**
1. Eyebrow: `Tarancón · Cuenca · 15 años de oficio`
2. H1 enorme:
   ```
   Vestimos a quien
   trabaja de verdad.
   ```
   La segunda línea va en `<em>` con `color: var(--c-gold)` y un highlight detrás (`::after` absoluto a 18% opacity, altura 14% desde abajo).
3. Subtítulo (18px, max-width 48ch): "Ropa laboral, EPI certificado y personalización con bordado o DTF desde una sola unidad. Asesoramiento de toda la vida, en la tienda o por WhatsApp."
4. Acciones (gap 12px):
   - Primary `Pedir presupuesto` (navy, ancla `#contacto`)
   - Ghost `Hablamos por WhatsApp` (icono WA + texto, link `https://wa.me/34614446827`)
5. Metadatos en fila (gap 28px), tres ítems:
   - `+15` / "años en el sector"
   - `1 ud.` / "mínimo para bordar"
   - `Tarancón` / "tienda física en Cuenca"

**Columna derecha**
- Caja `aspect-ratio: 4/5`, `border-radius: 20px`, foto cubriendo todo (placeholder editable).
- Sticker dorado abajo-izq (12×16 padding, gold, navy text): "15+ años cosiendo vuestra confianza".
- Aguja decorativa rotada -10° en la esquina superior-derecha, opacity 0.6.

---

## 5. Marquee de confianza

Banda horizontal entre hero y servicios. Fondo `paper`, borders top/bottom `var(--c-line)`, padding `22px 0`.

Items (todos en mayúsculas, Saira 700, 20px, separados por `gap: 56px` con un punto dorado de 6px de diámetro entre cada):
- Bordado desde 1 unidad
- DTF en color a partir de 5 prendas
- EPI certificado CE
- Asesoramiento en tienda
- Entregas 48–72 h en Cuenca
- Marcas Velilla · Issa · Panoply
- 15 años de oficio

Animación: scroll horizontal infinito `36s linear`. Duplicar el array de items para loop seamless.

---

## 6. Servicios (`#servicios`)

**Head** (flex space-between, gap 32):
- Izq: eyebrow `Qué hacemos` + H2 "Cuatro patas, una misma tienda."
- Der: párrafo lead "Todo lo que tu equipo necesita para empezar el lunes vestido: prenda, protección, identidad bordada y alguien al teléfono cuando hace falta resolver algo."

**Grid** de 4 cards (`repeat(4, 1fr); gap: 24px`).

**Card** (padding 28, border 1px line, fondo paper, transición hover):
- Imagen 4:3 sangrada al borde superior con bleed negativo (`margin: -28px -28px 8px`). Hover: `scale(1.05)` 500ms.
- Numerador `01 / 04` en Saira 600 13px letter-spacing 0.12em color gold-deep.
- H3 (24px UPPER weight 800).
- Descripción (14px muted).
- Lista de 4 ítems con bullet dorado (4px circle).

Hover de la card: `translateY(-4px)`, borde dorado.

**Contenido**:

| # | Título | Descripción | Lista |
|---|---|---|---|
| 01 | Ropa de trabajo | Monos, pantalones, chaquetillas y prendas técnicas para cualquier sector. | Industria y obra · Hostelería y cocina · Sanitario y limpieza · Logística y reparto |
| 02 | EPI certificado | Calzado de seguridad, guantes, gafas, auriculares y arneses con marcado CE. | Calzado S1P · S3 · Protección manos · Protección ocular y auditiva · Anticaídas y altura |
| 03 | Bordado y DTF | Personalizamos con tu logo desde una sola prenda. Pruebas digitales antes de coser. | Bordado profesional · DTF a todo color · Vinilo textil · Etiquetado y tallaje |
| 04 | Asesoramiento | Te ayudamos a elegir según normativa, sector y presupuesto. En persona o por WhatsApp. | Análisis de necesidades · Tallaje en tienda · Renovación de uniformes · Postventa cercana |

---

## 7. Sectores (`#sectores`, paper)

Head idéntico al patrón: eyebrow `Para quién trabajamos`, H2 "Cada sector, su propia prenda.", lead "En Tarancón se mueven polígonos, restaurantes, residencias y obra grande. Conocemos las normativas y los materiales que aguantan en cada uno."

**Grid 6×1** (responsive 3×2 → 2×3): borde exterior 1px line, celdas separadas por borders.

**Celda** (min-height 220px, padding 32 24):
- Icono outline 36×36 color gold (top-left).
- Flecha `arrow-up-right` 20×20 color navy opacity 0.4 (top-right).
- Meta (12px UPPER letter-spacing 0.08em color muted weight 600).
- Título (Saira 800 22px UPPER, margin-top auto).

Hover: fondo `navy`, texto `cream`, flecha `gold`, meta `cream/70%`.

**Sectores**:

| Icono | Título | Meta |
|---|---|---|
| sIndustry | Industria | Fabricación · talleres |
| sHorec | Hostelería | Cocina · sala |
| sHealth | Sanitario | Clínicas · residencias |
| sLogi | Logística | Almacén · reparto |
| sConstr | Construcción | Obra · reformas |
| sShop | Comercio | Tiendas · oficinas |

(Los SVGs de los iconos están en `reference/brand.jsx` → `Icon.sXxx`. Llevarlos a componentes Astro.)

---

## 8. Personalización (`#personalizacion`)

Grid `0.95fr 1.05fr`, gap 64.

**Columna izquierda**
- Eyebrow `Personalización`
- H2 "Tu logo, cosido en su sitio."
- Lead "Bordamos en máquina industrial con hilos de calidad y aplicamos DTF de gran resistencia al lavado. Te enseñamos la prueba digital antes de tocar el primer hilo."
- **Tabs** (margin-top 32, gap 8): "Bordado profesional" / "DTF a color". Border 1px line, border-radius 999px, padding 10/18, 13px weight 600. El activo es navy/cream.
- **Stats** (gap 40, padding-top 24, border-top 1px line):
  - `1 ud.` / pedido mínimo
  - `48 h` / plazo habitual de prueba

**Columna derecha** — galería:
```
[──── primera imagen full-width 240px ────]
[ img 180px ][ img 180px ]
[ img 200px ][ img 200px ]
```
Cada item lleva un tag en absolute bottom-left (`bg: navy, color: cream, 11px UPPER letter-spacing 0.1em padding 6/10`).

Al cambiar de tab, la galería se reemplaza (state local — React island).

---

## 9. Quiénes somos (`#nosotros`, paper)

Grid 1fr 1fr, gap 64, align items center.

**Izq — media (aspect 4:5)**:
- Foto del escaparate/interior (placeholder).
- Badge dorado top-right: "Desde [...]"  → **NO** poner año; el badge dice "+15 años de oficio en el sector".
- Triángulo dorado en esquina inferior-izq (96×96, clip-path).

**Der — copy**:
- Eyebrow `Quiénes somos`
- H2 "Una tienda nueva, con mucho oficio detrás."
- Tres párrafos (texto 17px line-height 1.65, max-width 52ch):
  1. "El Rincón del Trabajador es la tienda en Tarancón; el oficio, en cambio, lleva quince años puesto. Antes de abrir aquí vestíamos a empresas y particulares en otra tienda del sector, aprendiendo qué prenda aguanta el lunes y qué hilo no se va al segundo lavado."
  2. "Hoy seguimos con la misma idea: que ninguna empresa ni autónomo de Cuenca tenga que comprar uniforme por internet y rezar para que llegue. Tenemos máquina de bordar propia, prensa de DTF y alguien al WhatsApp cuando hace falta."
  3. "No vendemos catálogos: vendemos prendas que aguantan y respondemos al teléfono el lunes a las nueve."
- Firma al pie (margin-top 36, border-top 1px line, padding-top 24): avatar circular 56×56 + nombre "El equipo" (Saira 700 16px UPPER) + role "Tarancón · Cuenca".

---

## 10. Tienda física (`#tienda`)

Head idéntico al patrón. H2 "Pásate, te atendemos como toda la vida."

Grid 1fr 1fr, gap 24.

**Izq — mapa** (aspect 4:3):
- `<iframe>` Google Maps embed apuntando a "Calle Julián García, 9, Tarancón, Cuenca". **Confirmar dirección real con cliente antes de publicar** — la del prototipo es indicativa.

**Der — info** (fondo paper, border 1px line, padding 40):
Cuatro filas con icono cuadrado 36×36 (fondo cream-deep, color navy):
- **Dirección** — C. Julián García, 9 · Local · 16400 Tarancón, Cuenca.
- **Horario** — Lunes a viernes: 9:00–14:00 · 16:00–19:00 · Sábados: cerrado (encargos por WhatsApp).
- **Teléfono** — 614 44 68 27 · WhatsApp.
- **Correo** — hola@elrincondeltrabajador.es.

Debajo: dos botones (primary "Cómo llegar" + ghost "WhatsApp").

---

## 11. FAQ (`#faq`, paper)

Grid `0.7fr 1.3fr`, gap 64.

**Izq**: eyebrow `Preguntas frecuentes` + H2 "Lo que más nos preguntáis." + nota con link WhatsApp ("¿No encuentras tu duda? **Escríbenos por WhatsApp →**").

**Der**: acordeón. Cada item:
- Border top 1px line (el último también border-bottom).
- Padding 20 0, cursor pointer.
- Pregunta: Saira 700 19px UPPER + icono `+` 24px gold-deep que rota 45° al abrir.
- Respuesta: max-height 0 → 200px transición 320ms; cuando `is-open` añade padding-top 16.

**Preguntas**:
1. ¿Bordáis a partir de cuántas unidades?
2. ¿Cuánto tarda un pedido personalizado?
3. ¿Trabajáis con empresas de fuera de Tarancón?
4. ¿Qué diferencia hay entre bordado y DTF?
5. ¿Aceptáis devoluciones?
6. ¿Puedo hacer el pedido sin pasar por la tienda?

(Respuestas exactas en `reference/sections.jsx → FAQ()`.)

---

## 12. CTA banner (`#contacto`, navy)

Padding `clamp(64px, 8vw, 120px) 0`. Grid `1.4fr 0.6fr`, gap 48, align end.

**Izq**:
- Eyebrow gold "Empezar un pedido".
- H2 "¿Listos para vestir a vuestro **equipo**?" — "equipo" en `.gold`.
- Subtítulo 17px opacity 0.85 max-width 50ch: "Cuéntanos qué sector, cuántas personas y si necesitáis bordado. En menos de 24 horas tienes presupuesto y muestrario en pantalla."

**Der** — stack vertical:
- Botón gold lg: "Presupuesto por WhatsApp" (link prellenado: `https://wa.me/34614446827?text=Hola%2C+me+gustar%C3%ADa+pedir+presupuesto`)
- Ghost lg: teléfono.
- Ghost lg: email.

Triángulo dorado gigante (240×240) en esquina inferior-derecha (clip-path).

---

## 13. Footer

Fondo `navy-deep`, padding `80 0 32`.

**Top** (grid `1.4fr 1fr 1fr 1fr`, gap 48, border-bottom 1px rgba(cream,0.14), padding-bottom 56):
1. **Brand**: logo icono 64 + texto "El Rincón / del Trabajador" + párrafo "Vestuario laboral, EPI certificado y personalización con bordado y DTF. Tarancón, Cuenca · 15 años de oficio en el sector."
2. **Servicios** (h4 gold UPPER 13px ls 0.12em): Ropa de trabajo · EPI certificado · Bordado profesional · DTF a color.
3. **Sectores**: Industria · Hostelería · Sanitario · Construcción.
4. **Contacto**: dirección · teléfono · email · **Blog ↗** (link externo subdominio). Debajo, 3 redes circulares 36×36 (IG, FB, WhatsApp).

**Bottom**: copyright a izq + 3 links a der (Aviso legal · Privacidad · Cookies). 12px opacity 0.6.

---

## 14. WhatsApp FAB

Posición fija `bottom: 24, right: 24, z-index: 60`. Pill verde `#25D366` con icono + label "WhatsApp". Shadow `0 16px 32px -10px rgba(37,211,102,0.55)`. Hover: `translateY(-2px)`.

Link: `https://wa.me/34614446827`, `target="_blank"`.

---

## 15. State e interactividad

| Pieza | Tipo | Notas |
|---|---|---|
| Header scroll-shadow | useState + listener | Solo añade clase `is-scrolled` cuando `scrollY > 12`. |
| Reveal-on-scroll | **GSAP + ScrollTrigger** | Reemplazar el IntersectionObserver del prototipo. Todos los elementos con `data-reveal` entran con `y: 24 → 0`, `opacity 0 → 1`, `duration 0.7`, ease `power3.out`. Stagger 80ms entre cards. |
| Marquee | CSS animation | `@keyframes marq` 36s linear infinite. Pausar al hover si el dev quiere extra polish. |
| Tabs Personalización | useState | Cambia el array de la galería. Animar la entrada de imágenes con GSAP. |
| FAQ accordion | useState | Toggle `is-open`. Animar `max-height` con GSAP también queda más fluido que con CSS transition. |
| Imágenes con parallax (opcional) | GSAP + ScrollTrigger | Sutil `yPercent: -10` en las imágenes grandes (hero, about). Confirmar con cliente. |

Las islas React (en Astro) deben ser **solo**: Header, Personalización (tabs), FAQ. Todo lo demás es Astro estático.

---

## 16. Accesibilidad & SEO

- Todos los headings semánticos y en orden.
- Botones `<a>` o `<button>` según corresponda (anclas vs acciones).
- `alt` real en imágenes (no decorativas).
- Aspect ratios para evitar CLS.
- Meta: `<title>El Rincón del Trabajador — Vestuario laboral, EPI y personalización en Tarancón</title>` y description: "Ropa de trabajo, EPI certificado y bordado/DTF desde una unidad. Asesoramiento en tienda y por WhatsApp, en Tarancón (Cuenca) con 15 años de oficio en el sector."
- OG image: `assets/logo-completo.png` sobre fondo cream.
- Schema.org `LocalBusiness` con dirección, teléfono, horario.

---

## 17. Cosas que NO van a producción

- Las 3 variantes alternativas de hero (Marco, Dos rutas) — fueron exploración.
- Las paletas Kraft / Limpio / Night — exploración.
- El panel de Tweaks completo — solo era para revisión del cliente.
- El componente `<image-slot>` (drop-to-fill) — solo era utilidad de revisión. En producción las imágenes vienen del CMS/disco.
- Las fotos stock de Unsplash — el cliente proporcionará las propias.

---

## 18. Imágenes pendientes del cliente

- Foto hero (vertical 4:5) — obra/taller o producto bordado en primer plano.
- 4 fotos cuadradas/4:3 para las cards de Servicios.
- 5 fotos para galería Bordado.
- 5 fotos para galería DTF.
- Foto About (vertical 4:5) — interior/escaparate de la tienda.
- Avatar para firma del equipo (cuadrada).
- Foto cabecera redes / OG image.

Hasta que lleguen, usar placeholders con la paleta `cream-deep` y un icono outline gold centrado.
