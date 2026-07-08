import { ensureFractionalContent } from '../../ordering'
import type { SduiDocumentContent, SduiDocumentPatch } from '../schema'
import { assertNever } from '../schema'
import {
  deleteBlock,
  insertBlockAtAnchor,
  mergeBlock,
  moveBlockAtAnchor,
  setBlockType,
  splitBlock,
  updateBlock,
} from './operations'
import { createPatchWriteScope } from './writeScope'

export function applyDocumentPatch(content: SduiDocumentContent, patch: SduiDocumentPatch): SduiDocumentContent {
  const scope = createPatchWriteScope(ensureFractionalContent(content))

  switch (patch.type) {
    case 'block.insert':
      insertBlockAtAnchor(
        scope,
        patch.parentId,
        patch.block,
        { after: patch.after, before: patch.before, fallbackAfter: patch.fallbackAfter },
        patch.origin,
      )
      return scope.content()
    case 'block.update':
      updateBlock(scope, patch.blockId, patch.state, patch.attributes)
      return scope.content()
    case 'block.delete':
      deleteBlock(scope, patch.blockId)
      return scope.content()
    case 'block.move':
      moveBlockAtAnchor(
        scope,
        patch.blockId,
        patch.parentId,
        { after: patch.after, before: patch.before, fallbackAfter: patch.fallbackAfter },
        patch.origin,
      )
      return scope.content()
    case 'block.split':
      splitBlock(scope, patch.blockId, patch.offset, patch.newBlockId)
      return scope.content()
    case 'block.merge':
      mergeBlock(scope, patch.blockId, patch.intoBlockId)
      return scope.content()
    case 'block.setType':
      setBlockType(scope, patch.blockId, patch.blockType, patch.attributes)
      return scope.content()
    case 'document.setTitle':
      // Title lives on the document, not the content tree. Collaboration replays
      // mixed batches (title + block edits) through this content-level pipeline,
      // so setTitle is an intentional no-op here — applyPatchToDocument owns it.
      return scope.content()
    default:
      return assertNever(patch, 'applyDocumentPatch')
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
