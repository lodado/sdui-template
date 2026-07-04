// packages/sdui-document/src/block-types/index.ts
import { calloutBlockModule } from './callout/callout'
import { checklistBlockModule } from './checklist/checklist'
import { dividerBlockModule } from './divider/divider'
import { fileBlockModule } from './file/file'
import { headingBlockModule } from './heading/heading'
import { imageBlockModule } from './image/image'
import { linkBlockModule } from './link/link'
import { paragraphBlockModule } from './paragraph/paragraph'
import { rootBlockModule } from './root/root'
import type { SduiBlockTypeModule } from './types'

/**
 * Block-type registry — drives both SDUI layout mapping directions.
 * Unknown types fall back to paragraphBlockModule (old switch defaults).
 * NOTE: when adding a block type, also extend SduiDocumentBlockType in
 * blocks/schema/block.ts and the literal list in blocks/schema/validate.ts.
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

export { paragraphBlockModule }
export type {
  BlockMapperContext,
  FromSduiBase,
  SduiBlockTypeModule,
  SduiLayoutLikeDocument,
  SduiLayoutLikeNode,
} from './types'
