// packages/sdui-document/src/sdui/fromSduiLayout.ts
import { blockModuleByType, paragraphBlockModule } from '../block-types'
import { realBlockChildren } from '../block-types/shared'
import type { SduiLayoutLikeDocument, SduiLayoutLikeNode } from '../block-types/types'
import type { SduiDocumentBlock, SduiDocumentContent } from '../blocks/schema'
import { createBlockId } from '../blocks/schema/ids'

function fromSduiNode(node: SduiLayoutLikeNode): SduiDocumentBlock {
  const blockType = String(node.attributes?.['data-block-type'] ?? 'document.paragraph')
  const mapped = realBlockChildren(node).map(fromSduiNode)

  return (blockModuleByType[blockType] ?? paragraphBlockModule).fromSduiNode(node, {
    id: createBlockId(node.id),
    children: mapped.length > 0 ? mapped : undefined,
  })
}

export function fromSduiLayoutDocument(layout: SduiLayoutLikeDocument): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: fromSduiNode(layout.root),
  }
}
