import type { SduiDocumentBlock } from '../blocks/schema/block'
import { createBlockId } from '../blocks/schema/ids'
import { blockModuleByType } from './index'
import { createDefaultParagraph } from './paragraph/paragraph.default'

/**
 * Freshly-inserted block for the block menu / '+' button.
 * Per-type defaults live in each block's `<name>.default.ts` and are exposed
 * via `module.createDefault`. Unknown types fall back to the paragraph default,
 * matching the old switch `default` case.
 */
export function createDefaultBlock(
  type: SduiDocumentBlock['type'],
  id: string,
  attributes?: Record<string, unknown>,
): SduiDocumentBlock {
  const blockId = createBlockId(id)
  const createDefault = blockModuleByType[type]?.createDefault ?? createDefaultParagraph
  return createDefault(blockId, attributes)
}
