import type { CreateDocumentBlockInput } from '../../blocks/schema/block'
import { nextBlockId } from '../authoring/blockId'
import type { PropertyColor } from '../collection/property'
import { TAGS_BLOCK_TYPE } from './tags.type'

export type TagInput = string | { label: string; color?: PropertyColor; id?: string }
export type TagsBuilderOptions = { id?: string }

/** Author a tags (skill chips) block. Bare strings become gray-default chips. */
export function tags(items: TagInput[], { id }: TagsBuilderOptions = {}): CreateDocumentBlockInput {
  return {
    id: id ?? nextBlockId('tags'),
    type: TAGS_BLOCK_TYPE,
    attributes: {
      items: items.map((item) =>
        typeof item === 'string'
          ? { id: nextBlockId('tag'), label: item }
          : { id: item.id ?? nextBlockId('tag'), label: item.label, ...(item.color ? { color: item.color } : {}) },
      ),
    },
  }
}
