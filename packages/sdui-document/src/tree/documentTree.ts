import type { SduiCollectionId, SduiDocument, SduiDocumentEvent, SduiDocumentId } from '../blocks/schema'
import { DocumentNotFoundError, InvalidDocumentDestinationError } from './errors'

export type DocumentTreeResult = {
  documents: SduiDocument[]
  events: SduiDocumentEvent[]
}

/** Injectable clock for deterministic `updatedAt`/`occurredAt` stamps. */
export type DocumentTreeClock = () => string

const defaultClock: DocumentTreeClock = () => new Date().toISOString()

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

function createEvent(
  type: SduiDocumentEvent['type'],
  documentId: SduiDocumentId,
  occurredAt: string,
): SduiDocumentEvent {
  return {
    type,
    documentId,
    occurredAt,
  }
}

export function moveDocument(input: MoveDocumentInput, now: DocumentTreeClock = defaultClock): DocumentTreeResult {
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

  const occurredAt = now()
  const affectedIds = new Set([source.id, ...descendantIds])
  const nextDocuments = documents.map((document) => {
    if (document.id === source.id) {
      return {
        ...document,
        collectionId: targetCollectionId,
        parentDocumentId: input.targetParentDocumentId,
        sortIndex: input.targetIndex,
        updatedAt: occurredAt,
      }
    }

    if (affectedIds.has(document.id)) {
      return {
        ...document,
        collectionId: targetCollectionId,
        updatedAt: occurredAt,
      }
    }

    return document
  })

  return {
    documents: nextDocuments,
    events: [createEvent('document.moved', source.id, occurredAt)],
  }
}

/** Move input minus the documents array — feed back into moveDocument to roll back. */
export type MoveDocumentInverseInput = Omit<MoveDocumentInput, 'documents'>

export type MoveDocumentWithInverseResult = DocumentTreeResult & {
  inverse: MoveDocumentInverseInput
}

/**
 * Applies a move and returns the inverse move input that undoes it.
 *
 * Policies:
 * - the inverse is captured against the pre-move document (snapshot semantics)
 * - the inverse only round-trips against the exact state the move produced;
 *   if the original parent has since disappeared, applying it throws
 *   DocumentNotFoundError and the caller decides whether to drop the entry
 * - `updatedAt` is not restored — undoing is itself an edit
 * - limitation: a document that had no collection AND no parent cannot have
 *   its absent collectionId restored (moveDocument falls back to the current
 *   collection); irrelevant while published documents require a collection
 */
export function moveDocumentWithInverse(
  input: MoveDocumentInput,
  now: DocumentTreeClock = defaultClock,
): MoveDocumentWithInverseResult {
  const source = requireDocument(input.documents, input.documentId)

  const inverse: MoveDocumentInverseInput = {
    documentId: input.documentId,
    targetCollectionId: source.collectionId,
    targetParentDocumentId: source.parentDocumentId,
    targetIndex: source.sortIndex,
  }

  return { ...moveDocument(input, now), inverse }
}

function setSubtreeState(
  input: DocumentSubtreeInput,
  state: SduiDocument['state'],
  eventType: SduiDocumentEvent['type'],
  now: DocumentTreeClock,
): DocumentTreeResult {
  requireDocument(input.documents, input.documentId)

  const occurredAt = now()
  const affectedIds = new Set([input.documentId, ...getDocumentDescendantIds(input.documents, input.documentId)])
  const documents = input.documents.map((document) =>
    affectedIds.has(document.id)
      ? {
          ...document,
          state,
          updatedAt: occurredAt,
        }
      : { ...document },
  )

  return {
    documents,
    events: [createEvent(eventType, input.documentId, occurredAt)],
  }
}

export function archiveDocumentSubtree(
  input: DocumentSubtreeInput,
  now: DocumentTreeClock = defaultClock,
): DocumentTreeResult {
  return setSubtreeState(input, 'archived', 'document.archived', now)
}

export function restoreDocumentSubtree(
  input: DocumentSubtreeInput,
  now: DocumentTreeClock = defaultClock,
): DocumentTreeResult {
  return setSubtreeState(input, 'published', 'document.restored', now)
}
