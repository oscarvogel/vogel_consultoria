# Vogel Consultoria Landing

Landing page corporativa desarrollada con Vue 3, Vite y Tailwind CSS.

## Mejoras implementadas (Mayo 2026)

- Accesibilidad: skip link, landmarks semanticos, foco visible en enlaces/botones y menu movil con ARIA.
- Conversion: formulario corto de contacto y bloque de agenda rapida.
- SEO tecnico: metadatos OG apuntando a assets reales en `public/`, favicon publico y sitemap consistente.
- Rendimiento: conversion de imagenes principales a WebP, lazy loading en imagenes no criticas y code splitting por secciones.
- Build: cache busting estable por hash, limpieza de `dist` y separacion de chunk de Vue.

## Instalacion y ejecucion

```bash
npm install
npm run dev
```

## Estructura sugerida para imagenes en assets

```text
src/assets/
  logo-vogel.png
  hero/
    network-pattern.png
    dashboard-mockup.png
  services/
    systems-icon.svg
    dashboards-icon.svg
    automation-icon.svg
    ai-icon.svg
    workshops-icon.svg
```

## Produccion

```bash
npm run build
npm run preview
```

## Analytics de conversion

La web ya queda preparada para Google Analytics 4 de forma opcional. Si no definis el ID, no carga ningun script externo ni envia eventos.

```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Para desarrollo local podes copiar ese valor a un archivo `.env`. Para produccion, lo correcto es definir `VITE_GA_MEASUREMENT_ID` en el entorno del hosting o en el pipeline de build.

La implementacion sigue el enfoque oficial de Google Analytics 4 con `gtag.js` y un ID de medicion web.

Eventos incluidos:

- `whatsapp_click`
- `email_click`
- `contact_intent_click`
- `contact_form_submit`
- `cta_click`
- `funnel_step_view`

Cada evento envia la pagina, la seccion origen y el destino del enlace o formulario para poder medir conversiones por bloque.

## Roadmap SSR/SSG (siguiente fase)

Este proyecto ya quedo preparado para dividir por secciones y optimizar carga. Para completar SSR/SSG en marketing se recomienda:

1. Migrar a Nuxt 3 y prerender de rutas estaticas (`/` y `/ia.html`) con `nitro.prerender`.
2. Mantener componentes actuales y mover cada bloque a `components/` de Nuxt.
3. Definir metadatos por pagina con `useSeoMeta` y JSON-LD server-side.
4. Conservar formularios/CTAs actuales y agregar eventos de conversion.

Detalle tecnico en `docs/ssg-ssr-migration.md`.
