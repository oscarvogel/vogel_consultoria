# Comparación y QA de diseño — Corea / Vogel

Fecha: 2026-10-06. Estado: **aprobado para entrega dentro del alcance local autorizado**.

La composición de Corea es la referencia aprobada. La adaptación autorizada utiliza V oficial, Archivo Variable expandida y Chillax, carbón/crema/ámbar y paneles cálidos. Los proyectos reales y sus colores originales reemplazan el contenido de referencia. Estas diferencias de marca son deliberadas.

| Superficie requerida | Comparación y evidencia local | Resultado / límite |
|---|---|---|
| Home desktop | Rail 34.4vw, panorama centrada hasta 1072×603, gap20, títulos48max. `reference-1440x900.png` y `home-1440x900.png`; además 1440×700 y 1920×1080. | Composición implementada; comparación independiente aprobada. |
| Home móvil | 342×608 en 390×844, siguiente proyecto visible, menú separado ≥44px. `home-390x844.png` y `home-360x800.png`; comparación móvil local. | Swipe nativo simulado CDP aprobado; sin medición física. |
| Grilla | Mismos nueve proyectos, proporción4:5, gap24px, 3/2/1 columnas y títulos ajustados. `reference-grid-1440x900.png`, `comparison-grid.png` y `grid-<viewport>.png`. | Checks de títulos/overflow aprobados en cinco tamaños. |
| Info / contacto | Página carbón, paneles mates #262523 / #3b3933 y contenido editorial. `reference-info-1440x900.png`, `comparison-info.png`, `info-<viewport>.png`, `contact-<viewport>.png`. | Hash y foco, Tab atrapado, error/reintento/éxito simulados aprobados. Header móvil: respaldo opaco82px implementado; recheck de cabecera aprobado en cinco viewports; veredicto final aprobado para alcance local. |
| Lectores de proyecto | Fondo crema, evidencia desktop/mobile original, enlace público; Forestal con dos disclaimers y Registrar → Revisar → Decidir. `reference-project-1440x900.png`, `comparison-project.png`, `forest-<viewport>.png`, `web-project-<viewport>.png`. | Carga directa, History, Escape, foco y regreso a galería aprobados. No resultados comerciales inventados. |

Capturas y comparación: `docs/capturas/corea-replica-2026-10-06/`, carpeta local ignorada conservada. Viewports: 1440×900, 1440×700, 1920×1080, 390×844 y 360×800. Estados adicionales: `reduced-motion.png`, `image-failure-mobile.png` y regreso al carrusel. La falla de imagen conserva nombres y enlaces.

`results-dev.json` y `results.json` contienen 43 checks cada uno. `npm test`: 13 aprobados; build: 126 módulos aprobado. Chromium automatizado/touch CDP representa QA funcional y visual local; no valida rendimiento físico ni envío Web3Forms real. Dos respuestas Web3Forms simuladas, sin transmisión.

Detector mecánico ejecutado una vez: advisories de documentación tipográfica/radios obsoleta y neutrales cálidos. DESIGN y sidecar actualizados; colores cálidos son la desviación aprobada de marca. No repetir el detector únicamente para buscar un resultado más favorable.

## Revisión independiente

Hallazgo: Info móvil podía leer contenido bajo la cabecera fija. Corrección implementada: respaldo opaco de 82px. **Recheck de cabecera aprobado en cinco viewports (`header-recheck.json`); grilla4:5 recapturada y aprobada en revisión independiente.** La revisión independiente final resolvió los dos hallazgos y aprobó la entrega local.


Corrección de revisión: grilla desktop y móvil ajustadas a proporción 4:5, con gap24px. Los 43 checks del dev5198 están aprobados después del ajuste de grilla4:5. La suite final de producción5201 aprobó43 checks después de todos los ajustes (títulos, header y grilla4:5).

Municipalidad: corrección específica del título largo en carrusel móvil (24–29px, 7.1vw). `scripts/test-portfolio-edge-cases.mjs` verifica todos los títulos en 1440/390/360, transformación rápida de vista a 1072×603 y navegación por teclado al activar movimiento reducido. Veredicto independiente final: aprobado para entrega local.

Verificación final funcional: build126 módulos y npm test13 PASS;10 rutas HTML directas HTTP200 con JS con hash y24 imágenes SHA256 coincidentes (WebP total3.319.524 bytes). Header cinco viewports y edge cases PASS. `git diff --check` del alcance modificado/documentación PASS; global falla por whitespace previo en HTML de interiores no modificados. El veredicto visual independiente final aprueba el alcance local autorizado.

## Resultado final

**PASS — ship within authorized local scope.** La misma revisión independiente confirmó que los hallazgos de proporción de grilla y cabecera de Info están resueltos; no pidió más ajustes ni recapturas para esos hallazgos. Inspeccionó visualmente la comparación final de grilla desktop, ambas grillas móviles y la comparación del lector de proyecto. La evaluación previa cubrió Home desktop/mobile e Info con las desviaciones de identidad Vogel autorizadas. La suite final de producción aprueba43 checks.

La aprobación corresponde a implementación, comparación visual y comportamiento dentro del alcance local. Se mantienen los límites: no certifica rendimiento en dispositivos físicos ni envío real de Web3Forms. No autoriza commit, push ni deploy.

final result: passed
