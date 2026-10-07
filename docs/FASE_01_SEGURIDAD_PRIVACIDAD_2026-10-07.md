# Fase 1 — Seguridad y privacidad

**Fecha:** 7 de octubre de 2026  
**Estado:** implementación local parcial; quedan controles que dependen del proveedor y del hosting de producción.  
**Base de trabajo:** árbol local completo de `redesign/core-a`, con cambios previos staged, unstaged y untracked preservados.

## Cambios implementados

### Dependencias

Se actualizaron dependencias compatibles en el lockfile y se ejecutó `npm audit fix` sin `--force`. Entre las versiones corregidas quedan Vue `3.5.43`, PostCSS `8.5.29`, nanoid `3.3.20`, source-map-js `1.2.2`, Browserslist `4.29.3` y baseline-browser-mapping `2.11.27`. No se amplió el rango de dependencias de la aplicación para forzar una migración mayor.

`npm audit --omit=dev --audit-level=high` devuelve cero vulnerabilidades. La auditoría completa mantiene **7 altas y 3 moderadas**, todas en dependencias de desarrollo: la cadena de Tailwind CSS 3, Vite 5 y Sharp 0.34.5. `npm audit` indica que resolverlas exige Tailwind CSS 4, Vite 8 y Sharp 0.35.5, cambios mayores que requieren migración y pruebas independientes. No se usó `--force`.

### Analítica y consentimiento

`src/lib/analytics.js` ahora usa un flujo de consentimiento básico: Google Analytics y su script no se inicializan antes de una aceptación explícita. Rechazar o revocar deja el tag deshabilitado, y `trackEvent` no agrega eventos a la cola sin consentimiento. Las preferencias se guardan en `localStorage` con respaldo en memoria para la página actual si el almacenamiento está bloqueado.

El control permanente **Privacidad** permite reabrir las preferencias. El aviso es una región semántica no modal, no mueve el foco al aparecer y devuelve el foco al control al cerrar una elección. Aceptar habilita únicamente `analytics_storage`; los tres consentimientos de publicidad siguen denegados y se desactivan Google Signals y la personalización de anuncios.

El listener global que registraba cada intento de envío fue eliminado. `contact_form_submit` se emite una sola vez después de una respuesta exitosa de Web3Forms. El evento contiene solo ruta, ubicación y nombre estático del formulario; no incluye campos enviados. Las rutas analíticas usan `pathname`, sin query string.

### Formulario y divulgación

Las dos interfaces que usan `useContactForm` —Contacto y el panel Info— describen los datos del envío, identifican Web3Forms como procesador y recomiendan no incluir información sensible. El aviso está asociado al formulario con `aria-describedby`. No se agregó una política legal completa porque faltan hechos operativos que la organización debe validar.

La clave `VITE_WEB3FORMS_KEY` llega al navegador porque el proveedor documenta su access key como pública; debe tratarse como identificador del formulario, no como secreto. El código no puede comprobar la configuración de la cuenta. La documentación del proveedor indica que ejecuta filtros de spam del lado del servidor y ofrece hCaptcha; la activación de CAPTCHA y la restricción de dominio dependen de su panel (la restricción de dominio figura como función Pro). No se activó un honeypot que dé una falsa garantía ni un CAPTCHA que pudiera dejar el formulario bloqueado sin validar la cuenta.

### Cabeceras

`public/.htaccess` conserva la redirección existente y añade, bajo `mod_headers`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` y `X-Frame-Options`. HSTS se emite únicamente cuando Apache identifica HTTPS; no incluye `includeSubDomains` ni `preload`. Vite copia el archivo a `dist/.htaccess`.

La infraestructura no identifica el proveedor/CDN que sirve producción y no ejecuta Apache en esta validación. Por eso estos valores son configuración candidata, no evidencia de las cabeceras efectivas del sitio publicado.

### CSP y recursos externos

Se revisaron los destinos visibles en código: `www.googletagmanager.com` (solo luego de aceptar analítica), `api.web3forms.com` (envío de contacto) y `docs.google.com` (iframe de encuesta). Chillax se sirve desde el dominio Vogel; no se encontró un script de Google Analytics escrito directamente en los HTML de entrada.

No se añadió todavía una CSP Report-Only: no hay proveedor confirmado ni colector de reportes, y una directiva alojada en `.htaccess` no produciría evidencia local sobre el host de producción. El siguiente paso debe ser desplegar una política inicial en el entorno de staging con un destino de reportes y revisar sus violaciones antes de aplicar una política de bloqueo. No se habilitó Trusted Types porque las rutas y compatibilidad deben evaluarse junto con esa CSP.

## Verificación ejecutada

| Comprobación | Resultado |
|---|---|
| `npm test` | Pasó; incluye simulación del ciclo de consentimiento y del envío exitoso/fallido sin llamar al endpoint externo. |
| `npm run build` | Pasó con Vite `5.4.21`; la build multipágina generó correctamente las entradas y copió `.htaccess`. |
| `npm run test:contrast` | Pasó; 15 pares de tokens sólidos superan 4.5:1. No evalúa todas las combinaciones del aviso en tiempo de ejecución. |
| `npm audit --omit=dev --audit-level=high` | Pasó; cero vulnerabilidades. |
| `npm audit` | Sigue informando 7 altas y 3 moderadas solo en el árbol completo de desarrollo. |
| Servidor local | `127.0.0.1:5198` respondió HTTP 200. El puerto ya estaba en uso, así que el servidor existente se dejó intacto. |
| Inspección visual en IAB | No completada: el navegador integrado rechazó la navegación por su política de URL. No se intentó una vía alternativa. |
| Web3Forms | Sin envíos reales ni acceso al panel; no se verificó entrega, cuota, dominio permitido, CAPTCHA o retención operativa. |
| Cabeceras del host real | No verificadas; no se identificó el hosting/CDN ni se hizo un despliegue. |

La prueba de contacto simula ambas respuestas del proveedor; no demuestra que Web3Forms acepte o entregue consultas reales. Tampoco se certificó rendimiento, WCAG integral ni el funcionamiento de Apache con la configuración concreta del hosting.

## Pendientes externos y continuidad

1. Confirmar en la cuenta Web3Forms la cuota/límite vigente, los orígenes aceptados y la protección anti-spam habilitada; evaluar hCaptcha o restricción de dominio antes de publicar.
2. Acordar la política de privacidad con los datos reales de responsable, finalidad, acceso, conservación y ejercicio de derechos. El aviso actual no afirma condiciones de retención.
3. Identificar el host/CDN. Verificar allí las cabeceras y probar HTTPS; habilitar CSP Report-Only con receptor y validar scripts, imágenes, fuentes, `connect-src`, `frame-src` y `form-action`.
4. Planificar migraciones mayores de Vite/Tailwind/Sharp y reducir las 10 alertas restantes del árbol completo sin mezclar esa migración con cambios visuales.
5. Continuar con la corrección de overflow y la evaluación de navegación/accesibilidad de la Fase 2, conservando el inventario previo del worktree.

Las referencias del proveedor describen su propio servicio y no sustituyen la revisión de la cuenta de Vogel ni asesoramiento legal: [FAQ de Web3Forms](https://docs.web3forms.com/getting-started/faq), [protección anti-spam](https://docs.web3forms.com/getting-started/customizations/spam-protection) y [hCaptcha](https://docs.web3forms.com/getting-started/customizations/spam-protection/hcaptcha). Google documenta el consentimiento y la desactivación del tag en [Consent Mode](https://developers.google.com/tag-platform/security/guides/consent) y [Manage privacy settings](https://developers.google.com/tag-platform/security/guides/privacy).
