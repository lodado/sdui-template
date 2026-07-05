import type { InlineDragSource } from '@lodado/sdui-document'

/** Nearest `[data-inline-root]` ancestor of a DOM node (or the node itself). */
export function findInlineRoot(node: Node | null): HTMLElement | null {
  const element = node instanceof Element ? node : node?.parentElement

  return element?.closest<HTMLElement>('[data-inline-root]') ?? null
}

/** Parses + validates the inline-drag payload carried in dataTransfer. */
export function parseInlineDragSource(raw: string): InlineDragSource | null {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof (parsed as InlineDragSource).blockId === 'string' &&
      typeof (parsed as InlineDragSource).from === 'number' &&
      typeof (parsed as InlineDragSource).to === 'number'
    ) {
      return parsed as InlineDragSource
    }
  } catch {
    return null
  }

  return null
}
