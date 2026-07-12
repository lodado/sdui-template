---
'@lodado/sdui-document-react': patch
---

fix(a11y): raise dark-theme secondary/tertiary text contrast to WCAG AA

On the `[data-theme='dark']` surface (`#191919`), the muted text tokens were
too faint — `text-tertiary` sat at 2.5:1 (fails AA) and `code-block-text` at
4.1:1. Lifted the white-alpha fallbacks (secondary 0.46→0.56, tertiary
0.28→0.45, code-block-text 0.44→0.56) so all three clear 4.5:1 while keeping
the three-tier hierarchy (11.7 / 6.3 / 4.5). Design-system semantic tokens still
override the fallbacks when loaded; Swiss (light-only) is unaffected.
