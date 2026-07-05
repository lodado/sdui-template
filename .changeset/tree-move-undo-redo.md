---
'@lodado/sdui-document': minor
'@lodado/sdui-document-react': minor
---

Add undo/redo support for document tree moves and title changes.

- `moveDocumentWithInverse` returns an inverse move input that rolls the move back; `moveDocument`/`archiveDocumentSubtree`/`restoreDocumentSubtree` accept an injectable clock for deterministic `updatedAt`/`occurredAt` stamps.
- `applyPatchesToDocumentWithInverse` inverts mixed batches at the document level, including `document.setTitle` (which the content-level pipeline cannot invert).
- History two-stack is now generic (`createHistory<T>`, `History<T>`, `HistoryEntry<T>`); `DocumentHistory` types remain as aliases.
- New `useDocumentTreeHistory` hook: tree-move undo/redo on a stack deliberately separate from document content history, with drop-on-conflict when a referenced document disappeared.
