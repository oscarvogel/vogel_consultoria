# Storyboard y contrato del rediseño — 2026-10-03

## Dirección confirmada
Lectura: sitio institucional B2B para dirección y equipos de empresas argentinas, con lenguaje tecnológico ejecutivo e inmersivo. Modo principal: Persuade; recursos: Read; caso y proyectos: Experience.

Primer viewport: titular Bricolage Grotesque de gran escala junto al diagnóstico como acción principal. No lleva mockup encima del fondo: las pantallas reales se reservan para el capítulo forestal. Un único canvas del componente original [Waves shader de 21st.dev](https://21st.dev/@sifan.s.f.zhao/components/waves-shader) permanece detrás de todo el documento; se conserva su shader con paleta Vogel, grano, movimiento de cursor contenido y retorno neutral al quedar inactivo. El ámbar queda reservado para la acción.

## Secuencia
Hero → fricciones/soluciones → campo/revisión/dashboard → bento de servicios → FEMAG y galería web → cuatro pasos de metodología → capacitación/encuesta → recursos → nosotros → contacto.

Caso: captura, revisión y dashboard en split screen con pantalla fija en escritorio, cambio ligado al scroll y recorrido acotado a dos alturas; en tablet/móvil cada etapa queda en flujo normal. Metodología: título sticky y progreso sincronizado con cuatro pasos en escritorio. Galería: scroll horizontal manual con controles en escritorio y lista vertical móvil. Frase cinética de entrada única; reveals editoriales en las páginas institucionales. GSAP mejora la lectura, sin secuestrar el scroll y con contenido visible bajo movimiento reducido o si falla el código.

## Muestras de componentes
Botón principal: ámbar con texto navy; secundario: borde y texto gray sobre navy. Enlace de lectura: blueLight. Panel: slate sólido con borde tenue. Campo: navy con texto gray y placeholder muted opaco. Encabezado: único uso de transparencia/blur.

## Contenido conciliado
La producción incluye FEMAG (en desarrollo), mantenimiento de equipos, integraciones con WhatsApp y el enlace de encuesta del portal. El clon b858128 no los contiene. Preservar esos contenidos, incorporar las dos landings y mantener la encuesta institucional existente.

## Evidencia y límites
Las capturas de registro_produccion muestran interfaces del producto con fixtures; no prueban impacto económico, desempeño del backend ni resultados de un cliente. Toda cifra visible se identifica como demo. El sistema fuente no será rediseñado.

La tipografía de display final es Bricolage Grotesque variable, autohospedada con licencia SIL OFL; DM Sans se conserva para lectura y UI. El logo y los colores siguen el manual obligatorio. Capturas iniciales y finales reproducibles, además del estado de controles y rutas, se registran en `redisenio-implementacion-2026-10-03.md` y `capturas/fase-final-2026-10-03/`.

## Criterios de cierre
390×844 y 1440×1000, tablet, enlaces y teclado, reduced motion, estados de formulario con respuestas simuladas, build y comprobaciones del sitio. Screenshots iniciales/finales guardadas y comparación documentada. No publicar.
