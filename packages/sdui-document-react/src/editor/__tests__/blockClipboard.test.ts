import type { SduiDocumentBlock } from '@lodado/sdui-document'

import { blocksToMarkdown } from '../blockClipboard'

const block = (partial: Partial<SduiDocumentBlock> & { id: string; type: string }): SduiDocumentBlock =>
  partial as SduiDocumentBlock

describe('blocksToMarkdown', () => {
  test('serializes a heading + paragraph selection to markdown', () => {
    const md = blocksToMarkdown([
      block({ id: 'a', type: 'document.heading', attributes: { level: 1 }, state: { text: 'Title' } }),
      block({ id: 'b', type: 'document.paragraph', state: { text: 'Body' } }),
    ])
    expect(md).toContain('# Title')
    expect(md).toContain('Body')
  })

  test('empty selection serializes to an empty string', () => {
    expect(blocksToMarkdown([])).toBe('')
  })
})
