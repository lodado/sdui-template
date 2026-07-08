import { SduiDocumentError } from '../../blocks/schema/SduiDocumentError'

export class InvalidInlineOffsetError extends SduiDocumentError {
  constructor(offset: number, length: number) {
    super(`Invalid inline offset ${offset}: must be between 0 and ${length}`)
    this.name = 'InvalidInlineOffsetError'
  }
}
