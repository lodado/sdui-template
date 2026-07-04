import type { SduiDocumentBlock } from './block';
import type { SduiCollectionId, SduiDocumentId, SduiWorkspaceId } from './ids';

export type SduiDocumentState = 'draft' | 'published' | 'archived' | 'deleted';

export type SduiDocumentContent = {
  schemaVersion: '1.0';
  root: SduiDocumentBlock;
};

export type SduiDocument = {
  id: SduiDocumentId;
  workspaceId: SduiWorkspaceId;
  collectionId?: SduiCollectionId;
  parentDocumentId?: SduiDocumentId;
  title: string;
  state: SduiDocumentState;
  content: SduiDocumentContent;
  version: number;
  createdAt: string;
  updatedAt: string;
};
