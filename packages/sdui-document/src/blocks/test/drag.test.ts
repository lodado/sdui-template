import {
  applyDocumentPatch,
  createDocumentBlock,
  createNestedBlockMovePatch,
  flattenDocumentBlocks,
  isBlockDragDisabled,
  type SduiDocumentContent,
} from '../../index'

function createContent(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({ id: 'a', type: 'document.paragraph', state: { text: 'A' } }),
        createDocumentBlock({
          id: 'b',
          type: 'document.callout',
          state: { text: 'B' },
          children: [
            createDocumentBlock({ id: 'b1', type: 'document.paragraph', state: { text: 'B1' } }),
            createDocumentBlock({ id: 'b2', type: 'document.paragraph', state: { text: 'B2' } }),
          ],
        }),
        createDocumentBlock({ id: 'c', type: 'document.paragraph', state: { text: 'C' } }),
      ],
    }),
  }
}

describe('nested block drag helpers', () => {
  it('flattens nested blocks with depth and parent metadata', () => {
    expect(flattenDocumentBlocks(createContent())).toEqual([
      { id: 'root', parentId: undefined, depth: 0, index: 0 },
      { id: 'a', parentId: 'root', depth: 1, index: 0 },
      { id: 'b', parentId: 'root', depth: 1, index: 1 },
      { id: 'b1', parentId: 'b', depth: 2, index: 0 },
      { id: 'b2', parentId: 'b', depth: 2, index: 1 },
      { id: 'c', parentId: 'root', depth: 1, index: 2 },
    ])
  })

  it('creates a move patch for dropping before a nested block', () => {
    const patch = createNestedBlockMovePatch({
      content: createContent(),
      activeId: 'c',
      overId: 'b2',
      position: 'before',
    })

    expect(patch).toEqual({ type: 'block.move', blockId: 'c', parentId: 'b', before: 'b2' })
  })

  it('creates a move patch for dropping inside a block (first-child slot, where the indicator points)', () => {
    const patch = createNestedBlockMovePatch({
      content: createContent(),
      activeId: 'a',
      overId: 'b',
      position: 'inside',
    })

    const moved = applyDocumentPatch(createContent(), patch)

    expect(moved.root.children?.map((block) => block.id)).toEqual(['b', 'c'])
    expect(moved.root.children?.[0].children?.map((block) => block.id)).toEqual(['a', 'b1', 'b2'])
  })

  it('adjusts same-parent after drops when source was before target', () => {
    const patch = createNestedBlockMovePatch({
      content: createContent(),
      activeId: 'b1',
      overId: 'b2',
      position: 'after',
    })

    expect(patch).toEqual({ type: 'block.move', blockId: 'b1', parentId: 'b', after: 'b2' })
  })

  it('rejects root dragging and disabled drag options', () => {
    expect(isBlockDragDisabled({ blockId: 'root', rootId: 'root', dragDropEnabled: true })).toBe(true)
    expect(isBlockDragDisabled({ blockId: 'a', rootId: 'root', dragDropEnabled: false })).toBe(true)
    expect(isBlockDragDisabled({ blockId: 'a', rootId: 'root', dragDropEnabled: true })).toBe(false)
  })
})
