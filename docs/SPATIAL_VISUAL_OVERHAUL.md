# Acabado cinematográfico del mundo espacial

Base: Fase 04 (`docs/SPATIAL_PHASE_04_FOREST_EVIDENCE.md`). Misma narrativa, los mismos 8 capítulos, el mismo copy (salvo la nota única de la evidencia) y los mismos fallbacks. Cambia cómo se ve y cómo se mueve el mundo.

## Por qué

Las fases 01–04 se construyeron con `low-power`, cero texturas, sin postprocesado y con conteos de draw calls fijados por tests. Las consecuencias fueron:

- un terreno plano, sin luz ni profundidad;
- un vacío negro entre Complejidad y Decisión, porque la intensidad caía hasta .12;
- una cámara que frenaba en cada pose;
- texto sin entrada.

La referencia visual es `Consultoría tecnológica sobre paisaje de datos.png`.

## Pipeline de render — `src/lib/postPipeline.js`

| Paso | Detalle |
|---|---|
| 1. Escena | Se renderiza a un target HalfFloat, con MSAA según el tier; sin float, cae a 8 bits. |
| 2. Bloom dual-filter | Prefiltro con umbral suave (1.0, knee .5) a ½ resolución, 4 pasadas de bajada (13 taps) y 4 de subida (tent). |
| 3. Composite | Aberración radial, bloom, ACES, sRGB y fondo navy con haze. Después, viñeta hacia `#05090f` y grano con semilla `uTime`. |

- **Canvas opaco:** el composite pinta el mismo navy que la página. Así la máscara del host y el handoff no dejan costura.
- **Presupuesto:** `POST_BUDGET` = 10 pasadas y 10 render targets. Por modo, `src/lib/renderBudget.js` lo combina con los objetos de escena. Los tests leen esas constantes.
- **Contadores:** `renderer.info.autoReset=false`. `getState()` expone `calls`, `sceneCalls`, `postCalls`, `tier`, `dpr`, `samples` y `hdr`.

## Calidad adaptativa — `src/lib/qualityGovernor.js`

Hay cuatro tiers, que combinan DPR, MSAA, escala de bloom y bokeh máximo.

- **Cuándo baja:** si el EMA de frame time supera 20 ms durante 1,5 s.
- **Cuándo sube:** si queda por debajo de 11 ms durante 4 s, sin pasar nunca del tier inicial.
- **Cooldown:** 2 s entre cambios.
- **Navegadores automatizados** (`navigator.webdriver`): fijan el tier 1, para que los hashes de píxeles sean deterministas.

## Mundo

**Shaders compartidos.** Están en `src/lib/shaders/terrainChunks.js`: altura, morph narrativo, óptica (círculo de confusión en píxeles con conservación de energía), fragment de punto (disco de bokeh ↔ gaussiano) y paleta lineal.

**Terreno.**
- Crestas finas y pico central en ámbar HDR; valles en azul institucional.
- Barrido de luz lento, niebla de profundidad y bokeh cercano disperso. Solo sobrevive ~1 % de los puntos muy próximos, para limitar el fill-rate.
- Pilares de datos: 40 líneas con puntas que laten.

**Capítulos (`clusterWorld.js`).** El esqueleto de 512 puntos no cambia. Se añaden dos capas:
- `dust`: 6.144 partículas que derivan, amplias en Complejidad y contenidas al ordenarse;
- `threadFlow`: 4.104 partículas que viajan por los hilos y reciben el pulso ámbar del scroll.

La rama IA, el hub y el contorno de evidencia pasan a ámbar HDR.

**Tabla de luz.** Por capítulo, `narrativeScenes.js` define `focus`, `aperture`, `bloom`, `exposure`, `heat`, `cool`, `fog`, `dust` y `lens`. Son claves opcionales: el modo core conserva los valores por defecto del mundo.

## Cámara — `src/lib/cameraPath.js`, `cameraRig.js`

- **Trayectoria:** una Catmull-Rom centrípeta atraviesa todas las poses (más la de evidencia en Phase 04). El scroll se mapea con una cúbica monótona: en cada tramo de lectura la cámara deriva un ±.06 del segmento en lugar de detenerse.
- **Pureza:** `rig.pose` depende solo del scroll. Sobre la cámara renderizada se añaden roll y kick de FOV por velocidad (resorte críticamente amortiguado que vuelve a cero), una respiración sutil, el parallax del puntero y un lens shift horizontal.
- **Calma:** durante el portal, `setCalm(1)` anula acentos y respiración.
- **Snapshots:** `snapshot()` usa `rig.applyPose()` y `uTime=0`, así que es determinista.

## Texto y overlays

- **`src/lib/narrativeText.js`:** líneas enmascaradas con SplitText y timelines pausados; su progreso es una función suave del scroll, sin temporizadores. Se crea en el primer frame con la tipografía final; si se crea antes, un re-split posterior desplaza el scroll por anclaje.
- **Etiquetas proyectadas:** la opacidad depende de la distancia a los bordes, al indicador y a la columna de lectura.
- **Indicador:** riel vertical de capítulos con crossfade.
- **Lectura:** el scrim lineal se sustituye por un oscurecimiento radial local. Los marcadores llevan un trazo ámbar y las pills del hero son de vidrio sutil.
- **Evidencia:** las superficies muestran un dispositivo con sombra y halo, los fundidos usan curvas easing y hay una única nota al pie que conserva «Las cifras no representan resultados de un cliente.».

## Verificación

```powershell
npm test; npm run test:contrast
npm run test:spatial; npm run test:spatial:narrative; npm run test:spatial:phase03; npm run test:spatial:phase04; npm run test:spatial:visual
npm run test:spatial:browser; npm run test:spatial:narrative:browser; npm run test:spatial:phase03:browser; npm run test:spatial:phase04:browser
npm run test:ui; npm run test:narrative
$env:VITE_SPATIAL_PHASE_04='true'; npm run build; npx vite preview --port 5197; npm run test:spatial:phase04:preview
npm run capture:visual -- <etiqueta>   # ONLY=01,05 y WIDTHS=1440 para iterar
```

`capture:visual` guarda en `docs/capturas/visual-overhaul/<etiqueta>/` una captura por capítulo, un montaje de la intro junto a la referencia y `metrics.json`. La línea base anterior al cambio está en `before/`. Los posters de fallback (`public/landscape/{automation,data,intelligence,decision}.webp`) se regeneraron con `npm run capture:spatial:phase03`.

## Límites conocidos

- **Rendimiento:** solo se midió en una GPU dedicada (RX 6600). En gráficas integradas falta validarlo en dispositivo real: el governor está para eso, pero sus umbrales no se calibraron con hardware representativo.
- **Posters sin regenerar:** `complexity.webp` y `systems.webp` mantienen el look anterior, porque su generador (`capture-phase02.mjs`) ya no existe. Tampoco se regeneró `data-terrain.webp`, el póster del paisaje legacy, que depende del servidor 5177.
- **Versión base:** el paisaje legacy del hero (`DataLandscape.vue`, con todas las flags desactivadas) comparte el motor, así que también recibe el nuevo acabado.
