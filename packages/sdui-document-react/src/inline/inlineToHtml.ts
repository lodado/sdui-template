import type { SduiInlineContent, SduiInlineMark, SduiInlineNode } from '@lodado/sdui-document'

/**
 * Serialize inline content to the HTML the focused-block ProseMirror schema
 * parses back (each tag matches a mark's `toDOM`). Used for the `text/html`
 * clipboard flavor so a cross-block copy round-trips marks + hard breaks when
 * pasted into a focused block (PM handles `text/html` natively).
 *
 * Text and attribute values are escaped — clipboard content is a trust boundary.
 */

const escapeHtml = (value: string): string => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const escapeAttr = (value: string): string => escapeHtml(value).replace(/"/g, '&quot;')

const wrapWithMark = (inner: string, mark: SduiInlineMark): string => {
  switch (mark.type) {
    case 'bold':
      return `<strong>${inner}</strong>`
    case 'italic':
      return `<em>${inner}</em>`
    case 'strikethrough':
      return `<del>${inner}</del>`
    case 'underline':
      return `<u>${inner}</u>`
    case 'code':
      return `<code class="inline">${inner}</code>`
    case 'link':
      return `<a href="${escapeAttr(mark.attrs.href)}">${inner}</a>`
    case 'highlight':
      return `<mark data-color="${escapeAttr(mark.attrs.color)}">${inner}</mark>`
    case 'color':
      return `<span data-text-color="${escapeAttr(mark.attrs.color)}" style="color: ${escapeAttr(
        mark.attrs.color,
      )}">${inner}</span>`
    default:
      return inner
  }
}

const nodeToHtml = (node: SduiInlineNode): string => {
  if (node.type === 'hard_break') {
    return '<br>'
  }
  if (node.type === 'date') {
    return escapeHtml(node.display ?? node.iso)
  }
  // Marks nest outward from the text: first mark ends up innermost.
  return (node.marks ?? []).reduce((html, mark) => wrapWithMark(html, mark), escapeHtml(node.text))
}

export const inlineToHtml = (content: SduiInlineContent): string => content.map(nodeToHtml).join('')
