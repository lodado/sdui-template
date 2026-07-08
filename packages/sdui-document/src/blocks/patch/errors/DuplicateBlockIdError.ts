import { SduiDocumentError } from '../../schema/SduiDocumentError'

export class DuplicateBlockIdError extends SduiDocumentError {
  constructor(blockId: string) {
    super(`Duplicate block id: ${blockId}`)
    this.name = 'DuplicateBlockIdError'
  }
}
