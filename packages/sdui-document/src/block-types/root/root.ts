// packages/sdui-document/src/block-types/root/root.ts
import type { SduiBlockTypeModule } from '../types'
import { rootToMarkdown } from './root.markdown'
import { ROOT_BLOCK_TYPE } from './root.type'

export { ROOT_BLOCK_TYPE } from './root.type'

export const rootBlockModule: SduiBlockTypeModule = {
  type: ROOT_BLOCK_TYPE,
  toSduiNode(block, { theme, mapChildren }) {
    const { background, textColor, maxWidth } = theme.root
    return {
      id: block.id,
      type: 'Div',
      attributes: {
        'data-block-type': ROOT_BLOCK_TYPE,
        className: `mx-auto flex w-full max-w-[${maxWidth}] flex-col gap-3 bg-[${background}] px-8 py-6 text-[${textColor}] ${theme.fontStack}`,
        ...block.attributes,
      },
      children: mapChildren(block),
    }
  },
  fromSduiNode(_node, { id, children }) {
    return { id, type: ROOT_BLOCK_TYPE, children }
  },
  toMarkdown: rootToMarkdown,
  canHostInlineText: false,
}
