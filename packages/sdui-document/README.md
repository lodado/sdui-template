# @lodado/sdui-document

**Headless block document domain for SDUI — schema, patches, permissions, and SDUI adapter without editor or database coupling.**

[![npm version](https://img.shields.io/npm/v/@lodado/sdui-document.svg)](https://www.npmjs.com/package/@lodado/sdui-document)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![GitHub](https://img.shields.io/github/stars/lodado/sdui-template?style=social&label=Star)](https://github.com/lodado/sdui-template)

[![Block Document](https://img.shields.io/badge/Block-Document-7C3AED)](https://github.com/lodado/sdui-template/tree/main/packages/sdui-document)
[![Headless](https://img.shields.io/badge/Headless-No%20React-64748B)](https://github.com/lodado/sdui-template/tree/main/packages/sdui-document)
[![Patches](https://img.shields.io/badge/Edits-Patch--based-059669)](https://github.com/lodado/sdui-template/tree/main/packages/sdui-document)

[Quick start](#quick-start) · [Philosophy](#philosophy) · [Architecture](#architecture) · [Patches](#applying-block-patches) · [Adapters](#adapter-contracts) · [Development](#development)

---

`@lodado/sdui-document` owns **what a document means**: block tree semantics, patch-based edits, permission policy, autosave state, and conversion to SDUI layout shape. It deliberately excludes MobX, ProseMirror, Yjs, React, and concrete storage.

```
SduiDocumentContent → patches → applyDocumentPatch → toSduiLayoutDocument → SduiLayoutRenderer
```

Pairs with:

| Package                       | Role                                               |
| ----------------------------- | -------------------------------------------------- |
| `@lodado/sdui-document`       | Document meaning, tree rules, patches              |
| `@lodado/sdui-template`       | SDUI normalization, subscriptions, React rendering |
| `@lodado/sdui-document-react` | React block editor UI                              |

### End-to-end example

| **① block tree** | →   | **② SDUI adapter** | →   | **③ render** |
| ---------------- | --- | ------------------ | --- | ------------ |

```tsx
import { SduiLayoutRenderer } from '@lodado/sdui-template'
import { sduiComponents } from '@lodado/sdui-template-component'
import { createDocumentBlock, toSduiLayoutDocument, type SduiDocumentContent } from '@lodado/sdui-document'

const content: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'heading',
        type: 'document.heading',
        state: { text: 'Project notes', level: 1 },
      }),
      createDocumentBlock({
        id: 'paragraph',
        type: 'document.paragraph',
        state: { text: 'Rendered through SDUI.' },
      }),
    ],
  }),
}

const layoutDocument = toSduiLayoutDocument(content, {
  documentId: 'doc-1',
  title: 'Project notes',
})

export function DocumentPreview() {
  return <SduiLayoutRenderer document={layoutDocument} components={sduiComponents} />
}
```

---

## Table of Contents

- [Why this exists](#why-this-exists)
- [Philosophy](#philosophy)
- [Architecture](#architecture)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Creating content](#creating-document-content)
- [Applying block patches](#applying-block-patches)
- [Document tree operations](#document-tree-operations)
- [Permissions](#permission-policy)
- [Autosave](#autosave-state-machine)
- [Content helpers](#content-helpers)
- [Adapter contracts](#adapter-contracts)
- [Recommended flow](#recommended-application-flow)
- [Development](#development)
- [Design constraints](#design-constraints)

---

## Why this exists

Notion-like products need a stable document model that survives renderer, backend, and editor changes. Coupling document semantics to ProseMirror transactions or React state makes testing and server-side validation painful.

This package provides a **clean-room contract**: pure functions, immutable patches, and adapter interfaces for persistence, storage, search, and future collaboration.

## Philosophy

### 1. Documents are domain data, not editor internals

```text
SduiDocument
└─ SduiDocumentContent
   └─ SduiDocumentBlock
      ├─ document.heading
      ├─ document.paragraph
      ├─ document.checklist
      └─ document.link
```

No ProseMirror transactions, MobX observables, Yjs updates, or DOM selection in the public API.

### 2. SDUI renders; this package defines meaning

`toSduiLayoutDocument` lowers semantic blocks into an SDUI-compatible shape. `@lodado/sdui-template` renders it.

### 3. Patch-based editing

```text
block.insert | block.update | block.delete | block.move
```

Enables autosave, optimistic UI, version conflicts, and future collaboration without a rich-text engine.

### 4. Block-level first

Deferred until proven necessary: character-level CRDT, ProseMirror plugins, complex inline marks, table cell selection, concrete storage/search backends.

### 5. Pure functions first

Patch application, tree moves, permissions, autosave, traversal, and text extraction are pure TypeScript — safe in client, server, and worker contexts.

---

## Architecture

```text
src/
  schema/          Public document, block, patch, event, workspace types
  content/         Traversal, plain text, link extraction
  blocks/          Patch engine and block-level errors
  tree/            Document parent/collection tree operations
  permissions/     Pure role/action policy
  autosave/        Autosave reducer / state machine
  repositories/    Persistence contract
  storage/         Attachment storage contract
  search/          Search indexer contract
  collaboration/   Future collaboration adapter contract
  sdui/            Document content → SDUI layout adapter
```

| Layer         | Responsibility               | Should not do            |
| ------------- | ---------------------------- | ------------------------ |
| `schema`      | Stable public contracts      | Runtime persistence      |
| `blocks`      | Apply patches                | Talk to APIs or React    |
| `tree`        | Move/archive document nodes  | Edit block content       |
| `permissions` | Actor/action decisions       | Trust client-only checks |
| `autosave`    | Track save state             | Timers or network calls  |
| `sdui`        | Convert blocks to SDUI nodes | Own document semantics   |

---

## Installation

Monorepo workspace:

```json
{
  "dependencies": {
    "@lodado/sdui-document": "workspace:*"
  }
}
```

```bash
pnpm install
```

---

## Quick start

See [end-to-end example](#end-to-end-example) above.

---

## Creating document content

```ts
import { createDocumentBlock, type SduiDocumentContent } from '@lodado/sdui-document'

const content: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'todo-1',
        type: 'document.checklist',
        state: { text: 'Ship headless core', checked: true },
      }),
      createDocumentBlock({
        id: 'callout-1',
        type: 'document.callout',
        state: { text: 'Keep rich text out until proven.' },
      }),
    ],
  }),
}
```

### Supported block types

```ts
type SduiDocumentBlockType =
  | 'document.root'
  | 'document.paragraph'
  | 'document.heading'
  | 'document.checklist'
  | 'document.divider'
  | 'document.callout'
  | 'document.image'
  | 'document.file'
  | 'document.link'
```

---

## Applying block patches

Immutable — returns new content, never mutates input.

```ts
import { applyDocumentPatch, createDocumentBlock } from '@lodado/sdui-document'

// Insert
const next = applyDocumentPatch(content, {
  type: 'block.insert',
  parentId: 'root',
  before: 'existing-block-id',
  block: createDocumentBlock({
    id: 'new-paragraph',
    type: 'document.paragraph',
    state: { text: 'A newly inserted block.' },
  }),
})

// Update
applyDocumentPatch(next, {
  type: 'block.update',
  blockId: 'new-paragraph',
  state: { text: 'Updated text' },
})

// Move
applyDocumentPatch(next, {
  type: 'block.move',
  blockId: 'new-paragraph',
  parentId: 'root',
  after: null,
})

// Delete
applyDocumentPatch(next, {
  type: 'block.delete',
  blockId: 'new-paragraph',
})
```

### Block ordering (schema 1.1)

Sibling order uses fractional `position` strings. Anchors replace numeric indices:

| Anchor                  | Meaning                                 |
| ----------------------- | --------------------------------------- |
| `after: null`           | Prepend as first child                  |
| `before: null`          | Append as last child                    |
| `after: 'block-id'`     | Insert after sibling                    |
| `before: 'block-id'`    | Insert before sibling                   |
| `fallbackAfter: ['id']` | Offline replay when `after` was deleted |

Schema `1.0` documents migrate to `1.1` lazily on first patch.

**Errors:** `BlockNotFoundError`, `ParentBlockNotFoundError`, `InvalidBlockMoveError`, `RootBlockCannotBeDeletedError`

---

## Document tree operations

Manage relationships between documents (not blocks inside a document):

```ts
import { moveDocument, archiveDocumentSubtree, restoreDocumentSubtree } from '@lodado/sdui-document'

moveDocument({
  documents,
  documentId: 'doc-a',
  targetParentDocumentId: 'doc-b',
  targetIndex: 0,
})

archiveDocumentSubtree({ documents, documentId: 'doc-a' })
```

**Errors:** `DocumentNotFoundError`, `InvalidDocumentDestinationError`

---

## Permission policy

Pure decisions from actor role + action:

```ts
import { canPerformDocumentAction, getDocumentAccessMode } from '@lodado/sdui-document'

canPerformDocumentAction({ actor, action: 'read' }) // boolean
getDocumentAccessMode({ actor }) // 'none' | 'readOnly' | 'editable'
```

| Actor role         | Read | Update |
| ------------------ | ---- | ------ |
| workspace admin    | yes  | yes    |
| collection manager | yes  | yes    |
| collection editor  | yes  | yes    |
| collection viewer  | yes  | no     |
| document editor    | yes  | yes    |
| guest (no role)    | no   | no     |

> Client checks are UX gating only. Server adapters must re-check before writes.

---

## Autosave state machine

Pure reducer — no timers, debounce, or fetch:

```ts
import { createInitialAutosaveState, reduceAutosaveState } from '@lodado/sdui-document'

let state = createInitialAutosaveState()
state = reduceAutosaveState(state, { type: 'local.change', patchCount: 1 })
state = reduceAutosaveState(state, { type: 'save.request' })
state = reduceAutosaveState(state, {
  type: 'save.success',
  acknowledgedVersion: state.localVersion,
})
```

Statuses: `idle` | `dirty` | `saving` | `saved` | `failed` | `offline`

- Stale save success is ignored
- Save failure preserves pending patches
- Offline edits return to `dirty` when back online

---

## Content helpers

```ts
import { extractPlainText, extractDocumentLinks, walkDocumentBlocks } from '@lodado/sdui-document'

extractPlainText(content) // plain text for search/preview
extractDocumentLinks(content) // backlink extraction
walkDocumentBlocks(content, fn) // depth-first traversal
```

---

## Adapter contracts

Interfaces only — no concrete implementations:

| Interface                          | Purpose                                      |
| ---------------------------------- | -------------------------------------------- |
| `SduiDocumentRepository`           | `getDocument`, `savePatches`, `moveDocument` |
| `SduiDocumentAttachmentStorage`    | Upload/download URLs                         |
| `SduiDocumentSearchIndexer`        | Index, remove, search                        |
| `SduiDocumentCollaborationAdapter` | Future block-level collaboration             |

Implement for REST, Next.js routes, IndexedDB, Postgres, S3, or search providers.

---

## Recommended application flow

```text
1. Load SduiDocument from repository/API
2. Check access with canPerformDocumentAction
3. Render via toSduiLayoutDocument + SduiLayoutRenderer
4. Convert UI edits → SduiDocumentPatch
5. Apply locally with applyDocumentPatch (optimistic UI)
6. Persist patches through SduiDocumentRepository
7. Track save status with reduceAutosaveState
8. Extract text/links for search as async side effect
```

Storybook: `apps/docs/src/stories/SduiDocument.stories.tsx`

---

## Development

```bash
pnpm --filter @lodado/sdui-document test
pnpm --filter @lodado/sdui-document lint
pnpm --filter @lodado/sdui-document build
```

---

## Design constraints

### Do not add yet

- React editor components
- Concrete DB / storage / search clients
- Yjs/Hocuspocus, ProseMirror, MobX

### One-line rule

```text
sdui-document owns meaning.
sdui-template owns rendering.
patches express edits.
adapters connect infrastructure.
```

---

## License

MIT
