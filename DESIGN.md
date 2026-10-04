---
name: Vogel Consultoría
description: Claridad ejecutiva para sistemas, datos y automatización aplicados al negocio.
colors:
  deep: "rgb(15 42 68)"
  navy: "rgb(11 32 53)"
  slate: "rgb(22 47 73)"
  blue: "rgb(30 95 168)"
  bright: "rgb(25 110 207)"
  blue-light: "rgb(139 197 255)"
  amber: "rgb(242 169 0)"
  gray: "rgb(229 231 235)"
  muted: "rgb(142 168 195)"
  white: "rgb(255 255 255)"
  border: "rgb(229 231 235 / .18)"
  error: "#fecaca"
typography:
  display:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, sans-serif"
    fontSize: "clamp(44px, 5.4vw, 80px)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-.03em"
  headline:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3.7rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-.025em"
  title:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, sans-serif"
    fontSize: "25px"
    fontWeight: 600
    lineHeight: 1.15
  body:
    fontFamily: "DM Sans, ui-sans-serif, sans-serif"
    fontSize: "1.0625rem"
    lineHeight: 1.7
  button:
    fontFamily: "DM Sans, ui-sans-serif, sans-serif"
    fontSize: ".9375rem"
    fontWeight: 600
    lineHeight: 1.4
  label:
    fontFamily: "DM Sans, ui-sans-serif, sans-serif"
    fontSize: "13px"
  nav-wordmark:
    fontFamily: "Bricolage Grotesque, ui-sans-serif, sans-serif"
    fontSize: "18px"
    fontWeight: 700
  nav-brand-descriptor:
    fontFamily: "DM Sans, ui-sans-serif, sans-serif"
    fontSize: "9px"
    fontWeight: 700
    letterSpacing: ".22em"
  nav-compact:
    fontFamily: "DM Sans, ui-sans-serif, sans-serif"
    fontSize: "12px"
  nav-dropdown:
    fontFamily: "DM Sans, ui-sans-serif, sans-serif"
    fontSize: "14px"
rounded:
  control: "8px"
  card-compact: "12px"
  navigation: "14px"
  nav-item: "6px"
  nav-indicator: "2px"
  panel: "16px"
  consent: "18px"
  editorial: "24px"
  pill: "9999px"
spacing:
  gap-sm: "12px"
  gap-md: "16px"
  inset-mobile: "20px"
  inset-sm: "32px"
  inset-lg: "40px"
  panel: "clamp(24px, 3vw, 40px)"
  section: "clamp(64px, 8vw, 120px)"
components:
  button-diagnostic:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.navy}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "14px 23px"
  button-diagnostic-hover:
    backgroundColor: "{colors.white}"
    textColor: "{colors.navy}"
  button-service:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "14px 23px"
  button-service-hover:
    backgroundColor: "{colors.bright}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.gray}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "14px 23px"
  button-secondary-hover:
    backgroundColor: "{colors.slate}"
  panel:
    backgroundColor: "{colors.slate}"
    textColor: "{colors.gray}"
    rounded: "{rounded.panel}"
    padding: "{spacing.panel}"
  service-card:
    backgroundColor: "{colors.slate}"
    textColor: "{colors.gray}"
    rounded: "{rounded.panel}"
    padding: "28px"
  input-contact:
    backgroundColor: "rgb(11 32 53 / .8)"
    textColor: "{colors.white}"
    rounded: "{rounded.card-compact}"
    padding: "10px 16px"
  consent-button:
    backgroundColor: "{colors.amber}"
    textColor: "{colors.navy}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
  consent-banner:
    backgroundColor: "{colors.slate}"
    textColor: "{colors.gray}"
    rounded: "{rounded.consent}"
    padding: "16px"
---

# Design System: Vogel Consultoría

## Overview

**Creative North Star: "La mesa de decisiones"**

El sistema presenta tecnología con claridad ejecutiva: base azul profunda, titulares firmes, lectura cómoda y evidencia de interfaces reales. La identidad oficial de Vogel Consultoría permanece como autoridad: logo, paleta, Bricolage Grotesque y DM Sans, junto con una voz profesional orientada a empresas argentinas.

La profundidad surge de capas tonales y de la relación entre información e imágenes. Los paneles sólidos dominan la nueva portada; la navegación es la superficie con vidrio y desenfoque. Las capturas de la operación forestal muestran interfaces auténticas con datos ficticios identificados, sin atribuir cifras a resultados de un cliente. El movimiento acompaña la secuencia y conserva una lectura completa cuando se desactiva.

**Key Characteristics:**

- Azul profundo con jerarquía clara entre fondo, sección y panel.
- Ámbar contenido para el diagnóstico y pequeños puntos de foco.
- Titulares Bricolage Grotesque y texto/UI DM Sans.
- Evidencia de producto identificada como demostración.
- Lectura accesible sin depender del movimiento.
- Un único canvas WebGL fijo por documento institucional acompaña todo su contenido, sin reiniciarse ni dividirse entre secciones. Usa el componente TSX original de [Waves shader en 21st.dev](https://21st.dev/@sifan.s.f.zhao/components/waves-shader), montado como una isla React sobre el sitio Vue. Conserva el shader y el grano del componente; su paleta se adapta a navy, blue, bright y blueLight oficiales de Vogel. El movimiento de cursor vuelve a neutral tras 850 ms de inactividad. Si WebGL no está disponible, conserva una base azul estática; con movimiento reducido, dibuja un cuadro estático y omite el seguimiento. Fuente: `src/components/ui/waves-shader.tsx`.

Documentación extraída del código el 2026-10-03: `src/styles/tokens.css`, `tailwind.config.js`, `src/style.css`, componentes de portada, `CTASection.vue`, `ServicePage.vue`, `ResourcesApp.vue`, `ResourceArticleApp.vue`, `useSiteMotion.js`, `src/lib/analytics.js` y `automatizaciones/styles.css`. Contexto autorizado: `PRODUCT.md`, `docs/redisenio-storyboard.md` y manual de marca. Es una especificación del sistema implementado; el reporte `docs/redisenio-implementacion-2026-10-03.md` registra verificaciones y sus límites. Las capturas forestales usan fixtures del commit `8d6ab7bd217eeda01d61eb404ea49d5b57ef77a4`. Las vistas iniciales y finales del sitio están archivadas bajo `docs/capturas/`.

## Colors

La paleta mantiene el carácter institucional de Vogel; el frontmatter conserva el formato RGB utilizado por los canales compartidos de CSS y Tailwind 3.

### Primary

- **Azul institucional — blue:** tecnología, acciones de servicio y bordes activos.
- **Azul de refuerzo — bright:** hover del botón de servicio.
- **Azul claro — blue-light:** enlaces de lectura, conexiones y progreso de metodología.

### Secondary

- **Ámbar de diagnóstico — amber:** CTA principal comercial, foco de teclado, selección de texto e índices activos.

### Neutral

- **Navy profundo — navy:** fondo general y texto de acciones ámbar.
- **Azul profundo — deep:** secciones de caso y proyectos; fondo de la landing ARCA.
- **Slate ejecutivo — slate:** paneles, servicios y menú desplegable.
- **Blanco — white:** titulares y acciones sobre azul institucional.
- **Gris claro — gray:** texto y base de bordes suaves.
- **Azul grisáceo — muted:** descripciones, notas y metadata.
- **Borde tenue — border:** separación sin competir con contenido.
- **Error suave — error:** estado funcional de error; excepción semántica a la paleta institucional.

**The Foco Ámbar Rule.** El ámbar dirige a una acción o a un estado preciso; conservar la proporción contenida del manual de marca como criterio compositivo, sin presentarla como una medición automática del sitio.

Los canales `--vogel-*` son la fuente compartida. Los alias `--color-*` definen funciones y Tailwind aplica opacidades sobre los mismos canales. Tailwind también expone los roles semánticos `background`, `surface`, `panel`, `foreground`, `muted`, `link`, `action`, `focus`, `error` y `success`, vinculados a los alias CSS existentes. La landing ARCA importa esos tokens; sus alias cortos no crean una segunda paleta.

## Typography

**Display Font:** Bricolage Grotesque variable, autohospedada desde `public/fonts/` con licencia SIL OFL incluida; fallback ui-sans-serif/system-ui/sans-serif. La landing ARCA comparte los mismos tokens y archivos.

**Body Font:** DM Sans, con los mismos fallbacks según superficie.

**Character:** Bricolage Grotesque aporta presencia a los mensajes y DM Sans sostiene una lectura continua. El espaciado compacto de titulares se equilibra con interlineados amplios en párrafos.

La escala editorial usa controles de al menos 16px, metadata de 12–14px, UI/cuerpo de 14–18px, títulos de tarjeta de 20–30px, títulos de sección de 30–44px y display fluido de 52–100px. Los endpoints `clamp()` responden al viewport; tamaños intermedios sostienen jerarquías particulares con legibilidad verificada en capturas.

### Hierarchy

- **Display:** portada con máximo de 12ch; escritorio usa `clamp(60px,6.2vw,100px)`, tablet conserva presencia grande y móvil usa `clamp(52px,11vw,70px)`.
- **Headline:** títulos de sección de hasta 20ch; jerarquía y valores normativos en frontmatter.
- **Title:** títulos de servicios; móvil baja a 23px. Metodología utiliza 28px y 25px en móvil.
- **Body:** descripción de sección de hasta 65ch. Hero utiliza 18px y 42ch, bajando a 16px en tablet; artículos utilizan 16px con interlineado de 32px.
- **Label:** metadata discreta; los índices usan cifras tabulares y tracking de .08em. Las landings de servicios e IA neutralizan los eyebrows en mayúsculas mediante CSS global. Artículos conservan algunos eyebrows con tracking amplio.

**The Voz Clara Rule.** Priorizar títulos legibles y texto explicativo; conservar Bricolage Grotesque para jerarquía y DM Sans para lectura e interacción.

## Layout

El contenedor principal ocupa hasta 1280px, centrado, con márgenes interiores de 20px, 32px desde 640px y 40px desde 1024px. El espacio de secciones es fluido según frontmatter. La cabecera tiene contenedor propio hasta 1440px; la landing ARCA usa 1160px y padding final de 24px en su shell.

La portada combina texto y producto en dos columnas sobre 1100px; en tablet y móvil se apila para conservar escala y evitar cruces. Los servicios usan seis columnas con fichas de dos o tres columnas y un cierre de ancho completo; bajan a dos columnas bajo 1024px y a una bajo 640px. La galería web utiliza scroll horizontal manual con tres tarjetas visibles, dos bajo 1024px y una lista vertical bajo 640px. Los controles de avance tienen estado disabled y desaparecen en la lista móvil.

El caso forestal utiliza pasos y pantalla asociada. Sólo en viewport de al menos 1024px de ancho y 700px de alto, con movimiento permitido, GSAP fija la pantalla y sincroniza cambios con los pasos. La distancia de pin sigue la altura real de los tres pasos menos el alto del panel visual. Los cambios de etapa disparan un crossfade de 550ms, interrumpible al invertir el scroll, con progreso de tres segmentos y umbrales recalculados al refrescar. Bajo 1024px cada paso incorpora su imagen; reduced motion conserva las pantallas en flujo normal. La metodología dispone título sticky y cuatro pasos; en móvil, viewport bajo o reduced motion se vuelve estática.

El hero usa una entrada editorial tipográfica con titular protagonista, bajada y CTA. No coloca una imagen de producto delante del fondo; las capturas reales quedan dentro del capítulo forestal. Los títulos seleccionados se animan con SplitText (palabras y caracteres), sin máscaras que recorten los glifos, con desplazamiento de 18% y opacidad inicial .8; vuelven al HTML original al completar. Las entradas de bloques conservan su opacidad completa para sostener el contraste. No se altera el scroll nativo ni se exige desplazamiento horizontal. En móvil, pantallas cortas o movimiento reducido, el relato permanece en flujo vertical; fallos de GSAP dejan el contenido disponible. Los contextos GSAP se revierten al desmontar.

Las landings conservan grillas propias y espaciamiento de secciones entre 48px y 88px. El índice de recursos usa filas editoriales: metadata a la izquierda y título, resumen y enlace de lectura a la derecha, en columnas .3fr/1fr con gap de 48px y padding vertical de 40px. Bajo 640px se apila y la metadata se distribuye en línea con wrapping. Los artículos conservan una columna de lectura de hasta 44rem y un aside de 20rem en desktop. No convertir las composiciones de portada en una plantilla obligatoria para artículos o landings.

## Elevation & Depth

La nueva portada se apoya en capas navy/deep/slate y bordes tenues. El único blur de superficie es el de la navegación (16px). Los antiguos nombres de clase de vidrio en CSS global ahora representan paneles sólidos. Las landings de servicio y artículos conservan algunas tintas con alpha sobre fondos oscuros; ARCA también conserva bandas y etiquetas tonales. Esta documentación no afirma una uniformidad absoluta de superficies sólidas en todas las rutas.

### Shadow Vocabulary

- **Panel:** `0 24px 64px -32px rgb(var(--vogel-navy) / .75)`; menú y contenedores que usan los alias de sombra de Tailwind.
- **Pantalla de producto:** `0 30px 60px -20px rgb(var(--vogel-navy) / .9)`; superposición de capturas en hero.
- **Consentimiento:** `0 18px 50px rgba(0,0,0,.35)`; separación de la capa fija de preferencias analíticas.

ARCA anula sombras en su hero visual, cards, bandas y CTA; el enlace fijo de WhatsApp conserva su sombra local. No extender las sombras de producto a todas las fichas.

**The Material Legible Rule.** Usar separación tonal y espacio para organizar contenido; reservar el desenfoque de fondo para la cabecera.

## Shapes

Controles de 8px, fichas compactas de 12px, navegación de 14px, paneles de 16px y marcos de 20–24px; los chips usan forma de píldora. Las capturas se recortan sin deformación. Los bordes separadores son de 1px; las conexiones de producto usan líneas y nodos pequeños.

## Components

### Buttons

Acciones firmes, con lectura inmediata.

- **Shape:** radio de control; altura mínima general de 48px, gap de 12px entre texto y flecha.
- **Diagnostic:** ámbar con texto navy; hover blanco sobre puntero fino que permite hover.
- **Service:** azul institucional con texto blanco; hover azul bright.
- **Secondary:** transparente con texto gray y borde tenue; hover slate con borde blue-light.
- **Focus / Active:** outline ámbar de 2px, offset de 4px; desplazamiento vertical de 1px al activar. Transiciones de 180ms.
- **API observada:** `ActionButton` llama `accent` al botón ámbar, `primary` al azul y `secondary` al transparente. No inferir el color comercial por el nombre `primary` de su prop.
- **Variants:** navbar reduce CTA a 44px de altura y 12px de texto; ARCA usa su botón equivalente de 48px y 14px.

### Chips

Metadata concisa, sin competir con la acción.

Los tags ARCA y estados API de servicios utilizan contorno azul claro, forma de píldora y texto pequeño; algunos preservan mayúsculas. Son indicadores y etiquetas, no un sistema de filtros interactivos. Los tags ARCA destacados usan ámbar en planes seleccionados comercialmente.

### Cards / Containers

Paneles ejecutivos con información antes que ornamentación.

El panel compartido utiliza slate, radio panel y padding fluido. Servicios combina dos piezas principales de proporciones distintas con un catálogo de filas. Las piezas usan navy sólido, padding de 32px (24px móvil), títulos de 27–36px e imagen con escala contenida en hover. El catálogo agrupa enlaces con separadores y una flecha de 44px. Galería conserva scroll manual y usa cards de 260px de alto mínimo, con títulos de 34px; el hover pasa a deep sólido. El foco global continúa visible. Las capturas del caso son figuras con caption, identificación de demo y proporción conservada; no confundirlas con un componente de datos conectado en vivo.

### Inputs / Fields

Campos oscuros con lectura estable.

El contacto usa fondo navy al 80%, texto blanco, borde gray al 30%, radio de 12px y padding de 10px 16px. El caret es ámbar y el placeholder muted tiene opacidad completa. La regla global fija 16px en input, textarea y select. El foco visible comparte el outline ámbar. Error y confirmación tienen tokens funcionales (`--color-error` y `--color-success`); la implementación del aviso de error además usa tintas rojas locales. El botón de envío se desactiva con opacidad .6 durante la carga e incluye spinner y texto «Enviando…»; el error tiene `role="alert"`. Estos son estados inspeccionados en `CTASection.vue`, no respuestas reales verificadas ni certificación de accesibilidad del flujo completo.

### Navigation

Una cabecera compacta que permanece disponible; es la única superficie con vidrio del sitio.

El shell tiene silueta de cápsula y fondo totalmente transparente, sin capas navy, gradientes superpuestos ni atenuación de brillo. El shader global se ve a través de un `backdrop-filter` de blur .5px, sin alterar saturación; el borde y los reflejos interiores finos definen el vidrio. La tinta navy se conserva sobre la zona superior clara del shader fijo; no cambia por entrar en `main`. El menú de servicios mantiene tinta clara sobre su superficie sólida. El contraste sobre el shader variable requiere inspección del fondo compuesto y no queda certificado por las pruebas estáticas de tokens. Los SVG locales inline heredan `currentColor`, con estados de hover, foco, ruta o sección activa y pulsación en 160ms. El CTA conserva ámbar con icono navy. En el menú móvil abierto, la cápsula se convierte en panel de radio contenido; si el navegador no admite el filtro o el visitante reduce transparencia, el fondo vuelve a navy casi opaco.

En la home, una lectura de scroll con `requestAnimationFrame` sigue Servicios, Casos, Metodología y Nosotros; en páginas internas se activa Recursos o el servicio que coincide con la ruta. Los enlaces actuales exponen `aria-current`. Los servicios se exploran mediante `details/summary` y un desplegable sólido con scroll propio. Escape cierra y devuelve foco al control correspondiente; el click exterior cierra. Bajo 1200px aparece toggle de al menos 44×44px; bajo 600px se compacta la marca y el CTA desktop se oculta. El menú móvil incluye portal, encuesta y diagnóstico con los iconos disponibles. Se conservan nombres accesibles, `aria-expanded`, `aria-controls`, analytics y enlaces externos con `noopener noreferrer`.

### Secuencia de evidencia

La secuencia forestal muestra campo, revisión y dashboard, con paso activo ámbar y captions visibles. Las imágenes pertenecen al sistema real; los datos son fixtures ficticios. El último panel desktop utiliza `src/assets/cases/forestal-dashboard-desktop.png` (1440×1151); la variante móvil usa `forestal-dashboard.png` (390×1873), y revisión usa `forestal-revision.png` (390×1449). La altura de una imagen de recorrido completo puede exceder el viewport de captura. Mantener la identificación demo junto al contenido y los textos alternativos específicos de cada pantalla. El movimiento desktop es una mejora progresiva de esta secuencia.

### Índice de recursos

Filas de lectura con jerarquía editorial y separación tenue. La metadata muted incluye categoría en blue-light, tiempo de lectura y fecha; el título enlazado Bricolage Grotesque usa `clamp(24px,3vw,36px)`, peso 600, interlineado 1.2 y hasta 35ch. El enlace «Leer guía» conserva subrayado, foco visible y altura mínima de 44px. Es un patrón de índice; los artículos mantienen su checklist lateral y composición de lectura.

En la home, Recursos utiliza un índice navy compartido en lugar de tres cards translúcidas: categoría y tiempo, titular y resumen, y destino visible. Cada fila es un único enlace; la composición se apila en móvil.

### Lectura sobre el shader

El shader aprobado permanece como un canvas único y fijo, visible a su intensidad original en toda la página. No añadir overlays globales, planos de lectura en `main`, filtros de brillo ni fondos de sección para resolver la legibilidad. La corrección del 3 de octubre retira el plano navy al 80% que había alterado el fondo. Mejorar la lectura mediante color y opacidad del texto y superficies propias de componentes cuando corresponda. En `main`, el rol secundario usa Gray completo en vez de Muted. Las cards conservan fondos sólidos durante hover y las entradas no desvanecen bloques completos. La prueba estática cubre 15 pares sobre superficies sólidas; no certifica texto directamente sobre el shader ni la navbar transparente.

### Consentimiento analítico

Preferencias en una capa sólida y compacta. El banner conserva su comportamiento y utiliza tokens compartidos para panel, texto y acciones. Tiene ancho máximo de 620px, padding de 16px, radio de 18px, separación de 16px de los bordes de viewport y una sombra propia. Sus botones tienen altura mínima de 44px, radio de 8px, padding de 10px 14px y texto DM Sans de 13px/peso 700. «Aceptar medición» usa ámbar/navy; «Solo necesario» usa fondo transparente, texto gray y contorno suave. El foco visible proviene del estilo global del sitio.

## Do's and Don'ts

### Do:

- **Do** consultar el manual de marca antes de nuevas piezas y conservar assets oficiales del logo sin deformarlos.
- **Do** reutilizar los canales RGB compartidos entre Tailwind y CSS de ARCA.
- **Do** reservar el ámbar para diagnóstico y estados precisos, con foco de teclado visible.
- **Do** identificar las capturas forestales como interfaz real con datos de demostración.
- **Do** preservar contenido legible en móvil, reduced motion y fallo de motion.
- **Do** comprobar composición, keyboard y formularios con evidencia guardada antes de declarar QA visual concluida.

### Don't:

- **Don't** sustituir la identidad por una paleta ajena, iconos infantiles o promesas genéricas de IA.
- **Don't** convertir cifras de fixtures en resultados comerciales de clientes.
- **Don't** aplicar desenfoque de superficie a paneles de contenido.
- **Don't** ocultar contenido esencial hasta que una animación termine.
- **Don't** presentar inspección de código o capturas parciales como comparación visual inicial/final completa.
