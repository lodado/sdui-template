import type { SduiDocumentBlock } from '../../blocks/schema/block'
import type { SduiBlockTypeModule } from '../types'
import { createDefaultCollection } from './collection.default'
import { collectionToMarkdown } from './collection.markdown'
import { collectionAttributesSchema, type CollectionBlockAttributes } from './collection.schema'
import { COLLECTION_BLOCK_TYPE } from './collection.type'

export {
  COLLECTION_VIEWS,
  type CollectionBlockAttributes,
  type CollectionView,
  collectionViewSchema,
} from './collection.schema'
export { COLLECTION_BLOCK_TYPE } from './collection.type'
export * from './property'

export type CollectionBlock = SduiDocumentBlock & {
  type: typeof COLLECTION_BLOCK_TYPE
  attributes?: CollectionBlockAttributes
}

export function isCollectionBlock(block: SduiDocumentBlock): block is CollectionBlock {
  return block.type === COLLECTION_BLOCK_TYPE
}

/**
 * Database-like container whose children are page blocks (items). The stored
 * data is one list; `attributes.view` only changes how the React layer renders
 * it. Non-page children are ignored by renderers (kept in the tree).
 */
export const collectionBlockModule = {
  type: COLLECTION_BLOCK_TYPE,
  toSduiNode(block, { theme, mapChildren }) {
    const view = block.attributes?.view ?? 'gallery'
    return {
      id: block.id,
      type: 'Div',
      attributes: {
        'data-block-type': COLLECTION_BLOCK_TYPE,
        'data-view': view,
        className: theme.paragraph,
      },
      children: mapChildren(block),
    }
  },
  fromSduiNode(node, { id, children }) {
    const view = typeof node.attributes?.['data-view'] === 'string' ? node.attributes['data-view'] : 'gallery'
    return {
      id,
      type: COLLECTION_BLOCK_TYPE,
      attributes: { view: view as CollectionBlockAttributes['view'], properties: [] },
      children,
    }
  },
  createDefault: createDefaultCollection,
  attributesSchema: collectionAttributesSchema,
  toMarkdown: collectionToMarkdown,
  canHostInlineText: false,
} satisfies SduiBlockTypeModule
