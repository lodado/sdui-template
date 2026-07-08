import { SduiDocumentError } from '../../blocks/schema/SduiDocumentError'

export class DocumentNotFoundError extends SduiDocumentError {
  constructor(documentId: string) {
    super(`Document not found: ${documentId}`);
    this.name = 'DocumentNotFoundError';
  }
}
