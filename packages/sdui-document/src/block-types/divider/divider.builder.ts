import type { CreateDocumentBlockInput } from '../../blocks/schema/block'
import { nextBlockId } from '../authoring/blockId'
import { DIVIDER_BLOCK_TYPE } from './divider.type'

export type DividerBuilderOptions = { id?: string }

/** Author a divider (horizontal rule) block. */
export function divider({ id }: DividerBuilderOptions = {}): CreateDocumentBlockInput {
  return { id: id ?? nextBlockId('divider'), type: DIVIDER_BLOCK_TYPE }
}
