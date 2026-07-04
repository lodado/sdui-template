/**
 * DOM <-> inline-offset mapping for text drag-and-drop.
 *
 * Inline offsets follow the document model convention: one unit per text
 * character, one unit per hard_break (<br>). Mark wrappers (<strong>, <em>,
 * spans…) contribute no offset of their own, so walking every text node and
 * <br> under an inline root in document order reproduces the model offsets —
 * for both the static InlineContentView DOM and the focused ProseMirror DOM.
 */

/** Marks the element whose subtree IS a block's inline content. */
export const INLINE_ROOT_ATTRIBUTE = 'data-inline-root'

function isBreakElement(node: Node): boolean {
  return node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === 'BR'
}

/**
 * Counts inline offset units strictly before `stop` in document order under
 * `root`; with `stop` undefined, returns the total length of the root.
 */
function countOffsetUpTo(root: Element, stop?: Node): number {
  // eslint-disable-next-line no-bitwise -- NodeFilter whatToShow is a DOM bitmask API
  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT)
  let total = 0
  let current = walker.nextNode()
  while (current) {
    if (current === stop) {
      return total
    }

    if (current.nodeType === Node.TEXT_NODE) {
      total += current.textContent?.length ?? 0
    } else if (isBreakElement(current)) {
      total += 1
    }

    current = walker.nextNode()
  }

  return total
}

function nextNodeInDocumentOrder(root: Element, node: Node): Node | undefined {
  let current: Node | null = node
  while (current && current !== root) {
    if (current.nextSibling) {
      return current.nextSibling
    }

    current = current.parentNode
  }

  return undefined
}

/**
 * Maps a DOM position (Selection/caret API convention: node + offset) to an
 * inline content offset within `root`.
 *
 * @returns null when the node is not inside the root
 */
export function inlineOffsetFromDomPosition(root: Element, node: Node, offset: number): number | null {
  if (!root.contains(node)) {
    return null
  }

  if (node.nodeType === Node.TEXT_NODE) {
    const length = node.textContent?.length ?? 0

    return countOffsetUpTo(root, node) + Math.min(Math.max(offset, 0), length)
  }

  // element position: offset is a child index; the boundary sits before that child
  const boundary = node.childNodes[offset]
  if (boundary) {
    return countOffsetUpTo(root, boundary)
  }

  // past the last child: everything inside `node` counts, nothing after it
  const afterNode = node === root ? undefined : nextNodeInDocumentOrder(root, node)

  return countOffsetUpTo(root, afterNode)
}

export type CaretDomPosition = {
  node: Node
  offset: number
}

type CaretPositionLike = { offsetNode: Node; offset: number }
type DocumentWithCaretApis = Document & {
  caretPositionFromPoint?(x: number, y: number): CaretPositionLike | null
  caretRangeFromPoint?(x: number, y: number): Range | null
}

/**
 * Resolves the caret DOM position under a viewport point via whichever caret
 * API the browser implements (caretPositionFromPoint / caretRangeFromPoint).
 */
export function resolveCaretFromPoint(doc: Document, x: number, y: number): CaretDomPosition | null {
  const caretDoc = doc as DocumentWithCaretApis
  if (typeof caretDoc.caretPositionFromPoint === 'function') {
    const position = caretDoc.caretPositionFromPoint(x, y)

    return position ? { node: position.offsetNode, offset: position.offset } : null
  }

  if (typeof caretDoc.caretRangeFromPoint === 'function') {
    const range = caretDoc.caretRangeFromPoint(x, y)

    return range ? { node: range.startContainer, offset: range.startOffset } : null
  }

  return null
}

export type DropCaretRect = {
  left: number
  top: number
  height: number
}

const FALLBACK_CARET_HEIGHT = 18

/** Viewport rect of the caret at a DOM position, for painting a drop caret. */
export function caretRectAtDomPosition(position: CaretDomPosition, fallbackElement: Element): DropCaretRect {
  const doc = position.node.ownerDocument
  if (doc) {
    const maxOffset =
      position.node.nodeType === Node.TEXT_NODE
        ? position.node.textContent?.length ?? 0
        : position.node.childNodes.length
    const range = doc.createRange()
    range.setStart(position.node, Math.min(position.offset, maxOffset))
    range.collapse(true)
    const rect = range.getClientRects()[0] ?? range.getBoundingClientRect()
    if (rect && (rect.height > 0 || rect.top !== 0 || rect.left !== 0)) {
      return { left: rect.left, top: rect.top, height: rect.height || FALLBACK_CARET_HEIGHT }
    }
  }

  const elementRect = fallbackElement.getBoundingClientRect()

  return { left: elementRect.left, top: elementRect.top, height: elementRect.height || FALLBACK_CARET_HEIGHT }
}
