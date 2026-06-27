# LinkedIn n8n Publisher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a semi-automatic LinkedIn publishing process where Codex creates drafts, Oscar approves by moving files, and n8n publishes approved posts.

**Architecture:** Local markdown files are the approval boundary. n8n only watches the `aprobadas` folder, parses approved files, posts to LinkedIn through OAuth, and archives results.

**Tech Stack:** n8n self-hosted, LinkedIn OAuth2, local Windows folders, markdown with YAML-like front matter.

---

### Task 1: Local Folder Contract

**Files:**
- Modify: `O:\vogel_consultoria\.gitignore`
- Create: `O:\vogel_consultoria\linkedin-posts\borradores`
- Create: `O:\vogel_consultoria\linkedin-posts\aprobadas`
- Create: `O:\vogel_consultoria\linkedin-posts\publicadas`
- Create: `O:\vogel_consultoria\linkedin-posts\errores`
- Create: `O:\vogel_consultoria\linkedin-posts\assets`

- [ ] **Step 1: Ensure operational folder exists**

Run:

```powershell
New-Item -ItemType Directory -Force -Path `
  'O:\vogel_consultoria\linkedin-posts\borradores',`
  'O:\vogel_consultoria\linkedin-posts\aprobadas',`
  'O:\vogel_consultoria\linkedin-posts\publicadas',`
  'O:\vogel_consultoria\linkedin-posts\errores',`
  'O:\vogel_consultoria\linkedin-posts\assets'
```

Expected: all directories exist.

- [ ] **Step 2: Ignore operational posts**

Add this line to `.gitignore`:

```gitignore
linkedin-posts/
```

- [ ] **Step 3: Verify git does not see post files**

Run:

```powershell
git status --short --ignored | Select-String 'linkedin-posts'
```

Expected: entries are ignored, not normal untracked files.

### Task 2: n8n Workflow

**Files:**
- Create: `O:\vogel_consultoria\docs\linkedin-automation\README.md`
- Create: `O:\vogel_consultoria\docs\linkedin-automation\parse-approved-post-code-node.js`

- [ ] **Step 1: Configure LinkedIn OAuth2**

In n8n, create a LinkedIn credential using Client ID and Client Secret from a LinkedIn Developer App with:

```text
Share on LinkedIn
Sign In with LinkedIn using OpenID Connect
```

Expected: n8n credential test succeeds.

- [ ] **Step 2: Create publisher workflow**

Create workflow `LinkedIn - Publicar aprobadas Vogel` with:

```text
Schedule Trigger -> Read/Write Files from Disk -> Extract From File -> Code -> LinkedIn -> Archive
```

Expected: a file in `aprobadas` reaches the LinkedIn node as `$json.texto`.

- [ ] **Step 3: Use parser code**

Paste the contents of `docs\linkedin-automation\parse-approved-post-code-node.js` into the n8n Code node.

Expected: files with `estado: "aprobada"` produce one item; other files produce none.

### Task 3: First Production Check

**Files:**
- Use: `O:\vogel_consultoria\linkedin-posts\borradores\*.md`
- Move approved item to: `O:\vogel_consultoria\linkedin-posts\aprobadas`

- [ ] **Step 1: Move one reviewed draft to approved**

Run or do manually:

```powershell
Move-Item -LiteralPath 'O:\vogel_consultoria\linkedin-posts\borradores\2026-06-01-dashboard-decision.md' -Destination 'O:\vogel_consultoria\linkedin-posts\aprobadas\'
```

Expected: n8n sees the file on the next schedule.

- [ ] **Step 2: Execute workflow manually**

In n8n, click `Execute workflow`.

Expected: LinkedIn post is created and the file is archived or reported in `errores`.
