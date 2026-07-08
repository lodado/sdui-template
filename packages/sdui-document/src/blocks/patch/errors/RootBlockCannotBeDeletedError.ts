import { SduiDocumentError } from '../../schema/SduiDocumentError'

export class RootBlockCannotBeDeletedError extends SduiDocumentError {
  constructor() {
    super('Root block cannot be deleted');
    this.name = 'RootBlockCannotBeDeletedError';
  }
}
