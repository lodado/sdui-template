# SDUI Document — Notion Cheap-Wins Bucket (#1)

**Date:** 2026-07-06
**Status:** Approved design, pending implementation plan
**Scope:** Frontend-only. No backend, no new hard dependencies.

## Context

`@lodado/sdui-document` (domain) + `@lodado/sdui-document-react` (editor UI) already
implement a deep Notion-like block editor: 13 block types, 8 marks, slash menu, block
menu, turn-into, drag-select, cross-block ranges, markdown import/export, collaboration
primitives (HLC, presence, sequencer, outbox, blockVersions), permissions policy, and a
link index.

This spec is the **first** of a five-bucket roadmap of purely frontend Notion additions.
Buckets 2–5 (Tables; Embeds + page chrome; UX polish pack; same-doc synced blocks) get
their own specs later. This bucket is deliberately the low-risk starter: it exercises the
two extension mechanisms — **new block module** and **new inline node** — before later
buckets lean hard on them.

### Roadmap (for reference, not this spec's scope)

1. **Cheap-wins (this spec):** TOC · @date · counts · emoji picker
2. Tables
3. Embeds + page chrome (reuses emoji picker)
4. UX polish pack (drag/nest, duplicate, move, find-in-doc, paste handlers, block bg)
5. Same-doc synced blocks

## Goals

Add four self-contained features:

1. **TOC block** — auto table of contents derived from heading blocks.
2. **@date inline node** — inline date chip inserted via `@`.
3. **Document counts** — word / char / block stats.
4. **Emoji picker** — reusable curated-set picker, wired to the callout icon.

## Non-Goals (explicitly out of scope)

- KaTeX / equations (dropped by decision — bundle weight).
- Tables, embeds, page icon/cover, person-mentions (later buckets).
- Markdown round-trip for TOC and @date (lossy export is acceptable; see below).
- Any server interaction, upload, or cross-document behavior.

## Architecture

No new packages. Follow the existing colocated contracts.

- **Domain** (`packages/sdui-document/src/`): schema extensions, pure derive functions, markdown glue.
- **React** (`packages/sdui-document-react/src/`): block render, inline node view, pickers.
- Each new block ships as an `SduiBlockTypeModule` colocated module, matching the existing 13.

Key existing constraint: the inline model is a **closed union**
`SduiInlineNode = SduiInlineTextNode | SduiInlineHardBreakNode`, intentionally
ProseMirror-compatible so a focused-block PM editor serializes to/from
`block.state.content` without a mapping layer. Adding `@date` extends this union and must
keep the round-trip and offset conventions intact.

---

## Feature 1 — TOC block (`document.toc`)

### Domain

- New block module `document.toc` (colocated: type, guard, `toSduiNode`/`fromSduiNode`, `createDefault`, schema).
- No stored `state` — the TOC derives live from the document tree.
- `collectHeadings(content) → { id: SduiDocumentBlockId, level: number, text: string }[]`
  - Walks the document tree, selects heading blocks, reads level (h1/h2/h3) and plain text.

### React

- Renders a nested list grouped by heading level.
- Each entry is a link; clicking scrolls to the heading block and focuses it.
  - Block DOM nodes are already keyed by blockId — use that as the scroll anchor
    (`scrollIntoView`, then focus).
- Live-updates automatically: the component re-renders from current content, so heading
  edits/insertions/removals reflect without stored state.

### SDUI / Markdown

- SDUI map: a navigation list node.
- Markdown export: emit nothing (or a placeholder) — TOC is derived, not authored content.
- Markdown import: no token maps to TOC. Lossy by design; documented.

---

## Feature 2 — @date inline node

The invasive feature — touches the core inline schema, the PM schema, plain-text
derivation, and markdown. All frontend.

### Schema (domain)

- Extend `SduiInlineNode` union with `SduiInlineDateNode`:
  ```ts
  type SduiInlineDateNode = { type: 'date'; iso: string; display?: string }
  ```
- Leaf node: occupies exactly 1 offset unit (same convention as `hard_break`).
- Add `isInlineDateNode` guard alongside the existing guards.
- Update the Zod inline schema to accept the new node.

### ProseMirror (react focused-block)

- Register `date` as an **inline atom leaf** node in the PM schema (`editorState`).
- NodeView renders a non-editable chip.
- Serialize/parse in the existing PM ↔ `state.content` bridge so the node round-trips.

### Input

- Typing `@` opens a small popover: **Today**, **Tomorrow**, **Pick date…**.
- Reuses the slash-menu popover infrastructure pattern (`slashMenuPlugin` / block-menu state).
- Selection inserts a `date` node at the cursor with `iso` set and a formatted `display`.

### Read / SSR render

- The `BlockNode` inline renderer handles `type: 'date'` → styled `<time datetime={iso}>` chip.

### Plain text

- `inlineContentToPlainText` maps a date node to its `display` string, so search/SSR/fallback text stays correct.

### Markdown

- Export: emit the `display` text (lossy — the node identity is not preserved).
- Import: no parse. Round-trip is lossy by design.
- `ponytail:` lossy markdown; add an `@[iso]` parser only if round-trip is later required.

---

## Feature 3 — Document counts

### Domain

- `documentStats(content) → { words: number; chars: number; blocks: number }`.
  - Built on `extractPlainText` (words/chars) and `walkDocumentBlocks` (block count). Pure.

### React

- `useDocumentStats(content)` hook.
- Optional `<DocumentCounts />` footer component.
- The editor renders **nothing by default** — the consumer opts in (YAGNI: no forced chrome).

---

## Feature 4 — Emoji picker

### Data

- `emojiData.ts`: curated JSON `[{ char, name, keywords: string[], group }]` — a few hundred
  common emojis, categorized. No dependency.

### Component

- `<EmojiPicker onSelect />` — category grid + keyword search filter.

### Wiring

- Wire to the **callout icon** in this bucket.
- Page icon (bucket #3) reuses this same component.

---

## Testing

Match existing test patterns (Jest, AAA).

**Unit (domain):**

- `collectHeadings` — nesting by level, empty doc, non-heading blocks ignored.
- `documentStats` — words/chars/blocks across mixed content.
- date inline node serialize ↔ parse round-trip (content ↔ PM).
- emoji keyword filter.

**Interaction (react):**

- `@` inserts a date node at the cursor.
- TOC entry click scrolls to and focuses the target heading.
- counts update as content changes.
- emoji select sets the callout icon.

**Gate:** `pnpm test` from the monorepo root must pass before the bucket is done.

## Risks / Notes

- @date is the only feature touching the shared inline schema + PM schema; if the PM
  serialize/parse bridge is fragile, it surfaces here. Round-trip test is the guard.
- TOC scroll relies on block DOM nodes being keyed by blockId (already true) — verify at plan time.
- Emoji "curated set" is intentionally non-exhaustive; acceptable for the bucket.
