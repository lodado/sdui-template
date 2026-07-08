import type { SduiDocumentBlock } from '../blocks/schema/block'
import type { SduiDocumentContent } from '../blocks/schema/document'
import { copyPathTo, findBlock } from '../blocks/traverse'
import { generatePositions } from './generate'
import { sortBlocksByPosition } from './sortChildren'

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
