import { SduiDocumentError } from '../../schema/SduiDocumentError'

export class ParentBlockNotFoundError extends SduiDocumentError {
  constructor(parentId: string) {
    super(`Parent block not found: ${parentId}`);
    this.name = 'ParentBlockNotFoundError';
  }
}
