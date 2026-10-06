# Rediseño institucional Vogel — entrega local

Fecha: 2026-10-03 · Rama: `codex/redisenio-institucional-vogel` · Preview: http://127.0.0.1:5177/

## Dirección implementada

El sitio institucional ahora recorre la propuesta de Vogel como una secuencia editorial: hero tipográfico, problemas y soluciones, caso forestal en tres etapas, servicios, proyectos, metodología, capacitación, recursos, credenciales y contacto. La navegación flotante mantiene «Agendar diagnóstico» como conversión principal y el portal como acceso externo secundario.

La aplicación sigue en Vue 3, Vite 5 y Tailwind 3; React se incorpora solo como isla para el componente TSX. El fondo es el `ShaderBackground` copiado desde el prompt oficial de [21st.dev](https://21st.dev/@sifan.s.f.zhao/components/waves-shader), en `src/components/ui/waves-shader.tsx`. Se conserva su shader WebGL, dominio deformado, mezcla perceptual, grano, configuración y ciclo de recursos. Se adapta la paleta de cuatro pasos a los azules oficiales de Vogel, se activa el modo de cursor push con amplitud contenida y se hace regresar a neutral tras 850 ms sin movimiento. Un canvas fijo se monta una vez por documento institucional y permanece detrás de todo el contenido mientras se desplaza; no hay una instancia por sección. Con movimiento reducido muestra un cuadro estático y en caso de fallo de WebGL conserva el fondo CSS. El ámbar queda reservado para acciones y estados. El título usa Bricolage Grotesque variable y el cuerpo DM Sans, ambas fuentes locales con sus licencias SIL OFL incluidas en `public/fonts/`. No se carga Google Fonts.

GSAP y ScrollTrigger sostienen la entrada del hero, reveals editoriales y el recorrido forestal fijado en escritorio. El progreso sigue los cuatro pasos metodológicos. Móvil, viewport corto y `prefers-reduced-motion` conservan el flujo vertical; no se captura el scroll nativo. Cada página institucional comparte capítulos y movimiento con fallback visible.

La home integra nueve servicios, FEMAG identificado como «en desarrollo» y ocho proyectos web. Se agregaron las páginas publicadas de mantenimiento de equipos e integraciones con WhatsApp al catálogo, navegación, entradas Vite y descubrimiento. Automatizaciones ARCA comparte tokens y fuentes; Recursos mantiene lectura editorial y checklist; Encuesta conserva Google Forms y ofrece abrirlo en otra pestaña.

## Contenido, marca y límites

| Elemento | Tratamiento |
|---|---|
| Marca | Logo, posición, tono y colores siguen el manual. Bricolage Grotesque reemplaza Syne como fuente de display según el plan aprobado; DM Sans se conserva para cuerpo/UI. |
| Caso forestal | Interfaz real con datos de demostración identificados. No se atribuyen resultados económicos a clientes. |
| FEMAG | Proyecto señalado como sistema a medida en desarrollo; no se inventan resultados. |
| Métricas de IA | Se retiraron `−40 %` y `×3` por falta de respaldo. |
| Portal y encuesta | El portal continúa externo. Se mantienen los destinos publicados de encuesta/campaña. |
| Contratos | Se conservan URLs, anchors, metadatos, formularios y eventos analíticos existentes; sin cambios en APIs. |

## Evidencia visual

La línea base publicada/local está descrita en [estado-inicial-sitio-2026-10-03.md](estado-inicial-sitio-2026-10-03.md); la comparación por viewport, en [comparativa-inicial-final-2026-10-03.md](comparativa-inicial-final-2026-10-03.md). Las capturas de portada, 16 rutas, recorrido, caso forestal y shader se conservan localmente bajo `docs/capturas/` y se excluyen de Git por tamaño. Los viewports revisados incluyen 1440 × 1000, 768 × 1024 y 390 × 844.

### Procedencia del caso forestal

Fuente: `registros_produccion/registro_produccion/frontend`, commit `8d6ab7bd217eeda01d61eb404ea49d5b57ef77a4`. Las vistas de campo, revisión y dashboard se capturaron con fixtures mock el 2026-10-03 usando `scripts/capture/forest-fixtures.mjs`, adaptado en Vogel desde `frontend/scripts/docsCapture.mjs`. Los valores, personas y registros son ficticios. El sistema fuente no fue modificado.

## Verificaciones

### Fondo Waves actualizado

El shader copiado usa los cuatro pasos `#0B2035`, `#1E5FA8`, `#196ECF` y `#8BC5FF`. El montaje compartido se invoca desde cada entrada institucional (home, servicios, IA, automatizaciones, recursos y encuesta), así cada documento tiene exactamente un canvas fijo continuo. El modo push desplaza el mismo campo de color y lo devuelve a neutral después de 850 ms inactivo; movimiento reducido congela la imagen y desactiva el puntero. Las capturas asociadas quedan en el checkout local, fuera de Git.

| Comprobación | Resultado |
|---|---|
| `npm run build` | Correcto; Vite generó las entradas institucionales, fuentes y chunks de ScrollTrigger. |
| `npm test` | Correcto; 11 grupos existentes cubren rutas, schema, catálogo, SEO, analítica, recursos, portal y CV. |
| `npm run test:contrast` | Correcto; 16 pares oficiales y navbar compuesta cumplen 4,5:1. |
| `git diff --check` | Correcto; sin errores de whitespace. Git mostró avisos informativos de conversión CRLF en archivos del workspace. |
| Rutas en Chromium | 48 observaciones: 16 rutas en 1440 × 1000, 768 × 1024 y 390 × 844; todas respondieron 200, con H1, imágenes cargadas y sin overflow horizontal ni errores de consola. Las capturas de cada ruta se guardan en `rutas-escritorio/`; portada capturada en los tres tamaños. |
| Fondo Waves actualizado | 7 entradas representativas respondieron 200; cada documento tuvo un canvas WebGL listo, `position: fixed`, sin overflow horizontal ni errores de página. La home quedó comprobada en 1440 × 1000, 768 × 1024, 390 × 844 y movimiento reducido. Reporte y capturas: `capturas/fondo-waves-2026-10-03/`. |
| Caso forestal | El pin de escritorio activó consecutivamente captura, revisión y dashboard con paso/imagen correspondientes. La duración calculada en la sesión fue 1600 px. |
| Movimiento reducido | Sin pin y con las 3 etapas visibles. |
| Menús | Escritorio: teclado Enter/Escape y foco devuelto. Móvil: apertura por toque, cierre Escape y foco devuelto. |
| Anchor `#casos` | Enlace «Ver casos» actualiza el hash y desplaza al capítulo por debajo de la cabecera. |
| Galería | «Proyectos siguientes» avanzó 407 px; «Proyectos anteriores» volvió al inicio con 4 px de tolerancia de scroll. |
| Formulario | Con respuestas interceptadas localmente: vacío enfoca nombre; carga expone `aria-busy` y botón deshabilitado; éxito anuncia y enfoca el estado; error muestra alerta y permite reintentar. No se enviaron datos a Web3Forms. |
| Detector Impeccable | 52 hallazgos de nivel advisory y 0 no-advisory. Señala tamaños tipográficos frente al ramp resumido del frontmatter, más dos stops de máscara/superposición cromática del visual forestal y un radio local de 6px. El ramp fluido quedó explicado en el contrato; no informa bloqueos. Detalle: `verificaciones/impeccable-final.json`. |

El reporte reproducible con ruta, viewport, fuente computada, estado de imágenes, errores y flujos está en `capturas/fase-final-2026-10-03/visual-qa.json`. El envío real de contacto, el backend forestal y el formulario externo Google no se probaron. Las capturas y comprobaciones locales no sustituyen una verificación en producción. No se publicó el sitio.

### Actualización del shader después de revisar la referencia

Se obtuvo el fuente mediante **Copy prompt** del componente de 21st.dev y se integró como isla React/TSX dentro del sitio Vue. El reporte nuevo `capturas/waves-shader-21st-2026-10-03/capture-report.json` registra una sola instancia WebGL y anchos sin overflow en 1440 × 1000, 768 × 1024 y 390 × 844, además de cursor activo, retorno neutral y movimiento reducido. La portada se verificó visualmente en las tres dimensiones. `npm run build` pasa.

La pasada automatizada de QA de 16 rutas con el shader nuevo se interrumpió porque el render WebGL del Chromium headless tardaba alrededor de 15 segundos por captura. Por eso los resultados amplios de rutas, formularios y galería de la tabla anterior pertenecen a la iteración previa del fondo Vue; no se presentan como validación de esta integración TSX.

## Reproducir

```powershell
npm ci
npm run dev -- --host 127.0.0.1 --port 5177
npm run build
npm test
npm run test:contrast
node scripts/capture/site-visual-qa.mjs
```

El capturador de sitio usa Playwright local cuando está instalado y, en esta estación, el runtime de Playwright de Codex. La captura forestal funciona aparte y usa fixtures; no necesita backend ni base de datos.
