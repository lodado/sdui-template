import { createDocumentBlock } from '../../blocks/schema'
import { createBlockId } from '../../blocks/schema/ids'
import { BULLETED_LIST_BLOCK_TYPE, bulletedListBlockModule } from '../bulleted-list/bulletedList'
import { NUMBERED_LIST_BLOCK_TYPE, numberedListBlockModule } from '../numbered-list/numberedList'
import type { BlockToMarkdownContext } from '../types'

const mdCtx = (childrenMd = ''): BlockToMarkdownContext => ({
  inline: (block) => (typeof block.state?.text === 'string' ? block.state.text : ''),
  renderChildren: () => childrenMd,
})

describe('bulletedListBlockModule', () => {
  test('type constant and default block', () => {
    expect(BULLETED_LIST_BLOCK_TYPE).toBe('document.bulleted-list')
    const block = bulletedListBlockModule.createDefault?.(createBlockId('b1'))
    expect(block).toEqual({
      id: 'b1',
      type: 'document.bulleted-list',
      state: { content: [], text: '' },
    })
  })

  test('toMarkdown renders "- text" and indents children by two spaces', () => {
    const block = createDocumentBlock({ id: 'b1', type: BULLETED_LIST_BLOCK_TYPE, state: { text: 'hello' } })
    expect(bulletedListBlockModule.toMarkdown?.(block, mdCtx())).toBe('- hello')
    expect(bulletedListBlockModule.toMarkdown?.(block, mdCtx('- nested'))).toBe('- hello\n  - nested')
  })

  test('toSduiNode / fromSduiNode round-trip preserves type and text', () => {
    const block = createDocumentBlock({ id: 'b1', type: BULLETED_LIST_BLOCK_TYPE, state: { text: 'hi' } })
    const node = bulletedListBlockModule.toSduiNode(block, {
      theme: { paragraph: 'p' } as never,
      mapChildren: () => undefined,
    })
    expect(node.attributes?.['data-block-type']).toBe('document.bulleted-list')
    const back = bulletedListBlockModule.fromSduiNode(node, { id: createBlockId('b1') })
    expect(back.type).toBe('document.bulleted-list')
    expect(back.state?.text).toBe('hi')
  })
})

describe('numberedListBlockModule', () => {
  test('type constant and default block', () => {
    expect(NUMBERED_LIST_BLOCK_TYPE).toBe('document.numbered-list')
    const block = numberedListBlockModule.createDefault?.(createBlockId('n1'))
    expect(block).toEqual({ id: 'n1', type: 'document.numbered-list', state: { content: [], text: '' } })
  })

  test('toMarkdown always writes "1." (renderers renumber) and indents children', () => {
    const block = createDocumentBlock({ id: 'n1', type: NUMBERED_LIST_BLOCK_TYPE, state: { text: 'first' } })
    expect(numberedListBlockModule.toMarkdown?.(block, mdCtx())).toBe('1. first')
    expect(numberedListBlockModule.toMarkdown?.(block, mdCtx('1. sub'))).toBe('1. first\n  1. sub')
  })
})
