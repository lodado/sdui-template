import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { blockText, stateText } from '../shared'
import type { ContentBlockTypeModule } from '../types'
import { createDefaultCode } from './code.default'
import { codeToMarkdown } from './code.markdown'
import { codeAttributesSchema, type CodeBlockAttributes, type CodeBlockState, codeStateSchema } from './code.schema'
import { CODE_BLOCK_TYPE } from './code.type'

export type { CodeBlockAttributes, CodeBlockState } from './code.schema'
export { CODE_BLOCK_TYPE } from './code.type'

export type CodeBlock = SduiDocumentBlock & {
  type: typeof CODE_BLOCK_TYPE
  state: CodeBlockState
  attributes?: CodeBlockAttributes
}

export function isCodeBlock(block: SduiDocumentBlock): block is CodeBlock {
  return block.type === CODE_BLOCK_TYPE
}

export const codeBlockModule = {
  type: CODE_BLOCK_TYPE,
  toSduiNode(block, { theme }) {
    return {
      id: block.id,
      type: 'Div',
      state: { text: blockText(block), language: block.attributes?.language },
      attributes: { 'data-block-type': CODE_BLOCK_TYPE, className: theme.paragraph },
    }
  },
  fromSduiNode(node, { id }) {
    const language = typeof node.state?.language === 'string' ? node.state.language : undefined
    return {
      id,
      type: CODE_BLOCK_TYPE,
      state: { text: stateText(node) },
      ...(language ? { attributes: { language } } : {}),
    }
  },
  createDefault: createDefaultCode,
  stateSchema: codeStateSchema,
  attributesSchema: codeAttributesSchema,
  toMarkdown: codeToMarkdown,
} satisfies ContentBlockTypeModule
