import { inlineOffsetFromDomPosition } from '../domInlineOffsets'

function buildRoot(html: string): HTMLElement {
  const root = document.createElement('span')
  root.setAttribute('data-inline-root', '')
  root.innerHTML = html
  document.body.appendChild(root)

  return root
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('inlineOffsetFromDomPosition', () => {
  it('maps an offset inside a plain text node', () => {
    const root = buildRoot('Hello world')
    const textNode = root.firstChild!

    expect(inlineOffsetFromDomPosition(root, textNode, 0)).toBe(0)
    expect(inlineOffsetFromDomPosition(root, textNode, 5)).toBe(5)
  })

  it('accumulates text across mark wrappers', () => {
    const root = buildRoot('<strong>Hello</strong><em> wor</em>ld')
    const lastText = root.lastChild!

    expect(inlineOffsetFromDomPosition(root, lastText, 2)).toBe(11)

    const emText = root.children[1].firstChild!
    expect(inlineOffsetFromDomPosition(root, emText, 1)).toBe(6)
  })

  it('counts <br> as one offset unit', () => {
    const root = buildRoot('ab<br>cd')
    const tail = root.lastChild!

    expect(inlineOffsetFromDomPosition(root, tail, 1)).toBe(4)
  })

  it('resolves element positions to child boundaries', () => {
    const root = buildRoot('<strong>ab</strong><br>cd')

    expect(inlineOffsetFromDomPosition(root, root, 0)).toBe(0)
    expect(inlineOffsetFromDomPosition(root, root, 2)).toBe(3)
    expect(inlineOffsetFromDomPosition(root, root, 3)).toBe(5)
  })

  it('returns null for nodes outside the root', () => {
    const root = buildRoot('abc')
    const outside = document.createElement('div')
    outside.textContent = 'x'
    document.body.appendChild(outside)

    expect(inlineOffsetFromDomPosition(root, outside.firstChild!, 0)).toBeNull()
  })
})
