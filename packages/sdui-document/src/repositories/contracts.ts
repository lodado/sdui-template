import type { SduiDocument, SduiDocumentId, SduiDocumentPatch } from '../blocks/schema';
import type { DocumentTreeResult,MoveDocumentInput } from '../tree';

export type SaveDocumentPatchesInput = {
  documentId: SduiDocumentId;
  expectedVersion: number;
  patches: SduiDocumentPatch[];
};

export type SaveDocumentPatchesResult = {
  documentId: SduiDocumentId;
  version: number;
};

export type MoveDocumentResult = DocumentTreeResult;

export interface SduiDocumentRepository {
  getDocument(id: SduiDocumentId): Promise<SduiDocument | undefined>;
  savePatches(input: SaveDocumentPatchesInput): Promise<SaveDocumentPatchesResult>;
  moveDocument(input: MoveDocumentInput): Promise<MoveDocumentResult>;
}
