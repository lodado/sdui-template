import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { blockText, stateText, stripKeys, textChild } from '../shared'
import type { SduiBlockTypeModule } from '../types'

export type FileBlockAttributes = { title?: string; size?: string }

export type FileBlock = SduiDocumentBlock & {
  type: 'document.file'
  attributes: FileBlockAttributes
}

export function isFileBlock(block: SduiDocumentBlock): block is FileBlock {
  return block.type === 'document.file'
}

export const fileBlockModule: SduiBlockTypeModule = {
  type: 'document.file',
  toSduiNode(block, { theme }) {
    const t = theme.file

    return {
      id: block.id,
      type: 'Div',
      state: { text: blockText(block) },
      attributes: {
        'data-block-type': 'document.file',
        className: `attachment ${theme.radius} border border-[#DAE1E9] bg-[#F4F7FA] ${t.wrapper}`,
        ...block.attributes,
      },
      children: [
        textChild(`${block.id}-icon`, '▣', t.iconClassName),
        textChild(
          `${block.id}-title`,
          blockText(block) || String(block.attributes?.title ?? 'Attachment'),
          t.titleClassName,
        ),
        textChild(`${block.id}-size`, String(block.attributes?.size ?? ''), t.sizeClassName),
      ],
    }
  },
  fromSduiNode(node, { id }) {
    const restAttribs = stripKeys(node.attributes ?? {}, 'data-block-type', 'className')
    return {
      id,
      type: 'document.file',
      state: { text: stateText(node) },
      attributes: Object.keys(restAttribs).length > 0 ? restAttribs : undefined,
    }
  },
}
