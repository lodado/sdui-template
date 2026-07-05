import type { CreateDocumentBlockInput } from '../../blocks/schema/block'
import { nextBlockId } from '../authoring/blockId'
import type { BlockAlign } from '../shared/align'
import { IMAGE_BLOCK_TYPE } from './image.type'

export type ImageBuilderOptions = {
  id?: string
  src: string
  alt?: string
  width?: number
  height?: number
  align?: BlockAlign
  /** Optional caption — stored as the block's text. */
  caption?: string
}

/** Author an image block. */
export function image({ id, src, alt, width, height, align, caption }: ImageBuilderOptions): CreateDocumentBlockInput {
  return {
    id: id ?? nextBlockId('image'),
    type: IMAGE_BLOCK_TYPE,
    ...(caption ? { state: { text: caption } } : {}),
    attributes: {
      src,
      ...(alt ? { alt } : {}),
      ...(width ? { width } : {}),
      ...(height ? { height } : {}),
      ...(align ? { align } : {}),
    },
  }
}
