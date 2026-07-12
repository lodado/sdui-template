---
'@lodado/sdui-document-react': patch
---

fix(editor): reserve the handle gutter on desktop so handles stop eating first-word selection

The hover-overlay handles (from the previous change) sit over the block's top-left
and must be `pointer-events: auto` while revealed to stay grabbable — so on hover
they intercepted click/double-click text selection on the first word (a short word
sits entirely under the ~50px chip, making it unselectable by double-click while the
row is hovered). On viewports `>= 768px`, `[data-block-row]` again reserves a 52px
`padding-left` gutter so the `+`/⠿ handles sit to the left of the text instead of over
it; text is fully selectable and the handles stay grabbable. The padding applies to
read and edit modes equally, so there is no mode shift. Below 768px (and on
touch-primary devices, where handles are pinned visible) the full-width overlay is
unchanged. Width-gated rather than `(hover)`/`(pointer)`-gated because headless
Firefox misreports those media features.
