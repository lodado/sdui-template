/**
 * Pure cross-block range logic (functional core of useRangeOperations).
 *
 * Every function is `(content, range, ...) => data` — document snapshot in,
 * patches / serializations out. No DOM, no store, no refs, no React.
 * Import direction is one-way: hooks import this module, this module must
 * never import from `hooks/` (or anything effectful).
 */
import type {
  SduiDocumentBlock,
  SduiDocumentContent,
  SduiDocumentPatch,
  SduiInlineContent,
  SduiInlineMark,
} from '@lodado/sdui-document'
import { createBlockId, findBlockById, getInlineContentLength, inlineState } from '@lodado/sdui-document'

import { deleteInlineRange } from '../inline/deleteInlineRange'
import type { NormalizedRange } from '../inline/docRange'
import {
  addMarkInRange,
  coveredTextSegments,
  rangeHasMark,
  rangeMarkAttr,
  removeMarkInRange,
} from '../inline/inlineRangeMarks'
import { blockInlineContent, isTextBlock } from './blockContent'

/** Private clipboard mime for SDUI→SDUI rich paste (marks + block breaks). */
export const SDUI_INLINE_MIME = 'application/x-sdui-inline'

/**
 * Validate untrusted clipboard payload before inserting it into the document.
 * Returns the inline content only when it is a non-empty array of well-formed
 * nodes; anything else falls back to the plain-text paste path.
 */
export function parseInlineClipboard(raw: string | undefined): SduiInlineContent | null {
  if (!raw) {
    return null
  }
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return null
    }
    const isValid = parsed.every((node): boolean => {
      if (!node || typeof node !== 'object') {
        return false
      }
      const { type } = node as { type?: unknown }
      if (type === 'hard_break' || type === 'date') {
        return true
      }
      return type === 'text' && typeof (node as { text?: unknown }).text === 'string'
    })
    return isValid ? (parsed as SduiInlineContent) : null
  } catch {
    return null
  }
}

// Each covered block's own sub-range: the start block from its offset, the
// end block up to its offset, the middles in full.
export function perBlockRange(range: NormalizedRange, block: SduiDocumentBlock): [number, number] {
  const from = block.id === range.start.blockId ? range.start.offset : 0
  const to = block.id === range.end.blockId ? range.end.offset : getInlineContentLength(blockInlineContent(block))
  return [from, to]
}

export function coveredTextBlocks(content: SduiDocumentContent, range: NormalizedRange): SduiDocumentBlock[] {
  return range.blockIds
    .map((id) => findBlockById(content, id))
    .filter((block): block is SduiDocumentBlock => block !== undefined && isTextBlock(block))
}

/** True when EVERY covered text segment carries the mark (whole-selection semantics). */
export function isRangeMarkActive(content: SduiDocumentContent, range: NormalizedRange, markType: string): boolean {
  const blocks = coveredTextBlocks(content, range)
  return (
    blocks.length > 0 &&
    blocks.every((block) => {
      const [from, to] = perBlockRange(range, block)
      return rangeHasMark(blockInlineContent(block), from, to, markType)
    })
  )
}

/** Uniform attr value across the range, or null on a mixed selection. */
export function uniformRangeAttr(
  content: SduiDocumentContent,
  range: NormalizedRange,
  markType: string,
  attrKey: string,
): string | null {
  const blocks = coveredTextBlocks(content, range)
  if (blocks.length === 0) {
    return null
  }
  const values = blocks.map((block) => {
    const [from, to] = perBlockRange(range, block)
    return rangeMarkAttr(blockInlineContent(block), from, to, markType, attrKey)
  })
  return values.some((value) => value === null) || !values.every((value) => value === values[0]) ? null : values[0]
}

/** One block.update patch per covered text block, its sub-range transformed by `apply`. */
export function computeRangeMarkPatches(
  content: SduiDocumentContent,
  range: NormalizedRange,
  apply: (blockContent: SduiInlineContent, from: number, to: number) => SduiInlineContent,
): SduiDocumentPatch[] {
  return coveredTextBlocks(content, range).map((block) => {
    const [from, to] = perBlockRange(range, block)
    return {
      type: 'block.update',
      blockId: createBlockId(block.id),
      state: inlineState(apply(blockInlineContent(block), from, to)),
    }
  })
}

// Toggle a mark across the range: if every covered text segment already has
// it, remove; otherwise add (Notion's whole-selection toggle semantics).
export function computeToggleRangeMark(
  content: SduiDocumentContent,
  range: NormalizedRange,
  mark: SduiInlineMark,
): SduiDocumentPatch[] {
  const allMarked = isRangeMarkActive(content, range, mark.type)
  return computeRangeMarkPatches(content, range, (blockContent, from, to) =>
    allMarked ? removeMarkInRange(blockContent, from, to, mark.type) : addMarkInRange(blockContent, from, to, mark),
  )
}

// Set (mark != null) or clear (mark == null) a mark across the range — used
// for color / highlight / link where the value replaces rather than toggles.
export function computeSetRangeMark(
  content: SduiDocumentContent,
  range: NormalizedRange,
  markType: string,
  mark: SduiInlineMark | null,
): SduiDocumentPatch[] {
  return computeRangeMarkPatches(content, range, (blockContent, from, to) =>
    mark ? addMarkInRange(blockContent, from, to, mark) : removeMarkInRange(blockContent, from, to, markType),
  )
}

/**
 * Notion delete/replace decision: the surviving prefix of the start block, the
 * inserted content (empty for a plain delete), and the suffix of the end block
 * merge into one block; every block between them is removed. Plain-string
 * insert collapses to a single text node.
 */
export function computeRangeReplacePatches(
  content: SduiDocumentContent,
  range: NormalizedRange,
  insert: string | SduiInlineContent,
): { patches: SduiDocumentPatch[]; caret: { blockId: string; offset: number } | null } {
  let insertContent: SduiInlineContent
  if (typeof insert === 'string') {
    insertContent = insert ? [{ type: 'text', text: insert }] : []
  } else {
    insertContent = insert
  }
  const insertLength = getInlineContentLength(insertContent)

  const startBlock = findBlockById(content, range.start.blockId)
  const endBlock = findBlockById(content, range.end.blockId)
  const startIsText = startBlock !== undefined && isTextBlock(startBlock)
  const endIsText = endBlock !== undefined && isTextBlock(endBlock)

  const patches: SduiDocumentPatch[] = []
  let caret: { blockId: string; offset: number } | null = null

  if (startIsText) {
    const head = deleteInlineRange(
      blockInlineContent(startBlock),
      range.start.offset,
      getInlineContentLength(blockInlineContent(startBlock)),
    )
    const tail = endIsText ? deleteInlineRange(blockInlineContent(endBlock), 0, range.end.offset) : []
    patches.push({
      type: 'block.update',
      blockId: createBlockId(range.start.blockId),
      state: inlineState([...head, ...insertContent, ...tail]),
    })
    // delete everything after the start block, up to and including the end
    range.blockIds.slice(1).forEach((id) => patches.push({ type: 'block.delete', blockId: createBlockId(id) }))
    caret = { blockId: range.start.blockId, offset: range.start.offset + insertLength }
  } else {
    // start is non-text (image/divider): drop it and the middles; keep the
    // end block's suffix if it is text.
    range.blockIds.slice(0, -1).forEach((id) => patches.push({ type: 'block.delete', blockId: createBlockId(id) }))
    if (endIsText) {
      patches.push({
        type: 'block.update',
        blockId: createBlockId(range.end.blockId),
        state: inlineState(deleteInlineRange(blockInlineContent(endBlock), 0, range.end.offset)),
      })
      caret = { blockId: range.end.blockId, offset: 0 }
    } else {
      patches.push({ type: 'block.delete', blockId: createBlockId(range.end.blockId) })
    }
  }

  return { patches, caret }
}

// Plain-text serialization of the range: each covered block's covered slice,
// joined by newlines (one line per block).
export function serializeRangeText(content: SduiDocumentContent, range: NormalizedRange): string {
  return coveredTextBlocks(content, range)
    .map((block) => {
      const [from, to] = perBlockRange(range, block)
      return coveredTextSegments(blockInlineContent(block), from, to)
        .map((segment) => segment.text)
        .join('')
    })
    .join('\n')
}

// Rich variant for internal (SDUI→SDUI) paste: keeps each segment's marks and
// inserts a hard break at every block boundary, so a cross-block copy of marked
// text round-trips into a single block instead of degrading to plain text.
export function serializeRangeInline(content: SduiDocumentContent, range: NormalizedRange): SduiInlineContent {
  return coveredTextBlocks(content, range).flatMap((block, index) => {
    const [from, to] = perBlockRange(range, block)
    const segments = coveredTextSegments(blockInlineContent(block), from, to)
    return index === 0 ? segments : [{ type: 'hard_break' as const }, ...segments]
  })
}
