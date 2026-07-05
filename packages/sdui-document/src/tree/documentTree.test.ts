import {
  archiveDocumentSubtree,
  createDocumentBlock,
  DocumentNotFoundError,
  getDocumentDescendantIds,
  InvalidDocumentDestinationError,
  moveDocument,
  moveDocumentWithInverse,
  restoreDocumentSubtree,
  type SduiDocument,
} from '../index'

const now = '2026-07-04T00:00:00.000Z'

function doc(input: Partial<SduiDocument> & Pick<SduiDocument, 'id' | 'title'>): SduiDocument {
  return {
    workspaceId: 'workspace-1',
    collectionId: 'collection-1',
    state: 'published',
    content: {
      schemaVersion: '1.0',
      root: createDocumentBlock({ id: `${input.id}-root`, type: 'document.root' }),
    },
    version: 1,
    createdAt: now,
    updatedAt: now,
    ...input,
  }
}

function createDocuments(): SduiDocument[] {
  return [
    doc({ id: 'a', title: 'A', sortIndex: 0 }),
    doc({ id: 'b', title: 'B', parentDocumentId: 'a', sortIndex: 0 }),
    doc({ id: 'c', title: 'C', parentDocumentId: 'b', sortIndex: 0 }),
    doc({ id: 'd', title: 'D', sortIndex: 1 }),
  ]
}

describe('document tree engine', () => {
  it('returns descendant ids in depth-first order', () => {
    expect(getDocumentDescendantIds(createDocuments(), 'a')).toEqual(['b', 'c'])
  })

  it('moves a document under another parent', () => {
    const result = moveDocument({
      documents: createDocuments(),
      documentId: 'd',
      targetParentDocumentId: 'a',
      targetIndex: 1,
    })

    expect(result.documents.find((document) => document.id === 'd')).toMatchObject({
      parentDocumentId: 'a',
      collectionId: 'collection-1',
      sortIndex: 1,
    })
    expect(result.events).toEqual([expect.objectContaining({ type: 'document.moved', documentId: 'd' })])
  })

  it('moves a subtree to another collection', () => {
    const result = moveDocument({
      documents: createDocuments(),
      documentId: 'a',
      targetCollectionId: 'collection-2',
      targetIndex: 0,
    })

    expect(result.documents.filter((document) => ['a', 'b', 'c'].includes(document.id))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'a', collectionId: 'collection-2', parentDocumentId: undefined }),
        expect.objectContaining({ id: 'b', collectionId: 'collection-2', parentDocumentId: 'a' }),
        expect.objectContaining({ id: 'c', collectionId: 'collection-2', parentDocumentId: 'b' }),
      ]),
    )
  })

  it('rejects moving a document below its descendant', () => {
    expect(() =>
      moveDocument({
        documents: createDocuments(),
        documentId: 'a',
        targetParentDocumentId: 'c',
      }),
    ).toThrow(InvalidDocumentDestinationError)
  })

  it('rejects missing source or parent documents', () => {
    expect(() =>
      moveDocument({
        documents: createDocuments(),
        documentId: 'missing',
      }),
    ).toThrow(DocumentNotFoundError)

    expect(() =>
      moveDocument({
        documents: createDocuments(),
        documentId: 'a',
        targetParentDocumentId: 'missing-parent',
      }),
    ).toThrow(DocumentNotFoundError)
  })

  describe('moveDocumentWithInverse', () => {
    const fixedNow = () => '2026-07-05T12:00:00.000Z'

    it('returns an inverse input that rolls the move back (parent + sortIndex + collection)', () => {
      const moved = moveDocumentWithInverse(
        {
          documents: createDocuments(),
          documentId: 'd',
          targetParentDocumentId: 'a',
          targetIndex: 5,
        },
        fixedNow,
      )

      expect(moved.documents.find((document) => document.id === 'd')).toMatchObject({
        parentDocumentId: 'a',
        sortIndex: 5,
      })
      expect(moved.inverse).toEqual({
        documentId: 'd',
        targetCollectionId: 'collection-1',
        targetParentDocumentId: undefined,
        targetIndex: 1,
      })

      const restored = moveDocument({ documents: moved.documents, ...moved.inverse }, fixedNow)
      expect(restored.documents.find((document) => document.id === 'd')).toMatchObject({
        parentDocumentId: undefined,
        collectionId: 'collection-1',
        sortIndex: 1,
      })
    })

    it('restores cascaded descendant collections on inverse (subtree collection move)', () => {
      const moved = moveDocumentWithInverse(
        {
          documents: createDocuments(),
          documentId: 'a',
          targetCollectionId: 'collection-2',
          targetIndex: 0,
        },
        fixedNow,
      )

      const restored = moveDocument({ documents: moved.documents, ...moved.inverse }, fixedNow)

      expect(restored.documents.filter((document) => ['a', 'b', 'c'].includes(document.id))).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'a', collectionId: 'collection-1', sortIndex: 0 }),
          expect.objectContaining({ id: 'b', collectionId: 'collection-1', parentDocumentId: 'a' }),
          expect.objectContaining({ id: 'c', collectionId: 'collection-1', parentDocumentId: 'b' }),
        ]),
      )
    })

    it('preserves an undefined sortIndex through the round-trip (BVA: absent index)', () => {
      const documents = [...createDocuments(), doc({ id: 'e', title: 'E' })]
      const moved = moveDocumentWithInverse(
        { documents, documentId: 'e', targetParentDocumentId: 'a', targetIndex: 2 },
        fixedNow,
      )

      expect(moved.inverse.targetIndex).toBeUndefined()

      const restored = moveDocument({ documents: moved.documents, ...moved.inverse }, fixedNow)
      expect(restored.documents.find((document) => document.id === 'e')).toMatchObject({
        parentDocumentId: undefined,
        sortIndex: undefined,
      })
    })

    it('replays deterministically: redo with the original input equals the first move', () => {
      const input = {
        documentId: 'd',
        targetParentDocumentId: 'a',
        targetIndex: 3,
      }

      const first = moveDocumentWithInverse({ documents: createDocuments(), ...input }, fixedNow)
      const undone = moveDocument({ documents: first.documents, ...first.inverse }, fixedNow)
      const redone = moveDocument({ documents: undone.documents, ...input }, fixedNow)

      expect(redone.documents).toEqual(first.documents)
    })

    it('stamps updatedAt from the injected clock', () => {
      const moved = moveDocumentWithInverse(
        { documents: createDocuments(), documentId: 'd', targetParentDocumentId: 'a' },
        fixedNow,
      )

      expect(moved.documents.find((document) => document.id === 'd')?.updatedAt).toBe('2026-07-05T12:00:00.000Z')
      expect(moved.events[0]?.occurredAt).toBe('2026-07-05T12:00:00.000Z')
    })

    it('throws when the inverse is applied after its target parent disappeared', () => {
      const moved = moveDocumentWithInverse(
        { documents: createDocuments(), documentId: 'c', targetParentDocumentId: 'a' },
        fixedNow,
      )

      const withoutOldParent = moved.documents.filter((document) => document.id !== 'b')

      expect(() => moveDocument({ documents: withoutOldParent, ...moved.inverse }, fixedNow)).toThrow(
        DocumentNotFoundError,
      )
    })
  })

  it('archives and restores a document subtree', () => {
    const archived = archiveDocumentSubtree({ documents: createDocuments(), documentId: 'a' })

    expect(archived.documents.filter((document) => ['a', 'b', 'c'].includes(document.id))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'a', state: 'archived' }),
        expect.objectContaining({ id: 'b', state: 'archived' }),
        expect.objectContaining({ id: 'c', state: 'archived' }),
      ]),
    )

    const restored = restoreDocumentSubtree({ documents: archived.documents, documentId: 'a' })

    expect(restored.documents.filter((document) => ['a', 'b', 'c'].includes(document.id))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'a', state: 'published' }),
        expect.objectContaining({ id: 'b', state: 'published' }),
        expect.objectContaining({ id: 'c', state: 'published' }),
      ]),
    )
  })
})
