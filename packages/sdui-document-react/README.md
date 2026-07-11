# @lodado/sdui-document-react

**Hybrid Notion-like block editor for React — block-level rendering with focused-block ProseMirror inline editing.**

[![npm version](https://img.shields.io/npm/v/@lodado/sdui-document-react.svg)](https://www.npmjs.com/package/@lodado/sdui-document-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![GitHub](https://img.shields.io/github/stars/lodado/sdui-template?style=social&label=Star)](https://github.com/lodado/sdui-template)

[![ProseMirror](https://img.shields.io/badge/Editor-ProseMirror-F93)](https://prosemirror.net/)
[![Block Editor](https://img.shields.io/badge/UI-Notion--like-2563EB)](https://github.com/lodado/sdui-template/tree/main/packages/sdui-document-react)
[![dnd-kit](https://img.shields.io/badge/Drag-dnd--kit-8B5CF6)](https://dndkit.com/)

[Quick start](#quick-start) · [Architecture](#architecture) · [Editor API](#sduidocumenteditor) · [Blocks & marks](#blocks--marks) · [Development](#development)

---

`@lodado/sdui-document` owns document meaning (schema, patches, tree ops). This package turns that domain into an interactive editor UI: drag-and-drop blocks, keyboard shortcuts, inline marks, and patch-based change reporting.

```
SduiDocumentContent → SduiDocumentEditor → onContentChange(next, patches)
```

### End-to-end example

| **① content** `SduiDocumentContent` | →   | **② editor** `SduiDocumentEditor` | →   | **③ patches** autosave / persist |
| ----------------------------------- | --- | --------------------------------- | --- | -------------------------------- |

```tsx
'use client'

import { SduiDocumentEditor } from '@lodado/sdui-document-react'
import type { SduiDocumentContent } from '@lodado/sdui-document'
import { useState } from 'react'

const initialContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: {
    id: 'root',
    type: 'document.root',
    children: [
      {
        id: 'intro',
        type: 'document.paragraph',
        state: { text: 'Hello document editor' },
      },
    ],
  },
}

export default function DocumentPage() {
  const [content, setContent] = useState(initialContent)

  return (
    <SduiDocumentEditor
      content={content}
      onContentChange={(next, patches) => {
        console.log('patches', patches)
        setContent(next)
      }}
    />
  )
}
```

---

## Table of Contents

- [Why this exists](#why-this-exists)
- [Layer comparison](#layer-comparison)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Philosophy](#philosophy)
- [Architecture](#architecture)
- [SduiDocumentEditor](#sduidocumenteditor)
- [Blocks & marks](#blocks--marks)
- [Styling & customization](#styling--customization)
- [Interactions](#interactions)
- [Exports](#exports)
- [For AI assistants](#for-ai-assistants)
- [Development](#development)

---

## Why this exists

Block documents need a React editing surface, but bolting ProseMirror onto the entire tree is heavy and brittle. This package splits concerns:

- **React** owns block chrome, drag handles, selection, and block type UI
- **ProseMirror** mounts only on the **focused text block** for inline editing
- **Patches** express all edits — ready for autosave, undo, or collaboration adapters

## Layer comparison

| Package                       | Responsibility                                         |
| ----------------------------- | ------------------------------------------------------ |
| `@lodado/sdui-document`       | Block schema, patches, tree ops, markdown, permissions |
| `@lodado/sdui-document-react` | **This package** — React editor UI for block documents |

Pair it with `@lodado/sdui-document` when your product needs a block editor or read-only document viewer.

---

## Installation

```bash
pnpm add @lodado/sdui-document-react @lodado/sdui-document react react-dom
```

Import editor CSS (bundlers may not auto-load package CSS):

```tsx
import '@lodado/sdui-document-react/styles/index.css' // full editor
// or, for the read-only viewer (no editing chrome):
import '@lodado/sdui-document-react/styles/viewer.css'
```

> **⚠️ Import order matters.** Document styles live in `@layer sdui-doc.*`. A cascade
> layer loses to any later-declared layer, so if you use Tailwind, CSS resets, or any
> `@layer` framework, **import the document CSS _after_ them** — otherwise their base
> layer (e.g. Tailwind Preflight) will flatten headings, lists, and margins.
>
> ```tsx
> import 'tailwindcss' // or your reset / globals
> import '@lodado/sdui-document-react/styles/index.css' // must come AFTER
> ```
>
> Note: this same layering is what lets you override document styles with a plain
> unlayered rule — see [Styling & customization](#styling--customization).

---

## Quick start

See the [end-to-end example](#end-to-end-example) above.

Read-only preview:

```tsx
<SduiDocumentEditor content={content} readOnly />
```

---

## Philosophy

### 1. Block structure ≠ inline editing

The document is a tree of blocks. React handles block-level UI; ProseMirror handles only the focused text block — marks, keyboard, paste, and selection.

### 2. Patch-based edits

`onContentChange(next, patches)` lets consumers persist full content or individual patches for autosave, audit logs, or undo/redo.

### 3. Domain stays headless

Tree transforms, schema validation, and patch application live in `@lodado/sdui-document` — testable without React.

### 4. Shared document model for read and edit

`readOnly` disables editing affordances while rendering the same block content. One persisted document powers editor and preview screens.

---

## Architecture

```text
@lodado/sdui-document
  ├─ block schema / marks / tree operations
  ├─ patch application and history primitives
  ├─ markdown import
  └─ SDUI mapping contracts
          │
          ▼
@lodado/sdui-document-react
  ├─ SduiDocumentEditor
  │   ├─ block tree rendering
  │   ├─ block selection + dnd-kit drag/drop
  │   ├─ patch publishing
  │   └─ readOnly / edit mode
  ├─ BlockChrome
  │   └─ paragraph / heading / checklist / callout / divider / image / file / link
  ├─ FocusedBlockEditor
  │   └─ ProseMirror state, keymap, input rules, paste, toolbar bridge
  ├─ InlineContentView
  └─ MARK_DEFINITIONS
```

---

## SduiDocumentEditor

```tsx
<SduiDocumentEditor
  content={content}
  onContentChange={(next, patches) => setContent(next)}
  onTurnInto={(blockId, type, attrs) => console.log(blockId, type, attrs)}
  generateBlockId={() => crypto.randomUUID()}
  readOnly={false}
  theme="swiss"
  className="my-document-editor"
/>
```

| Prop              | Type                              | Description                                           |
| ----------------- | --------------------------------- | ----------------------------------------------------- |
| `content`         | `SduiDocumentContent`             | Current document content                              |
| `onContentChange` | `(next, patches) => void`         | Called after editor changes                           |
| `onTurnInto`      | `(blockId, type, attrs?) => void` | Block type conversion callback                        |
| `readOnly`        | `boolean`                         | Disable editing controls                              |
| `theme`           | `'swiss' \| 'notion' \| string`   | Visual theme (`data-sdui-doc-theme`; default `swiss`) |
| `generateBlockId` | `() => string`                    | Custom block ID generator                             |
| `className`       | `string`                          | Root class name                                       |

Read-only viewer:

```tsx
import { SduiDocumentViewer } from '@lodado/sdui-document-react'
import '@lodado/sdui-document-react/styles/viewer.css'
;<SduiDocumentViewer content={content} theme="swiss" />
```

---

## Blocks & marks

### Block types (`BlockChrome`)

| Type                                      | Description                |
| ----------------------------------------- | -------------------------- |
| `document.paragraph`                      | Body text                  |
| `document.heading`                        | Heading (levels 1–3)       |
| `document.bulletedList`                   | Bulleted list item         |
| `document.numberedList`                   | Numbered list item         |
| `document.checklist`                      | Checkbox item              |
| `document.quote`                          | Block quote                |
| `document.callout`                        | Highlighted callout        |
| `document.code`                           | Code block                 |
| `document.divider`                        | Horizontal rule            |
| `document.toggle`                         | Collapsible section        |
| `document.image`                          | Image block                |
| `document.video`                          | Video block                |
| `document.embed`                          | Embed block                |
| `document.file`                           | File attachment            |
| `document.link`                           | Document link              |
| `document.bookmark`                       | URL bookmark               |
| `document.columnList` / `document.column` | Multi-column layout        |
| `document.collection`                     | Database / table / gallery |
| `document.page`                           | Sub-page link              |
| `document.toc`                            | Table of contents          |
| `document.tags`                           | Tag chips                  |
| `document.button`                         | Action button              |

Text blocks render static inline content until focused, then swap in `FocusedBlockEditor`.

### Inline marks (`MARK_DEFINITIONS`)

| Mark                                   | Description          |
| -------------------------------------- | -------------------- |
| bold, italic, underline, strikethrough | Text styling         |
| code                                   | Inline code          |
| link                                   | Hyperlink            |
| highlight                              | Background highlight |

---

## Styling & customization

All package CSS ships inside `sdui-doc.*` [cascade layers](https://developer.mozilla.org/docs/Web/CSS/@layer), so **any unlayered rule you write wins over package styles regardless of specificity** — no `!important`, no selector escalation.

### Entry points

| Import                                                | Contents                                                                           |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `@lodado/sdui-document-react/styles/index.css`        | Everything (viewer styles + editing chrome)                                        |
| `@lodado/sdui-document-react/styles/viewer.css`       | Read-only viewer (no drag handles/toolbars/menus)                                  |
| `@lodado/sdui-document-react/styles/tokens.css`       | CSS custom properties only (`--sdui-doc-*`)                                        |
| `@lodado/sdui-document-react/styles/base.css`         | Block layout scaffolding (rows, columns, alignment)                                |
| `@lodado/sdui-document-react/styles/blocks/*.css`     | Per-block-group styles (typography, callout, media, attachments, collection, misc) |
| `@lodado/sdui-document-react/styles/chrome.css`       | Editor-only UI (drag handles, toolbars, popovers)                                  |
| `@lodado/sdui-document-react/styles/themes/swiss.css` | Swiss theme (the default look; included in index.css/viewer.css)                   |
| `@lodado/sdui-document-react/styles/print.css`        | A4 print/PDF rules                                                                 |

Layer order: `sdui-doc.tokens` → `sdui-doc.base` → `sdui-doc.blocks` → `sdui-doc.chrome` → `sdui-doc.themes` → `sdui-doc.print`.

### Themes

The editor and viewer take a `theme` prop, rendered as `data-sdui-doc-theme` on the root. Theme stylesheets live in the `sdui-doc.themes` layer, so they beat the base styles without `!important` while your unlayered CSS still wins over both.

- **`swiss`** (default) — print-editorial: ink-on-paper palette, uppercase `h2` section labels on a 2px rule, hairline dividers, mono outline chips, square corners, monochrome editor chrome. Light-only by design (it pins its own ink/paper values even under `[data-theme='dark']`).
- **`notion`** — the original Notion-like look. Any `theme` value without a matching stylesheet falls through to the base styles, so this is a plain opt-out.

```tsx
<SduiDocumentEditor content={content} />              {/* Swiss (default) */}
<SduiDocumentEditor content={content} theme="notion" /> {/* base Notion look */}
```

To add your own theme, ship rules scoped under `[data-sdui-doc-theme='<name>']` in an `@layer sdui-doc.themes { … }` block and pass `theme="<name>"`.

### Recipe 1 — retheme with tokens

`styles/tokens.css` is the source of truth for every `--sdui-doc-*` token (colors, surfaces, borders, shadows, radii, chips, z-index). Override them in plain CSS:

```css
:root {
  --sdui-doc-accent: #7c3aed;
  --sdui-doc-accent-strong: #6d28d9;
  --sdui-doc-radius-card: 4px;
}

[data-theme='dark'] {
  --sdui-doc-background: #101014;
}
```

Scope to `:root` (app-wide), `[data-theme='...']` (per theme), or any wrapper class around the editor (per instance — the editor/viewer accept `className`).

Key token groups: `--sdui-doc-text*`, `--sdui-doc-background*`, `--sdui-doc-surface*`, `--sdui-doc-border*`, `--sdui-doc-accent*`, `--sdui-doc-shadow-*`, `--sdui-doc-radius-*`, `--sdui-doc-chip-<color>-{bg,text}`, `--sdui-doc-code-*`, `--sdui-doc-z-*`.

### Recipe 2 — restyle one block type

Every block wrapper carries `data-block-type` (e.g. `document.callout`, `document.code`, `document.collection`). Because package styles are layered, a plain rule is enough:

```css
[data-block-type='document.callout'] .notice-block {
  border-left: 3px solid var(--sdui-doc-accent);
  border-radius: 0;
  background: transparent;
}
```

### Recipe 3 — partial imports (near-headless)

Skip block groups you restyle entirely and keep only what you need:

```tsx
import '@lodado/sdui-document-react/styles/tokens.css'
import '@lodado/sdui-document-react/styles/base.css'
import '@lodado/sdui-document-react/styles/blocks/typography.css'
// your own callout/media styles here
```

Note: partial entry files don't declare the `@layer` order statement — if you cherry-pick, declare it once yourself: `@layer sdui-doc.tokens, sdui-doc.base, sdui-doc.blocks, sdui-doc.chrome, sdui-doc.themes, sdui-doc.print;`

---

## Interactions

| Feature               | Implementation                                   |
| --------------------- | ------------------------------------------------ |
| Block drag & drop     | `@dnd-kit/core` with nested projection           |
| Block range selection | Editor-layer selection state                     |
| Keyboard shortcuts    | Split, merge, indent, outdent, navigation        |
| Selection toolbar     | Inline marks and link editing                    |
| Patch output          | Semantic patches only — no DOM leakage to domain |

---

## Exports

- `SduiDocumentEditor`
- `SduiDocumentViewer`
- `BlockChrome`
- `FocusedBlockEditor`
- ProseMirror helpers from `focused-block/pm/*`
- `InlineContentView`
- `MARK_DEFINITIONS`
- Selection toolbar utilities
- `documentEditorComponent` / `documentViewerComponent` (SDUI node integration)

---

## For AI assistants

> MCP (`@lodado/sdui-mcp`) covers **SDUI layout JSON** only. For block editor work, read this README and [docs/AI-ASSISTANT-GUIDE.md](../../docs/AI-ASSISTANT-GUIDE.md).

### Setup checklist

```tsx
'use client' // Next.js App Router — editor is client-only

import '@lodado/sdui-document-react/styles/index.css' // AFTER Tailwind/resets
import { SduiDocumentEditor } from '@lodado/sdui-document-react'
import type { SduiDocumentContent } from '@lodado/sdui-document'
```

1. Install both `@lodado/sdui-document-react` and `@lodado/sdui-document`
2. Import CSS **after** Tailwind / global resets (cascade layer ordering)
3. Use `state: { text: '...' }` on text blocks in initial content
4. Handle `onContentChange(next, patches)` — persist **patches**, not just full content
5. Use `readOnly` + `viewer.css` for preview routes

### Architecture (do not break)

| Layer                         | Owns                                                                    |
| ----------------------------- | ----------------------------------------------------------------------- |
| `@lodado/sdui-document`       | Block schema, `applyDocumentPatch`, permissions, `toSduiLayoutDocument` |
| `@lodado/sdui-document-react` | Block chrome, dnd-kit, ProseMirror on focused block only, editor CSS    |

### Common AI mistakes

- Forgetting CSS import → unstyled editor
- Importing document CSS before Tailwind → flattened headings/lists
- Using `SduiLayoutDocument` instead of `SduiDocumentContent`
- Mutating `content` in place instead of using patches from `onContentChange`
- Wrapping the whole tree in ProseMirror (only focused block uses PM)

### Storybook references

| Story path              | Purpose                        |
| ----------------------- | ------------------------------ |
| `Document/Catalog`      | Every block type rendered      |
| `DocumentEditor`        | Interactive editor             |
| `Document/Themes/Swiss` | Theme comparison               |
| `Document/Adapter`      | `toSduiLayoutDocument` preview |

Run locally: `pnpm storybook` (port 6006)

---

## Development

```bash
pnpm --filter @lodado/sdui-document-react test
pnpm --filter @lodado/sdui-document-react lint
pnpm --filter @lodado/sdui-document-react build
```

Storybook examples: `apps/docs/`

---

## License

MIT
