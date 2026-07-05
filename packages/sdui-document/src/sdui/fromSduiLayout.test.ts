import { createDocumentBlock, fromSduiLayoutDocument, type SduiDocumentContent, toSduiLayoutDocument } from '../index'

const content: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'root',
    type: 'document.root',
    children: [
      createDocumentBlock({ id: 'p1', type: 'document.paragraph', state: { text: 'Hello world' } }),
      createDocumentBlock({ id: 'h1', type: 'document.heading', state: { text: 'My Title', level: 1 } }),
      createDocumentBlock({ id: 'h2', type: 'document.heading', state: { text: 'Sub Title', level: 2 } }),
      createDocumentBlock({ id: 'h3', type: 'document.heading', state: { text: 'Small', level: 3 } }),
      createDocumentBlock({
        id: 'check-on',
        type: 'document.checklist',
        state: { text: 'Done item', checked: true },
      }),
      createDocumentBlock({
        id: 'check-off',
        type: 'document.checklist',
        state: { text: 'Todo item', checked: false },
      }),
      createDocumentBlock({ id: 'div', type: 'document.divider' }),
      createDocumentBlock({
        id: 'callout',
        type: 'document.callout',
        state: { text: 'Note text' },
        attributes: { tone: 'warning' },
      }),
      createDocumentBlock({
        id: 'link',
        type: 'document.link',
        state: { text: 'Click me' },
        attributes: { href: 'https://example.com' },
      }),
      createDocumentBlock({
        id: 'img',
        type: 'document.image',
        state: { text: 'Alt text' },
        attributes: { src: '/img.png' },
      }),
      createDocumentBlock({
        id: 'file',
        type: 'document.file',
        state: { text: 'doc.pdf' },
        attributes: { size: '100 KB' },
      }),
    ],
  }),
}

function roundTrip(c: SduiDocumentContent): SduiDocumentContent {
  return fromSduiLayoutDocument(toSduiLayoutDocument(c))
}

describe('fromSduiLayoutDocument round-trip', () => {
  it('preserves schemaVersion and root id/type', () => {
    const result = roundTrip(content)
    expect(result.schemaVersion).toBe('1.1')
    expect(result.root.id).toBe('root')
    expect(result.root.type).toBe('document.root')
    expect(result.root.children).toHaveLength(11)
  })

  it('reconstructs paragraph text', () => {
    const result = roundTrip(content)
    expect(result.root.children?.[0]).toMatchObject({
      id: 'p1',
      type: 'document.paragraph',
      state: { text: 'Hello world' },
    })
  })

  it('reconstructs heading text and level for all levels', () => {
    const result = roundTrip(content)
    expect(result.root.children?.[1]).toMatchObject({
      id: 'h1',
      type: 'document.heading',
      state: { text: 'My Title', level: 1 },
    })
    expect(result.root.children?.[2]).toMatchObject({
      id: 'h2',
      type: 'document.heading',
      state: { text: 'Sub Title', level: 2 },
    })
    expect(result.root.children?.[3]).toMatchObject({
      id: 'h3',
      type: 'document.heading',
      state: { text: 'Small', level: 3 },
    })
  })

  it('reconstructs checklist text and checked state', () => {
    const result = roundTrip(content)
    expect(result.root.children?.[4]).toMatchObject({
      id: 'check-on',
      type: 'document.checklist',
      state: { text: 'Done item', checked: true },
    })
    expect(result.root.children?.[5]).toMatchObject({
      id: 'check-off',
      type: 'document.checklist',
      state: { text: 'Todo item', checked: false },
    })
  })

  it('reconstructs divider', () => {
    const result = roundTrip(content)
    expect(result.root.children?.[6]).toMatchObject({ id: 'div', type: 'document.divider' })
  })

  it('reconstructs callout text and tone attribute', () => {
    const result = roundTrip(content)
    expect(result.root.children?.[7]).toMatchObject({
      id: 'callout',
      type: 'document.callout',
      state: { text: 'Note text' },
      attributes: { tone: 'warning' },
    })
  })

  it('reconstructs link text and href (strips rel)', () => {
    const result = roundTrip(content)
    const link = result.root.children?.[8]
    expect(link).toMatchObject({
      id: 'link',
      type: 'document.link',
      state: { text: 'Click me' },
      attributes: { href: 'https://example.com' },
    })
    expect(link?.attributes?.rel).toBeUndefined()
  })

  it('reconstructs image text and src attribute', () => {
    const result = roundTrip(content)
    expect(result.root.children?.[9]).toMatchObject({
      id: 'img',
      type: 'document.image',
      state: { text: 'Alt text' },
      attributes: { src: '/img.png' },
    })
  })

  it('reconstructs file text and size attribute', () => {
    const result = roundTrip(content)
    expect(result.root.children?.[10]).toMatchObject({
      id: 'file',
      type: 'document.file',
      state: { text: 'doc.pdf' },
      attributes: { size: '100 KB' },
    })
  })

  it('does not include className in reconstructed block attributes', () => {
    const result = roundTrip(content)
    result.root.children?.forEach((child) => {
      expect(child.attributes?.className).toBeUndefined()
    })
  })
})
