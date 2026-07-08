import { SduiDocumentError } from '../../schema/SduiDocumentError'

export class InvalidBlockMoveError extends SduiDocumentError {
  constructor(message = 'Invalid block move') {
    super(message);
    this.name = 'InvalidBlockMoveError';
  }
}
