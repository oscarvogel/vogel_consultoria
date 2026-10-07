# Fase 04 — Decision → Evidence / caso Forestal

Base: `9622ae7`. Implementación local optativa; no publicación automática ni Fase 05.

## Concepto e identidad

**Abstracción → evidencia.** El paisaje explica relaciones; el producto demuestra su aplicación. Al aparecer la interfaz real, WebGL retrocede y el HTML toma protagonismo. Se conservan V ámbar, Clash Display, Chillax, navy, azules institucionales y los tokens actuales.

La evidencia procede del caso forestal anónimo existente: capturas de interfaces reales con datos de demostración, obtenidas mediante el harness indicado en `src/assets/cases/provenance.json`. No acredita resultados de clientes. Permanecen visibles «Interfaz real · datos de demostración» y «Las cifras no representan resultados de un cliente».

## Activación, estructura y numeración

`VITE_SPATIAL_PHASE_04=true` activa por sí sola todo el recorrido. Precedencia: Phase 04 → Phase 03 → `VITE_SPATIAL_NARRATIVE` → Core → baseline. `.env.example` conserva todas las flags desactivadas. Reiniciar Vite después de cambiar flags.

Solo Phase 04 monta el caso dentro del arco y antes de Servicios; suprime MiniCases posterior. Los cuatro modos anteriores mantienen su orden. Servicios, interiores, evidencia institucional, Método, Oscar, recursos y contacto conservan su implementación.

`narrativeChapters` es autoridad de índice, número y nombre. `chapterMarker()` genera los markers HTML; el indicador usa el mismo catálogo. Secuencia: 01 Intro, 02 Complejidad, 03 Sistemas, 04 Automatización, 05 Datos, 06 Inteligencia, 07 Decisión, 08 Evidencia. Phase 02 termina en 03/03; Phase 03 en 07/07; Phase 04 en 08/08. Registrar/Revisar/Decidir poseen una numeración interna distinta, explícitamente subordinada a Evidencia.

## Arquitectura y contratos

- `forestCase.js`: contenido único para legacy y Phase 04; títulos, copy, alt, imágenes, dimensiones, recortes, disclaimers y enlaces originales.
- `ForestEvidenceSequence.vue`: HTML semántico, intro, lista ordenada de pasos, figures, captions y CTA. Sin canvas, RAF, renderer o ScrollTrigger propios.
- `evidenceScenes.js`: configuración de alturas/rangos, pose final, sampler reversible, corners compartidos y homografía pura.
- `evidencePortal.js`: compositor DOM controlado desde el adaptador existente. Mide el slot, proyecta el marco, mezcla cuatro corners y aplica `matrix3d` al mismo figure. Sin clon, reparenting ni nueva animación temporal.
- `mountSpatialNarrative`: mantiene un único ScrollTrigger narrativo, actualiza Camera Rig, mundo, indicador y compositor; conserva guards de import asíncrono y cleanup.

`sampleEvidence(controller,offset,out)` escribe sobre el estado reutilizado: `portal`, `frame`, `dock`, `imageOpacity`, `canvasOpacity`, `evidenceStep`, `stepBlend`, `evidenceExit`, capítulo e índice. El offset se mide en unidades de altura del arco; inputs no finitos equivalen a cero.

`world.frameCorner(index,progress,out)` escribe TL/TR/BR/BL en el vector proporcionado. El shader utiliza exactamente la misma transformación: centro `[4,3,-48]`, semiancho 4→3×aspecto medido del slot, semialto 2→3. `portalMatrix(corners,width,height,out,scratch)` calcula una homografía mediante buffers reutilizados; falla de forma estable si el cuadrilátero es degenerado.

La cámara interpola con el Camera Rig existente desde Decision `[12,11,0]`, target `[3,1,-28]`, FOV 45, hacia Evidence `[4,3,-38]`, target `[4,3,-48]`, FOV 45. La aproximación es corta y sin roll. El puntero se neutraliza durante el portal. El destino DOM se mide por viewport y no depende de coordenadas CSS hardcodeadas en JavaScript.

## Scroll y handoff

| Offset desde inicio | Lectura |
|---|---|
| 0–7.2 | Fase 03 existente, sin cambiar sus poses/ranges |
| 7.2–7.9 | Decision → portal → Evidence |
| 7.9–8.8 | Registrar; transición a Revisar en 8.6–8.8 |
| 8.8–9.7 | Revisar; transición a dashboard en 9.5–9.7 |
| 9.7–10.8 | Dashboard y salida nativa hacia Servicios |

La secuencia reserva 360svh y reutiliza los últimos 80svh del arco anterior: total 1080svh, aumento neto 280svh frente a Phase 03. Las alturas vienen de la configuración y se recalculan por ResizeObserver.

Se utiliza CSS sticky, sin GSAP pin ni spacer. El stage permanece sticky hasta offset 9.8; después sale naturalmente con el documento durante el tramo final del dashboard. El indicador se desvanece entre 10.2 y 10.5 (ajustado en Phase 05: debe estar apagado antes de la primera sección editorial). Esta salida forma parte del presupuesto compacto; el dashboard no obtiene un viewport adicional de espera.

El marco aumenta definición y cambia proporción antes de la captura. El DOM aparece aún proyectado, luego converge hacia su slot editorial. El contorno WebGL se atenúa al empezar el docking para evitar dos marcos competidores. Intro y copy de Registrar se alternan sin textos superpuestos. Las capturas de pasos sucesivos se lateralizan/contraen con solapamiento controlado; el dashboard cambia hacia un plano horizontal amplio.

## Renderer y geometría

Un renderer, canvas, RAF WebGL, Camera Rig y Lenis. Las cinco geometrías y sus atributos CPU se crean al montar; no se sustituyen durante scroll. Cero texturas. `uEvidence` transforma el contorno ya incluido en la quinta geometría; `uEvidenceDock` lo atenúa durante el traspaso; `uEvidenceAspect` conserva la proporción medida de la primera captura. Ambos son neutrales en los modos anteriores.

Cinco draw calls por frame mientras el mundo aporta. Al llegar a **offset 7.9**, el canvas tiene opacidad cero y el renderer pausa: no envía frames durante Registrar estable, Revisar ni Decidir. El último contador `renderer.info.render.calls` puede seguir mostrando 5; no significa actividad GPU. Al retroceder se reconstruye el estado antes de reanudar el mismo renderer.

Documento oculto y salida de viewport conservan la pausa del engine. Pérdida temporal de contexto en Phase 04 mantiene el layout para no saltar de posición: oculta canvas y muestra posters; restauración reanuda solo si el estado necesita WebGL. Tras pérdida de contexto los recursos GPU se recrean cuando se vuelve a renderizar; la identidad garantizada es la del canvas, geometrías, atributos y arrays CPU.

## Imágenes, responsive y accesibilidad

Los originales PNG se conservan. `npm run derive:forest-case` produce WebP lossless con comparación de píxeles RGBA y sidecar SHA-256. Tamaños PNG→WebP: campo 64,420→34,838; revisión 98,893→52,548; dashboard móvil 128,464→72,446; dashboard desktop 192,224→106,706 bytes. Total: 484,001→266,538 bytes, sin modificar datos o legibilidad.

Phase 04 sirve WebP mediante picture, con PNG como alternativa. Legacy conserva su entrega previa. Registrar se prepara al aproximarse a Decisión, Revisar cerca del portal y dashboard desde Revisar. La carga no retiene el scroll; si falta decoding, texto y marco siguen disponibles.

Desktop muestra recortes originales declarados: en viewports de menos de 800px de alto, campo y=190, alto=537 y revisión y=448, alto=600; en viewports altos, campo y=0, alto=780 y revisión y=448, alto=850. La captura desktop del dashboard se muestra completa. Todos permiten abrir el PNG original. Móvil, touch, reduced motion y fallo inicial de WebGL muestran imágenes completas en flujo, sin alturas cinematográficas, sticky, portal o importación inicial de Three.

Heading h2 del caso, h3 por paso, lista ordenada, figures, alt verificados, captions y disclaimers reales. Pasos inactivos son inert; no hay foco automático. Hashes `#casos` y `#evidencia-registrar/revisar/decidir` conservan navegación. El adaptador traduce hashes de pasos al offset correspondiente en desktop. Cleanup retira estilos de animación, inert y aria-hidden; conserva metadata de recorte. No se añadieron eventos analytics; se mantiene el CTA existente.

## Comparación y métricas

`benchmark:spatial:phase04` compara navy/sticky, superficie gris clara/sticky y navy/pin GSAP temporal. Las variantes existen solo dentro del harness y no se publican. Se conserva navy/sticky: continuidad más clara con el mundo, indicador legible y menos infraestructura. El pin produjo una composición similar sin una ventaja demostrada; la superficie clara introduce un cambio más fuerte y requiere retocar el indicador.

Muestra Chromium headless 1440×900, 91 posiciones: navy/sticky mediana de espera RAF 5.9ms, p95 8.5ms; layout acumulado 8.76ms, script 37.96ms. Claro/sticky: 5.8/6.6ms, layout 7.82ms, script 35.50ms. Navy/pin: 5.8/6.9ms, layout 8.22ms, script 35.66ms. CLS observado 0.000931. Heap tras GC navy/sticky 8,069,540→8,190,816 bytes en un recorrido.

Buffers CPU observados: 2,490,712 bytes, idénticos al presupuesto Phase 03. Carga local más resolución de decode promise: Registrar 9.2ms, Revisar 6.9ms, dashboard 17.6ms; incluye disponibilidad del recurso y no aísla el coste del decodificador.

Son muestras sintéticas de scheduling y trabajo de navegador, no certificación de FPS físico, energía, memoria GPU ni ausencia universal de fugas. No justifican cambiar `low-power`. Los tiempos de recursos se registran en `benchmark.json`; no representan descarga sobre una red de cliente.

## Pruebas y evidencia

Scripts nuevos: unitario y navegador Phase 04, benchmark comparativo y derivación de imágenes. El test estático legacy pasó a leer el módulo compartido; no se cambió su expectativa comercial. La prueba de pausa Phase 02 toma timestamp y oculta el documento en la misma tarea de navegador, eliminando una carrera entre dos evaluate sin cambiar la expectativa de pausa.

Evidencia reproducible en `docs/capturas/spatial-phase-04/`: screenshots desktop 1440×900, 1920×1080 y 1440×700; móvil 390×844 y 360×800; reduced motion y no WebGL. `validation.json` registra estados del renderer y `benchmark.json` la comparación. Las capturas y logs de build son QA local ignorado por Git.

### Resultado real de validación

| Comprobación ejecutada | Resultado |
|---|---|
| `npm test`, `test:contrast` | Pasan; 15 pares sólidos de contraste, no certificación de fondos compuestos |
| `test:spatial`, `test:spatial:narrative`, `test:spatial:phase03`, `test:spatial:phase04` | Pasan |
| Browser Core, Phase 02 y Phase 03 en sus flags independientes | Pasan; última repetición Phase 02 usa muestreo atómico de pausa |
| Browser Phase 04 | Pasa: numeración/marker visible, identidad, 5 calls/geometrías, todos los arrays, cámara y estilos DOM reversibles, proyección <2px, pausa, resize, contexto en portal y tres pasos, hash/reload, foco, reduced motion dinámico, cleanup e imports pendientes |
| `test:ui` baseline | Pasan 5 viewports Home y 16 destinos interiores en desktop/móvil |
| `test:narrative` baseline | Pasa renderer compartido, scroll/reversa, resize, reduced motion, contexto, fallback y unmount |
| `test:narrative:behavior` baseline y Phase 04 | Pasan menú, teclado, anchors/reload y estados de formulario locales simulados; no envío real de email |
| Build baseline/Core/Phase 02/Phase 03/Phase 04 | Pasan los cinco; último build con todas las flags demuestra precedencia Phase 04 |
| Preview de producción | Pasa: un caso/canvas, pausa, imágenes/alt, mobile sin Three, snapshot DEV ausente y regresión por píxeles del corte del Hero |
| Derivación de capturas | Cuatro comparaciones RGBA idénticas |
| Benchmark y comparación visual | Ejecutados; se conserva navy/sticky y low-power |
| `git diff --check` | Pasa |

40 PNG locales incluyen todos los viewports solicitados, variantes de comparación y dos capturas de producción. Permanecen la advertencia no bloqueante del chunk lazy de Three (746.94KB, 191.81KB gzip) y la revisión manual en dispositivos físicos. El front Phase 04 está disponible en `http://127.0.0.1:5196/`.

Incidencias resueltas: superposición inicial de títulos, margen del stage heredado de section-shell, caption de revisión próximo al footer, doble marco durante docking un callback de IntersectionObserver que referenciaba estado fuera de su ámbito y una matriz invisible que quedaba aplicada al volver a Decisión. Los recortes finales priorizan lectura en 1440×700. Una ejecución Chromium se cerró durante una captura; debe distinguirse del resultado de la repetición aislada.

## Revisión visual y límites

1. El contorno cambia de proporción y revela la misma superficie HTML: el puente es tangible; validar el ritmo con rueda física.
2. El heading, la interfaz y los disclaimers hacen explícita la entrada al caso real.
3. La continuidad proviene del mismo stage y las transiciones de plano; las capturas conservan su interfaz original, incluidos controles rasterizados.
4. El dashboard es el plano más amplio y resuelve el flujo junto al label «DEL CAMPO A LA DECISIÓN».
5. El mundo retrocede y pausa antes de la secuencia DOM; no acompaña indefinidamente la evidencia.
6. 360svh, incluidos portal y salida, evita otra extensión de 500svh. Revisar fatiga dentro del arco completo de 1080svh.
7. Servicios sigue siendo útil como destino comercial; existe posible redundancia con los enlaces previos. No se rediseñó ni eliminó.
8. Sin WebGL se conserva toda la lógica, imágenes, enlaces y advertencias; queda como secuencia editorial.

No se certificaron Safari, teléfonos físicos, lectores de pantalla o experiencia GPU universal. El dashboard contiene texto pequeño, especialmente en 1440×700; el enlace a la captura original permite inspeccionarlo. No se sustituyen las capturas por una demo interactiva.

## Archivos y preparación para Fase 05

Nuevos: componente ForestEvidenceSequence, datos forestCase, módulos evidenceScenes/evidencePortal, estilos forestEvidence, cuatro WebP y sidecar, cinco scripts y este documento. Modificados: App, SpatialExperience, SpatialNarrativeArc, MiniCases, adaptador, catálogo narrativo, clusterWorld, dataWorld, flags, package, test-site, el muestreo atómico de pausa Phase 02 y DESIGN.

Fase 05 recibe una salida DOM estable hacia Servicios y una fuente compartida del caso. Recomendación: evaluar la densidad comercial de Servicios después del dashboard y el ritmo de evidencia institucional. No se implementaron Método definitivo, Oscar, Resources, contacto espacial o refinamiento final de Servicios.
