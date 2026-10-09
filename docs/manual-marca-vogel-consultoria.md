# Manual de marca - Vogel Consultoria

Version: 2026-10-06

Actualización autorizada: la decisión explícita del usuario reemplaza logo, tipografía y paleta de la web anterior. La dirección vigente autorizada toma la composición de Corea y la adapta a la identidad Vogel; las capturas de comparación se conservan localmente fuera de Git. Las secciones 4–9 y 14–15 fijan la identidad vigente; el posicionamiento y la voz empresarial mantienen su alcance original. El baseline se conserva en `docs/history/paisaje-datos-2026-10-04/`.
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

Portfolio de estudio: escenario casi negro cálido, texto crema, un carrusel horizontal de tarjetas grandes con titulares extendidos en mayúsculas y el ámbar como único acento. La referencia de lenguaje es coreastudios.com. Claridad, confianza, precisión y cercanía práctica se expresan con tarjetas amplias, aire, lectura estable y evidencia real.

## 5. Logo

El logo oficial es el de la empresa: la «C» y la «V» entrelazadas con dos nodos ámbar, y la leyenda VOGEL CONSULTORIA. Existe en dos variantes vectoriales sin fondo, pensadas para superficies oscuras (el blanco no se ve sobre claro): el símbolo y el lockup (símbolo + leyenda). Se generan desde el original del cliente con `scripts/derive-vogel-logo.mjs`. El azul del trazo y de «CONSULTORIA» tiene poco contraste sobre el azul tinta: el lockup se usa a 24 px de alto de leyenda o más; por debajo, usar el símbolo. Cuando el wordmark se renderice como texto de interfaz, utilizar Chillax con el espaciado actual.

Assets oficiales vigentes:

- `src/assets/brand/vogel-simbolo.svg` (símbolo)
- `src/assets/brand/vogel-lockup.svg` (símbolo + leyenda)
- `src/assets/brand/vogel-logo-source.png` (original del cliente)
- `public/logo-vogel.svg` (favicon), `public/logo-vogel.png`, `public/apple-touch-icon.png`, `public/og-image.png`

Los logos OV anteriores permanecen como archivos históricos; no son la identidad para nuevas piezas. Mantener proporciones del SVG, nitidez, contraste y un margen libre mínimo del 10% de su ancho. No deformar, añadir sombras duras, efectos 3D ni contenedores recargados. El vector es la primera opción para UI y formatos escalables.

## 6. Paleta cromatica

| Nombre | HEX | Uso |
|---|---:|---|
| Azul tinta (ink) | `#020f1f` | Fondo del sitio (pedido del cliente; token `--vogel-ink`, Tailwind `vogel-ink`) |
| Deep | `#06162a` | Superficies |
| Slate | `#0c1e36` | Paneles, botones secundarios, campos de formulario |
| Raised | `#142c4a` | Panel destacado de Info, controles del rail y botón Info (`--color-raised`) |
| Carbón | `#161515` | El fondo anterior; sigue disponible como `vogel-charcoal` (y `charcoal-deep`, `charcoal-slate`, `charcoal-raised`) |
| Crema | `#F3F1E2` | Titulares y texto de lectura; bordes con opacidad |
| Muted | `#A8A596` | Metadata y descripciones |
| Vogel Amber | `#FFBC54` | Único acento: acciones, enlaces, foco, contador, punto del reloj |

Fuente normativa: `src/styles/tokens.css`. Los canales `--vogel-*` conservan sus nombres históricos con estos valores. El fondo oscuro domina; el ámbar se concentra en acción y señales. CTA principal en ámbar plano con texto carbón. El azul es solo base y superficie (decisión del cliente, 2026-10-08): ningún azul vivo como acento ni como botón de acción; sin gradientes multicolor y sin colores ajenos como protagonistas. Las capturas del portfolio conservan los colores originales del proyecto; la restricción de acento corresponde a la interfaz Vogel.

**Fondo del portfolio (Home):** degradé vertical del color de marca del proyecto centrado (abajo) a carbón (arriba), con una onda lenta y un grano leve (~7 %). Es la única excepción a «sin gradientes»: el color pertenece al cliente, no a la interfaz Vogel, y nunca reemplaza al ámbar en acciones. Los colores salen de los logos de cada cliente y se normalizan a un tono oscuro en `src/data/projectColors.json` (`scripts/derive-project-colors.mjs`); el texto sobre el degradado debe mantener 4.5:1 (lo verifica `npm run test:motion`). Amitrac usa azul por decisión expresa: es el color de su marca, independiente de Vogel. Servin LGSM (cian), H21 (gris pizarra) y PyFE (azul marino de la interfaz Asiento) siguen su identidad de proyecto.

**Fondo de los destinos** (Soluciones, Recursos, Estudio, Contacto): el mismo degradé con onda y grano, en un único tono de marca, el ámbar de Vogel oscurecido (`#704d1a`, ~27 % de luminosidad), con la mezcla reducida para que el texto atenuado conserve 4.5:1 (en destinos el gris atenuado sube un paso, a `rgb(192 189 173)`). El color transiciona al girar la rueda y hace juego con la luz cálida del retrato de Oscar.

**Oscar Vogel en Estudio:** retrato recortado (fondo eliminado con un modelo de segmentación; facciones y color sin modificar) a la derecha, fijo y sangrando por el borde inferior y derecho como en la fotografía original; en tablet y móvil va en el flujo, bajo el título. El recorte fue solicitado expresamente por el titular el 2026-10-07: la autorización original de la foto decía «sin recorte» y esa condición queda registrada en `src/assets/oscar/provenance.json`.

**Arte de tarjeta:** nueve de las trece tarjetas usan ilustraciones generadas con el logo del cliente como portada (`public/projects/<id>/art*.webp`, marcadas `kind: "generated"` en `provenance.json`). FEMAG Desktop, PyFE y Mantenimiento de flotas usan capturas reales de sus aplicaciones; Vogel WhatsApp API usa un esquema conceptual rotulado como tal. El arte es decorativo; las fichas muestran evidencia real o identifican con claridad las ilustraciones.

## 7. Tipografia

Titulares en Archivo Variable (licencia OFL, paquete `@fontsource-variable/archivo`) con ancho 125%, peso 800 y mayúsculas, interlineado cerrado y tracking -0.045em; se reservan para h1/h2 y títulos de tarjeta. h3/h4 usan peso 700 y ancho 112% sin mayúsculas. Chillax se utiliza en cuerpo, navegación, controles y palabra de marca. Chillax es variable (200–700), se sirve como WOFF2 desde el dominio de Vogel con fallback ui-sans-serif/system-ui/sans-serif y se descarga del CSS API oficial de Fontshare antes de `npm run dev` y `npm run build`; no se guarda en este repositorio porque la ITF Free Font License prohíbe redistribuirla. Conservar licencia y procedencia en `docs/licencias/`.

Chillax: lectura 400, navegación y controles 500, CTA 600. Mantener inputs de al menos 16px, contraste legible e interlineado cómodo. Para piezas sociales, reducir texto antes que reducir excesivamente su tamaño.

## 8. Sistema grafico

Capturas reales como evidencia principal: desktop y mobile para sitios web y aplicaciones web, desktop para aplicaciones de escritorio. Home y grilla muestran trece fichas: el caso forestal de demostración, ocho sitios web publicados, dos aplicaciones de escritorio, una aplicación web en desarrollo y una API de integración. Las imágenes conservan sus colores originales y no llevan filtros monocromos. Los servicios viven en Soluciones y el método y el perfil de Oscar en Estudio. FEMAG Desktop, PyFE y Mantenimiento de flotas usan capturas de demostración o entornos de prueba, sin datos productivos. Vogel WhatsApp API muestra un esquema conceptual, no una captura de consola ni una prueba en vivo. Oscar conserva su fotografía real autorizada, sin retoques ni retratos generados.

Assets y procedencia:

- `src/assets/brand/vogel-simbolo.svg` y `vogel-lockup.svg`: logo oficial vigente.
- `public/projects/`: derivados WebP públicos del portfolio, con dimensiones en `src/data/projectMedia.json` y procedencia normativa en `public/projects/provenance.json`.
- `src/assets/cases/`: interfaz forestal real con datos de demostración.
- `docs/capturas/project-sources-2026-10-09/`: originales locales conservados; no incluir capturas pesadas en Git.
- `docs/social/`: revisar identidad antes de reutilizar material previo.

El caso forestal conserva Registrar → Revisar → Decidir y sus dos aclaraciones compartidas en `forestCase`. No inventar resultados, fechas, stacks o créditos. No utilizar imágenes generadas como evidencia operativa real.

## 9. Composicion

La Home sigue la composición Corea: rail izquierdo proporcional de 34.4vw, galería horizontal nativa, panorámicas 16:9 hasta 1072×603px centradas verticalmente, separación de 20px y títulos hasta 48px. La grilla muestra los mismos proyectos con proporción 4:5, gap24px y tres, dos o una columna. En 390×844px la tarjeta mide 342×608px, permite ver el siguiente proyecto y mantiene un menú propio con controles de al menos 44px.

Los destinos editoriales son `/soluciones/`, `/recursos/`, `/estudio/` y `/contacto/`: página completa carbón, paneles mates cálidos y lectura editorial a la derecha en escritorio. `/info/` se conserva solo como alias de `/estudio/` (marcado `noindex` y con canonical a `/estudio/`). Proyectos tienen rutas `/proyectos/<id>/` y lectores crema con capturas desktop/mobile. El stage permanece montado para conservar posición, foco y continuidad al cerrar, usar Escape o volver por History. Las anclas comerciales abren y enfocan su sección en el destino correspondiente.

Rueda con glide en puntero fino, drag, swipe táctil nativo y teclado; GSAP Flip enlaza vistas e imagen/lector. Movimiento reducido evita transiciones espaciales. Mensajes y acciones permanecen disponibles. Sin WebGL, videos, mockups de dispositivos, efectos de vidrio ni dependencias nuevas. Las páginas interiores existentes conservan su contenido y composición.
## 10. Iconografia

Estilo recomendado:

- Iconos lineales.
- Trazo medio, simple y legible.
- Color crema, gris cálido o ámbar según jerarquía.
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
- Portada con fondo azul tinta, logo oficial, titulares en Archivo Variable expandida, texto/UI en Chillax y visual técnico.
- Slides internas con mucho aire, maximo 3 ideas por slide.
- Usar ambar solo para destacar el concepto principal.

### Documentos comerciales

- Fondo blanco permitido en documentos comerciales, con encabezados carbón y Archivo Variable expandida; Chillax para lectura y UI.
- Usar ambar para separadores, bullets o llamados.
- Mantener tipografia sobria.
- Incluir logo en portada y pie de pagina.

## 14. Prompt base para generar piezas visuales

Usar este prompt como base y adaptar formato, mensaje y destino:

```text
Crear una pieza visual para Vogel Consultoria, consultoría tecnológica premium para empresas argentinas. Usar azul tinta #020f1f, paneles #0c1e36 y #142c4a, crema #F3F1E2, metadata cálida #A8A596 y ámbar #FFBC54 como único acento. Archivo Variable expandida 125%, peso 800, mayúsculas en titulares; Chillax en lectura/UI. Logo vigente: símbolo/lockup SVG oficial de Vogel. Presentar tecnología aplicada con evidencia real y composición sobria; las capturas de proyectos conservan sus colores originales.

Mensaje principal: "[TITULAR]"
Bajada: "[BAJADA]"
CTA o dato: "[CTA]"
Formato: [MEDIDAS]

Usar jerarquia clara, mucho contraste, logo de Vogel Consultoria con buen margen de seguridad, un unico foco ambar y visuales de tecnologia aplicada a gestion real. Evitar imagenes stock genericas, exceso de texto, colores fuera de paleta, iconografia infantil o promesas exageradas.
```

## 15. Checklist antes de publicar una pieza

- El logo oficial se ve nítido y no está deformada.
- La pieza usa carbón como base visual, Archivo Variable expandida en titulares y Chillax en lectura/UI.
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
- Paleta y fuentes: `src/styles/tokens.css`, `tailwind.config.js`, `src/components/home/`, `DESIGN.md`
- Mensajes y servicios: `src/data/projects.js`, `src/data/homeCards.js`, `src/data/forestCase.js`, `src/data/servicePages.js`
- Logo y assets: `src/assets/brand/`, `src/assets/hero/`, `src/assets/services/`
- Piezas sociales existentes: `docs/social/`
