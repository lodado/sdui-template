import { applyDocumentPatch, createDocumentBlock } from '../../index'

describe('offline replay with stale anchors', () => {
  it('appends when the after anchor was deleted but fallbackAfter is present', () => {
    const content = {
      schemaVersion: '1.0' as const,
      root: createDocumentBlock({
        id: 'root',
        type: 'document.root',
        children: [
          createDocumentBlock({ id: 'a', type: 'document.paragraph' }),
          createDocumentBlock({ id: 'b', type: 'document.paragraph' }),
        ],
      }),
    }

    const withoutAnchor = applyDocumentPatch(content, {
      type: 'block.delete',
      blockId: 'a',
    })

    const replayed = applyDocumentPatch(withoutAnchor, {
      type: 'block.insert',
      parentId: 'root',
      after: 'a',
      fallbackAfter: ['a'],
      block: createDocumentBlock({ id: 'c', type: 'document.paragraph' }),
    })

    expect(replayed.root.children?.map((block) => block.id)).toEqual(['b', 'c'])
  })
})
