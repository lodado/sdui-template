# @lodado/sdui-document

## 1.0.0

### Major Changes

- Remove the `document.sdui` block and all reverse SDUI-layout embedding from the document packages.

  **Breaking**

  - Removed `document.sdui` block type and its registry/schema/markdown adapters from `@lodado/sdui-document`.
  - Removed `SduiLayoutBlock`, `SduiDocumentBridgeContext`, `SduiComponentsContext`, `DocumentEditorNode`, and `DocumentViewerNode` from `@lodado/sdui-document-react`.
  - Dropped `@lodado/sdui-template` as a dependency of `@lodado/sdui-document-react`.
  - The block-document → layout-document bridge via `toSduiLayoutDocument()` is unchanged and remains the supported direction.

  **Patch anchor hardening**

  - `StaleAnchorError` is thrown when insert/move anchors reference a block that no longer exists (supports offline replay and collaboration outbox retries).
  - Stricter anchor resolution in the patch engine and outbox rebase path.

### Minor Changes

- 947e338: feat: block menu — slash command (`/`) and `+` gutter button for inserting all block types

  - `createDefaultBlock(type, id, attributes?)` factory in the core package
  - Slash detection PM plugin with `FocusedBlockCallbacks` delegation (open/query/close/key routing)
  - Radix Popover `BlockMenu` with ko/en keyword filtering, keyboard navigation, and a link URL entry view
  - Notion insert semantics: empty block converts in place (`block.setType`), non-empty inserts a sibling below (`block.insert`); single-step undo
  - `+` gutter button inserts an empty paragraph below and opens the menu on it
  - Image/file picking with a new `onUploadFile` editor prop (object-URL fallback), upload placeholder/error rendering on Image/File blocks

- 9ea6344: Add event-sourced collaboration core: hybrid logical clock, PatchEnvelope
  transport with zod validation, append-only DocumentLog with snapshot replay,
  a pure server sequencer with block-granular conflict rejection, and a client
  outbox with optimistic apply + rebase (R3). Purely additive — existing patch
  engine APIs are unchanged.
- 5453bb5: Add Notion-style horizontal column split blocks. Domain: `document.columnList`
  / `document.column` block types (ratio-weighted columns), structural invariant
  repair (`normalizeColumnStructure`), horizontal drag-drop patch builders with
  deterministic container ids (`createHorizontalBlockDropPatches`,
  `projectHorizontalBlockDrop` — fixed 40px edge band), same-batch cleanup for
  atomic undo (`appendColumnCleanupPatches`), and pair resize math
  (`resizeColumnPair`, `createColumnResizePatches`). React editor: layout-only
  column containers, left/right edge drop zones with a vertical drop indicator,
  and an accessible resize gutter (pointer drag + arrow keys). Markdown
  serializes columns vertically (lossy by policy). Purely additive.
- 6a8d805: Replace numeric block indices with fractional position keys and neighbor anchor patches (`after` / `before` / `fallbackAfter`). **Breaking:** `block.insert` and `block.move` no longer accept `index`; migrate patch producers to anchor fields. Documents migrate from schema 1.0 to 1.1 on first patch apply.
- c4b4d2c: Add Notion-parity block types: bulleted list, numbered list, quote, toggle, and code.

  - New domain modules with markdown round-trip (`- `/`1. ` lists nest as children, `>` imports as quote, code fences import as code blocks with language)
  - Notion-identical chrome: depth-cycled bullet markers, render-time numbered ordinals, collapsible toggles (persisted `collapsed` attribute), code blocks with hover language picker
  - Notion keyboard semantics: markdown prefix triggers (`- `, `1. `, `> ` toggle, `" ` quote, ` ` ``` code), empty list item Enter → paragraph, Backspace-at-start strips list type, Enter in code inserts newline

- 288e38c: Harden the core document model: correctness fixes plus structural tidy-ups (spec P1 + P2).

  **Correctness**

  - Every patch `switch` is now exhaustive via `assertNever` — adding a `SduiDocumentPatch` variant fails to compile until handled, instead of silently no-op'ing.
  - `block.update` re-derives the `state.text` cache from `state.content`, so a content-only edit can no longer leave `text` stale.
  - Patch application is now copy-on-write via a per-apply write scope (replacing the hand-maintained `touchedBlockIds` manifest); the original content can no longer be silently mutated. Guarded by a deep-freeze test.
  - Per-type `state`/`attributes` zod schemas are enforced at the parse boundary (`parseSduiDocument*`) — previously declared but never invoked. Unknown/custom block types stay open.
  - All domain errors now extend a shared `SduiDocumentError` base, so callers can catch every expected failure with one `instanceof`. Markdown import's bare `throw new Error` is now `UnsupportedMarkdownError`.

  **Structure**

  - `blocks/code` renamed to `blocks/patch` (it is the patch engine, not the code block).
  - Tree traversal primitives moved to `blocks/traverse`; `ordering/rebalance` reuses them instead of a duplicate copy.
  - Shared blockquote serialization extracted for quote/callout; list-item classification now lives on each block-type module (`isListItem`) instead of a hardcoded set in the markdown serializer.

  **Breaking**

  - `blocks/patch` public surface is now curated. Two internal helpers are no longer exported from the package root: `deriveUniqueBlockId` and `createEmptyParagraphBlock`. All previously-documented public patch APIs are unchanged.

- 105ac84: Add undo/redo support for document tree moves and title changes.

  - `moveDocumentWithInverse` returns an inverse move input that rolls the move back; `moveDocument`/`archiveDocumentSubtree`/`restoreDocumentSubtree` accept an injectable clock for deterministic `updatedAt`/`occurredAt` stamps.
  - `applyPatchesToDocumentWithInverse` inverts mixed batches at the document level, including `document.setTitle` (which the content-level pipeline cannot invert).
  - History two-stack is now generic (`createHistory<T>`, `History<T>`, `HistoryEntry<T>`); `DocumentHistory` types remain as aliases.
  - New `useDocumentTreeHistory` hook: tree-move undo/redo on a stack deliberately separate from document content history, with drop-on-conflict when a referenced document disappeared.

### Patch Changes

- 722770c: Internal refactor: split the oversized editor and patch-engine modules into focused, single-responsibility files. No runtime behavior change — public import surfaces are preserved via barrels.

  - `SduiDocumentEditor.tsx` (1028 lines) reduced to a ~210-line orchestrator; extracted `BlockNode`, `EditorRuntimeContext`, `editorConstants`, `blockContent`, and the `useEditorHandlers` / `useSelectionKeyboard` hooks.
  - `blocks/code/blockPatch.ts` (678 lines) reduced to a re-export barrel over a new `blocks/code/patch/` folder (`traverse`, `structuralSharing`, `inlineState`, `operations`, `apply`, `inverse`, `document`).
  - `FocusedBlockEditor.tsx` extracted `linkHref`, `caret`, and the `useBlockMenuState` hook; `useInlineTextDragDrop` extracted its pure DOM/parse helpers into `inlineDragDom`.

- c6db278: TOGGLE_BLOCK_TYPE·CODE_BLOCK_TYPE 상수를 패키지 루트에서 export (react 패키지 매직스트링 제거용)

## 0.1.0

### Minor Changes

- Initial release of the SDUI block document packages.

  - `@lodado/sdui-document`: headless block document domain (schema, patches, undo/redo, markdown import, drag/selection contracts)
  - `@lodado/sdui-document-react`: Notion-like hybrid editor bindings (focused-block ProseMirror inline editing, block renderers, selection toolbar, gesture interactions)
