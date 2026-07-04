// packages/sdui-document/src/block-types/heading/heading.ts
import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { BlockMapperTheme } from '../../sdui/theme'
import { blockText, stateText, textChild } from '../shared'
import type { SduiBlockTypeModule } from '../types'

export type HeadingBlockState = { text?: string; level?: 1 | 2 | 3 }

export type HeadingBlock = SduiDocumentBlock & {
  type: 'document.heading'
  state: HeadingBlockState
}

export function isHeadingBlock(block: SduiDocumentBlock): block is HeadingBlock {
  return block.type === 'document.heading'
}

function resolveHeadingClassName(level: unknown, theme: BlockMapperTheme): string {
  if (level === 1) return theme.heading.level1
  if (level === 2) return theme.heading.level2
  return theme.heading.level3
}

export const headingBlockModule: SduiBlockTypeModule = {
  type: 'document.heading',
  toSduiNode(block, { theme }) {
    return {
      id: block.id,
      type: 'Div',
      state: { text: blockText(block), level: block.state?.level },
      attributes: { 'data-block-type': 'document.heading', className: theme.heading.wrapper },
      children: [textChild(`${block.id}-text`, blockText(block), resolveHeadingClassName(block.state?.level, theme))],
    }
  },
  fromSduiNode(node, { id, children }) {
    return {
      id,
      type: 'document.heading',
      state: { text: stateText(node), level: node.state?.level },
      children,
    }
  },
}
