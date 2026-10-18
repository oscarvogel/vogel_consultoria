# Marketing PDF Social Images V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Regenerar las 13 piezas sociales con una estética híbrida, física y tecnológica inspirada en las campañas patrias de Vogel, conservando textos, CTA, identidad personal y formatos aprobados.

**Architecture:** ImageGen producirá 13 bases v2 independientes con escenas físicas transformadas en gemelos digitales. El compositor existente aplicará logo, textos y CTA de forma determinista; las bases y finales v1 se conservarán hasta que la validación v2 confirme las 13 piezas.

**Tech Stack:** ImageGen integrado, Node.js, Sharp, activos oficiales de Vogel Consultoría, JSON.

---

### Task 1: Preparar versión v2 no destructiva

**Files:**
- Create: `n8n-social-approval/generated/campana-marketing-pdf-2026-07/source-v1-backup/`
- Create: `n8n-social-approval/generated/campana-marketing-pdf-2026-07/source-v2/`
- Modify: `n8n-social-approval/generated/campana-marketing-pdf-2026-07/manifest.json`

- [ ] Copiar las 13 bases actuales a `source-v1-backup/` sin eliminar los originales.
- [ ] Crear `source-v2/` y registrar `visual_version: 2`, `visual_direction: hybrid_physical_ai` y `n8n: not_touched` en el manifiesto.
- [ ] Verificar que existan 13 respaldos antes de generar nuevas bases.

### Task 2: Regenerar carrusel de Instagram

**Files:**
- Create: `source-v2/instagram-01-base.png` a `source-v2/instagram-07-base.png`

- [ ] Generar portada con retrato integrado en un centro operativo físico recorrido por una corriente de datos.
- [ ] Generar cinco escenas físicas distintas: mesa administrativa duplicada; sala de reportes con dependencia única; corredor de calendarios y alertas; archivo de planillas que converge en un centro de control; sala de cierre mensual con detección temprana.
- [ ] Generar cierre con retrato y un único proceso físico iluminado como punto de partida.
- [ ] Rechazar escenas que sean solamente interfaces flotantes, contengan texto, deformen el rostro o usen símbolos patrios sin contexto.

### Task 3: Regenerar WhatsApp

**Files:**
- Create: `source-v2/whatsapp-01-base.png`
- Create: `source-v2/whatsapp-02-base.png`
- Create: `source-v2/whatsapp-03-base.png`

- [ ] Generar oficina operativa convertida en flujo de automatización con retrato integrado.
- [ ] Generar centro de decisión con arquitectura de datos, ondas de información y red neuronal sobria.
- [ ] Generar estudio contable/archivo documental convertido en sistema trazable con aprobación humana.
- [ ] Validar zonas seguras, identidad facial y ausencia de texto generado.

### Task 4: Regenerar Facebook

**Files:**
- Create: `source-v2/facebook-01-base.png`
- Create: `source-v2/facebook-02-base.png`
- Create: `source-v2/facebook-03-base.png`

- [ ] Generar tres composiciones 4:5 nuevas, no recortes de WhatsApp, con escenas físicas equivalentes y encuadres distintos.
- [ ] Mantener el retrato fuera de las zonas tipográficas protegidas.
- [ ] Validar profundidad cinematográfica, tecnología integrada y coherencia Vogel.

### Task 5: Conectar las bases v2 al compositor

**Files:**
- Modify: `tools/compose-marketing-pdf-campaign.mjs`
- Modify: `tools/test-marketing-layout.mjs`

- [ ] Escribir una prueba que falle si el compositor no usa `source-v2` cuando `visual_version` es 2.
- [ ] Ejecutar la prueba y confirmar el fallo esperado.
- [ ] Implementar selección explícita de `source-v2` conservando fallback manual a `source`.
- [ ] Ejecutar pruebas de zonas de retrato y tamaños mínimos de CTA.
- [ ] Componer y verificar los 13 PNG finales.

### Task 6: Revisión visual y entrega

**Files:**
- Create: `n8n-social-approval/generated/campana-marketing-pdf-2026-07/contact-sheet-v2.jpg`
- Modify: `n8n-social-approval/generated/campana-marketing-pdf-2026-07/manifest.json`

- [ ] Inspeccionar las 13 piezas a tamaño completo y en hoja de contacto.
- [ ] Corregir texto, rostro, CTA, logo, contraste o integración tecnológica antes de entregar.
- [ ] Marcar las 13 piezas `draft_review_v2`, conservar `n8n: not_touched` y guardar la hoja de contacto.
- [ ] Ejecutar verificación final: 13 PNG, dimensiones correctas, archivos no vacíos, 13 estados v2 y n8n intacto.
