# SSR / SSG — estado actual y recomendación

Este documento **no implementa nada**. Documenta cómo ven el sitio los crawlers hoy y recomienda una migración futura, separada del rediseño. No se migra a Nuxt en la Fase 05.

## Cómo está construido

- Vite con **18 puntos de entrada HTML** (la Home y 16 páginas más, con una entrada de JavaScript por tipo de página). No hay router: cada página es un documento propio y navegar entre ellas recarga.
- La Home entrega `<div id="app"></div>` y monta Vue en el cliente. El contenido de la Home (capítulos, capacidades, método, Oscar, perspectivas, formulario) **solo existe después de ejecutar JavaScript**.
- Metadatos por ruta: cada HTML trae su propio `<title>`, `description`, `canonical` y JSON-LD escritos a mano. Eso está bien y es lo más valioso del esquema actual.
- Las páginas de servicio traen un `<noscript>` con un `<h1>` y texto básico; el resto del contenido también depende de JS.
- `sitemap.xml` (15 URL), `robots.txt` y `llms.txt` son archivos estáticos mantenidos a mano.

## Problemas actuales

1. **Contenido renderizado por Vue.** Googlebot ejecuta JavaScript, pero con retraso y sin garantías; otros rastreadores y los sistemas de IA que leen HTML (`llms.txt` sugiere que importan) ven un `<div>` vacío más el `<noscript>`.
2. **El `<noscript>` de la Home es un resumen.** Describe servicios en general, pero no refleja la narrativa, el método, la trayectoria ni las perspectivas, y por tanto no compite con el contenido real.
3. **Fallback y arco espacial.** Con Phase 05 (y las anteriores) la experiencia depende de media queries y de WebGL; el HTML estático no contiene ninguno de los capítulos. Los posters de fallback son imágenes sin texto.
4. **Metadatos duplicados a mano.** Cualquier cambio de título o descripción exige editar el HTML y el sitemap; es fácil que se desalineen (por ejemplo, `llms.txt` aún lista `oscarvogel@gmail.com` mientras el sitio usa `oscar@vogelconsultoria.com.ar`).
5. **Sin pre-render de rutas internas con Vue.** Las páginas de servicio y de recursos se montan en cliente aunque su contenido sea estático.
6. **Open Graph e imágenes.** Dependen de lo que escriba cada HTML; no hay una fuente única.

## Recomendación

Separada del rediseño y con su propia fase, con este orden:

1. **Primero, sin cambiar de framework:** pre-renderizar las páginas estáticas con Vite (`vite-ssg` o un script de build que ejecute Vue en Node y escriba el HTML por entrada). El objetivo es que el contenido esté en el HTML inicial y que Vue solo lo hidrate. Es la mejora de mayor impacto con el menor riesgo, porque conserva la estructura de 18 entradas.
2. **Una fuente de verdad para metadatos y sitemap:** generar `<title>`, `description`, `canonical`, JSON-LD, `sitemap.xml` y `llms.txt` desde los datos (`servicePages.js`, `resources.js`) en lugar de editarlos a mano.
3. **Solo después**, evaluar Nuxt (o Astro con islas de Vue) si se necesita enrutado, `useHead` por ruta o contenido administrable. Para este sitio, mayormente estático, Astro con componentes Vue sería una migración más pequeña que Nuxt.

## Requisitos al migrar

- El arco espacial debe seguir siendo solo de cliente: el HTML estático debe incluir los textos de los capítulos (los mismos que hoy están ocultos o en posters) para crawlers y para lectores de pantalla.
- Mantener las anclas de la Home (`#soluciones`, `#metodologia`, `#nosotros`, `#clientes`, `#recursos`, `#charla-ia-2026`, `#contacto`) y los `data-analytics-*`.
- El formulario sigue enviando a Web3Forms desde el cliente; no requiere servidor.
- Validar con una inspección real de URL en Search Console y una lectura sin JavaScript antes y después de la migración.

## Qué no hacer ahora

No mezclar esta migración con el cierre editorial: cambiaría a la vez la arquitectura, el HTML y el rendimiento, y no habría forma de atribuir una regresión.
