import { assertNever, type SduiDocumentPatch } from '../blocks/schema'

/** Block id → last acknowledged version. Absent entries mean version 0. */
export type BlockVersionMap = Record<string, number>

export type BlockVersionConflict = {
  blockId: string
  expectedVersion: number
  currentVersion: number
}

export type DetectVersionConflictsInput = {
  versions: BlockVersionMap
  patches: SduiDocumentPatch[]
}

function patchTargetBlockId(patch: SduiDocumentPatch): string | undefined {
  switch (patch.type) {
    case 'block.update':
    case 'block.delete':
    case 'block.move':
    case 'block.split':
    case 'block.merge':
      return patch.blockId
    // block.insert targets a not-yet-versioned block; document.setTitle has no
    // block target; block.setType is intentionally excluded from conflict
    // detection today (surfaced explicitly — revisit if setType needs versioning).
    case 'block.insert':
    case 'block.setType':
    case 'document.setTitle':
      return undefined
    default:
      return assertNever(patch, 'patchTargetBlockId')
  }
}

/**
 * Realtime R1: detects concurrent edits on the same block.
 *
 * Policies:
 * - only patches carrying `expectedVersion` are validated (opt-in)
 * - a block absent from the map has implicit version 0
 * - detection only — merging/rebase is out of scope (R3)
 */
export function detectVersionConflicts(input: DetectVersionConflictsInput): BlockVersionConflict[] {
  const { versions, patches } = input

  return patches.reduce<BlockVersionConflict[]>((conflicts, patch) => {
    const targetId = patchTargetBlockId(patch)
    if (targetId === undefined || patch.expectedVersion === undefined) {
      return conflicts
    }

    const currentVersion = versions[targetId] ?? 0
    if (currentVersion === patch.expectedVersion) {
      return conflicts
    }

    return [...conflicts, { blockId: targetId, expectedVersion: patch.expectedVersion, currentVersion }]
  }, [])
}

/**
 * Advances block versions after patches are accepted.
 *
 * Policies:
 * - update/move/split bump the target; split/insert give new blocks version 1
 * - delete/merge remove the dead block's entry; merge bumps the merge target
 * - document.setTitle does not touch block versions
 */
export function bumpBlockVersions(versions: BlockVersionMap, patches: SduiDocumentPatch[]): BlockVersionMap {
  return patches.reduce<BlockVersionMap>(
    (next, patch) => {
      switch (patch.type) {
        case 'block.insert':
          return { ...next, [patch.block.id]: 1 }
        case 'block.update':
        case 'block.move':
          return { ...next, [patch.blockId]: (next[patch.blockId] ?? 0) + 1 }
        case 'block.split':
          return {
            ...next,
            [patch.blockId]: (next[patch.blockId] ?? 0) + 1,
            [patch.newBlockId]: 1,
          }
        case 'block.delete': {
          const { [patch.blockId]: removed, ...rest } = next

          return rest
        }
        case 'block.merge': {
          const { [patch.blockId]: removed, ...rest } = next

          return { ...rest, [patch.intoBlockId]: (rest[patch.intoBlockId] ?? 0) + 1 }
        }
        // block.setType does not bump versions today; document.setTitle has no
        // block target. Both surfaced explicitly rather than swallowed.
        case 'block.setType':
        case 'document.setTitle':
          return next
        default:
          return assertNever(patch, 'bumpBlockVersions')
      }
    },
    { ...versions },
  )
}
