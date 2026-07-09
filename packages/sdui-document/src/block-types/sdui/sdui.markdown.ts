import type { SduiDocumentBlock } from '../../blocks/schema/block'

export function sduiToMarkdown(block: SduiDocumentBlock): string {
  const document = block.attributes?.document as { root?: { type?: unknown } } | undefined
  const rootType = typeof document?.root?.type === 'string' ? document.root.type : 'layout'

  return `[sdui:${rootType}]`
}
