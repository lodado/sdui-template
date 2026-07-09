import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { stripKeys } from '../shared'
import type { ContentBlockTypeModule } from '../types'
import { createDefaultTags } from './tags.default'
import { tagsToMarkdown } from './tags.markdown'
import { type TagItem, tagsAttributesSchema, type TagsBlockAttributes } from './tags.schema'
import { TAGS_BLOCK_TYPE } from './tags.type'

export type { TagItem, TagsBlockAttributes } from './tags.schema'
export { TAGS_BLOCK_TYPE } from './tags.type'

export type TagsBlock = SduiDocumentBlock & {
  type: typeof TAGS_BLOCK_TYPE
  attributes: TagsBlockAttributes
}

export function isTagsBlock(block: SduiDocumentBlock): block is TagsBlock {
  return block.type === TAGS_BLOCK_TYPE
}

/** Skill/tech chip row. Colors are palette keys (no free-form hex). */
export const tagsBlockModule = {
  type: TAGS_BLOCK_TYPE,
  toSduiNode(block, { theme }) {
    return {
      id: block.id,
      type: 'Div',
      attributes: { ...block.attributes, 'data-block-type': TAGS_BLOCK_TYPE, className: theme.paragraph },
    }
  },
  fromSduiNode(node, { id }) {
    const rest = stripKeys(node.attributes ?? {}, 'data-block-type', 'className')
    return { id, type: TAGS_BLOCK_TYPE, attributes: rest }
  },
  createDefault: createDefaultTags,
  attributesSchema: tagsAttributesSchema,
  toMarkdown: tagsToMarkdown,
  canHostInlineText: false,
} satisfies ContentBlockTypeModule
