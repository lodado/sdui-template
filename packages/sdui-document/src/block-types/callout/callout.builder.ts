import type { CreateDocumentBlockInput } from '../../blocks/schema/block'
import type { SduiInlineContent } from '../../blocks/schema/inline'
import { inlineState } from '../../content/inlineBuilders'
import { nextBlockId } from '../authoring/blockId'
import type { CalloutBlockAttributes } from './callout.schema'
import { CALLOUT_BLOCK_TYPE } from './callout.type'

export type CalloutBuilderOptions = {
  id?: string
  /** Visual tint. */
  tone?: CalloutBlockAttributes['tone']
  /** Emoji glyph overriding the tone icon. */
  icon?: string
  /** Nested blocks rendered inside the callout. */
  children?: CreateDocumentBlockInput[]
}

/** Author a callout block. */
export function callout(
  content: string | SduiInlineContent,
  { id, tone, icon, children }: CalloutBuilderOptions = {},
): CreateDocumentBlockInput {
  return {
    id: id ?? nextBlockId('callout'),
    type: CALLOUT_BLOCK_TYPE,
    state: typeof content === 'string' ? { text: content } : inlineState(content),
    ...(tone || icon ? { attributes: { ...(tone ? { tone } : {}), ...(icon ? { icon } : {}) } } : {}),
    ...(children ? { children } : {}),
  }
}
