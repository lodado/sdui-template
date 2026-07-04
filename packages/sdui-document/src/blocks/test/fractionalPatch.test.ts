import { applyDocumentPatch, createDocumentBlock } from '../../index'

describe('fractional anchor patches', () => {
  it('keeps deterministic order for two inserts after the same anchor', () => {
    const content = {
      schemaVersion: '1.0' as const,
      root: createDocumentBlock({
        id: 'root',
        type: 'document.root',
        children: [createDocumentBlock({ id: 'a', type: 'document.paragraph' })],
      }),
    }

    const first = applyDocumentPatch(content, {
      type: 'block.insert',
      parentId: 'root',
      after: 'a',
      block: createDocumentBlock({ id: 'b', type: 'document.paragraph' }),
      origin: { clientId: 'client-a', opId: '1' },
    })

    const second = applyDocumentPatch(first, {
      type: 'block.insert',
      parentId: 'root',
      after: 'a',
      block: createDocumentBlock({ id: 'c', type: 'document.paragraph' }),
      origin: { clientId: 'client-b', opId: '1' },
    })

    expect(second.root.children?.map((block) => block.id)).toEqual(['a', 'c', 'b'])
  })
})
