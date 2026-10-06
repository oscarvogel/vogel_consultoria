# Coreografía narrativa — 3 de octubre de 2026

Entrega local sobre el lenguaje visual aprobado. La línea base está en [coreografia-linea-base-2026-10-03.md](coreografia-linea-base-2026-10-03.md), con hashes de los archivos previos y doce capturas de la home. Las capturas y el video se conservaron en el checkout local y se excluyen del commit para mantener liviano el repositorio. No representa el sitio publicado ni una grabación de sus animaciones anteriores.

Se aplicó la prioridad acordada: Anti UI Slop, Impeccable, Taste, Emil Design Engineering, Vercel Web Design Guidelines y UI/UX Pro Max. La revisión se centró en conservar el contrato visual, dar tiempo de lectura, evitar cifras inventadas, mantener controles accesibles y verificar la mejora progresiva. El manual de marca sigue siendo la referencia de identidad; esta pasada no propone otra dirección visual.

## Cambios y motivo

| Antes | Después | Motivo |
|---|---|---|
| Hero con entrada de letras | Capítulo reversible: datos separados, conexiones trazadas, información ordenada | Desarrollar la promesa comercial durante el scroll |
| Cuatro problemas en una lista | Texto en flujo y escenario compartido que se transforma | Relacionar cada fricción con la capacidad que la resuelve |
| Dos servicios destacados y catálogo posterior | Ordenar, Conectar, Automatizar, Decidir; diez enlaces compactos | Conservar todos los destinos con una progresión por resultado |
| Secciones sucesivas | Entrada de título y cierre del artefacto dentro del recorrido existente | Hacer perceptibles los cambios de capítulo |
| Shader independiente del contenido | Un controlador de presentación ajusta tres uniforms en el render loop existente | Acompañar el relato con variaciones ambientales contenidas |
| Páginas internas con revelaciones genéricas | Introducción y secuencia central específica; recursos y encuesta sin pins | Extender la narrativa sin dificultar lectura ni completar tareas |

## Recorridos

- **Home:** el Hero agrega un recorrido fijado de `160svh` (1,6 alturas de viewport), sin capturas de producto. Mantiene titular, bajada, ambos CTA y el salto «Explorar soluciones». Su geometría SVG es decorativa: no contiene cifras ni resultados ficticios.
- **Problemas:** cuatro pasos de `80svh`. Información dispersa → vista de gestión → flujo supervisado → asistencia con límites. La transición ocupa aproximadamente el último 30 % de cada intervalo medido; el resto permite leer.
- **Caso forestal:** conserva sus tres momentos, textos, imágenes, etiquetas y crossfade. Solo comparte entrada, cierre y clearance bajo la navbar.
- **Servicios:** cuatro pasos de `80svh`; incluye sistemas, mantenimiento, web, WhatsApp, ContaFlow, procesos, ARCA, dashboards, talleres e IA. La última escena reutiliza la captura forestal y la identifica como interfaz real con datos de demostración.
- **Ocho servicios internos:** introducción de `100svh` cuando cabe completa; escenario lateral para problema, capacidad y entregable, con pasos de al menos `80svh`. Beneficios opcionales y ejemplos de API siguen entre problemas y capacidad, en su orden previo.
- **IA:** tarea, asistencia, supervisión y aplicación. Conserva los cinco problemas originales, el enfoque de negocio y el asset del asistente. Se retira la afirmación general no respaldada sobre empresas que no usan IA y decisiones «más lentas, más caras y menos precisas».
- **ARCA:** planilla, ejecución, revisión y evidencia reemplazan el tablero de cuatro pasos. Planes, seguridad, alcance, FAQ y enlaces mantienen su flujo normal.
- **Proyectos, metodología, capacitación, recursos, nosotros y contacto:** transiciones dentro de sus límites actuales, sin nuevos pins ni espacios vacíos. Los artículos nunca fijan el cuerpo. La encuesta conserva el formulario en el primer recorrido y usa aperturas y cierres breves.

Las aperturas usan `top 95% → top 55%`, y los cierres `bottom 80% → bottom 40%`: aproximadamente `40svh` dentro de los límites existentes. El control es nativo, con `scrub: 0.6`, sin snap ni interceptar la rueda.

## Shader e identidad

`src/lib/sceneController.js` expone internamente `setScene({ intensityDelta, offsetXDelta, offsetYDelta })`. Recorta valores no válidos y limita intensidad a ±0,02 y offsets a ±0,015. El renderer React lee el estado en su RAF: no se remonta ni se recrea WebGL al cambiar de capítulo.

El preset original conserva colores, brillo, contraste, grano y seed. La interpolación exponencial usa una constante de 267 ms: alcanza aproximadamente el 95 % del objetivo en 800 ms, a una cadencia normal de frames. Hero y contacto son neutrales; problemas incrementa la energía por paso, forestal permanece estable y servicios cambia suavemente por momento. Móvil y movimiento reducido usan objetivos neutrales. La respuesta al cursor y su retorno por inactividad permanecen en el renderer existente.

No se agregaron overlays globales, filtros CSS ni fondos de sección. Se mantienen Bricolage Grotesque, DM Sans, navbar transparente y su desvanecimiento superior. El Hero adapta ligeramente su escala y separación solo en la variante fijada, para que texto y CTA quepan completos.

## Mejora progresiva y limpieza

Los capítulos fijados requieren ancho ≥1024 px, alto ≥800 px y que la escena completa quepa debajo del borde de la navbar más 92 px. Si no cabe, queda en flujo normal. Móvil, pantallas cortas y movimiento reducido no reciben la altura artificial de los pasos.

`useSiteMotion.js` coordina el módulo `narrativeMotion.js`. Los elementos con dueño de capítulo quedan fuera de las revelaciones y de SplitText genéricos. Fuentes, imágenes y componentes asíncronos solicitan recálculos. Los movimientos internos de ScrollTrigger no se interpretan como capítulos nuevos. Al cambiar de tamaño se vuelve a evaluar el ajuste de la escena; al desmontar o reducir movimiento se retiran pins, callbacks, observadores, clases y estilos de presentación, y el shader vuelve a neutral.

Los anchors siguen siendo enlaces nativos. La restauración inicial de un fragmento se hace después de medir los pins y no se repite en cada resize. El scrollspy de la navbar selecciona la sección más cercana en el orden real del documento.

El pin del Hero se mide antes que los posteriores mediante `refreshPriority` y ordenación de ScrollTrigger. Esto corrige una colisión detectada en 1199×900: el caso forestal calculaba su inicio sin sumar el espacio del Hero. La regresión comprueba que su escena permanece fuera del viewport durante todos los estados de Problemas, en ambos tamaños de escritorio.

## Evidencia y reproducción

- `npm test`: contenido, entradas HTML, descubrimiento, navbar, analytics, email, recursos, caso forestal, portal y CV.
- `npm run build`: todas las entradas institucionales.
- `npm run test:contrast`: quince pares de tokens sobre superficies sólidas. **No certifica la navbar transparente ni todos los frames del shader.**
- `npm run test:narrative`, con Vite en `127.0.0.1:5177`: progresión y reversibilidad, CTA, clearance, pins, cambios de viewport y movimiento reducido, quince rutas internas, canvas único y desmontaje de un scope aislado. Requiere Playwright instalado o el runtime local de Codex.
- `npm run test:narrative:behavior`: anchors y recarga, foco, menú táctil, Escape, clic exterior, formulario con respuestas locales y fallbacks de GSAP/WebGL.
- `node scripts/capture/narrative-video.mjs`: recorrido de escritorio con shader activo, avance, pausas de lectura abreviadas y retorno al capítulo de servicios.

La evidencia visual local está en `docs/capturas/coreografia-2026-10-03/`: comparaciones en `before/` y `after/` para 1440×1000, 1199×900 y 390×844; el video y registro están en `video/`. Se conserva en el checkout y se excluye de Git por tamaño. Las comparaciones estáticas usan movimiento reducido para registrar el mismo punto de lectura; las adicionales documentan estados del recorrido animado.

### Resultado de la validación — 4 de octubre

Los cinco comandos de prueba/build anteriores pasaron, junto con `git diff --check`. Los registros locales `after/validation.json` y `after/behavior.json` documentan los tres viewports, quince rutas internas, estados reversibles, limpieza, anchors, foco, menú y estados del formulario con respuestas interceptadas localmente: no se envió una consulta real. Estos archivos de evidencia también se excluyen del commit.

La grabación dura aproximadamente 65 segundos, avanza por los capítulos y vuelve a Servicios. El registro confirma un canvas y un programa WebGL, deltas dentro de sus límites y brillo, contraste, grano y seed constantes. El renderer informado fue ANGLE con AMD Radeon RX 6600 y Direct3D11. Se revisaron las capturas de los estados de escritorio y un frame del caso forestal extraído del video; esto permite evaluar composición, pero no certifica FPS ni todos los frames.

## Límites de la evidencia

Las capturas estáticas no prueban fluidez ni contraste en todos los frames. La grabación controlada en Chromium headless sirve para revisar composición, secuencia y duración relativa; no mide FPS ni experiencia en todos los equipos. Las pausas abreviadas de la grabación no obligan al visitante a avanzar: el ritmo de lectura sigue bajo su control.

El runner y la grabación utilizan Chromium completo en modo headless y desactivan la amortiguación de stalls del ticker de GSAP dentro de sus contextos de navegador. Así los retrasos de captura no prolongan artificialmente el scrub durante la inspección. La configuración del sitio permanece intacta; esta evidencia no sustituye una revisión de rendimiento interactiva en distintos equipos.

## Comparación guardada localmente

La carpeta local `docs/capturas/coreografia-2026-10-03/` contiene las comparaciones antes/después de Hero y Servicios a 1440×1000, 1199×900 y 390×844, además de estados intermedios de los capítulos. No se versionan ni se adjuntan al repositorio.

Las figuras de proceso y assets de IA son esquemas o visuales conceptuales. Las capturas forestales conservan datos de demostración; no representan resultados de un cliente. Esta pasada no modifica contratos, datos del sistema forestal ni el portal externo.

La entrega queda en el checkout local para revisión. Commit, push y publicación corresponden a etapas posteriores.
