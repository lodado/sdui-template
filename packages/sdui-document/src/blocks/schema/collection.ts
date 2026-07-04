import type { SduiCollectionId, SduiWorkspaceId } from './ids';

export type SduiCollection = {
  id: SduiCollectionId;
  workspaceId: SduiWorkspaceId;
  name: string;
  archivedAt?: string;
  deletedAt?: string;
};
