export class DuplicateBlockIdError extends Error {
  constructor(blockId: string) {
    super(`Duplicate block id: ${blockId}`)
    this.name = 'DuplicateBlockIdError'
  }
}
