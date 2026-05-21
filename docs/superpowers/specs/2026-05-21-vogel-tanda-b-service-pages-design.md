# Tanda B - Paginas de servicios SEO/GEO

Fecha: 2026-05-21
Rama: `codex/vogel-tanda-b`

## Objetivo

Crear cinco paginas individuales de servicios para ampliar la captacion organica, mejorar la citabilidad en motores generativos y aumentar conversiones hacia WhatsApp con mensajes segmentados.

Paginas incluidas:

- `/sistemas-a-medida/`
- `/dashboards-ejecutivos/`
- `/automatizacion-de-procesos/`
- `/desarrollo-web/`
- `/talleres-ia/`

La pagina actual `/ia.html` queda como pagina principal de inteligencia artificial para empresas. No se migra en esta tanda para evitar romper una URL ya publicada y validada.

## Alcance aprobado

La Tanda B implementa la opcion recomendada: cinco paginas de servicio con un layout reusable, contenido SEO/GEO, schema `Service` + `FAQPage`, CTAs especificos y enlaces internos desde la home.

No incluye todavia:

- Blog o seccion de recursos.
- Casos de exito completos.
- Migracion de `/ia.html` a `/inteligencia-artificial-empresas/`.
- CMS o panel de edicion.
- Integracion con Search Console/Bing desde el codigo.

## Arquitectura

El proyecto usa Vue 3 con Vite y multiples entradas HTML en `vite.config.js`. La Tanda B mantiene ese patron para generar paginas estaticas reales sin introducir Vue Router.

Se agregara un modelo de datos centralizado para servicios y un componente reusable de pagina:

- `src/data/servicePages.js`: contenido, metadatos, FAQs, schema base, imagenes y CTA de cada servicio.
- `src/components/ServicePage.vue`: layout comun para todas las paginas de servicio.
- `src/service-page.js`: entrypoint Vue que detecta el servicio segun `data-service-id` en el nodo raiz.
- `servicio/index.html` por cada pagina: HTML inicial con metadatos, JSON-LD y fallback `noscript`.

Este enfoque evita duplicar componentes, mantiene HTML indexable por URL y permite que Vite genere assets hasheados para cada pagina.

## Experiencia de usuario

Cada pagina debe abrir directamente en una experiencia comercial, no en una landing generica. La primera pantalla debe mostrar:

- Volver al sitio principal.
- Eyebrow con categoria del servicio.
- H1 orientado a busqueda.
- Respuesta corta: que hace Vogel y para quien sirve.
- CTA principal a WhatsApp con mensaje prellenado especifico.
- CTA secundario a contacto o servicios relacionados.
- Visual representativo usando assets existentes de la Tanda A.

Debajo del primer pliegue:

- Problemas que resuelve.
- Que incluye el servicio.
- Proceso de trabajo en pasos.
- Entregables esperados.
- FAQ visible.
- Bloque final de conversion.

La UI debe mantener el lenguaje visual actual: fondo azul profundo, acentos ambar, tarjetas oscuras livianas, bordes sutiles y tipografia ya configurada.

## SEO

Cada pagina debe tener:

- `<title>` unico, con servicio + Argentina + marca.
- `meta description` unico y accionable.
- canonical absoluto.
- Open Graph y Twitter Card.
- favicon y `theme-color` existentes.
- contenido visible en HTML renderizado por Vue y contenido minimo en `noscript`.
- enlaces internos desde home y entre servicios relacionados.
- inclusion en `sitemap.xml`.
- referencia en `llms.txt`.

Titulos esperados:

- `Sistemas a Medida para Empresas en Argentina | Vogel Consultoria`
- `Dashboards Ejecutivos para PYMEs en Argentina | Vogel Consultoria`
- `Automatizacion de Procesos para Empresas | Vogel Consultoria`
- `Desarrollo Web Profesional en Argentina | Vogel Consultoria`
- `Talleres de IA para Empresas y Equipos | Vogel Consultoria`

## GEO

Cada pagina debe ser facil de resumir y citar por asistentes de IA. Para eso debe incluir:

- Un bloque de respuesta corta al inicio.
- Lenguaje concreto sobre destinatarios, problemas y entregables.
- FAQs redactadas como preguntas reales.
- Aclaraciones responsables: evitar promesas absolutas o metricas sin contexto.
- `llms.txt` actualizado con las nuevas URLs y una frase breve por servicio.

La redaccion debe sonar profesional y sobria, no exagerada. Donde se hable de resultados, se usaran formulaciones como "puede reducir", "ayuda a", "segun el proceso y datos disponibles".

## Schema

Cada pagina debe declarar JSON-LD con:

- `ProfessionalService`/`Organization` referenciando a Vogel.
- `WebPage` con `inLanguage: "es-AR"`.
- `Service` con `serviceType`, `areaServed`, `provider`, `url` y `description`.
- `FAQPage` con las preguntas visibles.
- `BreadcrumbList` con Inicio > Servicio.

El JSON-LD debe ser valido JSON y no depender de strings armados manualmente dentro del componente.

## Navegacion e interlinking

Desde la home:

- Las tarjetas de servicios principales deben enlazar a sus nuevas paginas.
- La tarjeta de inteligencia artificial debe seguir enlazando a `/ia.html`.
- El bloque de desarrollo web debe enlazar a `/desarrollo-web/`.

Desde cada pagina de servicio:

- Link de regreso a `/`.
- Links a dos o tres servicios relacionados.
- CTA a WhatsApp con parametro `data-analytics-*` y mensaje segun servicio.

## Analitica

Los CTAs deben usar la infraestructura existente de `src/lib/analytics.js`. Cada boton de WhatsApp debe llevar atributos consistentes:

- `data-analytics-event="whatsapp_click"`
- `data-analytics-label="<service-id>"`
- `data-analytics-location="service_page"`

No se agrega una herramienta nueva de analitica en esta tanda.

## Accesibilidad

Requisitos:

- Un solo H1 por pagina.
- Links y botones con nombres accesibles.
- Contraste consistente con el sistema visual actual.
- Navegacion por teclado sin trampas.
- Imagenes decorativas con `alt=""`; imagen principal con alt descriptivo.
- FAQ visible con botones o estructura semantica clara.

## Testing y verificacion

Antes de cerrar:

- `npm run build` debe pasar.
- Verificar que Vite genere las cinco paginas en `dist/`.
- Validar que cada URL local responda en preview.
- Verificar que `sitemap.xml` y `llms.txt` contengan las nuevas rutas.
- Validar que los JSON-LD de las cinco paginas sean parseables con `JSON.parse`.
- Tomar screenshots desktop y mobile de al menos una pagina tipo y revisar que no haya overflow ni texto cortado.

## Criterios de aceptacion

- Las cinco paginas existen y compilan.
- La home enlaza a las paginas nuevas.
- Cada pagina tiene contenido propio, no clones superficiales.
- Cada pagina tiene metadatos y schema propios.
- `sitemap.xml` y `llms.txt` quedan actualizados.
- El build pasa sin errores.
- El diseño se siente parte del sitio actual y no como un micrositio separado.
