import { SduiDocumentError } from '../../schema/SduiDocumentError'

export class InvalidBlockMergeError extends SduiDocumentError {
  constructor(message = 'Invalid block merge') {
    super(message)
    this.name = 'InvalidBlockMergeError'
  }
}
