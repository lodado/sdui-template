import { canHostInlineText } from '../../block-types'
import { getInlineContentLength } from '../../content/inlineContent'
import { insertInlineContent, removeInlineRange, sliceInlineContent } from '../../content/inlineRange'
import { findBlockById, getBlockInline, toInlineStatePatch } from '../code/blockPatch'
import type { SduiDocumentBlock, SduiDocumentContent, SduiDocumentPatch } from '../schema'
import { createBlockId } from '../schema'

// `canHostInlineText` is a per-block capability owned by each block folder — re-exported
// here to keep the public drag API stable.
export { canHostInlineText } from '../../block-types'

export type InlineDragSource = {
  blockId: string
  /** Inline offset range [from, to) of the dragged text in the source block. */
  from: number
  to: number
}

export type CreateInlineDragPatchesInput = {
  content: SduiDocumentContent
  source: InlineDragSource
  targetBlockId: string
  targetOffset: number
  /** When set, the source range is kept (Alt-drag copy). */
  copy?: boolean
}

export type InlineDragPatchesResult = {
  patches: SduiDocumentPatch[]
  /** Block to focus after the drop. */
  focusBlockId: string
  /** Caret offset right after the inserted fragment. */
  caretOffset: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Projects a cross-block (or intra-block) inline text drag onto document
 * patches — the domain half of ProseMirror-style text drag-and-drop.
 *
 * Offsets are clamped rather than thrown on: drop coordinates come from live
 * DOM measurement and may lag one frame behind the document.
 *
 * @returns null when the drop is a no-op (empty range, drop inside the dragged
 * range, unknown blocks, or a target that cannot host inline text)
 */
export function createInlineDragPatches(input: CreateInlineDragPatchesInput): InlineDragPatchesResult | null {
  const { content, source, targetBlockId, copy = false } = input

  const sourceBlock = findBlockById(content, source.blockId)
  const targetBlock = findBlockById(content, targetBlockId)
  if (!sourceBlock || !targetBlock || !canHostInlineText(sourceBlock) || !canHostInlineText(targetBlock)) {
    return null
  }

  const sourceInline = getBlockInline(sourceBlock)
  const targetInline = getBlockInline(targetBlock)
  const sourceLength = getInlineContentLength(sourceInline.content)
  const from = clamp(source.from, 0, sourceLength)
  const to = clamp(source.to, from, sourceLength)
  const targetOffset = clamp(input.targetOffset, 0, getInlineContentLength(targetInline.content))

  if (from === to) {
    return null
  }

  const isSameBlock = sourceBlock.id === targetBlock.id
  if (isSameBlock && !copy && targetOffset >= from && targetOffset <= to) {
    return null
  }

  const fragment = sliceInlineContent(sourceInline.content, from, to)
  const fragmentLength = getInlineContentLength(fragment)

  if (isSameBlock) {
    const base = copy ? sourceInline.content : removeInlineRange(sourceInline.content, from, to)
    const insertOffset = !copy && targetOffset > to ? targetOffset - (to - from) : targetOffset
    const next = insertInlineContent(base, insertOffset, fragment)

    return {
      patches: [
        {
          type: 'block.update',
          blockId: createBlockId(sourceBlock.id),
          state: toInlineStatePatch(sourceInline.mode, next),
        },
      ],
      focusBlockId: targetBlock.id,
      caretOffset: insertOffset + fragmentLength,
    }
  }

  const nextTarget = insertInlineContent(targetInline.content, targetOffset, fragment)
  const targetPatch: SduiDocumentPatch = {
    type: 'block.update',
    blockId: createBlockId(targetBlock.id),
    state: toInlineStatePatch(targetInline.mode, nextTarget),
  }

  const patches: SduiDocumentPatch[] = copy
    ? [targetPatch]
    : [
        {
          type: 'block.update',
          blockId: createBlockId(sourceBlock.id),
          state: toInlineStatePatch(sourceInline.mode, removeInlineRange(sourceInline.content, from, to)),
        },
        targetPatch,
      ]

  return {
    patches,
    focusBlockId: targetBlock.id,
    caretOffset: targetOffset + fragmentLength,
  }
}
