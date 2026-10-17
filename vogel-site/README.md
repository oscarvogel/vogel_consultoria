# vogel-site: el sitio de Vogel Consultoría en React

Reconstrucción completa del sitio en **React 19 + React Router (modo framework, prerender) + Tailwind 4 + GSAP/Lenis**. Convive con el sitio Vue de la raíz del repositorio, que **no se toca**.

- Mismas 31 URLs que el sitemap actual (home, soluciones, 8 páginas de servicio, recursos, 13 proyectos, IA, Automatizaciones ARCA y la encuesta), con HTML estático prerenderizado por ruta.
- Reutiliza los datos de `src/data/` (copiados a `app/content/`), los assets, el formulario Web3Forms y la analítica GA4 con consentimiento.
- Dirección visual: HUD futurista con un único *light-pillar* (WebGL) que recorre el sitio, grano y paneles de vidrio. Ver "Dirección vigente 2026-10-15" en `docs/manual-marca-vogel-consultoria.md`.

## Comandos

```bash
cd vogel-site
npm install
npm run dev        # desarrollo
npm run build      # tsc + prerender de todas las rutas en build/client
npm run preview    # sirve build/client
```

Usa el mismo `.env` de la raíz (`VITE_WEB3FORMS_KEY`, `VITE_GA_MEASUREMENT_ID`, URLs de la encuesta). La fuente Chillax no se versiona por su licencia: `npm run dev` y `npm run build` la descargan con `scripts/ensure-fontshare-fonts.mjs` de la raíz.

## Publicación

Este PR **no cambia el deploy**: `scripts/deploy-ftp.ps1` sigue subiendo el sitio Vue (`dist/`). Para publicar el sitio React hay que subir `vogel-site/build/client` (o apuntar `BUILD_OUTPUT` a esa carpeta). Eso queda para decidirlo aparte.

## Datos nuevos

Cuando se agregue un proyecto en `src/data/` (`projects.js`, `projectSummaries.json`, `projectMedia.json`, `projectColors.json`, `homeCards.js`), copiar esos archivos a `vogel-site/app/content/` y los assets a `vogel-site/public/projects/`. El sitemap y las rutas se derivan de `projectSummaries.json`.
