---
name: Vogel Consultoría
description: Portfolio de estudio con trabajo real y superficies cálidas.
colors:
  charcoal: "#161515"
  deep: "#1C1B1A"
  slate: "#262523"
  warm-panel: "#3b3933"
  cream: "#F3F1E2"
  muted: "#A8A596"
  amber: "#FFBC54"
  border: "rgb(243 241 226 / .16)"
  error: "#fecaca"
typography:
  display:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(32px, 3.4vw, 48px)"
    fontWeight: 800
    fontVariation: "'wdth' 125"
    lineHeight: 0.92
    letterSpacing: "-.03em"
  headline:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(25px, 3vw, 48px)"
    fontWeight: 800
    lineHeight: 1.08
  reader-title:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(36px, 5vw, 80px)"
    fontWeight: 800
    lineHeight: 1
  body:
    fontFamily: "Chillax, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Chillax, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.45
rounded:
  rail-control: "4px"
  control: "8px"
  portfolio-panel: "12px"
  interior-panel: "16px"
  interior-frame: "20px"
spacing:
  compact: "8px"
  control: "16px"
  gallery-gap: "20px"
  edge: "24px"
  panel: "32px"
components:
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.control}"
    padding: "0 22px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.slate}"
    textColor: "{colors.cream}"
    rounded: "{rounded.control}"
    height: "44px"
  portfolio-card:
    backgroundColor: "{colors.slate}"
    textColor: "{colors.cream}"
    rounded: "{rounded.portfolio-panel}"
---

# Design System: Vogel Consultoría

## Overview

**Creative North Star: "Portfolio de estudio"**

La identidad coloca evidencia real en primer plano: imágenes amplias, titulares extendidos, navegación legible y superficies cálidas. La V oficial identifica una consultoría premium que explica tecnología con precisión y cercanía práctica.

**Key Characteristics:**
- V ámbar oficial y una sola voz tipográfica.
- Carbón dominante, crema de lectura y ámbar reservado a acción y foco.
- Capturas originales a color, con procedencia y estados honestos.
- Continuidad entre galería, Info y lectores de proyecto.

## Colors

### Primary
- **Ámbar Vogel:** acciones, foco y señales de navegación; su uso es selectivo.

### Neutral
- **Carbón:** escenario y navegación.
- **Deep y Slate:** superficies compartidas e interiores.
- **Warm panel:** panel destacado de Info y controles del rail.
- **Crema:** lectura sobre carbón y fondo de lectores de proyecto.
- **Muted:** metadatos secundarios. Border separa superficies; error identifica errores de formulario y no es un acento decorativo.

**The Foco ámbar Rule.** El ámbar identifica acciones y foco; las capturas conservan sus colores originales.

## Typography

Archivo Variable define titulares en mayúsculas, ancho expandido (125%) y peso 800. Chillax sostiene cuerpo, controles y palabra de marca. La escala normativa figura en el frontmatter: títulos de galería hasta 48px, Info hasta 48px y lector hasta 80px; el lector móvil usa 34px. La grilla ajusta títulos al contenedor y la galería móvil usa 26–38px. Los interiores conservan su jerarquía responsive. Inputs de al menos 16px.

**The Voz Única Rule.** Usar Archivo Variable en titulares y Chillax en lectura/UI.

## Layout

Home reserva un rail proporcional (34.4vw) a la izquierda. Las panorámicas se centran verticalmente y alcanzan 1072×603px con proporción 16:9, separadas por 20px. La grilla usa tarjetas 4:5, separación de 24px y tres columnas, dos entre 768 y 1100px y una hasta 767px. En 390×844px la tarjeta mide 342×608px y el menú independiente tiene área mínima de 44px.

Info es una página completa carbón con paneles mates a la derecha en escritorio y lectura apilada en móvil. Los lectores usan crema y galerías desktop/mobile. Servicios y recursos conservan su composición. Las medidas de Home pertenecen a su brief y no obligan a futuras superficies.

## Elevation & Depth

La profundidad procede del contraste tonal y la escala. Info usa superficies mates; las imágenes conservan legibilidad con el tratamiento de contraste de la tarjeta. Los interiores mantienen la sombra de panel existente. Sin vidrio ni decoración que sustituya evidencia.

## Shapes

Controles del rail discretos (4px), acciones y campos (8px), tarjetas y paneles del portfolio (12px). Los interiores conservan paneles y marcos de 16px y 20px. No aplicar una sustitución global a páginas preservadas.

## Components

### Buttons
Primario ámbar plano y texto carbón; secundario mate o de borde fino. Hover legible, foco visible ámbar y área mínima de 44px; acciones del formulario de 48px.

### Cards / Containers
Enlaces HTML reales con título y categoría. Imágenes reales a color, sin filtro monocromo. La falla de imagen conserva título, vínculo y estado explícito. La grilla muestra los mismos nueve proyectos.

### Inputs / Fields
Labels persistentes, fondo Deep, borde fino y foco visible. Teléfono opcional. Errores y éxito mantienen lectura y foco.

### Navigation
Rail en escritorio y menú propio en móvil. Info y proyectos tienen URL real, cierre, Escape y regreso por History; se conserva posición y foco de la galería. Los hashes comerciales abren y enfocan la sección de Info.

### Continuidad del portfolio
El stage permanece montado al abrir páginas. GSAP Flip transforma carrusel/grilla y enlaza temporalmente imagen y lector; el puente se cancela al cambiar ruta o tamaño. Movimiento reducido evita transiciones espaciales y mantiene navegación completa.

### Destinos editoriales
Soluciones, Recursos, Estudio y Contacto son rutas propias que comparten el encabezado y el rail del portfolio. Cada destino reutiliza datos y formularios vigentes, con una composición editorial distinta según su contenido; las fichas individuales de servicios y artículos permanecen independientes. El botón Info apunta a Estudio y las URL históricas de Info conservan su destino mediante compatibilidad de ruta.

## Do's and Don'ts

### Do
- **Do** usar el SVG oficial de la V ámbar sin deformarlo.
- **Do** conservar el foco visible y controles legibles.
- **Do** identificar datos de demostración y conservar procedencia de capturas.
- **Do** mantener FEMAG únicamente en Info como «En desarrollo».

### Don't
- **Don't** añadir azules a la identidad, vidrio o gradientes multicolor.
- **Don't** convertir datos de demostración en resultados comerciales.
- **Don't** aplicar monocromo a las capturas reales del portfolio.
- **Don't** introducir WebGL, videos o mockups de dispositivos en esta implementación.
