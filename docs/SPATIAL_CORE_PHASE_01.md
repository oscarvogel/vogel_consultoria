# Vogel / System Landscape — Spatial Core, Fase 01

Fecha: 2026-10-06. Implementación validada localmente; commit y push autorizados posteriormente por el usuario. Sin despliegue incluido. La narrativa de Fase 2 no está implementada.

## Auditoría y decisiones

Se inspeccionaron App, DataLandscape, HeroSection, dataLandscape, sceneController, mountWavesBackground, useHomeMotion, useSiteMotion, home.css, tokens.css, DESIGN, PRODUCT, AGENTS y el manual de marca.

El paisaje previo ya tenía un renderer lazy compartido entre Hero y cierre, geometrías de puntos/conexiones, un RAF, observers, pointer amortiguado, proyección de etiquetas y poster estático. Trasladaba el canvas al host con mayor visibilidad; no era un mundo montado permanentemente sobre toda la Home. La cámara y la generación del terreno estaban integradas en el mismo módulo.

La entrada actual usa useScrollReveal → initStoryReveal. Esta función es propietaria del Lenis existente y sus efectos editoriales. useHomeMotion y mountWavesBackground no se invocan desde la Home actual. sceneController conservaba un puente pequeño para el shader histórico, con consumidores propios: no era un controlador de cámara Three. Se amplió ese mismo módulo con una fábrica espacial por instancia, preservando sus exports anteriores.

Se reutilizan las fórmulas del terreno, atributos, semillas, materiales, colores, anchors y cálculo de altura. El modo predeterminado conserva la cámara y el traslado Hero/cierre anteriores. Los nuevos uniforms tienen valores neutrales para esa modalidad. No se reactivó el shader global histórico ni se crearon otro Lenis o controladores de escena duplicados.

Se mantienen V ámbar, Clash Display, Chillax, tokens, copy, Servicios, Forestal, metodología, interiores y contratos públicos de los componentes. Los assets preexistentes sin seguimiento permanecen fuera del cambio.

## Arquitectura final y archivos

Archivos nuevos:

- `src/components/SpatialExperience.vue`: host persistente, elegibilidad, único trigger espacial, eventos del puntero, observers y cleanup.
- `src/lib/spatialEngine.js`: renderer, escena, cámara, único scheduler de render, resize, visibilidad del documento, contexto WebGL y disposal.
- `src/lib/dataWorld.js`: terreno compartido, shaders, geometrías, uniforms y anchors.
- `src/lib/cameraRig.js`: pose base, SLERP, offset amortiguado de puntero, pausa y reset.
- `src/lib/spatialScenes.js`: siete estados declarativos y clave privada de ownership Vue.
- `src/styles/spatial.css`: capas y máscaras exclusivas del prototipo.
- `scripts/test-spatial-core.mjs` y `scripts/test-spatial-browser.mjs`: pruebas unitarias/lifecycle y navegador.
- Este documento y `docs/screenshots/spatial-core-phase-01/`: evidencia seleccionada y reporte de navegador.

Archivos modificados: `src/App.vue`, `src/components/DataLandscape.vue`, `src/lib/dataLandscape.js`, `src/lib/sceneController.js`, `package.json` y `scripts/test-landscape.mjs`.

Flujo:

```text
ScrollTrigger existente/Lenis → progreso del trigger espacial
  → createSpatialSceneController → CameraRig + DataWorld
  → SpatialEngine → un renderer / un canvas / un RAF
```

App proporciona ownership sin cambiar props de Hero o DataLandscape. Con la bandera activa, DataLandscape conserva posters y no registra el motor anterior, incluso si el prototipo falla. SpatialExperience carga Three/GSAP progresivamente y monta un único canvas. El canvas no cambia de padre al pasar entre estados. Un cambio de breakpoint o preferencia desmonta los recursos; un capítulo o una recuperación de contexto no reconstruye el mundo.

En Hero se utiliza la altura real del paisaje anterior, incluyendo su altura mínima y máxima. Sus anchors se proyectan desde la superficie fija a coordenadas locales del HTML. Una máscara reversible y un ajuste de posición convierten progresivamente esa superficie en una franja inferior de 160 px. El terreno se mantiene detrás de los controles y textos. El cierre utiliza el mismo mundo con la franja discreta de prueba; todavía no tiene una composición narrativa definitiva.

## API, escenas y progreso

`createSpatialSceneController(spatialScenes)` devuelve:

- `setProgress(p)`: limita a 0–1, selecciona dos estados vecinos y calcula smoothstep. Un valor no finito se trata como cero.
- `setTransition(fromId, toId, p)`: interpolación explícita de un par; un ID desconocido lanza RangeError. No inicia una animación temporal. `progress` conserva el último recorrido global; `blend` representa esta transición local.
- `getState()`: referencia estable de lectura a estados vecinos, blend y parámetros del mundo. No mutar esa referencia desde consumidores.
- `reset()`: restaura intro y progreso cero.

`createCameraRig(THREE, camera)` devuelve:

- `setTransition(from, to, p)`: establece la pose objetivo por progreso; posiciones lineales y quaternions normalizados mediante SLERP. Recibe el blend ya suavizado por el controlador.
- `setPointer(x, y)`: normaliza a −1…1. Offset máximo de .24 unidades X y .12 Y.
- `update(dt)`: aplica la pose y amortigua solamente el offset del puntero, con constante .4 s.
- `pause()` / `resume()`: suspenden/reanudan la aplicación de pose; conservan el último objetivo.
- `reset()`: neutraliza puntero y restaura el primer estado configurado. Si está pausado, lo aplica al reanudar.

La pose base es función del progreso, sin tween de duración fija ni espera del usuario. El puntero vuelve a neutral tras 900 ms de inactividad. Su offset se suma a la cámara; no modifica los estados declarativos.

Estados: intro, complexity, systems, automation, data, intelligence y decision. Incluyen `position`, `target` (orientación look-at), `fov` (distancia aparente), `depth` (profundidad de desvanecimiento), `intensity`, `visibility`, `connections` y `transition: 'smoothstep'`. La intensidad corresponde al shader luminoso existente, no a luces físicas nuevas. La visibilidad se modifica mediante alpha; no se regeneran partículas.

Intro parte de `[0,4.4,15]`, mirando a `[0,.2,-14]`, con FOV 47. Las otras poses son discretas y cercanas. Decision vuelve a la pose inicial. Los estados son equidistantes en un recorrido sobre el main existente; sus nombres no se asocian todavía a secciones comerciales.

## Activación y pruebas reproducibles

En `.env.local`:

```dotenv
VITE_SPATIAL_CORE=true
```

Reiniciar Vite. Quitar la bandera o usar `false` restaura el modo anterior. La bandera también es de build: cambiarla requiere reconstruir el bundle. No se añadió ese archivo de entorno ni una opción pública de debug.

Para validar ambos modos simultáneamente en PowerShell, ejecutar cada servidor en una terminal:

```powershell
$env:VITE_SPATIAL_CORE='false'
npm.cmd run dev -- --host 127.0.0.1 --port 5190 --strictPort
```

```powershell
$env:VITE_SPATIAL_CORE='true'
npm.cmd run dev -- --host 127.0.0.1 --port 5191 --strictPort
```

`npm run test:spatial:browser` usa ambos servidores; acepta `SPATIAL_URL` y `BASELINE_URL`. Los tests existentes usan `LANDSCAPE_URL`, predeterminado 5190. Playwright se resuelve desde el runtime local si no está instalado en el proyecto, siguiendo el mecanismo previo. No se añadió una dependencia de producción.

## Rendimiento, lifecycle y accesibilidad

Dos geometrías, dos materiales, dos draw calls; 58.102 puntos en escritorio. Buffers, vectores y quaternions se reutilizan. Los shaders conservan la animación de altura en GPU. La proyección de tres anchors mantiene escrituras de strings CSS durante el Hero, como el sistema previo; el mundo y la cámara no crean objetos Three por frame.

DPR máximo 1.5 y presupuesto de 1,8 millones de píxeles. ResizeObserver mide fuera del frame. La escena se pausa con documento oculto, fuera del main, tamaño nulo o contexto perdido; reinicia el delta al volver. El motor tolera llamadas repetidas a start y dispose. Un fallo del render loop detiene la mejora y permite volver al poster.

La pérdida de contexto retira el estado live y muestra posters. La restauración conserva el renderer y canvas; Three reconstruye sus recursos internos. No se fuerza una pérdida durante recuperación. El desmontaje libera geometrías/materiales, renderer, RAF, observers, trigger y listeners. Un contador de generación descarta imports resueltos después de un desmontaje o cambio de elegibilidad.

El prototipo exige ancho ≥1024, puntero fino y no reduced motion. Tablet, móvil, reduced motion y WebGL ausente conservan los posters existentes, sin iniciar el renderer anterior. En modo predeterminado se conserva la política móvil anterior. Canvas aria-hidden, sin foco ni eventos de entrada; HTML y formularios funcionan independientemente.

## Resultados y evidencia

Pasaron builds con bandera false y true; npm test; test:contrast; test:ui y test:narrative:behavior en ambos modos; test:narrative en modo actual; test:spatial; test:spatial:browser. `git diff --check` sin errores de whitespace.

UI cubrió cinco viewports de Home y 16 destinos interiores en escritorio/móvil. El recorrido cubrió menú touch, Escape, restitución de foco, anchors/reload y estados del formulario con respuestas locales simuladas. La prueba espacial verificó identidad del canvas durante ida/vuelta, cámara reversible, puntero/neutral, un trigger espacial, una instancia Lenis observada en runtime, anchor por teclado, recursos constantes, resize, reduced motion dinámico, móvil, WebGL ausente, contexto perdido/restaurado sobre el mismo canvas y cleanup normal/durante carga asíncrona. En ventana 1440×700 se compara la posición de etiquetas con el modo anterior.

El scheduler también se probó sin GPU para document.hidden, tamaño cero, error de render y disposal idempotente. La prueba de visibilidad del documento es unitaria; no se presenta como medición física de una pestaña minimizada.

Las capturas seleccionadas y `validation.json` se conservan en `screenshots/spatial-core-phase-01/`. Los scripts generan sus capturas completas en el directorio temporal indicado al terminar. Se inspeccionaron visualmente Hero, estado intermedio, cierre y ventana baja.

Se registraron métricas CDP de CPU/heap y tres muestras de heap después de GC. Los conteos GPU se mantuvieron constantes. Esto es una exploración corta de estabilidad, no un perfil exhaustivo de GPU ni garantía de ausencia de fugas a largo plazo. Los valores exactos están en validation.json.

Incidencias resueltas: una capa existente tapaba inicialmente el canvas del Hero; se corrigió sólo bajo spatial-live. La altura inicial del canvas no respetaba el min/max-height del Hero; ahora se mide su superficie real. El test de recorrido esperaba únicamente la clase live anterior; ahora acepta ambos modos. Una comprobación de identidad de canvas se interrumpió por HMR durante una edición; se repitió con código estable.

## Limitaciones y Fase 2

- Chromium local con viewports y touch emulados; no Safari, dispositivos físicos ni certificación de 60 FPS. No se verificó entrega externa del formulario.
- El build advierte por el chunk Three de aproximadamente 747 KB minificado (192 KB gzip), ya presente en el sistema anterior. Se conserva carga lazy y no se añadieron modelos/dependencias.
- El contraste automatizado cubre 15 pares sobre superficies sólidas; no certifica todos los frames del canvas.
- En 1440×700 el CTA puede cubrir parte de la etiqueta Automatización. Se reprodujo también en el modo anterior y se conserva su composición por la restricción de no rediseñar Hero; queda documentado como problema preexistente, no resuelto por esta fase.
- La intensidad y visibilidad son controles de shader básicos. No hay densidad procedural dinámica, viaje cinematográfico, nuevas secciones ni escena completa de complejidad.

El núcleo queda preparado para Fase 2: sustituir las poses de demostración y su distribución equidistante por estados/intervalos narrativos expresamente autorizados, manteniendo este renderer, CameraRig y DataWorld. Cualquier nueva geometría se integrará en el mundo y se liberará desde su lifecycle, sin renderers por capítulo.
