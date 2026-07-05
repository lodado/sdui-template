import type { CreateDocumentBlockInput } from '../../blocks/schema/block'
import { nextBlockId } from '../authoring/blockId'
import { COLUMN_BLOCK_TYPE } from './column.type'

export type ColumnBuilderOptions = {
  id?: string
  /** Relative width weight among sibling columns (default: equal split). */
  ratio?: number
}

/** Author a single column holding a vertical stack of blocks. */
export function column(
  children: CreateDocumentBlockInput[],
  { id, ratio }: ColumnBuilderOptions = {},
): CreateDocumentBlockInput {
  return {
    id: id ?? nextBlockId('column'),
    type: COLUMN_BLOCK_TYPE,
    ...(ratio !== undefined ? { attributes: { ratio } } : {}),
    children,
  }
}
