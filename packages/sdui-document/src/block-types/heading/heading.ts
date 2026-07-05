// packages/sdui-document/src/block-types/heading/heading.ts
import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { BlockMapperTheme } from '../../sdui/theme'
import { blockText, stateText, textChild } from '../shared'
import type { ContentBlockTypeModule } from '../types'
import { createDefaultHeading } from './heading.default'
import { headingToMarkdown } from './heading.markdown'
import { headingAttributesSchema, type HeadingBlockState, headingStateSchema } from './heading.schema'
import { HEADING_BLOCK_TYPE } from './heading.type'

export type { HeadingBlockState } from './heading.schema'
export { HEADING_BLOCK_TYPE } from './heading.type'

export type HeadingBlock = SduiDocumentBlock & {
  type: typeof HEADING_BLOCK_TYPE
  state: HeadingBlockState
}

export function isHeadingBlock(block: SduiDocumentBlock): block is HeadingBlock {
  return block.type === HEADING_BLOCK_TYPE
}

function resolveHeadingClassName(level: unknown, theme: BlockMapperTheme): string {
  if (level === 1) return theme.heading.level1
  if (level === 2) return theme.heading.level2
  return theme.heading.level3
}

export const headingBlockModule = {
  type: HEADING_BLOCK_TYPE,
  toSduiNode(block, { theme }) {
    return {
      id: block.id,
      type: 'Div',
      state: { text: blockText(block), level: block.state?.level },
      attributes: { 'data-block-type': HEADING_BLOCK_TYPE, className: theme.heading.wrapper },
      children: [textChild(`${block.id}-text`, blockText(block), resolveHeadingClassName(block.state?.level, theme))],
    }
  },
  fromSduiNode(node, { id, children }) {
    return {
      id,
      type: HEADING_BLOCK_TYPE,
      state: { text: stateText(node), level: node.state?.level },
      children,
    }
  },
  createDefault: createDefaultHeading,
  stateSchema: headingStateSchema,
  attributesSchema: headingAttributesSchema,
  toMarkdown: headingToMarkdown,
} satisfies ContentBlockTypeModule
