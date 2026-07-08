import type { SduiDocumentBlock, SduiDocumentContent } from '../schema'

export function collectBlockIds(block: SduiDocumentBlock, ids: Set<string>): void {
  ids.add(block.id)
  block.children?.forEach((child) => collectBlockIds(child, ids))
}

export function findBlock(block: SduiDocumentBlock, blockId: string): SduiDocumentBlock | undefined {
  if (block.id === blockId) {
    return block
  }

  return (block.children ?? [])
    .map((child) => findBlock(child, blockId))
    .find((found): found is SduiDocumentBlock => Boolean(found))
}

export function findParent(
  block: SduiDocumentBlock,
  blockId: string,
): { parent: SduiDocumentBlock; index: number } | undefined {
  const childIndex = block.children?.findIndex((child) => child.id === blockId) ?? -1
  if (childIndex >= 0) {
    return { parent: block, index: childIndex }
  }

  return (block.children ?? [])
    .map((child) => findParent(child, blockId))
    .find((found): found is { parent: SduiDocumentBlock; index: number } => Boolean(found))
}

export function findBlockById(content: SduiDocumentContent, blockId: string): SduiDocumentBlock | undefined {
  return findBlock(content.root, blockId)
}

/**
 * Copies only the ancestor chain from `node` down to `blockId` (path-copy);
 * every subtree off that path keeps its original reference.
 *
 * Safe because the mutation helpers never mutate arrays/objects in place —
 * they always assign fresh `children`/`state` values — so shared subtrees can
 * never be corrupted through the copy.
 *
 * @returns the copied node, or null when blockId is not in this subtree
 */
export function copyPathTo(node: SduiDocumentBlock, blockId: string): SduiDocumentBlock | null {
  if (node.id === blockId) {
    return { ...node }
  }

  const children = node.children ?? []
  const index = children.findIndex((child) => Boolean(findBlock(child, blockId)))
  if (index < 0) {
    return null
  }

  const copiedChild = copyPathTo(children[index], blockId)
  if (!copiedChild) {
    return null
  }

  const nextChildren = [...children]
  nextChildren[index] = copiedChild

  return { ...node, children: nextChildren }
}
