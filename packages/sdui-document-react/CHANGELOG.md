# @lodado/sdui-document-react

## 1.0.3

### Patch Changes

- 1ed852b: fix(editor): overlay block handles on hover instead of reserving a gutter

  The `+` and drag (⠿) handles previously reserved a ~56px `padding-left` gutter on
  every `[data-block-row]`, insetting content in both edit and read mode. The gutter
  is removed: content is now full-width and identical across modes (no shift), and
  the handles overlay the block's top-left on hover — masked by a page-background
  chip so the first line stays legible underneath. They are `pointer-events: none`
  when idle so they never intercept clicks or text selection on the first line; the
  drop hit-target remains the row itself. The unused `--sdui-doc-block-gutter`
  override is gone.

## 1.0.2

### Patch Changes

- Version bump for re-publish (no source changes since 1.0.1).

## 1.0.1

### Patch Changes

- c5023ff: fix(editor): stop content shifting between edit and read mode

  The `+` and drag (⠿) block handles were in-flow flex children, so they reserved
  a ~56px gutter only in edit mode — read mode drops them from the DOM and every
  block jumped left on mode switch. The gutter is now reserved on `[data-block-row]`
  itself (`padding-left: var(--sdui-doc-block-gutter, 56px)`, shared by editor and
  viewer) and the handles are absolutely positioned inside it. Edit rendering is
  unchanged; read mode now aligns to the same content column. Override
  `--sdui-doc-block-gutter` (e.g. to `0`) on a read-only-only surface.

- f009269: fix(a11y): raise dark-theme secondary/tertiary text contrast to WCAG AA

  On the `[data-theme='dark']` surface (`#191919`), the muted text tokens were
  too faint — `text-tertiary` sat at 2.5:1 (fails AA) and `code-block-text` at
  4.1:1. Lifted the white-alpha fallbacks (secondary 0.46→0.56, tertiary
  0.28→0.45, code-block-text 0.44→0.56) so all three clear 4.5:1 while keeping
  the three-tier hierarchy (11.7 / 6.3 / 4.5). Design-system semantic tokens still
  override the fallbacks when loaded; Swiss (light-only) is unaffected.

- d135698: fix(build): stop dropping `cloneBlockWithNewIds` / `HIGHLIGHT_PALETTE` from the ESM dist

  The main and `./viewer` entries were built in two separate `preserveModules`
  Rollup passes that both wrote to `dist/es/client`. The viewer pass tree-shook
  shared modules (`editor/blockContent.mjs`, `marks/highlight/palette.mjs`) down
  to only the exports it used, then overwrote the main pass's complete versions —
  leaving other chunks importing exports that no longer existed. Strict-ESM
  consumers (Next 16 + Turbopack) failed to build; Storybook (Vite) masked it.

  Both ES entries now build in a single Rollup pass, so shared chunks keep the
  union of used exports. Added a `postbuild` guard (`verify-dist-exports.mjs`)
  that fails the build on any dangling ESM import so this can't reach npm again.

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

- 46e7a6e: Add a CSS-layer theme system and make the new Swiss theme the default look.

  - New `theme` prop on `SduiDocumentEditor` and `SduiDocumentViewer` (`'swiss' | 'notion' | string`), rendered as `data-sdui-doc-theme` on the root. Defaults to `'swiss'`.
  - New `styles/themes/swiss.css` entrypoint — print-editorial theme covering every block type and the editor chrome (ink-on-paper palette, uppercase h2 section labels, hairline dividers, mono outline chips, square corners). Included in `styles/index.css` and `styles/viewer.css`.
  - New `sdui-doc.themes` cascade layer between `chrome` and `print`; theme rules beat base styles without `!important`, unlayered consumer CSS still wins.
  - **Visual breaking change**: documents now render with the Swiss theme by default. Pass `theme="notion"` to keep the previous Notion-like look.
  - Swiss is light-only: it pins its own ink/paper values even under `[data-theme='dark']`.

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

- Updated dependencies [947e338]
- Updated dependencies [9ea6344]
- Updated dependencies [5453bb5]
- Updated dependencies [6a8d805]
- Updated dependencies [c4b4d2c]
- Updated dependencies
- Updated dependencies [288e38c]
- Updated dependencies [722770c]
- Updated dependencies [c6db278]
- Updated dependencies [105ac84]
  - @lodado/sdui-document@1.0.0

## 0.1.0

### Minor Changes

- Initial release of the SDUI block document packages.

  - `@lodado/sdui-document`: headless block document domain (schema, patches, undo/redo, markdown import, drag/selection contracts)
  - `@lodado/sdui-document-react`: Notion-like hybrid editor bindings (focused-block ProseMirror inline editing, block renderers, selection toolbar, gesture interactions)

### Patch Changes

- Updated dependencies
  - @lodado/sdui-document@0.1.0
