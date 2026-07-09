import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { stripKeys } from '../shared'
import { isSafeHttpUrl } from '../shared/url'
import type { ContentBlockTypeModule } from '../types'
import { createDefaultVideo } from './video.default'
import { videoToMarkdown } from './video.markdown'
import { videoAttributesSchema, type VideoBlockAttributes } from './video.schema'
import { VIDEO_BLOCK_TYPE } from './video.type'

export type { VideoBlockAttributes } from './video.schema'
export { VIDEO_BLOCK_TYPE } from './video.type'

export type VideoBlock = SduiDocumentBlock & {
  type: typeof VIDEO_BLOCK_TYPE
  attributes: VideoBlockAttributes
}

export function isVideoBlock(block: SduiDocumentBlock): block is VideoBlock {
  return block.type === VIDEO_BLOCK_TYPE
}

/** YouTube / Vimeo embed. Only parseable URLs reach here (editor rejects others). */
export const videoBlockModule = {
  type: VIDEO_BLOCK_TYPE,
  toSduiNode(block, { theme }) {
    return {
      id: block.id,
      type: 'Div',
      attributes: { ...block.attributes, 'data-block-type': VIDEO_BLOCK_TYPE, className: theme.paragraph },
    }
  },
  fromSduiNode(node, { id }) {
    const rest = stripKeys(node.attributes ?? {}, 'data-block-type', 'className')
    return { id, type: VIDEO_BLOCK_TYPE, attributes: rest }
  },
  createDefault: createDefaultVideo,
  attributesSchema: videoAttributesSchema,
  toMarkdown: videoToMarkdown,
  canHostInlineText: false,
  extractLinks(block) {
    const url = block.attributes?.url
    return typeof url === 'string' && isSafeHttpUrl(url) ? [{ href: url }] : []
  },
} satisfies ContentBlockTypeModule
