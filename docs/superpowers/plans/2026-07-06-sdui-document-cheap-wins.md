# SDUI Document Cheap-Wins Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four frontend-only Notion features to the sdui-document editor — document counts, an emoji picker (wired to callouts), an auto Table-of-Contents block, and an inline `@date` chip.

**Architecture:** Domain logic (pure derives, schema, markdown) lands in `packages/sdui-document`; editor UI (React components, ProseMirror integration) lands in `packages/sdui-document-react`. New blocks follow the existing colocated `SduiBlockTypeModule` pattern; the new inline node extends the closed `SduiInlineNode` union and its ProseMirror mirror.

**Tech Stack:** TypeScript, React, ProseMirror (prosemirror-model/state), Zod, Jest, pnpm + Turborepo.

## Global Constraints

- Frontend-only: no network, no storage, no cross-document behavior.
- No new runtime dependencies (emoji data is a hand-authored JSON).
- Immutable updates only — never mutate existing objects (return new copies).
- Inline nodes are ProseMirror-compatible with a 1:1 name mapping; a leaf inline node occupies exactly 1 offset unit (`hard_break` convention).
- Adding a block type requires exactly one central edit: add its constant to the `SduiDocumentBlockType` union in `packages/sdui-document/src/blocks/schema/block.ts`. Everything else derives from the registry.
- After all changes: `pnpm test` from the monorepo root MUST pass.
- Block-type id convention: `document.<name>`.

---

## Feature A — Document Counts

### Task 1: `documentStats` domain derive

**Files:**

- Create: `packages/sdui-document/src/content/documentStats.ts`
- Test: `packages/sdui-document/src/content/documentStats.test.ts`
- Modify: `packages/sdui-document/src/content/index.ts` (export) — or `packages/sdui-document/src/index.ts` if content has no barrel; check which the repo uses for `extractPlainText`.

**Interfaces:**

- Consumes: `extractPlainText(content)` from `./plainText`, `walkDocumentBlocks(content, cb)` from `./walkBlocks`, types from `../blocks/schema`.
- Produces: `documentStats(content: SduiDocumentContent): { words: number; chars: number; blocks: number }`.

- [ ] **Step 1: Write the failing test**

```ts
// documentStats.test.ts
import { documentStats } from './documentStats'
import type { SduiDocumentContent } from '../blocks/schema'

const content: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: {
    id: 'root',
    type: 'document.root',
    children: [
      { id: 'a', type: 'document.paragraph', state: { content: [{ text: 'hello world' }] } },
      { id: 'b', type: 'document.paragraph', state: { content: [{ text: 'three more words here' }] } },
    ],
  },
}

describe('documentStats', () => {
  it('counts words, characters, and blocks (root excluded)', () => {
    // Act
    const stats = documentStats(content)
    // Assert
    expect(stats).toEqual({ words: 6, chars: 33, blocks: 2 })
  })

  it('returns zeros for an empty document', () => {
    const empty: SduiDocumentContent = {
      schemaVersion: '1.0',
      root: { id: 'root', type: 'document.root', children: [] },
    }
    expect(documentStats(empty)).toEqual({ words: 0, chars: 0, blocks: 0 })
  })
})
```

> `chars` = length of `extractPlainText` output. For the fixture: `"hello world\nthree more words here"` = 11 + 1 (newline join) + 21 = 33. Adjust the expected number if `extractPlainText`'s join differs; run the test to read the actual value and lock it in.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @lodado/sdui-document test -- documentStats`
Expected: FAIL ("Cannot find module './documentStats'").

- [ ] **Step 3: Write minimal implementation**

```ts
// documentStats.ts
import type { SduiDocumentContent } from '../blocks/schema'
import { extractPlainText } from './plainText'
import { walkDocumentBlocks } from './walkBlocks'

export type DocumentStats = { words: number; chars: number; blocks: number }

/** Pure document metrics for status/footer UI. The root block is not counted. */
export function documentStats(content: SduiDocumentContent): DocumentStats {
  const text = extractPlainText(content)
  const words = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length

  let blocks = 0
  walkDocumentBlocks(content, (block) => {
    if (block.type !== 'document.root') {
      blocks += 1
    }
  })

  return { words, chars: text.length, blocks }
}
```

> Verify `walkDocumentBlocks`'s callback signature and whether it visits the root — adjust the `!== 'document.root'` guard to match. If `extractPlainText` already skips root, keep the guard anyway (defensive, cheap).

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @lodado/sdui-document test -- documentStats`
Expected: PASS.

- [ ] **Step 5: Export + commit**

Add `export { documentStats, type DocumentStats } from './content/documentStats'` to the package public barrel (`packages/sdui-document/src/index.ts`, next to the existing `extractPlainText` export).

```bash
git add packages/sdui-document/src/content/documentStats.ts packages/sdui-document/src/content/documentStats.test.ts packages/sdui-document/src/index.ts
git commit -m "feat(sdui-document): documentStats derive (words/chars/blocks)"
```

### Task 2: `useDocumentStats` hook + `DocumentCounts` component

**Files:**

- Create: `packages/sdui-document-react/src/editor/DocumentCounts.tsx`
- Test: `packages/sdui-document-react/src/editor/__tests__/DocumentCounts.test.tsx`
- Modify: `packages/sdui-document-react/src/index.ts` (export)

**Interfaces:**

- Consumes: `documentStats` from `@lodado/sdui-document`.
- Produces: `useDocumentStats(content): DocumentStats`, `<DocumentCounts content={...} />`.

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import type { SduiDocumentContent } from '@lodado/sdui-document'
import { DocumentCounts } from '../DocumentCounts'

const content: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: {
    id: 'root',
    type: 'document.root',
    children: [{ id: 'a', type: 'document.paragraph', state: { content: [{ text: 'one two' }] } }],
  },
}

it('renders word and block counts', () => {
  render(<DocumentCounts content={content} />)
  expect(screen.getByText(/2 words/)).toBeInTheDocument()
  expect(screen.getByText(/1 block/)).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test — expect FAIL** (`Cannot find module '../DocumentCounts'`).

Run: `pnpm --filter @lodado/sdui-document-react test -- DocumentCounts`

- [ ] **Step 3: Implement**

```tsx
// DocumentCounts.tsx
import type { SduiDocumentContent, DocumentStats } from '@lodado/sdui-document'
import { documentStats } from '@lodado/sdui-document'
import React, { useMemo } from 'react'

export function useDocumentStats(content: SduiDocumentContent): DocumentStats {
  return useMemo(() => documentStats(content), [content])
}

export type DocumentCountsProps = { content: SduiDocumentContent }

/** Opt-in footer stats. The editor renders nothing by default; consumers place this. */
export const DocumentCounts = ({ content }: DocumentCountsProps) => {
  const { words, blocks } = useDocumentStats(content)
  return (
    <div className="document-counts" aria-label="document statistics">
      {words} words · {blocks} block{blocks === 1 ? '' : 's'}
    </div>
  )
}
```

- [ ] **Step 4: Run test — expect PASS.**

- [ ] **Step 5: Export + commit**

Add `export { DocumentCounts, useDocumentStats } from './editor/DocumentCounts'` to `packages/sdui-document-react/src/index.ts`.

```bash
git add packages/sdui-document-react/src/editor/DocumentCounts.tsx packages/sdui-document-react/src/editor/__tests__/DocumentCounts.test.tsx packages/sdui-document-react/src/index.ts
git commit -m "feat(sdui-document-react): DocumentCounts footer component"
```

---

## Feature B — Emoji Picker

### Task 3: Curated emoji data + filter

**Files:**

- Create: `packages/sdui-document-react/src/emoji/emojiData.ts`
- Create: `packages/sdui-document-react/src/emoji/filterEmojis.ts`
- Test: `packages/sdui-document-react/src/emoji/filterEmojis.test.ts`

**Interfaces:**

- Produces: `type EmojiEntry = { char: string; name: string; keywords: string[]; group: string }`, `EMOJI_DATA: EmojiEntry[]`, `filterEmojis(query: string): EmojiEntry[]`.

- [ ] **Step 1: Write the failing test**

```ts
import { filterEmojis } from './filterEmojis'

it('returns all emojis for empty query', () => {
  expect(filterEmojis('').length).toBeGreaterThan(20)
})
it('matches by keyword, case-insensitive', () => {
  const hits = filterEmojis('SMILE')
  expect(hits.some((e) => e.char === '😄')).toBe(true)
})
it('matches by name substring', () => {
  expect(filterEmojis('rocket').some((e) => e.char === '🚀')).toBe(true)
})
```

- [ ] **Step 2: Run test — expect FAIL.**

Run: `pnpm --filter @lodado/sdui-document-react test -- filterEmojis`

- [ ] **Step 3: Implement data + filter**

```ts
// emojiData.ts
export type EmojiEntry = { char: string; name: string; keywords: string[]; group: string }

/** Curated, non-exhaustive set. Extend freely — this is plain data, no dependency. */
export const EMOJI_DATA: EmojiEntry[] = [
  { char: '😄', name: 'grinning face', keywords: ['smile', 'happy', 'joy'], group: 'Smileys' },
  { char: '😅', name: 'sweat smile', keywords: ['smile', 'nervous'], group: 'Smileys' },
  { char: '🙂', name: 'slight smile', keywords: ['smile'], group: 'Smileys' },
  { char: '😍', name: 'heart eyes', keywords: ['love', 'smile'], group: 'Smileys' },
  { char: '🤔', name: 'thinking face', keywords: ['think', 'hmm'], group: 'Smileys' },
  { char: '👍', name: 'thumbs up', keywords: ['yes', 'approve', 'like'], group: 'People' },
  { char: '👎', name: 'thumbs down', keywords: ['no', 'dislike'], group: 'People' },
  { char: '🙏', name: 'folded hands', keywords: ['please', 'thanks', 'pray'], group: 'People' },
  { char: '🎉', name: 'party popper', keywords: ['celebrate', 'party'], group: 'Objects' },
  { char: '🔥', name: 'fire', keywords: ['hot', 'lit', 'flame'], group: 'Objects' },
  { char: '⭐', name: 'star', keywords: ['favorite', 'star'], group: 'Objects' },
  { char: '💡', name: 'light bulb', keywords: ['idea', 'tip'], group: 'Objects' },
  { char: '📌', name: 'pushpin', keywords: ['pin', 'important'], group: 'Objects' },
  { char: '⚠️', name: 'warning', keywords: ['caution', 'alert'], group: 'Symbols' },
  { char: '✅', name: 'check mark', keywords: ['done', 'yes', 'ok'], group: 'Symbols' },
  { char: '❌', name: 'cross mark', keywords: ['no', 'wrong', 'error'], group: 'Symbols' },
  { char: '❤️', name: 'red heart', keywords: ['love', 'like'], group: 'Symbols' },
  { char: '🚀', name: 'rocket', keywords: ['launch', 'ship', 'fast'], group: 'Travel' },
  { char: '📝', name: 'memo', keywords: ['note', 'write', 'doc'], group: 'Objects' },
  { char: '📎', name: 'paperclip', keywords: ['attach', 'file'], group: 'Objects' },
  { char: '🔗', name: 'link', keywords: ['url', 'chain'], group: 'Objects' },
  { char: '📅', name: 'calendar', keywords: ['date', 'schedule'], group: 'Objects' },
]
```

```ts
// filterEmojis.ts
import { EMOJI_DATA, type EmojiEntry } from './emojiData'

export function filterEmojis(query: string): EmojiEntry[] {
  const needle = query.trim().toLowerCase()
  if (!needle) return [...EMOJI_DATA]
  return EMOJI_DATA.filter(
    (e) => e.name.toLowerCase().includes(needle) || e.keywords.some((k) => k.toLowerCase().includes(needle)),
  )
}
```

- [ ] **Step 4: Run test — expect PASS.**

- [ ] **Step 5: Commit**

```bash
git add packages/sdui-document-react/src/emoji/
git commit -m "feat(sdui-document-react): curated emoji data + filter"
```

### Task 4: `EmojiPicker` component

**Files:**

- Create: `packages/sdui-document-react/src/emoji/EmojiPicker.tsx`
- Test: `packages/sdui-document-react/src/emoji/EmojiPicker.test.tsx`
- Modify: `packages/sdui-document-react/src/index.ts` (export)

**Interfaces:**

- Consumes: `filterEmojis`, `EmojiEntry`.
- Produces: `<EmojiPicker onSelect={(char: string) => void} />`.

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { EmojiPicker } from './EmojiPicker'

it('filters and selects an emoji', () => {
  const onSelect = jest.fn()
  render(<EmojiPicker onSelect={onSelect} />)
  fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'rocket' } })
  fireEvent.click(screen.getByRole('button', { name: 'rocket' }))
  expect(onSelect).toHaveBeenCalledWith('🚀')
})
```

- [ ] **Step 2: Run test — expect FAIL.**

Run: `pnpm --filter @lodado/sdui-document-react test -- EmojiPicker`

- [ ] **Step 3: Implement**

```tsx
// EmojiPicker.tsx
import React, { useState } from 'react'
import { filterEmojis } from './filterEmojis'

export type EmojiPickerProps = { onSelect: (char: string) => void }

export const EmojiPicker = ({ onSelect }: EmojiPickerProps) => {
  const [query, setQuery] = useState('')
  const results = filterEmojis(query)
  return (
    <div className="emoji-picker" role="menu">
      <input
        className="emoji-picker__search"
        placeholder="Search emoji"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />
      <div className="emoji-picker__grid">
        {results.map((e) => (
          <button key={e.char} type="button" aria-label={e.name} onClick={() => onSelect(e.char)}>
            {e.char}
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test — expect PASS.**

- [ ] **Step 5: Export + commit**

Add `export { EmojiPicker } from './emoji/EmojiPicker'` to `packages/sdui-document-react/src/index.ts`.

```bash
git add packages/sdui-document-react/src/emoji/EmojiPicker.tsx packages/sdui-document-react/src/emoji/EmojiPicker.test.tsx packages/sdui-document-react/src/index.ts
git commit -m "feat(sdui-document-react): EmojiPicker component"
```

### Task 5: Callout icon override via emoji

**Files:**

- Modify: `packages/sdui-document/src/block-types/callout/callout.schema.ts` (add optional `icon`) — confirm exact filename; if the callout schema lives inside `callout.ts`, edit there.
- Modify: `packages/sdui-document-react/src/block-types/callout/CalloutBlock.tsx`
- Test: `packages/sdui-document-react/src/block-types/__tests__/CalloutBlock.test.tsx` (create if absent)

**Interfaces:**

- Consumes: `EmojiPicker`, `useEditorRuntime` (for a block-update handler), `block.attributes.icon`.
- Produces: callout renders `attributes.icon` (emoji string) when present, else the tone SVG.

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { CalloutBlock } from '../callout/CalloutBlock'

it('renders the emoji icon when attributes.icon is set', () => {
  const block = { id: 'c', type: 'document.callout', attributes: { tone: 'info', icon: '🔥' } }
  render(<CalloutBlock block={block as any}>text</CalloutBlock>)
  expect(screen.getByText('🔥')).toBeInTheDocument()
})
```

- [ ] **Step 2: Run test — expect FAIL** (renders tone SVG, no 🔥).

Run: `pnpm --filter @lodado/sdui-document-react test -- CalloutBlock`

- [ ] **Step 3: Implement icon override**

In `CalloutBlock.tsx`, replace the icon cell:

```tsx
const icon = typeof block.attributes?.icon === 'string' ? block.attributes.icon : null
// ...
<div className="icon">
  {icon ? <span className="callout-emoji" aria-hidden>{icon}</span> : <CalloutIcon tone={tone} />}
</div>
```

- [ ] **Step 4: Run test — expect PASS.**

- [ ] **Step 5: Allow `icon` in the domain schema**

In the callout schema, add `icon: z.string().optional()` to the attributes schema so `attributes.icon` survives validation. Add a domain test asserting a callout with `attributes.icon` parses. (Locate the callout attributes schema first: `grep -rn "tone" packages/sdui-document/src/block-types/callout/`.)

- [ ] **Step 6: Wire the picker (editor affordance)**

Add a click handler on the callout icon (edit mode only) that opens `EmojiPicker` in a popover; on select, call a runtime handler to update the block's `attributes.icon`. Reuse the existing block-update path — `useEditorRuntime().handlers` exposes `turnInto`/`setBlockAlign`-style updates; add a thin `setCalloutIcon(blockId, icon)` handler mirroring `setCodeLanguage` (which does `block.update` on an attribute). Test: clicking the icon opens the picker, selecting sets `attributes.icon`.

- [ ] **Step 7: Commit**

```bash
git add packages/sdui-document/src/block-types/callout/ packages/sdui-document-react/src/block-types/callout/ packages/sdui-document-react/src/block-types/__tests__/CalloutBlock.test.tsx
git commit -m "feat: callout emoji icon override + picker"
```

---

## Feature C — TOC Block (`document.toc`)

### Task 6: `collectHeadings` domain derive

**Files:**

- Create: `packages/sdui-document/src/content/collectHeadings.ts`
- Test: `packages/sdui-document/src/content/collectHeadings.test.ts`
- Modify: `packages/sdui-document/src/index.ts` (export)

**Interfaces:**

- Consumes: `walkDocumentBlocks`, `blockToPlainText`/`extractPlainText` per-block, heading type constant `HEADING_BLOCK_TYPE`.
- Produces: `collectHeadings(content): { id: string; level: number; text: string }[]`.

- [ ] **Step 1: Write the failing test**

```ts
import { collectHeadings } from './collectHeadings'
import type { SduiDocumentContent } from '../blocks/schema'

const content: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: {
    id: 'root',
    type: 'document.root',
    children: [
      { id: 'h1', type: 'document.heading', attributes: { level: 1 }, state: { content: [{ text: 'Intro' }] } },
      { id: 'p', type: 'document.paragraph', state: { content: [{ text: 'body' }] } },
      { id: 'h2', type: 'document.heading', attributes: { level: 2 }, state: { content: [{ text: 'Details' }] } },
    ],
  },
}

it('collects headings in order with level and text', () => {
  expect(collectHeadings(content)).toEqual([
    { id: 'h1', level: 1, text: 'Intro' },
    { id: 'h2', level: 2, text: 'Details' },
  ])
})
```

- [ ] **Step 2: Run test — expect FAIL.**

Run: `pnpm --filter @lodado/sdui-document test -- collectHeadings`

- [ ] **Step 3: Implement**

```ts
// collectHeadings.ts
import { HEADING_BLOCK_TYPE } from '../block-types'
import { blockToPlainText } from '../block-types'
import type { SduiDocumentContent } from '../blocks/schema'
import { inlineContentToPlainText } from './inlineContent'
import { walkDocumentBlocks } from './walkBlocks'

export type HeadingEntry = { id: string; level: number; text: string }

export function collectHeadings(content: SduiDocumentContent): HeadingEntry[] {
  const out: HeadingEntry[] = []
  walkDocumentBlocks(content, (block) => {
    if (block.type !== HEADING_BLOCK_TYPE) return
    const level = typeof block.attributes?.level === 'number' ? block.attributes.level : 1
    const inline = block.state?.content
    const text = blockToPlainText(block) ?? (Array.isArray(inline) ? inlineContentToPlainText(inline as any) : '')
    out.push({ id: block.id, level, text })
  })
  return out
}
```

- [ ] **Step 4: Run test — expect PASS.**

- [ ] **Step 5: Export + commit**

Add `export { collectHeadings, type HeadingEntry } from './content/collectHeadings'` to `packages/sdui-document/src/index.ts`.

```bash
git add packages/sdui-document/src/content/collectHeadings.ts packages/sdui-document/src/content/collectHeadings.test.ts packages/sdui-document/src/index.ts
git commit -m "feat(sdui-document): collectHeadings derive"
```

### Task 7: TOC block module + registration

**Files:**

- Create: `packages/sdui-document/src/block-types/toc/toc.type.ts`
- Create: `packages/sdui-document/src/block-types/toc/toc.default.ts`
- Create: `packages/sdui-document/src/block-types/toc/toc.markdown.ts`
- Create: `packages/sdui-document/src/block-types/toc/toc.ts`
- Modify: `packages/sdui-document/src/block-types/index.ts` (register module + export constant)
- Modify: `packages/sdui-document/src/blocks/schema/block.ts` (add to union)
- Test: `packages/sdui-document/src/block-types/__tests__/toc.test.ts`

**Interfaces:**

- Produces: `TOC_BLOCK_TYPE = 'document.toc'`, `tocBlockModule`, `isTocBlock`, `createDefaultToc`.

- [ ] **Step 1: Write the failing test**

```ts
import { blockModuleByType, TOC_BLOCK_TYPE } from '../index'

it('registers the toc block module', () => {
  expect(blockModuleByType[TOC_BLOCK_TYPE]).toBeDefined()
  expect(blockModuleByType[TOC_BLOCK_TYPE].createDefault?.('t1' as any)).toEqual({ id: 't1', type: 'document.toc' })
})
it('toc exports no markdown content', () => {
  expect(blockModuleByType[TOC_BLOCK_TYPE].toMarkdown?.({ id: 't', type: 'document.toc' } as any, {} as any)).toBe('')
})
```

- [ ] **Step 2: Run test — expect FAIL.**

Run: `pnpm --filter @lodado/sdui-document test -- toc`

- [ ] **Step 3: Implement the module** (mirror the divider module — a childless, non-text block)

```ts
// toc.type.ts
export const TOC_BLOCK_TYPE = 'document.toc' as const
```

```ts
// toc.default.ts
import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiDocumentBlockId } from '../../blocks/schema/ids'
import { optionalAttributes } from '../shared'
import { TOC_BLOCK_TYPE } from './toc.type'

export function createDefaultToc(id: SduiDocumentBlockId, attributes?: Record<string, unknown>): SduiDocumentBlock {
  return { id, type: TOC_BLOCK_TYPE, ...optionalAttributes(attributes) }
}
```

```ts
// toc.markdown.ts — TOC is derived; it authors no markdown.
export function tocToMarkdown(): string {
  return ''
}
```

```ts
// toc.ts
import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { ContentBlockTypeModule } from '../types'
import { createDefaultToc } from './toc.default'
import { tocToMarkdown } from './toc.markdown'
import { TOC_BLOCK_TYPE } from './toc.type'

export { TOC_BLOCK_TYPE } from './toc.type'
export type TocBlock = SduiDocumentBlock & { type: typeof TOC_BLOCK_TYPE }
export function isTocBlock(block: SduiDocumentBlock): block is TocBlock {
  return block.type === TOC_BLOCK_TYPE
}

export const tocBlockModule = {
  type: TOC_BLOCK_TYPE,
  toSduiNode(block) {
    return { id: block.id, type: 'Div', attributes: { 'data-block-type': TOC_BLOCK_TYPE } }
  },
  fromSduiNode(_node, { id }) {
    return { id, type: TOC_BLOCK_TYPE }
  },
  createDefault: createDefaultToc,
  toMarkdown: tocToMarkdown,
  canHostInlineText: false,
} satisfies ContentBlockTypeModule
```

- [ ] **Step 4: Register** — in `block-types/index.ts`: import `tocBlockModule`, add to `BLOCK_TYPE_MODULES`, add `export { TOC_BLOCK_TYPE } from './toc/toc.type'`. In `blocks/schema/block.ts`: import `TOC_BLOCK_TYPE` and add `| typeof TOC_BLOCK_TYPE` to the `SduiDocumentBlockType` union.

- [ ] **Step 5: Run test — expect PASS.**

- [ ] **Step 6: Commit**

```bash
git add packages/sdui-document/src/block-types/toc/ packages/sdui-document/src/block-types/index.ts packages/sdui-document/src/blocks/schema/block.ts packages/sdui-document/src/block-types/__tests__/toc.test.ts
git commit -m "feat(sdui-document): toc block module"
```

### Task 8: Add TOC to the block menu

**Files:**

- Modify: `packages/sdui-document-react/src/editor/block-menu/blockMenuItems.ts`
- Test: `packages/sdui-document-react/src/editor/__tests__/blockMenuItems.test.ts` (create if absent)

- [ ] **Step 1: Write the failing test**

```ts
import { filterBlockMenuItems } from '../block-menu/blockMenuItems'
it('offers a table of contents item', () => {
  expect(filterBlockMenuItems('contents').some((i) => i.type === 'document.toc')).toBe(true)
})
```

- [ ] **Step 2: Run test — expect FAIL.**

- [ ] **Step 3: Add the menu entry** to `BLOCK_MENU_ITEMS`:

```ts
{
  id: 'toc',
  type: 'document.toc',
  title: 'Table of contents',
  glyph: '≡',
  action: 'insert',
  keywords: ['toc', 'contents', 'outline', 'table of contents', '목차', '개요'],
},
```

- [ ] **Step 4: Run test — expect PASS.**

- [ ] **Step 5: Commit**

```bash
git add packages/sdui-document-react/src/editor/block-menu/blockMenuItems.ts packages/sdui-document-react/src/editor/__tests__/blockMenuItems.test.ts
git commit -m "feat(sdui-document-react): toc block menu item"
```

### Task 9: Expose document content in runtime + block anchor

**Files:**

- Modify: `packages/sdui-document-react/src/editor/EditorRuntimeContext.tsx` (add `content` to `EditorRuntime`)
- Modify: `packages/sdui-document-react/src/editor/SduiDocumentEditor.tsx` (provide `content` in the context value)
- Modify: `packages/sdui-document-react/src/editor/BlockNode.tsx` (add `data-block-id={block.id}` to the block wrapper element)

**Interfaces:**

- Produces: `useEditorRuntime().content: SduiDocumentContent`; every block wrapper carries `data-block-id`.

- [ ] **Step 1:** Add `content: SduiDocumentContent` to the `EditorRuntime` type. In `SduiDocumentEditor.tsx`, include the current `content` state in the `EditorRuntimeContext.Provider` value (it already holds `store` + `handlers`).

- [ ] **Step 2:** In `BlockNode.tsx`, add `data-block-id={block.id}` to the outermost block wrapper element's props (the same element that receives drag props). This is the TOC scroll anchor.

- [ ] **Step 3: Test** — render the editor with one heading, assert `container.querySelector('[data-block-id]')` exists.

Run: `pnpm --filter @lodado/sdui-document-react test -- BlockNode`

- [ ] **Step 4: Commit**

```bash
git add packages/sdui-document-react/src/editor/EditorRuntimeContext.tsx packages/sdui-document-react/src/editor/SduiDocumentEditor.tsx packages/sdui-document-react/src/editor/BlockNode.tsx
git commit -m "feat(sdui-document-react): expose content in runtime + data-block-id anchor"
```

### Task 10: `TocBlock` React component + render wiring

**Files:**

- Create: `packages/sdui-document-react/src/block-types/toc/TocBlock.tsx`
- Modify: `packages/sdui-document-react/src/editor/BlockNode.tsx` (render `TocBlock` for `document.toc`)
- Test: `packages/sdui-document-react/src/block-types/__tests__/TocBlock.test.tsx`

**Interfaces:**

- Consumes: `collectHeadings` from `@lodado/sdui-document`, `useEditorRuntime().content`.

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { TocBlock } from '../toc/TocBlock'
// mock useEditorRuntime to return content with two headings; render TocBlock;
it('lists headings and scrolls on click', () => {
  const scrollIntoView = jest.fn()
  // arrange: render an anchor <div data-block-id="h1"> with scrollIntoView spy in the DOM
  render(<TocBlock />) // wrapped in a provider supplying content
  fireEvent.click(screen.getByRole('link', { name: 'Intro' }))
  expect(scrollIntoView).toHaveBeenCalled()
})
```

> Set the mock content via the same test provider used by other BlockNode tests; follow the existing test's provider setup in `editor/__tests__`.

- [ ] **Step 2: Run test — expect FAIL.**

- [ ] **Step 3: Implement**

```tsx
// TocBlock.tsx
import { collectHeadings } from '@lodado/sdui-document'
import React from 'react'
import { useEditorRuntime } from '../../editor/EditorRuntimeContext'

export const TocBlock = () => {
  const { content } = useEditorRuntime()
  const headings = collectHeadings(content)
  const goTo = (id: string) => {
    const el = document.querySelector(`[data-block-id="${id}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    ;(el as HTMLElement | null)?.focus?.()
  }
  if (headings.length === 0) {
    return <div className="toc-block toc-block--empty">Add headings to build a table of contents</div>
  }
  return (
    <nav className="toc-block" aria-label="Table of contents">
      {headings.map((h) => (
        <a
          key={h.id}
          role="link"
          tabIndex={0}
          className={`toc-block__item toc-block__item--l${h.level}`}
          style={{ paddingLeft: `${(h.level - 1) * 12}px` }}
          onClick={() => goTo(h.id)}
          onKeyDown={(e) => e.key === 'Enter' && goTo(h.id)}
        >
          {h.text}
        </a>
      ))}
    </nav>
  )
}
```

- [ ] **Step 4: Wire into BlockNode** — where BlockNode switches on `block.type` for non-text blocks (near the divider/image branches), add: `if (block.type === 'document.toc') return <TocBlock />` (wrapped in the same `BlockChrome` as siblings so drag/select works).

- [ ] **Step 5: Run test — expect PASS.**

- [ ] **Step 6: Add TOC styles** to `packages/sdui-document-react/src/styles/editor.css` (`.toc-block`, `.toc-block__item`, hover state). Keep motion on `color`/`background` only (compositor-friendly).

- [ ] **Step 7: Commit**

```bash
git add packages/sdui-document-react/src/block-types/toc/TocBlock.tsx packages/sdui-document-react/src/editor/BlockNode.tsx packages/sdui-document-react/src/block-types/__tests__/TocBlock.test.tsx packages/sdui-document-react/src/styles/editor.css
git commit -m "feat(sdui-document-react): TocBlock render + scroll-to-heading"
```

---

## Feature D — Inline `@date` Node

The invasive feature. Order: domain schema → offset/plaintext handling → PM schema → PM serialization → static render → insert command + `@` trigger.

### Task 11: `SduiInlineDateNode` schema + guard

**Files:**

- Modify: `packages/sdui-document/src/blocks/schema/inline.ts`
- Test: `packages/sdui-document/src/blocks/schema/inline.test.ts` (create if absent)

**Interfaces:**

- Produces: `SduiInlineDateNode = { type: 'date'; iso: string; display?: string }`, `isInlineDateNode`, extended `SduiInlineNode` union.

- [ ] **Step 1: Write the failing test**

```ts
import { isInlineDateNode, type SduiInlineNode } from './inline'
it('narrows a date node', () => {
  const node: SduiInlineNode = { type: 'date', iso: '2026-07-06', display: 'Jul 6, 2026' }
  expect(isInlineDateNode(node)).toBe(true)
  expect(isInlineDateNode({ type: 'text', text: 'x' })).toBe(false)
})
```

- [ ] **Step 2: Run test — expect FAIL.**

Run: `pnpm --filter @lodado/sdui-document test -- inline`

- [ ] **Step 3: Implement** — in `inline.ts`:

```ts
export type SduiInlineDateNode = {
  type: 'date'
  iso: string
  display?: string
}

export type SduiInlineNode = SduiInlineTextNode | SduiInlineHardBreakNode | SduiInlineDateNode

export function isInlineDateNode(node: SduiInlineNode): node is SduiInlineDateNode {
  return node.type === 'date'
}
```

> If a Zod inline schema exists (grep `z.union` / `type: z.literal('hard_break')` under `blocks/schema/`), add the date node variant there too so validation accepts it.

- [ ] **Step 4: Run test — expect PASS.**

- [ ] **Step 5: Commit**

```bash
git add packages/sdui-document/src/blocks/schema/inline.ts packages/sdui-document/src/blocks/schema/inline.test.ts
git commit -m "feat(sdui-document): SduiInlineDateNode inline schema"
```

### Task 12: Offset length, clone, and plain-text for date nodes

**Files:**

- Modify: `packages/sdui-document/src/content/inlineContent.ts`
- Test: `packages/sdui-document/src/content/inlineContent.test.ts` (existing)

**Interfaces:**

- Consumes: `isInlineTextNode`, `isInlineDateNode`.
- Produces: date node counts as 1 offset unit; `inlineContentToPlainText` emits its `display`; `cloneNode` copies it immutably.

- [ ] **Step 1: Write the failing test**

```ts
import { getInlineContentLength, inlineContentToPlainText, splitInlineContent } from './inlineContent'
const date = { type: 'date' as const, iso: '2026-07-06', display: 'Jul 6' }

it('date node is one offset unit', () => {
  expect(getInlineContentLength([{ type: 'text', text: 'a' }, date])).toBe(2)
})
it('plain text uses display', () => {
  expect(inlineContentToPlainText([date])).toBe('Jul 6')
})
it('splits cleanly around a date node', () => {
  const [l, r] = splitInlineContent([{ type: 'text', text: 'a' }, date], 1)
  expect(l).toEqual([{ type: 'text', text: 'a' }])
  expect(r).toEqual([date])
})
```

- [ ] **Step 2: Run test — expect FAIL.**

Run: `pnpm --filter @lodado/sdui-document test -- inlineContent`

- [ ] **Step 3: Implement** — update the three helpers in `inlineContent.ts`:

```ts
import { isInlineTextNode, isInlineDateNode } from '../blocks/schema/inline'

function cloneNode(node: SduiInlineNode): SduiInlineNode {
  if (isInlineTextNode(node)) {
    const cloned: SduiInlineTextNode = { type: 'text', text: node.text }
    if (node.marks) cloned.marks = node.marks.map(cloneMark)
    return cloned
  }
  if (isInlineDateNode(node)) {
    return { type: 'date', iso: node.iso, ...(node.display ? { display: node.display } : {}) }
  }
  return { type: 'hard_break' }
}

function nodeLength(node: SduiInlineNode): number {
  return isInlineTextNode(node) ? node.text.length : 1 // hard_break + date are leaf = 1
}
```

In `inlineContentToPlainText`, map a date node to its display:

```ts
export function inlineContentToPlainText(content: SduiInlineContent): string {
  return content
    .map((node) => (isInlineTextNode(node) ? node.text : isInlineDateNode(node) ? node.display ?? node.iso : '\n'))
    .join('')
}
```

> The `splitInlineContent` "partial consume" branch is guarded by `isInlineTextNode`-only cast today; a date node sits fully on one side because `nodeLength` is 1, so it never hits the partial branch. Verify the `as SduiInlineTextNode` cast there is only reached for text (it is, since size 1 with remaining in (0,1) is impossible for integer offsets). No change needed beyond the above.

- [ ] **Step 4: Run test — expect PASS. Also run the full inlineContent suite to catch regressions.**

- [ ] **Step 5: Commit**

```bash
git add packages/sdui-document/src/content/inlineContent.ts packages/sdui-document/src/content/inlineContent.test.ts
git commit -m "feat(sdui-document): date node offset + plaintext handling"
```

### Task 13: ProseMirror `date` node in the focused-block schema

**Files:**

- Modify: `packages/sdui-document-react/src/focused-block/pm/schema.ts`
- Test: `packages/sdui-document-react/src/focused-block/__tests__/schema.test.ts` (create if absent)

**Interfaces:**

- Produces: `focusedBlockSchema.nodes.date` — an inline atom leaf with `iso`/`display` attrs.

- [ ] **Step 1: Write the failing test**

```ts
import { focusedBlockSchema } from '../pm/schema'
it('has an inline date atom node', () => {
  const node = focusedBlockSchema.nodes.date.create({ iso: '2026-07-06', display: 'Jul 6' })
  expect(node.isInline).toBe(true)
  expect(node.isAtom).toBe(true)
  expect(node.attrs.iso).toBe('2026-07-06')
})
```

- [ ] **Step 2: Run test — expect FAIL.**

- [ ] **Step 3: Implement** — add to the `nodes` map in `schema.ts` (after `hard_break`):

```ts
date: {
  inline: true,
  group: 'inline',
  atom: true,
  selectable: true,
  attrs: { iso: {}, display: { default: '' } },
  leafText: (node) => (node.attrs.display || node.attrs.iso) as string,
  parseDOM: [
    {
      tag: 'time[data-inline-date]',
      getAttrs: (dom) => ({
        iso: (dom as HTMLElement).getAttribute('datetime') ?? '',
        display: (dom as HTMLElement).textContent ?? '',
      }),
    },
  ],
  toDOM: (node) => [
    'time',
    { 'data-inline-date': 'true', datetime: node.attrs.iso as string, class: 'inline-date' },
    (node.attrs.display || node.attrs.iso) as string,
  ],
},
```

- [ ] **Step 4: Run test — expect PASS.**

- [ ] **Step 5: Commit**

```bash
git add packages/sdui-document-react/src/focused-block/pm/schema.ts packages/sdui-document-react/src/focused-block/__tests__/schema.test.ts
git commit -m "feat(sdui-document-react): PM inline date atom node"
```

### Task 14: PM ↔ inline-content serialization for date nodes

**Files:**

- Modify: `packages/sdui-document-react/src/focused-block/pm/serialization.ts`
- Test: `packages/sdui-document-react/src/focused-block/__tests__/serialization.test.ts` (create if absent)

**Interfaces:**

- Consumes: `focusedBlockSchema.nodes.date`, `isInlineDateNode`.
- Produces: `inlineContentToPmDoc` emits a `date` node; `pmDocToInlineContent` reads it back to `{ type: 'date', iso, display }`.

- [ ] **Step 1: Write the failing test (round-trip)**

```ts
import { inlineContentToPmDoc, pmDocToInlineContent } from '../pm/serialization'
it('round-trips a date node', () => {
  const content = [
    { type: 'text' as const, text: 'due ' },
    { type: 'date' as const, iso: '2026-07-06', display: 'Jul 6' },
  ]
  expect(pmDocToInlineContent(inlineContentToPmDoc(content as any))).toEqual(content)
})
```

- [ ] **Step 2: Run test — expect FAIL.**

- [ ] **Step 3: Implement** — in `inlineContentToPmDoc`, extend the node map:

```ts
const nodes = content.map((node) => {
  if (node.type === 'text') return focusedBlockSchema.text(node.text, (node.marks ?? []).map(toPmMark))
  if (node.type === 'date') return focusedBlockSchema.nodes.date.create({ iso: node.iso, display: node.display ?? '' })
  return focusedBlockSchema.nodes.hard_break.create()
})
```

In `pmDocToInlineContent`, handle the `date` child before the defensive drop:

```ts
if (child.type.name === 'date') {
  const display = child.attrs.display as string
  return [...content, { type: 'date', iso: child.attrs.iso as string, ...(display ? { display } : {}) }]
}
```

- [ ] **Step 4: Run test — expect PASS.**

- [ ] **Step 5: Commit**

```bash
git add packages/sdui-document-react/src/focused-block/pm/serialization.ts packages/sdui-document-react/src/focused-block/__tests__/serialization.test.ts
git commit -m "feat(sdui-document-react): serialize PM date node ↔ inline content"
```

### Task 15: Static render of the date chip (unfocused blocks)

**Files:**

- Modify: `packages/sdui-document-react/src/inline/InlineContentView.tsx`
- Test: `packages/sdui-document-react/src/inline/__tests__/InlineContentView.test.tsx` (existing dir)

**Interfaces:**

- Consumes: `isInlineDateNode` (or a `node.type === 'date'` check).

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from '@testing-library/react'
import { InlineContentView } from '../InlineContentView'
it('renders a date chip', () => {
  render(<InlineContentView content={[{ type: 'date', iso: '2026-07-06', display: 'Jul 6' } as any]} />)
  const chip = screen.getByText('Jul 6')
  expect(chip.tagName.toLowerCase()).toBe('time')
  expect(chip).toHaveAttribute('datetime', '2026-07-06')
})
```

- [ ] **Step 2: Run test — expect FAIL.**

- [ ] **Step 3: Implement** — extend the `content.map` branch:

```tsx
{
  content.map((node, nodeIndex) => {
    if (node.type === 'hard_break') return <br key={nodeIndex} /> // eslint-disable-line react/no-array-index-key
    if (node.type === 'date') {
      return (
        // eslint-disable-next-line react/no-array-index-key
        <time key={nodeIndex} className="inline-date" dateTime={node.iso}>
          {node.display || node.iso}
        </time>
      )
    }
    // eslint-disable-next-line react/no-array-index-key
    return <React.Fragment key={nodeIndex}>{renderTextNode(node)}</React.Fragment>
  })
}
```

> `renderTextNode` takes `SduiInlineTextNode`; keep it inside the text branch so the type narrows. Add `.inline-date` styling to `editor.css`.

- [ ] **Step 4: Run test — expect PASS.**

- [ ] **Step 5: Commit**

```bash
git add packages/sdui-document-react/src/inline/InlineContentView.tsx packages/sdui-document-react/src/inline/__tests__/InlineContentView.test.tsx packages/sdui-document-react/src/styles/editor.css
git commit -m "feat(sdui-document-react): static inline date chip render"
```

### Task 16: `@` trigger + date popover insert

**Files:**

- Create: `packages/sdui-document-react/src/focused-block/pm/dateMenuPlugin.ts`
- Create: `packages/sdui-document-react/src/focused-block/DateMenu.tsx`
- Modify: `packages/sdui-document-react/src/focused-block/pm/editorState.ts` (register plugin)
- Modify: `packages/sdui-document-react/src/focused-block/pm/keymapDelegation.ts` — add an `onDateMenu` callback to `FocusedBlockCallbacks` (mirror the slash-menu callback), or reuse the existing menu-state channel used by `slashMenuPlugin`.
- Test: `packages/sdui-document-react/src/focused-block/__tests__/dateMenuPlugin.test.ts`

**Interfaces:**

- Consumes: `slashMenuPlugin.ts` as the structural template (`PluginKey`, `SLASH_TRIGGER_RE` → `DATE_TRIGGER_RE = /(?:^|\s)@([^\s@]*)$/`, `isRangeValid`, range-delete on select).
- Produces: typing `@` opens a popover (Today / Tomorrow / Pick date…); selecting inserts a `date` node and removes the `@query` range.

- [ ] **Step 1: Write the failing test** (plugin detects the trigger)

```ts
import { EditorState } from 'prosemirror-state'
import { focusedBlockSchema } from '../pm/schema'
import { buildDateMenuPlugin, dateMenuKey } from '../pm/dateMenuPlugin'

it('activates on "@" after whitespace', () => {
  const plugin = buildDateMenuPlugin({ onDateMenu: () => {} } as any)
  let state = EditorState.create({ schema: focusedBlockSchema, plugins: [plugin] })
  const tr = state.tr.insertText('due @')
  state = state.apply(tr)
  expect(dateMenuKey.getState(state)?.atPos).not.toBeNull()
})
```

- [ ] **Step 2: Run test — expect FAIL.**

- [ ] **Step 3: Implement the plugin** — copy `slashMenuPlugin.ts`'s structure, rename `slash`→`date`/`at`, swap the regex to `DATE_TRIGGER_RE = /(?:^|\s)@([^\s@]*)$/`, and the "char at pos must be" check to `'@'`. Expose `dateMenuKey` and `buildDateMenuPlugin(callbacks)`. On the plugin's apply, publish the popover anchor position through the same callback mechanism the slash menu uses (`callbacks.onDateMenu({ from, to, query })` or via plugin state read by the React layer).

- [ ] **Step 4: Insert command** — add a helper that, given the active `@` range `[from, to]`, replaces it with a date node:

```ts
// inside dateMenuPlugin.ts (exported)
import type { EditorView } from 'prosemirror-view'
export function insertDateAtRange(view: EditorView, from: number, to: number, iso: string, display: string): void {
  const node = view.state.schema.nodes.date.create({ iso, display })
  view.dispatch(view.state.tr.replaceRangeWith(from, to, node).scrollIntoView())
  view.focus()
}
```

- [ ] **Step 5: DateMenu popover** — `DateMenu.tsx` renders Today / Tomorrow / a native `<input type="date">`. Compute `iso` (`YYYY-MM-DD`) and a `display` (e.g. `Intl.DateTimeFormat` medium). On choice, call `insertDateAtRange`. Mount/anchor it the same way `slashMenuPlugin`'s consumer mounts the block menu (follow `useBlockMenuState` / `FocusedBlockEditor` wiring). **Security:** `iso`/`display` are inserted as PM node attrs and rendered via JSX/`toDOM` text — never `innerHTML`. Keep it that way.

- [ ] **Step 6: Register** the plugin in `editorState.ts` `plugins: [...]` next to `buildSlashMenuPlugin(callbacks)`.

- [ ] **Step 7: Interaction test** — in a focused block, type `@`, assert the popover opens; pick Today; assert the block commit contains a `date` node whose `iso` is today's date. (Follow the existing focused-block interaction test setup.)

- [ ] **Step 8: Run tests — expect PASS.**

Run: `pnpm --filter @lodado/sdui-document-react test -- dateMenu`

- [ ] **Step 9: Commit**

```bash
git add packages/sdui-document-react/src/focused-block/
git commit -m "feat(sdui-document-react): @ trigger + date insert popover"
```

---

## Final Verification

- [ ] **Run the whole suite from the monorepo root.**

Run: `pnpm test`
Expected: all packages PASS. Fix any regression before considering the bucket done (per CLAUDE.md — never leave failing tests).

- [ ] **Typecheck.**

Run: `pnpm typecheck`
Expected: no errors (the `SduiDocumentBlockType` union edit + inline union edit are the type-sensitive changes).

- [ ] **Storybook smoke (optional, manual)** — add/extend a story under `apps/docs/src/stories/` demonstrating: a TOC block above headings, an emoji callout, `@`-inserted date, and the counts footer.

## Self-Review Notes (author)

- Spec coverage: TOC (T6–T10), @date (T11–T16), counts (T1–T2), emoji picker (T3–T5) — all four spec features mapped.
- Markdown lossy-by-design for TOC (`toMarkdown` → `''`) and @date (plaintext `display`) — matches spec non-goals.
- Risk hotspots called out inline: `walkDocumentBlocks` root handling (T1/T6), callout schema file location (T5), BlockNode block-type switch + wrapper element (T9/T10/T15), slash-menu template reuse (T16). Each has a grep/verify step before code.
- Type consistency: `document.toc` / `TOC_BLOCK_TYPE`, `SduiInlineDateNode` `{iso, display}`, `date` PM node attrs `{iso, display}` used identically across T7/T11/T13/T14/T15/T16.
