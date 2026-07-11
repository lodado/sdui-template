import {
  applyDocumentPatch,
  applyDocumentPatches,
  applyDocumentPatchesWithReport,
  createDocumentBlock,
} from '../../index'
import { StaleAnchorError } from '../patch/errors'
import { anchorAfterBlock } from '../patch/patchAnchors'

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

  it('keeps position when the anchor and every preceding sibling were deleted (fallbackBefore)', () => {
    const content = {
      schemaVersion: '1.0' as const,
      root: createDocumentBlock({
        id: 'root',
        type: 'document.root',
        children: [
          createDocumentBlock({ id: 'a', type: 'document.paragraph' }),
          createDocumentBlock({ id: 'b', type: 'document.paragraph' }),
          createDocumentBlock({ id: 'c', type: 'document.paragraph' }),
          createDocumentBlock({ id: 'd', type: 'document.paragraph' }),
        ],
      }),
    }

    // captured while a and b were still alive
    const anchor = anchorAfterBlock(content, 'root', 'b')

    const withoutLeftSide = applyDocumentPatches(content, [
      { type: 'block.delete', blockId: 'a' },
      { type: 'block.delete', blockId: 'b' },
    ])

    const replayed = applyDocumentPatch(withoutLeftSide, {
      type: 'block.insert',
      parentId: 'root',
      ...anchor,
      block: createDocumentBlock({ id: 'x', type: 'document.paragraph' }),
    })

    expect(replayed.root.children?.map((block) => block.id)).toEqual(['x', 'c', 'd'])
  })
})

describe('degraded anchor reporting', () => {
  const makeContent = () => ({
    schemaVersion: '1.0' as const,
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [createDocumentBlock({ id: 'a', type: 'document.paragraph' })],
    }),
  })

  it('reports patches whose anchors were unrecoverable', () => {
    const result = applyDocumentPatchesWithReport(makeContent(), [
      {
        type: 'block.insert',
        parentId: 'root',
        after: 'ghost',
        block: createDocumentBlock({ id: 'x', type: 'document.paragraph' }),
      },
    ])

    expect(result.content.root.children?.map((block) => block.id)).toEqual(['a', 'x'])
    expect(result.degraded).toEqual([{ patchIndex: 0, blockId: 'x', parentId: 'root' }])
  })

  it('does not report inserts that resolved exactly or via fallback', () => {
    const result = applyDocumentPatchesWithReport(makeContent(), [
      {
        type: 'block.insert',
        parentId: 'root',
        after: 'a',
        block: createDocumentBlock({ id: 'x', type: 'document.paragraph' }),
      },
      {
        type: 'block.insert',
        parentId: 'root',
        after: 'ghost',
        fallbackAfter: ['a'],
        block: createDocumentBlock({ id: 'y', type: 'document.paragraph' }),
      },
    ])

    expect(result.degraded).toEqual([])
  })

  it('throws StaleAnchorError instead of appending when onAnchorMiss is throw', () => {
    expect(() =>
      applyDocumentPatchesWithReport(
        makeContent(),
        [
          {
            type: 'block.insert',
            parentId: 'root',
            after: 'ghost',
            block: createDocumentBlock({ id: 'x', type: 'document.paragraph' }),
          },
        ],
        { onAnchorMiss: 'throw' },
      ),
    ).toThrow(StaleAnchorError)
  })
})
