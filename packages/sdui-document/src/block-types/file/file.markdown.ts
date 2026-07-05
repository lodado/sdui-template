import type { SduiDocumentBlock } from '../../blocks/schema/block'
/**
 * File attachments have no markdown equivalent (no URL in the schema) — degrade
 * to the plain attachment title.
 */
import { FILE_BLOCK_TYPE } from './file.type'

export function fileToMarkdown(block: SduiDocumentBlock): string {
  return (typeof block.state?.text === 'string' && block.state.text) || String(block.attributes?.title ?? 'Attachment')
}
