import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiDocumentBlockId } from '../../blocks/schema/ids'
import { VIDEO_BLOCK_TYPE } from './video.type'

export function createDefaultVideo(id: SduiDocumentBlockId, attributes?: Record<string, unknown>): SduiDocumentBlock {
  return {
    id,
    type: VIDEO_BLOCK_TYPE,
    attributes: { url: '', provider: 'youtube', videoId: '', aspectRatio: '16:9', ...attributes },
  }
}
