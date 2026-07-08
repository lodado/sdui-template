export class RootBlockCannotBeDeletedError extends Error {
  constructor() {
    super('Root block cannot be deleted');
    this.name = 'RootBlockCannotBeDeletedError';
  }
}
