import type { CreateDocumentBlockInput } from '../../blocks/schema/block'
import { nextBlockId } from '../authoring/blockId'
import { COLUMN_LIST_BLOCK_TYPE } from './columnList.type'

export type ColumnListBuilderOptions = { id?: string }

/** Author a horizontal column container. Children must be `column(...)` blocks. */
export function columnList(
  columns: CreateDocumentBlockInput[],
  { id }: ColumnListBuilderOptions = {},
): CreateDocumentBlockInput {
  return {
    id: id ?? nextBlockId('column-list'),
    type: COLUMN_LIST_BLOCK_TYPE,
    children: columns,
  }
}
