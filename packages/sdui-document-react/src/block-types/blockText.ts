import type { SduiDocumentBlock } from '@lodado/sdui-document'

export function blockText(block: SduiDocumentBlock): string {
  const text = block.state?.text

  return typeof text === 'string' ? text : ''
}
