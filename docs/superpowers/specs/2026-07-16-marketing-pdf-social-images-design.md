# Diseño de piezas sociales basadas en el resumen de marketing

Fecha: 2026-07-16

## Objetivo

Crear un paquete de 13 piezas visuales para Vogel Consultoría, derivadas del documento `Resumen de marketing y oportunidades comerciales.pdf`, usando el retrato de José Oscar Vogel para reforzar cercanía, autoridad y reconocimiento de marca.

La entrega comprende siete placas de un carrusel para Instagram, tres estados para WhatsApp y tres publicaciones para Facebook. Las piezas se entregarán para revisión; no se programarán ni publicarán. La planificación en n8n comenzará únicamente después de la aprobación visual del paquete completo.

## Fuentes de contenido y referencias

### Documento de contenido

- `C:\Users\Ventas\Downloads\Resumen de marketing y oportunidades comerciales.pdf`
- Contenido principal utilizado: sección 8, "Tres propuestas concretas de contenido", páginas 15 a 18.

### Referencias visuales y de identidad personal

- `generated/instagram/20260722-instagram-problema-excel-001.png`
- `generated/instagram/20260724-instagram-ia-interna-fuentes-001.png`
- `generated/instagram/20260720-instagram-senales-decision-tarde-001.png`

Las tres imágenes funcionan como referencias de identidad visual y de la apariencia del retrato. No son objetivos de edición. La generación debe preservar los rasgos identificables del retrato: hombre adulto de cabello corto gris, barba gris prolija, anteojos rectangulares oscuros, expresión profesional serena y vestimenta azul oscura.

### Manual de marca

- `docs/manual-marca-vogel-consultoria.md`

El manual es la fuente obligatoria para paleta, tipografías, tono, logo, composición y control de calidad.

## Dirección visual aprobada

Se utilizará un sistema visual ejecutivo y coherente, cercano a las tres referencias entregadas:

- Fondo principal en azul profundo o navy.
- Texto blanco y gris claro con azul institucional para énfasis.
- Ámbar como único foco secundario y en proporción restringida.
- Titulares contundentes, legibles en dos segundos.
- Retrato integrado como figura de autoridad, sin deformar ni rejuvenecer el rostro.
- Recursos tecnológicos sobrios: dashboards, tarjetas de datos, nodos, flujos e interfaces administrativas.
- Composiciones diferenciadas por plataforma; no se reutilizará una misma pieza mediante recorte automático.
- Logo oficial con margen de seguridad y sin alteraciones.
- Tono profesional, directo, argentino neutro y orientado a problemas concretos de gestión.

La opción aprobada combina una base ejecutiva con recursos tecnológicos demostrativos cuando aportan claridad y un tono más conversacional en WhatsApp.

## Sistema de marca

### Paleta

- Vogel Deep: `#0F2A44`
- Vogel Navy: `#0B2035`
- Vogel Slate: `#162F49`
- Vogel Blue: `#1E5FA8`
- Vogel Bright: `#196ECF`
- Vogel Blue Light: `#8BC5FF`
- Vogel Amber: `#F2A900`
- Vogel Gray: `#E5E7EB`
- Vogel Muted: `#8EA8C3`
- Blanco: `#FFFFFF`

Proporción orientativa: 60% azul profundo/navy, 20% azules institucionales, 15% blanco/grises y 5% ámbar.

### Tipografía

- Titulares: Syne Bold o ExtraBold.
- Bajadas, metadata y CTA: DM Sans Regular, Medium o Semibold.
- Si la herramienta generativa no reproduce la tipografía o el texto con precisión suficiente, la imagen base se generará sin texto y la composición tipográfica se aplicará de forma determinista en una segunda etapa.

### Logo

Se utilizará un activo oficial del repositorio, preferentemente:

- `src/assets/brand/logo-vogel-generated.png`
- `public/logo-vogel.png`

El logo no se generará mediante IA. Se incorporará como activo original durante la composición final.

## Estructura de entrega

Las piezas finales se guardarán dentro de:

```text
n8n-social-approval/generated/campana-marketing-pdf-2026-07/
├── instagram/
│   └── carrusel-5-senales/
│       ├── 01-portada.png
│       ├── 02-informacion-duplicada.png
│       ├── 03-reportes-dependientes.png
│       ├── 04-vencimientos-manuales.png
│       ├── 05-datos-en-planillas.png
│       ├── 06-errores-al-cierre.png
│       └── 07-cta-diagnostico.png
├── whatsapp/
│   ├── 01-automatizacion-procesos.png
│   ├── 02-ia-proceso-ordenado.png
│   └── 03-automatizaciones-arca.png
└── facebook/
    ├── 01-automatizacion-procesos.png
    ├── 02-ia-proceso-ordenado.png
    └── 03-automatizaciones-arca.png
```

Además se guardará `manifest.json` con plataforma, tema, dimensiones, texto principal, CTA, archivo final y estado inicial `draft_review`.

## Instagram: carrusel educativo

### Formato

- Siete placas de 1080 x 1080 px.
- Zona segura mínima de 72 px en los cuatro lados.
- Continuidad visual mediante posición estable del logo, numeración discreta y una línea o nodo que evoluciona de placa a placa.
- El retrato se utilizará en portada y cierre. En las placas intermedias se priorizarán visuales de proceso para evitar repetición.

### Placa 1: portada

- Titular: `5 señales de que tu empresa necesita automatizar un proceso`
- Bajada: `Problemas cotidianos que consumen tiempo y generan errores.`
- Visual: retrato a un lado y flujo fragmentado que converge en un proceso ordenado.
- Sin CTA adicional.

### Placa 2: información duplicada

- Titular: `La misma información se carga más de una vez.`
- Bajada: `Cada carga duplicada aumenta el tiempo de trabajo y la posibilidad de errores.`
- Visual: dos formularios o planillas duplicadas conectadas a un mismo dato.

### Placa 3: reportes dependientes

- Titular: `Los reportes dependen de una persona.`
- Bajada: `Cuando esa persona no está, la información no llega.`
- Visual: dashboard incompleto y una dependencia única destacada.

### Placa 4: vencimientos manuales

- Titular: `El equipo controla vencimientos manualmente.`
- Bajada: `Una alerta automática puede reemplazar horas de seguimiento.`
- Visual: calendario, alerta y flujo automático.

### Placa 5: datos dispersos

- Titular: `Los datos están distribuidos en varias planillas.`
- Bajada: `El problema no siempre es la planilla. Es la falta de integración.`
- Visual: varias planillas que confluyen en un tablero único.

### Placa 6: errores tardíos

- Titular: `Los errores se descubren al cierre del mes.`
- Bajada: `Automatizar controles permite detectar desvíos antes.`
- Visual: línea temporal con alerta temprana antes del cierre.

### Placa 7: cierre y conversión

- Titular: `No hace falta automatizar toda la empresa.`
- Bajada: `Empezá por el proceso que más tiempo consume.`
- CTA: `Solicitá un diagnóstico`
- Dominio: `vogelconsultoria.com.ar`
- Visual: retrato profesional y un único proceso destacado como punto de inicio.

## WhatsApp: tres estados

### Formato

- Tres piezas de 1080 x 1920 px.
- Contenido importante dentro de una zona segura vertical de 250 px superior e inferior para evitar superposición con la interfaz.
- Lectura inmediata, menos texto que en Facebook y CTA visible en el tercio inferior.
- El retrato aparecerá en las tres piezas con encuadres o gestos distintos pero identidad consistente.

### Estado 1: automatización de procesos

- Titular: `¿Tu equipo carga la misma información más de una vez?`
- Bajada: `Empezá por automatizar el proceso que más tiempo consume.`
- CTA: `Solicitá un diagnóstico`
- Dominio: `vogelconsultoria.com.ar`
- Visual: retrato señalando un flujo de carga duplicada que se simplifica.

### Estado 2: IA con procesos ordenados

- Titular: `La IA no debería ser el punto de partida.`
- Secuencia: `Primero, ordenar. Después, integrar. Finalmente, aplicar IA.`
- CTA: `Conocé IA aplicada al negocio real`
- Dominio: `vogelconsultoria.com.ar/inteligencia-artificial/`
- Visual: retrato junto a tres etapas conectadas; IA aparece como la última etapa, no como adorno futurista.

### Estado 3: automatizaciones ARCA

- Titular: `Menos tareas repetitivas. Más tiempo para asesorar.`
- Bajada: `Automatizaciones ARCA para estudios contables.`
- CTA: `Solicitá una demo breve`
- Dominio: `vogelconsultoria.com.ar/automatizaciones/`
- Visual: retrato y flujo documental con control humano, evidencia y trazabilidad.

## Facebook: tres publicaciones

### Formato

- Tres piezas de 1080 x 1350 px.
- Titular legible en feed y bajada de hasta dos líneas.
- Más contexto visual que WhatsApp, sin convertir la placa en un documento.
- CTA y dominio visibles.

### Publicación 1: automatización de procesos

- Titular: `5 señales de que necesitás automatizar un proceso`
- Bajada: `Doble carga, reportes dependientes y controles tardíos consumen tiempo y aumentan errores.`
- CTA: `Solicitá un diagnóstico`
- Dominio: `vogelconsultoria.com.ar`
- Visual: retrato acompañado de tres señales gráficas resumidas.

### Publicación 2: autoridad sobre IA

- Titular: `La IA no debería ser el punto de partida.`
- Bajada: `Primero ordená el proceso. Después integrá la información. Aplicá IA donde genere valor.`
- CTA: `Conocé nuestras soluciones de IA`
- Dominio: `vogelconsultoria.com.ar/inteligencia-artificial/`
- Visual: retrato y secuencia proceso, integración e IA con jerarquía clara.

### Publicación 3: automatizaciones ARCA

- Titular: `Menos tareas repetitivas. Más tiempo para asesorar.`
- Bajada: `Automatizaciones ARCA con control humano, evidencia y trazabilidad.`
- CTA: `Solicitá una demo breve`
- Dominio: `vogelconsultoria.com.ar/automatizaciones/`
- Visual: retrato y flujo contable/documental sobrio.

## Método de producción

1. Preparar un recorte de referencia del retrato a partir de las imágenes aprobadas, sin modificar los originales.
2. Generar fondos y escenas por pieza con ImageGen, tratando las imágenes provistas como referencias de identidad y estilo.
3. Seleccionar una variante por pieza según fidelidad del retrato, claridad conceptual y coherencia de campaña.
4. Componer logo y texto de forma determinista cuando sea necesario para garantizar ortografía y consistencia tipográfica.
5. Guardar los archivos finales y el manifiesto en las carpetas definidas.
6. Revisar visualmente las 13 piezas a tamaño completo y en miniatura móvil.
7. Entregar el paquete con estado `draft_review` y esperar aprobación. No crear ni modificar flujos de n8n en esta fase.

## Invariantes del retrato

- Mantener identidad facial, edad aparente, tono de piel, cabello, barba y anteojos.
- Mantener una expresión profesional, segura y cercana.
- Evitar cambios de contextura, rejuvenecimiento, embellecimiento artificial o rasgos genéricos.
- Evitar manos deformadas, dedos adicionales, recortes incómodos o posturas imposibles.
- La ropa debe permanecer dentro de la gama azul oscuro o navy, salvo que una pieza requiera una variante sobria coherente con la marca.

## Restricciones

- No programar ni publicar contenido.
- No modificar flujos, credenciales ni configuraciones de n8n.
- No inventar testimonios, cifras, resultados ni promesas.
- No usar iconografía infantil, estética de ciencia ficción, robots humanoides ni colores fuera de la paleta.
- No generar el logo ni deformar activos oficiales.
- No saturar las placas con texto.
- No usar las fotografías de referencia como edit targets destructivos.

## Validación y criterios de aceptación

Cada pieza debe cumplir lo siguiente:

- Dimensiones exactas según plataforma.
- Archivo PNG legible y sin corrupción.
- Retrato reconocible y consistente con las referencias.
- Logo oficial nítido, proporcionado y con margen de seguridad.
- Paleta y jerarquía tipográfica alineadas al manual de marca.
- Texto sin errores ortográficos y dominio correcto.
- Titular comprensible en dos segundos.
- Contraste suficiente para lectura móvil.
- Un único foco ámbar por pieza.
- Recursos gráficos vinculados a datos, procesos, dashboards, IA o gestión.
- Composición diferenciada y adaptada a cada plataforma.
- Ausencia de marcas de agua, elementos extraños, manos deformadas o texto generado ilegible.

El paquete se considera aprobado únicamente cuando el usuario confirme las 13 piezas. Recién entonces se podrá elaborar un plan independiente para calendarización y publicación mediante n8n.

## Fuera de alcance

- Redacción completa de los copies de acompañamiento de cada red.
- Hashtags finales y horarios de publicación.
- Alta de piezas en base de datos o sistema de aprobaciones.
- Configuración, modificación o activación de workflows de n8n.
- Publicación real en Instagram, WhatsApp o Facebook.
