# Manual de marca - Vogel Consultoria

Version: 2026-10-04

Actualización autorizada: la decisión explícita del usuario reemplaza logo, tipografía y paleta de la web anterior. La referencia es `Consultoría tecnológica sobre paisaje de datos.png`. Las secciones 4–9 y 14–15 fijan la identidad vigente; el posicionamiento y la voz empresarial mantienen su alcance original. El baseline se conserva en `docs/history/paisaje-datos-2026-10-04/`.
Sitio de referencia: https://vogelconsultoria.com.ar/
Uso principal: guia para crear piezas visuales, landings, publicaciones, presentaciones, documentos comerciales y material institucional de Vogel Consultoria.

## 1. Esencia de marca

Vogel Consultoria es una consultora tecnologica premium orientada a empresas argentinas que necesitan ordenar operaciones, automatizar procesos, integrar datos y aplicar inteligencia artificial con impacto real en la gestion.

La marca debe transmitir:

- Claridad: tecnologia explicada en lenguaje de negocio.
- Confianza: soluciones profesionales, concretas y mantenibles.
- Precision: datos, procesos, indicadores y decisiones.
- Modernidad: estetica tecnologica, actual, sobria y ejecutiva.
- Cercania: acompanamiento practico, sin exageraciones ni promesas vacias.

Frase rectora:

> Convertimos datos y procesos en decisiones que mejoran tu rentabilidad.

Idea complementaria:

> No vendemos software. Resolvemos problemas.

## 2. Posicionamiento

Vogel Consultoria se posiciona como un socio tecnologico para empresas que quieren pasar de la operacion manual y la informacion dispersa a sistemas, dashboards, automatizaciones e IA aplicados a problemas reales.

No debe verse como:

- Una agencia creativa generica.
- Una software factory impersonal.
- Una marca experimental de IA sin criterio de negocio.
- Una empresa puramente tecnica que habla solo para programadores.

Debe verse como:

- Consultoria tecnologica con criterio ejecutivo.
- Implementacion concreta para empresas y PYMEs.
- Puente entre procesos, datos, sistemas e inteligencia artificial.
- Marca confiable para direccion, administracion, ventas y operaciones.

## 3. Personalidad verbal

### Tono

Profesional, claro, directo y orientado a resultados. La marca habla con seguridad, pero sin grandilocuencia. Explica tecnologia desde el impacto en gestion.

### Como escribir

- Usar frases cortas y concretas.
- Priorizar beneficios operativos: ahorro de tiempo, trazabilidad, datos confiables, mejores decisiones.
- Hablar de "implementar", "ordenar", "automatizar", "medir", "decidir", "mejorar".
- Usar lenguaje de empresa: procesos, indicadores, rentabilidad, gestion, equipos, direccion.
- Mantener un tono argentino neutro, cercano y profesional.

### Evitar

- Frases demasiado genericas como "transformamos tu futuro digital" sin contexto.
- Jerga tecnica innecesaria.
- Promesas absolutas tipo "duplicamos tus ventas garantizado".
- Humor excesivo en piezas institucionales.
- Uso decorativo de IA sin explicar valor concreto.

### Mensajes clave

- Sistemas a medida para ordenar operaciones.
- Dashboards ejecutivos para decidir con datos confiables.
- Automatizacion para reducir tareas repetitivas y errores.
- IA aplicada a ventas, administracion, soporte y gestion.
- Talleres practicos para adoptar IA con criterio.
- Desarrollo web con estructura comercial, SEO y foco en conversion.

## 4. Identidad visual

Paisaje de datos: base casi negra azul, luz ámbar y DM Sans. Claridad, confianza, precisión y cercanía práctica se expresan con aire, lectura estable y evidencia real. El paisaje decorativo de puntos y conexiones acompaña hero y cierre; el resto del sitio se organiza con superficies oscuras y separadores finos.

## 5. Logo

La versión principal vigente es la V ámbar vectorial, acompañada por Vogel Consultoría en DM Sans cuando corresponde.

Assets oficiales vigentes:

- `src/assets/brand/vogel-v-amber.svg`
- `public/logo-vogel-amber.svg`

Los logos OV anteriores permanecen como archivos históricos; no son la identidad para nuevas piezas. Mantener proporciones del SVG, nitidez, contraste y un margen libre mínimo del 10% de su ancho. No deformar, añadir sombras duras, efectos 3D ni contenedores recargados. El vector es la primera opción para UI y formatos escalables.

## 6. Paleta cromatica

| Nombre | HEX | Uso |
|---|---:|---|
| Vogel Navy | `#05090F` | Fondo casi negro azul |
| Vogel Deep | `#0A121B` | Superficies oscuras |
| Vogel Slate | `#101923` | Paneles y dropdown |
| Vogel Amber | `#FFBC54` | Acciones, enlaces, foco, puntos de datos |
| Vogel Gray | `#E2E5EA` | Texto de lectura y bordes con opacidad |
| Vogel Muted | `#ACB6C3` | Metadata y descripciones |
| Blanco | `#FFFFFF` | Titulares |
| Vogel Blue | `#1E5FA8` | Ilustraciones y gráficos heredados |
| Vogel Bright | `#196ECF` | Refuerzo en assets conceptuales |
| Vogel Blue Light | `#8BC5FF` | Detalles conceptuales y estados existentes |

Fuente normativa: `src/styles/tokens.css`. El fondo oscuro debe dominar; el ámbar se concentra en acción y datos luminosos. No fijar una cuota porcentual como medición del sitio. CTA principal con gradiente cálido `#FFC869` a `#F5B34C` y texto `#080D14`; su gradiente no habilita fondos ámbar extensos. Evitar gradientes multicolor y colores ajenos como protagonistas.

## 7. Tipografia

DM Sans es la fuente oficial vigente para titulares, cuerpo, UI y palabra de marca. Se autohospeda en `public/fonts/`; fallback ui-sans-serif/sans-serif. Syne y Bricolage corresponden a versiones anteriores.

Titulares grandes y moderados (pesos 450–500); acciones 600; texto de lectura 400. Diferenciar jerarquía con tamaño, interlineado y espacio. Mantener inputs de al menos 16px, contraste legible, interlineado cómodo y texto secundario claro. Para piezas sociales, reducir texto antes que reducir excesivamente su tamaño.

## 8. Sistema grafico

Paisajes de puntos, conexiones finas, dashboards, procesos y evidencia operativa. La home usa paisaje en hero y cierre, tres capturas forestales reales con datos de demostración y ocho logos SVG de clientes. FEMAG debe identificarse como proyecto en desarrollo. Oscar se presenta sin retrato hasta contar con una fotografía real autorizada.

Assets:

- `public/landscape/`: posters estáticos obtenidos del canvas de producción.
- `src/assets/brand/vogel-v-amber.svg`: V vigente.
- `src/assets/hero/` y `src/assets/services/`: ilustraciones conceptuales anteriores conservadas en algunas páginas interiores.
- `docs/social/`: material previo; revisar logo, tipografía y colores antes de reutilizarlo.

La continuidad parcial de assets azules no implica identidad absoluta entre home e interiores. Identificar demostraciones y procedencia; no usar cifras ficticias como resultados de clientes ni imágenes generadas como interfaces operativas reales.

Actualización autorizada del 2026-10-04: los ecos del paisaje acompañan toda la narrativa intermedia: Soluciones, caso forestal, clientes/proyectos, método, Oscar y recursos. Sus variantes `flow`, `evidence`, `network`, `method`, `trajectory` y `editorial` alternan fases y conexiones laterales. Las áreas de lectura se mantienen limpias, con decoración marginal e inferior; hero y contacto conservan sus paisajes vigentes. Los SVG son `aria-hidden`, sin foco ni interacción.

## 9. Composicion

Grilla sencilla, titular claro, espacio amplio, CTA concreto y visuales vinculados a datos o gestión. Cabecera abierta con V, navegación y acciones de portal/diagnóstico. Las secciones fluyen sin pins narrativos; la profundidad se concentra en el paisaje, sin shader global ni liquid glass.

En móvil, apilar columnas y conservar etiquetas/CTA en flujo para evitar superposición. Controles de 8–9px, etiquetas de 10px y paneles de 12–16px; marcos de 20px cuando corresponde. Líneas finas y separación tonal organizan el contenido. Las capacidades no requieren una tarjeta por bloque.

El paisaje es una mejora progresiva: conserva poster estático con movimiento reducido o sin WebGL, pausa fuera de pantalla y con documento oculto. Mensajes y acciones nunca dependen de su animación.

Las conexiones laterales de cinco nodos se limitan a márgenes de 64–150px (7vw), con trazos ámbar (.17) y ramificaciones azul claro (.11); se ocultan hasta 1199px inclusive. Tres ondas de 61 puntos cada una ocupan la franja inferior del padding, de 80px en escritorio y 46px en tablet/móvil; permanecen visibles en todos los tamaños. Soluciones conserva su entrada/salida tonal navy–deep.

En escritorio elegible (ancho mínimo 1024px, alto mínimo 800px, sin movimiento reducido), las ondas admiten un desplazamiento discreto de 12px a −8px ligado al scroll (`scrub: .8`), sin pin. Móvil y movimiento reducido conservan las ondas estáticas en posición neutral. La línea del método conecta cuatro nodos y progresa con scroll en ese mismo escritorio; con movimiento reducido permanece completa y en móvil usa segmentos estáticos en dos columnas. Mantener siempre lectura, foco y clics despejados.

## 10. Iconografia

Estilo recomendado:

- Iconos lineales.
- Trazo medio, simple y legible.
- Color gris claro, azul claro o ambar segun jerarquia.
- Temas: codigo, dashboard, flujo, IA, capacitacion, web, analitica, automatizacion.

Evitar:

- Iconos rellenos demasiado infantiles.
- Sets con estilos mezclados.
- Ilustraciones caricaturescas.
- Iconos 3D muy coloridos.

## 11. Voz comercial por servicio

### Sistemas a medida

Promesa:

> Plataformas disenadas para ordenar procesos, conectar areas y mejorar trazabilidad.

Palabras utiles:

- operaciones
- trazabilidad
- usuarios y permisos
- procesos criticos
- informacion integrada
- reportes operativos

### Dashboards ejecutivos

Promesa:

> Indicadores claros para decidir con datos confiables.

Palabras utiles:

- KPIs
- ventas
- stock
- costos
- rentabilidad
- direccion
- informacion en tiempo real

### Automatizacion de procesos

Promesa:

> Menos tareas repetitivas, menos errores y mas foco en trabajo de valor.

Palabras utiles:

- tareas manuales
- copiar y pegar
- alertas
- integraciones
- reglas de negocio
- ahorro de tiempo

### Inteligencia artificial aplicada

Promesa:

> IA aplicada donde realmente genera valor: analisis, asistentes, automatizacion y decisiones.

Palabras utiles:

- asistentes internos
- analisis de documentos
- respuestas automatizadas
- soporte a gerentes
- criterio y seguridad
- adopcion gradual

### Talleres IA

Promesa:

> Capacitacion practica para que equipos usen IA con criterio y utilidad real.

Palabras utiles:

- ejercicios aplicados
- tareas reales
- buenas practicas
- riesgos
- oportunidades
- equipos

### Desarrollo web

Promesa:

> Sitios claros, rapidos y orientados a conversion.

Palabras utiles:

- responsive
- SEO tecnico
- estructura comercial
- contacto
- confianza
- servicios

## 12. Copy listo para piezas

### Titulares

- Sistemas, automatizacion e IA para aumentar rentabilidad.
- Converti datos y procesos en mejores decisiones.
- Tu empresa ya tiene datos. Falta convertirlos en decisiones.
- Menos tareas repetidas. Mas gestion con informacion confiable.
- Dashboards ejecutivos para decidir con claridad.
- Automatizacion real para procesos que hoy consumen tiempo.
- IA aplicada al negocio real, no a la moda.
- Ordenamos procesos para que la tecnologia trabaje a favor de tu empresa.

### Bajadas

- Implementamos soluciones concretas para ordenar operaciones, ahorrar tiempo y decidir con datos confiables.
- Desarrollamos sistemas, dashboards, automatizaciones e IA para que tu empresa tenga mas control y menos carga manual.
- Relevamos tu proceso, detectamos oportunidades y construimos soluciones aplicables al trabajo diario.
- Ayudamos a equipos y lideres a adoptar tecnologia con criterio, seguridad y foco en resultados.

### CTAs

- Agendar reunion
- Hablar por WhatsApp
- Ver soluciones
- Consultar por un dashboard
- Automatizar un proceso
- Quiero aplicar IA
- Solicitar diagnostico

## 13. Formatos recomendados

### LinkedIn feed

- Formato: 1200 x 1200 px o 1200 x 1500 px.
- Uso: contenido institucional, casos, consejos, servicios.
- Composicion: titular fuerte, bajada breve, visual de dashboard o nodos, logo.
- Texto maximo sugerido en placa: 12 a 20 palabras.

### LinkedIn portada

- Formato: 1584 x 396 px.
- Uso: propuesta de valor y servicios principales.
- Mantener contenido importante lejos de los extremos.
- Recomendado: logo, dominio, servicios clave y visual de dashboard.

### Historias / WhatsApp / Instagram vertical

- Formato: 1080 x 1920 px.
- Uso: avisos, saludos, eventos, invitaciones.
- Titular arriba, visual en el centro, CTA o contacto abajo.
- Aumentar tamano de texto para lectura movil.

### Presentaciones

- Formato: 16:9.
- Portada con fondo casi negro azul, V ámbar, DM Sans, titular y visual técnico.
- Slides internas con mucho aire, maximo 3 ideas por slide.
- Usar ambar solo para destacar el concepto principal.

### Documentos comerciales

- Fondo blanco permitido en documentos comerciales, con encabezados casi negro azul y DM Sans.
- Usar ambar para separadores, bullets o llamados.
- Mantener tipografia sobria.
- Incluir logo en portada y pie de pagina.

## 14. Prompt base para generar piezas visuales

Usar este prompt como base y adaptar formato, mensaje y destino:

```text
Crear una pieza visual para Vogel Consultoria, consultoría tecnológica premium para empresas argentinas. Usar fondo casi negro azul (#05090F / #0A121B), paneles #101923, acento ámbar #FFBC54, texto blanco/gris #E2E5EA y DM Sans en todos los niveles. Logo vigente: V ámbar SVG. Visuales de paisaje de datos, dashboards, conexiones y procesos; composición sobria, clara y confiable. Las ilustraciones azules anteriores solo son continuidad conceptual cuando su uso está justificado.

Mensaje principal: "[TITULAR]"
Bajada: "[BAJADA]"
CTA o dato: "[CTA]"
Formato: [MEDIDAS]

Usar jerarquia clara, mucho contraste, logo de Vogel Consultoria con buen margen de seguridad, un unico foco ambar y visuales de tecnologia aplicada a gestion real. Evitar imagenes stock genericas, exceso de texto, colores fuera de paleta, iconografia infantil o promesas exageradas.
```

## 15. Checklist antes de publicar una pieza

- La V ámbar oficial se ve nítida y no está deformada.
- La pieza usa casi negro azul como base visual y DM Sans en todos los niveles.
- El ambar aparece como acento, no como color dominante.
- El titular se entiende en pocos segundos.
- El texto tiene buen contraste en mobile.
- La imagen o grafica remite a datos, procesos, dashboards, IA o gestion.
- El tono es profesional y concreto.
- Hay un CTA claro cuando la pieza busca conversion.
- No hay promesas imposibles de comprobar.
- El dominio o contacto aparece cuando corresponde.

## 16. Referencias usadas

- Sitio publico: https://vogelconsultoria.com.ar/
- Paleta y fuentes: `src/styles/tokens.css`, `tailwind.config.js`, `src/styles/home.css`, `DESIGN.md`
- Mensajes y servicios: `src/components/HeroSection.vue`, `src/components/ServicesSection.vue`, `src/data/servicePages.js`
- Logo y assets: `src/assets/brand/`, `src/assets/hero/`, `src/assets/services/`
- Piezas sociales existentes: `docs/social/`
