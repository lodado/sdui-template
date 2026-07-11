import type { AnchorPositionHints } from '../../ordering'
import type { SduiDocumentBlock, SduiDocumentContent } from '../schema'
import { copyPathTo, findBlock, findParent } from '../traverse'

export type BlockParentRef = { parent: SduiDocumentBlock; index: number }

export type ScopeAnchorOptions = {
  onAnchorMiss: 'append' | 'throw'
  positionHints?: AnchorPositionHints
}

export type ScopeDegradedAnchor = { blockId: string; parentId: string }

/**
 * Copy-on-write scope for one patch application.
 *
 * Reads (`root`, `block`, `parentOf`) go straight to the working tree. Writes go
 * through `ensure`/`writable*`, which path-copies root→target on first touch so
 * every mutation lands on a fresh node and never reaches the caller's original
 * `content`. Untouched subtrees keep their references (memoized React rows bail
 * out); the fresh root satisfies the immutability contract even for a no-op.
 *
 * The copy set is driven by what each operation actually writes — not a
 * hand-maintained id manifest — so an operation can no longer desync a parallel
 * list and silently mutate the input. For multi-write operations, `ensure` all
 * target paths before mutating, so a later copy can never re-clone (and discard
 * the mutation on) a node an earlier write already touched.
 *
 * The scope also carries anchor policy for the one patch it applies:
 * `anchorOptions` feeds `resolvePositionBounds`, and operations record every
 * degraded (tail-appended) placement via `reportDegradedAnchor` so callers can
 * surface it instead of silently committing a wrong order.
 */
export type PatchWriteScope = {
  readonly rootId: string
  readonly anchorOptions: ScopeAnchorOptions
  root(): SduiDocumentBlock
  ensure(blockId: string): void
  block(blockId: string): SduiDocumentBlock | undefined
  parentOf(blockId: string): BlockParentRef | undefined
  writableBlock(blockId: string): SduiDocumentBlock | undefined
  writableParentOf(blockId: string): BlockParentRef | undefined
  content(): SduiDocumentContent
  reportDegradedAnchor(report: ScopeDegradedAnchor): void
  degradedAnchors(): ScopeDegradedAnchor[]
}

export function createPatchWriteScope(
  content: SduiDocumentContent,
  options?: { onAnchorMiss?: 'append' | 'throw'; positionHints?: AnchorPositionHints },
): PatchWriteScope {
  // Root is always a fresh object with a fresh children array (immutability
  // contract), even for a no-op patch.
  let root: SduiDocumentBlock = {
    ...content.root,
    ...(content.root.children ? { children: [...content.root.children] } : {}),
  }

  const degraded: ScopeDegradedAnchor[] = []

  const ensure = (blockId: string): void => {
    root = copyPathTo(root, blockId) ?? root
  }

  return {
    rootId: content.root.id,
    anchorOptions: {
      onAnchorMiss: options?.onAnchorMiss ?? 'append',
      positionHints: options?.positionHints,
    },
    root: () => root,
    ensure,
    block: (blockId) => findBlock(root, blockId),
    parentOf: (blockId) => findParent(root, blockId),
    writableBlock: (blockId) => {
      ensure(blockId)
      return findBlock(root, blockId)
    },
    writableParentOf: (blockId) => {
      ensure(blockId)
      return findParent(root, blockId)
    },
    content: () => ({ ...content, root }),
    reportDegradedAnchor: (report) => {
      degraded.push(report)
    },
    degradedAnchors: () => [...degraded],
  }
}
