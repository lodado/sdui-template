import { SduiDocumentError } from '../../schema/SduiDocumentError'

export class InvalidBlockSplitError extends SduiDocumentError {
  constructor(message = 'Invalid block split') {
    super(message)
    this.name = 'InvalidBlockSplitError'
  }
}
