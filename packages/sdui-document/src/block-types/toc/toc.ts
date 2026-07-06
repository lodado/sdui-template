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
    return {
      id: block.id,
      type: 'Div',
      attributes: { 'data-block-type': TOC_BLOCK_TYPE },
    }
  },
  fromSduiNode(_node, { id }) {
    return { id, type: TOC_BLOCK_TYPE }
  },
  createDefault: createDefaultToc,
  toMarkdown: tocToMarkdown,
  canHostInlineText: false,
} satisfies ContentBlockTypeModule
