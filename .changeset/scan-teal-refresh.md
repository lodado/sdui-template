---
'@lodado/sdui-design-files': minor
'@lodado/sdui-template-component': patch
---

Scan Teal brand refresh

- **design-files**: new `--brand-100..1000` primitive ramp (Scan Teal, the first
  actually-defined primitive ramp). Brand/selected/link/focus semantics remapped
  from ADS blue to the brand ramp in both themes; information stays blue, visited
  links stay purple. Neutral ink and dark surfaces tinted toward the brand hue.
  WCAG AA contrast boundaries enforced by tests (4.5:1 text, 3:1 focus ring).
- **component**: fixed 18 references to nonexistent tokens (truncated names that
  forced hardcoded fallbacks and broke dark-mode theming in dialog, tag, tooltip)
  and synced 66 drifted fallback hexes to colors.css. Added a static sync test so
  fallbacks can no longer drift.
