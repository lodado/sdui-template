import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { blockText, stateText, stripKeys } from '../shared'
import { isSafeCtaUrl } from '../shared/url'
import type { ContentBlockTypeModule } from '../types'
import { createDefaultButton } from './button.default'
import { buttonToMarkdown } from './button.markdown'
import { buttonAttributesSchema, type ButtonBlockAttributes } from './button.schema'
import { BUTTON_BLOCK_TYPE } from './button.type'

export type { ButtonBlockAttributes } from './button.schema'
export { BUTTON_BLOCK_TYPE } from './button.type'

export type ButtonBlock = SduiDocumentBlock & {
  type: typeof BUTTON_BLOCK_TYPE
  attributes: ButtonBlockAttributes
}

export function isButtonBlock(block: SduiDocumentBlock): block is ButtonBlock {
  return block.type === BUTTON_BLOCK_TYPE
}

/** CTA link styled as a button. Label is inline text; href is scheme-guarded. */
export const buttonBlockModule = {
  type: BUTTON_BLOCK_TYPE,
  toSduiNode(block, { theme }) {
    return {
      id: block.id,
      type: 'Span',
      state: { text: blockText(block) },
      attributes: { ...block.attributes, 'data-block-type': BUTTON_BLOCK_TYPE, className: theme.paragraph },
    }
  },
  fromSduiNode(node, { id }) {
    const rest = stripKeys(node.attributes ?? {}, 'data-block-type', 'className')
    return { id, type: BUTTON_BLOCK_TYPE, state: { text: stateText(node) }, attributes: rest }
  },
  createDefault: createDefaultButton,
  attributesSchema: buttonAttributesSchema,
  toMarkdown: buttonToMarkdown,
  // Label edited via a settings popover (not inline PM) — an <a>/<button> can't
  // host a contentEditable region cleanly, and click would fight edit-vs-navigate.
  canHostInlineText: false,
  extractLinks(block) {
    const href = block.attributes?.href
    return typeof href === 'string' && isSafeCtaUrl(href) ? [{ href }] : []
  },
} satisfies ContentBlockTypeModule
