// packages/sdui-document/src/block-types/checklist/checklist.ts
import type { SduiDocumentBlock } from '../../blocks/schema/block'
import { blockText, stateText, textChild } from '../shared'
import type { SduiBlockTypeModule } from '../types'
import { createDefaultChecklist } from './checklist.default'
import { checklistToMarkdown } from './checklist.markdown'
import { type ChecklistBlockState, checklistStateSchema } from './checklist.schema'
import { CHECKLIST_BLOCK_TYPE } from './checklist.type'

export type { ChecklistBlockState } from './checklist.schema'
export { CHECKLIST_BLOCK_TYPE } from './checklist.type'

export type ChecklistBlock = SduiDocumentBlock & {
  type: typeof CHECKLIST_BLOCK_TYPE
  state: ChecklistBlockState
}

export function isChecklistBlock(block: SduiDocumentBlock): block is ChecklistBlock {
  return block.type === CHECKLIST_BLOCK_TYPE
}

export const checklistBlockModule: SduiBlockTypeModule = {
  type: CHECKLIST_BLOCK_TYPE,
  toSduiNode(block, { theme }) {
    const checked = block.state?.checked === true
    const t = theme.checklist

    return {
      id: block.id,
      type: 'Div',
      state: { text: blockText(block), checked },
      attributes: { 'data-block-type': CHECKLIST_BLOCK_TYPE, className: t.wrapper },
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
      type: CHECKLIST_BLOCK_TYPE,
      state: { text: stateText(node), checked: node.state?.checked === true },
    }
  },
  createDefault: createDefaultChecklist,
  stateSchema: checklistStateSchema,
  toMarkdown: checklistToMarkdown,
}
