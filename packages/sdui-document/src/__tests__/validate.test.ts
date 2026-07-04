import {
  createDocumentBlock,
  parseSduiDocument,
  parseSduiDocumentContent,
  parseSduiDocumentPatch,
  parseSduiDocumentPatches,
} from '../index'

describe('parseSduiDocument', () => {
  const validDocument = {
    id: 'doc-1',
    workspaceId: 'ws-1',
    title: 'Test',
    state: 'draft',
    content: {
      schemaVersion: '1.0',
      root: { id: 'root', type: 'document.root' },
    },
    version: 1,
    createdAt: '2026-07-04T00:00:00.000Z',
    updatedAt: '2026-07-04T00:00:00.000Z',
  }

  it('parses a valid document', () => {
    const doc = parseSduiDocument(validDocument)
    expect(doc.id).toBe('doc-1')
    expect(doc.collectionId).toBeUndefined()
  })

  it('rejects a document with missing required fields', () => {
    expect(() => parseSduiDocument({ ...validDocument, id: '' })).toThrow()
    expect(() => parseSduiDocument({ ...validDocument, workspaceId: undefined })).toThrow()
    expect(() => parseSduiDocument({ ...validDocument, state: 'unknown-state' })).toThrow()
  })

  it('rejects a document with invalid content schemaVersion', () => {
    expect(() =>
      parseSduiDocument({
        ...validDocument,
        content: { schemaVersion: '2.0', root: { id: 'root', type: 'document.root' } },
      }),
    ).toThrow()
  })
})

describe('parseSduiDocumentContent', () => {
  it('parses valid content with nested blocks', () => {
    const content = parseSduiDocumentContent({
      schemaVersion: '1.0',
      root: createDocumentBlock({
        id: 'root',
        type: 'document.root',
        children: [createDocumentBlock({ id: 'p1', type: 'document.paragraph' })],
      }),
    })

    expect(content.root.children).toHaveLength(1)
  })

  it('rejects content missing root', () => {
    expect(() => parseSduiDocumentContent({ schemaVersion: '1.0' })).toThrow()
  })
})

describe('parseSduiDocumentPatch', () => {
  it('parses each patch type', () => {
    expect(
      parseSduiDocumentPatch({
        type: 'block.insert',
        parentId: 'p',
        index: 0,
        block: { id: 'b', type: 'document.paragraph' },
      }),
    ).toMatchObject({ type: 'block.insert' })

    expect(parseSduiDocumentPatch({ type: 'block.update', blockId: 'b', state: { text: 'hi' } })).toMatchObject({
      type: 'block.update',
    })

    expect(parseSduiDocumentPatch({ type: 'block.delete', blockId: 'b' })).toMatchObject({
      type: 'block.delete',
    })

    expect(parseSduiDocumentPatch({ type: 'block.move', blockId: 'b', parentId: 'p', index: 1 })).toMatchObject({
      type: 'block.move',
    })

    expect(parseSduiDocumentPatch({ type: 'document.setTitle', title: 'New' })).toMatchObject({
      type: 'document.setTitle',
      title: 'New',
    })
  })

  it('rejects unknown patch type', () => {
    expect(() => parseSduiDocumentPatch({ type: 'block.unknown' })).toThrow()
  })

  it('rejects block.insert with negative index', () => {
    expect(() =>
      parseSduiDocumentPatch({
        type: 'block.insert',
        parentId: 'p',
        index: -1,
        block: { id: 'b', type: 'document.paragraph' },
      }),
    ).toThrow()
  })
})

describe('parseSduiDocumentPatches', () => {
  it('parses an array of patches', () => {
    const patches = parseSduiDocumentPatches([
      { type: 'document.setTitle', title: 'Hello' },
      { type: 'block.delete', blockId: 'b1' },
    ])

    expect(patches).toHaveLength(2)
  })

  it('rejects non-array input', () => {
    expect(() => parseSduiDocumentPatches({ type: 'block.delete', blockId: 'b' })).toThrow()
  })
})
