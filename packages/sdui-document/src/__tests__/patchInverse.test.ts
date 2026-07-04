import {
  applyDocumentPatches,
  applyDocumentPatchesWithInverse,
  applyDocumentPatchWithInverse,
  applyPatchToDocumentWithInverse,
  createDocumentBlock,
  findBlockById,
  type SduiDocument,
  type SduiDocumentContent,
  type SduiDocumentPatch,
} from '../index'

/**
 * Fixture tree:
 *
 * root
 * ├── para-1     text-mode "First"
 * ├── para-2     content-mode "Second"
 * └── group-1    children: [nested-1, nested-2]
 */
function createContent(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({ id: 'para-1', type: 'document.paragraph', state: { text: 'First' } }),
        createDocumentBlock({
          id: 'para-2',
          type: 'document.paragraph',
          state: { content: [{ type: 'text', text: 'Second' }], text: 'Second' },
        }),
        createDocumentBlock({
          id: 'group-1',
          type: 'document.callout',
          state: { text: 'Group' },
          children: [
            createDocumentBlock({ id: 'nested-1', type: 'document.paragraph', state: { text: 'n1' } }),
            createDocumentBlock({ id: 'nested-2', type: 'document.paragraph', state: { text: 'n2' } }),
          ],
        }),
      ],
    }),
  }
}

function expectRoundTrip(patch: SduiDocumentPatch): void {
  const original = createContent()
  const { content: next, inverse } = applyDocumentPatchWithInverse(original, patch)
  const restored = applyDocumentPatches(next, inverse)

  expect(restored).toEqual(original)
}

describe('applyDocumentPatchWithInverse', () => {
  describe('as is: block.insert applied', () => {
    describe('when its inverse patches are applied', () => {
      it('to be: content restored to the original', () => {
        expectRoundTrip({
          type: 'block.insert',
          parentId: 'root',
          index: 1,
          block: createDocumentBlock({ id: 'new-1', type: 'document.paragraph', state: { text: 'New' } }),
        })
      })
    })
  })

  describe('as is: block.delete applied to a subtree', () => {
    describe('when its inverse patches are applied', () => {
      it('to be: subtree restored at the original parent and index', () => {
        expectRoundTrip({ type: 'block.delete', blockId: 'group-1' })
      })
    })
  })

  describe('as is: block.update applied', () => {
    describe('when updating an existing key (EP: overwrite partition)', () => {
      it('to be: inverse restores the previous value', () => {
        expectRoundTrip({ type: 'block.update', blockId: 'para-1', state: { text: 'Changed' } })
      })
    })

    describe('when adding a key that did not exist (EP: add partition)', () => {
      it('to be: inverse removes the added key', () => {
        expectRoundTrip({
          type: 'block.update',
          blockId: 'para-1',
          state: { checked: true },
          attributes: { placeholder: 'Type here' },
        })
      })
    })
  })

  describe('as is: block.move applied', () => {
    describe('when moving across parents', () => {
      it('to be: inverse moves the block back to the original position', () => {
        expectRoundTrip({ type: 'block.move', blockId: 'para-1', parentId: 'group-1', index: 1 })
      })
    })

    describe('when reordering within the same parent (BVA: first index -> last index)', () => {
      it('to be: inverse restores the original order', () => {
        expectRoundTrip({ type: 'block.move', blockId: 'para-1', parentId: 'root', index: 2 })
      })
    })
  })

  describe('as is: block.split applied', () => {
    describe('when its inverse patches are applied', () => {
      it('to be: halves merged back into the original block', () => {
        expectRoundTrip({ type: 'block.split', blockId: 'para-2', offset: 3, newBlockId: 'para-2b' })
      })
    })
  })

  describe('as is: block.merge applied to a block with children', () => {
    describe('when its inverse patches are applied', () => {
      it('to be: merged block, its content boundary, and its children fully restored', () => {
        expectRoundTrip({ type: 'block.merge', blockId: 'group-1', intoBlockId: 'para-2' })
      })
    })
  })
})

describe('applyDocumentPatchesWithInverse', () => {
  describe('as is: a sequence of dependent patches', () => {
    describe('when the combined inverse is applied', () => {
      it('to be: content restored to the original', () => {
        const original = createContent()
        const patches: SduiDocumentPatch[] = [
          { type: 'block.split', blockId: 'para-2', offset: 3, newBlockId: 'para-2b' },
          { type: 'block.move', blockId: 'para-2b', parentId: 'group-1', index: 0 },
          { type: 'block.update', blockId: 'para-1', state: { text: 'Edited' } },
        ]

        const { content: next, inverse } = applyDocumentPatchesWithInverse(original, patches)

        expect(findBlockById(next, 'para-2b')).toBeDefined()
        expect(applyDocumentPatches(next, inverse)).toEqual(original)
      })
    })
  })
})

describe('applyPatchToDocumentWithInverse', () => {
  const baseDocument: SduiDocument = {
    id: 'doc-1',
    workspaceId: 'ws-1',
    title: 'Original title',
    state: 'draft',
    content: createContent(),
    version: 1,
    createdAt: '2026-07-04T00:00:00.000Z',
    updatedAt: '2026-07-04T00:00:00.000Z',
  }

  describe('as is: document.setTitle applied', () => {
    describe('when its inverse is applied', () => {
      it('to be: previous title restored', () => {
        const { document: next, inverse } = applyPatchToDocumentWithInverse(baseDocument, {
          type: 'document.setTitle',
          title: 'New title',
        })

        expect(next.title).toBe('New title')
        expect(inverse).toEqual([{ type: 'document.setTitle', title: 'Original title' }])
      })
    })
  })

  describe('as is: block patch applied through the document wrapper', () => {
    describe('when its inverse is applied', () => {
      it('to be: document content restored', () => {
        const { document: next, inverse } = applyPatchToDocumentWithInverse(baseDocument, {
          type: 'block.update',
          blockId: 'para-1',
          state: { text: 'Changed' },
        })

        expect(findBlockById(next.content, 'para-1')?.state?.text).toBe('Changed')

        const restored = inverse.reduce((doc, patch) => applyPatchToDocumentWithInverse(doc, patch).document, next)
        expect(restored.content).toEqual(baseDocument.content)
      })
    })
  })
})

describe('expectedVersion field', () => {
  describe('as is: a patch carrying expectedVersion (transport metadata, not yet validated)', () => {
    describe('when the patch is applied', () => {
      it('to be: applies normally and round-trips', () => {
        const original = createContent()
        const { content: next, inverse } = applyDocumentPatchWithInverse(original, {
          type: 'block.update',
          blockId: 'para-1',
          state: { text: 'Versioned edit' },
          expectedVersion: 7,
        })

        expect(findBlockById(next, 'para-1')?.state?.text).toBe('Versioned edit')
        expect(applyDocumentPatches(next, inverse)).toEqual(original)
      })
    })
  })
})
