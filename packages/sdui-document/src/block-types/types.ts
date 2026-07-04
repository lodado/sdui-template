// packages/sdui-document/src/block-types/types.ts
import type { SduiDocumentBlock } from '../blocks/schema/block'
import type { SduiDocumentBlockId } from '../blocks/schema/ids'
import type { BlockMapperTheme } from '../sdui/theme'

export type SduiLayoutLikeNode = {
  id: string
  type: string
  state?: Record<string, unknown>
  attributes?: Record<string, unknown>
  children?: SduiLayoutLikeNode[]
}

export type SduiLayoutLikeDocument = {
  version: string
  metadata?: {
    id?: string
    name?: string
  }
  root: SduiLayoutLikeNode
}

export type BlockMapperContext = {
  theme: BlockMapperTheme
  /** recursive dispatch injected by the dispatcher — modules never import it (no cycle) */
  mapChildren(block: SduiDocumentBlock): SduiLayoutLikeNode[] | undefined
}

/** Precomputed by the fromSdui dispatcher: branded id + mapped children (undefined when empty). */
export type FromSduiBase = {
  id: SduiDocumentBlockId
  children?: SduiDocumentBlock[]
}

/**
 * One document block type, fully colocated on the domain side: typed
 * state/attributes, type guard, and both SDUI layout mappings.
 * Render-side counterpart: packages/sdui-document-react/src/block-types/<name>/.
 */
export type SduiBlockTypeModule = {
  readonly type: string
  toSduiNode(block: SduiDocumentBlock, ctx: BlockMapperContext): SduiLayoutLikeNode
  fromSduiNode(node: SduiLayoutLikeNode, base: FromSduiBase): SduiDocumentBlock
}
