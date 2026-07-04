export class InvalidDocumentDestinationError extends Error {
  constructor(message = 'Invalid document destination') {
    super(message);
    this.name = 'InvalidDocumentDestinationError';
  }
}
