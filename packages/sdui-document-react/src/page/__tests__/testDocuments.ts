import type { SduiDocument } from '@lodado/sdui-document'
import { createDocumentBlock, createDocumentId, createWorkspaceId } from '@lodado/sdui-document'

/** Minimal published document fixture for page-navigation tests. */
export function makeDocument(id: string, title: string, overrides: Partial<SduiDocument> = {}): SduiDocument {
  return {
    id: createDocumentId(id),
    workspaceId: createWorkspaceId('ws-1'),
    title,
    state: 'published',
    content: {
      schemaVersion: '1.0',
      root: createDocumentBlock({
        id: `${id}-root`,
        type: 'document.root',
        children: [{ id: `${id}-p1`, type: 'document.paragraph', state: { text: `${title} body` } }],
      }),
    },
    version: 1,
    createdAt: '2026-07-09T00:00:00.000Z',
    updatedAt: '2026-07-09T00:00:00.000Z',
    ...overrides,
  }
}
