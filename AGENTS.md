<!-- CODEGRAPH_START -->
## CodeGraph

This project has a CodeGraph MCP server (`codegraph_*` tools) configured. CodeGraph is a tree-sitter-parsed knowledge graph of every symbol, edge, and file. Reads are sub-millisecond and return structural information grep cannot.

### When to prefer codegraph over native search

Use codegraph for **structural** questions — what calls what, what would break, where is X defined, what is X's signature. Use native grep/read only for **literal text** queries (string contents, comments, log messages) or after you already have a specific file open.

| Question | Tool |
|---|---|
| "Where is X defined?" / "Find symbol named X" | `codegraph_search` |
| "What calls function Y?" | `codegraph_callers` |
| "What does Y call?" | `codegraph_callees` |
| "What would break if I changed Z?" | `codegraph_impact` |
| "Show me Y's signature / source / docstring" | `codegraph_node` |
| "Give me focused context for a task/area" | `codegraph_context` |
| "Survey an unfamiliar module/topic" | `codegraph_explore` |
| "What files exist under path/" | `codegraph_files` |
| "Is the index healthy?" | `codegraph_status` |

### Rules of thumb

- **Trust codegraph results.** They come from a full AST parse. Do NOT re-verify them with grep — that's slower, less accurate, and wastes context.
- **Don't grep first** when looking up a symbol by name. `codegraph_search` is faster and returns kind + location + signature in one call.
- **Don't chain `codegraph_search` + `codegraph_node`** when you just want context — `codegraph_context` is one call.
- **`codegraph_explore` is the heavy hitter** for unfamiliar areas — it returns full source from all relevant files in one call, but is token-heavy. If your harness supports parallel subagents, spawn one for explore-class questions to keep main session context clean.
- **Index lag**: the file watcher debounces ~500ms behind writes; don't re-query immediately after editing a file in the same turn.

### If `.codegraph/` doesn't exist

The MCP server returns "not initialized." Ask the user: *"I notice this project doesn't have CodeGraph initialized. Want me to run `codegraph init -i` to build the index?"*
<!-- CODEGRAPH_END -->

## Vogel Brand

For any work involving Vogel Consultoria visual identity, social media posts, landing pages, presentations, commercial documents, ads, images, or copywriting, use the brand manual as the mandatory source of truth:

- `docs/manual-marca-vogel-consultoria.md`

Before creating or editing branded material:

1. Read or consult the relevant section of the brand manual.
2. Use the official brand positioning, tone, palette, typography, logo guidance, composition rules, and visual checklist.
3. Prefer official assets listed in the manual, especially:
   - `src/assets/brand/logo-vogel-generated.webp`
   - `src/assets/brand/logo-vogel-generated.png`
   - `src/assets/logo-vogel.webp`
   - `src/assets/logo-vogel.png`
   - `public/logo-vogel.png`
   - `src/assets/hero/network-intelligence.webp`
   - `src/assets/hero/dashboard-mockup.webp`
   - `src/assets/services/`
   - `docs/social/`

Core brand rules to preserve:

- Position Vogel as premium technology consulting for Argentine companies.
- Communicate clarity, confidence, precision, modernity, and practical closeness.
- Use a professional, direct, business-oriented tone.
- Avoid generic digital-transformation language, empty AI hype, exaggerated promises, childish icons, and off-brand colors.
- Use the official palette: deep/navy blues as the visual base, white/gray for text, institutional blues for technology, and amber only as a restrained focal accent.
- Use official typography when possible: `Syne` for headings and `DM Sans` for body/UI.
- Visuals should evoke dashboards, data, connected nodes, process flows, automation, applied AI, and business management.
- Every conversion-oriented piece should have a clear CTA and pass the checklist in section 15 of the manual before delivery.
