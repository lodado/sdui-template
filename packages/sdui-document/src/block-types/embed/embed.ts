import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { stripKeys } from '../shared'
import { isSafeHttpUrl } from '../shared/url'
import type { ContentBlockTypeModule } from '../types'
import { createDefaultEmbed } from './embed.default'
import { embedToMarkdown } from './embed.markdown'
import { embedAttributesSchema, type EmbedBlockAttributes } from './embed.schema'
import { EMBED_BLOCK_TYPE } from './embed.type'

export type { EmbedBlockAttributes } from './embed.schema'
export { EMBED_BLOCK_TYPE } from './embed.type'

export type EmbedBlock = SduiDocumentBlock & {
  type: typeof EMBED_BLOCK_TYPE
  attributes: EmbedBlockAttributes
}

export function isEmbedBlock(block: SduiDocumentBlock): block is EmbedBlock {
  return block.type === EMBED_BLOCK_TYPE
}

/** Generic iframe embed. Render layer enforces a host allowlist (data alone is not trusted). */
export const embedBlockModule = {
  type: EMBED_BLOCK_TYPE,
  toSduiNode(block, { theme }) {
    return {
      id: block.id,
      type: 'Div',
      attributes: { ...block.attributes, 'data-block-type': EMBED_BLOCK_TYPE, className: theme.paragraph },
    }
  },
  fromSduiNode(node, { id }) {
    const rest = stripKeys(node.attributes ?? {}, 'data-block-type', 'className')
    return { id, type: EMBED_BLOCK_TYPE, attributes: rest }
  },
  createDefault: createDefaultEmbed,
  attributesSchema: embedAttributesSchema,
  toMarkdown: embedToMarkdown,
  canHostInlineText: false,
  extractLinks(block) {
    const url = block.attributes?.url
    return typeof url === 'string' && isSafeHttpUrl(url) ? [{ href: url }] : []
  },
} satisfies ContentBlockTypeModule
