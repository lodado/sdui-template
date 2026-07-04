export class ParentBlockNotFoundError extends Error {
  constructor(parentId: string) {
    super(`Parent block not found: ${parentId}`);
    this.name = 'ParentBlockNotFoundError';
  }
}
