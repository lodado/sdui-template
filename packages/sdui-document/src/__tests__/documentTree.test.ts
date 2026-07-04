import {
  archiveDocumentSubtree,
  createDocumentBlock,
  DocumentNotFoundError,
  getDocumentDescendantIds,
  InvalidDocumentDestinationError,
  moveDocument,
  restoreDocumentSubtree,
  type SduiDocument,
} from '../index';

const now = '2026-07-04T00:00:00.000Z';

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
  };
}

function createDocuments(): SduiDocument[] {
  return [
    doc({ id: 'a', title: 'A', sortIndex: 0 }),
    doc({ id: 'b', title: 'B', parentDocumentId: 'a', sortIndex: 0 }),
    doc({ id: 'c', title: 'C', parentDocumentId: 'b', sortIndex: 0 }),
    doc({ id: 'd', title: 'D', sortIndex: 1 }),
  ];
}

describe('document tree engine', () => {
  it('returns descendant ids in depth-first order', () => {
    expect(getDocumentDescendantIds(createDocuments(), 'a')).toEqual(['b', 'c']);
  });

  it('moves a document under another parent', () => {
    const result = moveDocument({
      documents: createDocuments(),
      documentId: 'd',
      targetParentDocumentId: 'a',
      targetIndex: 1,
    });

    expect(result.documents.find((document) => document.id === 'd')).toMatchObject({
      parentDocumentId: 'a',
      collectionId: 'collection-1',
      sortIndex: 1,
    });
    expect(result.events).toEqual([
      expect.objectContaining({ type: 'document.moved', documentId: 'd' }),
    ]);
  });

  it('moves a subtree to another collection', () => {
    const result = moveDocument({
      documents: createDocuments(),
      documentId: 'a',
      targetCollectionId: 'collection-2',
      targetIndex: 0,
    });

    expect(result.documents.filter((document) => ['a', 'b', 'c'].includes(document.id))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'a', collectionId: 'collection-2', parentDocumentId: undefined }),
        expect.objectContaining({ id: 'b', collectionId: 'collection-2', parentDocumentId: 'a' }),
        expect.objectContaining({ id: 'c', collectionId: 'collection-2', parentDocumentId: 'b' }),
      ])
    );
  });

  it('rejects moving a document below its descendant', () => {
    expect(() =>
      moveDocument({
        documents: createDocuments(),
        documentId: 'a',
        targetParentDocumentId: 'c',
      })
    ).toThrow(InvalidDocumentDestinationError);
  });

  it('rejects missing source or parent documents', () => {
    expect(() =>
      moveDocument({
        documents: createDocuments(),
        documentId: 'missing',
      })
    ).toThrow(DocumentNotFoundError);

    expect(() =>
      moveDocument({
        documents: createDocuments(),
        documentId: 'a',
        targetParentDocumentId: 'missing-parent',
      })
    ).toThrow(DocumentNotFoundError);
  });

  it('archives and restores a document subtree', () => {
    const archived = archiveDocumentSubtree({ documents: createDocuments(), documentId: 'a' });

    expect(archived.documents.filter((document) => ['a', 'b', 'c'].includes(document.id))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'a', state: 'archived' }),
        expect.objectContaining({ id: 'b', state: 'archived' }),
        expect.objectContaining({ id: 'c', state: 'archived' }),
      ])
    );

    const restored = restoreDocumentSubtree({ documents: archived.documents, documentId: 'a' });

    expect(restored.documents.filter((document) => ['a', 'b', 'c'].includes(document.id))).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'a', state: 'published' }),
        expect.objectContaining({ id: 'b', state: 'published' }),
        expect.objectContaining({ id: 'c', state: 'published' }),
      ])
    );
  });
});
