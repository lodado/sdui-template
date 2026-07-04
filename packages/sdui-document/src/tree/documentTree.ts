import type { SduiCollectionId, SduiDocument, SduiDocumentEvent, SduiDocumentId } from '../schema'
import { DocumentNotFoundError, InvalidDocumentDestinationError } from './errors'

export type DocumentTreeResult = {
  documents: SduiDocument[]
  events: SduiDocumentEvent[]
}

export type MoveDocumentInput = {
  documents: SduiDocument[]
  documentId: SduiDocumentId
  targetCollectionId?: SduiCollectionId
  targetParentDocumentId?: SduiDocumentId
  targetIndex?: number
}

export type DocumentSubtreeInput = {
  documents: SduiDocument[]
  documentId: SduiDocumentId
}

function cloneDocuments(documents: SduiDocument[]): SduiDocument[] {
  return documents.map((document) => ({ ...document }))
}

function findDocument(documents: SduiDocument[], documentId: SduiDocumentId): SduiDocument | undefined {
  return documents.find((document) => document.id === documentId)
}

function requireDocument(documents: SduiDocument[], documentId: SduiDocumentId): SduiDocument {
  const document = findDocument(documents, documentId)
  if (!document) {
    throw new DocumentNotFoundError(documentId)
  }

  return document
}

function childDocuments(documents: SduiDocument[], documentId: SduiDocumentId): SduiDocument[] {
  return documents
    .filter((document) => document.parentDocumentId === documentId)
    .sort((left, right) => (left.sortIndex ?? 0) - (right.sortIndex ?? 0))
}

export function getDocumentDescendantIds(documents: SduiDocument[], documentId: SduiDocumentId): SduiDocumentId[] {
  requireDocument(documents, documentId)

  return childDocuments(documents, documentId).reduce<SduiDocumentId[]>(
    (descendantIds, child) => [...descendantIds, child.id, ...getDocumentDescendantIds(documents, child.id)],
    [],
  )
}

function createEvent(type: SduiDocumentEvent['type'], documentId: SduiDocumentId): SduiDocumentEvent {
  return {
    type,
    documentId,
    occurredAt: new Date().toISOString(),
  }
}

export function moveDocument(input: MoveDocumentInput): DocumentTreeResult {
  const documents = cloneDocuments(input.documents)
  const source = requireDocument(documents, input.documentId)
  const targetParent = input.targetParentDocumentId
    ? requireDocument(documents, input.targetParentDocumentId)
    : undefined
  const descendantIds = getDocumentDescendantIds(documents, source.id)

  if (
    input.targetParentDocumentId === source.id ||
    (input.targetParentDocumentId !== undefined && descendantIds.includes(input.targetParentDocumentId))
  ) {
    throw new InvalidDocumentDestinationError('Cannot move a document below itself or its descendant')
  }

  const targetCollectionId = input.targetCollectionId ?? targetParent?.collectionId ?? source.collectionId
  if (source.state === 'published' && !targetCollectionId) {
    throw new InvalidDocumentDestinationError('Published documents must belong to a collection')
  }

  const affectedIds = new Set([source.id, ...descendantIds])
  const nextDocuments = documents.map((document) => {
    if (document.id === source.id) {
      return {
        ...document,
        collectionId: targetCollectionId,
        parentDocumentId: input.targetParentDocumentId,
        sortIndex: input.targetIndex,
        updatedAt: new Date().toISOString(),
      }
    }

    if (affectedIds.has(document.id)) {
      return {
        ...document,
        collectionId: targetCollectionId,
        updatedAt: new Date().toISOString(),
      }
    }

    return document
  })

  return {
    documents: nextDocuments,
    events: [createEvent('document.moved', source.id)],
  }
}

function setSubtreeState(
  input: DocumentSubtreeInput,
  state: SduiDocument['state'],
  eventType: SduiDocumentEvent['type'],
): DocumentTreeResult {
  requireDocument(input.documents, input.documentId)

  const affectedIds = new Set([input.documentId, ...getDocumentDescendantIds(input.documents, input.documentId)])
  const documents = input.documents.map((document) =>
    affectedIds.has(document.id)
      ? {
          ...document,
          state,
          updatedAt: new Date().toISOString(),
        }
      : { ...document },
  )

  return {
    documents,
    events: [createEvent(eventType, input.documentId)],
  }
}

export function archiveDocumentSubtree(input: DocumentSubtreeInput): DocumentTreeResult {
  return setSubtreeState(input, 'archived', 'document.archived')
}

export function restoreDocumentSubtree(input: DocumentSubtreeInput): DocumentTreeResult {
  return setSubtreeState(input, 'published', 'document.restored')
}
