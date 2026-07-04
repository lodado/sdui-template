import type { SduiDocumentId } from '../schema';

export type CreateUploadInput = {
  documentId: SduiDocumentId;
  fileName: string;
  contentType: string;
  size?: number;
};

export type CreateUploadResult = {
  attachmentId: string;
  uploadUrl: string;
};

export type CreateDownloadUrlInput = {
  attachmentId: string;
  documentId?: SduiDocumentId;
};

export type CreateDownloadUrlResult = {
  downloadUrl: string;
};

export interface SduiDocumentAttachmentStorage {
  createUpload(input: CreateUploadInput): Promise<CreateUploadResult>;
  createDownloadUrl(input: CreateDownloadUrlInput): Promise<CreateDownloadUrlResult>;
}
