import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { blockText, stateText, stripKeys, textChild } from '../shared'
import type { SduiBlockTypeModule } from '../types'
import { createDefaultFile } from './file.default'
import { fileToMarkdown } from './file.markdown'
import { fileAttributesSchema, type FileBlockAttributes } from './file.schema'
import { FILE_BLOCK_TYPE } from './file.type'

export type { FileBlockAttributes } from './file.schema'
export { FILE_BLOCK_TYPE } from './file.type'

export type FileBlock = SduiDocumentBlock & {
  type: typeof FILE_BLOCK_TYPE
  attributes: FileBlockAttributes
}

export function isFileBlock(block: SduiDocumentBlock): block is FileBlock {
  return block.type === FILE_BLOCK_TYPE
}

export const fileBlockModule: SduiBlockTypeModule = {
  type: FILE_BLOCK_TYPE,
  toSduiNode(block, { theme }) {
    const t = theme.file

    return {
      id: block.id,
      type: 'Div',
      state: { text: blockText(block) },
      attributes: {
        'data-block-type': FILE_BLOCK_TYPE,
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
      type: FILE_BLOCK_TYPE,
      state: { text: stateText(node) },
      attributes: Object.keys(restAttribs).length > 0 ? restAttribs : undefined,
    }
  },
  createDefault: createDefaultFile,
  attributesSchema: fileAttributesSchema,
  toMarkdown: fileToMarkdown,
  canHostInlineText: false,
}
