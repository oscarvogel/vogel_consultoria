# Home: siete capítulos — 2026-10-04

Implementación local autorizada de la home de Vogel Consultoría. Conserva el shader azul continuo, navbar liquid glass, Bricolage Grotesque + DM Sans, CTA ámbar, scroll nativo y contenido comercial existente. El manual de marca gobierna posicionamiento, tono, logo y paleta; la pareja tipográfica es una decisión explícita del usuario para esta web. `DESIGN.md` recoge las reglas actuales y `.impeccable/design.json` extiende sus tokens. Este documento es el brief y registro de la superficie, no una plantilla para páginas interiores.

## Secuencia y transferencia visual

| Capítulo | Composición y propósito | Transferencia al siguiente |
| --- | --- | --- |
| 01 · Intro | Titular protagonista, diagnóstico y casos; SVG abstracto de módulos, conexiones y contexto compartido. | La conexión deja de ser una idea decorativa y se convierte en una pregunta sobre datos dispersos. |
| 02 · El problema | Introducción editorial y cuatro fricciones numeradas, sin escenario fijado ni repetición de ilustraciones. | «Un mismo registro. Un contexto compartido.» abre la demostración operativa. |
| 03 · Caso destacado | Registrar → Revisar → Decidir. Capturas reales del sistema forestal, datos ficticios identificados y acceso a las imágenes completas. | La evidencia demuestra el mecanismo que las capacidades explican después. |
| 04 · Capacidades | Ordenar con módulos, Conectar con red horizontal, Automatizar con flujo y Decidir con dashboard. Diez enlaces compactos de servicio. | Los recursos y proyectos aportan contexto; el proceso explica cómo empezar. |
| 05 · Cómo trabajamos | Diagnóstico, Diseño, Implementación y Resultados sobre línea horizontal; dos columnas en tablet, vertical en móvil. | El método encuentra un responsable concreto en Oscar. |
| 06 · Nosotros | Oscar, +25 años, CV, PyFE y formación aplicada; capacidades y trayectoria en details cerrado. | Confianza profesional antes de pedir el contacto. |
| 07 · Contacto | Diagnóstico por email, WhatsApp, formulario existente y explicación de qué conversar. | Cierre con una acción clara y canales disponibles. |

Clientes se integran después de Conectar; capacitación después de Decidir. FEMAG, desarrollo web y recursos cierran Capacidades como evidencia secundaria. Los details son nativos, cerrados por defecto en escritorio y móvil, y conservan teclado/tacto. Los logos mantienen procedencia, proporciones y destinos; no se sustituyen por marcas inventadas.

## Movimiento, lectura y responsive

`useHomeMotion.js` separa home de la coreografía compartida de interiores. Hero, Problemas y Servicios recorren el flujo normal. Sólo forestal admite pin desde 1024×800, con movimiento permitido y espacio suficiente bajo la navbar más 92px. Si no cabe, se usa el documento estático. El track de 240svh existe sólo con la mejora activa; el escenario tiene altura acotada y tres estados reversibles. Las pantallas inactivas usan `aria-hidden` e `inert`; resize y desmontaje restauran lectura y estado.

Tablet, móvil, reduced motion y fallo de GSAP muestran las tres imágenes en flujo. En móvil, capturas de hasta 380px de alto con acceso a la versión completa. El dashboard fijado se recorta desde arriba; la captura completa sigue disponible. Conexiones y líneas se animan desde 768px si está permitido, sin ocultar contenido esencial. No hay snap, desplazamiento horizontal impuesto ni nuevos pins en otros capítulos.

La base azul sigue siendo un único canvas; home mantiene neutral el ambiente. Respaldos navy radiales locales con `ellipse closest-side` desvanecen sus bordes detrás de texto, sin plano global ni cambio del shader. El flotante WhatsApp se oculta en home a ≤400px de ancho o ≤799px de alto y cuando Contacto es visible; el CTA del cierre permanece disponible.

Oscar no tiene todavía retrato auténtico. La composición editorial queda completa sin fotografía ni placeholder. La prop opcional `portraitSrc` acepta el archivo real futuro; no se genera un rostro sustituto.

## Línea base y evidencia local

La [línea base](BASELINE_CAPITULOS_2026-10-04.md) registra la home previa; su copia de archivos está en `C:/Users/roman/AppData/Local/Temp/vogel-capitulos-baseline-2026-10-04/`. Las capturas y reportes de esta pasada permanecen fuera de Git:

- UI: `C:/Users/roman/AppData/Local/Temp/vogel-capitulos-2026-10-04/ui/`.
- Narrativa: `C:/Users/roman/AppData/Local/Temp/vogel-capitulos-2026-10-04/narrative/`.
- Recorrido: `C:/Users/roman/AppData/Local/Temp/vogel-capitulos-2026-10-04/scroll/`, con `.webm` de scroll nativo adelante/atrás, `validation.json` y `200-percent-equivalent-reflow.png`.

La ronda UI cubre 1440×1000, 1199×900, 768×1024, 390×844, 320×844 y 1440×720. La verificación automatizada previa a la corrección final registró ausencia de overflow e imágenes rotas, un canvas, estados de formulario simulados y fallback en tamaños no elegibles. La suite narrativa verificó un solo pin en home elegible, estados 0 → 1 → 2 → 1 → 0, inert de pantallas inactivas y las rutas interiores. Build, contratos y contraste sólido pasaron antes de la última corrección visual. Después de las correcciones, `npm run build`, `npm test`, `npm run test:ui` en seis tamaños y `npm run test:narrative:behavior` volvieron a pasar. La suite narrativa final también pasó: progresión, reversibilidad, viewports, reduced motion, 15 rutas interiores, canvas único y limpieza. `npm run test:contrast` volvió a pasar sus 15 pares sobre superficies sólidas. `git diff --check` quedó limpio al finalizar la implementación.

El finish reviewer pidió corregir respaldos radiales, la superposición del flotante en tamaños pequeños y la validez de las capturas de imágenes. Las correcciones se agruparon y se recapturaron los seis tamaños. El reviewer emitió PASS para los tres hallazgos previos: respaldos radiales, flotante WhatsApp e imágenes. Ese veredicto puntúa la resolución de esa lista; no certifica rendimiento ni todas las rutas.

## Límites de QA y entrega

Chromium con viewports emulados y tacto sintetizado; sin dispositivo físico ni Safari. El reflow adicional a 720×500 representa el espacio equivalente a 200% de un escritorio 1440×1000 y no mostró overflow; no usa el control real de zoom del navegador. El contraste de tokens cubre superficies sólidas, no todos los frames del shader ni navbar transparente; las capturas no certifican FPS. El formulario usa respuestas de prueba de éxito/error, sin enviar consultas reales ni comprobar la entrega externa de Web3Forms. Las capturas muestran el build local, no producción. El retrato real sigue siendo dependencia de contenido.

Trabajo local revisable, sin commit, push ni publicación. Se preservan cambios locales anteriores de otras superficies. El historial de correcciones y logos dentro de `DESIGN.md` conserva su evidencia, pero las reglas de home anteriores quedan sustituidas por las de capítulos.
