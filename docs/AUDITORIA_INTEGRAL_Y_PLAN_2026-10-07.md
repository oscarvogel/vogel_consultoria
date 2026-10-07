# Auditoría integral de Vogel Consultoría

**Fecha:** 7 de octubre de 2026
**Alcance:** Home portfolio, destinos editoriales, lectores de proyectos, activos, animación, accesibilidad, rendimiento, seguridad, SEO, pruebas y preparación de publicación.
**Resultado:** la nueva estructura funciona y mantiene una identidad consistente; antes de considerar el sitio completo y listo para publicar, conviene cerrar un desborde visible en fichas, remediar vulnerabilidades, endurecer el flujo del formulario y ampliar la validación responsive y de navegación.

> **Estado al 7 de octubre de 2026:** las fases 0 a 6 tienen implementación local. El registro de evidencia, los defectos conocidos y los pendientes externos están en [RELEASE_GATE_2026-10-07.md](RELEASE_GATE_2026-10-07.md). El candidato pasa `npm run release:gate`, pero no se declara publicable hasta cerrar los pendientes externos.

## Contexto y límites de la revisión

La auditoría se realizó sobre el árbol local de `redesign/core-a`, con `HEAD` en `4f351f3`. El árbol ya tenía cambios staged, unstaged y archivos sin seguimiento, incluidas eliminaciones amplias del sistema espacial previo. Esos cambios se preservaron. Por eso, las observaciones describen el estado local visible, no afirman que coincida exactamente con el último commit ni con producción.

Se inició el servidor local en `http://127.0.0.1:5198/` y se inspeccionaron visualmente Home, Soluciones, Recursos, Estudio, Contacto y lectores Forestal/AN Asociados en el navegador integrado, en su viewport disponible de aproximadamente 1265 × 900. Las capturas de esta revisión se inspeccionaron durante la sesión, pero no se guardaron como archivos del repositorio. No se inspeccionó producción, no se enviaron formularios ni se siguieron enlaces externos.

El navegador integrado disponible no permitió ajustar el viewport en esta revisión. Por eso las conclusiones visuales de móvil y otros tamaños son pendientes, aunque el script existente `scripts/test-portfolio-browser.mjs` contempla varios de ellos. Ese script lanza Chromium headless y guarda archivos de captura; no se ejecutó para respetar la revisión en el navegador elegido por el usuario. Tampoco se ejecutaron Lighthouse, axe, una prueba física en móviles/Safari ni un análisis de cabeceras del servidor productivo.

## Fase 0 ejecutada — baseline Core-A

Se tomó el árbol local completo como candidato, tal como se acordó. El inventario antes y después de las pruebas conservó **219 entradas**: **104 eliminaciones staged**, **41 modificaciones tracked unstaged** y **74 archivos untracked**. Las 104 eliminaciones staged corresponden al sistema espacial anterior: sus documentos, assets, componentes, módulos, estilos y pruebas/capturas. Las 41 modificaciones abarcan shell, páginas institucionales, marca, configuración de build y pruebas del sitio.

Los 74 archivos nuevos se clasifican en: 13 entradas HTML (cuatro destinos/alias y nueve proyectos), 25 derivados/procedencia de proyectos, 12 componentes Vue de Home y destinos, tres módulos de datos/motion, seis scripts de QA/preparación, seis documentos/artefactos de diseño y QA, y nueve elementos de una fuente Ventura. Esta clasificación es informativa: no se movió ni excluyó ningún archivo.

La fuente de verdad acordada para la siguiente fase es este árbol completo; `HEAD` solo es su referencia histórica. Se mantuvieron iguales las 104 eliminaciones staged y las 41 modificaciones; los comandos de build no añadieron cambios rastreados. `vite.config.js` define Home, los cuatro destinos, el alias Info, nueve fichas de proyecto y páginas de servicios/recursos existentes. No se encontraron archivos de configuración para un proveedor de despliegue o CDN; la única configuración de servidor versionada encontrada es `public/.htaccess`, así que host, cabeceras y reglas reales de producción quedan pendientes de verificar.

Hay nueve elementos no rastreados en `src/assets/font/ventura/` (incluido el ZIP). Su archivo de licencia indica uso personal y exige licencia comercial; no hay referencias a Ventura dentro de `src/` y la build inspeccionada no la incluye. Se conservan localmente, pero quedan fuera de cualquier uso/comercialización hasta verificar la licencia.

## Estado por superficie

| Superficie | Estado observado | Nota |
|---|---|---|
| Home / carrusel | Bien encaminada | Rail y escenario de proyectos claros, V de marca presente, imágenes de proyectos a color, reloj y estados carrusel/grilla. |
| Grilla | Estructura presente | La prueba automatizada existente comprueba títulos, imágenes y desbordes en cinco tamaños, pero no se ejecutó en esta auditoría. |
| Soluciones | Contenido y enlaces presentes | Índice editorial con rutas a fichas de servicios existentes. |
| Recursos | Contenido publicado presente | Tres guías con metadatos y enlaces reales. |
| Estudio | Estructura editorial presente | Método, perfil de Oscar y FEMAG señalado “En desarrollo”. La jerarquía funciona; el ajuste de columnas en tablet/móvil requiere comprobación visual actual. |
| Contacto | Flujo entendible | Canales visibles, formulario con etiquetas, estados de error/éxito y foco posterior al envío. No se probó el envío real. |
| Fichas de proyecto | Problema visible | En Forestal y AN Asociados se observó una barra de desplazamiento horizontal al pie. El lector de proyecto debería ajustarse al ancho disponible. |
| Contenido de proyectos web | Mejorable | Los datos usan descripción y contexto genéricos; las capturas prueban la interfaz, pero la ficha explica poco el problema, alcance y relación de cada proyecto con Vogel. |

## Hallazgos priorizados

| Prioridad | Hallazgo | Evidencia y efecto |
|---|---|---|
| Alta | Vulnerabilidades altas en dependencias | `npm audit` reportó 16 vulnerabilidades (13 altas, 3 moderadas). `npm audit --omit=dev` reportó 5 altas en el árbol no-dev: `vue`, `@vue/server-renderer`, `nanoid`, `postcss` y `source-map-js`. El informe de npm no demuestra por sí solo que cada ruta sea alcanzable en producción; hay que actualizar, revisar el lockfile y volver a auditar. |
| Alta | Desborde horizontal en fichas | La barra apareció visualmente en los lectores de Forestal y AN Asociados. El lector aplica un margen lateral al hero y escala imágenes al 100%; el origen exacto debe confirmarse midiendo el elemento que supera el viewport antes de ajustar CSS. Puede ocultar contenido y degradar el recorrido táctil. |
| Alta | Exposición a abuso del formulario | `useContactForm.js` envía directamente a Web3Forms y recibe `VITE_WEB3FORMS_KEY` desde el cliente. Una clave Vite no es secreta una vez publicada. No se confirmó qué límites o filtros ofrece la cuenta de Web3Forms; validar rate limiting, protección anti-spam, restricciones de origen y política de retención antes de producción. No se envió ningún formulario. |
| Alta | Fuente Ventura con licencia no comercial | El ZIP y los archivos extraídos indican uso personal, no comercial, salvo compra de licencia. No se referencian en `src/` y no aparecen en la build; conservarlos en el árbol candidato no autoriza su uso comercial. Verificar licencia antes de importarlos o incluirlos en una entrega. |
| Media | Controles de seguridad del servidor no están versionados en el proyecto | `public/.htaccess` solo redirige `/ia.html`; no declara CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy` ni `Permissions-Policy`. Esto confirma una carencia en la configuración versionada, no que producción carezca de esas cabeceras: el CDN/host puede agregarlas fuera del repositorio. |
| Media | La rueda vertical se captura dentro del carrusel | `HomeStage.onWheel` llama `preventDefault()` para puntero fino y convierte delta vertical en desplazamiento horizontal, incluso al llegar al inicio o al final. Es coherente con una galería horizontal, pero debe validarse con teclado, trackpad y usuarios que esperan desplazamiento vertical; una alternativa es limitar la captura o dejar que la rueda continúe en los límites. |
| Media | Descripciones de fichas demasiado genéricas | `src/data/projects.js` construye textos como “Proyecto web institucional de…” y “Capturas del sitio público…”. No inventan resultados, pero no alcanzan para explicar por qué el trabajo es relevante ni distinguir un proyecto del siguiente. Completar solo con información verificada y atribución autorizada. |
| Media | Descubrimiento SEO incompleto | `public/sitemap.xml` incluye páginas institucionales y artículos, pero no enumera los nueve lectores `/proyectos/<id>/`. Además, la fecha de Recursos figura como 2026-06-04 pese a que la superficie está actualizada en el estado local. Revisar sitemap, canonical, `lastmod`, títulos y metadatos de cada ficha. |
| Media | Documentación de rutas no coincide con el producto actual | El código dirige `/info/` a Estudio y la navegación visible usa `/estudio/`; el manual de marca todavía documenta `/info/` como ruta canónica. Actualizar manual y cualquier briefing heredado, conservando `/info/` como alias si sigue siendo necesario. |
| Baja | Higiene del diff | `git diff --check` detectó 15 líneas con espacios finales en 15 HTML modificados y avisos de normalización LF/CRLF en el árbol. No bloquea la ejecución; conviene limpiarlo en una fase de consolidación, sin reescribir archivos ajenos al alcance. |

## Fortalezas verificadas

- La Home y los destinos comparten navegación y estado de portfolio; `HomeStage` sigue montado mientras se visitan destinos y proyectos.
- Las rutas son enlaces HTML reales y la app sincroniza History API, Atrás/Adelante y rutas heredadas. Las fichas se resuelven por identificador, no se reutiliza una ficha genérica de servicios.
- La V oficial, la paleta carbón/crema/ámbar y las tipografías indicadas en el manual están presentes en el sistema actual.
- La tipografía activa de titulares es Archivo Variable y la de cuerpo es Chillax; el paquete Ventura no se usa en código ni en la build observada.
- Las capturas de proyecto tienen derivados WebP y metadatos de procedencia en `public/projects/provenance.json`; los derivados de los proyectos suman aproximadamente 3,32 MB en disco (24 archivos, no equivalente al peso descargado por visita).
- El caso Forestal conserva imágenes, texto accesible y los avisos “Interfaz real · datos de demostración” y “Las cifras no representan resultados de un cliente”.
- El menú móvil tiene control de apertura, diálogo, Escape, foco inicial y contención de Tab en el código. Los enlaces externos observados usan `rel="noopener noreferrer"`.
- El consentimiento analítico arranca con almacenamiento denegado y ofrece aceptar medición o mantener solo lo necesario. Revisar su presentación y documentación de privacidad junto con la política legal correspondiente.

## Verificaciones ejecutadas

| Comando | Resultado |
|---|---|
| `npm test` | Pasó la suite del sitio, incluidos contratos estáticos de destinos, datos, recursos, navbar, analítica y entradas Vite. |
| `npm run build` | Pasó; Vite generó la compilación multipágina. |
| `npm run test:contrast` | Pasó: 15 pares de tokens sólidos superan 4.5:1. El script excluye fondos compuestos/shader; no es una certificación WCAG integral. |
| `npm audit --json` | 16 avisos: 13 altos y 3 moderados. |
| `npm audit --omit=dev --json` | 5 avisos altos en el árbol no-dev. |
| `git diff --check` | Detectó 15 líneas con espacios finales en 15 HTML ya modificados; también mostró avisos de conversión LF/CRLF. |
| Recorrido visual integrado | Home, cuatro destinos, Forestal y AN Asociados observados en escritorio. Se confirmó la barra horizontal en las fichas. |

`npm run test:portfolio` queda pendiente: el script abre Chromium headless y escribe capturas en `docs/capturas/`; no se usó porque la auditoría visual se mantuvo en el navegador integrado elegido para esta sesión. No afirmar que pasaron los cinco viewports, navegación completa o reduced motion hasta ejecutar ese recorrido de forma autorizada y revisar sus capturas actuales.

## Plan por fases

### Fase 0 — Congelar el baseline y definir publicación (completada)

Se registró el árbol local completo como candidato, se contabilizaron staged/unstaged/untracked, se reconocieron las eliminaciones espaciales como parte de la nueva dirección Core-A y se enumeraron las entradas multipágina. No se alteró el staging ni se descartaron archivos. Queda pendiente identificar el proveedor/CDN y confirmar la configuración de producción antes de publicar cambios de seguridad.

**Salida:** baseline local identificable y preservado; los puntos externos que el repositorio no permite resolver quedaron explícitos para la fase de seguridad y publicación.

### Fase 1 — Seguridad y privacidad (implementación local parcial)

1. Actualizar dependencias vulnerables con cambios compatibles primero; tratar los cambios mayores de Vite/Tailwind como migración separada. Volver a correr tests, build y `npm audit`.
2. Revisar la clave Web3Forms: asumir que es pública; comprobar límites de envío, dominio permitido, anti-spam, tratamiento/retención y alternativa operativa cuando falla el proveedor.
3. Validar y documentar consentimiento de analítica, política de privacidad y datos efectivamente enviados. No registrar mensajes, emails o teléfonos en GA.
4. Añadir cabeceras en la capa que realmente sirve producción; construir CSP inicialmente en modo Report-Only, revisar scripts/fontes/imágenes externas y luego aplicar una política compatible.
5. Asegurar que el servidor de desarrollo solo se exponga localmente durante QA.

**Salida:** cero avisos altos sin decisión explícita; controles del formulario y privacidad validados; cabeceras verificadas en el host real.

La primera implementación local está registrada en [FASE_01_SEGURIDAD_PRIVACIDAD_2026-10-07.md](FASE_01_SEGURIDAD_PRIVACIDAD_2026-10-07.md). El árbol de producción quedó sin avisos de `npm audit --omit=dev`; la auditoría completa conserva vulnerabilidades en herramientas de desarrollo que requieren migraciones mayores. El proveedor real, sus controles de cuenta, el receptor de reportes CSP y las cabeceras efectivas del host siguen pendientes de comprobación externa; por eso esta fase no se declara cerrada.

### Fase 2 — Layout, navegación y accesibilidad (implementada y verificada localmente)

1. Medir y corregir el overflow de los lectores en desktop, tablet y móvil; comprobar todas las imágenes, el cierre, el pie y enlaces con zoom del navegador.
2. Revalidar la política de rueda del carrusel en inicio, medio y fin, trackpad y teclado. Mantener una vía clara para mover el portfolio sin bloquear la navegación habitual.
3. Ejecutar rutas directas, recarga, hashes, Atrás/Adelante, menú móvil, estado activo, Escape y restauración de foco. Comprobar que el foco de destino quede dentro del nuevo contenido.
4. Completar revisión WCAG: orden de headings/landmarks, contraste real sobre imágenes, nombres accesibles, indicadores de foco, zoom 200–400 %, diálogo del menú, mensajes del formulario y `prefers-reduced-motion`.
5. Repetir visualmente 1440×900, 1440×700, 1920×1080, 390×844 y 360×800 con capturas vigentes.

**Salida:** sin overflow documental; recorridos por mouse, teclado y táctil comprensibles; accesibilidad revisada con herramientas y navegación manual.

### Fase 3 — Evidencia, imágenes y contenido (parcial: falta confirmar rol de Vogel y permisos de clientes)

1. Completar fichas con contexto verificado: qué problema abordaba cada proyecto, qué se construyó, qué evidencia puede mostrarse y qué datos son demostrativos. No inventar resultados, fechas, herramientas ni testimonios.
2. Validar cada captura contra su URL/procedencia y revisar crops en tarjetas, grilla y lectores. Mantener originales y sidecars; documentar permisos y retiradas cuando corresponda.
3. Medir bytes transferidos por ruta, agregar `srcset`/`sizes` cuando aporten, mantener dimensiones reservadas, prioridad solo para la primera imagen visible y carga diferida de galerías.
4. Revisar alt text según función real de cada captura; evitar descripciones duplicadas o genéricas si el texto adyacente ya comunica el mismo contenido.

**Salida:** nueve proyectos diferenciados con evidencia auténtica, texto verificado y carga de imágenes ajustada por viewport.

### Fase 4 — Refinamiento visual y movimiento (implementada y verificada localmente)

1. Ajustar proporción y encuadre de carrusel, grilla, rail, encabezados y lectores en los cinco tamaños del brief, respetando el manual de marca y sin reintroducir escenas WebGL.
2. Medir la continuidad de apertura/cierre Flip y cambios carrusel/grilla. Cancelar animaciones previas bajo interacción rápida; asegurar que el contenido siga estable si GSAP no carga.
3. Revisar el ritmo de Soluciones, Recursos, Estudio y Contacto, especialmente el método en tablet, el balance de la ficha de proyecto y la salida de cada destino.
4. Reducir movimiento con `prefers-reduced-motion`; probar también con animación deshabilitada y red lenta.

**Salida:** una sola jerarquía visual coherente, sin movimiento que retrase el acceso ni altere la lectura.

### Fase 5 — SEO, rendimiento y robustez (implementada localmente; falta medición real y cabeceras del host)

1. Incluir las fichas públicas en el sitemap si deben indexarse; corregir `lastmod` y revisar canonical, Open Graph, títulos, descripciones y datos estructurados de Home, destinos, recursos y proyectos.
2. Ejecutar Lighthouse/CrUX o medición de campo en entorno representativo; distinguir métricas locales de resultados de usuarios reales.
3. Definir presupuestos de JS/CSS e imágenes por ruta; evaluar fuentes locales, caché, compresión HTTP, LCP, INP, CLS y carga de módulos.
4. Revisar consola, errores de red, imágenes rotas, rutas 404, enlaces externos, formulario simulado, modo offline parcial y fallos de scripts de terceros.
5. Limpiar espacios finales y normalizar finales de línea solo en archivos incluidos en el cambio aprobado.

**Salida:** rutas rastreables, presupuesto de rendimiento acordado y errores funcionales visibles en controles repetibles.

### Fase 6 — Release gate (compuerta ejecutable y registro completados; publicación pendiente)

1. Ejecutar `npm test`, `npm run test:contrast`, `npm run build`, `npm run test:portfolio`, auditoría de dependencias, axe y comprobación del sitemap.
2. Revisar manualmente las capturas nuevas en todos los viewports, reduced motion, fallo de imágenes y recorrido completo Home → ficha → regreso → destino → servicio/artículo.
3. Repetir chequeos de seguridad y cabeceras sobre la URL de staging. No enviar un contacto real ni introducir datos personales en analítica.
4. Registrar defectos restantes, criterios de aceptación y evidencia de la versión candidata antes de cualquier publicación.

**Salida:** candidato publicable con evidencia trazable. Commit, push y deploy requieren autorización aparte.

## Recomendación inmediata

Empezar por **Fase 0**, porque el árbol de Git ya contiene una transición amplia entre dos direcciones de diseño, y enseguida abordar **Fase 1** junto con la corrección acotada del overflow de Fase 2. No conviene profundizar la producción visual ni ampliar contenido antes de saber qué cambios locales forman el baseline y de resolver los cinco avisos altos no-dev.
