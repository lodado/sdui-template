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

describe('resolution grades', () => {
  it('reports exact when the after anchor resolves directly', () => {
    const parent = createParent()
    expect(resolvePositionBounds(parent, { after: 'a' }).resolution).toBe('exact')
  })

  it('reports exact for explicit prepend and append', () => {
    const parent = createParent()
    expect(resolvePositionBounds(parent, { after: null }).resolution).toBe('exact')
    expect(resolvePositionBounds(parent, { before: null }).resolution).toBe('exact')
  })

  it('reports fallback when resolved through fallbackAfter', () => {
    const parent = createParent()
    const bounds = resolvePositionBounds(parent, { after: 'missing', fallbackAfter: ['a'] })

    expect(bounds.resolution).toBe('fallback')
  })

  it('reports degraded when every anchor is dead', () => {
    const parent = createParent()
    const bounds = resolvePositionBounds(parent, { after: 'missing', fallbackAfter: ['gone'] })

    expect(bounds.resolution).toBe('degraded')
  })
})

describe('fallbackBefore', () => {
  it('places the block before the first surviving fallbackBefore anchor', () => {
    const parent = createParent()
    const bounds = resolvePositionBounds(parent, { before: 'missing', fallbackBefore: ['also-gone', 'b'] })

    expect(bounds.afterKey).toBe(parent.children?.[0].position ?? null)
    expect(bounds.beforeKey).toBe(parent.children?.[1].position ?? null)
    expect(bounds.resolution).toBe('fallback')
  })

  it('tries fallbackBefore when after and fallbackAfter are all dead', () => {
    const parent = createParent()
    const bounds = resolvePositionBounds(parent, {
      after: 'missing',
      fallbackAfter: ['gone'],
      fallbackBefore: ['c'],
    })

    expect(bounds.afterKey).toBe(parent.children?.[1].position ?? null)
    expect(bounds.beforeKey).toBe(parent.children?.[2].position ?? null)
    expect(bounds.resolution).toBe('fallback')
  })
})

describe('position hints (tombstones)', () => {
  it('re-inserts at the dead after anchor’s old slot using a hint', () => {
    const parent = createParent()
    const bPosition = parent.children?.[1].position as string
    const withoutB = { ...parent, children: parent.children?.filter((child) => child.id !== 'b') }
    const hints = new Map([['b', { parentId: 'root', position: bPosition }]])

    const bounds = resolvePositionBounds(withoutB, { after: 'b' }, hints)

    expect(bounds.afterKey).toBe(bPosition)
    expect(bounds.beforeKey).toBe(parent.children?.[2].position ?? null)
    expect(bounds.resolution).toBe('fallback')
  })

  it('re-inserts at the dead before anchor’s old slot using a hint', () => {
    const parent = createParent()
    const bPosition = parent.children?.[1].position as string
    const withoutB = { ...parent, children: parent.children?.filter((child) => child.id !== 'b') }
    const hints = new Map([['b', { parentId: 'root', position: bPosition }]])

    const bounds = resolvePositionBounds(withoutB, { before: 'b' }, hints)

    expect(bounds.afterKey).toBe(parent.children?.[0].position ?? null)
    expect(bounds.beforeKey).toBe(bPosition)
    expect(bounds.resolution).toBe('fallback')
  })

  it('ignores hints recorded for a different parent', () => {
    const parent = createParent()
    const bPosition = parent.children?.[1].position as string
    const withoutB = { ...parent, children: parent.children?.filter((child) => child.id !== 'b') }
    const hints = new Map([['b', { parentId: 'other-parent', position: bPosition }]])

    const bounds = resolvePositionBounds(withoutB, { after: 'b' }, hints)

    expect(bounds.resolution).toBe('degraded')
  })
})
