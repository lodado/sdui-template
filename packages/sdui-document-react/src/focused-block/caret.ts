/** Mount-time caret placement for the focused editor. */
export type CaretPlacement = 'start' | 'end' | number | undefined

export function resolveCaretOffset(autoFocus: CaretPlacement, docSize: number): number {
  if (autoFocus === 'start' || autoFocus === undefined) {
    return 0
  }

  if (autoFocus === 'end') {
    return docSize
  }

  return Math.max(0, Math.min(autoFocus, docSize))
}
