---
'@lodado/sdui-document': minor
'@lodado/sdui-document-react': minor
---

Replace numeric block indices with fractional position keys and neighbor anchor patches (`after` / `before` / `fallbackAfter`). **Breaking:** `block.insert` and `block.move` no longer accept `index`; migrate patch producers to anchor fields. Documents migrate from schema 1.0 to 1.1 on first patch apply.
