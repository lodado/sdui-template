import { DOMParser as PmDOMParser } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'

import { insertLineBreaksBetweenBlocks, multilineTextToSlice } from '../pm/clipboard'
import { focusedBlockSchema } from '../pm/schema'
import { pmDocToInlineContent } from '../pm/serialization'

function sliceToInline(text: string) {
  const slice = multilineTextToSlice(text)
  const doc = focusedBlockSchema.nodes.doc.create(null, slice.content)

  return pmDocToInlineContent(doc)
}

/**
 * Parses + inserts pasted HTML the way PM does: DOMParser.parseSlice maps
 * unknown block elements onto nested doc nodes, and it is replaceSelection's
 * fitting step that flattens them into the inline-only doc — the harness must
 * run both or it diverges from the real paste path.
 */
function pastedHtmlToInline(html: string) {
  const container = document.createElement('div')
  container.innerHTML = insertLineBreaksBetweenBlocks(html)
  const slice = PmDOMParser.fromSchema(focusedBlockSchema).parseSlice(container)
  const state = EditorState.create({ schema: focusedBlockSchema })
  const transaction = state.tr.replaceSelection(slice)

  return pmDocToInlineContent(transaction.doc)
}

describe('multilineTextToSlice', () => {
  it('turns newlines into hard_break nodes between text lines', () => {
    expect(sliceToInline('rst\nSec')).toEqual([
      { type: 'text', text: 'rst' },
      { type: 'hard_break' },
      { type: 'text', text: 'Sec' },
    ])
  })

  it('keeps consecutive newlines as consecutive breaks (empty lines)', () => {
    expect(sliceToInline('a\n\nb')).toEqual([
      { type: 'text', text: 'a' },
      { type: 'hard_break' },
      { type: 'hard_break' },
      { type: 'text', text: 'b' },
    ])
  })

  it('normalizes CRLF', () => {
    expect(sliceToInline('a\r\nb')).toEqual([
      { type: 'text', text: 'a' },
      { type: 'hard_break' },
      { type: 'text', text: 'b' },
    ])
  })

  it('handles single-line text as one text node', () => {
    expect(sliceToInline('plain')).toEqual([{ type: 'text', text: 'plain' }])
  })
})

describe('insertLineBreaksBetweenBlocks + PM parse (mark preservation)', () => {
  it('keeps marks across a block boundary while adding a hard_break', () => {
    expect(pastedHtmlToInline('<p><strong>rst</strong></p><p>Sec</p>')).toEqual([
      { type: 'text', text: 'rst', marks: [{ type: 'bold' }] },
      { type: 'hard_break' },
      { type: 'text', text: 'Sec' },
    ])
  })

  it('adds exactly one break for nested block wrappers', () => {
    expect(pastedHtmlToInline('<div><p>a</p></div><div><p>b</p></div>')).toEqual([
      { type: 'text', text: 'a' },
      { type: 'hard_break' },
      { type: 'text', text: 'b' },
    ])
  })

  it('leaves single-block html untouched (no stray breaks)', () => {
    expect(pastedHtmlToInline('<p>only <em>one</em></p>')).toEqual([
      { type: 'text', text: 'only ' },
      { type: 'text', text: 'one', marks: [{ type: 'italic' }] },
    ])
  })

  it('handles heading/list boundaries too', () => {
    expect(pastedHtmlToInline('<h1>title</h1><ul><li>item</li></ul>')).toEqual([
      { type: 'text', text: 'title' },
      { type: 'hard_break' },
      { type: 'text', text: 'item' },
    ])
  })
})
