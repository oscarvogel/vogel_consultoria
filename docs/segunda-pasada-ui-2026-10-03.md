# Segunda pasada: cards, lectura y narrativa

Fecha: 3 de octubre de 2026. Entrega local sobre `codex/redisenio-institucional-vogel`.

## Corrección posterior: restaurar el fondo aprobado

El usuario rechazó el plano navy al 80% porque tapaba el shader aprobado. Se retiraron `main::before`, su token y el cambio de tinta de la navbar asociado a ese plano. El shader conserva su fuente, colores, animación e intensidad; las cards y transiciones de la segunda pasada permanecen. La legibilidad debe resolverse en textos y componentes, sin overlays globales ni fondos de sección.

Las capturas vigentes de esta corrección están en `capturas/segunda-pasada-2026-10-03/fondo-restaurado/`, en 1440×1000 y 390×844 para Inicio y Recursos. Se tomaron con movimiento reducido para mostrar el texto completo; no prueban el ritmo de las animaciones. El reporte confirma un canvas, ausencia de pseudo-elemento de cobertura en `main`, navbar transparente y ausencia de overflow horizontal. La prueba de contraste vuelve a cubrir 15 pares sobre superficies sólidas; los tres pares calculados con el plano retirado ya no aplican. El contraste del texto directamente sobre el shader sigue requiriendo revisión específica.

Los apartados siguientes registran la primera implementación de esta pasada y su evidencia histórica; las referencias al plano navy y a los 18 pares no describen el estado corregido.

## Dirección y referencias

Sitio institucional B2B para empresas argentinas: conservar identidad, shader azul único, navegación transparente y narrativa por scroll. Se aplicaron Anti UI Slop, Impeccable, Taste, Emil Design Engineering, Web Design Guidelines y UI/UX Pro Max como criterios de análisis y ejecución, respetando el manual de Vogel.

- [Aerleum — Technology](https://aerleum.com/technology/): inspección de la página publicada, su composición editorial y texto dividido por caracteres. Se toma el ritmo de aparición y jerarquía, conservando la identidad Vogel. La inspección visual es puntual; no constituye una auditoría de esa web.
- [GSAP — SplitText](https://gsap.com/docs/v3/Plugins/SplitText/): splitting por palabras y caracteres, nombres accesibles y restauración del HTML. El plugin ya pertenece a la versión instalada de GSAP; no se agregaron dependencias.
- [Vercel — Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md): estados, foco, semántica de enlaces, imágenes con dimensiones y movimiento reducido.

## Hallazgos y decisiones

| Before | After | Why |
| --- | --- | --- |
| Texto secundario Muted sobre zonas claras del shader | Un plano navy continuo bajo `main`, con texto secundario Gray completo | Estabilizar la lectura sin reiniciar el shader entre capítulos |
| Cards de servicio y proyecto con hover azul al 25%, que deja pasar el fondo | Fondos navy/deep sólidos en reposo y hover | Conservar contraste durante la interacción |
| Nueve cards de servicio con jerarquía similar | Dos piezas principales de proporciones distintas y catálogo de siete enlaces | Distinguir servicios principales sin repetir cajas en todo el catálogo |
| Tres cards de Recursos casi transparentes | Índice editorial sobre una superficie compartida, con categoría, tiempo, resumen y destino | Facilitar lectura y comparación; cada fila es un solo enlace |
| Entrada de bloques desde opacidad cero | Movimiento contenido con opacidad completa | Evitar que párrafos y superficies pierdan contraste durante la entrada |
| Cambio de captura en un tramo de scroll muy corto | Crossfade de 550 ms interrumpible, índice y progreso de tres etapas | Comprender la relación entre el texto y la pantalla, también al invertir scroll |
| Titulares estáticos o entrada del bloque completo | SplitText en hero y títulos seleccionados; caracteres con desplazamiento 18% y opacidad inicial .8 | Dar ritmo sin ocultar párrafos ni esperar un efecto de escritura largo |
| Máscaras que recortaban glifos durante la primera implementación de esta pasada | Revelación sin máscara, con restauración del HTML original | Evitar cortes en títulos grandes con interlineado compacto |
| Letras e iconos claros sobre el shader claro de la navbar inicial | Tinta navy al inicio; blanca al pasar sobre el contenido oscuro | Mejorar lectura manteniendo el fondo de la navbar transparente |

## Implementación

- Shader: se conserva un único canvas fijo. El plano de lectura es un `main::before` continuo; no hay un shader por sección. La navbar queda fuera de ese plano.
- Tokens: `--reading-plane-opacity: .8`. En el contenido, el rol secundario usa el Gray oficial; los valores de la paleta original permanecen disponibles.
- Tipografía: Bricolage Grotesque y DM Sans; se corrige el tracking del hero a `-.04em`. SplitText se carga como chunk independiente y sólo se usa en encabezados elegidos. Los párrafos y controles conservan su texto normal.
- Movimiento: entradas sin desvanecer bloques completos. La etapa forestal se mide otra vez al refrescar/redimensionar; una nueva etapa interrumpe la transición anterior. En móvil, pantallas cortas y movimiento reducido sigue disponible el recorrido estático. Los contextos y tweens se limpian al desmontar.
- Contenido y contratos: se mantienen servicios, rutas, anchors, destinos, CTA, analytics, formularios y enlaces al portal. Las capturas forestales continúan identificadas como interfaz real con datos ficticios.

## Evidencia

La línea base de esta pasada se guarda en `capturas/segunda-pasada-2026-10-03/before/`, separada de la línea base original del proyecto. La primera inspección de la implementación está en `after/`; mostró el recorte de máscaras que se corrigió. La confirmación está en `final/`, en 1440×1000 y 390×844, para Inicio, Soluciones, Caso forestal, Servicios, Recursos y Nosotros.

Las capturas finales estabilizan únicamente los tweens de encabezados a su estado final para evitar imágenes a mitad de aparición con WebGL por software. La navegación, el contenido y el shader proceden de la web local renderizada. La comprobación del comportamiento del caso y de movimiento reducido se ejecuta por separado, sin forzar el avance de esos tweens. No se midió FPS en dispositivos físicos.

| Superficie | Antes | Confirmación |
| --- | --- | --- |
| Servicios, escritorio | [Antes](capturas/segunda-pasada-2026-10-03/before/1440-servicios.png) | [Final](capturas/segunda-pasada-2026-10-03/final/1440-servicios.png) |
| Recursos, escritorio | [Antes](capturas/segunda-pasada-2026-10-03/before/1440-recursos.png) | [Final](capturas/segunda-pasada-2026-10-03/final/1440-recursos.png) |
| Soluciones, móvil | [Antes](capturas/segunda-pasada-2026-10-03/before/390-soluciones.png) | [Final](capturas/segunda-pasada-2026-10-03/final/390-soluciones.png) |

Estados complementarios y tablet: `capturas/segunda-pasada-2026-10-03/estados/`.

## Validaciones realizadas

- `npm test`: pasan las comprobaciones existentes de catálogo, entradas HTML, build inputs, navegación, iconos, analytics, recursos, casos, portal y CV.
- `npm run build`: correcto; SplitText queda en un chunk separado de aproximadamente 3.47 kB gzip.
- `npm run test:contrast`: 18 pares válidos. Sobre blanco detrás del plano navy al 80%, Gray da 7.07:1 y Blue Light 4.80:1. No se usa una simulación de navbar opaca para certificar vidrio transparente.
- `node scripts/capture/second-pass-checks.mjs`: confirma etapas 0 → 1 → 2 → 1 → 0, una captura completamente visible después de cada transición, limpieza de `aria-hidden` y estilos al reducir movimiento, y limpieza de texto fragmentado.
- Tablet 1199×900: sin overflow horizontal; el menú abre y Escape lo cierra.
- Recursos, Sistemas a medida, IA, Automatizaciones y Encuesta: respuesta local 200, un único canvas, plano compartido y sin overflow en la comprobación de escritorio. No se volvió a simular el envío de todos los formularios en esta pasada.
- Las capturas y los reportes corresponden al entorno local. No certifican todas las superficies anidadas, todos los frames del shader ni todas las combinaciones de navegador/dispositivo.

Los cambios permanecen locales, sin commit, push ni publicación.
