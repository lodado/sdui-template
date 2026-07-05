import type { SduiInlineContent } from '@lodado/sdui-document'

import { updateLinkMark } from '../updateLinkMark'

function content(): SduiInlineContent {
  return [
    { type: 'text', text: 'see ' },
    { type: 'text', text: 'here', marks: [{ type: 'link', attrs: { href: 'https://a.com' } }] },
    { type: 'text', text: ' and ' },
    { type: 'text', text: 'there', marks: [{ type: 'link', attrs: { href: 'https://b.com' } }] },
  ]
}

describe('updateLinkMark', () => {
  test('replaces the href of a matching link mark', () => {
    const next = updateLinkMark(content(), 'https://a.com', 'https://z.com')
    expect(next[1].type === 'text' && next[1].marks?.[0]).toEqual({ type: 'link', attrs: { href: 'https://z.com' } })
    // non-matching link left alone
    expect(next[3].type === 'text' && next[3].marks?.[0]).toEqual({ type: 'link', attrs: { href: 'https://b.com' } })
  })

  test('removing strips the link mark and drops the empty marks array', () => {
    const next = updateLinkMark(content(), 'https://a.com', null)
    expect(next[1]).toEqual({ type: 'text', text: 'here' })
  })

  test('preserves sibling marks when removing a link', () => {
    const withBold: SduiInlineContent = [
      {
        type: 'text',
        text: 'x',
        marks: [{ type: 'bold' }, { type: 'link', attrs: { href: 'https://a.com' } }],
      },
    ]
    const next = updateLinkMark(withBold, 'https://a.com', null)
    expect(next[0].type === 'text' && next[0].marks).toEqual([{ type: 'bold' }])
  })

  test('updates every text node sharing the same href', () => {
    const split: SduiInlineContent = [
      { type: 'text', text: 'a', marks: [{ type: 'link', attrs: { href: 'https://a.com' } }] },
      { type: 'text', text: 'b', marks: [{ type: 'bold' }, { type: 'link', attrs: { href: 'https://a.com' } }] },
    ]
    const next = updateLinkMark(split, 'https://a.com', 'https://z.com')
    expect(next[0].type === 'text' && next[0].marks).toEqual([{ type: 'link', attrs: { href: 'https://z.com' } }])
    expect(next[1].type === 'text' && next[1].marks).toEqual([
      { type: 'bold' },
      { type: 'link', attrs: { href: 'https://z.com' } },
    ])
  })

  test('non-matching href leaves content unchanged by value', () => {
    const original = content()
    const next = updateLinkMark(original, 'https://missing.com', 'https://z.com')
    expect(next).toEqual(original)
  })
})
