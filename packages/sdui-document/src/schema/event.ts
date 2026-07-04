import type { SduiDocumentId } from './ids';

export type SduiDocumentEventType =
  | 'document.created'
  | 'document.updated'
  | 'document.moved'
  | 'document.archived'
  | 'document.restored'
  | 'document.deleted';

export type SduiDocumentEvent = {
  type: SduiDocumentEventType;
  documentId: SduiDocumentId;
  occurredAt: string;
};
