import type { SduiDocumentId } from '../blocks/schema';

export type CollaborationConnectInput = {
  documentId: SduiDocumentId;
  token: string;
};

export type CollaborationSession = {
  documentId: SduiDocumentId;
  readOnly: boolean;
};

export interface SduiDocumentCollaborationAdapter {
  connect(input: CollaborationConnectInput): Promise<CollaborationSession>;
}
