import type { SduiDocumentContent } from '@lodado/sdui-document'
import { flattenDocumentBlocks } from '@lodado/sdui-document'

import { INLINE_ROOT_ATTRIBUTE, inlineOffsetFromDomPosition } from './domInlineOffsets'

/** A caret position in the document: a block plus an inline offset within it. */
export type DocEndpoint = { blockId: string; offset: number }

/** A directional selection (anchor = drag start, focus = drag end). */
export type DocRange = { anchor: DocEndpoint; focus: DocEndpoint }

/** A document-ordered range with the blocks it covers. */
export type NormalizedRange = {
  start: DocEndpoint
  end: DocEndpoint
  /** Covered block ids in document order, start..end inclusive. */
  blockIds: string[]
  /** false → the range lives in one block; the focused PM editor should own it. */
  isCrossBlock: boolean
}

function endpointFromDom(container: Element, node: Node | null, offset: number): DocEndpoint | null {
  if (!node) {
    return null
  }
  const element = node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as Element)
  const root = element?.closest(`[${INLINE_ROOT_ATTRIBUTE}]`)
  if (!root || !container.contains(root)) {
    return null
  }
  const blockId = root.closest('[data-block-id]')?.getAttribute('data-block-id')
  if (!blockId) {
    return null
  }
  const inlineOffset = inlineOffsetFromDomPosition(root, node, offset)
  if (inlineOffset === null) {
    return null
  }
  return { blockId, offset: inlineOffset }
}

/**
 * Reads the current browser selection as a DocRange, or null when there is no
 * usable selection (collapsed, or either endpoint is outside the editor's
 * inline content). Stateless — call it at operation time, never store the result.
 */
export function readDocRangeFromDom(container: Element): DocRange | null {
  const selection = container.ownerDocument.getSelection()
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return null
  }
  const anchor = endpointFromDom(container, selection.anchorNode, selection.anchorOffset)
  const focus = endpointFromDom(container, selection.focusNode, selection.focusOffset)
  if (!anchor || !focus) {
    return null
  }
  return { anchor, focus }
}

/**
 * Orders a (possibly backwards) DocRange into document order and lists the
 * blocks it covers. Returns null when an endpoint block is no longer present.
 */
export function normalizeDocRange(content: SduiDocumentContent, range: DocRange): NormalizedRange | null {
  const order = flattenDocumentBlocks(content)
    .map((item) => item.id)
    .filter((id) => id !== content.root.id)

  const anchorIndex = order.indexOf(range.anchor.blockId)
  const focusIndex = order.indexOf(range.focus.blockId)
  if (anchorIndex < 0 || focusIndex < 0) {
    return null
  }

  const anchorFirst =
    anchorIndex < focusIndex || (anchorIndex === focusIndex && range.anchor.offset <= range.focus.offset)
  const start = anchorFirst ? range.anchor : range.focus
  const end = anchorFirst ? range.focus : range.anchor

  const startIndex = order.indexOf(start.blockId)
  const endIndex = order.indexOf(end.blockId)

  return {
    start,
    end,
    blockIds: order.slice(startIndex, endIndex + 1),
    isCrossBlock: start.blockId !== end.blockId,
  }
}
