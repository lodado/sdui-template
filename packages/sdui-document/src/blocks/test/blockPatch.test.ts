import {
  applyDocumentPatch,
  applyPatchToDocument,
  BlockNotFoundError,
  createDocumentBlock,
  DuplicateBlockIdError,
  findBlockById,
  InvalidBlockMoveError,
  InvalidBlockTypeChangeError,
  ParentBlockNotFoundError,
  RootBlockCannotBeDeletedError,
  type SduiDocument,
  type SduiDocumentContent,
} from '../../index'

function createContent(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({
          id: 'paragraph-1',
          type: 'document.paragraph',
          state: { text: 'First' },
        }),
        createDocumentBlock({
          id: 'callout-1',
          type: 'document.callout',
          children: [
            createDocumentBlock({
              id: 'paragraph-2',
              type: 'document.paragraph',
              state: { text: 'Nested' },
            }),
          ],
        }),
      ],
    }),
  }
}

describe('block patch engine', () => {
  it('inserts a block into a parent at the requested anchor', () => {
    const next = applyDocumentPatch(createContent(), {
      type: 'block.insert',
      parentId: 'root',
      before: 'callout-1',
      block: createDocumentBlock({
        id: 'heading-1',
        type: 'document.heading',
        state: { text: 'Inserted', level: 2 },
      }),
    })

    expect(next.root.children?.map((block) => block.id)).toEqual(['paragraph-1', 'heading-1', 'callout-1'])
  })

  it('updates a block by shallow-merging state and attributes', () => {
    const next = applyDocumentPatch(createContent(), {
      type: 'block.update',
      blockId: 'paragraph-1',
      state: { text: 'Updated' },
      attributes: { placeholder: 'Write something' },
    })

    expect(findBlockById(next, 'paragraph-1')).toMatchObject({
      state: { text: 'Updated' },
      attributes: { placeholder: 'Write something' },
    })
  })

  it('deletes a block and its descendants', () => {
    const next = applyDocumentPatch(createContent(), {
      type: 'block.delete',
      blockId: 'callout-1',
    })

    expect(findBlockById(next, 'callout-1')).toBeUndefined()
    expect(findBlockById(next, 'paragraph-2')).toBeUndefined()
  })

  it('moves a block to another parent', () => {
    const next = applyDocumentPatch(createContent(), {
      type: 'block.move',
      blockId: 'paragraph-1',
      parentId: 'callout-1',
      after: 'paragraph-2',
    })

    expect(next.root.children?.map((block) => block.id)).toEqual(['callout-1'])
    expect(findBlockById(next, 'callout-1')?.children?.map((block) => block.id)).toEqual(['paragraph-2', 'paragraph-1'])
  })

  it('does not mutate the original content', () => {
    const original = createContent()

    applyDocumentPatch(original, {
      type: 'block.update',
      blockId: 'paragraph-1',
      state: { text: 'Updated' },
    })

    expect(findBlockById(original, 'paragraph-1')?.state?.text).toBe('First')
  })

  it('rejects deleting the root block', () => {
    expect(() =>
      applyDocumentPatch(createContent(), {
        type: 'block.delete',
        blockId: 'root',
      }),
    ).toThrow(RootBlockCannotBeDeletedError)
  })

  it('rejects moving a block below itself or its descendant', () => {
    expect(() =>
      applyDocumentPatch(createContent(), {
        type: 'block.move',
        blockId: 'callout-1',
        parentId: 'paragraph-2',
        after: null,
      }),
    ).toThrow(InvalidBlockMoveError)
  })

  it('rejects inserting a block whose id already exists in the tree', () => {
    expect(() =>
      applyDocumentPatch(createContent(), {
        type: 'block.insert',
        parentId: 'root',
        after: null,
        block: createDocumentBlock({ id: 'paragraph-1', type: 'document.paragraph' }),
      }),
    ).toThrow(DuplicateBlockIdError)
  })

  it('rejects inserting a subtree containing a duplicate descendant id', () => {
    expect(() =>
      applyDocumentPatch(createContent(), {
        type: 'block.insert',
        parentId: 'root',
        after: null,
        block: createDocumentBlock({
          id: 'new-parent',
          type: 'document.callout',
          children: [createDocumentBlock({ id: 'paragraph-2', type: 'document.paragraph' })],
        }),
      }),
    ).toThrow(DuplicateBlockIdError)
  })

  it('rejects patches targeting missing blocks', () => {
    expect(() =>
      applyDocumentPatch(createContent(), {
        type: 'block.update',
        blockId: 'missing',
        state: { text: 'Nope' },
      }),
    ).toThrow(BlockNotFoundError)

    expect(() =>
      applyDocumentPatch(createContent(), {
        type: 'block.insert',
        parentId: 'missing-parent',
        after: null,
        block: createDocumentBlock({ id: 'new', type: 'document.paragraph' }),
      }),
    ).toThrow(ParentBlockNotFoundError)
  })
})

describe('applyPatchToDocument', () => {
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

  it('updates document title via document.setTitle patch', () => {
    const next = applyPatchToDocument(baseDocument, {
      type: 'document.setTitle',
      title: 'New title',
    })

    expect(next.title).toBe('New title')
    expect(next.content).toBe(baseDocument.content)
  })

  it('applies block patch to document content', () => {
    const next = applyPatchToDocument(baseDocument, {
      type: 'block.update',
      blockId: 'paragraph-1',
      state: { text: 'Updated via document patch' },
    })

    expect(next.title).toBe('Original title')
    expect(findBlockById(next.content, 'paragraph-1')?.state?.text).toBe('Updated via document patch')
    expect(findBlockById(baseDocument.content, 'paragraph-1')?.state?.text).toBe('First')
  })
})

describe('block.setType (turn-into)', () => {
  it('changes the block type and replaces attributes wholesale', () => {
    const next = applyDocumentPatch(createContent(), {
      type: 'block.setType',
      blockId: 'paragraph-1',
      blockType: 'document.heading',
      attributes: { level: 2 },
    })

    const block = findBlockById(next, 'paragraph-1')
    expect(block?.type).toBe('document.heading')
    expect(block?.attributes).toEqual({ level: 2 })
    expect(block?.state?.text).toBe('First')
  })

  it('drops stale attributes when the new type provides none', () => {
    const heading = applyDocumentPatch(createContent(), {
      type: 'block.setType',
      blockId: 'paragraph-1',
      blockType: 'document.heading',
      attributes: { level: 3 },
    })

    const next = applyDocumentPatch(heading, {
      type: 'block.setType',
      blockId: 'paragraph-1',
      blockType: 'document.checklist',
    })

    const block = findBlockById(next, 'paragraph-1')
    expect(block?.type).toBe('document.checklist')
    expect(block?.attributes).toBeUndefined()
  })

  it('keeps children through a type change', () => {
    const next = applyDocumentPatch(createContent(), {
      type: 'block.setType',
      blockId: 'callout-1',
      blockType: 'document.paragraph',
    })

    const block = findBlockById(next, 'callout-1')
    expect(block?.type).toBe('document.paragraph')
    expect(block?.children?.map((child) => child.id)).toEqual(['paragraph-2'])
  })

  it('does not mutate the original content (immutability)', () => {
    const original = createContent()
    applyDocumentPatch(original, {
      type: 'block.setType',
      blockId: 'paragraph-1',
      blockType: 'document.heading',
      attributes: { level: 1 },
    })

    expect(findBlockById(original, 'paragraph-1')?.type).toBe('document.paragraph')
  })

  it('throws BlockNotFoundError for an unknown block', () => {
    expect(() =>
      applyDocumentPatch(createContent(), {
        type: 'block.setType',
        blockId: 'missing',
        blockType: 'document.heading',
      }),
    ).toThrow(BlockNotFoundError)
  })

  it('rejects changing the root block type', () => {
    expect(() =>
      applyDocumentPatch(createContent(), {
        type: 'block.setType',
        blockId: 'root',
        blockType: 'document.paragraph',
      }),
    ).toThrow(InvalidBlockTypeChangeError)
  })
})
