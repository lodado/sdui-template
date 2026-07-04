// packages/sdui-document/src/sdui/toSduiLayout.ts
import { blockModuleByType, paragraphBlockModule } from '../block-types'
import type { BlockMapperContext, SduiLayoutLikeDocument, SduiLayoutLikeNode } from '../block-types/types'
import type { SduiDocumentBlock, SduiDocumentContent } from '../blocks/schema'
import { type BlockMapperTheme, outlineTheme } from './theme'

// Layout-like types moved to block-types/types.ts — re-exported to keep the public API stable.
export type { SduiLayoutLikeDocument, SduiLayoutLikeNode } from '../block-types/types'

export type ToSduiLayoutDocumentOptions = {
  documentId?: string
  title?: string
  theme?: BlockMapperTheme
}

export function mapDocumentBlockToSduiNode(
  block: SduiDocumentBlock,
  theme: BlockMapperTheme = outlineTheme,
): SduiLayoutLikeNode {
  const ctx: BlockMapperContext = {
    theme,
    mapChildren: (parent) => parent.children?.map((child) => mapDocumentBlockToSduiNode(child, theme)),
  }

  return (blockModuleByType[block.type] ?? paragraphBlockModule).toSduiNode(block, ctx)
}

export function toSduiLayoutDocument(
  content: SduiDocumentContent,
  options: ToSduiLayoutDocumentOptions = {},
): SduiLayoutLikeDocument {
  const theme = options.theme ?? outlineTheme

  return {
    version: '1.0.0',
    metadata: {
      id: options.documentId,
      name: options.title,
    },
    root: mapDocumentBlockToSduiNode(content.root, theme),
  }
}
