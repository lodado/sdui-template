import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { blockText, stateText, textChild } from '../shared'
import type { SduiBlockTypeModule } from '../types'
import { createDefaultCallout } from './callout.default'
import { calloutToMarkdown } from './callout.markdown'
import { calloutAttributesSchema, type CalloutBlockAttributes } from './callout.schema'
import { CALLOUT_BLOCK_TYPE } from './callout.type'

export type { CalloutBlockAttributes } from './callout.schema'
export { CALLOUT_BLOCK_TYPE } from './callout.type'

export type CalloutBlock = SduiDocumentBlock & {
  type: typeof CALLOUT_BLOCK_TYPE
  attributes: CalloutBlockAttributes
}

export function isCalloutBlock(block: SduiDocumentBlock): block is CalloutBlock {
  return block.type === CALLOUT_BLOCK_TYPE
}

export const calloutBlockModule: SduiBlockTypeModule = {
  type: CALLOUT_BLOCK_TYPE,
  toSduiNode(block, { theme, mapChildren }) {
    const tone = String(block.attributes?.tone ?? theme.callout.defaultTone)
    const colors = theme.callout.toneColors[tone] ?? theme.callout.toneColors[theme.callout.defaultTone]

    return {
      id: block.id,
      type: 'Div',
      state: { text: blockText(block) },
      attributes: {
        'data-block-type': CALLOUT_BLOCK_TYPE,
        'data-tone': tone,
        className: `notice-block ${tone} ${theme.callout.base} ${theme.radius} border-l-4 ${colors.border} ${colors.background} px-[10px] py-2 text-[#111319]`,
      },
      children: [
        textChild(`${block.id}-icon`, 'ⓘ', `w-6 shrink-0 text-center ${colors.icon}`),
        textChild(`${block.id}-text`, blockText(block), 'content leading-[1.6]'),
        ...(mapChildren(block) ?? []),
      ],
    }
  },
  fromSduiNode(node, { id, children }) {
    const tone = node.attributes?.['data-tone']
    return {
      id,
      type: CALLOUT_BLOCK_TYPE,
      state: { text: stateText(node) },
      attributes: tone !== undefined ? { tone } : undefined,
      children,
    }
  },
  createDefault: createDefaultCallout,
  attributesSchema: calloutAttributesSchema,
  toMarkdown: calloutToMarkdown,
}
