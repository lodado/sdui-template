import { createBlockId, type SduiDocumentBlockId } from './ids'

/** Tie-break metadata for deterministic sibling ordering when fractional keys collide. */
export type BlockOrigin = {
  clientId: string
  opId: string
}

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
  /** Fractional ordering key among siblings (root block omits this). */
  position?: string
  /** Deterministic tie-break when two blocks share the same position key. */
  origin?: BlockOrigin
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
    ...(input.position !== undefined ? { position: input.position } : {}),
    ...(input.origin ? { origin: { ...input.origin } } : {}),
    state: input.state ? { ...input.state } : undefined,
    attributes: input.attributes ? { ...input.attributes } : undefined,
    children: input.children ? input.children.map(createDocumentBlock) : undefined,
  }
}
