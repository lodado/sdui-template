---
'@lodado/sdui-document-react': minor
---

Add a CSS-layer theme system and make the new Swiss theme the default look.

- New `theme` prop on `SduiDocumentEditor` and `SduiDocumentViewer` (`'swiss' | 'notion' | string`), rendered as `data-sdui-doc-theme` on the root. Defaults to `'swiss'`.
- New `styles/themes/swiss.css` entrypoint — print-editorial theme covering every block type and the editor chrome (ink-on-paper palette, uppercase h2 section labels, hairline dividers, mono outline chips, square corners). Included in `styles/index.css` and `styles/viewer.css`.
- New `sdui-doc.themes` cascade layer between `chrome` and `print`; theme rules beat base styles without `!important`, unlayered consumer CSS still wins.
- **Visual breaking change**: documents now render with the Swiss theme by default. Pass `theme="notion"` to keep the previous Notion-like look.
- Swiss is light-only: it pins its own ink/paper values even under `[data-theme='dark']`.
