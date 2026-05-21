# Auditoria frontend, SEO y GEO - vogelconsultoria.com.ar

Fecha de auditoria: 2026-05-21  
Sitio auditado: https://vogelconsultoria.com.ar/  
Paginas revisadas: `/` y `/ia.html`

## Resumen ejecutivo

El sitio tiene una base tecnica buena: HTTPS, `robots.txt`, `sitemap.xml`, canonical, metadatos Open Graph/Twitter, JSON-LD, carga comprimida con Brotli y una identidad visual consistente en tonos azules. La pagina `/ia.html` esta especialmente bien orientada a conversion y ya incluye FAQ schema.

Las mejoras con mayor impacto no son rehacer todo, sino aumentar la cantidad de contenido indexable y citable, corregir el modal de la charla en mobile, optimizar recursos pesados y convertir cada servicio importante en una pagina propia con evidencia, casos y preguntas frecuentes.

## Hallazgos principales

| Prioridad | Area | Hallazgo | Impacto | Recomendacion |
|---|---|---|---|---|
| Alta | UX / conversion | La home abre con un modal de la charla IA. En mobile se ve cortado horizontalmente y bloquea el mensaje principal. | Puede bajar conversion, dificultar lectura inicial y dar sensacion de sitio "eventual" en vez de consultoria permanente. | Ajustar responsive del modal, agregar foco accesible y desactivarlo automaticamente despues del evento. Considerar banner inline en vez de modal para visitantes nuevos. |
| Alta | SEO / GEO | El HTML inicial contiene casi todo el contenido dentro de Vue/JS. El fallback `noscript` es muy corto. | Google suele renderizar JS, pero algunos crawlers, previews, bots de IA y auditorias semanticas pueden ver poco contenido. | Pre-renderizar contenido clave o enriquecer HTML estatico con secciones principales, servicios y FAQs. |
| Alta | Contenido | Solo hay dos URLs indexables: home e IA. | Limita rankings por servicios especificos y reduce autoridad tematica. | Crear paginas dedicadas para sistemas a medida, dashboards, automatizacion, desarrollo web, talleres IA y casos por industria. |
| Alta | GEO | Hay afirmaciones potentes como "-40%", "x3", "impacto real en semanas", pero sin fuente o caso verificable. | Las IA citan mejor contenido con evidencia, numeros explicados y contexto. Sin respaldo puede parecer marketing generico. | Agregar casos breves, metodologia de medicion, rangos realistas y aclaraciones tipo "segun diagnostico/proyecto". |
| Media | Performance | Recursos publicos grandes: `og-ia.png` 1.6 MB, `og-image.png` 1.4 MB, `logo-vogel.png` 888 KB. El modal usa el PNG grande del logo. | Aumenta transferencia cuando se abre modal/previews y puede afectar LCP si se carga arriba del pliegue. | Comprimir OG a 1200x630 WebP/JPEG optimizado, usar logo WebP/SVG liviano en UI y reservar PNG pesado solo si hace falta. |
| Media | SEO tecnico | Los assets JS con hash no muestran `Cache-Control` largo, mientras algunos CSS/imagenes si. | Pierde eficiencia en visitas repetidas. | Configurar Apache para `Cache-Control: public, max-age=31536000, immutable` en `/assets/*` hasheados. |
| Media | Schema | `sameAs` esta vacio; home usa Organization/WebSite/ItemList pero podria declarar servicios, persona responsable y datos de contacto mas completos. | Menos claridad de entidad para Google, Bing y asistentes IA. | Agregar `ProfessionalService` o `LocalBusiness`, `ContactPoint`, `founder`/`Person`, `knowsAbout`, `areaServed` y `sameAs` reales. |
| Media | Accesibilidad | Hay buenas bases: skip link, focus visible, labels y alt text. Pero el modal no parece usar `<dialog>` ni foco atrapado; en mobile queda cortado. | Riesgo para usuarios de teclado y lectores de pantalla. | Usar `<dialog>` o focus trap, cerrar con Escape, devolver foco al disparador y asegurar `max-width: calc(100vw - 2rem)`. |
| Media | Contenido local | Falta reforzar ubicacion/mercado: Argentina aparece, pero no hay mucha senal local o regional. | Menor relevancia para busquedas locales como "consultoria tecnologica Misiones/Argentina". | Incluir zonas atendidas, rubros, problemas locales y pagina/contacto con datos estructurados. |
| Baja | Copy / detalle | Hay textos sin tildes en algunas secciones renderizadas o fallback: "hibrido", "practico", "documentacion", "Consultoria". | Reduce percepcion de pulido profesional. | Normalizar tildes en todo el contenido visible y fallback. |

## Lo que ya esta bien

- `robots.txt` permite el rastreo y declara sitemap.
- `sitemap.xml` incluye `/` y `/ia.html`.
- Canonical correcto en ambas paginas.
- Titulos y descripciones claros, con keywords razonables.
- Open Graph y Twitter Cards configurados.
- JSON-LD presente; `/ia.html` incluye `Service` y `FAQPage`.
- La identidad visual es coherente con la marca azul de Vogel.
- Hay CTA claros hacia WhatsApp, email y formulario.
- Hay buenas practicas de accesibilidad: labels de formulario, `aria-label`, skip link y estados de foco.
- Las imagenes del sitio ya se sirven mayormente como WebP livianos en `/assets`.

## Propuestas de mejora por area

### 1. Frontend y experiencia

1. Convertir el modal de la charla en una pieza menos invasiva:
   - Desktop: modal solo una vez por sesion o banner superior.
   - Mobile: evitar ancho mayor al viewport, permitir scroll interno y asegurar boton de cierre visible.
   - Desactivar o reemplazar automaticamente despues del 2026-05-27.

2. Mejorar la primera impresion de la home:
   - Mantener el hero actual, pero hacer que "Vogel Consultoria" y la promesa principal sean visibles sin interrupcion.
   - Agregar una franja de prueba social: rubros atendidos, tipos de proyectos, herramientas o clientes si se pueden publicar.
   - Incluir un bloque "problemas que resolvemos" antes de los servicios para hablar en lenguaje de negocio.

3. Reducir friccion en conversion:
   - Agregar CTA segmentados: "Quiero un dashboard", "Quiero automatizar", "Quiero aplicar IA".
   - Cada CTA puede abrir WhatsApp con mensaje prellenado especifico.
   - Medir conversion por CTA con los `data-analytics-*` que ya existen.

4. Mejorar microcopy del formulario:
   - Campo "Objetivo principal": agregar "No estoy seguro, quiero diagnostico".
   - Despues de enviar, mostrar proximo paso esperado: "Te respondemos dentro de X horas habiles" si ese SLA es real.

### 2. SEO tecnico

1. Pre-render o HTML estatico enriquecido:
   - Ideal: generar HTML con contenido visible de cada seccion principal.
   - Alternativa rapida: mejorar `noscript` con servicios, propuesta de valor, contacto y FAQs.
   - Mejor opcion para este Vite/Vue: evaluar prerender estatico en build para `/` y `/ia.html`.

2. Configurar cache de assets:
   - `/assets/*.js`, `/assets/*.css`, `/assets/*.webp`: `Cache-Control: public, max-age=31536000, immutable`.
   - `index.html` e `ia.html`: cache corto o revalidacion.

3. Optimizar imagenes publicas:
   - `og-image.png` y `og-ia.png`: comprimir y mantener 1200x630.
   - `logo-vogel.png`: generar variante SVG/WebP liviana para UI.
   - Evitar cargar PNG grande dentro del modal si existe logo optimizado.

4. Validar schema:
   - Probar en Google Rich Results Test y Schema.org Validator.
   - Alinear preguntas visibles de FAQ con preguntas del JSON-LD.
   - Agregar `inLanguage: "es-AR"` en WebSite/WebPage/Service.

5. Search Console y Bing:
   - Verificar dominio.
   - Enviar sitemap.
   - Revisar cobertura/indexacion de `/` y `/ia.html`.
   - Agregar Bing Webmaster Tools, importante para Copilot.

### 3. SEO de contenido

Crear paginas especificas con URLs limpias:

- `/sistemas-a-medida/`
- `/dashboards-ejecutivos/`
- `/automatizacion-de-procesos/`
- `/inteligencia-artificial-empresas/` o mantener `/ia.html` y luego migrar con redirect.
- `/desarrollo-web/`
- `/talleres-ia/`
- `/casos/`
- `/casos/contadores-ia/`
- `/casos/ferreterias-tableros/` si aplica y se puede publicar.

Cada pagina deberia tener:

- H1 orientado a busqueda.
- Explicacion directa del problema.
- Que incluye el servicio.
- Proceso de trabajo.
- Entregables.
- FAQs.
- CTA especifico.
- Schema `Service` + `FAQPage`.
- Enlaces internos hacia servicios relacionados.

Ejemplo de titulo:

```html
<title>Dashboards Ejecutivos para PYMEs en Argentina | Vogel Consultoria</title>
<meta name="description" content="Diseñamos dashboards ejecutivos para ventas, stock, costos y rentabilidad. Integramos datos reales y entregamos indicadores claros para decidir mejor.">
```

### 4. GEO: optimizacion para IA y respuestas generativas

Las IA suelen citar paginas que responden bien, tienen estructura clara y aportan datos verificables. Para Vogel conviene trabajar con contenido "answer-first".

Acciones recomendadas:

1. Agregar seccion "Respuesta corta" al inicio de paginas clave:
   - "Vogel Consultoria implementa sistemas a medida, dashboards, automatizaciones e IA para empresas argentinas que necesitan ordenar procesos y decidir con datos confiables."

2. Crear FAQs mas concretas:
   - "Cuanto tarda implementar un dashboard ejecutivo?"
   - "Que datos necesito para empezar?"
   - "Se puede integrar con Excel, sistemas viejos o bases existentes?"
   - "Como se mide el retorno de una automatizacion?"
   - "Que riesgos tiene implementar IA en una empresa?"

3. Publicar casos o mini-casos:
   - Situacion inicial.
   - Solucion aplicada.
   - Resultado medido.
   - Herramientas usadas.
   - Plazo.
   - Restricciones o aprendizajes.

4. Incluir evidencia y fuentes:
   - Para IA: citar fuentes reconocidas cuando se hable de adopcion, productividad o riesgos.
   - Para resultados propios: usar datos anonimizados si no se puede nombrar al cliente.

5. Crear un archivo `/llms.txt` simple:
   - Resumen de la empresa.
   - Servicios principales.
   - Paginas importantes.
   - Contacto.
   - Casos publicados.

6. Agregar recursos citables:
   - Guia PDF: "Como detectar oportunidades de automatizacion en una PYME".
   - Checklist: "Diagnostico inicial de IA para empresas".
   - Articulo: "Dashboards: indicadores minimos para direccion".

### 5. Arquitectura de informacion

Propuesta de estructura:

```text
/
/servicios/
/sistemas-a-medida/
/dashboards-ejecutivos/
/automatizacion-de-procesos/
/inteligencia-artificial-empresas/
/talleres-ia/
/desarrollo-web/
/casos/
/casos/ia-contadores/
/recursos/
/recursos/checklist-automatizacion-pyme/
/contacto/
```

La home deberia funcionar como resumen comercial. Las paginas de servicio deben capturar busquedas especificas y demostrar experiencia.

## Backlog sugerido

### Fase 1 - Correcciones rapidas

- Corregir modal mobile y cierre accesible.
- Desactivar modal automaticamente despues de la charla.
- Comprimir `og-image.png`, `og-ia.png` y `logo-vogel.png`.
- Agregar cache largo a assets hasheados.
- Corregir tildes y fallback `noscript`.
- Alinear FAQ visible con FAQ schema en `/ia.html`.
- Completar `sameAs` o eliminarlo hasta tener perfiles reales.

### Fase 2 - SEO/GEO base

- Crear paginas individuales para servicios principales.
- Agregar schema `Service` por servicio.
- Agregar FAQs especificas por pagina.
- Mejorar contenido estatico/prerender para que el HTML inicial sea mas rico.
- Crear `/llms.txt`.
- Verificar Search Console y Bing Webmaster Tools.

### Fase 3 - Autoridad y conversion

- Publicar 3 mini-casos reales o anonimizados.
- Crear 2 recursos descargables citables.
- Agregar prueba social y rubros atendidos.
- Medir eventos de CTA y formulario.
- Iterar copy segun conversion.

## Propuesta de implementacion inicial

Para la primera tanda conviene implementar algo acotado y de alto impacto:

1. Fix del modal responsive + accesibilidad.
2. Optimizacion de imagenes publicas pesadas.
3. Mejora de JSON-LD home y `/ia.html`.
4. Creacion de `/llms.txt`.
5. Borrador de pagina nueva: `/dashboards-ejecutivos/` o `/automatizacion-de-procesos/`.

Recomendacion: avanzar primero con esta tanda. Es suficientemente chica para controlar calidad, pero ataca conversion, SEO tecnico y GEO al mismo tiempo.
