---
'@lodado/sdui-document-react': patch
---

On touch devices (`hover: none` + `pointer: coarse`), the ⠿ drag handle and '+' insert button are no longer pinned visible on every block. They now appear only on the focused or selected block, matching the block the user just tapped. Image/code content controls stay always visible on touch.
