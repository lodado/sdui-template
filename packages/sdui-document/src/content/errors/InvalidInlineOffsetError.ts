export class InvalidInlineOffsetError extends Error {
  constructor(offset: number, length: number) {
    super(`Invalid inline offset ${offset}: must be between 0 and ${length}`)
    this.name = 'InvalidInlineOffsetError'
  }
}
