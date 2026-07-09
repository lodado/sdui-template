// packages/sdui-document/src/block-types/index.ts
import type { SduiDocumentBlock } from '../blocks/schema/block'
import { bulletedListBlockModule } from './bulleted-list/bulletedList'
import { calloutBlockModule } from './callout/callout'
import { checklistBlockModule } from './checklist/checklist'
import { codeBlockModule } from './code/code'
import { columnBlockModule } from './column/column'
import { columnListBlockModule } from './column-list/columnList'
import { dividerBlockModule } from './divider/divider'
import { fileBlockModule } from './file/file'
import { headingBlockModule } from './heading/heading'
import { imageBlockModule } from './image/image'
import { linkBlockModule } from './link/link'
import { numberedListBlockModule } from './numbered-list/numberedList'
import { pageBlockModule } from './page/page'
import { paragraphBlockModule } from './paragraph/paragraph'
import { quoteBlockModule } from './quote/quote'
import { rootBlockModule } from './root/root'
import { tocBlockModule } from './toc/toc'
import { toggleBlockModule } from './toggle/toggle'
import type { BlockLinkRef, SduiBlockTypeModule } from './types'

/**
 * Block-type registry — the single source that drives SDUI mapping, defaults,
 * schema, markdown, and block capabilities. Unknown types fall back to
 * paragraphBlockModule (old switch defaults).
 * NOTE: when adding a block type, add its folder + `<name>.type.ts` constant to
 * the SduiDocumentBlockType union in blocks/schema/block.ts (the only central
 * edit — validation and capabilities derive from this registry automatically).
 * Declare menu-insertable modules with `satisfies ContentBlockTypeModule`
 * (root/column containers use `satisfies SduiBlockTypeModule`) so missing
 * members fail to compile.
 */
export const BLOCK_TYPE_MODULES: readonly SduiBlockTypeModule[] = [
  rootBlockModule,
  paragraphBlockModule,
  headingBlockModule,
  bulletedListBlockModule,
  numberedListBlockModule,
  checklistBlockModule,
  dividerBlockModule,
  calloutBlockModule,
  quoteBlockModule,
  toggleBlockModule,
  codeBlockModule,
  imageBlockModule,
  fileBlockModule,
  linkBlockModule,
  columnListBlockModule,
  columnBlockModule,
  tocBlockModule,
  pageBlockModule,
]

export const blockModuleByType: Record<string, SduiBlockTypeModule> = BLOCK_TYPE_MODULES.reduce(
  (byType, blockModule) => ({ ...byType, [blockModule.type]: blockModule }),
  {},
)

/** Whether a block can carry inline text — registry-driven (defaults to true for unknown types). */
export function canHostInlineText(block: SduiDocumentBlock): boolean {
  return blockModuleByType[block.type]?.canHostInlineText ?? true
}

/** Links a block contributes (via its module's `extractLinks`); empty when it contributes none. */
export function extractBlockLinks(block: SduiDocumentBlock): BlockLinkRef[] {
  return blockModuleByType[block.type]?.extractLinks?.(block) ?? []
}

/** Per-block plain-text override, when the module defines one (else the caller's fallback applies). */
export function blockToPlainText(block: SduiDocumentBlock): string | undefined {
  return blockModuleByType[block.type]?.toPlainText?.(block)
}

export { paragraphBlockModule }
// Per-folder block-type identity constants — public so consumers can build
// documents/patches without hardcoding magic strings.
export { BULLETED_LIST_BLOCK_TYPE } from './bulleted-list/bulletedList.type'
export { CALLOUT_BLOCK_TYPE } from './callout/callout.type'
export { CHECKLIST_BLOCK_TYPE } from './checklist/checklist.type'
export { CODE_BLOCK_TYPE } from './code/code.type'
export { COLUMN_BLOCK_TYPE } from './column/column.type'
export { COLUMN_LIST_BLOCK_TYPE } from './column-list/columnList.type'
export { DIVIDER_BLOCK_TYPE } from './divider/divider.type'
export { FILE_BLOCK_TYPE } from './file/file.type'
export { HEADING_BLOCK_TYPE } from './heading/heading.type'
export { IMAGE_BLOCK_TYPE } from './image/image.type'
export { LINK_BLOCK_TYPE } from './link/link.type'
export { NUMBERED_LIST_BLOCK_TYPE } from './numbered-list/numberedList.type'
export { PAGE_BLOCK_TYPE } from './page/page.type'
export { PARAGRAPH_BLOCK_TYPE } from './paragraph/paragraph.type'
export { QUOTE_BLOCK_TYPE } from './quote/quote.type'
export { ROOT_BLOCK_TYPE } from './root/root.type'
export { type BlockAlign, blockAlignSchema, resolveBlockAlign } from './shared/align'
export { TOC_BLOCK_TYPE } from './toc/toc.type'
export { TOGGLE_BLOCK_TYPE } from './toggle/toggle.type'
export type {
  BlockFromMarkdownContext,
  BlockLinkRef,
  BlockMapperContext,
  BlockToMarkdownContext,
  ContentBlockTypeModule,
  FromSduiBase,
  SduiBlockTypeModule,
  SduiLayoutLikeDocument,
  SduiLayoutLikeNode,
} from './types'

// Authoring builders — terse helpers for hand-writing documents (colocated per block folder).
export { nextBlockId, resetBlockIds } from './authoring/blockId'
export { bulletedList, type BulletedListBuilderOptions } from './bulleted-list/bulletedList.builder'
export { column, type ColumnBuilderOptions } from './column/column.builder'
export { columnList, type ColumnListBuilderOptions } from './column-list/columnList.builder'
export { divider, type DividerBuilderOptions } from './divider/divider.builder'
export { heading, type HeadingBuilderOptions } from './heading/heading.builder'
export { image, type ImageBuilderOptions } from './image/image.builder'
export { paragraph, type ParagraphBuilderOptions } from './paragraph/paragraph.builder'
