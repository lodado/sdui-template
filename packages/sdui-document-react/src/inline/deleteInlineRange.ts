import type { SduiInlineContent } from '@lodado/sdui-document'

import { mapInlineRange } from './mapInlineRange'

/**
 * Removes the inline offset range [from, to) from a block's inline content,
 * returning new content (never mutates the input). Marks are preserved on the
 * surviving text; a hard_break inside the range is dropped.
 *
 * Cross-block delete uses this per covered block, so the block itself survives
 * (possibly emptied) and the outer op decides any merge.
 */
export function deleteInlineRange(content: SduiInlineContent, from: number, to: number): SduiInlineContent {
  return mapInlineRange(content, from, to, () => [])
}
