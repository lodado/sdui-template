import type { SduiDocumentBlock } from '../blocks/schema/block'
import { createBlockId } from '../blocks/schema/ids'

const EMPTY_TEXT_STATE = () => ({ content: [], text: '' })

/**
 * Freshly-inserted block for the block menu / '+' button.
 * Per-type defaults only — callers merge menu attrs on top.
 */
export function createDefaultBlock(
  type: SduiDocumentBlock['type'],
  id: string,
  attributes?: Record<string, unknown>,
): SduiDocumentBlock {
  const blockId = createBlockId(id)

  switch (type) {
    case 'document.divider':
      return { id: blockId, type, ...(attributes ? { attributes } : {}) }

    case 'document.checklist':
      return { id: blockId, type, state: EMPTY_TEXT_STATE(), attributes: { checked: false, ...attributes } }

    case 'document.image':
    case 'document.file':
    case 'document.link':
      return { id: blockId, type, state: { text: '' }, ...(attributes ? { attributes } : {}) }

    default:
      return { id: blockId, type, state: EMPTY_TEXT_STATE(), ...(attributes ? { attributes } : {}) }
  }
}
