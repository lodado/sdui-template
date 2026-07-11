import { migrateToFractionalPositions } from '../../ordering'
import { createDocumentBlock } from '../schema'
import { anchorAfterBlock, anchorBeforeBlock } from './patchAnchors'

function makeContent() {
  return migrateToFractionalPositions({
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({ id: 'a', type: 'document.paragraph' }),
        createDocumentBlock({ id: 'b', type: 'document.paragraph' }),
        createDocumentBlock({ id: 'c', type: 'document.paragraph' }),
        createDocumentBlock({ id: 'd', type: 'document.paragraph' }),
        createDocumentBlock({ id: 'e', type: 'document.paragraph' }),
      ],
    }),
  })
}

describe('anchorAfterBlock', () => {
  it('captures up to 3 preceding siblings as fallbackAfter, nearest first', () => {
    const anchor = anchorAfterBlock(makeContent(), 'root', 'e')

    expect(anchor.after).toBe('e')
    expect(anchor.fallbackAfter).toEqual(['d', 'c', 'b'])
  })

  it('captures following siblings as fallbackBefore, nearest first', () => {
    const anchor = anchorAfterBlock(makeContent(), 'root', 'b')

    expect(anchor.fallbackAfter).toEqual(['a'])
    expect(anchor.fallbackBefore).toEqual(['c', 'd', 'e'])
  })

  it('omits fallbacks that do not exist', () => {
    const anchor = anchorAfterBlock(makeContent(), 'root', 'a')

    expect(anchor.fallbackAfter).toBeUndefined()
    expect(anchor.fallbackBefore).toEqual(['b', 'c', 'd'])
  })
})

describe('anchorBeforeBlock', () => {
  it('captures both directions around the target', () => {
    const anchor = anchorBeforeBlock(makeContent(), 'root', 'c')

    expect(anchor.before).toBe('c')
    expect(anchor.fallbackBefore).toEqual(['d', 'e'])
    expect(anchor.fallbackAfter).toEqual(['b', 'a'])
  })
})
