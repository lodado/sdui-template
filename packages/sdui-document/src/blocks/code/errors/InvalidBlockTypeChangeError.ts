export class InvalidBlockTypeChangeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidBlockTypeChangeError'
  }
}
