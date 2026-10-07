# Fase 05 — Cierre editorial de la Home

Método → Persona → Perspectivas → Conversación. Base: Phase 04 y su acabado cinematográfico (`docs/SPATIAL_VISUAL_OVERHAUL.md`). **Candidata final para revisión visual, QA y eventual producción. No está publicada ni activada por defecto.**

## Principio

Hasta Evidencia la Home es inmersión; después es claridad. La segunda mitad deja de competir con el primer arco y construye criterio, confianza, humanidad y conversión, sin añadir WebGL. La regla que organiza el sistema:

> Motion explains systems. Editorial composition explains judgment.

## Activación y precedencia

`VITE_SPATIAL_PHASE_05=true` activa el cierre editorial. Implica Phase 04 y, por tanto, toda la cadena:

`PHASE_05 → PHASE_04 → PHASE_03 → NARRATIVE → CORE → base`

`.env.example` la conserva en `false`. Con la flag apagada la Home es exactamente la anterior: `ServicesSection`, `EvidenceSection`, `ProcessSection`, `AboutSection`, `SecondaryContent` y `CTASection` siguen disponibles para el modo base y para los modos laboratorio. Reiniciar Vite al cambiar flags.

Promoverla a baseline es una decisión pendiente, no hecha: ver «Recomendación».

## Estructura

**Antes (Phase 04, después del caso forestal):** Servicios (2×2 con iconos) · Evidencia («Tecnología puesta a trabajar», logos en tarjetas blancas más una segunda lista de sitios) · Proceso (4 columnas: Diagnóstico, Diseño, Implementación, Resultados) · Nosotros (sin retrato, 12 skills) · Contenido secundario (dos columnas de `<details>` cerrados) · Contacto (panel con clases Tailwind).

**Ahora (P05):**

| Sección | Componente | Anclas | Superficie |
|---|---|---|---|
| Capacidades | `CapabilityIndex.vue` | `#soluciones`, `#servicios` | navy → deep |
| Método Vogel | `MethodVogel.vue` | `#metodologia` | slate |
| Persona | `PersonChapter.vue` | `#nosotros` | navy |
| Trabajo real | `RealWork.vue` | `#clientes` | deep |
| Perspectivas | `PerspectivesSection.vue` | `#recursos`, `#charla-ia-2026` | slate |
| Conversación | `ConversationSection.vue` | `#contacto` | navy + paisaje fijo |

Los componentes están en `src/components/editorial/`, los estilos en `src/styles/editorial.css` y el motion en `src/composables/useEditorialMotion.js`. Todas las anclas anteriores se conservan.

Datos compartidos, fuente única para ambos modos: `src/data/oscar.js` (experiencia, hitos, capacidades), `src/data/capabilities.js` y `src/data/method.js`. La lógica del formulario salió de `CTASection` a `src/composables/useContactForm.js`, y los dos modos la usan.

## Decisiones

**Capacidades.** Seis filas editoriales (`border-top`, número, título grande, una línea, flecha), sin tarjetas ni grid. Sus títulos no repiten los del arco espacial (lo verifica un test). Las rutas que no caben (Mantenimiento de equipos, ContaFlow API, Automatizaciones ARCA, Talleres IA) quedan en una línea «También», así que ninguna ruta de servicio deja de ser alcanzable. Hover solo con puntero fino (título +6 px, flecha, línea ámbar); el foco por teclado da el mismo resultado.

**Método Vogel.** Observar, Ordenar, Conectar, Decidir, Mejorar, presentado como «lenguaje de trabajo», no como metodología registrada. No hay evidencia comercial ni legal que obligara a conservar los nombres anteriores (Diagnóstico/Diseño/Implementación/Resultados siguen en las páginas de servicio, que describen su propio proceso). Diagrama SVG propio: Personas, Procesos, Datos y Tecnología convergen en un sistema que lleva a una decisión; Mejorar devuelve el ciclo al inicio. Es legible sin JavaScript. Al entrar se dibuja una vez (≈2 s, sin pin, scrub ni escena larga). En móvil se sustituye por una línea vertical con los cinco pasos.

**Persona.** Retrato real autorizado (`src/assets/oscar_vogel_imagen.png`, derivado a WebP de 480/720/1024 px con `npm run derive:oscar-portrait`, procedencia en `src/assets/oscar/provenance.json`; de 1,9 MB a 18–63 KB). Sin retoque ni generación. Dirección visual: contraluz y fondo oscuro, máscara que lo funde con el navy y leve desaturación por CSS. «+25 años» es el elemento protagonista pero va contextualizado como experiencia profesional, no como KPI. Hitos reales (1998, 2008, 2021, 2024), capacidades en lista editorial y tecnologías concretas dentro del detalle.

**Sin retrato.** Si la imagen falta o falla, `v-if` retira la figura: sin círculo gris, avatar ni silueta; el layout tipográfico ocupa el ancho. Lo cubre un test que bloquea las peticiones de imagen.

**Trabajo real.** Una sola presentación de los ocho logos como matriz sobria monocromática (sin tarjetas blancas, marquee ni «Trusted by»). FEMAG sigue como «Proyecto en desarrollo». Se eliminó la segunda lista duplicada de sitios.

**Nota sobre los logos.** Todos los SVG vienen con un fondo blanco incrustado, por eso antes iban en tarjetas blancas. Para ponerlos sobre navy se invierten a monocromo y se mezclan con `screen`. En hover solo ganan opacidad: «recuperar el color» mostraría un recuadro blanco.

**Perspectivas.** Las tres primeras guías reales de `resources.js`. La formación en IA (CPCE Misiones, «Solicitar una charla») vive dentro de Perspectivas, no como sección propia.

**Conversación.** El titular pasa a «Los problemas complejos empiezan con una conversación clara.», lo que además reduce la repetición de «operación». Campos, nombres, ids, estados, foco y analíticas son idénticos a los anteriores; cambia la presentación (borde inferior, radios de 6 px, etiquetas en versalita, entradas de 16 px). Dos acciones alternativas como máximo. Los enlaces `mailto` y WhatsApp son los mismos.

**Cierre del paisaje.** Una imagen fija del mundo ya ordenado (`public/landscape/closing-ordered.webp`, generada con `node scripts/capture-closing-poster.mjs`), colocada debajo del formulario. No hay renderer, canvas ni GPU activa en la segunda mitad. Cierra el círculo: al inicio, complejidad; al final, claridad.

**Navbar.** En P05: Capacidades (conserva el desplegable de servicios), Casos, Método, Perspectivas, Nosotros y «Conversemos». Fondo navy casi sólido con borde fino y sin blur. No se elimina ninguna ruta.

**Indicador espacial.** Se apaga por completo antes de la primera sección editorial (`evidenceExit` pasó de 10.5–10.8 a 10.2–10.5, hallazgo de los tests) y no existe numeración 09–12.

## Secciones reconvertidas, eliminadas y conservadas

- **Reconvertidas:** Servicios → Capability Index; Proceso → Método Vogel; Nosotros → Persona; Evidencia/Clientes → Trabajo real; Recursos + Charla IA → Perspectivas; Contacto → Conversación.
- **Eliminado (código sin ningún uso):** la variante `clients` de `HomeEvidence`.
- **Conservados para el modo base y los laboratorios:** `ServicesSection`, `EvidenceSection`, `ClientProof`, `ProcessSection`, `AboutSection`, `SecondaryContent`, `CTASection`, `LandscapeTraces`, `DataLandscape`, `MiniCasesSection`. No se borró ningún modo anterior; se decide al promover.
- **LandscapeTraces:** ninguna instancia en P05. El diagrama del método y el póster de cierre son los únicos nexos visuales.

## Motion del segundo tramo

Reglas, con una sola propietaria (`useEditorialMotion`):

| Elemento | Regla |
|---|---|
| Entradas | Y ≤ 20 px y opacidad; una sola vez |
| Líneas | trazo (`stroke-dashoffset`) |
| Foto | revelado breve con `clip-path` |
| Texto | sin animación por palabra |
| Scroll | nativo + Lenis existente; sin pin ni scrub |
| Reduced motion | nada se oculta ni se mueve |

Los elementos fuera de pantalla se ocultan solo al montar y se revelan al llegar; tras un salto largo, todos quedan visibles (probado).

## Superficies, forma y espacio

Todo oscuro (decisión: no habilitar superficie clara en la web). Alternancia navy · deep · slate. Relleno de sección `clamp(96px,11vw,180px)`. Controles de 6–8 px y marcos de 0–8 px; sin paneles de 20 px, sin sombras y sin vidrio (lo verifica un test sobre `editorial.css`).

## Móvil

Márgenes de 20 px, titulares de 32–42 px, filas de capacidad apiladas, línea vertical del método, retrato a ancho completo, perspectivas en lista y formulario cómodo. En móvil no se carga Three.

## Rendimiento

JS inicial ≈ 80 KB gzip, prácticamente igual con la flag apagada (258 KB sin comprimir) o encendida (256 KB): el código de las secciones no usadas se elimina del bundle. Three (187 KB gzip), ScrollTrigger, Lenis y SplitText siguen cargándose bajo demanda. Medición sobre el build de producción (`scripts/perf-phase05.mjs`, Chromium con GPU dedicada, orientativa):

| | Escritorio 1440×900 | Móvil 390×844 |
|---|---|---|
| LCP | 380 ms | 128 ms |
| CLS | 0,0036 | 0,0001 |
| Tarea larga máxima | 281 ms (inicialización de Three del arco espacial) | 64 ms |
| Listeners JS | 70 | 87 |
| Canvas | 1 | 0 |
| Renderer en la segunda mitad | pausado | — |

Los assets del retrato (115 KB) se emiten en el build aunque la flag esté apagada, pero ninguna página los pide.

## Accesibilidad

Cubierto por tests: headings sin saltos de nivel, cada sección con `aria-labelledby` a un heading real, ids únicos en todo el documento, etiquetas asociadas a cada campo, `role="status"` / `role="alert"` y foco en el mensaje de éxito, `details` operables por teclado, orden de tabulación con el skip link primero, Escape que devuelve el foco al desplegable, foco visible en filas, enlaces externos con `noopener`, reduced motion y sin WebGL. Pendiente: revisión con lector de pantalla real y contraste de fondos compuestos (el chequeo automático solo cubre superficies sólidas).

## Corrección del id duplicado

Con Phase 04 activa, `EvidenceSection` y `ForestEvidenceSequence` usaban `id="evidence-title"`; el primero pasa a `proof-title`. También se contuvo con `overflow-x: clip` un desbordamiento horizontal de 130–170 px provocado por las figuras fuera de pantalla de la secuencia de evidencia (existía desde Phase 04).

## Revisión de ritmo (§48)

Con las capturas de página completa (`docs/capturas/spatial-phase-05/fullpage-*.png`):

- **¿La primera mitad es demasiado larga?** Es la más larga a propósito: el arco ocupa ≈ 10,8 pantallas frente a ≈ 9,4 de la segunda mitad. Cada capítulo tiene ≈ 1,3 pantallas, que es razonable, pero es lo primero que recortaría si el recorrido cansa con rueda real.
- **¿Evidence llega demasiado tarde?** Llega tras ≈ 7,2 pantallas. No se tocó (la fase prohíbe reabrir el arco); es el candidato más claro para un ajuste posterior.
- **¿Método tiene aire?** Sí: ≈ 180 px de relleno y un diagrama de ≈ 450 px antes de los pasos.
- **¿Oscar cambia la energía?** Sí: `+25` a escala de titular, retrato fotográfico y cambio de superficie.
- **¿Perspectivas suma o alarga?** Suma: tres líneas y un bloque de formación; es la sección más corta.
- **¿Contacto llega antes de la fatiga?** Sí, ≈ 9 pantallas después de Evidencia, con el titular en 4 líneas y el formulario a la vista sin scroll.
- **¿Demasiadas superficies oscuras?** Es el riesgo principal. Navy, deep y slate se distinguen, pero la diferencia es sutil. La alternancia clara que proponía el brief fue descartada por decisión del titular; si en monitores reales la página se siente continua, la opción más segura es una sola superficie clara y derivada del gris de marca en Método, tras actualizar el manual.
- **¿Demasiadas líneas o nodos?** No: se retiraron todos los `LandscapeTraces`; solo queda el diagrama del método.
- **¿Repetición de ámbar?** Moderada y sistemática (kicker de cada sección, un único CTA relleno por vista).
- **¿Parece una única marca?** Sí.

## Tests

Se mantienen todas las suites anteriores. Nuevas:

- `npm run test:spatial:phase05`: datos (seis capacidades, rutas reales y alcanzables, sin repetir el arco, cinco pasos del método, hitos de Oscar derivados de la experiencia, perspectivas reales), cableado de la flag, límites del CSS editorial y lógica de formulario compartida.
- `npm run test:spatial:phase05:browser` (servidor en el puerto 5198): 21 grupos. Orden y anclas, ids únicos, ausencia de patrones antiguos, índice de capacidades y su hover, método y diagrama dibujado, Persona con y sin retrato, trabajo real y FEMAG, perspectivas, formulario (éxito, error y carga útil), mailto y WhatsApp exactos, navbar, teclado, reduced motion, sin WebGL, móvil y ausencia de overflow en 8 viewports.
- Scripts: `capture:spatial:phase05` (capturas), `scripts/perf-phase05.mjs` (métricas), `scripts/bundle-report.mjs` (bundle) y `scripts/capture-closing-poster.mjs`.

**Verificado en esta fase:** `test`, `test:contrast`, las 5 suites unitarias espaciales, `test:spatial:visual`, `test:spatial:phase05`, las 5 suites de navegador (core, narrative, phase03, phase04, phase05), `test:ui`, `test:narrative` y `test:narrative:behavior` (en modo base, que valida la refactorización del formulario).

**No verificado / conocido:** `scripts/test-ui-refinements.mjs` no figura en `package.json` y falla en la Home base porque se contradice con `test-landscape.mjs` (uno espera 7 secciones con etiquetas de capítulo; el otro, ninguna); es anterior a esta fase.

## Capturas

`docs/capturas/spatial-phase-05/`: página completa de la mitad editorial en 1920×1080, 1440×900, 1440×700, 1024×768, 768×1024, 430×932, 390×844 y 360×800; más reduced motion, sin WebGL, sin retrato, formulario con éxito y con error, y los menús de escritorio y móvil. También `validation.json`, `capture-report.json` y `performance.json`. Son QA local: están ignoradas por Git.

## Deuda técnica

- Los assets del retrato se emiten con la flag apagada (no se cargan).
- Revisión con lector de pantalla y con dispositivos reales (Safari, teléfonos): no hecha.
- Rendimiento medido solo con una GPU dedicada.
- `test-ui-refinements.mjs` obsoleto, y `public/llms.txt` aún lista `oscarvogel@gmail.com`, que no coincide con `oscar@vogelconsultoria.com.ar`.
- SSR/SSG y SEO del contenido generado por Vue: ver `docs/SSR_SSG_RECOMMENDATION.md`.

## Recomendación para producción

1. Revisar visualmente con rueda real y en un monitor distinto al de desarrollo, con atención a la continuidad de superficies oscuras y a la duración del arco.
2. Decidir si se promueve P05 a baseline. Promover implica cambiar las flags por defecto, retirar los modos laboratorio que ya no se necesiten y reescribir los tests de la Home base (anclas, conteos de secciones, servicios). No se hizo.
3. Corregir `llms.txt` y validar el contenido para crawlers antes de publicar (ver la recomendación de SSG).
4. Medir en campo (LCP, CLS, INP) y en una gráfica integrada antes de fijar los umbrales de calidad adaptativa.

Esta fase no hace commit, push ni deploy; el despliegue requiere autorización expresa.
