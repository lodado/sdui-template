import { createDefaultBlock } from '../createDefaultBlock'

describe('createDefaultBlock', () => {
  test('paragraph gets empty inline state', () => {
    const block = createDefaultBlock('document.paragraph', 'b1')
    expect(block).toEqual({ id: 'b1', type: 'document.paragraph', state: { content: [], text: '' } })
  })

  test('heading keeps provided level attribute', () => {
    const block = createDefaultBlock('document.heading', 'b2', { level: 2 })
    expect(block.attributes).toEqual({ level: 2 })
    expect(block.state).toEqual({ content: [], text: '' })
  })

  test('checklist defaults to unchecked', () => {
    const block = createDefaultBlock('document.checklist', 'b3')
    expect(block.attributes).toEqual({ checked: false })
  })

  test('checklist caller attributes win over defaults', () => {
    const block = createDefaultBlock('document.checklist', 'b3', { checked: true })
    expect(block.attributes).toEqual({ checked: true })
  })

  test('divider has no state', () => {
    const block = createDefaultBlock('document.divider', 'b4')
    expect(block).toEqual({ id: 'b4', type: 'document.divider' })
  })

  test('image/file/link get empty text state and passthrough attributes', () => {
    const image = createDefaultBlock('document.image', 'b5', { alt: 'photo.png' })
    expect(image).toEqual({ id: 'b5', type: 'document.image', state: { text: '' }, attributes: { alt: 'photo.png' } })
    const link = createDefaultBlock('document.link', 'b6', { url: 'https://a.b' })
    expect(link.attributes).toEqual({ url: 'https://a.b' })
  })
})
