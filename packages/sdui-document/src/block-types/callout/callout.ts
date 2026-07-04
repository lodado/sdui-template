import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { blockText, stateText, textChild } from '../shared'
import type { SduiBlockTypeModule } from '../types'

export type CalloutBlockAttributes = {
  tone?: 'info' | 'tip' | 'warning' | 'success'
}

export type CalloutBlock = SduiDocumentBlock & {
  type: 'document.callout'
  attributes: CalloutBlockAttributes
}

export function isCalloutBlock(block: SduiDocumentBlock): block is CalloutBlock {
  return block.type === 'document.callout'
}

export const calloutBlockModule: SduiBlockTypeModule = {
  type: 'document.callout',
  toSduiNode(block, { theme, mapChildren }) {
    const tone = String(block.attributes?.tone ?? theme.callout.defaultTone)
    const colors = theme.callout.toneColors[tone] ?? theme.callout.toneColors[theme.callout.defaultTone]

    return {
      id: block.id,
      type: 'Div',
      state: { text: blockText(block) },
      attributes: {
        'data-block-type': 'document.callout',
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
      type: 'document.callout',
      state: { text: stateText(node) },
      attributes: tone !== undefined ? { tone } : undefined,
      children,
    }
  },
}
