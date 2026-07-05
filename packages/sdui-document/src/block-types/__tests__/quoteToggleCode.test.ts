import { createDocumentBlock } from '../../blocks/schema'
import { createBlockId } from '../../blocks/schema/ids'
import { QUOTE_BLOCK_TYPE, quoteBlockModule } from '../quote/quote'
import { TOGGLE_BLOCK_TYPE, toggleBlockModule } from '../toggle/toggle'
import type { BlockToMarkdownContext } from '../types'

const mdCtx = (childrenMd = ''): BlockToMarkdownContext => ({
  inline: (block) => (typeof block.state?.text === 'string' ? block.state.text : ''),
  renderChildren: () => childrenMd,
})

describe('quoteBlockModule', () => {
  test('type constant and default block', () => {
    expect(QUOTE_BLOCK_TYPE).toBe('document.quote')
    const block = quoteBlockModule.createDefault?.(createBlockId('q1'))
    expect(block).toEqual({ id: 'q1', type: 'document.quote', state: { content: [], text: '' } })
  })

  test('toMarkdown prefixes every line with "> "', () => {
    const block = createDocumentBlock({ id: 'q1', type: QUOTE_BLOCK_TYPE, state: { text: 'wise words' } })
    expect(quoteBlockModule.toMarkdown?.(block, mdCtx())).toBe('> wise words')
    expect(quoteBlockModule.toMarkdown?.(block, mdCtx('child line'))).toBe('> wise words\n>\n> child line')
  })
})

describe('toggleBlockModule', () => {
  test('default block starts expanded', () => {
    const block = toggleBlockModule.createDefault?.(createBlockId('t1'))
    expect(block).toEqual({
      id: 't1',
      type: 'document.toggle',
      state: { content: [], text: '' },
      attributes: { collapsed: false },
    })
  })

  test('toMarkdown degrades to a bulleted item with indented children', () => {
    const block = createDocumentBlock({ id: 't1', type: TOGGLE_BLOCK_TYPE, state: { text: 'summary' } })
    expect(toggleBlockModule.toMarkdown?.(block, mdCtx('hidden detail'))).toBe('- summary\n  hidden detail')
  })
})
