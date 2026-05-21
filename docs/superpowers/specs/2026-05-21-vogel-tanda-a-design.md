# Diseño - Tanda A para vogelconsultoria.com.ar

Fecha: 2026-05-21  
Proyecto: `O:\vogel_consultoria`  
Objetivo: mejorar la base tecnica, conversion inicial y preparacion SEO/GEO sin redisenar toda la web.

## Alcance aprobado

Esta tanda busca resolver problemas concretos detectados en la auditoria:

- El modal de la charla IA bloquea la primera impresion y en mobile queda cortado.
- Hay imagenes publicas pesadas que conviene optimizar.
- El sitio tiene buena base SEO, pero puede mejorar su entidad semantica y preparacion para crawlers/IA.
- El fallback sin JavaScript es demasiado pobre para explicar el negocio.
- Hay textos con tildes faltantes o detalles de pulido.

## Fuera de alcance

No se incluye en esta tanda:

- Crear paginas nuevas por servicio.
- Redisenar toda la home.
- Crear blog, recursos descargables o casos.
- Migrar de stack o cambiar Vue/Vite.
- Cambiar la identidad visual azul de Vogel.

## Cambios propuestos

### 1. Modal de charla IA

El modal actual se mantiene como pieza promocional, pero debe dejar de perjudicar la experiencia inicial.

Cambios:

- Evitar overflow horizontal en mobile.
- Asegurar que el contenido entre dentro del viewport o tenga scroll interno.
- Mantener visible el boton de cierre.
- Cerrar con tecla Escape.
- Evitar que el foco quede perdido al cerrar.
- Desactivar automaticamente el modal despues del 2026-05-27.
- Si ya no debe mostrarse, permitir que el componente no renderice nada sin romper el resto de la home.

Decision de producto:

- En esta tanda no se reemplaza por un banner. Primero se corrige y se agrega vencimiento automatico.

### 2. Performance de imagenes

Se optimizan recursos publicos pesados sin tocar la intencion visual.

Archivos objetivo:

- `public/og-image.png`
- `public/og-ia.png`
- `public/logo-vogel.png`

Cambios:

- Reducir peso de los OG manteniendo formato compatible para previews sociales.
- Generar o usar variante liviana del logo en UI cuando corresponda.
- Verificar que los assets WebP usados en la web sigan presentes y no se reemplacen por PNG pesados.

Criterio:

- No sacrificar legibilidad en previews de redes.
- No cambiar el aspecto de marca.

### 3. SEO/GEO tecnico

Se mejora la informacion estructurada y la legibilidad para buscadores tradicionales y asistentes IA.

Cambios:

- Crear `public/llms.txt` con resumen de Vogel, servicios principales, URLs importantes y contacto.
- Enriquecer JSON-LD de home y pagina IA:
  - `inLanguage: "es-AR"`
  - `areaServed: "AR"`
  - `ContactPoint`
  - `knowsAbout`
  - servicios principales
  - datos de organizacion mas completos
- Resolver `sameAs: []`:
  - Si no hay perfiles reales definidos, quitar la propiedad.
  - No inventar redes sociales.
- Mantener canonical, robots y sitemap existentes.

### 4. Contenido minimo indexable

Se mejora el contenido fallback sin JavaScript.

Cambios:

- En `index.html`, ampliar `noscript` con:
  - propuesta de valor,
  - lista de servicios,
  - enlace a `/ia.html`,
  - email y WhatsApp.
- En `ia.html`, ampliar `noscript` con:
  - propuesta de valor IA,
  - casos de uso,
  - preguntas frecuentes breves,
  - CTA por WhatsApp.

Criterio:

- El fallback debe ser simple y legible, no una segunda implementacion completa de la web.

### 5. Pulido de texto y accesibilidad

Cambios:

- Corregir tildes visibles donde falten: "hibrido", "practico", "documentacion", "Consultoria", etc.
- Revisar labels y nombres accesibles de botones tocados por esta tanda.
- Mantener `skip-link`, foco visible y `prefers-reduced-motion`.

## Arquitectura

El stack actual se conserva:

- Vue 3
- Vite
- Tailwind CSS
- HTML estatico de entrada: `index.html` y `ia.html`

Archivos probables:

- `src/components/EventModal.vue`
- `src/App.vue`
- `index.html`
- `ia.html`
- `public/llms.txt`
- `public/og-image.png`
- `public/og-ia.png`
- `public/logo-vogel.png`
- posiblemente `src/style.css`

No se agregan dependencias salvo que la implementacion demuestre que son necesarias. Para el modal se prefiere una solucion local simple antes que una libreria.

## Verificacion

Antes de cerrar la tanda:

- Ejecutar `npm run build`.
- Abrir preview local y revisar:
  - home desktop,
  - home mobile,
  - `/ia.html` desktop,
  - `/ia.html` mobile.
- Verificar que el modal:
  - no se corta en mobile,
  - se puede cerrar,
  - cierra con Escape,
  - no aparece despues de la fecha configurada.
- Verificar que `robots.txt`, `sitemap.xml` y `llms.txt` respondan en build/preview.
- Revisar visualmente que los OG/logo optimizados no pierdan legibilidad.

## Riesgos y mitigaciones

- Riesgo: romper el modal existente al corregir foco y responsive.  
  Mitigacion: cambios localizados en `EventModal.vue` y prueba manual.

- Riesgo: bajar demasiado la calidad de imagenes OG.  
  Mitigacion: comparar peso y render visual antes de aceptar.

- Riesgo: inventar datos estructurados no reales.  
  Mitigacion: solo usar datos existentes en la web; no completar redes sociales si no estan confirmadas.

- Riesgo: tocar archivos ya modificados en el repo.  
  Mitigacion: leer los archivos antes de editar y mantener cambios acotados.

## Resultado esperado

Al finalizar, la web debe conservar su aspecto general, pero:

- cargar con recursos publicos mas livianos,
- presentar mejor la primera impresion,
- tener un modal usable en mobile,
- ofrecer mejor informacion a crawlers y asistentes IA,
- quedar preparada para la siguiente fase de paginas de servicio.
