/**
 * Id source for authoring builders. Block ids only need to be unique within a
 * single document; this monotonic counter guarantees that across a process.
 *
 * For persisted documents (stable subscriptions across sessions) pass an
 * explicit `id` to the builder instead of relying on this counter.
 */
let counter = 0

export function nextBlockId(hint = 'block'): string {
  counter += 1
  return `${hint}-${counter}`
}

/** Reset the counter — use in tests for deterministic ids. */
export function resetBlockIds(): void {
  counter = 0
}
