# LinkedIn 500 Seguidores Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Launch the approved 60-day LinkedIn profile growth sprint for Jose Oscar Vogel, moving from 281 to 500 followers with the "500 decisiones mejoradas" content system.

**Architecture:** Keep the approved strategic spec as the source of truth and create a small operational campaign folder under `docs/social/linkedin/500-decisiones-mejoradas-2026-06-27/`. The campaign folder stores profile-change handoff notes, the weekly metrics tracker, the topic backlog, week-1 copy, and the first HeyGen script so each piece can be reviewed and published without modifying automation code.

**Tech Stack:** Markdown operational docs, CSV tracking, LinkedIn profile/manual publishing, HeyGen video workflow, Vogel brand manual.

---

## File Structure

- Create: `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\README.md`
  - Owns the campaign operating rules, target, cadence, and approval boundaries.
- Create: `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\perfil-linkedin-checklist.md`
  - Owns the exact profile changes: headline and follower setting check.
- Create: `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\metricas-semanales.csv`
  - Owns the weekly growth log from 281 to 500 followers.
- Create: `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\temas-12-iniciales.md`
  - Owns the first 12 approved topic candidates, 3 per editorial pillar.
- Create: `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\semana-01\post-lanzamiento-serie.md`
  - Owns the week-1 launch post draft.
- Create: `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\semana-01\heygen-guion-01.md`
  - Owns the first 30-45 second HeyGen script draft.
- Create: `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\semana-01\interaccion-perfiles.md`
  - Owns the week-1 engagement routine and target profile categories.

No existing automation, MySQL, n8n, or publishing workflow should be modified in this plan.

---

### Task 1: Campaign Folder And Operating README

**Files:**
- Create: `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\README.md`

- [ ] **Step 1: Create the campaign directories**

Run:

```powershell
New-Item -ItemType Directory -Force -Path `
  'O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27',`
  'O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\semana-01'
```

Expected: both directories exist.

- [ ] **Step 2: Write the campaign README**

Create `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\README.md` with:

```markdown
# 500 decisiones mejoradas - LinkedIn personal

Fecha de inicio operativa: 2026-06-27
Perfil foco: Jose Oscar Vogel
Canal: LinkedIn perfil personal

## Meta

Pasar de 281 a 500 seguidores en 60 dias.

- Base inicial: 281 seguidores.
- Meta final: 500 seguidores.
- Crecimiento necesario: +219 seguidores.
- Ritmo semanal de referencia: +26 seguidores.
- Dato visible adicional: 270 contactos.

La medicion oficial del sprint es seguidores, no contactos.

## Posicionamiento

Oscar es la cara experta de Vogel Consultoria: tecnologia clara para mejorar decisiones de empresa.

Headline aprobado:

```text
Sistemas, dashboards e IA aplicada para mejorar decisiones de empresa | Tecnologia clara para gestion real
```

## Sistema de contenido

Campana combinada A + C + D:

- A: posts con foto real.
- C: microvideos con avatar HeyGen.
- D: serie "500 decisiones mejoradas".

## Cadencia

Semana tipo:

- 2 posts con foto real.
- 1 publicacion de aprendizaje, opinion o comentario fuerte.
- 1 bloque de interaccion con perfiles objetivo.
- 1 revision semanal de metricas.

HeyGen:

- 1 microvideo cada 2 semanas.
- Duracion sugerida: 30 a 45 segundos.
- Usar primero los temas que mejor funcionen en formato post.

## Reglas de publicacion

- Cada pieza debe dar una razon concreta para seguir el perfil.
- Evitar hype vacio sobre IA.
- Hablar en lenguaje de gestion: procesos, datos, decisiones, rentabilidad, trazabilidad.
- Mantener tono profesional, directo y argentino neutro.
- No prometer resultados garantizados.
- No modificar automatizaciones ni publicar sin aprobacion humana.

## CTA base

```text
Si te interesa ver mas ejemplos de tecnologia aplicada a gestion real, segui mi perfil.
```

## Fuente estrategica

Spec aprobado:

`O:\vogel_consultoria\docs\superpowers\specs\2026-06-27-linkedin-500-seguidores-design.md`
```

- [ ] **Step 3: Verify the README content**

Run:

```powershell
Select-String -Path 'O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\README.md' -Pattern '281','500','60 dias','Sistemas, dashboards','500 decisiones mejoradas'
```

Expected: each pattern appears at least once.

- [ ] **Step 4: Commit**

Run:

```powershell
git add 'docs/social/linkedin/500-decisiones-mejoradas-2026-06-27/README.md'
git commit -m "docs: crear guia operativa LinkedIn 500 seguidores"
```

Expected: commit succeeds with only the README staged.

---

### Task 2: Profile Conversion Checklist

**Files:**
- Create: `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\perfil-linkedin-checklist.md`

- [ ] **Step 1: Write the profile checklist**

Create `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\perfil-linkedin-checklist.md` with:

```markdown
# Checklist perfil LinkedIn - conversion a seguidores

Objetivo: reducir friccion para que las visitas generadas por la campana sigan el perfil personal.

## Cambio 1: headline

Headline aprobado:

```text
Sistemas, dashboards e IA aplicada para mejorar decisiones de empresa | Tecnologia clara para gestion real
```

Validacion visual:

- [ ] El headline se ve completo o suficientemente claro en el primer viewport del perfil.
- [ ] Incluye "sistemas", "dashboards" e "IA aplicada".
- [ ] Incluye una promesa editorial: "Tecnologia clara para gestion real".

## Cambio 2: accion principal Seguir

Ruta LinkedIn:

```text
Settings & Privacy > Visibility > Followers
```

Configuracion objetivo:

```text
Who can follow you: Everyone on LinkedIn
Make follow primary: On
```

Validacion:

- [ ] La configuracion permite seguidores de personas fuera de la red.
- [ ] La accion primaria del perfil queda orientada a seguir cuando LinkedIn lo permite.
- [ ] Si LinkedIn informa demora de propagacion, revisar nuevamente dentro de 24 horas.

## Linea base

- Fecha: 2026-06-27.
- Seguidores: 281.
- Contactos visibles: 270.

## Fuente

LinkedIn Help:

https://www.linkedin.com/help/linkedin/answer/a528011
```

- [ ] **Step 2: Verify the checklist has the exact headline**

Run:

```powershell
Select-String -Path 'O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\perfil-linkedin-checklist.md' -Pattern 'Sistemas, dashboards e IA aplicada para mejorar decisiones de empresa'
```

Expected: one match with the full headline line.

- [ ] **Step 3: Manually apply profile changes**

In the open LinkedIn profile:

1. Edit the headline to:

```text
Sistemas, dashboards e IA aplicada para mejorar decisiones de empresa | Tecnologia clara para gestion real
```

2. Open:

```text
Settings & Privacy > Visibility > Followers
```

3. Set:

```text
Who can follow you: Everyone on LinkedIn
Make follow primary: On
```

Expected: LinkedIn saves the changes or shows a platform message explaining any delay.

- [ ] **Step 4: Commit**

Run:

```powershell
git add 'docs/social/linkedin/500-decisiones-mejoradas-2026-06-27/perfil-linkedin-checklist.md'
git commit -m "docs: registrar ajustes de perfil LinkedIn"
```

Expected: commit succeeds with only the checklist staged.

---

### Task 3: Weekly Metrics Tracker

**Files:**
- Create: `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\metricas-semanales.csv`

- [ ] **Step 1: Create the CSV tracker**

Create `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\metricas-semanales.csv` with:

```csv
semana,fecha_inicio,fecha_fin,seguidores_inicio,seguidores_fin,seguidores_netos,contactos_visibles,posts_foto,posts_aprendizaje,videos_heygen,bloques_interaccion,post_mas_impresiones,post_mas_interacciones,visitas_perfil,aprendizaje,decision_siguiente_semana
0,2026-06-27,2026-06-27,281,281,0,270,0,0,0,0,"linea base","linea base","","Se aprueba sprint 60 dias; medir seguidores y no contactos","Lanzar semana 1"
1,2026-06-28,2026-07-04,281,,,,,,,,,,,,
2,2026-07-05,2026-07-11,,,,,,,,,,,,,
3,2026-07-12,2026-07-18,,,,,,,,,,,,,
4,2026-07-19,2026-07-25,,,,,,,,,,,,,
5,2026-07-26,2026-08-01,,,,,,,,,,,,,
6,2026-08-02,2026-08-08,,,,,,,,,,,,,
7,2026-08-09,2026-08-15,,,,,,,,,,,,,
8,2026-08-16,2026-08-22,,,,,,,,,,,,,
9,2026-08-23,2026-08-26,,,,,,,,,,,,,
```

- [ ] **Step 2: Verify the tracker can be parsed**

Run:

```powershell
Import-Csv 'O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\metricas-semanales.csv' | Select-Object semana,fecha_inicio,seguidores_inicio,seguidores_fin
```

Expected: 10 rows are printed, weeks 0 through 9.

- [ ] **Step 3: Verify the baseline**

Run:

```powershell
(Import-Csv 'O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\metricas-semanales.csv' | Where-Object semana -eq '0').seguidores_inicio
```

Expected:

```text
281
```

- [ ] **Step 4: Commit**

Run:

```powershell
git add 'docs/social/linkedin/500-decisiones-mejoradas-2026-06-27/metricas-semanales.csv'
git commit -m "docs: crear tracker semanal LinkedIn"
```

Expected: commit succeeds with only the CSV staged.

---

### Task 4: Initial 12-Topic Backlog

**Files:**
- Create: `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\temas-12-iniciales.md`

- [ ] **Step 1: Write the topic backlog**

Create `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\temas-12-iniciales.md` with:

```markdown
# 12 temas iniciales - 500 decisiones mejoradas

Cada tema debe poder convertirse en post con foto real. Los temas con mejor respuesta pueden transformarse en microvideo HeyGen.

## Pilar 1: Decisiones con datos

1. La decision que una pyme toma tarde cuando no mira margen por producto.
   - Angulo: vender mas no siempre mejora rentabilidad.
   - Formato sugerido: post con foto real.
2. El tablero minimo que necesita direccion para no depender de reportes sueltos.
   - Angulo: menos indicadores, mejor decision.
   - Formato sugerido: carrusel o post con foto real.
3. Stock, ventas y compras: la decision que cambia cuando los datos estan juntos.
   - Angulo: evitar comprar de mas o quedarse corto.
   - Formato sugerido: post con ejemplo.

## Pilar 2: Procesos que consumen tiempo

4. El costo invisible de copiar y pegar datos entre sistemas.
   - Angulo: no es solo tiempo; tambien es error y falta de trazabilidad.
   - Formato sugerido: post con foto real.
5. Cuando una planilla deja de ser ayuda y empieza a ser riesgo operativo.
   - Angulo: la planilla avisa cuando ya hay que sistematizar.
   - Formato sugerido: microvideo HeyGen.
6. Alertas automaticas: la diferencia entre enterarse tarde y actuar a tiempo.
   - Angulo: una alerta bien diseniada evita persecuciones internas.
   - Formato sugerido: post de aprendizaje.

## Pilar 3: IA aplicada con criterio

7. La pregunta correcta antes de meter IA en una empresa.
   - Angulo: primero proceso, despues herramienta.
   - Formato sugerido: post con foto real.
8. Un asistente interno sirve si sabe donde buscar y cuando no responder.
   - Angulo: seguridad y criterio antes que magia.
   - Formato sugerido: microvideo HeyGen.
9. IA para analizar documentos: donde aporta valor y donde conviene poner limites.
   - Angulo: velocidad con control humano.
   - Formato sugerido: post de opinion.

## Pilar 4: Sistemas que ordenan operaciones

10. Permisos y roles: una decision de gestion, no solo tecnica.
    - Angulo: cada usuario debe ver y hacer lo necesario.
    - Formato sugerido: post con foto real.
11. Trazabilidad: la diferencia entre saber que paso y buscar culpables.
    - Angulo: buenos sistemas reducen discusiones internas.
    - Formato sugerido: post de aprendizaje.
12. El sistema a medida no empieza programando: empieza entendiendo la operacion.
    - Angulo: relevamiento, reglas y decisiones antes de pantallas.
    - Formato sugerido: post con foto real.

## Regla de seleccion semanal

Para cada semana elegir:

- 1 tema de datos o sistemas.
- 1 tema de procesos o IA.
- 1 tema con potencial de video HeyGen.
```

- [ ] **Step 2: Verify there are 12 numbered topics**

Run:

```powershell
(Select-String -Path 'O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\temas-12-iniciales.md' -Pattern '^\d+\. ').Count
```

Expected:

```text
12
```

- [ ] **Step 3: Commit**

Run:

```powershell
git add 'docs/social/linkedin/500-decisiones-mejoradas-2026-06-27/temas-12-iniciales.md'
git commit -m "docs: definir temas iniciales LinkedIn"
```

Expected: commit succeeds with only the topic backlog staged.

---

### Task 5: Week-1 Launch Post Draft

**Files:**
- Create: `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\semana-01\post-lanzamiento-serie.md`

- [ ] **Step 1: Write the launch post**

Create `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\semana-01\post-lanzamiento-serie.md` with:

```markdown
# Post lanzamiento - 500 decisiones mejoradas

Estado: borrador
Canal: LinkedIn perfil personal
Formato: post con foto real
Serie: 500 decisiones mejoradas
Objetivo: presentar la serie y convertir visitas al perfil en seguidores.

## Copy

Hay decisiones de empresa que se toman todos los dias con informacion incompleta.

Comprar sin ver bien el stock.
Vender sin mirar margen.
Perseguir tareas que podrian avisarse solas.
Pedir reportes que llegan tarde.
Probar IA sin tener ordenado el proceso.

La tecnologia ayuda cuando baja a gestion real: sistemas, dashboards, automatizaciones e IA aplicada con criterio.

Por eso voy a empezar una serie: 500 decisiones mejoradas.

La idea es simple: compartir ejemplos concretos de decisiones que pueden mejorar cuando una empresa ordena datos, procesos y herramientas.

No desde la teoria.
Desde problemas reales de gestion.

Si te interesa ver mas ejemplos de tecnologia aplicada a empresas argentinas, segui mi perfil.

## Indicacion visual

Usar foto real de Oscar como firma principal del post.

La imagen debe sentirse profesional, directa y humana. Mantener paleta Vogel: azul profundo, blanco/gris y acento ambar moderado.

## Primer comentario sugerido

Voy a ir compartiendo ejemplos sobre dashboards, automatizacion, sistemas a medida e IA aplicada. La pregunta de fondo va a ser siempre la misma: que decision mejora cuando la informacion llega clara y a tiempo.
```

- [ ] **Step 2: Verify CTA and series name**

Run:

```powershell
Select-String -Path 'O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\semana-01\post-lanzamiento-serie.md' -Pattern '500 decisiones mejoradas','segui mi perfil','foto real'
```

Expected: each phrase appears at least once.

- [ ] **Step 3: Manual review**

Read the copy aloud once.

Expected:

- The post sounds like Oscar, not a generic corporate account.
- The post explains why following the profile is useful.
- The post does not promise guaranteed business results.

- [ ] **Step 4: Commit**

Run:

```powershell
git add 'docs/social/linkedin/500-decisiones-mejoradas-2026-06-27/semana-01/post-lanzamiento-serie.md'
git commit -m "docs: preparar post lanzamiento LinkedIn"
```

Expected: commit succeeds with only the launch post staged.

---

### Task 6: First HeyGen Script Draft

**Files:**
- Create: `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\semana-01\heygen-guion-01.md`

- [ ] **Step 1: Write the first HeyGen script**

Create `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\semana-01\heygen-guion-01.md` with:

```markdown
# HeyGen guion 01 - La planilla que dejo de ayudar

Estado: borrador
Canal: LinkedIn perfil personal
Duracion objetivo: 35 a 45 segundos
Formato: avatar HeyGen basado en foto de Oscar
Serie: 500 decisiones mejoradas

## Objetivo

Probar microvideo con avatar sin depender de grabacion manual y convertir el tema en una razon para seguir el perfil.

## Guion

Hay una decision que muchas empresas patean demasiado: cuando dejar de manejar un proceso critico en una planilla.

La planilla al principio ayuda.
Ordena, permite calcular, da velocidad.

Pero llega un punto donde empieza a esconder problemas:
datos duplicados, versiones distintas, errores de carga y reportes que nadie sabe si estan actualizados.

La mejora no empieza con mas software.
Empieza preguntando que decision necesita informacion confiable y a tiempo.

A veces la respuesta es un dashboard.
A veces una automatizacion.
A veces un sistema simple con reglas claras.

Voy a compartir mas ejemplos de tecnologia clara para gestion real.
Si te sirve este enfoque, segui mi perfil.

## Indicacion de voz

Voz masculina, espanol rioplatense o latino neutro, tono profesional, cercano y seguro. Ritmo medio. Sin entusiasmo exagerado.

## Indicacion visual

Usar avatar/foto de Oscar con encuadre profesional. Fondo sobrio con estetica Vogel: azul profundo, dashboards o nodos sutiles, sin elementos infantiles.
```

- [ ] **Step 2: Verify duration by word count**

Run:

```powershell
$text = Get-Content -Raw 'O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\semana-01\heygen-guion-01.md'
$script = ($text -split '## Guion')[1] -split '## Indicacion de voz' | Select-Object -First 1
($script -split '\s+' | Where-Object { $_ }).Count
```

Expected: word count between 90 and 130 words.

- [ ] **Step 3: Manual HeyGen readiness check**

Confirm before generating video:

- The avatar/foto source is the same visual direction as the image that already performed well.
- The voice is male, Spanish, professional and natural.
- The script includes the CTA "segui mi perfil".

Expected: no video generation starts until these three checks are true.

- [ ] **Step 4: Commit**

Run:

```powershell
git add 'docs/social/linkedin/500-decisiones-mejoradas-2026-06-27/semana-01/heygen-guion-01.md'
git commit -m "docs: preparar primer guion HeyGen LinkedIn"
```

Expected: commit succeeds with only the HeyGen script staged.

---

### Task 7: Week-1 Engagement Routine

**Files:**
- Create: `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\semana-01\interaccion-perfiles.md`

- [ ] **Step 1: Write the engagement routine**

Create `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\semana-01\interaccion-perfiles.md` with:

```markdown
# Interaccion semana 1 - LinkedIn perfil personal

Objetivo: generar visitas calificadas al perfil sin depender solo del alcance organico de los posts propios.

## Bloques semanales

Realizar 3 bloques de interaccion durante la semana.

Duracion por bloque: 20 minutos.

## Perfiles objetivo

Priorizar publicaciones de:

1. Duenios, gerentes o responsables de pymes argentinas.
2. Personas que hablan de administracion, operaciones, ventas, stock o finanzas.
3. Consultores contables, administrativos o de gestion con audiencia empresaria.
4. Referentes de tecnologia aplicada a empresas, no contenido de IA generico.

## Regla de comentario

Cada comentario debe aportar criterio. Evitar comentarios de una linea como "Excelente" o "Muy bueno".

Estructura:

```text
Coincido con [idea concreta].
En empresas chicas y medianas suele pasar que [observacion de gestion].
La mejora aparece cuando [criterio aplicable].
```

## Ejemplos de comentarios

### Comentario 1: planillas

```text
Coincido con que la planilla no es el problema en si.
El problema aparece cuando se vuelve el unico lugar donde vive una decision critica: stock, margen, cobranzas o tareas pendientes.
Ahi ya no alcanza con ordenar columnas; hace falta trazabilidad y reglas claras.
```

### Comentario 2: IA

```text
Para mi la clave es no empezar por "meter IA", sino por detectar que decision o tarea se quiere mejorar.
Cuando el proceso esta claro, la IA puede ahorrar tiempo.
Cuando el proceso esta desordenado, suele amplificar el ruido.
```

### Comentario 3: dashboards

```text
Un buen dashboard no deberia ser una pared de graficos.
Deberia responder pocas preguntas importantes: que cambio, donde esta el desvio y que decision hay que tomar.
Menos indicadores, mejor gestion.
```

## Registro minimo

Despues de cada bloque, registrar:

- Fecha.
- Cantidad de comentarios utiles.
- Tema que genero mejores respuestas.
- Si hubo nuevas visitas, seguidores o conversaciones.
```

- [ ] **Step 2: Verify the routine contains 3 example comments**

Run:

```powershell
(Select-String -Path 'O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\semana-01\interaccion-perfiles.md' -Pattern '^### Comentario ').Count
```

Expected:

```text
3
```

- [ ] **Step 3: Commit**

Run:

```powershell
git add 'docs/social/linkedin/500-decisiones-mejoradas-2026-06-27/semana-01/interaccion-perfiles.md'
git commit -m "docs: definir rutina de interaccion LinkedIn"
```

Expected: commit succeeds with only the engagement routine staged.

---

### Task 8: Final Review And Handoff

**Files:**
- Review: `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\README.md`
- Review: `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\perfil-linkedin-checklist.md`
- Review: `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\metricas-semanales.csv`
- Review: `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\temas-12-iniciales.md`
- Review: `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\semana-01\post-lanzamiento-serie.md`
- Review: `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\semana-01\heygen-guion-01.md`
- Review: `O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\semana-01\interaccion-perfiles.md`

- [ ] **Step 1: Run a red-flag scan**

Run:

```powershell
$patterns = @(
  -join ([char]84, [char]79, [char]68, [char]79),
  -join ([char]84, [char]66, [char]68),
  -join ([char]112, [char]111, [char]114, [char]32, [char]100, [char]101, [char]102, [char]105, [char]110, [char]105, [char]114),
  -join ([char]112, [char]101, [char]110, [char]100, [char]105, [char]101, [char]110, [char]116, [char]101, [char]32, [char]100, [char]101, [char]32, [char]100, [char]101, [char]102, [char]105, [char]110, [char]105, [char]114),
  -join ([char]108, [char]111, [char]114, [char]101, [char]109),
  -join ([char]112, [char]108, [char]97, [char]99, [char]101, [char]104, [char]111, [char]108, [char]100, [char]101, [char]114)
)
Select-String -Path 'O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\**\*' -Pattern $patterns -CaseSensitive:$false
```

Expected: no matches.

- [ ] **Step 2: Verify expected files exist**

Run:

```powershell
$files = @(
  'O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\README.md',
  'O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\perfil-linkedin-checklist.md',
  'O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\metricas-semanales.csv',
  'O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\temas-12-iniciales.md',
  'O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\semana-01\post-lanzamiento-serie.md',
  'O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\semana-01\heygen-guion-01.md',
  'O:\vogel_consultoria\docs\social\linkedin\500-decisiones-mejoradas-2026-06-27\semana-01\interaccion-perfiles.md'
)
$files | ForEach-Object { [PSCustomObject]@{ Path = $_; Exists = Test-Path $_ } }
```

Expected: every row has `Exists = True`.

- [ ] **Step 3: Verify git status is narrow**

Run:

```powershell
git status -sb
```

Expected: no staged files. Existing unrelated untracked social folders may remain; do not stage them.

- [ ] **Step 4: Summarize handoff**

Write a short final note with:

```text
Semana 1 lista:
- perfil-linkedin-checklist.md
- metricas-semanales.csv
- temas-12-iniciales.md
- semana-01/post-lanzamiento-serie.md
- semana-01/heygen-guion-01.md
- semana-01/interaccion-perfiles.md
```

Expected: the user can review the week-1 materials before anything is published.
