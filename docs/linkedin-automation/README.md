# Automatizacion de publicaciones de LinkedIn

Este flujo separa la aprobacion editorial de la publicacion automatica.

## Carpetas locales

La carpeta operativa queda fuera de git:

```text
O:\vogel_consultoria\linkedin-posts\
  borradores\
  aprobadas\
  publicadas\
  errores\
  assets\
```

Uso previsto:

1. Codex genera dos borradores por semana en `borradores`.
2. Oscar revisa o edita los `.md`.
3. Cuando una publicacion esta aprobada, Oscar mueve el archivo a `aprobadas`.
4. n8n lee `aprobadas`, publica en LinkedIn y mueve el archivo a `publicadas`.
5. Si falla, n8n mueve el archivo a `errores` con un log asociado.

## Formato de archivo

Cada publicacion es un `.md` con front matter YAML simple:

```markdown
---
id: "2026-06-01-dashboard-decision"
canal: "linkedin"
estado: "aprobada"
fecha_sugerida: "2026-06-01"
imagen: ""
---

Texto completo de la publicacion.
```

Campos:

- `id`: nombre unico y estable.
- `canal`: por ahora siempre `linkedin`.
- `estado`: `borrador` o `aprobada`.
- `fecha_sugerida`: fecha editorial orientativa.
- `imagen`: ruta absoluta opcional a una imagen.

## Workflow n8n recomendado

Nombre: `LinkedIn - Publicar aprobadas Vogel`

Trigger:

- `Schedule Trigger`
- Cada 30 minutos, o dos veces al dia si se prefiere menor ruido.

Nodos:

1. `Read/Write Files from Disk`
   - Operation: `Read File(s) From Disk`
   - File Selector: `O:\\vogel_consultoria\\linkedin-posts\\aprobadas\\*.md`

2. `Extract From File`
   - Operation: `Text`
   - Input Binary Field: `data`

3. `Code`
   - Parsear front matter y texto.
   - Validar `estado: "aprobada"`.
   - Saltar archivos ya publicados si contienen `publicado_en`.

4. `LinkedIn`
   - Resource: `Post`
   - Operation: `Create`
   - Post As: `Person`
   - Text: `={{ $json.texto }}`
   - Media Category: `None`, salvo que `imagen` tenga ruta.

5. `Code`
   - Armar nombre final con fecha/hora de publicacion y respuesta de LinkedIn.

6. `Read/Write Files from Disk`
   - Operation: `Write File to Disk`
   - File Path and Name: `O:\\vogel_consultoria\\linkedin-posts\\publicadas\\={{ $json.id }}.md`

7. Borrado o archivado del original
   - Opcion simple: mover manualmente al inicio.
   - Opcion automatica: usar un nodo `Execute Command` con PowerShell `Move-Item`, solo si esta habilitado y restringido a esta carpeta.

Error workflow:

- Si falla LinkedIn o parseo, escribir el archivo y el error en `errores`.

## Credencial de LinkedIn en n8n

Configurar una credencial `LinkedIn OAuth2`.

En LinkedIn Developer:

1. Crear una app en https://www.linkedin.com/developers/apps.
2. Asociarla a una pagina de empresa de LinkedIn.
3. Activar productos:
   - `Share on LinkedIn`
   - `Sign In with LinkedIn using OpenID Connect`
4. Copiar `Client ID` y `Client Secret`.
5. En n8n, crear la credencial LinkedIn y autorizar con la cuenta de Oscar.

Notas:

- Para publicar como perfil personal suele alcanzar con el flujo OAuth de LinkedIn.
- Para publicar como organizacion puede requerir revision de LinkedIn.
- No guardar contrasenas de LinkedIn en archivos. Usar OAuth.

## Permisos de archivos en n8n

Si n8n corre en Docker o como servicio, debe poder ver:

```text
O:\vogel_consultoria\linkedin-posts
```

Si corre en Docker, montar ese path como volumen. Si corre en Windows como servicio, verificar que el usuario del servicio tenga permisos de lectura/escritura.
