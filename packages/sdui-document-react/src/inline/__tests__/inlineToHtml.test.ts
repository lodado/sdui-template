import type { SduiInlineContent } from '@lodado/sdui-document'

import { inlineToHtml } from '../inlineToHtml'

describe('inlineToHtml', () => {
  it('wraps marked text in the tags the PM schema parses back', () => {
    const content: SduiInlineContent = [
      { type: 'text', text: 'rst', marks: [{ type: 'bold' }] },
      { type: 'hard_break' },
      { type: 'text', text: 'Sec' },
    ]

    expect(inlineToHtml(content)).toBe('<strong>rst</strong><br>Sec')
  })

  it('nests multiple marks and serializes attr-bearing marks', () => {
    const content: SduiInlineContent = [
      { type: 'text', text: 'x', marks: [{ type: 'bold' }, { type: 'italic' }] },
      { type: 'text', text: 'y', marks: [{ type: 'link', attrs: { href: 'https://a.io' } }] },
    ]

    expect(inlineToHtml(content)).toBe('<em><strong>x</strong></em><a href="https://a.io">y</a>')
  })

  it('escapes text and attribute values (clipboard is untrusted)', () => {
    const content: SduiInlineContent = [
      { type: 'text', text: '<script>&"' },
      { type: 'text', text: 'z', marks: [{ type: 'link', attrs: { href: 'https://a.io/?a=1&b="x"' } }] },
    ]

    expect(inlineToHtml(content)).toBe('&lt;script&gt;&amp;"<a href="https://a.io/?a=1&amp;b=&quot;x&quot;">z</a>')
  })
})
