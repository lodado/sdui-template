import { ensureFractionalContent } from '../../../ordering'
import type { SduiDocumentContent, SduiDocumentPatch } from '../../schema'
import {
  deleteBlock,
  insertBlockAtAnchor,
  mergeBlock,
  moveBlockAtAnchor,
  setBlockType,
  splitBlock,
  updateBlock,
} from './operations'
import { cloneTouchedPaths, touchedBlockIds } from './structuralSharing'

export function applyDocumentPatch(content: SduiDocumentContent, patch: SduiDocumentPatch): SduiDocumentContent {
  const migrated = ensureFractionalContent(content)
  const next = cloneTouchedPaths(migrated, touchedBlockIds(patch))

  switch (patch.type) {
    case 'block.insert':
      insertBlockAtAnchor(
        next,
        patch.parentId,
        patch.block,
        { after: patch.after, before: patch.before, fallbackAfter: patch.fallbackAfter },
        patch.origin,
      )
      return next
    case 'block.update':
      updateBlock(next, patch.blockId, patch.state, patch.attributes)
      return next
    case 'block.delete':
      deleteBlock(next, patch.blockId)
      return next
    case 'block.move':
      moveBlockAtAnchor(
        next,
        patch.blockId,
        patch.parentId,
        { after: patch.after, before: patch.before, fallbackAfter: patch.fallbackAfter },
        patch.origin,
      )
      return next
    case 'block.split':
      splitBlock(next, patch.blockId, patch.offset, patch.newBlockId)
      return next
    case 'block.merge':
      mergeBlock(next, patch.blockId, patch.intoBlockId)
      return next
    case 'block.setType':
      setBlockType(next, patch.blockId, patch.blockType, patch.attributes)
      return next
    default:
      return next
  }
}

export function applyDocumentPatches(content: SduiDocumentContent, patches: SduiDocumentPatch[]): SduiDocumentContent {
  return patches.reduce(applyDocumentPatch, content)
}

export type ApplyDocumentPatchResult = {
  content: SduiDocumentContent
  /** Patches that undo the applied patch when applied in array order. */
  inverse: SduiDocumentPatch[]
}
