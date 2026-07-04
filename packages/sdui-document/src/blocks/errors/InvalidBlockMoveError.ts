export class InvalidBlockMoveError extends Error {
  constructor(message = 'Invalid block move') {
    super(message);
    this.name = 'InvalidBlockMoveError';
  }
}
