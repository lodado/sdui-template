import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { blockText, stateText, stripKeys, textChild } from '../shared'
import type { SduiBlockTypeModule } from '../types'
import { createDefaultImage } from './image.default'
import { imageToMarkdown } from './image.markdown'
import { imageAttributesSchema, type ImageBlockAttributes } from './image.schema'
import { IMAGE_BLOCK_TYPE } from './image.type'

export type { ImageBlockAttributes } from './image.schema'
export { IMAGE_BLOCK_TYPE } from './image.type'

export type ImageBlock = SduiDocumentBlock & {
  type: typeof IMAGE_BLOCK_TYPE
  attributes: ImageBlockAttributes
}

export function isImageBlock(block: SduiDocumentBlock): block is ImageBlock {
  return block.type === IMAGE_BLOCK_TYPE
}

export const imageBlockModule: SduiBlockTypeModule = {
  type: IMAGE_BLOCK_TYPE,
  toSduiNode(block, { theme }) {
    const alt = blockText(block) || String(block.attributes?.alt ?? 'Image')
    const t = theme.image

    return {
      id: block.id,
      type: 'Div',
      state: { text: blockText(block) },
      attributes: {
        'data-block-type': IMAGE_BLOCK_TYPE,
        className: `image ${theme.radius} border border-[#DAE1E9] bg-[#F9FBFC] ${t.wrapper}`,
        ...block.attributes,
      },
      children: [
        textChild(`${block.id}-label`, alt, t.labelClassName),
        textChild(`${block.id}-caption`, String(block.attributes?.src ?? 'image source pending'), t.captionClassName),
      ],
    }
  },
  fromSduiNode(node, { id }) {
    const restAttribs = stripKeys(node.attributes ?? {}, 'data-block-type', 'className')
    return {
      id,
      type: IMAGE_BLOCK_TYPE,
      state: { text: stateText(node) },
      attributes: Object.keys(restAttribs).length > 0 ? restAttribs : undefined,
    }
  },
  createDefault: createDefaultImage,
  attributesSchema: imageAttributesSchema,
  toMarkdown: imageToMarkdown,
  canHostInlineText: false,
}
