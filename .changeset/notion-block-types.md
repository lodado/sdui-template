---
'@lodado/sdui-document': minor
'@lodado/sdui-document-react': minor
---

Add Notion-parity block types: bulleted list, numbered list, quote, toggle, and code.

- New domain modules with markdown round-trip (`- `/`1. ` lists nest as children, `>` imports as quote, code fences import as code blocks with language)
- Notion-identical chrome: depth-cycled bullet markers, render-time numbered ordinals, collapsible toggles (persisted `collapsed` attribute), code blocks with hover language picker
- Notion keyboard semantics: markdown prefix triggers (`- `, `1. `, `> ` toggle, `" ` quote, ` ` ``` code), empty list item Enter → paragraph, Backspace-at-start strips list type, Enter in code inserts newline
