// STAGED CONTRACT — no adapter implements this yet. It fronts the collaboration
// persistence roadmap (see the realtime R1 note on SduiDocumentPatch): the
// `expectedVersion` field is the optimistic-concurrency hook the sequencer will
// need. Kept as a port ahead of its adapter; delete if that work is dropped.
import type { SduiDocument, SduiDocumentId, SduiDocumentPatch, SduiWorkspaceId } from '../blocks/schema'
import type { DocumentTreeResult, MoveDocumentInput } from '../tree'

export type SaveDocumentPatchesInput = {
  documentId: SduiDocumentId
  expectedVersion: number
  patches: SduiDocumentPatch[]
}

export type SaveDocumentPatchesResult = {
  documentId: SduiDocumentId
  version: number
}

export type MoveDocumentResult = DocumentTreeResult

/** Input for creating an empty sub-page document (page-block insertion flow). */
export type CreateDocumentInput = {
  workspaceId: SduiWorkspaceId
  parentDocumentId?: SduiDocumentId
  title?: string
}

export interface SduiDocumentRepository {
  getDocument(id: SduiDocumentId): Promise<SduiDocument | undefined>
  savePatches(input: SaveDocumentPatchesInput): Promise<SaveDocumentPatchesResult>
  moveDocument(input: MoveDocumentInput): Promise<MoveDocumentResult>
  /** Create an empty draft document (id assigned by the implementation). */
  createDocument(input: CreateDocumentInput): Promise<SduiDocument>
  /** Soft-delete: mark the document archived (page-block deletion flow — never hard-delete). */
  archiveDocument(id: SduiDocumentId): Promise<void>
}
