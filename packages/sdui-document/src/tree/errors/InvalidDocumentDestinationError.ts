import { SduiDocumentError } from '../../blocks/schema/SduiDocumentError'

export class InvalidDocumentDestinationError extends SduiDocumentError {
  constructor(message = 'Invalid document destination') {
    super(message);
    this.name = 'InvalidDocumentDestinationError';
  }
}
