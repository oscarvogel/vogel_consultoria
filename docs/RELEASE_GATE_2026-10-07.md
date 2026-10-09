# Release gate — versión candidata Core-A

**Fecha:** 7 de octubre de 2026
**Base:** árbol local completo de `redesign/core-a` (`HEAD 4f351f3` + cambios staged, unstaged y untracked preservados). Nada está commiteado, publicado ni desplegado.
**Resultado:** el candidato **pasa la compuerta local**. **No está listo para publicar**: quedan pendientes que dependen de cuentas, hosting, textos legales y permisos que el repositorio no puede resolver (ver «Pendientes externos»).

## Cómo reproducir

```
npm run release:gate
npm run capture:sheets -- docs/capturas/release-2026-10-07
```

`scripts/release-gate.mjs` compila, ejecuta todos los chequeos sobre `vite preview` en un puerto libre (no usa el 5198), corta en el primer fallo y escribe `docs/capturas/release-2026-10-07/results.json` con comando, código de salida, nº de comprobaciones y duración. No hace commit, push ni deploy.

## Comprobaciones y resultado

| Comprobación | Comando | Resultado |
|---|---|---|
| Build multipágina | `npm run build` | Pasó |
| Contratos y datos | `npm test` | Pasó |
| Contraste de tokens | `npm run test:contrast` | Pasó: 15 pares sólidos ≥ 4.5:1 (no cubre fondos compuestos ni imágenes) |
| Integridad del build | `scripts/verify-portfolio-build.mjs` | Pasó: 10 rutas directas, 32 derivados con SHA-256 |
| Presupuestos de peso | `npm run test:budgets` | 5 de 5: JS+CSS inicial 71 KB gzip (límite 90), imagen máx. 534 KB (600), portada 800 px máx. 75 KB (90), `projects/` 3,5 MB (4), fuentes precargadas 54 KB (100) |
| Vulnerabilidades de producción | `npm audit --omit=dev --audit-level=high` | 0 |
| Recorridos, viewports y formularios | `npm run test:portfolio` | 78 comprobaciones: 1440×900, 1440×700, 1920×1080, 390×844 y 360×800; rutas directas, Atrás/Adelante, menú móvil, movimiento reducido, formulario con proveedor simulado, fallo de imágenes |
| Accesibilidad automática | `npm run test:a11y` | axe-core: 0 violaciones en 8 rutas × 3 viewports (1440, 390, 320) |
| Movimiento | `npm run test:motion` | 5: GSAP bloqueado, interacción rápida, sin restos de Flip, movimiento reducido, continuidad del puente de imagen (≤ 3 px) |
| Rastreo | `npm run test:crawl` | 29 rutas y 29 destinos internos sin errores de consola, imágenes rotas, enlaces muertos ni `h1` ausente |

Revisión visual manual de las capturas vigentes: hojas `sheet-*.png` en `docs/capturas/release-2026-10-07/` para los cinco viewports del brief, más reduced motion y fallo de imágenes.

## Qué se cerró por fase

- **Fase 1 — Seguridad y privacidad:** ver `FASE_01_SEGURIDAD_PRIVACIDAD_2026-10-07.md`. Dependencias de producción sin avisos; consentimiento de analítica; aviso de datos del formulario; cabeceras candidatas.
- **Fase 2 — Layout, navegación y accesibilidad:** desborde horizontal de Soluciones y Estudio (320–480 px) corregido; los títulos de destino caben palabra por palabra en todos los anchos; el enlace «Saltar al contenido» apunta al `main` visible; nombre accesible del botón de menú contiene su texto visible; reloj decorativo oculto a lectores de pantalla; botón de WhatsApp dentro de un landmark; el aviso de privacidad ya no tapa el botón Privacidad ni el menú modal; la rueda del carrusel ya no se captura al empujar hacia afuera en los extremos. La prueba de desborde del test de navegador era una tautología en emulación móvil y se reemplazó. La barra horizontal observada en las fichas de Forestal y AN Asociados **no se reprodujo** en Chromium headless; su causa sigue sin confirmar.
- **Fase 3 — Evidencia, imágenes y contenido:** descripciones específicas por proyecto redactadas solo con lo que cada sitio afirma de sí mismo; textos alternativos diferenciados; portadas de 800 px con `srcset` (Home móvil: 753 → 321 KB). No se afirma el rol de Vogel, fechas ni resultados.
- **Fase 4 — Movimiento:** fallo de GSAP capturado y no cacheado; salto de 12 px al cerrar una ficha corregido; método de Estudio en tablet reorganizado en filas.
- **Fase 5 — SEO, rendimiento y robustez:** metadatos propios, canonical y Open Graph en las 9 fichas (título «AN Asociados» corregido); `lastmod` de Home y Recursos actualizado; `preload` de la imagen principal y `srcset` en el héroe de las fichas (LCP móvil con CPU 4× y 4G rápida: Home 3,4 → 1,9 s; ficha forestal 2,8 → 1,7 s; AN Asociados 3,0 → 1,2 s); CLS < 0,1; presupuestos y rastreo automáticos.
- **Fase 6 — Release gate:** esta compuerta. Se corrigió además un defecto introducido durante la fase 2 y detectado en la revisión visual: `overflow-wrap: anywhere` partía palabras de los títulos a 390 px.

## Iteración posterior: rueda, fondo por proyecto y AnimateOnScroll

- **Rueda de navegación:** gira el destino activo al centro (tween `expo.out`, el camino más corto, interrumpible) y se compacta a la V + etiqueta activa al recorrer el carrusel; se expande con hover o foco de teclado.
- **Fondo:** degradé del color de marca del proyecto centrado a carbón, con onda CSS y grano; transición de color con `@property --accent`. Sin JS por cuadro; 60 fps con CPU 4× en headless.
- **Arte de tarjeta:** 5 ilustraciones generadas como portada de tarjeta; la ficha conserva las capturas reales. Al abrir una ficha, el puente de imagen se desvanece al aterrizar porque arte y captura difieren.
- **AnimateOnScroll** (PrimeVue 4, modo `unstyled`, sin tema): bloques de destinos y ficha; nunca en el carrusel ni en los `h1`.
- **Pruebas nuevas en `test:motion`** (8 en total): rueda al centro, compactación y expansión por foco, color del fondo por cada uno de los 9 proyectos y contraste ≥ 4.5:1 del reloj sobre cada degradado (falló a 2,82:1 en la primera pasada; se corrigió con reloj en crema y degradado más suave).
- Presupuesto `projectsTotal` subido de 4 a 5 MB por el arte generado (≈ 1,2 MB).

## Iteración posterior: cards, rueda y Estudio

- **Cards:** las 9 portadas de tarjeta son ilustraciones generadas (`public/projects/<id>/art*.webp`, `kind: "generated"`); la ficha conserva siempre las capturas reales. «Caso forestal» pasa a llamarse **Sistema Registro de Producción** (el slug `/proyectos/caso-forestal/` y los ids de analítica no cambian). Los títulos de las cards ilustradas van al pie para no tapar el logo de la imagen; el encuadre de cada una se ajusta por proyecto para los formatos verticales.
- **Rueda:** la hitbox pasó de media pantalla izquierda a un contenedor del tamaño de la rueda (≈ 280×84 px colapsada, ≈ 280×300 px abierta); el foco solo cuenta si viene del teclado y el estado «explorando proyectos» es persistente, de modo que al volver a Proyectos la rueda vuelve a colapsarse aunque el puntero siga sobre el enlace.
- **Estudio:** retrato de Oscar recortado, grande a la derecha (ver el manual de marca). **Fondo de destinos:** degradé ámbar de marca con onda y grano.
- **Pruebas nuevas en `test:motion`** (11 en total): hitbox de la rueda, colapso al volver desde otra vista y contraste ≥ 4.5:1 del texto atenuado, medido por línea de texto, sobre el fondo de los cuatro destinos (detectó 4,01:1 y 4,27:1 en la primera pasada).
- **Rendimiento (móvil, CPU 4×, 4G rápida):** una regresión detectada y corregida — el LCP de Home subió a 4,5 s porque el `preload` seguía apuntando a la imagen anterior; con el preload correcto vuelve a 2,1 s. Estudio: 2,36 s.
- **Herramientas:** el recorte usa `rembg` (modelo `birefnet-portrait`, 973 MB) en un entorno Python temporal fuera del repositorio; el modelo queda en caché en `~/.rembg` y puede borrarse. Presupuesto `projectsTotal` subido a 6 MB.

## Iteración posterior: transiciones entre vistas

- **Causa 1 (la vista se cortaba):** el escenario de Proyectos se ocultaba con `display:none` al navegar (opacidad 1,00 → 0,00 en un solo fotograma) y solo animaban los textos. Ahora el escenario se desvanece y asienta (`is-away`, 340/520 ms), el destino entra por opacidad, el reloj y el selector de la cabecera también hacen fundido, y `scrollbar-gutter: stable` evita el salto lateral al aparecer el scroll.
- **Causa 2 (Oscar entraba por abajo):** la transición de ruta aplicaba `transform` al contenedor del retrato (`position:fixed`), que pasaba a ser su bloque contenedor: durante ~330 ms la figura estaba en `top=754/bottom=1546` (fuera de una pantalla de 900 px) y luego saltaba a `top=108`. Se eliminan el `transform` de la transición y el `container-type` del contenedor; regla de diseño: ningún ancestro de un elemento fijo lleva `transform`, `filter`, `container-type` ni `contain`.
- **Prueba nueva `test:transitions`** (6 comprobaciones, ya en la compuerta): muestrea cada fotograma de Proyectos ⇄ Estudio ⇄ Soluciones y la carga directa; falla si una vista cambia más de 0,45 de opacidad entre fotogramas, si el retrato sale del viewport o salta verticalmente, o si un control fijo se desplaza lateralmente. Se ejecutó antes del arreglo para reproducir el fallo.

## Iteración posterior: logo real, azul base, FEMAG y capturas completas (2026-10-08)

- **Capturas completas:** `scripts/capture-project-sources.mjs` recorre cada sitio con scroll para disparar las animaciones de entrada; `scripts/check-captures.mjs` (en la compuerta, 18 comprobaciones) falla si una captura tiene bandas en blanco. Arregla la zona vacía de la ficha de AN Asociados. Los carruseles Swiper de AN ya no usan reveal-on-scroll.
- **FEMAG (femag.com.ar)** pasa a décimo proyecto, sin etiqueta «En desarrollo». No tiene ilustración de tarjeta: usa la captura de portada.
- **Azul `#020f1f` como base** (tokens `--vogel-ink`, escala navy/deep/slate/raised; Tailwind `vogel.ink`/`vogel.charcoal`). Crema y ámbar siguen; el carbón queda como `vogel-charcoal`. Sin azul brillante como acento de acción.
- **Logo real de Vogel** en vector (`scripts/derive-vogel-logo.mjs`): símbolo, lockup, favicon, apple-touch-icon, logo PNG y `og-image`. El texto azul del lockup tiene poco contraste sobre el fondo: solo a tamaños grandes.
- **Compuerta:** `release:gate` 12/12 en verde (78 navegador, 24 axe, 11 movimiento, 6 transiciones, 18 capturas).
- **Pendientes nuevos:** héroe móvil de AN Asociados sin foto; tarjeta de FEMAG sin ilustración; JS inicial en 89/90 KB del presupuesto; revisar el logo sobre cada fondo de proyecto; permiso de los clientes (incluido FEMAG) para mostrar sus sitios; `vogel-v-amber.svg` y `logo-vogel-amber.svg` quedan sin uso.

## Defectos y límites conocidos

- En las cards de Indufor y Forestal Garuhapé el título de la tarjeta se superpone al nombre que ya trae la ilustración (redundante, legible).

- La causa de la barra horizontal vista en las fichas durante la auditoría inicial sigue sin confirmar (puede haber sido el desborde de Soluciones/Estudio o un artefacto del navegador integrado).
- A 360×800 el aviso de privacidad ocupa ~38 % de la pantalla hasta que se elige; decidir si se acorta su texto (es texto de privacidad, no se modificó).
- 10 avisos de `npm audit` solo de desarrollo (cadena Tailwind 3, Vite 5, Sharp 0.34): requieren migraciones mayores como trabajo independiente.
- 15 HTML ya modificados antes de esta revisión tienen espacios finales (`git diff --check`); no se tocaron.
- La compuerta usa Chromium headless: no certifica fluidez (60 fps), Safari ni dispositivos táctiles reales.

## Pendientes externos (no se pueden cerrar desde el repositorio)

1. **Web3Forms:** cuota, orígenes permitidos, hCaptcha/anti-spam y retención en la cuenta real.
2. **Hosting/CDN:** identificarlo; verificar cabeceras efectivas, HTTPS/HSTS, compresión y caché; desplegar una CSP Report-Only con receptor y repetir los chequeos sobre la URL de staging.
3. **Política de privacidad** con los datos reales del responsable, finalidad, conservación y ejercicio de derechos.
4. **Permisos de clientes** para logos y capturas (algunas muestran testimonios o datos de personas) y **rol de Vogel** en cada proyecto; hasta entonces las 9 fichas no se agregaron al sitemap.
5. **Licencia de la fuente Ventura:** uso personal; no incluir en ninguna entrega sin licencia comercial.
6. **Mediciones reales:** Lighthouse/CrUX, lector de pantalla (NVDA/VoiceOver), Safari y un dispositivo táctil físico.
7. **PrimeVue 4** (MIT) quedó instalado con su resolver de Vite, sin tema ni plugin y sin uso; decidir si se adopta o se desinstala. El MCP configurado en `.mcp.json` es la versión 5.0.2 (licencia PrimeUI); la 4.5.5 no arranca con el SDK de MCP actual.

## Criterios de aceptación para publicar

- `npm run release:gate` en verde sobre el commit a publicar.
- Cierre de los puntos 1 a 4 de los pendientes externos.
- Repetición de seguridad y cabeceras sobre staging, sin enviar contactos reales ni datos personales a analítica.
- Autorización expresa para commit, push y deploy.
