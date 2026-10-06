# Paisaje de datos — implementación local 2026-10-04

## Alcance y autoridad

Rediseño autorizado desde la referencia `Consultoría tecnológica sobre paisaje de datos.png`: V ámbar SVG, DM Sans, casi negro azul y paisaje de puntos. Branch local `codex/paisaje-datos-vogel`, baseline `92be2e4`; documentación anterior preservada en `docs/history/paisaje-datos-2026-10-04/`. Este registro no afirma commit, push ni publicación.

Home con mensaje central «Convertimos procesos en información útil», cuatro capacidades y diez destinos, tres capturas operativas forestales con datos de demostración, ocho logos SVG, FEMAG en desarrollo, método, Oscar sin retrato, recursos, capacitación y contacto. Interiores comparten tipografía, superficies oscuras, ámbar y flujo natural; conservan parcialmente ilustraciones conceptuales azules.

Three.js carga bajo demanda y comparte renderer entre hero/cierre. Onda de 20 segundos; retorno del objetivo de cursor tras 900ms y aproximación suavizada de unos 1.2 segundos. Pausa fuera de pantalla y con documento oculto; cleanup de recursos y listeners; posters del canvas de producción para movimiento reducido y fallback WebGL. No se usa el antiguo shader global, pins narrativos ni liquid glass.

## Evidencia y verificaciones comunicadas por el implementador

- `npm test`: 13 grupos aprobados.
- Build de producción aprobado. Chunk de Three de aproximadamente 747KB (191KB gzip) genera advertencia de tamaño; se carga bajo demanda.
- Contraste de los pares y superficies definidos por `scripts/check-contrast.mjs` aprobado; el scope se actualizó para paisaje y fondos compuestos.
- `node scripts/test-landscape.mjs`: todos los checks aprobados, cinco viewports de home (incluido 320×844) y dieciséis rutas interiores en escritorio/móvil.
- Motion/behavior: checks explícitos de ciclo/pointer, pausas, movimiento reducido, fallback y lifecycle; navegación y comportamiento contemplados por el script.
- Corrección móvil: etiquetas del paisaje en flujo relativo. Aserción final verifica separación mínima de 20px respecto del CTA en 390px y 320px.

Evidencia local fuera de Git: `C:/Users/roman/AppData/Local/Temp/vogel-paisaje-2026-10-04/all/validation.json`, PNGs y `all/video/*.webm`. La revisión independiente señaló el solapamiento móvil CTA/etiquetas; el implementador lo corrigió y recapturó. El reviewer confirmó las capturas finales de 390 y 320 px y emitió **SHIP con límites**. Las ilustraciones azules y el lockup editorial de encuesta son diferencias visibles documentadas; no se observó logo antiguo, desborde ni fallo de lectura concreto en las muestras revisadas.

## Refinamiento de scroll, etiquetas y navbar

Evidencia adicional fuera de Git: `C:/Users/roman/AppData/Local/Temp/vogel-slide-2026-10-04/`. Se revisaron heroes a 1895, 1440, 1199, 1024 y 390px, además de la transición a soluciones. El menú desktop quedó centrado con tolerancia de 1px, sin desbordes ni choque con acciones; a 1024px conserva aproximadamente 25px de separación. Las etiquetas siguen posiciones proyectadas del terreno y mantienen la composición móvil en flujo.

Una entrada de rueda de 700px recorrió aproximadamente 280px a los 80ms y 695px al completar 930ms: evidencia de interpolación, sin certificar FPS. Movimiento reducido elimina Lenis. Build, los 13 grupos de pruebas y la suite de lifecycle del paisaje pasaron nuevamente. El reviewer independiente emitió **SHIP del lote slide**; informe en la carpeta temporal indicada.

## Límites

Validación local en Chromium. No demuestra FPS, Safari, dispositivos físicos, accesibilidad integral, contraste de todos los frames ni entrega real del formulario. La evidencia temporal no se incluye en Git. Falta una foto real autorizada de Oscar. No se realizaron cambios de documentación que impliquen nuevas promesas comerciales.

## Documentación vigente

`DESIGN.md`, `PRODUCT.md`, `.impeccable/design.json` y `docs/manual-marca-vogel-consultoria.md` registran la identidad autorizada y el sistema implementado. La V y DM Sans sustituyen las autoridades visuales anteriores; posicionamiento empresarial y tono profesional permanecen.
