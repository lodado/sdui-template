// packages/sdui-document/src/block-types/checklist/checklist.ts
import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { blockText, stateText, textChild } from '../shared'
import type { SduiBlockTypeModule } from '../types'

export type ChecklistBlockState = { text?: string; checked?: boolean }

export type ChecklistBlock = SduiDocumentBlock & {
  type: 'document.checklist'
  state: ChecklistBlockState
}

export function isChecklistBlock(block: SduiDocumentBlock): block is ChecklistBlock {
  return block.type === 'document.checklist'
}

export const checklistBlockModule: SduiBlockTypeModule = {
  type: 'document.checklist',
  toSduiNode(block, { theme }) {
    const checked = block.state?.checked === true
    const t = theme.checklist

    return {
      id: block.id,
      type: 'Div',
      state: { text: blockText(block), checked },
      attributes: { 'data-block-type': 'document.checklist', className: t.wrapper },
      children: [
        textChild(`${block.id}-check`, checked ? t.checkOn : t.checkOff, t.checkColor),
        textChild(`${block.id}-text`, blockText(block), checked ? t.textOn : t.textOff),
      ],
    }
  },
  // checklist intentionally drops children on round-trip (matches old fromSduiLayout case)
  fromSduiNode(node, { id }) {
    return {
      id,
      type: 'document.checklist',
      state: { text: stateText(node), checked: node.state?.checked === true },
    }
  },
}
