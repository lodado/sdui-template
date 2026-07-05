import type { CreateDocumentBlockInput } from '../../blocks/schema/block'
import type { SduiInlineContent } from '../../blocks/schema/inline'
import { inlineState } from '../../content/inlineBuilders'
import { nextBlockId } from '../authoring/blockId'
import type { BlockAlign } from '../shared/align'
import { HEADING_BLOCK_TYPE } from './heading.type'

export type HeadingBuilderOptions = { id?: string; align?: BlockAlign }

/** Author a heading block. `content` may be a plain string or rich inline content. */
export function heading(
  content: string | SduiInlineContent,
  level: 1 | 2 | 3 = 1,
  { id, align }: HeadingBuilderOptions = {},
): CreateDocumentBlockInput {
  return {
    id: id ?? nextBlockId('heading'),
    type: HEADING_BLOCK_TYPE,
    state: typeof content === 'string' ? { text: content } : inlineState(content),
    attributes: { level, ...(align ? { align } : {}) },
  }
}
