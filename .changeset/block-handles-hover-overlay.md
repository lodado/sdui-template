---
'@lodado/sdui-document-react': patch
---

fix(editor): overlay block handles on hover instead of reserving a gutter

The `+` and drag (⠿) handles previously reserved a ~56px `padding-left` gutter on
every `[data-block-row]`, insetting content in both edit and read mode. The gutter
is removed: content is now full-width and identical across modes (no shift), and
the handles overlay the block's top-left on hover — masked by a page-background
chip so the first line stays legible underneath. They are `pointer-events: none`
when idle so they never intercept clicks or text selection on the first line; the
drop hit-target remains the row itself. The unused `--sdui-doc-block-gutter`
override is gone.
