import { createDocumentBlock } from '../blocks/schema'
import { migrateToFractionalPositions } from './migrate'
import { resolvePositionBounds } from './resolveAnchor'

function createParent() {
  return migrateToFractionalPositions({
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({ id: 'a', type: 'document.paragraph' }),
        createDocumentBlock({ id: 'b', type: 'document.paragraph' }),
        createDocumentBlock({ id: 'c', type: 'document.paragraph' }),
      ],
    }),
  }).root
}

describe('resolvePositionBounds', () => {
  it('resolves prepend with after: null', () => {
    const parent = createParent()
    const bounds = resolvePositionBounds(parent, { after: null })
    expect(bounds.afterKey).toBeNull()
    expect(bounds.beforeKey).toBe(parent.children?.[0].position ?? null)
  })

  it('resolves append with before: null', () => {
    const parent = createParent()
    const bounds = resolvePositionBounds(parent, { before: null })
    expect(bounds.beforeKey).toBeNull()
    expect(bounds.afterKey).toBe(parent.children?.[2].position ?? null)
  })

  it('falls back through fallbackAfter when after anchor is missing', () => {
    const parent = createParent()
    const bounds = resolvePositionBounds(parent, {
      after: 'missing',
      fallbackAfter: ['a'],
    })

    expect(bounds.afterKey).toBe(parent.children?.[0].position ?? null)
    expect(bounds.beforeKey).toBe(parent.children?.[1].position ?? null)
  })

  it('defaults to parent tail when all anchors are missing', () => {
    const parent = createParent()
    const bounds = resolvePositionBounds(parent, { after: 'missing', fallbackAfter: ['gone'] })

    expect(bounds.afterKey).toBe(parent.children?.[2].position ?? null)
    expect(bounds.beforeKey).toBeNull()
  })
})
