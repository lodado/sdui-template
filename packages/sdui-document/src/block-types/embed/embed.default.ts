import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiDocumentBlockId } from '../../blocks/schema/ids'
import { EMBED_BLOCK_TYPE } from './embed.type'

export function createDefaultEmbed(id: SduiDocumentBlockId, attributes?: Record<string, unknown>): SduiDocumentBlock {
  return { id, type: EMBED_BLOCK_TYPE, attributes: { url: '', height: 400, ...attributes } }
}
