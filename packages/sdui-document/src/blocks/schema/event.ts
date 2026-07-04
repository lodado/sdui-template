import type { SduiCollectionId, SduiDocumentId, SduiWorkspaceId } from './ids'

export type SduiDocumentEventType =
  | 'document.created'
  | 'document.updated'
  | 'document.published'
  | 'document.moved'
  | 'document.archived'
  | 'document.restored'
  | 'document.deleted'

export type SduiDocumentEventPayload = {
  title?: string
  fromState?: string
  toState?: string
  targetCollectionId?: SduiCollectionId
  targetParentDocumentId?: SduiDocumentId
}

export type SduiDocumentEvent = {
  type: SduiDocumentEventType
  documentId: SduiDocumentId
  actorId?: string
  workspaceId?: SduiWorkspaceId
  occurredAt: string
  payload?: SduiDocumentEventPayload
}
