# @lodado/sdui-document-react

React bindings for `@lodado/sdui-document`: a hybrid Notion-like block editor that combines block-level React rendering with focused-block ProseMirror inline editing.

`@lodado/sdui-document` owns the document domain: block schema, tree operations, patches, markdown conversion, search, storage contracts, and SDUI mapping. `@lodado/sdui-document-react` turns that domain into an editor UI.

## What it is

This package is not the same layer as `@lodado/sdui-template`.

- `@lodado/sdui-template`: renders an SDUI layout document into registered React components.
- `@lodado/sdui-document`: models a block document and its operations.
- `@lodado/sdui-document-react`: provides React editor components for that block document.

Think of it as the editing surface for document-like content: paragraphs, headings, checklists, callouts, dividers, images, files, and links.

## Installation

```bash
pnpm add @lodado/sdui-document-react @lodado/sdui-document react react-dom
# or
npm install @lodado/sdui-document-react @lodado/sdui-document react react-dom
```

The package imports its editor CSS from the public entrypoint. If your bundler does not load package CSS automatically, import it explicitly:

```tsx
import '@lodado/sdui-document-react/src/styles/editor.css'
```

## Quick start

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
        state: {
          content: [{ text: 'Hello document editor' }],
        },
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

## Main philosophy

### 1. Block structure and inline editing are separate

The document is a tree of blocks. React owns block chrome, drag handles, block selection, and block type UI. ProseMirror is only mounted for the currently focused text block.

That means normal rendering stays simple, while rich inline editing still gets mature editor behavior such as marks, keyboard handling, paste handling, and selection tracking.

### 2. Edits are patch-based

The editor reports changes through `onContentChange(next, patches)`. Consumers can persist the full `next` content, or use patches for autosave, collaboration, audit logs, or undo/redo integration.

### 3. The domain remains headless

Document rules live in `@lodado/sdui-document`; React UI lives here. This keeps tree transforms, block schemas, markdown import, and patch application testable without React.

### 4. Read mode and edit mode share the same document model

`readOnly` disables editing affordances while still rendering the same block content. The same persisted document can power editor screens and read-only previews.

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
  │   ├─ block selection
  │   ├─ drag and drop via dnd-kit
  │   ├─ patch publishing
  │   └─ readOnly/edit mode switching
  ├─ BlockChrome
  │   ├─ paragraph / heading / checklist
  │   ├─ callout / divider
  │   └─ image / file / link
  ├─ FocusedBlockEditor
  │   ├─ ProseMirror editor state
  │   ├─ keymap delegation
  │   ├─ input rules
  │   ├─ paste handling
  │   └─ selection toolbar bridge
  ├─ InlineContentView
  └─ MARK_DEFINITIONS
```

## `SduiDocumentEditor`

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

Props:

| Prop              | Type                              | Description                                                           |
| ----------------- | --------------------------------- | --------------------------------------------------------------------- |
| `content`         | `SduiDocumentContent`             | Current document content.                                             |
| `onContentChange` | `(next, patches) => void`         | Called after editor changes are applied.                              |
| `onTurnInto`      | `(blockId, type, attrs?) => void` | Optional callback for block type conversion flows.                    |
| `readOnly`        | `boolean`                         | Renders content without editing controls.                             |
| `generateBlockId` | `() => string`                    | Custom block id generator. Useful when ids must be server-compatible. |
| `className`       | `string`                          | Class name for the editor root.                                       |

## Block rendering

`BlockChrome` maps document block types to React wrappers:

- `document.paragraph`
- `document.heading`
- `document.checklist`
- `document.callout`
- `document.divider`
- `document.image`
- `document.file`
- `document.link`

Text-like blocks render static inline content until focused. Once focused, the editor swaps in `FocusedBlockEditor` for ProseMirror-powered editing.

## Inline content and marks

Inline text is rendered through `InlineContentView`. The package exports mark definitions for:

- bold
- italic
- underline
- strikethrough
- code
- link
- highlight

The focused editor uses these definitions to keep the ProseMirror representation aligned with the document model.

## Drag, selection, and keyboard behavior

The editor includes:

- block drag handles via `@dnd-kit/core`
- nested block drag/drop projection
- block range selection
- focused block keyboard delegation
- split, merge backward, indent, outdent, and navigation hooks
- selection toolbar for inline marks and links

These behaviors are intentionally concentrated in the editor layer. The document package only receives semantic patches.

## Read-only rendering

```tsx
<SduiDocumentEditor content={content} readOnly />
```

Use `readOnly` for previews, published pages, or review screens. Editing controls, drag handles, focused ProseMirror editing, and patch-producing interactions are disabled.

## Exports

The package exports:

- `SduiDocumentEditor`
- `BlockChrome`
- `FocusedBlockEditor`
- ProseMirror helpers from `focused-block/pm/*`
- `InlineContentView`
- mark definitions via `MARK_DEFINITIONS`
- selection toolbar utilities

## Development

From the repository root:

```bash
pnpm install
pnpm --filter @lodado/sdui-document-react test
pnpm --filter @lodado/sdui-document-react lint
pnpm --filter @lodado/sdui-document-react build
```

Storybook examples live in `apps/docs`.

## When to use this package

Use `@lodado/sdui-document-react` when you need a React editing surface for document-like block content.

Use `@lodado/sdui-template` when you need to render server-driven layout JSON into your own registered React components.

Use both when your product has a document editor that eventually maps block content into SDUI layouts or previews.
