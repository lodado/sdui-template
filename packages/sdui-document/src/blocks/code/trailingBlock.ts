import { canHostInlineText, PARAGRAPH_BLOCK_TYPE } from '../../block-types'
import { getInlineContentLength } from '../../content/inlineContent'
import type { SduiDocumentBlock, SduiDocumentContent, SduiDocumentPatch } from '../schema'
import { createBlockId, createDocumentBlock } from '../schema'
import { applyDocumentPatch, getBlockInline } from './blockPatch'

/**
 * Trailing-block invariant, ported from Outline's TrailingNode extension
 * (shared/editor/extensions/TrailingNode.ts): the document must end in a
 * block that can host inline text, so the caret can always be placed after
 * the last block. Clicking below the document then only ever FOCUSES the
 * trailing block — creation is owned by this invariant, not by the click.
 */

/** The empty paragraph the invariant appends (Outline's `type.create()`). */
export function createEmptyParagraphBlock(id: string): SduiDocumentBlock {
  return createDocumentBlock({ id, type: PARAGRAPH_BLOCK_TYPE })
}

/**
 * Whether the document needs a trailing empty paragraph — true when the root
 * has no children or its last child cannot host inline text (divider/image/
 * file/link). Port of Outline's requiresTrailingNode.
 */
export function requiresTrailingBlock(content: SduiDocumentContent): boolean {
  const children = content.root.children ?? []
  const last = children[children.length - 1]
  if (!last) {
    return true
  }

  return !canHostInlineText(last)
}

/**
 * Builds the block.insert patch that restores the invariant.
 *
 * @returns null when the invariant already holds; the id generator is only
 * consulted when a patch is actually produced (deterministic-id tests rely
 * on this)
 */
export function createTrailingBlockPatch(
  content: SduiDocumentContent,
  generateBlockId: () => string,
): SduiDocumentPatch | null {
  if (!requiresTrailingBlock(content)) {
    return null
  }

  const children = content.root.children ?? []
  const last = children[children.length - 1]

  return {
    type: 'block.insert',
    parentId: createBlockId(content.root.id),
    after: last ? last.id : null,
    block: createEmptyParagraphBlock(generateBlockId()),
  }
}

/**
 * Normalizes content on load so opening a document never produces a spurious
 * edit (port of Outline's withTrailingNode). Returns the same reference when
 * the invariant already holds.
 */
export function withTrailingBlock(content: SduiDocumentContent, generateBlockId: () => string): SduiDocumentContent {
  const patch = createTrailingBlockPatch(content, generateBlockId)

  return patch ? applyDocumentPatch(content, patch) : content
}

/**
 * The empty-document placeholder condition (Outline Doc.ts): exactly one root
 * child, it hosts inline text, and it carries no text and no children.
 */
export function isEmptyDocument(content: SduiDocumentContent): boolean {
  const children = content.root.children ?? []
  if (children.length !== 1) {
    return false
  }

  const only = children[0]
  if (!canHostInlineText(only) || (only.children?.length ?? 0) > 0) {
    return false
  }

  return getInlineContentLength(getBlockInline(only).content) === 0
}
