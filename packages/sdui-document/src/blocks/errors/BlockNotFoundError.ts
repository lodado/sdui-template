export class BlockNotFoundError extends Error {
  constructor(blockId: string) {
    super(`Block not found: ${blockId}`);
    this.name = 'BlockNotFoundError';
  }
}
