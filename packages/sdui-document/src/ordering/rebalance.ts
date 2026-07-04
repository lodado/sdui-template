import type { SduiDocumentBlock } from '../blocks/schema/block'
import type { SduiDocumentContent } from '../blocks/schema/document'
import { generatePositions } from './generate'
import { sortBlocksByPosition } from './sortChildren'

function findBlock(block: SduiDocumentBlock, blockId: string): SduiDocumentBlock | undefined {
  if (block.id === blockId) {
    return block
  }

  return (block.children ?? [])
    .map((child) => findBlock(child, blockId))
    .find((found): found is SduiDocumentBlock => Boolean(found))
}

function copyPathTo(node: SduiDocumentBlock, blockId: string): SduiDocumentBlock | null {
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

/**
 * Reassigns evenly-spaced position keys for one parent's children, preserving order.
 */
export function rebalanceChildren(content: SduiDocumentContent, parentId: string): SduiDocumentContent {
  const parent = findBlock(content.root, parentId)
  if (!parent?.children || parent.children.length === 0) {
    return content
  }

  const sorted = sortBlocksByPosition(parent.children)
  const positions = generatePositions(null, null, sorted.length)
  const rebalanced = sorted.map((child, index) => ({ ...child, position: positions[index] }))

  const freshRoot: SduiDocumentBlock = {
    ...content.root,
    ...(content.root.children ? { children: [...content.root.children] } : {}),
  }

  const copiedParent = copyPathTo(freshRoot, parentId)
  if (!copiedParent) {
    return content
  }

  const parentInTree = findBlock(copiedParent, parentId)
  if (parentInTree) {
    parentInTree.children = rebalanced
  }

  return { ...content, root: copiedParent }
}
