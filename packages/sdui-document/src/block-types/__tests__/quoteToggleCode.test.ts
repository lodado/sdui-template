import type { Tokens } from 'marked'

import { createDocumentBlock } from '../../blocks/schema'
import { createBlockId } from '../../blocks/schema/ids'
import { CODE_BLOCK_TYPE, codeBlockModule } from '../code/code'
import { codeFromMarkdown } from '../code/code.markdown'
import { QUOTE_BLOCK_TYPE, quoteBlockModule } from '../quote/quote'
import { TOGGLE_BLOCK_TYPE, toggleBlockModule } from '../toggle/toggle'
import type { BlockFromMarkdownContext, BlockToMarkdownContext } from '../types'

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

describe('codeBlockModule', () => {
  test('default block has empty text and no language', () => {
    const block = codeBlockModule.createDefault?.(createBlockId('c1'))
    expect(block).toEqual({ id: 'c1', type: 'document.code', state: { content: [], text: '' } })
  })

  test('toMarkdown emits a fenced block with language', () => {
    const block = createDocumentBlock({
      id: 'c1',
      type: CODE_BLOCK_TYPE,
      state: { text: 'const a = 1\nconst b = 2' },
      attributes: { language: 'typescript' },
    })
    expect(codeBlockModule.toMarkdown?.(block, mdCtx())).toBe('```typescript\nconst a = 1\nconst b = 2\n```')
  })

  test('codeFromMarkdown converts newlines to hard_break inline nodes', () => {
    const ctx: BlockFromMarkdownContext = {
      blockId: (hint) => createBlockId(`md-${hint}-1`),
      onUnsupported: 'degrade',
      inline: () => [],
      textState: (content) => ({ content, text: '' }),
      mapTokens: () => [],
    }
    const token = { type: 'code', text: 'a\nb', lang: 'js' } as Tokens.Code
    const block = codeFromMarkdown(token, ctx)
    expect(block.type).toBe('document.code')
    expect(block.attributes).toEqual({ language: 'js' })
    expect(block.state?.content).toEqual([
      { type: 'text', text: 'a' },
      { type: 'hard_break' },
      { type: 'text', text: 'b' },
    ])
    expect(block.state?.text).toBe('a\nb')
  })
})
