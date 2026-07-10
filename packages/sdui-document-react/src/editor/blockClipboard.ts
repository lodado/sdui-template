import type { SduiDocumentBlock, SduiDocumentContent } from '@lodado/sdui-document'
import { createBlockId, sduiDocumentContentToMarkdown } from '@lodado/sdui-document'

/**
 * Serializes a set of selected blocks to markdown for the clipboard. The blocks
 * are wrapped in a throwaway root so the shared document→markdown serializer can
 * render them; the markdown round-trips back into blocks on paste (handled by
 * the document-layer markdown paste path), so copy/cut needs no private MIME.
 */
export function blocksToMarkdown(blocks: readonly SduiDocumentBlock[]): string {
  const content = {
    schemaVersion: '1.0',
    root: {
      id: createBlockId('clipboard-root'),
      type: 'document.root',
      ...(blocks.length > 0 ? { children: [...blocks] } : {}),
    },
  } as SduiDocumentContent

  return sduiDocumentContentToMarkdown(content)
}
