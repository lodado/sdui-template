import type {
  CreateDocumentInput,
  CreateDownloadUrlInput,
  CreateUploadInput,
  SduiDocumentAttachmentStorage,
  SduiDocumentCollaborationAdapter,
  SduiDocumentRepository,
  SduiDocumentSearchIndexer,
  SearchDocumentsInput,
} from '../index'
import { SDUI_DOCUMENT_CONTRACT_VERSION } from '../index'

describe('adapter contracts', () => {
  it('exports the current contract version', () => {
    expect(SDUI_DOCUMENT_CONTRACT_VERSION).toBe('1.0')
  })

  it('allows repository implementations to save document patches', async () => {
    const repository: SduiDocumentRepository = {
      getDocument: jest.fn().mockResolvedValue(undefined),
      savePatches: jest.fn().mockResolvedValue({ documentId: 'doc-1', version: 2 }),
      moveDocument: jest.fn().mockResolvedValue({ documents: [], events: [] }),
      createDocument: jest.fn().mockResolvedValue(undefined),
      archiveDocument: jest.fn().mockResolvedValue(undefined),
    }

    await expect(repository.savePatches({ documentId: 'doc-1', expectedVersion: 1, patches: [] })).resolves.toEqual({
      documentId: 'doc-1',
      version: 2,
    })
  })

  it('allows repository implementations to create and archive sub-page documents', async () => {
    const created = { id: 'doc-2', title: 'New page', state: 'draft' }
    const createDocument = jest.fn(async (input: CreateDocumentInput) => ({
      ...created,
      parentDocumentId: input.parentDocumentId,
    }))
    const archiveDocument = jest.fn().mockResolvedValue(undefined)
    const repository = {
      getDocument: jest.fn().mockResolvedValue(undefined),
      savePatches: jest.fn(),
      moveDocument: jest.fn(),
      createDocument,
      archiveDocument,
    } as unknown as SduiDocumentRepository

    await expect(
      repository.createDocument({ workspaceId: 'ws-1', parentDocumentId: 'doc-1', title: 'New page' }),
    ).resolves.toMatchObject({ parentDocumentId: 'doc-1' })
    await expect(repository.archiveDocument('doc-2')).resolves.toBeUndefined()
  })

  it('allows storage implementations to create upload and download URLs', async () => {
    const storage: SduiDocumentAttachmentStorage = {
      createUpload: jest.fn(async (input: CreateUploadInput) => ({
        attachmentId: 'attachment-1',
        uploadUrl: `upload://${input.fileName}`,
      })),
      createDownloadUrl: jest.fn(async (input: CreateDownloadUrlInput) => ({
        downloadUrl: `download://${input.attachmentId}`,
      })),
    }

    await expect(
      storage.createUpload({ documentId: 'doc-1', fileName: 'image.png', contentType: 'image/png' }),
    ).resolves.toEqual({ attachmentId: 'attachment-1', uploadUrl: 'upload://image.png' })
  })

  it('allows search and collaboration adapters without runtime dependencies', async () => {
    const search: SduiDocumentSearchIndexer = {
      indexDocument: jest.fn().mockResolvedValue(undefined),
      removeDocument: jest.fn().mockResolvedValue(undefined),
      search: jest.fn(async (input: SearchDocumentsInput) => ({ query: input.query, results: [] })),
    }
    const collaboration: SduiDocumentCollaborationAdapter = {
      connect: jest.fn().mockResolvedValue({ documentId: 'doc-1', readOnly: true }),
    }

    await expect(search.search({ query: 'hello' })).resolves.toEqual({ query: 'hello', results: [] })
    await expect(collaboration.connect({ documentId: 'doc-1', token: 'token' })).resolves.toEqual({
      documentId: 'doc-1',
      readOnly: true,
    })
  })
})
