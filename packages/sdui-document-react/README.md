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
        state: { content: [{ text: 'Hello document editor' }] },
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
- [Interactions](#interactions)
- [Exports](#exports)
- [Development](#development)

---

## Why this exists

Block documents need a React editing surface, but bolting ProseMirror onto the entire tree is heavy and brittle. This package splits concerns:

- **React** owns block chrome, drag handles, selection, and block type UI
- **ProseMirror** mounts only on the **focused text block** for inline editing
- **Patches** express all edits — ready for autosave, undo, or collaboration adapters

## Layer comparison

| Package                       | Responsibility                                            |
| ----------------------------- | --------------------------------------------------------- |
| `@lodado/sdui-template`       | Renders SDUI layout JSON into registered React components |
| `@lodado/sdui-document`       | Block schema, patches, tree ops, markdown, permissions    |
| `@lodado/sdui-document-react` | **This package** — React editor UI for block documents    |

Use both document packages when your product has a block editor that maps content into SDUI layouts or read-only previews.

---

## Installation

```bash
pnpm add @lodado/sdui-document-react @lodado/sdui-document react react-dom
```

Import editor CSS (bundlers may not auto-load package CSS):

```tsx
import '@lodado/sdui-document-react/src/styles/editor.css'
```

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
  className="my-document-editor"
/>
```

| Prop              | Type                              | Description                    |
| ----------------- | --------------------------------- | ------------------------------ |
| `content`         | `SduiDocumentContent`             | Current document content       |
| `onContentChange` | `(next, patches) => void`         | Called after editor changes    |
| `onTurnInto`      | `(blockId, type, attrs?) => void` | Block type conversion callback |
| `readOnly`        | `boolean`                         | Disable editing controls       |
| `generateBlockId` | `() => string`                    | Custom block ID generator      |
| `className`       | `string`                          | Root class name                |

---

## Blocks & marks

### Block types (`BlockChrome`)

| Type                 | Description          |
| -------------------- | -------------------- |
| `document.paragraph` | Body text            |
| `document.heading`   | Heading (levels 1–3) |
| `document.checklist` | Checkbox item        |
| `document.callout`   | Highlighted callout  |
| `document.divider`   | Horizontal rule      |
| `document.image`     | Image block          |
| `document.file`      | File attachment      |
| `document.link`      | Document link        |

Text blocks render static inline content until focused, then swap in `FocusedBlockEditor`.

### Inline marks (`MARK_DEFINITIONS`)

| Mark                                   | Description          |
| -------------------------------------- | -------------------- |
| bold, italic, underline, strikethrough | Text styling         |
| code                                   | Inline code          |
| link                                   | Hyperlink            |
| highlight                              | Background highlight |

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
- `BlockChrome`
- `FocusedBlockEditor`
- ProseMirror helpers from `focused-block/pm/*`
- `InlineContentView`
- `MARK_DEFINITIONS`
- Selection toolbar utilities

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
