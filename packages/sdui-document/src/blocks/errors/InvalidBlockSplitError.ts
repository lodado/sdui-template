export class InvalidBlockSplitError extends Error {
  constructor(message = 'Invalid block split') {
    super(message)
    this.name = 'InvalidBlockSplitError'
  }
}
