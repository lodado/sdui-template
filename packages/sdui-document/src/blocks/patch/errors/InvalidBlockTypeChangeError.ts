import { SduiDocumentError } from '../../schema/SduiDocumentError'

export class InvalidBlockTypeChangeError extends SduiDocumentError {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidBlockTypeChangeError'
  }
}
