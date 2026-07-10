import type { CreateDocumentBlockInput } from '../../blocks/schema/block'
import { nextBlockId } from '../authoring/blockId'
import { TOC_BLOCK_TYPE } from './toc.type'

export type TocBuilderOptions = { id?: string }

/** Author a table-of-contents block (headings are collected at render time). */
export function toc({ id }: TocBuilderOptions = {}): CreateDocumentBlockInput {
  return { id: id ?? nextBlockId('toc'), type: TOC_BLOCK_TYPE }
}
