# Marketing PDF Social Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Producir y validar 13 piezas sociales personalizadas para Vogel Consultoría, separadas por Instagram, WhatsApp y Facebook, sin programar ni modificar n8n.

**Architecture:** Las escenas y el retrato se generan con ImageGen usando las tres piezas existentes como referencias de identidad y estilo. Logo y tipografía se componen de forma determinista sobre los fondos aprobados para asegurar fidelidad de marca, ortografía y consistencia; un manifiesto registra cada entrega y su estado de revisión.

**Tech Stack:** ImageGen integrado, Node.js, Sharp, activos oficiales de Vogel Consultoría, JSON.

---

### Task 1: Preparar el paquete y los activos

**Files:**
- Create: `n8n-social-approval/generated/campana-marketing-pdf-2026-07/instagram/carrusel-5-senales/`
- Create: `n8n-social-approval/generated/campana-marketing-pdf-2026-07/whatsapp/`
- Create: `n8n-social-approval/generated/campana-marketing-pdf-2026-07/facebook/`
- Create: `n8n-social-approval/generated/campana-marketing-pdf-2026-07/source/`
- Create: `n8n-social-approval/generated/campana-marketing-pdf-2026-07/manifest.json`

- [ ] **Step 1: Crear las carpetas de salida**

Crear las cuatro carpetas indicadas dentro de `\\notebook-oscar\programacion\vogel_consultoria\n8n-social-approval\generated\campana-marketing-pdf-2026-07` sin modificar las piezas existentes.

- [ ] **Step 2: Copiar los activos oficiales**

Copiar de forma no destructiva las tres referencias visuales y `src/assets/brand/logo-vogel-generated.png` a `source/`. Si ese logo no existe, usar `public/logo-vogel.png`.

- [ ] **Step 3: Crear el manifiesto inicial**

Crear un JSON con esta estructura y 13 entradas:

```json
{
  "campaign": "campana-marketing-pdf-2026-07",
  "status": "draft_generation",
  "n8n": "not_touched",
  "assets": [
    {
      "id": "instagram-01-portada",
      "platform": "instagram",
      "topic": "5 señales de automatización",
      "width": 1080,
      "height": 1080,
      "file": "instagram/carrusel-5-senales/01-portada.png",
      "status": "pending"
    }
  ]
}
```

- [ ] **Step 4: Validar el inventario**

Ejecutar un script de lectura que confirme `13` entradas, tres plataformas y que todos los destinos estén dentro del directorio de campaña. Resultado esperado: `13 assets; instagram=7; whatsapp=3; facebook=3; n8n=not_touched`.

### Task 2: Generar siete escenas para Instagram

**Files:**
- Create: `n8n-social-approval/generated/campana-marketing-pdf-2026-07/source/instagram-01-base.png`
- Create: `n8n-social-approval/generated/campana-marketing-pdf-2026-07/source/instagram-02-base.png`
- Create: `n8n-social-approval/generated/campana-marketing-pdf-2026-07/source/instagram-03-base.png`
- Create: `n8n-social-approval/generated/campana-marketing-pdf-2026-07/source/instagram-04-base.png`
- Create: `n8n-social-approval/generated/campana-marketing-pdf-2026-07/source/instagram-05-base.png`
- Create: `n8n-social-approval/generated/campana-marketing-pdf-2026-07/source/instagram-06-base.png`
- Create: `n8n-social-approval/generated/campana-marketing-pdf-2026-07/source/instagram-07-base.png`

- [ ] **Step 1: Generar la portada**

Usar ImageGen con las tres referencias. Solicitar formato cuadrado, retrato reconocible ubicado a la derecha, espacio negativo a la izquierda y un flujo fragmentado que converge en un proceso ordenado. Prohibir texto, logo, marcas de agua y cambios de identidad.

- [ ] **Step 2: Generar las cinco señales**

Realizar una llamada independiente por señal: carga duplicada, reporte dependiente, vencimiento manual, planillas dispersas y error detectado al cierre. Mantener fondo navy, interfaces sobrias, un solo foco ámbar y áreas libres para titular y bajada. No incluir retrato en estas cinco escenas.

- [ ] **Step 3: Generar el cierre**

Usar las tres referencias para crear un encuadre distinto del retrato, con un único proceso resaltado como punto de inicio y espacio para CTA. Prohibir texto, logo y marcas de agua.

- [ ] **Step 4: Revisar las siete bases**

Inspeccionar cada base a resolución completa. Rechazar cualquier salida con identidad inconsistente, manos deformadas, iconografía infantil, exceso de ámbar o texto generado.

### Task 3: Generar tres escenas para WhatsApp

**Files:**
- Create: `n8n-social-approval/generated/campana-marketing-pdf-2026-07/source/whatsapp-01-base.png`
- Create: `n8n-social-approval/generated/campana-marketing-pdf-2026-07/source/whatsapp-02-base.png`
- Create: `n8n-social-approval/generated/campana-marketing-pdf-2026-07/source/whatsapp-03-base.png`

- [ ] **Step 1: Generar automatización de procesos**

Crear una escena vertical con el retrato señalando un flujo de carga duplicada que se simplifica. Reservar 250 px visuales arriba y abajo y espacio de texto en el tercio superior.

- [ ] **Step 2: Generar IA con proceso ordenado**

Crear una escena vertical con el retrato y tres etapas visuales: proceso, integración e IA. La IA debe aparecer como última etapa y no como estética futurista dominante.

- [ ] **Step 3: Generar automatizaciones ARCA**

Crear una escena vertical con el retrato y un flujo documental que comunique control humano, evidencia y trazabilidad, sin copiar marcas ni pantallas oficiales de ARCA.

- [ ] **Step 4: Revisar las tres bases**

Validar identidad, zonas seguras, coherencia de campaña y ausencia de texto generado.

### Task 4: Generar tres escenas para Facebook

**Files:**
- Create: `n8n-social-approval/generated/campana-marketing-pdf-2026-07/source/facebook-01-base.png`
- Create: `n8n-social-approval/generated/campana-marketing-pdf-2026-07/source/facebook-02-base.png`
- Create: `n8n-social-approval/generated/campana-marketing-pdf-2026-07/source/facebook-03-base.png`

- [ ] **Step 1: Generar automatización de procesos**

Crear una composición 4:5 con el retrato y tres señales gráficas resumidas. Mantener espacio para titular y bajada sin reutilizar el recorte de WhatsApp.

- [ ] **Step 2: Generar autoridad sobre IA**

Crear una composición 4:5 con el retrato y la secuencia proceso, integración e IA. Usar una pose o recorte diferente al estado de WhatsApp.

- [ ] **Step 3: Generar automatizaciones ARCA**

Crear una composición 4:5 con el retrato y un flujo documental sobrio, diferenciada de la versión vertical de WhatsApp.

- [ ] **Step 4: Revisar las tres bases**

Validar identidad, claridad conceptual, espacio tipográfico y ausencia de texto generado.

### Task 5: Componer logo y textos finales

**Files:**
- Create: `n8n-social-approval/scripts/compose-marketing-pdf-campaign.mjs`
- Create: los 13 archivos PNG finales definidos en la especificación

- [ ] **Step 1: Escribir la validación de datos**

El script debe rechazar una entrada si falta `title`, si las dimensiones no corresponden a la plataforma, si el archivo sale del directorio de campaña o si la ruta del logo no existe.

- [ ] **Step 2: Ejecutar la validación antes de implementar la composición**

Ejecutar `node scripts/compose-marketing-pdf-campaign.mjs --validate-only`. Resultado esperado antes de completar el script: salida no cero con un mensaje específico para la primera validación pendiente.

- [ ] **Step 3: Implementar la composición**

Usar Sharp para redimensionar cada base a sus medidas exactas, superponer un overlay navy cuando haga falta, aplicar logo oficial y renderizar titulares, bajadas, CTA, dominio y numeración mediante SVG. Usar Syne para títulos y DM Sans para el resto; si las fuentes no están disponibles localmente, usar `Arial` como fallback explícito y registrar la salvedad en el manifiesto.

- [ ] **Step 4: Generar las 13 piezas finales**

Ejecutar `node scripts/compose-marketing-pdf-campaign.mjs`. Resultado esperado: `Generated 13/13 assets`.

- [ ] **Step 5: Validar dimensiones y archivos**

Ejecutar el script en modo `--verify`. Resultado esperado: `Verified 13/13 assets; errors=0`.

### Task 6: Control visual y entrega para aprobación

**Files:**
- Modify: `n8n-social-approval/generated/campana-marketing-pdf-2026-07/manifest.json`
- Create: `n8n-social-approval/generated/campana-marketing-pdf-2026-07/contact-sheet.jpg`

- [ ] **Step 1: Crear una hoja de contacto**

Generar miniaturas etiquetadas de las 13 piezas sin alterar los PNG finales.

- [ ] **Step 2: Revisar a tamaño completo**

Comprobar identidad, ortografía, contraste, logo, CTA, dominio, manos, recortes y foco ámbar en cada pieza. Corregir cualquier defecto antes de continuar.

- [ ] **Step 3: Actualizar el manifiesto**

Cambiar cada activo validado a `draft_review` y el estado de campaña a `draft_review`. Mantener `"n8n": "not_touched"`.

- [ ] **Step 4: Verificación final**

Ejecutar una comprobación que confirme: 13 PNG, dimensiones correctas, archivos no vacíos, 13 estados `draft_review`, hoja de contacto presente y `n8n=not_touched`.

- [ ] **Step 5: Entregar para aprobación**

Mostrar la hoja de contacto y enlazar las tres carpetas finales. No programar publicaciones ni crear workflows.
