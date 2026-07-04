import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { blockText, stateText, stripKeys, textChild } from '../shared'
import type { SduiBlockTypeModule } from '../types'

export type ImageBlockAttributes = { src?: string; alt?: string }

export type ImageBlock = SduiDocumentBlock & {
  type: 'document.image'
  attributes: ImageBlockAttributes
}

export function isImageBlock(block: SduiDocumentBlock): block is ImageBlock {
  return block.type === 'document.image'
}

export const imageBlockModule: SduiBlockTypeModule = {
  type: 'document.image',
  toSduiNode(block, { theme }) {
    const alt = blockText(block) || String(block.attributes?.alt ?? 'Image')
    const t = theme.image

    return {
      id: block.id,
      type: 'Div',
      state: { text: blockText(block) },
      attributes: {
        'data-block-type': 'document.image',
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
      type: 'document.image',
      state: { text: stateText(node) },
      attributes: Object.keys(restAttribs).length > 0 ? restAttribs : undefined,
    }
  },
}
