# AGENTS.md — AI Assistant Guide

Guidance for AI coding assistants (Cursor, Claude Code, Windsurf, etc.) working in this monorepo or consuming its packages.

**Full reference:** [docs/AI-ASSISTANT-GUIDE.md](docs/AI-ASSISTANT-GUIDE.md) · **Human MCP setup:** [README.md#mcp--ai-assistants](README.md#mcp--ai-assistants)

---

## Which package do I need?

| Goal                                                       | Packages                                                               | Read first                                                                       |
| ---------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Server sends UI as JSON → React renders it                 | `@lodado/sdui-template` (+ optional `@lodado/sdui-template-component`) | MCP `syntax` guide                                                               |
| Block document **domain** (patches, permissions, no React) | `@lodado/sdui-document`                                                | [packages/sdui-document/README.md](packages/sdui-document/README.md)             |
| Block document **editor UI**                               | `@lodado/sdui-document-react` + `@lodado/sdui-document`                | [packages/sdui-document-react/README.md](packages/sdui-document-react/README.md) |
| Embed SDUI widgets inside a block document                 | `document.sdui` block + `@lodado/sdui-template`                        | This file + MCP                                                                  |
| AI pulls compressed component guides at runtime            | `@lodado/sdui-mcp`                                                     | [packages/sdui-mcp/README.md](packages/sdui-mcp/README.md)                       |

```text
@lodado/sdui-document-react  ← editor UI, CSS, dnd-kit
        │ patches
@lodado/sdui-document          ← block tree, patches, permissions
        │ toSduiLayoutDocument()
@lodado/sdui-template            ← SduiLayoutRenderer, store
        │ optional
@lodado/sdui-template-component  ← Radix component map (sduiComponents)
```

---

## MCP — connect & use

`@lodado/sdui-mcp` serves **compressed SDUI layout JSON knowledge** (`@lodado/sdui-template` + `@lodado/sdui-template-component`). It does **not** cover block-document APIs — use the sections below for `@lodado/sdui-document*`.

### Connect (Cursor)

`.cursor/mcp.json` in repo or consumer app root:

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

Or **Cursor Settings → MCP → Add Server**: Command `npx`, Args `-y`, `@lodado/sdui-mcp`.

### Connect (Claude Code)

```bash
claude mcp add sdui -- npx -y @lodado/sdui-mcp
```

### MCP tools

| Tool                   | Purpose                                                                     |
| ---------------------- | --------------------------------------------------------------------------- |
| `sdui_list_components` | List `@lodado/sdui-template-component` entries                              |
| `sdui_get_guide`       | `syntax`, `architecture`, `types`, `components-overview`, or component name |
| `sdui_get_examples`    | Storybook `SduiLayoutDocument` JSON for a component                         |
| `sdui_get_snapshot`    | Delta-sync knowledge into `.ai/sdui/`                                       |

**Prompt:** `sdui-author-document` — guided **layout JSON** authoring (not block documents).

### Before writing SDUI layout JSON

1. `sdui_get_guide` → `syntax`
2. `sdui_get_guide` → `components-overview`
3. `sdui_list_components` (if needed)
4. Per component: `sdui_get_guide` + `sdui_get_examples`

### Snapshot workflow (teams)

1. Copy `packages/sdui-mcp/consumer/sdui-sync/SKILL.md` → `.claude/skills/sdui-sync/SKILL.md`
2. Run `/sdui-sync` → writes `.ai/sdui/`
3. Re-sync when `manifest.json` `generatedAt` is older than **7 days**
4. When snapshot is fresh, read `.ai/sdui/` instead of calling MCP tools

---

## SDUI layout JSON (`@lodado/sdui-template`)

```ts
interface SduiLayoutDocument {
  version: string
  metadata?: { id?: string; name?: string; [key: string]: unknown }
  root: SduiLayoutNode
  variables?: Record<string, unknown>
}

interface SduiLayoutNode {
  id: string // unique within document
  type: string // must match components registry key
  state?: Record<string, unknown> // dynamic data
  attributes?: Record<string, unknown> // static props (className, as, …)
  children?: SduiLayoutNode[]
  reference?: string | string[] // subscribe to other nodes
}
```

**Hooks:**

- `useSduiNodeSubscription({ nodeId, schema? })` — state + childrenIds
- `useRenderNode({ nodeId })` — `renderChildren(childrenIds)`
- `useSduiLayoutAction()` — `updateNodeState`, store access
- `useSduiNodeReference({ nodeId })` — referenced node state

**Rules:** unique `id`; `state` vs `attributes` separation; Zod schema on every custom component; `providerId` on compound components (Dialog, Dropdown, …) — see MCP `architecture`.

Storybook: `apps/docs/src/stories/`

---

## Block documents (`@lodado/sdui-document`)

```ts
interface SduiDocumentContent {
  schemaVersion: '1.0' | '1.1'
  root: SduiDocumentBlock // type: 'document.root'
}

interface SduiDocumentBlock {
  id: string
  type: string
  position?: string
  state?: Record<string, unknown>
  attributes?: Record<string, unknown>
  children?: SduiDocumentBlock[]
}
```

### Rules

1. Unique `id` on every block; root is always `document.root`
2. Text blocks: `state.text` (string) for initial/simple content
3. Patches are **immutable** — `applyDocumentPatch(content, patch)` only
4. Placement: anchors (`after`, `before`, `fallbackAfter`), not array indices
5. Client permissions are UX-only — re-check on server

### Block types

`document.root`, `document.paragraph`, `document.heading`, `document.bulletedList`, `document.numberedList`, `document.checklist`, `document.quote`, `document.callout`, `document.code`, `document.divider`, `document.toggle`, `document.image`, `document.video`, `document.embed`, `document.file`, `document.link`, `document.bookmark`, `document.columnList`, `document.column`, `document.collection`, `document.page`, `document.toc`, `document.tags`, `document.button`, `document.sdui`

Registry: `packages/sdui-document/src/block-types/index.ts`

### Patch types

`block.insert`, `block.update`, `block.delete`, `block.move`, `block.split`, `block.merge`, `block.setType`, `document.setTitle`

Schema: `packages/sdui-document/src/blocks/schema/patch.ts`

### SDUI bridge

```ts
import { toSduiLayoutDocument } from '@lodado/sdui-document'
const layoutDocument = toSduiLayoutDocument(content, { documentId: 'doc-1', title: 'Notes' })
```

Storybook: `apps/docs/src/stories/SduiDocument.stories.tsx`, `Catalog.stories.tsx`

---

## Block editor (`@lodado/sdui-document-react`)

```tsx
'use client'

import { useState } from 'react'
import { SduiDocumentEditor } from '@lodado/sdui-document-react'
import type { SduiDocumentContent } from '@lodado/sdui-document'
import '@lodado/sdui-document-react/styles/index.css' // AFTER Tailwind/resets

;<SduiDocumentEditor
  content={content}
  onContentChange={(next, patches) => {
    setContent(next)
    // persist patches
  }}
/>
```

Read-only: `SduiDocumentViewer` + `styles/viewer.css`

| Prop                             | Notes                                    |
| -------------------------------- | ---------------------------------------- |
| `onContentChange(next, patches)` | Handle **both** — UI state + persistence |
| `theme`                          | `'swiss'` (default) or `'notion'`        |
| `readOnly`                       | Disable editing chrome                   |

### Architecture (do not violate)

- React owns block chrome; ProseMirror only on **focused text block**
- Domain logic stays in `@lodado/sdui-document`
- Import document CSS **after** Tailwind (cascade layers: `@layer sdui-doc.*`)

Storybook: `DocumentEditor.stories.tsx`, `Document/Catalog`, `Document/Themes/Swiss`

---

## AI checklist — common mistakes

### SDUI layout

- Duplicate node `id` values
- `className` in `state` instead of `attributes`
- Missing `providerId` on compound components
- Custom component without Zod schema
- Expecting MCP to know block document APIs

### Block documents

- Using `SduiLayoutDocument` for block content (wrong model)
- Mutating `content` in place
- Array index for insert position (use anchors)
- Missing CSS import or wrong import order
- Trusting client-only permission checks

---

## Monorepo commands

```bash
pnpm install
pnpm test                               # mandatory after code changes
pnpm storybook                          # port 6006
pnpm --filter @lodado/sdui-template test
pnpm --filter @lodado/sdui-document test
pnpm --filter @lodado/sdui-document-react test
pnpm --filter @lodado/sdui-mcp build    # regenerates knowledge/
```

**After any code modification:** run `pnpm run test` from repo root. Do not finish until tests pass.

---

## File index

| Topic          | Path                                                             |
| -------------- | ---------------------------------------------------------------- |
| SDUI store     | `packages/sdui-template/src/store/SduiLayoutStore.ts`            |
| SDUI hooks     | `packages/sdui-template/src/react-wrapper/hooks/`                |
| Block registry | `packages/sdui-document/src/block-types/index.ts`                |
| Patches        | `packages/sdui-document/src/blocks/schema/patch.ts`              |
| SDUI adapter   | `packages/sdui-document/src/sdui/toSduiLayout.ts`                |
| Editor         | `packages/sdui-document-react/src/editor/SduiDocumentEditor.tsx` |
| MCP server     | `packages/sdui-mcp/src/server.ts`                                |
| Storybook      | `apps/docs/src/stories/`                                         |

Project conventions: [CLAUDE.md](CLAUDE.md) · Claude Code workflows: [.claude/README.md](.claude/README.md)
