# @lodado/sdui-document

Headless clean-room document domain package for SDUI block documents.

`@lodado/sdui-document` provides the document semantics for a Notion-like block document system without depending on MobX, ProseMirror, Yjs, a database, or a specific React editor implementation.

It is designed to pair with `@lodado/sdui-template`:

```text
@lodado/sdui-document
→ owns document meaning, tree rules, patches, permissions, autosave state, adapter contracts

@lodado/sdui-template
→ owns SDUI normalization, node subscriptions, and React rendering
```

---

## Philosophy

### 1. Documents are domain data, not editor internals

A document is represented as a semantic block tree:

```text
SduiDocument
└─ SduiDocumentContent
   └─ SduiDocumentBlock
      ├─ document.heading
      ├─ document.paragraph
      ├─ document.checklist
      ├─ document.callout
      └─ document.link
```

The document model does **not** expose ProseMirror transactions, MobX observables, Yjs updates, DOM selection, or renderer-specific component props.

That separation keeps the clean-room contract stable even if the renderer, backend, or editor UI changes later.

### 2. SDUI renders the document; this package defines what the document means

`@lodado/sdui-document` is not a renderer. It can lower document content into an SDUI layout shape via `toSduiLayoutDocument`, then `@lodado/sdui-template` renders it.

```text
SduiDocumentContent
→ toSduiLayoutDocument(...)
→ SduiLayoutDocument-compatible shape
→ <SduiLayoutRenderer />
```

### 3. Patch-based editing over editor-framework coupling

Edits are expressed as block patches:

```text
block.insert
block.update
block.delete
block.move
```

This makes autosave, optimistic UI, version conflict handling, and future collaboration easier to reason about without adopting a full rich-text engine too early.

### 4. Start block-level, add rich text only when proven necessary

The current target is a block document editor, not a full Notion clone.

Intentionally deferred:

- character-level collaborative editing
- ProseMirror-style schema/transaction/plugin model
- Yjs CRDT state
- complex inline marks
- selection-based comments
- table/cell selection editing
- storage/search/backend vendor choices

### 5. Pure functions first

Core behavior is implemented as pure TypeScript functions:

- block patch application
- document tree movement
- permission decisions
- autosave state transitions
- content traversal
- plain text extraction
- link extraction

This makes the package easy to test and safe to reuse in client, server, and worker contexts.

---

## Architecture

```text
packages/sdui-document/src/
  schema/          Public document, block, patch, event, workspace, collection types
  content/         Block traversal, plain text extraction, document link extraction
  blocks/          Block patch engine and block-level errors
  tree/            Document parent/collection tree operations
  permissions/     Pure role/action permission policy
  autosave/        Autosave reducer/state machine
  repositories/    Document persistence contract
  storage/         Attachment storage contract
  search/          Search indexer contract
  collaboration/   Future collaboration adapter contract
  sdui/            Adapter from document content to SDUI layout shape
```

### Layer responsibilities

| Layer | Responsibility | Should not do |
| --- | --- | --- |
| `schema` | Define stable public document contracts | Runtime persistence or rendering |
| `content` | Read semantic content from block trees | Mutate content |
| `blocks` | Apply block patches to document content | Talk to APIs or React |
| `tree` | Move/archive/restore document nodes | Edit block content |
| `permissions` | Decide actor/action access | Trust client-only checks |
| `autosave` | Track local/save/offline state | Perform timers or network calls |
| `repositories` | Describe persistence API shape | Provide a concrete DB implementation |
| `storage` | Describe attachment upload/download shape | Bind to S3/GCS/local disk |
| `search` | Describe indexing/search shape | Pick a search engine |
| `collaboration` | Describe future collaboration connection shape | Implement Yjs/Hocuspocus |
| `sdui` | Convert semantic blocks to SDUI layout nodes | Own document semantics |

---

## Installation / workspace usage

Inside this monorepo:

```json
{
  "dependencies": {
    "@lodado/sdui-document": "workspace:*"
  }
}
```

Then run:

```bash
pnpm install
```

---

## Quick start: render a document with SDUI

```tsx
import { SduiLayoutRenderer } from '@lodado/sdui-template';
import { sduiComponents } from '@lodado/sdui-template-component';
import {
  createDocumentBlock,
  toSduiLayoutDocument,
  type SduiDocumentContent,
} from '@lodado/sdui-document';

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
        state: { text: 'This document is rendered through SDUI.' },
      }),
    ],
  }),
};

const layoutDocument = toSduiLayoutDocument(content, {
  documentId: 'doc-1',
  title: 'Project notes',
});

export function DocumentPreview() {
  return <SduiLayoutRenderer document={layoutDocument} components={sduiComponents} />;
}
```

`toSduiLayoutDocument` currently maps semantic document blocks to existing SDUI component types such as `Div` and `Span`. Dedicated document block renderers can be added later without changing the semantic document model.

---

## Creating document content

Use `createDocumentBlock` to create a defensive block copy:

```ts
import { createDocumentBlock, type SduiDocumentContent } from '@lodado/sdui-document';

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
        state: { text: 'Keep rich text out until the need is proven.' },
      }),
      createDocumentBlock({
        id: 'link-1',
        type: 'document.link',
        state: { text: 'Architecture ADR' },
        attributes: { href: '/docs/architecture', targetDocumentId: 'architecture' },
      }),
    ],
  }),
};
```

Supported core block types:

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
  | 'document.link';
```

Unknown custom block types are allowed structurally, but only known types have first-class adapter behavior today.

---

## Applying block patches

Use patches to represent local edits.

```ts
import { applyDocumentPatch, createDocumentBlock } from '@lodado/sdui-document';

const nextContent = applyDocumentPatch(content, {
  type: 'block.insert',
  parentId: 'root',
  index: 1,
  block: createDocumentBlock({
    id: 'new-paragraph',
    type: 'document.paragraph',
    state: { text: 'A newly inserted block.' },
  }),
});
```

Update a block:

```ts
const updated = applyDocumentPatch(nextContent, {
  type: 'block.update',
  blockId: 'new-paragraph',
  state: { text: 'Updated text' },
});
```

Move a block:

```ts
const moved = applyDocumentPatch(updated, {
  type: 'block.move',
  blockId: 'new-paragraph',
  parentId: 'root',
  index: 0,
});
```

Delete a block:

```ts
const deleted = applyDocumentPatch(moved, {
  type: 'block.delete',
  blockId: 'new-paragraph',
});
```

The patch engine is intentionally immutable: it returns a new content object and does not mutate the original content.

Patch errors:

- `BlockNotFoundError`
- `ParentBlockNotFoundError`
- `InvalidBlockMoveError`
- `RootBlockCannotBeDeletedError`

---

## Document tree operations

Document tree operations manage relationships between documents, not blocks inside a document.

```ts
import { moveDocument } from '@lodado/sdui-document';

const result = moveDocument({
  documents,
  documentId: 'doc-a',
  targetParentDocumentId: 'doc-b',
  targetIndex: 0,
});
```

Move a subtree to another collection:

```ts
const result = moveDocument({
  documents,
  documentId: 'doc-a',
  targetCollectionId: 'collection-2',
});
```

When a document moves across collections, descendants move to that collection too.

Lifecycle helpers:

```ts
archiveDocumentSubtree({ documents, documentId: 'doc-a' });
restoreDocumentSubtree({ documents, documentId: 'doc-a' });
getDocumentDescendantIds(documents, 'doc-a');
```

Tree errors:

- `DocumentNotFoundError`
- `InvalidDocumentDestinationError`

---

## Permission policy

Permissions are pure decisions based on actor role and action.

```ts
import { canPerformDocumentAction, getDocumentAccessMode } from '@lodado/sdui-document';

const actor = {
  id: 'viewer-1',
  workspaceRole: 'member',
  collectionRole: 'viewer',
} as const;

const read = canPerformDocumentAction({ actor, action: 'read' });
const update = canPerformDocumentAction({ actor, action: 'update' });
const mode = getDocumentAccessMode({ actor });
```

Possible access modes:

```ts
type SduiDocumentAccessMode = 'none' | 'readOnly' | 'editable';
```

Current default role behavior:

| Actor role | Read | Update | Notes |
| --- | --- | --- | --- |
| workspace admin | yes | yes | privileged actor |
| collection manager | yes | yes | can share |
| collection editor | yes | yes | can edit and comment |
| collection viewer | yes | no | read-only |
| document editor | yes | yes | can override collection viewer |
| guest with no role | no | no | denied |

Client-side permission checks are for UX gating only. Server/repository adapters should re-check permissions before writes.

---

## Autosave state machine

Autosave is a pure reducer. It does not own timers, debounce, fetch, or persistence.

```ts
import { createInitialAutosaveState, reduceAutosaveState } from '@lodado/sdui-document';

let state = createInitialAutosaveState();

state = reduceAutosaveState(state, {
  type: 'local.change',
  patchCount: 1,
});

state = reduceAutosaveState(state, { type: 'save.request' });

state = reduceAutosaveState(state, {
  type: 'save.success',
  acknowledgedVersion: state.localVersion,
});
```

Important semantics:

- local changes increment `localVersion`
- save success only clears pending work when the acknowledged version is current
- stale save success is ignored
- save failure preserves pending patches
- offline edits remain pending and return to `dirty` when back online

Statuses:

```ts
type AutosaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'failed' | 'offline';
```

---

## Content helpers

Extract plain text:

```ts
import { extractPlainText } from '@lodado/sdui-document';

const text = extractPlainText(content);
```

Extract document links:

```ts
import { extractDocumentLinks } from '@lodado/sdui-document';

const links = extractDocumentLinks(content);
```

Walk all blocks depth-first:

```ts
import { walkDocumentBlocks } from '@lodado/sdui-document';

walkDocumentBlocks(content, (block) => {
  // inspect block
});
```

These helpers are useful for search indexing, backlink extraction, previews, and diagnostics.

---

## Adapter contracts

The package exports interfaces for future integration points. They intentionally do not provide concrete implementations.

### Repository

```ts
interface SduiDocumentRepository {
  getDocument(id): Promise<SduiDocument | undefined>;
  savePatches(input): Promise<SaveDocumentPatchesResult>;
  moveDocument(input): Promise<MoveDocumentResult>;
}
```

### Storage

```ts
interface SduiDocumentAttachmentStorage {
  createUpload(input): Promise<CreateUploadResult>;
  createDownloadUrl(input): Promise<CreateDownloadUrlResult>;
}
```

### Search

```ts
interface SduiDocumentSearchIndexer {
  indexDocument(input): Promise<void>;
  removeDocument(input): Promise<void>;
  search(input): Promise<SearchDocumentsResult>;
}
```

### Collaboration

```ts
interface SduiDocumentCollaborationAdapter {
  connect(input): Promise<CollaborationSession>;
}
```

Use these contracts to implement application-specific adapters for REST, Next.js routes, IndexedDB, Postgres, object storage, search providers, or future block-level collaboration.

---

## Recommended application flow

```text
1. Load SduiDocument from your repository/API.
2. Check actor access with canPerformDocumentAction or getDocumentAccessMode.
3. Render content through toSduiLayoutDocument + SduiLayoutRenderer.
4. Convert UI edits into SduiDocumentPatch objects.
5. Apply patches locally with applyDocumentPatch for optimistic UI.
6. Send patches through your SduiDocumentRepository implementation.
7. Track save status with reduceAutosaveState.
8. Extract plain text/links for search and backlinks as an async side effect.
```

---

## Storybook examples

See:

```text
apps/docs/src/stories/SduiDocument.stories.tsx
```

Included variations:

- read-only knowledge base
- editable draft
- saving and failed save states
- nested blocks and document links
- media/attachment contract
- permission matrix

---

## Testing

Run package tests:

```bash
pnpm --filter @lodado/sdui-document test
```

Run lint:

```bash
pnpm --filter @lodado/sdui-document lint
```

Run build:

```bash
pnpm --filter @lodado/sdui-document build
```

Current core test coverage focuses on:

- schema/content helpers
- block patch behavior
- document tree operations
- permission policy
- autosave state transitions
- adapter contracts
- SDUI layout adapter

---

## Design constraints

### Do not put these in this package yet

- React editor components
- concrete database clients
- concrete object storage clients
- concrete search provider clients
- Yjs/Hocuspocus runtime
- ProseMirror schema/plugins
- MobX stores

### Add them only when needed

If the product later needs richer UI, prefer adding separate adapters/packages:

```text
@sdui-document-react          // React editor shell/hooks
@sdui-document-blocks         // dedicated document block renderers
@sdui-document-collaboration  // Yjs or block-level collaboration adapter
```

Until then, keep `@lodado/sdui-document` headless and boring.

---

## One-line rule

```text
sdui-document owns meaning.
sdui-template owns rendering.
patches express edits.
adapters connect real infrastructure.
```
