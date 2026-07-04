export class InvalidBlockMergeError extends Error {
  constructor(message = 'Invalid block merge') {
    super(message)
    this.name = 'InvalidBlockMergeError'
  }
}
