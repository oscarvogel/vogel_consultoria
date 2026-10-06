---
name: Vogel Consultoría
description: Consultoría tecnológica sobre un paisaje de datos.
colors:
  deep: "rgb(10 18 27)"
  navy: "rgb(5 9 15)"
  slate: "rgb(16 25 35)"
  blue: "rgb(30 95 168)"
  bright: "rgb(25 110 207)"
  blue-light: "rgb(139 197 255)"
  amber: "rgb(255 188 84)"
  gray: "rgb(226 229 234)"
  muted: "rgb(172 182 195)"
  white: "rgb(255 255 255)"
  border: "rgb(226 229 234 / .18)"
  error: "#fecaca"
typography:
  display:
    fontFamily: "Clash Display, ui-sans-serif, sans-serif"
    fontSize: "clamp(44px, 3.65vw, 60px)"
    fontWeight: 450
    lineHeight: 1.04
    letterSpacing: "-.04em"
  headline:
    fontFamily: "Clash Display, ui-sans-serif, sans-serif"
    fontSize: "clamp(32px, 3.6vw, 50px)"
    fontWeight: 450
    lineHeight: 1.13
    letterSpacing: "-.035em"
  title:
    fontFamily: "Clash Display, ui-sans-serif, sans-serif"
    fontSize: "30px"
    fontWeight: 450
  body:
    fontFamily: "Chillax, ui-sans-serif, sans-serif"
    fontSize: "16px"
    lineHeight: 1.7
  button:
    fontFamily: "Chillax, ui-sans-serif, sans-serif"
    fontSize: ".9375rem"
    fontWeight: 600
    lineHeight: 1.4
  label:
    fontFamily: "Chillax, ui-sans-serif, sans-serif"
    fontSize: "13px"
rounded:
  control: "8px"
  hero-control: "9px"
  tag: "10px"
  contact: "12px"
  panel: "16px"
  frame: "20px"
spacing:
  inset-mobile: "20px"
  inset-tablet: "32px"
  inset-desktop: "40px"
  section: "clamp(72px, 8vw, 124px)"
  section-mobile: "64px"
components:
  button-primary:
    backgroundColor: "linear-gradient(110deg,#ffc869,#f5b34c)"
    textColor: "#080d14"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "14px 23px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.gray}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "14px 23px"
  contact-panel:
    backgroundColor: "{colors.slate}"
    textColor: "{colors.gray}"
    rounded: "{rounded.contact}"
    padding: "32px"
  terrain-label:
    backgroundColor: "rgb(8 12 18 / .62)"
    textColor: "#f5f5f5"
    typography: "{typography.label}"
    rounded: "{rounded.tag}"
    padding: "10px 15px"
---

# Design System: Vogel Consultoría

## Overview

**Creative North Star: "Paisaje de datos"**

El paisaje de datos combina una base casi negra azul, luz ámbar y titulares Clash Display con lectura/UI Chillax. La identidad aprobada el 2026-10-04 toma la referencia «Consultoría tecnológica sobre paisaje de datos.png»: V ámbar vectorial, cabecera abierta y lectura centrada. La tecnología acompaña un mensaje empresarial directo, con evidencia verificable y jerarquía sobria.

La decisión explícita de reemplazo visual actualiza la marca anterior. El posicionamiento premium para empresas argentinas y la voz clara, precisa y cercana siguen siendo compromisos de PRODUCT.md y del manual. El baseline anterior permanece en `docs/history/paisaje-datos-2026-10-04/`.

**Key Characteristics:**

- V ámbar vectorial como identificador oficial.
- Clash Display en titulares y Chillax en cuerpo/UI.
- Fondo casi negro azul y ámbar como acento principal.
- Flujo natural, divisiones finas y espacios amplios.
- Capturas operativas reales identificadas como demostración.
- Paisaje decorativo progresivo con alternativa estática.

Especificación extraída el 2026-10-04 de tokens, estilos y componentes implementados. Fuente normativa de valores: `src/styles/tokens.css`; composición: `src/styles/home.css`, `src/styles/institutional.css` y `Navbar.vue`. Las ilustraciones azules existentes de algunas interiores continúan como assets conceptuales: la convergencia de tipografía, superficies y controles no implica reemplazo total de imágenes.

## Colors

### Primary

ámbar cálido para acciones, enlaces, selección, foco y puntos luminosos del paisaje. El CTA principal usa un gradiente cálido localizado.

### Secondary

Azules institucionales heredados para gráficos e ilustraciones conceptuales. No desplazan al ámbar como acción principal ni definen una segunda identidad de UI.

### Neutral

Navy casi negro como fondo, deep como superficie y slate como panel. Blanco para titulares, gris para lectura, muted para notas y un borde translúcido para divisiones. Error conserva su función semántica independiente.

**The Foco ámbar Rule.** El ámbar identifica acciones, foco y puntos de datos; el fondo oscuro conserva el predominio compositivo.

El frontmatter conserva los canales RGB compartidos por CSS y Tailwind. Los alias semánticos de fondo, panel, texto, acción y foco proceden de esos canales.

## Typography

Clash Display y Chillax se sirven como WOFF2 desde el dominio de Vogel. El script `scripts/ensure-fontshare-fonts.mjs` obtiene los archivos oficiales desde Fontshare antes de `npm run dev` y `npm run build`; sus binarios permanecen fuera del repositorio público según la ITF Free Font License. Las dos familias usan `font-display: swap` y fallback ui-sans-serif/system-ui/sans-serif. Clash Display ocupa el rol display; Chillax, lectura y UI.

El hero usa la escala display del frontmatter; por debajo de 768px cambia a `clamp(36px,9.7vw,52px)`, interlineado 1.12. Los titulares de sección pasan a 34px en móvil. Las capacidades usan 30px y 27px en móvil; cuerpo 16px, descripción de sección 18px y 16px en móvil. Inputs conservan al menos 16px. Metadata de paisaje usa 13px y 11px en móvil. Clash Display usa pesos 450–600; Chillax usa 400 para lectura, 500 para UI y 600 para acciones.

**The Voz Única Rule.** Usar Clash Display en titulares y Chillax en lectura/UI; construir jerarquía con escala, espaciado y pesos moderados.

## Layout

Contenedor principal hasta 1280px, centrado con insets del frontmatter. La cabecera ocupa el 90% hasta 1520px; bajo 1024px muestra menú móvil y bajo 640px retira el CTA de la fila superior. La portada presenta título centrado «Convertimos procesos en información útil», paisaje inferior y enlaces contextuales. En móvil las etiquetas se distribuyen en una fila flexible en flujo después del CTA.

Las secciones usan flujo nativo. Capacidades en dos columnas y una en móvil; capturas forestales en tres columnas y una en móvil; método en cuatro columnas y dos bajo 1024px. Nosotros, recursos/capacitación y contacto se apilan bajo 768px. Los interiores comparten fondo oscuro, Clash Display, Chillax, ámbar y capítulos sin pin. Se preservan contenido, formularios, APIs, precios y FAQs existentes.

**The Lectura Continua Rule.** El contenido esencial permanece en flujo y legible sin WebGL ni animación.

## Elevation & Depth

La profundidad procede del terreno de puntos, variaciones tonales y bordes finos. Las superficies informativas conservan lectura estable. La cabecera comienza transparente y toma fondo navy casi opaco al desplazar o abrir el menú; no tiene material liquid glass. El dropdown usa sombra localizada; el CTA tiene un brillo tenue.

El paisaje se restringe a hero y cierre. Three.js se carga bajo demanda y comparte un renderer entre las dos superficies visibles. El ciclo de onda es de 20 segundos; el cursor vuelve al objetivo neutral tras 900ms y se aproxima suavemente durante unos 1.2 segundos. Pausa fuera de pantalla y con documento oculto; libera geometrías, materiales, renderer, observers y listeners al desmontar. Movimiento reducido y ausencia/pérdida de WebGL conservan posters estáticos de `public/landscape/`, obtenidos del canvas de producción. No hay dependencia visual de la animación para leer o actuar.

### Ecos discretos del paisaje — actualización autorizada 2026-10-04

La narrativa intermedia completa incorpora `LandscapeTraces.vue`: Soluciones (`flow`), caso forestal (`evidence`), clientes/proyectos (`network`), método (`method`), Oscar (`trajectory`) y recursos (`editorial`). Las variantes alternan laterales y fases para dar continuidad sin repetir una composición idéntica. Los rastros conservan áreas de lectura limpias y se concentran en márgenes y franjas inferiores del padding. Hero y contacto mantienen sus paisajes vigentes.

Las conexiones laterales SVG usan cinco nodos por lado, trazos ámbar de opacidad .17 y ramificaciones azul claro de .11; ocupan `clamp(64px,7vw,150px)` y se ocultan hasta 1199px inclusive. Tres ondas inferiores de 61 puntos cada una permanecen visibles: franja de 80px en escritorio y 46px en tablet/móvil. Son decoración `aria-hidden`, sin foco ni captura de eventos. Soluciones conserva la transición tonal de entrada/salida navy–deep.

En escritorio de al menos 1024px de ancho y 800px de alto, sin preferencia de movimiento reducido, las ondas se desplazan verticalmente de 12px a −8px vinculadas al scroll (`scrub: .8`), sin pin. En móvil y con movimiento reducido permanecen estáticas en posición neutral. El método conserva su línea de cuatro nodos, con `scaleX` de .08 a 1 y `scrub: .6` bajo las mismas condiciones de escritorio; con movimiento reducido queda completa y en móvil usa dos columnas con segmentos estáticos. Estos ecos no alteran la jerarquía del contenido ni añaden un segundo renderer WebGL.

## Shapes

Controles moderadamente redondeados, tags de paisaje compactos y marcos discretos, según frontmatter. Las capacidades y método son bloques editoriales separados por líneas, sin obligar a encerrar cada contenido en tarjetas. El isotipo vectorial conserva proporciones y espacio libre.

## Components

### Actions and fields

CTA de home con gradiente cálido y texto oscuro; la variante base de interiores utiliza ámbar sólido. Acción secundaria transparente y foco global ámbar de 2px con offset 4px. El hero amplía su control a 54px mínimos y padding 16px 28px. Formularios mantienen labels, feedback y controles existentes, con texto de al menos 16px. No se infiere entrega efectiva del formulario a partir de su apariencia.

### Navigation

V SVG ámbar con palabra Vogel en Chillax cuando se renderiza como texto. Cabecera abierta con Servicios, Casos, Recursos y Nosotros; portal externo y diagnóstico como acciones. Servicios usa details con diez destinos. El menú móvil añade capacitación y encuesta; conserva cierre y navegación por teclado implementados.

### Evidence and secondary content

Cuatro capacidades con diez destinos, tres capturas de una operación forestal real con datos de demostración, ocho logos SVG de clientes y FEMAG identificado como desarrollo. Método, trayectoria de Oscar, recursos, capacitación y contacto preservan información útil. Los detalles secundarios permanecen colapsados inicialmente. Oscar se presenta sin retrato hasta contar con una foto real autorizada.

**The Evidencia Clara Rule.** Identificar datos de demostración y proyectos en desarrollo; conservar la procedencia de imágenes y logos.

### Deslizamiento y anclajes del paisaje

La pasada de refinamiento añade Lenis con `lerp: .085` en escritorio desde 1024px, con puntero preciso y sin movimiento reducido. Comparte el ticker de GSAP; touch permanece nativo y los menús, textarea y select conservan su desplazamiento propio. La instancia y sus callbacks se eliminan al desmontar o cambiar la preferencia. Los anchors mantienen su comportamiento y hash nativos.

El hero desplaza su texto hasta −64px, y la introducción de soluciones recorre 48px con `scrub: .6`; son transformaciones reversibles sin fijado ni snap. Un gradiente navy → deep suaviza el encuentro de ambas superficies. El paisaje mantiene colores y geometría aprobados.

El menú desktop ocupa el centro de una grilla `1fr auto 1fr`, independientemente del ancho de marca y acciones. Las etiquetas desktop proyectan tres posiciones del terreno 3D sobre HTML; conectores de 68px terminan en esos puntos. Móvil conserva etiquetas en flujo y el fallback estático usa posiciones equivalentes.

## Do's and Don'ts

### Do:

- **Do** usar el SVG oficial de la V ámbar sin deformarlo.
- **Do** reutilizar los tokens compartidos: Clash Display en titulares y Chillax en lectura/UI.
- **Do** conservar el foco ámbar visible y controles legibles.
- **Do** identificar las capturas forestales como interfaz real con datos de demostración.
- **Do** mantener etiquetas y CTA móviles en flujo sin solapamientos.
- **Do** conservar una alternativa estática para el paisaje y movimiento reducido.

### Don't:

- **Don't** reutilizar OV, Syne, Bricolage o DM Sans como identidad tipográfica actual.
- **Don't** convertir cifras de demostración en resultados comerciales.
- **Don't** inventar un retrato de Oscar ni presentar FEMAG como terminado.
- **Don't** ocultar contenido esencial detrás de animaciones o WebGL.
- **Don't** añadir un shader global, pins narrativos o liquid glass a este sistema.
- **Don't** afirmar identidad absoluta de assets: interiores conservan algunas ilustraciones conceptuales azules.
