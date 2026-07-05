---
'@lodado/sdui-document': minor
'@lodado/sdui-document-react': minor
---

Add Notion-style horizontal column split blocks. Domain: `document.columnList`
/ `document.column` block types (ratio-weighted columns), structural invariant
repair (`normalizeColumnStructure`), horizontal drag-drop patch builders with
deterministic container ids (`createHorizontalBlockDropPatches`,
`projectHorizontalBlockDrop` — fixed 40px edge band), same-batch cleanup for
atomic undo (`appendColumnCleanupPatches`), and pair resize math
(`resizeColumnPair`, `createColumnResizePatches`). React editor: layout-only
column containers, left/right edge drop zones with a vertical drop indicator,
and an accessible resize gutter (pointer drag + arrow keys). Markdown
serializes columns vertically (lossy by policy). Purely additive.
