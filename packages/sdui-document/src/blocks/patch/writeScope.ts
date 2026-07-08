import type { SduiDocumentBlock, SduiDocumentContent } from '../schema'
import { copyPathTo, findBlock, findParent } from '../traverse'

export type BlockParentRef = { parent: SduiDocumentBlock; index: number }

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
 */
export type PatchWriteScope = {
  readonly rootId: string
  root(): SduiDocumentBlock
  ensure(blockId: string): void
  block(blockId: string): SduiDocumentBlock | undefined
  parentOf(blockId: string): BlockParentRef | undefined
  writableBlock(blockId: string): SduiDocumentBlock | undefined
  writableParentOf(blockId: string): BlockParentRef | undefined
  content(): SduiDocumentContent
}

export function createPatchWriteScope(content: SduiDocumentContent): PatchWriteScope {
  // Root is always a fresh object with a fresh children array (immutability
  // contract), even for a no-op patch.
  let root: SduiDocumentBlock = {
    ...content.root,
    ...(content.root.children ? { children: [...content.root.children] } : {}),
  }

  const ensure = (blockId: string): void => {
    root = copyPathTo(root, blockId) ?? root
  }

  return {
    rootId: content.root.id,
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
  }
}
