import type { SduiDocumentBlock, SduiDocumentContent, SduiDocumentPatch } from '../../schema'
import { copyPathTo } from './traverse'

/** Block ids whose ancestor chains a patch mutates (see the operations). */
export function touchedBlockIds(patch: SduiDocumentPatch): string[] {
  switch (patch.type) {
    case 'block.insert':
      return [patch.parentId]
    case 'block.update':
      return [patch.blockId]
    case 'block.delete':
      return [patch.blockId]
    case 'block.move':
      return [patch.blockId, patch.parentId]
    case 'block.split':
      return [patch.blockId]
    case 'block.merge':
      return [patch.blockId, patch.intoBlockId]
    case 'block.setType':
      return [patch.blockId]
    default:
      return []
  }
}

/**
 * Structural-sharing clone: the root is always a fresh object (immutability
 * contract), but only the paths a patch touches are copied — untouched
 * subtrees keep their references, so memoized React rows can bail out.
 */
export function cloneTouchedPaths(content: SduiDocumentContent, blockIds: string[]): SduiDocumentContent {
  const freshRoot: SduiDocumentBlock = {
    ...content.root,
    ...(content.root.children ? { children: [...content.root.children] } : {}),
  }

  const root = blockIds.reduce<SduiDocumentBlock>(
    (currentRoot, blockId) => copyPathTo(currentRoot, blockId) ?? currentRoot,
    freshRoot,
  )

  return { ...content, root }
}
