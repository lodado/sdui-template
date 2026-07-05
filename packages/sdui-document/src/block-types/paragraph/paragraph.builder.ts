import type { CreateDocumentBlockInput } from '../../blocks/schema/block'
import type { SduiInlineContent } from '../../blocks/schema/inline'
import { inlineState } from '../../content/inlineBuilders'
import { nextBlockId } from '../authoring/blockId'
import type { BlockAlign } from '../shared/align'
import { PARAGRAPH_BLOCK_TYPE } from './paragraph.type'

export type ParagraphBuilderOptions = { id?: string; align?: BlockAlign }

/** Author a paragraph block. `content` may be a plain string or rich inline content. */
export function paragraph(
  content: string | SduiInlineContent,
  { id, align }: ParagraphBuilderOptions = {},
): CreateDocumentBlockInput {
  return {
    id: id ?? nextBlockId('paragraph'),
    type: PARAGRAPH_BLOCK_TYPE,
    state: typeof content === 'string' ? { text: content } : inlineState(content),
    ...(align ? { attributes: { align } } : {}),
  }
}
