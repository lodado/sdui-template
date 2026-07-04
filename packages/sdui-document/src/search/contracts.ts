import type { SduiDocumentId } from '../schema';

export type IndexDocumentInput = {
  documentId: SduiDocumentId;
  text: string;
};

export type RemoveDocumentInput = {
  documentId: SduiDocumentId;
};

export type SearchDocumentsInput = {
  query: string;
  limit?: number;
};

export type SearchDocumentResult = {
  documentId: SduiDocumentId;
  title?: string;
  score?: number;
  snippet?: string;
};

export type SearchDocumentsResult = {
  query: string;
  results: SearchDocumentResult[];
};

export interface SduiDocumentSearchIndexer {
  indexDocument(input: IndexDocumentInput): Promise<void>;
  removeDocument(input: RemoveDocumentInput): Promise<void>;
  search(input: SearchDocumentsInput): Promise<SearchDocumentsResult>;
}
