# @lodado/sdui-mcp

MCP server that serves compressed authoring knowledge for [@lodado/sdui-template](https://www.npmjs.com/package/@lodado/sdui-template) and [@lodado/sdui-template-component](https://www.npmjs.com/package/@lodado/sdui-template-component): document syntax, public types, per-component guides, and real Storybook usage examples.

Knowledge is generated from this monorepo at publish time — **the package version is the knowledge version**. No hosted server required.

> **Block documents** (`@lodado/sdui-document`, `@lodado/sdui-document-react`) are not in the MCP knowledge base yet. For those packages, read [docs/AI-ASSISTANT-GUIDE.md](../../docs/AI-ASSISTANT-GUIDE.md) and the package READMEs.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Install — Cursor](#install--cursor)
- [Install — Claude Code](#install--claude-code)
- [Install — Claude Desktop](#install--claude-desktop)
- [Install — other MCP clients](#install--other-mcp-clients)
- [Verify connection](#verify-connection)
- [Tools](#tools)
- [Workflow A — direct tool use](#workflow-a--direct-tool-use)
- [Workflow B — snapshot sync](#workflow-b--snapshot-sync)
- [Versioning & freshness](#versioning--freshness)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js 24+**
- Network access for `npx` to download the package (first run only)
- An MCP-capable AI client (Cursor, Claude Code, Claude Desktop, Windsurf, Cline, …)

---

## Install — Cursor

### Method 1: Settings UI

1. **Cursor Settings** → **MCP**
2. **Add MCP Server**
3. Fill in:

| Field   | Value                    |
| ------- | ------------------------ |
| Name    | `sdui`                   |
| Command | `npx`                    |
| Args    | `-y`, `@lodado/sdui-mcp` |

4. Save → confirm status is **connected**

### Method 2: Project config (team-shared)

`.cursor/mcp.json` in your repo root:

```json
{
  "mcpServers": {
    "sdui": {
      "command": "npx",
      "args": ["-y", "@lodado/sdui-mcp"]
    }
  }
}
```

Reload MCP after adding the file.

---

## Install — Claude Code

```bash
claude mcp add sdui -- npx -y @lodado/sdui-mcp
```

Team-shared alternative — `.mcp.json` at repo root:

```json
{
  "mcpServers": {
    "sdui": {
      "command": "npx",
      "args": ["-y", "@lodado/sdui-mcp"]
    }
  }
}
```

---

## Install — Claude Desktop

Edit `claude_desktop_config.json`:

| OS      | Path                                                              |
| ------- | ----------------------------------------------------------------- |
| macOS   | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json`                     |

```json
{
  "mcpServers": {
    "sdui": {
      "command": "npx",
      "args": ["-y", "@lodado/sdui-mcp"]
    }
  }
}
```

Restart Claude Desktop.

---

## Install — other MCP clients

Any client that supports stdio MCP servers can use the same shape:

```json
{
  "mcpServers": {
    "sdui": {
      "command": "npx",
      "args": ["-y", "@lodado/sdui-mcp"]
    }
  }
}
```

**Pin a version** (optional, for reproducible knowledge):

```json
{
  "mcpServers": {
    "sdui": {
      "command": "npx",
      "args": ["-y", "@lodado/sdui-mcp@0.0.1"]
    }
  }
}
```

**Monorepo development** (local package, not published):

```json
{
  "mcpServers": {
    "sdui": {
      "command": "node",
      "args": ["/absolute/path/to/sdui-template/packages/sdui-mcp/dist/cli.js"]
    }
  }
}
```

Run `pnpm --filter @lodado/sdui-mcp build` first to generate `knowledge/`.

---

## Verify connection

1. **Manual smoke test:**

```bash
npx -y @lodado/sdui-mcp
# Should start silently on stdio — Ctrl+C to exit
```

2. **In your AI client**, ask:

> Use the sdui MCP server to list all SDUI components.

Expected: a list like `Button — …`, `Dialog — …`, `Card — …`.

3. **Fetch a guide:**

> Call sdui_get_guide with topic "syntax" and summarize the key rules.

---

## Tools

| Tool                   | Purpose                                                                                      |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| `sdui_list_components` | List available components with one-line summaries                                            |
| `sdui_get_guide`       | Fetch a guide: `syntax`, `architecture`, `types`, `components-overview`, or a component name |
| `sdui_get_examples`    | Real Storybook document JSON for a component                                                 |
| `sdui_get_snapshot`    | Delta sync for consumer repos (`knownHashes` → changed files + removals)                     |

### `sdui_get_guide` topics

| Topic                 | Contents                                                                |
| --------------------- | ----------------------------------------------------------------------- |
| `syntax`              | `SduiLayoutDocument` schema, hooks, Zod patterns, Storybook conventions |
| `architecture`        | Compound components (`providerId`, references)                          |
| `types`               | Public TypeScript schema (`base.ts`, `document.ts`, `node.ts`)          |
| `components-overview` | Import map + global rules for `@lodado/sdui-template-component`         |
| `<ComponentName>`     | Per-component guide (e.g. `Dialog`, `Dropdown`, `TextField`)            |

### Prompt & resources

- **Prompt:** `sdui-author-document` — guided SDUI layout JSON authoring
- **Resource:** `sdui://knowledge/{path}` — each knowledge file (e.g. `sdui://knowledge/syntax.md`)

---

## Workflow A — direct tool use

Best for one-off tasks:

```text
"Build an SDUI page with a Card containing a Counter and a Dialog."

→ sdui_get_guide   { topic: "syntax" }
→ sdui_get_guide   { topic: "Card" }
→ sdui_get_examples{ component: "Card" }
→ sdui_get_guide   { topic: "Dialog" }
→ sdui_get_examples{ component: "Dialog" }
→ author SduiLayoutDocument JSON
```

Or invoke: `/sdui-author-document component=Dialog`

---

## Workflow B — snapshot sync

For teams doing frequent SDUI work — sync knowledge into the repo so assistants read local files instead of calling MCP every task.

### Setup (once)

```bash
mkdir -p .claude/skills/sdui-sync
cp node_modules/@lodado/sdui-mcp/consumer/sdui-sync/SKILL.md .claude/skills/sdui-sync/SKILL.md
# or copy from this monorepo: packages/sdui-mcp/consumer/sdui-sync/SKILL.md
```

### Sync

Run `/sdui-sync` in Claude Code. It:

1. Calls `sdui_get_snapshot` with local `knownHashes`
2. Writes changed files to `.ai/sdui/`
3. Deletes removed paths
4. Updates `.ai/sdui/manifest.json`

### Layout after sync

```text
.ai/sdui/
├── manifest.json          # generatedAt, gitCommit, per-file hash + lastModified
├── syntax.md              # document schema, hooks, authoring patterns
├── architecture.md        # compound component architecture
├── types.md               # public TS types
├── components/            # _overview.md + one guide per component
└── examples/              # real Storybook document JSON per component
```

### Staleness rule

Before SDUI layout work: if `.ai/sdui/manifest.json` is missing or `generatedAt` is older than **7 days**, run `/sdui-sync` first. Otherwise read local files — do not call MCP tools.

Add to your project's `CLAUDE.md`:

```markdown
- SDUI work: read the snapshot in .ai/sdui/ first (syntax.md, components/, examples/). If manifest.json generatedAt is older than 7 days, run /sdui-sync.
```

---

## Versioning & freshness

- `manifest.json` carries `generatedAt`, source `gitCommit`, and per-file `hash` + `lastModified`.
- `npx -y` resolves the **latest published** version — re-sync after a new release picks up new knowledge automatically.
- Pin `@lodado/sdui-mcp@x.y.z` in MCP args for reproducible knowledge in CI or locked teams.

---

## Troubleshooting

| Symptom                     | Fix                                                                                                         |
| --------------------------- | ----------------------------------------------------------------------------------------------------------- |
| MCP server not listed       | Reload MCP; check JSON syntax in config file                                                                |
| Tools timeout on first call | Wait for `npx` download; ensure network access                                                              |
| `npx` not found             | Install Node 24+; ensure IDE inherits your shell `PATH`                                                     |
| Empty component list        | Package may be corrupted — delete npm cache, retry `npx -y @lodado/sdui-mcp`                                |
| Knowledge feels stale       | Pin newer version or run `/sdui-sync` with empty `knownHashes`                                              |
| Need block document APIs    | MCP does not cover `@lodado/sdui-document*` — use [AI-ASSISTANT-GUIDE.md](../../docs/AI-ASSISTANT-GUIDE.md) |

---

## What gets bundled

At build time, knowledge is extracted from:

- `.claude/skills/sduiFormat/SKILL.md` → `syntax.md`
- `.claude/skills/sduiArchitecture/SKILL.md` → `architecture.md`
- `.claude/skills/sduiComponents/SKILL.md` → `components/*.md`
- `packages/sdui-template/src/schema/*.ts` → `types.md`
- `apps/docs/src/stories/*.stories.tsx` → `examples/*.md` (layout components only)

Document editor stories are intentionally skipped (docs-only / non-extractable fixtures). See [docs/AI-ASSISTANT-GUIDE.md](../../docs/AI-ASSISTANT-GUIDE.md) for block document authoring.

Storybook install guide: `apps/docs/src/stories/SduiMcpServer.stories.tsx`
