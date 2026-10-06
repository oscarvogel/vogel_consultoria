# Phase 02 — INTRO → COMPLEJIDAD → SISTEMAS

Fecha: 2026-10-06. Estado: implementación local optativa; sin commit, push ni deploy automático. Base exacta del trabajo: `8dcc602`. Alcance: primer arco de la Home; no implementa Phase 03.

## Concepto y auditoría del punto de partida

La oferta se comprende primero en el Hero aprobado. El desplazamiento entra después en cuatro áreas con información dispersa y muestra cómo se convierten en una estructura operativa compartida. Es una extensión del «Paisaje de datos» vigente, con V ámbar, navy, azules institucionales, Clash Display y Chillax; no reemplaza identidad ni tokens. `PRODUCT.md`, `DESIGN.md`, el manual de marca y `.impeccable/surfaces/src-components-spatialexperience-vue.md` definen la autoridad visual.

El punto de partida ya dispone de motor espacial, rig de cámara, controlador de escenas, carga diferida, posters y gestión de recursos. La implementación reaprovecha ese ciclo de vida. Las siete definiciones de Phase 01 permanecen independientes. Se mantienen el texto comercial del Hero, marca, navegación, CTA, Servicios, caso forestal y todos los capítulos posteriores. Las dos nuevas secciones HTML incluyen headings, resumen de áreas y enlaces a servicios reales.

## Activación y modos

Los flags son de Vite: se resuelven al iniciar el servidor o construir, no desde un control de interfaz. Ambos tienen valor `false` en `.env.example`.

| Narrative | Core | Resultado |
|---|---|---|
| false | false | Home y renderer anteriores |
| false | true | Núcleo espacial Phase 01 |
| true | false | Arco Phase 02 |
| true | true | Arco Phase 02; Narrative tiene precedencia |

Para revisar Phase 02 en PowerShell:

```powershell
$env:VITE_SPATIAL_NARRATIVE='true'
$env:VITE_SPATIAL_CORE='false'
npm run dev -- --host 127.0.0.1 --port 5192
```

Abrir `http://127.0.0.1:5192/`. INTRO se observa arriba; COMPLEJIDAD al 50% del recorrido útil del arco y SISTEMAS al 95%. El recorrido útil es la altura del arco menos una altura de viewport. Para desactivar, detener el servidor, asignar `$env:VITE_SPATIAL_NARRATIVE='false'` y reiniciarlo; mantener Core en `false` para volver al baseline. Core solo reproduce Phase 01.

## Arquitectura y archivos

| Archivo | Responsabilidad |
|---|---|
| `src/App.vue` | Precedencia de flags, propiedad espacial y sustitución del Hero por el wrapper del arco |
| `src/components/SpatialExperience.vue` | Entrada al adaptador narrativo o al modo Core vigente |
| `src/components/SpatialNarrativeArc.vue` | Hero original y momentos HTML de Complejidad/Sistemas |
| `src/lib/mountSpatialNarrative.js` | Media query, un ScrollTrigger, proyección, handoff, fallback y teardown |
| `src/lib/narrativeScenes.js` | Tres poses, cinco rangos y cuatro anchors |
| `src/lib/clusterWorld.js` | Puntos/segmentos estáticos y morph en GPU |
| `src/lib/dataWorld.js` | Terreno procedural, uniforms compartidos y composición del mundo |
| `src/lib/sceneController.js` | Muestreo determinista de rangos; configuración existente preservada |
| `src/lib/spatialEngine.js` | Único renderer/canvas/RAF; resize, pausa, contexto y dispose |
| `src/composables/useSiteMotion.js` | Propiedad del modo y convivencia con el Lenis vigente |
| `src/styles/spatialNarrative.css` | Composición del arco, lectura, labels y posters responsivos |
| `scripts/test-spatial-narrative.mjs` | Invariantes del controlador y geometrías |
| `scripts/test-spatial-narrative-browser.mjs` | Comportamiento y evidencia Chromium |
| `scripts/capture-phase02.mjs` | Posters derivados del mundo implementado |
| `scripts/test-landscape.mjs` | Reconoce el modo narrativo en la espera del recorrido de comportamiento |
| `package.json`, `.env.example` | Comandos y flags de prueba |
| `.gitignore` | Mantiene capturas y revisión visual locales |
| `DESIGN.md` | Extensión optativa, preservando su contenido anterior |
| `public/landscape/complexity.webp`, `systems.webp` | Alternativas estáticas; cada una tiene sidecar `.webp.json` |

La API del adaptador es `mountSpatialNarrative(host) → dispose`. `createSpatialEngine(T, { narrative:true })` extiende el mundo existente. `createSpatialSceneController(scenes, ranges).setProgress(p)` devuelve una referencia de estado reutilizada (`from`, `to`, `blend`, parámetros escalares). El adaptador aplica `rig.setTransition(state.from, state.to, state.blend)` y el único callback de render ejecuta `rig.update(dt)` / `world.update(time, state)`. Sin `ranges`, el controlador conserva el recorrido equidistante de Phase 01.

Solo el modo seleccionado instancia un controlador espacial. No hay un segundo renderer, motor, rig, loop de render WebGL ni instancia Lenis. El adaptador usa `createSpatialEngine`, `createCameraRig` y `createSpatialSceneController`. Un token de generación evita montar una sesión obsoleta después de imports asíncronos o unmount. La limpieza elimina trigger, observers, listeners, timeout, geometrías, materiales y renderer. Los cambios dinámicos de eligibility limpian la sesión anterior y restituyen el HTML estático.

## Recorrido, poses y reversibilidad

En escritorio elegible, Hero ocupa 100svh y cada momento 150svh: arco de 400svh. Un único trigger tiene una extensión igual a la altura del arco, sin pin ni snap. El progreso es `clamp((scrollY - arcTop) / (arcHeight - innerHeight), 0, 1)`. El handoff ocupa el siguiente viewport del desplazamiento, desde que el progreso alcanza 1 hasta la parte superior de Servicios: reduce host e indicador y finalmente pausa el renderer.

| Progreso | Estado |
|---|---|
| 0–.20 | INTRO estable |
| .20–.38 | Entrada hacia COMPLEJIDAD |
| .38–.65 | COMPLEJIDAD estable |
| .65–.82 | Morph hacia SISTEMAS |
| .82–1 | SISTEMAS estable |

| Pose | Posición | Objetivo | FOV | Dispersión / orden / clusters |
|---|---|---|---|---|
| INTRO | [0, 4.4, 15] | [0, .2, -14] | 47 | 0 / 0 / 0 |
| COMPLEJIDAD | [0, 2.6, 1] | [0, 1, -18] | 51 | 1 / 0 / 1 |
| SISTEMAS | [6, 4, -4] | [0, .8, -23] | 47 | 0 / 1 / 1 |

El controlador depende del progreso y el rig interpola posición/FOV y quaternion mediante SLERP. La reversa vuelve exactamente a las mismas poses muestreadas; no acumula desplazamientos. Las intensidades de terreno de Intro/Complejidad/Sistemas son .85/.45/.42 y su visibilidad 1/.48/.45: son parámetros de escena, no tokens globales. El Hero se retira suavemente hasta −48px y escala hasta .975; la lectura posterior permanece en el documento.

## Geometría, uniforms y etiquetas

Los cuatro grupos son OPERACIÓN, ADMINISTRACIÓN, INFORMACIÓN y REPORTES, con 128 puntos por grupo (512 total). Las relaciones comprenden 168 segmentos cortos y tres entre grupos (171 total). Dos geometrías adicionales, Points y LineSegments, se suman al terreno: total observado de cuatro geometrías y cuatro draw calls, cero texturas. Los extremos dispersos y ordenados se crean una vez como `position` y `aOrdered`; los buffers no se reconstruyen durante el scroll.

El shader mezcla extremos con `uOrder`; el terreno conserva morph procedural y recibe `uDispersion`, `uOrder`, `uClusters` y `uPointer`. Los materiales aditivos producen la sensación de luz ambiental, sin añadir luces de escena. Los puntos de clusters mantienen contraste frente al terreno atenuado, tamaño dependiente de profundidad (`96 / -z`, limitado) y las relaciones aumentan opacidad de .28 a .62 al ordenar. No se añaden texturas ni sombras.

| Área | Anchor disperso | Anchor ordenado |
|---|---|---|
| Operación | [-8, 1, -10] | [-5, 1, -18] |
| Administración | [8, 2, -16] | [0, 1, -23] |
| Información | [-6, 2, -26] | [5, 1, -28] |
| Reportes | [10, 1, -33] | [8, 1, -36] |

El mismo modelo CPU actualiza un vector suministrado y replica el morph/desplazamiento del shader para proyectar labels HTML. La supresión evalúa clip, profundidad, área de lectura y colisiones. La capa invisible conserva dimensiones medibles antes del primer frame para usar tamaños reales desde el comienzo; la suite comprueba encuadre y ausencia de solapamientos antes de cualquier resize. No se proyecta texto como textura. Los labels visuales y el progreso son `aria-hidden` y no capturan eventos; un resumen de áreas separado permanece en el árbol de accesibilidad. Los destinos de Sistemas son enlaces HTML a Sistemas a medida, Mantenimiento de equipos y Desarrollo web; conservan hash, foco y teclado.

## Responsive, movimiento reducido y fallos

La mejora requiere ancho mínimo de 1024px, `pointer:fine` y `prefers-reduced-motion:no-preference`. Touch/móvil y movimiento reducido inicial usan HTML con posters sin cargar Three.js. El contenido no necesita completar el arco para ser leído ni activado. En móvil los posters usan altura de 320px, `object-fit:cover` y posición horizontal de 62%; desktop con movimiento reducido o WebGL fallido emplea una grilla de texto/poster con imagen de 480px.

Un fallo de WebGL libera la sesión, añade `narrative-unavailable` y colapsa la reserva de cuatro alturas a flujo editorial. Una pérdida temporal de contexto muestra posters; su recuperación utiliza el mismo canvas. El documento oculto pausa la animación. Tras el handoff hacia Servicios el renderer pausa; el cierre conserva un poster estático. El puntero vuelve a neutral después de 900ms o al salir. Su perturbación local máxima es .08 unidades de mundo y el rig conserva sus límites .24/.12; no altera poses ni buffers.

Se conserva `powerPreference:'low-power'`. El DPR es `min(devicePixelRatio, 1.5, sqrt(1,800,000 / viewportArea))`, con un techo de 1.8 millones de píxeles. No constituye detección de GPU ni garantiza rendimiento en todos los dispositivos.

## Validación ejecutada y evidencia

Las pruebas se ejecutaron localmente en Windows con Chromium headless. La suite Phase 02 se volvió a ejecutar después de los ajustes de contraste y posters. Evidencia final: `docs/capturas/spatial-phase-02/validation.json` y 17 capturas PNG en el mismo directorio, fuera de Git. El runner escribe directamente en `docs/capturas/spatial-phase-02`; las capturas y los artefactos de revisión `.impeccable/review/` permanecen locales, excluidos de Git.

Viewports: 1440×900, 1440×700, 1920×1080, 390×844 y 360×800. Capturas: intro, entry, complexity, mid-transform, systems, services; Hero en los tres escritorios; Hero/Complejidad/Sistemas en ambos móviles; reduced-motion y no-webgl. No se utiliza un mock visual del mundo.

Pruebas aprobadas: `npm test`, `npm run test:contrast`, `npm run test:spatial`, `npm run test:spatial:browser` contra Core en 5191, y `npm run test:spatial:narrative` / `npm run test:spatial:narrative:browser` contra Narrative en 5192. UI, narrativa legacy y comportamiento legacy pasaron contra el baseline en 5190; comportamiento también pasó contra Core en 5191 y Narrative en 5192, incluidos menú touch/Escape, recarga de hash y estados locales del formulario. Las respuestas del formulario se simularon: no se enviaron consultas externas ni se verificó entrega real. Builds aprobados para default, Core y ambos flags activos, con precedencia Narrative.

La suite legacy `test:narrative` busca `__vogelLandscape` / `.landscape-live` y corresponde a 5190. Una invocación accidental contra Core 5191 agotó el timeout esperando ese renderer; se corrigió el destino y no representa una regresión ni soporte de esa suite para Core. Core se valida con su suite espacial dedicada. La primera ejecución del recorrido general contra Narrative también agotó la espera porque el helper reconocía únicamente `.landscape-live` y `.spatial-live`; se añadió `.narrative-live` sin retirar asserts y la suite completa pasó.

La suite Phase 02 comprueba: poses de ida/reversa y continuidad en límites, canvas/renderer persistente, cuatro geometrías/draw calls, buffers estables, proyección de anchors, una instancia runtime Lenis, un trigger del arco, resize durante morph, ausencia de overlap del CTA, navegación por teclado/hash, pausa tras handoff, retorno neutral del puntero, pausa ante `document.hidden` forzado en Chromium, recuperación de contexto con el mismo canvas, movimiento reducido dinámico, dos móviles y movimiento reducido inicial sin Three, falta de WebGL y limpieza tras unmount asíncrono. `errors` queda vacío en el reporte; también se filtran errores de compilación/validación de shaders. Un smoke del build servido por `vite preview` comprobó precedencia de flags, canvas único, pose Systems, ausencia de la API DEV de snapshots y móvil sin Three.js.

Comandos reproducibles, con los servidores correspondientes activos:

```powershell
npm test
npm run test:contrast
npm run test:spatial
$env:SPATIAL_URL='http://127.0.0.1:5191'
npm run test:spatial:browser
$env:LANDSCAPE_URL='http://127.0.0.1:5190'
npm run test:ui
npm run test:narrative
npm run test:narrative:behavior
npm run test:spatial:narrative
$env:NARRATIVE_URL='http://127.0.0.1:5192'
npm run test:spatial:narrative:browser
```

### Mediciones y límites

El último `validation.json` registra intervalos RAF mediana 5.9ms y p95 6.0ms; son intervalos del scheduler headless, no tiempo GPU ni una certificación de 60fps. CDP mide 0.059711s adicionales de TaskDuration durante 0.712342s de observación. Tres muestras de heap tras GC son 8,664,092 / 8,702,032 / 8,729,008 bytes: aumento de 64,916 bytes, aproximadamente 63.4KiB. Estas muestras acotadas no prueban ausencia universal de fugas. No se midieron memoria GPU ni tiempos GPU en hardware físico.

El build conserva la advertencia de chunk lazy de Three.js (746.94KB, 191.81KB gzip). No se evaluaron Safari ni teléfonos físicos. La percepción premium y el ritmo sensorial necesitan revisión del usuario. Las capturas y asserts verifican la implementación local; no equivalen a QA de producción.

## Procedencia, revisión y problemas

`complexity.webp` y `systems.webp` proceden del canvas del mundo original mediante `scripts/capture-phase02.mjs`: progresos .5 y .95, `uTime=0` y cámara de poster en [9,14,8] mirando [0,1,-22]. La captura usa `uClusters` con exposición 2.2 exclusivamente para legibilidad del raster y restaura el valor al terminar; el mundo en vivo mantiene su exposición. Los WebP pesan aproximadamente 11.6KB y 15.7KB. Sus sidecars `.webp.json` registran ORIGIN y fecha 2026-10-06. No usan imágenes externas ni generadas por IA. El poster anterior `data-terrain.webp` conserva sus bytes y su procedencia existente; se añadió el sidecar compatible `data-terrain.webp.json` usando el origen ya registrado en `provenance.json`. El scan de procedencia final informó tres rasters, cero orígenes faltantes.

La primera revisión pidió tres ajustes acotados: reforzar la separación entre clusters y terreno, recomponer posters estáticos y documentar este modo independiente en DESIGN.md. Se aplicaron contraste/intensidad/tamaño de puntos y relaciones, cámara/crop de posters y composición editorial de fallback; la extensión de DESIGN.md se añadió preservando todos los bytes anteriores y sin tocar frontmatter ni `.impeccable/design.json`. El veredicto independiente final fue **ship**, con los tres ajustes calificados como resueltos y las 17 recapturas válidas. Este veredicto cubre esos tres ajustes; no certifica percepción subjetiva del scroll ni rendimiento en hardware representativo. Informe local: `.impeccable/review/phase02-verdict.md`.

Las advisories del detector sobre tamaños heredados de metadata y el negro técnico de una máscara no cambian los tokens. Los marcadores numerados y el indicador de avance son la decisión específica del arco autorizada por el usuario; no se canonizan como nueva identidad global ni se convierten en receta para otras superficies.

## Preparación para Phase 03

### Corrección de continuidad del Hero — 2026-10-06

La captura del usuario mostró un borde horizontal a aproximadamente el 30% del Hero. El modo narrativo ocultaba el poster heredado, pero conservaba su contenedor `.data-landscape`, incluido el pseudo-elemento `::after` con máscara opaca y su halo. Ese navy casi negro se superponía al fondo del mundo persistente y producía un cambio abrupto de color.

Ahora `.narrative-live` oculta la superficie heredada completa dentro del arco; el canvas persistente conserva su propia máscara progresiva. La regla se desactiva al perder contexto, activar reduced motion o usar el fallback, restaurando la composición estática. No cambia el Core de Fase 1, el Hero convencional, el cierre ni los tokens.

Validación local: build correcto y suite de navegador de Fase 2 completa. Se añadió una regresión que compara píxeles por encima y debajo del borde heredado, además de verificar la visibilidad del poster del Hero al activar reduced motion. Evidencia local a 1885×909: `docs/capturas/hero-narrative-before.png` y `docs/capturas/hero-narrative-after.png`. No se avanzó a Fase 3.

La separación de poses/rangos, el adaptador y los uniforms permiten estudiar capítulos futuros sin duplicar motor. Antes de extender, revisar la dirección narrativa con evidencia visual, confirmar alcance, medir hardware y volver a comprobar pausas, reversibilidad, lectura, presupuesto de geometría y fallbacks. Phase 03 no está implementada; Servicios y capítulos posteriores siguen siendo editoriales. No ampliar ahora el trigger, las siete definiciones Core, ni el renderer al cierre.
