import type { CreateDocumentBlockInput } from '../../blocks/schema/block'
import type { SduiInlineContent } from '../../blocks/schema/inline'
import { inlineState } from '../../content/inlineBuilders'
import { nextBlockId } from '../authoring/blockId'
import type { BlockAlign } from '../shared/align'
import { BULLETED_LIST_BLOCK_TYPE } from './bulletedList.type'

export type BulletedListBuilderOptions = {
  id?: string
  align?: BlockAlign
  /** Nested blocks (sub-items); authored with the same builders. */
  children?: CreateDocumentBlockInput[]
}

/** Author a bulleted-list item. Pass `children` for nested items. */
export function bulletedList(
  content: string | SduiInlineContent,
  { id, align, children }: BulletedListBuilderOptions = {},
): CreateDocumentBlockInput {
  return {
    id: id ?? nextBlockId('bulleted-list'),
    type: BULLETED_LIST_BLOCK_TYPE,
    state: typeof content === 'string' ? { text: content } : inlineState(content),
    ...(align ? { attributes: { align } } : {}),
    ...(children ? { children } : {}),
  }
}
