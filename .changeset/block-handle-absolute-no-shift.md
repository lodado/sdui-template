---
'@lodado/sdui-document-react': patch
---

fix(editor): stop content shifting between edit and read mode

The `+` and drag (⠿) block handles were in-flow flex children, so they reserved
a ~56px gutter only in edit mode — read mode drops them from the DOM and every
block jumped left on mode switch. The gutter is now reserved on `[data-block-row]`
itself (`padding-left: var(--sdui-doc-block-gutter, 56px)`, shared by editor and
viewer) and the handles are absolutely positioned inside it. Edit rendering is
unchanged; read mode now aligns to the same content column. Override
`--sdui-doc-block-gutter` (e.g. to `0`) on a read-only-only surface.
