# Línea base para las correcciones de Vogel

Fecha: 2026-10-04. Rama: `codex/redisenio-institucional-vogel`.
Commit inicial: `aaf18d16cc834aaf6c5338e293ba4d2e2fa40986`.

## Evidencia previa

La auditoría del build local cargó fuentes e imágenes en Chromium con movimiento reducido. A 390 × 844 el documento medía 22.382 px; a 1440 × 1000, 16.729 px en flujo sin pins. El recorrido animado de escritorio tiene otra longitud y se conserva.

Alturas móviles: Hero 765; Problemas 2.504; caso forestal 3.570; Servicios 4.108; Proyectos 2.712; metodología 1.205; capacitación 1.395; Recursos 1.379; Nosotros 3.010; contacto 1.235 px.

El build ya mostraba SVG compilados, dos CTA en el hero, cinco destinos principales y marca visible en la navbar. No se observó desbordamiento horizontal. Persistían textos incrustados en imágenes de servicios, imagen de Automatización reutilizada para ContaFlow, falta de tildes, email inconsistente y contacto sin teléfono.

El sitio publicado conserva una versión anterior: 0 SVG en Servicios, hero con encuesta y varios CTA, logos remotos y otras diferencias de estructura. Sus defectos no describen todos el rediseño local.

Capturas previas locales: `C:/Users/roman/AppData/Local/Temp/vogel-review-2026-10-04/`, prefijos `build` y `publicado`, tamaños 1440 y 390, secciones inicio/servicios/nosotros/contacto. Las capturas y grabaciones se mantienen fuera de Git por decisión del usuario. Esta evidencia estática no acredita fluidez ni contraste del shader en todos sus frames.

## Límites acordados

Se preservan shader, navbar transparente y coreografía de escritorio. Compactación móvil por debajo de 640 px. Contacto directo sin calendario; teléfono opcional. Retrato de Oscar pendiente del archivo real que aportará el usuario. Sin publicación, commit ni push durante esta entrega.
