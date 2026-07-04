import type { SduiInlineContent, SduiInlineMark, SduiInlineNode, SduiInlineTextNode } from '../schema/inline'
import { isInlineTextNode } from '../schema/inline'
import { InvalidInlineOffsetError } from './errors'

function cloneMark(mark: SduiInlineMark): SduiInlineMark {
  if (mark.type === 'link') {
    return { type: 'link', attrs: { ...mark.attrs } }
  }

  return { ...mark }
}

function cloneNode(node: SduiInlineNode): SduiInlineNode {
  if (isInlineTextNode(node)) {
    const cloned: SduiInlineTextNode = { type: 'text', text: node.text }
    if (node.marks) {
      cloned.marks = node.marks.map(cloneMark)
    }

    return cloned
  }

  return { type: 'hard_break' }
}

function nodeLength(node: SduiInlineNode): number {
  // hard_break occupies exactly 1 offset unit (PM leaf-node convention)
  return isInlineTextNode(node) ? node.text.length : 1
}

function marksEqual(a: SduiInlineMark[] = [], b: SduiInlineMark[] = []): boolean {
  if (a.length !== b.length) {
    return false
  }

  return a.every((mark, markIndex) => {
    const other = b[markIndex]
    if (mark.type !== other.type) {
      return false
    }

    if (mark.type === 'link' && other.type === 'link') {
      return mark.attrs.href === other.attrs.href
    }

    return true
  })
}

function normalizeInlineContent(nodes: SduiInlineNode[]): SduiInlineContent {
  return nodes.reduce<SduiInlineNode[]>((normalized, node) => {
    if (isInlineTextNode(node) && node.text.length === 0) {
      return normalized
    }

    const previous = normalized[normalized.length - 1]
    if (previous && isInlineTextNode(previous) && isInlineTextNode(node) && marksEqual(previous.marks, node.marks)) {
      return [...normalized.slice(0, -1), { ...previous, text: previous.text + node.text }]
    }

    return [...normalized, cloneNode(node)]
  }, [])
}

/**
 * Total offset length of inline content (text characters + 1 per hard_break).
 */
export function getInlineContentLength(content: SduiInlineContent): number {
  return content.reduce((total, node) => total + nodeLength(node), 0)
}

/**
 * Converts inline content to plain text; marks are stripped, hard_break becomes "\n".
 */
export function inlineContentToPlainText(content: SduiInlineContent): string {
  return content.map((node) => (isInlineTextNode(node) ? node.text : '\n')).join('')
}

/**
 * Wraps a plain string as inline content.
 *
 * @returns empty content for an empty string
 */
export function textToInlineContent(text: string): SduiInlineContent {
  if (text.length === 0) {
    return []
  }

  return [{ type: 'text', text }]
}

/**
 * Splits inline content at the given offset into two halves.
 *
 * @param offset - 0..length inclusive; a text node split in the middle keeps its marks on both halves
 * @returns [first half, second half]; a node sitting exactly on the boundary goes to the second half
 *
 * @throws InvalidInlineOffsetError when offset is out of range
 */
export function splitInlineContent(content: SduiInlineContent, offset: number): [SduiInlineContent, SduiInlineContent] {
  const length = getInlineContentLength(content)
  if (offset < 0 || offset > length) {
    throw new InvalidInlineOffsetError(offset, length)
  }

  const { left, right } = content.reduce<{ left: SduiInlineNode[]; right: SduiInlineNode[]; remaining: number }>(
    (acc, node) => {
      const size = nodeLength(node)

      if (acc.remaining <= 0) {
        return { ...acc, right: [...acc.right, cloneNode(node)] }
      }

      if (acc.remaining >= size) {
        return { ...acc, left: [...acc.left, cloneNode(node)], remaining: acc.remaining - size }
      }

      // 0 < remaining < size: only text nodes can be partially consumed
      const textNode = node as SduiInlineTextNode
      const leftHalf: SduiInlineTextNode = { type: 'text', text: textNode.text.slice(0, acc.remaining) }
      const rightHalf: SduiInlineTextNode = { type: 'text', text: textNode.text.slice(acc.remaining) }
      if (textNode.marks) {
        leftHalf.marks = textNode.marks.map(cloneMark)
        rightHalf.marks = textNode.marks.map(cloneMark)
      }

      return { left: [...acc.left, leftHalf], right: [...acc.right, rightHalf], remaining: 0 }
    },
    { left: [], right: [], remaining: offset },
  )

  return [normalizeInlineContent(left), normalizeInlineContent(right)]
}

/**
 * Concatenates two inline contents and normalizes the seam
 * (adjacent text nodes with identical marks are joined, empty text nodes dropped).
 */
export function mergeInlineContent(first: SduiInlineContent, second: SduiInlineContent): SduiInlineContent {
  return normalizeInlineContent([...first, ...second])
}
