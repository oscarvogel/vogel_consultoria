# Phase 03 — SYSTEMS → AUTOMATION → DATA → INTELLIGENCE → DECISION

Fecha: 2026-10-06. Base: `1687259`, más la corrección local del corte del Hero. Entrega local; sin commit, push ni deploy. Caso Forestal, método, Oscar, contacto e interiores conservados.

## Concepto y auditoría

Se inspeccionaron SpatialNarrativeArc, SpatialExperience, mountSpatialNarrative, narrativeScenes, clusterWorld, dataWorld, Camera Rig, engine, sceneController, estilos, documentación Phase 02, DESIGN.md y PRODUCT.md. El renderer persistente, SLERP, controlador por rangos, imports diferidos y lifecycle ya cubrían las responsabilidades del motor. Se extendieron, sin crear otro mundo o controlador.

El mismo sistema pasa de estructura a circulación, patrones, evaluación y claridad. No hay modelos, texturas, luces físicas, paquetes nuevos ni afirmaciones de resultados empresariales. Las columnas y alternativas son composiciones conceptuales, no datos operativos o inferencia de IA real.

## Activación y compatibilidad

Todos los flags tienen valor false en `.env.example`. Precedencia: `VITE_SPATIAL_PHASE_03` → `VITE_SPATIAL_NARRATIVE` → `VITE_SPATIAL_CORE` → Home original. Fase 3 funciona también si los otros flags están activos; no monta sus renderers.

```powershell
$env:VITE_SPATIAL_PHASE_03='true'
npm run dev -- --host 127.0.0.1 --port 5194 --strictPort
```

Para desactivar, detener y reiniciar Vite con Phase 03 false. Narrative true reproduce Fase 2; Core true con ambos flags narrativos false reproduce Fase 1. Las exportaciones originales de narrativeScenes y los asserts de Fase 2 conservan sus contratos.

## Arquitectura y API

- App selecciona el modo. SpatialNarrativeArc recibe `phase03` y añade cuatro momentos declarativos; SpatialExperience pasa el mismo valor al adaptador.
- `mountSpatialNarrative(host, {phase03:false}) → dispose`: un ScrollTrigger, un controlador, un Camera Rig y el mismo engine. La opción omitida conserva Fase 2.
- `phase03Config` reúne scenes, moments, chapters, ranges, height y end. `samplePhase03(controller, offset)` reutiliza su estado con progreso local, fase de pulso y selección. Offset se expresa en unidades de viewport medidas; valores no finitos vuelven al inicio.
- sceneController añade flow/data/intelligence/clarity/convergence a sus escalares interpolados. Son cero para los estados antiguos. Camera Rig mantiene posición/FOV interpolados y quaternion SLERP, sin retardo de cámara independiente.
- `createSpatialEngine(T,{phase03:false,powerPreference:'low-power'})` mantiene el contrato anterior. La preferencia alternativa se usa solamente desde el benchmark aislado, sin control o query parameter público.
- dataWorld añade uniforms neutrales y pasa Phase 03 a clusterWorld. El único RAF actualiza cámara, mundo y labels. Diagnóstico `__vogelSpatial.getState()` amplía campos narrativos e identidad/bytes de cada atributo; snapshots siguen siendo DEV-only.

## Scroll y cámara

El arco ocupa 800svh: Hero 100, Complejidad 150, Sistemas 150, Automatización 110, Datos 110, Inteligencia 100, Decisión 80. Desktop elegible: desde 1024px, pointer fine y no reduced motion. Unidad de recorrido = altura medida del arco / 8. Rango útil termina en 7.2 unidades; la salida ocupa las últimas .8, hasta Servicios. Resize vuelve a medir sin reemplazar recursos.

| Offset en viewports | Estado |
|---|---|
| 0–3 | Fase 2 preservada: rangos .20/.38/.65/.82 multiplicados por 3 |
| 3–3.6 | Systems → Automation |
| 3.6–4.1 | Automation estable |
| 4.1–4.7 | Automation → Data |
| 4.7–5.2 | Data estable |
| 5.2–5.8 | Data → Intelligence |
| 5.8–6.2 | Intelligence estable; selección continúa |
| 6.2–6.7 | Intelligence → Decision |
| 6.7–7.2 | Decision estable |
| 7.2–8 | Handoff; alpha/máscara descienden y renderer pausa al llegar a Servicios |

| Escena | Posición | Target | FOV | flow / data / intelligence / clarity / convergence |
|---|---|---|---|---|
| Systems | [6,4,-4] | [0,.8,-23] | 47 | 0 / 0 / 0 / 0 / 0 |
| Automation | [8,2.8,-8] | [1,1,-26] | 49 | 1 / 0 / 0 / 0 / 0 |
| Data | [11,13,1] | [1,1,-26] | 47 | .25 / 1 / 0 / .2 / 0 |
| Intelligence | [10,10,-3] | [3,2,-28] | 47 | .15 / .75 / 1 / .4 / 0 |
| Decision | [12,11,0] | [3,1,-28] | 45 | 0 / .4 / .3 / 1 / 1 |

La máscara Intro usa su distancia original de 1.14 viewports, no un porcentaje del arco ampliado. No hay pin, snap, wheel handlers ni segundo Lenis. El indicador muestra el capítulo que se está introduciendo durante cada transición y termina en 07 / 07. Sistemas conserva sus tres enlaces reales. Los anchors nuevos utilizan sufijo espacial para no colisionar con servicios existentes.

## Geometría y shaders

Se mantienen terreno y conexiones base, 512 puntos agrupados y 171 segmentos entre puntos/grupos. Fase 3 añade `aData` y `aRoute` a las dos geometrías de clusters, creados una sola vez. Data usa cuatro columnas por grupo, con alturas abstractas deterministas. Los extremos de conexiones reciben las mismas posiciones de patrón. `dataPosition` genera atributos y anchors CPU, por lo que los labels siguen el morph GPU.

Una geometría adicional contiene 12 segmentos: tres alternativas desde Información, cuatro conexiones de convergencia, una salida y cuatro bordes de un contorno rectangular. `aKind` y `aBranch` controlan su opacidad/selección en un material compartido. Todos los objetos permanecen montados incluso con alpha cero: cinco draw calls y cinco geometrías constantes, cero texturas. Fase 2 mantiene cuatro; Core mantiene dos.

| Uniform | Función |
|---|---|
| uFlow | Intensidad de actividad y respuesta de nodos |
| uPulsePhase | Posición 0–1 sobre la columna de conexiones |
| uData | Mezcla hacia atributos de patrón |
| uIntelligence | Visibilidad de alternativas |
| uSelectionPhase | Aparición/evaluación/selección de una alternativa |
| uClarity | Atenuación de relaciones secundarias |
| uConvergence | Convergencia útil y contorno final |

Un pulso ocupa una posición sobre las tres conexiones principales; los segmentos cortos tienen aRoute=-1 y no reciben pulsos. Cada grupo reacciona suavemente cuando esa posición alcanza su anchor. Fase de pulso = clamp((offset−3)/1.7); fase de selección = clamp((offset−5.2)/1). No se usa fract ni un reloj independiente para estos comportamientos. Al detener scroll, el pulso permanece; al retroceder, recorre la ruta inversa. El ambiente mantiene uTime y la sensibilidad mínima al puntero.

## HTML, responsive y posters

Headings, copy, equivalencias textuales, tres indicadores conceptuales de Data y enlaces son HTML. Labels espaciales y contador son decorativos aria-hidden; el canvas no recibe foco ni eventos. Las regiones de lectura incluyen los nuevos indicadores; los labels se ocultan por clip, profundidad, lectura y colisiones.

Móvil/touch y reduced motion no importan Three inicialmente. Las secciones nuevas compactan su visual a 240px y conservan copy/equivalencia en flujo. Desktop reducido o sin WebGL utiliza composición editorial de dos columnas; no reserva alturas cinematográficas. Pérdida temporal de contexto conserva canvas y muestra posters; recuperación continúa en el offset actual. Una falla definitiva libera la sesión. Hidden document, salida del arco y unmount conservan las pausas/cleanup anteriores.

`capture-phase03.mjs` genera automation/data/intelligence/decision.webp desde el mundo real en offsets 4.05/5.15/5.65/7.05. Intelligence se captura durante evaluación para preservar alternativas legibles. Congela uTime=0 y puntero neutral, cámara de poster [12,14,3] hacia [0,1,-28], exposición de clusters 1.2; recorta [220,150,1000,625] y exporta a 1440×900, calidad WebP 86. Sidecars registran origen, estado, script y fecha. Snapshot restaura cámara, tiempo, exposición y puntero; no hay assets externos o IA generativa.

## Rendimiento y validación

DPR = min(devicePixelRatio,1.5,sqrt(1,800,000/area)). Buffers y atributos permanecen estables durante ida/vuelta; ningún mesh por nodo/pulso, ni geometría reconstruida por frame. Los diagnósticos asignan estructuras solo cuando los solicita una prueba, no en el RAF.

Benchmark local aislado: Chromium headless sobre ANGLE/AMD Radeon RX 6600/D3D11, viewport 1440×900, mismo DPR y recorrido, tres muestras por preferencia. EXT_disjoint_timer_query_webgl2 disponible, disjoint false, 180 resultados GPU por muestra. Medianas GPU low-power: .25668/.25580/.26148ms; high-performance: .26112/.26036/.26100ms. Medianas CPU del update más envío de render: .1/.2/.1ms para ambas preferencias. No existe mejora repetible ≥10%: se mantiene low-power. Las muestras son un workload sintético, no costo total de la Home, consumo energético, memoria GPU ni garantía de FPS.

Primera validación completa de Fase 3: cinco draw calls/geometrías constantes y cero texturas; heap tras tres recorridos con GC: 9,342,220 / 9,340,008 / 9,350,528 bytes (8,308 bytes de crecimiento). Reportes finales se escriben en `docs/capturas/spatial-phase-03/validation.json` y `benchmark.json`; la medición acotada no demuestra ausencia universal de fugas.

La ejecución final tras la corrección de visibilidad registra 9,414,104 / 9,418,024 / 9,425,652 bytes de heap (11,548 bytes de crecimiento). Los 18 atributos suman 2,490,712 bytes de arrays CPU; no es una medida de memoria GPU. Los posters pesan 22,550 / 11,722 / 12,476 / 16,576 bytes respectivamente.

### Comandos y evidencia

```powershell
npm test
npm run test:contrast
npm run test:spatial
npm run test:spatial:narrative
npm run test:spatial:phase03
# Servidores: baseline 5190, Core 5191, Fase 2 5192, Fase 3 5194
npm run test:spatial:browser
npm run test:spatial:narrative:browser
npm run test:spatial:phase03:browser
npm run capture:spatial:phase03
npm run benchmark:spatial:phase03
```

La suite nueva verifica estados estables/transiciones, reversa de cámara y uniforms, igualdad de píxeles del canvas con ambiente congelado, atributos/arrays estables, labels sin overlap, indicador, seam del Hero, context recovery y resize en cada estado, pausa final/hidden, hash y teclado, heap acotado, mobile/RM sin Three, fallo WebGL y async unmount. Capturas: siete estados en 1440×900, Automation/Data/Decision en 1920×1080, Automation/Intelligence/Decision en 1440×700, cuatro momentos en 390×844 y 360×800, handoff, reduced motion y no WebGL. Las evidencias pesadas permanecen ignoradas en Git.

Una ejecución simultánea de suites Chromium terminó con cierre del navegador de Fase 2 durante screenshot. La repetición aislada pasó; se continuó validando en secuencia. No se redujeron sus asserts.

La revisión visual detectó un encuadre anterior después de resize/context recovery. Un intento de recuperación también completó WebGL pero dejó el RAF detenido (lost false, calls/geometries cero), por visibilidad desactualizada. El adaptador ahora mide la intersección actual en resize/recovery y en el callback del observer, sin usar la primera entrada de una cola potencialmente obsoleta. Además oculta explícitamente el host durante la pérdida: su opacidad inline podía anular el ocultamiento CSS. La suite verifica host oculto, misma identidad, render reiniciado e igualdad del canvas congelado antes/después de cada recuperación. Capturas de otros tamaños esperan la pose/uniforms solicitados y sincronizan el readback antes de la composición. La captura final de Decision 1440×700 muestra convergencia y pose [12,11,0].

Resultados ejecutados: npm test, contraste (15 pares sólidos), unidades Core/Fase 2/Fase 3, navegador Core/Fase 2/Fase 3, UI convencional (cinco viewports y 16 destinos interiores desktop/mobile), motion legacy y comportamiento convencional/Fase 3. Los estados del formulario usaron respuestas locales simuladas; no se verificó entrega externa. Builds aprobados para default, Core, Narrative y Phase 03 con los tres flags activos, más build final tras el ajuste de recovery. Smoke de vite preview verificó precedencia Phase 03, canvas único, cinco calls, Decision, ausencia de snapshot DEV y móvil sin Three.

## Archivos y límites

Modificados: .env.example, package.json, App.vue, SpatialExperience.vue, SpatialNarrativeArc.vue, narrativeScenes.js, sceneController.js, clusterWorld.js, dataWorld.js, spatialEngine.js, mountSpatialNarrative.js, spatialNarrative.css y DESIGN.md. Creados: scripts/test-spatial-phase03.mjs, test-spatial-phase03-browser.mjs, capture-phase03.mjs, benchmark-spatial-phase03.mjs, cuatro posters con sus sidecars y esta documentación. La corrección previa del Hero y su prueba siguen siendo cambios locales preservados.

Servicios puede parecer redundante tras un arco completo, pero mantiene detalle y navegación comercial: no se eliminó. Los pulsos expresan avance del visitante, no procesos reales ejecutándose. La percepción del ritmo y contraste necesita aprobación visual del usuario; Chromium local no certifica Safari o teléfonos físicos. El chunk lazy de Three conserva su advertencia de tamaño. No se midió memoria GPU o energía.

Fase 4 podrá continuar desde la composición Decision y su salida/contorno, con el mismo renderer y buffers. No se creó aún la transición abstracto → interfaz real ni se alteró Forestal.
