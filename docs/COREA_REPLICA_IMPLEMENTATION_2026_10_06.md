# Implementación local Corea / Vogel — 2026-10-06

La Home presenta nueve proyectos reales a través de galería y grilla. Info concentra servicios, método, Oscar, recursos, contacto, portal y FEMAG («En desarrollo»). Se conserva la verdad empresarial y el contenido de interiores; no se inventan resultados, fechas, stacks ni créditos.

## Arquitectura y contratos

`src/App.vue` controla rutas reales mediante History API: `/`, `/info/` y `/proyectos/<id>/`. Hay diez entradas Vite nuevas para Info y los nueve lectores, que permiten carga directa. El stage permanece montado al abrir páginas; snapshot, posición activa y foco se restauran al cerrar, usar Escape o regresar con Back. Los hashes comerciales abren y enfocan Info. Navegación modificada y enlaces externos conservan el comportamiento del navegador.

`HomeStage.vue` proporciona rueda con glide para puntero fino, drag, swipe nativo y teclado. GSAP Flip transforma carrusel/grilla. `src/lib/portfolioMotion.js` crea un puente de imagen DOM temporal entre tarjeta y lector: dura .65s, se cancela ante cambios de ruta/tamaño y no añade un render loop persistente. Movimiento reducido omite el puente y las transiciones espaciales.

`src/data/projects.js` aporta el catálogo original; `homeCards.js` define la selección y acceso a proyectos; `projectMedia.json` mantiene dimensiones y selección de medios; `public/projects/provenance.json` es la autoridad de procedencia de originales y derivados. Forestal reutiliza `forestCase` y conserva Registrar → Revisar → Decidir con las dos aclaraciones de datos de demostración. El formulario usa su contrato existente; teléfono opcional y estados de error/éxito accesibles.

## Medios y procedencia

24 WebP públicos derivados de 16 capturas originales locales conservadas en `docs/capturas/project-sources-2026-10-06/`. `scripts/prepare-project-captures.mjs` usa Sharp para derivar tamaños y generar el manifiesto. Las capturas mantienen colores originales; los títulos, enlaces y estado de falla permanecen disponibles si una imagen no carga. Originales y QA locales ignorados se conservan fuera de Git.

V ámbar SVG oficial; Archivo Variable expandida 125%, peso 800, y Chillax. Carbón #161515, crema #F3F1E2, metadata cálida #A8A596 y único acento #FFBC54. Info usa paneles mates #262523 y #3b3933; lectores crema. No WebGL, videos, mockups ni nuevas dependencias.

## Validación y límites

- Dev local: `http://127.0.0.1:5198`; preview temporal: `http://127.0.0.1:5201`.
- `npm test`: 13 pruebas aprobadas. Build: 126 módulos, aprobado.
- `scripts/test-portfolio-browser.mjs`: fallback a Playwright incluido en el runtime; no añade dependencia al proyecto.
- `results-dev.json` y `results.json`: 43 comprobaciones de navegador cada uno. Viewports 1440×900, 1440×700, 1920×1080, 390×844 y 360×800.
- Home, grilla, Info, contacto, Forestal y proyecto web capturados en los cinco tamaños; también movimiento reducido y falla de imágenes.
- Verificado: rueda/drag, swipe mediante CDP, History, carga directa, foco, teclado, retorno de posición, hashes, títulos y ausencia de overflow.
- Web3Forms se interceptó con dos respuestas simuladas: error y éxito. No hubo transmisión del formulario.

Estas pruebas usan Chromium automatizado y touch simulado mediante CDP. No son mediciones de rendimiento en dispositivos físicos ni validación de envío real a Web3Forms. Evidencia local en `docs/capturas/corea-replica-2026-10-06/`.

El detector mecánico se ejecutó una vez; señaló documentación tipográfica/radios obsoleta y neutrales cálidos. DESIGN y sidecar se reconciliaron con la identidad implementada y radios 4/8/12px, manteniendo 16/20px para interiores. Los neutrales cálidos son parte de la adaptación autorizada.

La revisión independiente encontró una superposición en el header de Info móvil. Se implementó respaldo opaco de 82px; recheck de cabecera aprobado en cinco viewports (`header-recheck.json`); recapturas de grilla y veredicto final aprobados para entrega local. La revisión independiente final confirmó ambos hallazgos resueltos.

Entrega local. Sin commit, push ni deploy en este alcance.


La grilla final se corrigió a proporción 4:5 en desktop y móvil, gap24px, tras revisión independiente. Recapturas actualizadas y los 43 checks de dev5198 aprobados tras grilla4:5. Build final aprobado con 126 módulos; la suite final de producción5201 aprobó 43 checks después de todos los ajustes, incluidos títulos, header y grilla4:5. Comparaciones completas: comparison-info.png, comparison-grid.png y comparison-project.png (referencia a izquierda, build a derecha).

El título largo de Municipalidad recibió una excepción responsive localizada de 24–29px (7.1vw) en carrusel móvil. `scripts/test-portfolio-edge-cases.mjs` verifica fit de todos los títulos en 1440/390/360, cambio rápido de vistas finalizando en 1072×603 y teclado con activación dinámica de movimiento reducido. Revisión independiente final aprobada para el alcance local.

## Verificación final funcional

Después de todos los ajustes: build126 módulos y npm test13 aprobados; `results.json` registra43 checks PASS en preview5201 con los cinco viewports, títulos, header y grilla4:5. `results-dev.json` conserva43 checks dev aprobados después de la corrección de grilla.

`scripts/verify-portfolio-build.mjs`: diez rutas HTML directas responden HTTP200 y cargan JavaScript con hash;24 imágenes públicas coinciden mediante SHA256. Tamaño total WebP público:3.319.524 bytes. `scripts/test-info-header.mjs`: cinco viewports aprueban foco, Tab y respaldo opaco de cabecera. La suite de edge cases aprueba todos los títulos de carrusel en1440/390/360, transformación rápida final1072×603 y teclado con activación dinámica de movimiento reducido.

`git diff --check` sobre archivos modificados y documentación pasa. El chequeo global del repositorio falla por whitespace preexistente en HTML de interiores no modificados; este informe no afirma un chequeo global limpio. Revisión visual independiente final aprobada para el alcance local.

## Aprobación final independiente

Disposition: **ship within authorized local scope**. Proporción de grilla4:5 y header opaco de Info confirmados como resueltos por la misma revisión independiente; no se requieren más fixes ni recapturas para los hallazgos levantados. Revisión visual final: comparación de grilla desktop, ambas grillas móviles y lector de proyecto; evaluación previa de Home desktop/mobile e Info con desviaciones Vogel autorizadas. Los43 checks de producción final pasan después de todas las correcciones.

Esta aprobación cierra el alcance local de diseño y funcionalidad; conserva las limitaciones de dispositivo físico y envío real de formulario, y no representa publicación.
