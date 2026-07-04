import { createBlockId, type SduiDocumentBlockId } from './ids'

export type SduiDocumentBlockType =
  | 'document.root'
  | 'document.paragraph'
  | 'document.heading'
  | 'document.checklist'
  | 'document.divider'
  | 'document.callout'
  | 'document.image'
  | 'document.file'
  | 'document.link'

export type SduiDocumentBlock = {
  id: SduiDocumentBlockId
  type: SduiDocumentBlockType | (string & {})
  state?: Record<string, unknown>
  attributes?: Record<string, unknown>
  children?: SduiDocumentBlock[]
}

/**
 * Factory input accepts raw string ids for ergonomics; the factory is the
 * branding boundary (mirrors createBlockId).
 */
export type CreateDocumentBlockInput = Omit<SduiDocumentBlock, 'id' | 'children'> & {
  id: string
  children?: CreateDocumentBlockInput[]
}

export function createDocumentBlock(input: CreateDocumentBlockInput): SduiDocumentBlock {
  return {
    ...input,
    id: createBlockId(input.id),
    state: input.state ? { ...input.state } : undefined,
    attributes: input.attributes ? { ...input.attributes } : undefined,
    children: input.children ? input.children.map(createDocumentBlock) : undefined,
  }
}
