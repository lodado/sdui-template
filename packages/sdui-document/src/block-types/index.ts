// packages/sdui-document/src/block-types/index.ts
import type { SduiDocumentBlock } from '../blocks/schema/block'
import { calloutBlockModule } from './callout/callout'
import { checklistBlockModule } from './checklist/checklist'
import { dividerBlockModule } from './divider/divider'
import { fileBlockModule } from './file/file'
import { headingBlockModule } from './heading/heading'
import { imageBlockModule } from './image/image'
import { linkBlockModule } from './link/link'
import { paragraphBlockModule } from './paragraph/paragraph'
import { rootBlockModule } from './root/root'
import type { BlockLinkRef, SduiBlockTypeModule } from './types'

/**
 * Block-type registry — the single source that drives SDUI mapping, defaults,
 * schema, markdown, and block capabilities. Unknown types fall back to
 * paragraphBlockModule (old switch defaults).
 * NOTE: when adding a block type, add its folder + `<name>.type.ts` constant to
 * the SduiDocumentBlockType union in blocks/schema/block.ts (the only central
 * edit — validation and capabilities derive from this registry automatically).
 */
export const BLOCK_TYPE_MODULES: readonly SduiBlockTypeModule[] = [
  rootBlockModule,
  paragraphBlockModule,
  headingBlockModule,
  checklistBlockModule,
  dividerBlockModule,
  calloutBlockModule,
  imageBlockModule,
  fileBlockModule,
  linkBlockModule,
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
export { CALLOUT_BLOCK_TYPE } from './callout/callout.type'
export { CHECKLIST_BLOCK_TYPE } from './checklist/checklist.type'
export { DIVIDER_BLOCK_TYPE } from './divider/divider.type'
export { FILE_BLOCK_TYPE } from './file/file.type'
export { HEADING_BLOCK_TYPE } from './heading/heading.type'
export { IMAGE_BLOCK_TYPE } from './image/image.type'
export { LINK_BLOCK_TYPE } from './link/link.type'
export { PARAGRAPH_BLOCK_TYPE } from './paragraph/paragraph.type'
export { ROOT_BLOCK_TYPE } from './root/root.type'
export type {
  BlockFromMarkdownContext,
  BlockLinkRef,
  BlockMapperContext,
  BlockToMarkdownContext,
  FromSduiBase,
  SduiBlockTypeModule,
  SduiLayoutLikeDocument,
  SduiLayoutLikeNode,
} from './types'
