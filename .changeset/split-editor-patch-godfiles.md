---
'@lodado/sdui-document': patch
'@lodado/sdui-document-react': patch
---

Internal refactor: split the oversized editor and patch-engine modules into focused, single-responsibility files. No runtime behavior change — public import surfaces are preserved via barrels.

- `SduiDocumentEditor.tsx` (1028 lines) reduced to a ~210-line orchestrator; extracted `BlockNode`, `EditorRuntimeContext`, `editorConstants`, `blockContent`, and the `useEditorHandlers` / `useSelectionKeyboard` hooks.
- `blocks/code/blockPatch.ts` (678 lines) reduced to a re-export barrel over a new `blocks/code/patch/` folder (`traverse`, `structuralSharing`, `inlineState`, `operations`, `apply`, `inverse`, `document`).
- `FocusedBlockEditor.tsx` extracted `linkHref`, `caret`, and the `useBlockMenuState` hook; `useInlineTextDragDrop` extracted its pure DOM/parse helpers into `inlineDragDom`.
