# Plan de migracion SSR/SSG (marketing)

## Objetivo

Reducir Time to Content y mejorar indexacion SEO renderizando HTML en servidor o en build para las rutas de marketing.

## Opcion recomendada: Nuxt 3 + prerender

1. Crear rama de migracion: `git checkout -b feat/nuxt-ssg`.
2. Inicializar Nuxt 3 en la misma raiz o en carpeta `nuxt-app/`.
3. Copiar componentes actuales de `src/components` a `components/`.
4. Crear paginas:
   - `pages/index.vue`
   - `pages/ia.vue` (o `pages/ia/index.vue`)
5. En `nuxt.config.ts` habilitar prerender:

```ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ["/", "/ia"],
    },
  },
});
```

6. Migrar metadatos por pagina con `useSeoMeta` y JSON-LD en server.
7. Validar Lighthouse y Search Console antes de reemplazar deploy.

## Alternativa minima: Vite SSG

Si se quiere mantener Vite puro, migrar a `vite-ssg` con Vue Router y dos rutas estaticas (`/` y `/ia`).

## Criterios de aceptacion

- HTML prerenderizado disponible sin JS para home e IA.
- LCP movil < 2.5 s en red 4G simulada.
- OG/Twitter cards validas.
- H1 unico y landmarks accesibles en cada pagina.
- Core Web Vitals y rastreo sin errores criticos.
