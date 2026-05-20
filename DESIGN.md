# DESIGN.md — Landing El Rincón del Trabajador

> Directrices de diseño del sistema visual. Define tokens, patrones de layout y comportamiento de componentes para guiar la implementación.

---

## 1. Marca

### 1.1 Logos disponibles

| Archivo                                   | Uso                                                                      |
| ----------------------------------------- | ------------------------------------------------------------------------ |
| `assets/logo-marca.png`                   | Icono cuadrado (frame + aguja + mono). Header, favicon, og-image.        |
| `assets/logo-completo.png`                | Lockup vertical icono + nombre. Footer alternativo, materiales impresos. |
| `assets/Aguja.svg`                        | Aguja suelta. Motivo decorativo (acentos en hero, dividers).             |
| `assets/Rincon.svg`                       | Marco con esquina doblada. Inspiración para clip-paths decorativos.      |
| `assets/Mono.svg`, `assets/Sin-texto.svg` | Variantes adicionales del icono.                                         |

**Reglas**

- Tamaño mínimo del icono: 32×45 px (mantener proporción ~0.71).
- Espacio de respeto: equivalente al ancho del bucle de la aguja.
- Nunca recolorear el PNG. Para versiones mono usar el SVG.

### 1.2 Paleta (paleta "Crema clásica")

| Token            | Hex                   | Uso                                                                        |
| ---------------- | --------------------- | -------------------------------------------------------------------------- |
| `--c-navy`       | `#24303F`             | Texto principal, botones, fondos de CTA, banner footer.                    |
| `--c-navy-deep`  | `#181F2A`             | Hover del primary, fondo del footer.                                       |
| `--c-gold`       | `#CCA43B`             | Acento principal: subrayados, esquinas, badges, marcas activas.            |
| `--c-gold-deep`  | `#A8842A`             | Hover del gold y para texto-acento sobre crema (más contraste).            |
| `--c-brown`      | `#4D341F`             | Reservado para detalles (peto del mono en ilustraciones). No usar para UI. |
| `--c-cream`      | `#F7EFD9`             | Fondo principal.                                                           |
| `--c-cream-deep` | `#EFE3C4`             | Placeholders de imagen, fondos de iconos.                                  |
| `--c-paper`      | `#FAF6EB`             | Fondo de secciones alternas (`.section--paper`).                           |
| `--c-ink`        | `#1A222D`             | Texto cuerpo.                                                              |
| `--c-muted`      | `#6F6A5C`             | Texto secundario, captions, metadatos.                                     |
| `--c-line`       | `rgba(36,48,63,0.12)` | Bordes y separadores.                                                      |

Verdes adicionales para WhatsApp FAB: fondo `#25D366`, texto `#0A2E1E`.

### 1.3 Tipografía

| Rol             | Font                | Weights            | Donde                                                           |
| --------------- | ------------------- | ------------------ | --------------------------------------------------------------- |
| Display         | **Saira Condensed** | 700, 800, 900      | Todos los H1–H3, eyebrows mayúsculas, números grandes, botones. |
| Body            | **Inter Tight**     | 400, 500, 600, 700 | Texto cuerpo, botones, navegación.                              |
| Mono (opcional) | JetBrains Mono      | 400                | Reservado para futuro (referencias, códigos de producto).       |

**Características OpenType**: `font-feature-settings: "ss01", "cv11"` en `<body>`.

**Escala**

```
h1        clamp(56px, 7.6vw, 132px)   line-height 0.95   letter-spacing -0.01em   UPPER
heroA__t  clamp(64px, 9.5vw, 150px)   line-height 0.86   letter-spacing -0.02em   UPPER
h2        clamp(40px,  5vw,  84px)    line-height 0.95   letter-spacing -0.01em   UPPER
h3        clamp(22px, 1.8vw,  28px)   line-height 1.05                            UPPER
lead      clamp(18px, 1.4vw,  22px)   line-height 1.45
body      17px / 1.55
eyebrow   13px UPPER  letter-spacing 0.14em  weight 600  color: gold-deep
```

Todos los headings llevan `text-wrap: balance`; los párrafos `text-wrap: pretty`.

### 1.4 Espaciado y radios

```
--d-pad-y     96px     (vertical de sección)
--d-pad-x     64px     (horizontal de wrap)
--d-gap       24px     (gap de grids)
--d-radius    14px
--d-radius-lg 28px
--max-w       1320px
```

### 1.5 Motivos gráficos recurrentes

1. **Esquina dorada (triángulo)** — derivada del logo. Aparece en hero, about y CTA banner.
   Implementación: `clip-path: polygon(0 0, 100% 100%, 0 100%)` sobre un `div` con `background: var(--c-gold)`.

2. **Aguja decorativa** — silueta vertical (asa redondeada + cuerpo cónico). Acento sutil rotado en el hero.

3. **Marco dorado** — `border: 8px solid var(--c-gold)` para la variante "Marco" del hero (opcional).

---

## 2. Layout global

### 2.1 Container

```css
.wrap {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 64px;
}
```

### 2.2 Secciones

- `.section { padding: 96px 0; position: relative; }`
- `.section--paper { background: var(--c-paper); }` — fondo levemente más cálido para alternancia.
- `.section--navy` — fondo navy, texto crema.

**Patrón de alternancia**: Hero (cream) → Marquee (paper) → Servicios (cream) → Sectores (paper) → Personalización (cream) → About (paper) → Tienda (cream) → FAQ (paper) → CTA (navy) → Footer (navy-deep).

### 2.3 Responsive

- `≤ 1100px`: grids de 4 cols → 2 cols; sectores 6→3.
- `≤ 800px`: todo a 1 col; nav y teléfono del header se ocultan (hamburguesa en producción); padding lateral a 22px.

---

## 3. Header

Sticky, `backdrop-filter: blur(10px)`, fondo `color-mix(in oklab, var(--bg) 88%, transparent)`. Cuando `window.scrollY > 12` añadir clase `is-scrolled` que muestra el borde inferior.

**Estructura** (`flex; justify-content: space-between; padding: 16px 0`):

1. **Logo** (izq): icono + bloque de texto con nombre en Saira 800 18px y subtítulo en Saira 600 12px letter-spacing 0.18em color gold-deep uppercase.
2. **Nav** (centro): links de sección (Servicios, Sectores, Personalización, Tienda, Blog externo, Contacto). Cada link es 14px / weight 500 / opacity 0.85. Hover: subrayado dorado de 2px que crece de izquierda a derecha (300ms).
3. **CTA stack** (der): teléfono clic-llamada con icono + botón primario "Pedir presupuesto" (variant gold) con icono arrow-up-right.

El link de Blog abre en `target="_blank"` con `rel="noopener"`.

---

## 4. Hero (variante Editorial)

Grid de 2 columnas `1.1fr 0.9fr`, gap 48px, alineadas al fondo.

**Columna izquierda**

1. Eyebrow con localización y años de oficio.
2. H1 grande con énfasis en la segunda línea: `<em>` con `color: var(--c-gold)` y highlight detrás (`::after` absoluto a 18% opacity, altura 14% desde abajo).
3. Subtítulo (18px, max-width 48ch).
4. Acciones (gap 12px): botón primary (ancla `#contacto`) + botón ghost "WhatsApp" con icono.
5. Metadatos en fila (gap 28px): tres ítems con cifra destacada + etiqueta descriptiva.

**Columna derecha**

- Caja `aspect-ratio: 4/5`, `border-radius: 20px`, foto cubriendo todo.
- Sticker dorado abajo-izq con copy de confianza (fondo gold, texto navy).
- Aguja decorativa rotada -10° en esquina superior-derecha, opacity 0.6.

---

## 5. Marquee de confianza

Banda horizontal entre hero y servicios. Fondo paper, borders top/bottom `var(--c-line)`, padding `22px 0`.

Items en mayúsculas, Saira 700 20px, separados por punto dorado de 6px de diámetro (gap 56px entre cada par).

Animación: scroll horizontal infinito 36s linear. Duplicar el array de items para loop seamless.

---

## 6. Servicios (`#servicios`)

**Head** (flex space-between, gap 32): eyebrow + H2 a la izquierda; párrafo lead a la derecha.

**Grid** de 4 cards (`repeat(4, 1fr); gap: 24px`).

**Card** (padding 28, border 1px line, fondo paper):

- Imagen 4:3 sangrada al borde superior con bleed negativo (`margin: -28px -28px 8px`). Hover: `scale(1.05)` 500ms.
- Numerador en Saira 600 13px letter-spacing 0.12em color gold-deep.
- H3 (24px UPPER weight 800).
- Descripción (14px muted).
- Lista de ítems con bullet dorado (4px circle).

Hover de la card: `translateY(-4px)`, borde dorado.

**Servicios** (4 cards):

| #   | Servicio        | Sectores cubiertos                                       |
| --- | --------------- | -------------------------------------------------------- |
| 1   | Ropa de trabajo | Industria y obra · Hostelería · Sanitario · Logística    |
| 2   | EPI certificado | Calzado S1P/S3 · Protección manos/ocular/auditiva        |
| 3   | Bordado y DTF   | Bordado profesional · DTF · Vinilo textil · Etiquetado   |
| 4   | Asesoramiento   | Análisis · Tallaje · Renovación de uniformes · Postventa |

---

## 7. Sectores (`#sectores`, paper)

Head con eyebrow + H2 + lead explicando la cobertura geográfica y normativa.

**Grid 6×1** (responsive 3×2 → 2×3): borde exterior 1px line, celdas separadas por borders.

**Celda** (min-height 220px, padding 32 24):

- Icono outline 36×36 color gold (top-left).
- Flecha `arrow-up-right` 20×20 color navy opacity 0.4 (top-right).
- Meta (12px UPPER letter-spacing 0.08em color muted weight 600).
- Título (Saira 800 22px UPPER, margin-top auto).

Hover: fondo navy, texto cream, flecha gold, meta cream/70%.

**Sectores** (6 celdas):

| Sector       | Meta                   |
| ------------ | ---------------------- |
| Industria    | Fabricación · talleres |
| Hostelería   | Cocina · sala          |
| Sanitario    | Clínicas · residencias |
| Logística    | Almacén · reparto      |
| Construcción | Obra · reformas        |
| Comercio     | Tiendas · oficinas     |

---

## 8. Personalización (`#personalizacion`)

Grid `0.95fr 1.05fr`, gap 64.

**Columna izquierda**

- Eyebrow + H2 + lead.
- **Tabs** (margin-top 32, gap 8): "Bordado profesional" / "DTF a color". Border 1px line, border-radius 999px, padding 10/18, 13px weight 600. El activo es navy/cream.
- **Stats** (gap 40, padding-top 24, border-top 1px line): pedido mínimo + plazo habitual de prueba.

**Columna derecha — galería**:

```
[──── primera imagen full-width 240px ────]
[ img 180px ][ img 180px ]
[ img 200px ][ img 200px ]
```

Cada imagen lleva un tag en absolute bottom-left (`bg: navy, color: cream, 11px UPPER letter-spacing 0.1em padding 6/10`).

Al cambiar de tab, la galería se reemplaza (estado local — React island).

---

## 9. Quiénes somos (`#nosotros`, paper)

Grid 1fr 1fr, gap 64, align items center.

**Izq — media** (aspect 4:5):

- Foto del escaparate/interior.
- Badge dorado top-right con años de oficio.
- Triángulo dorado en esquina inferior-izq (96×96, clip-path).

**Der — copy**:

- Eyebrow + H2 + tres párrafos (17px line-height 1.65, max-width 52ch).
- Firma al pie (margin-top 36, border-top 1px line, padding-top 24): avatar circular 56×56 + nombre en Saira 700 16px UPPER + localización.

---

## 10. Tienda física (`#tienda`)

Head idéntico al patrón. Grid 1fr 1fr, gap 24.

**Izq — mapa** (aspect 4:3): `<iframe>` Google Maps embed con la dirección de la tienda.

**Der — info** (fondo paper, border 1px line, padding 40):

Cuatro filas con icono cuadrado 36×36 (fondo cream-deep, color navy):

- Dirección física.
- Horario (mañana y tarde, de lunes a viernes).
- Teléfono / WhatsApp.
- Correo electrónico.

Debajo: dos botones (primary "Cómo llegar" + ghost "WhatsApp").

---

## 11. FAQ (`#faq`, paper)

Grid `0.7fr 1.3fr`, gap 64.

**Izq**: eyebrow + H2 + nota con link a WhatsApp para dudas no contempladas.

**Der — acordeón**: cada item tiene border top 1px line (y el último border-bottom), padding 20 0.

- Pregunta: Saira 700 19px UPPER + icono `+` 24px gold-deep que rota 45° al abrir.
- Respuesta: `max-height 0 → auto` transición 320ms; cuando `is-open` añade padding-top 16.

Temas cubiertos: mínimo de unidades, plazos, cobertura geográfica, diferencias entre técnicas, devoluciones, pedido sin visita presencial.

---

## 12. CTA banner (`#contacto`, navy)

Padding `clamp(64px, 8vw, 120px) 0`. Grid `1.4fr 0.6fr`, gap 48, align end.

**Izq**: eyebrow gold + H2 con palabra clave en `.gold` + subtítulo 17px opacity 0.85 max-width 50ch.

**Der — stack vertical**:

- Botón gold lg: "Presupuesto por WhatsApp".
- Ghost lg: teléfono.
- Ghost lg: email.

Triángulo dorado (240×240) en esquina inferior-derecha (clip-path).

---

## 13. Footer

Fondo `navy-deep`, padding `80 0 32`.

**Top** (grid `1.4fr 1fr 1fr 1fr`, gap 48, border-bottom 1px rgba(cream,0.14), padding-bottom 56):

1. **Brand**: logo icono 64 + nombre + párrafo resumen de propuesta de valor.
2. **Servicios** (h4 gold UPPER 13px ls 0.12em): lista de servicios principales.
3. **Sectores**: lista de sectores cubiertos.
4. **Contacto**: dirección, teléfono, email, link a blog externo. Debajo: 3 iconos de redes circulares 36×36 (IG, FB, WhatsApp).

**Bottom**: copyright a izq + 3 links legales a der (Aviso legal, Privacidad, Cookies). 12px opacity 0.6.

---

## 14. WhatsApp FAB

Posición fija `bottom: 24, right: 24, z-index: 60`. Pill verde `#25D366` con icono + label "WhatsApp". Shadow `0 16px 32px -10px rgba(37,211,102,0.55)`. Hover: `translateY(-2px)`. Abre en `target="_blank"`.

---

## 15. State e interactividad

| Pieza                        | Tipo                 | Notas                                                                                                               |
| ---------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Header scroll-shadow         | useState + listener  | Añade clase `is-scrolled` cuando `scrollY > 12`.                                                                    |
| Reveal-on-scroll             | GSAP + ScrollTrigger | Elementos con `data-reveal`: `y: 24→0`, `opacity 0→1`, `duration 0.7`, ease `power3.out`. Stagger 80ms entre cards. |
| Marquee                      | CSS animation        | `@keyframes marq` 36s linear infinite. Pausar al hover si se quiere extra polish.                                   |
| Tabs Personalización         | useState             | Cambia el array de la galería. Animar entrada de imágenes con GSAP.                                                 |
| FAQ accordion                | useState             | Toggle `is-open`. Animar `max-height` con GSAP para mayor fluidez.                                                  |
| Parallax imágenes (opcional) | GSAP + ScrollTrigger | Sutil `yPercent: -10` en imágenes grandes (hero, about).                                                            |

Las islas React (en Astro) deben ser **solo**: Header, Personalización (tabs), FAQ. Todo lo demás es Astro estático.

---

## 16. Accesibilidad & SEO

- Headings semánticos y en orden jerárquico.
- `<a>` para anclas/enlaces; `<button>` para acciones.
- `alt` descriptivo en imágenes no decorativas.
- Aspect ratios explícitos para evitar CLS.
- Meta title y description que incluyan servicio, localización y propuesta de valor.
- OG image sobre fondo cream.
- Schema.org `LocalBusiness` con dirección, teléfono y horario.
