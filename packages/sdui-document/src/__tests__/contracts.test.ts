import type {
  CreateDownloadUrlInput,
  CreateUploadInput,
  SduiDocumentAttachmentStorage,
  SduiDocumentCollaborationAdapter,
  SduiDocumentRepository,
  SduiDocumentSearchIndexer,
  SearchDocumentsInput,
} from '../index';
import { SDUI_DOCUMENT_CONTRACT_VERSION } from '../index';

describe('adapter contracts', () => {
  it('exports the current contract version', () => {
    expect(SDUI_DOCUMENT_CONTRACT_VERSION).toBe('1.0');
  });

  it('allows repository implementations to save document patches', async () => {
    const repository: SduiDocumentRepository = {
      getDocument: jest.fn().mockResolvedValue(undefined),
      savePatches: jest.fn().mockResolvedValue({ documentId: 'doc-1', version: 2 }),
      moveDocument: jest.fn().mockResolvedValue({ documents: [], events: [] }),
    };

    await expect(
      repository.savePatches({ documentId: 'doc-1', expectedVersion: 1, patches: [] })
    ).resolves.toEqual({ documentId: 'doc-1', version: 2 });
  });

  it('allows storage implementations to create upload and download URLs', async () => {
    const storage: SduiDocumentAttachmentStorage = {
      createUpload: jest.fn(async (input: CreateUploadInput) => ({
        attachmentId: 'attachment-1',
        uploadUrl: `upload://${input.fileName}`,
      })),
      createDownloadUrl: jest.fn(async (input: CreateDownloadUrlInput) => ({
        downloadUrl: `download://${input.attachmentId}`,
      })),
    };

    await expect(
      storage.createUpload({ documentId: 'doc-1', fileName: 'image.png', contentType: 'image/png' })
    ).resolves.toEqual({ attachmentId: 'attachment-1', uploadUrl: 'upload://image.png' });
  });

  it('allows search and collaboration adapters without runtime dependencies', async () => {
    const search: SduiDocumentSearchIndexer = {
      indexDocument: jest.fn().mockResolvedValue(undefined),
      removeDocument: jest.fn().mockResolvedValue(undefined),
      search: jest.fn(async (input: SearchDocumentsInput) => ({ query: input.query, results: [] })),
    };
    const collaboration: SduiDocumentCollaborationAdapter = {
      connect: jest.fn().mockResolvedValue({ documentId: 'doc-1', readOnly: true }),
    };

    await expect(search.search({ query: 'hello' })).resolves.toEqual({ query: 'hello', results: [] });
    await expect(collaboration.connect({ documentId: 'doc-1', token: 'token' })).resolves.toEqual({
      documentId: 'doc-1',
      readOnly: true,
    });
  });
});
