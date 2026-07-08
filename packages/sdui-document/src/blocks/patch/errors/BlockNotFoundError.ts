import { SduiDocumentError } from '../../schema/SduiDocumentError'

export class BlockNotFoundError extends SduiDocumentError {
  constructor(blockId: string) {
    super(`Block not found: ${blockId}`);
    this.name = 'BlockNotFoundError';
  }
}
