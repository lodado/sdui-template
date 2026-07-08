---
'@lodado/sdui-document': minor
---

Harden the core document model: correctness fixes plus structural tidy-ups (spec P1 + P2).

**Correctness**

- Every patch `switch` is now exhaustive via `assertNever` — adding a `SduiDocumentPatch` variant fails to compile until handled, instead of silently no-op'ing.
- `block.update` re-derives the `state.text` cache from `state.content`, so a content-only edit can no longer leave `text` stale.
- Patch application is now copy-on-write via a per-apply write scope (replacing the hand-maintained `touchedBlockIds` manifest); the original content can no longer be silently mutated. Guarded by a deep-freeze test.
- Per-type `state`/`attributes` zod schemas are enforced at the parse boundary (`parseSduiDocument*`) — previously declared but never invoked. Unknown/custom block types stay open.
- All domain errors now extend a shared `SduiDocumentError` base, so callers can catch every expected failure with one `instanceof`. Markdown import's bare `throw new Error` is now `UnsupportedMarkdownError`.

**Structure**

- `blocks/code` renamed to `blocks/patch` (it is the patch engine, not the code block).
- Tree traversal primitives moved to `blocks/traverse`; `ordering/rebalance` reuses them instead of a duplicate copy.
- Shared blockquote serialization extracted for quote/callout; list-item classification now lives on each block-type module (`isListItem`) instead of a hardcoded set in the markdown serializer.

**Breaking**

- `blocks/patch` public surface is now curated. Two internal helpers are no longer exported from the package root: `deriveUniqueBlockId` and `createEmptyParagraphBlock`. All previously-documented public patch APIs are unchanged.
