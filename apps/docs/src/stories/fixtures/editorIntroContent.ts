import { createDocumentBlock, type SduiDocumentContent } from '@lodado/sdui-document'

/** Small intro document for the hybrid editor getting-started demo. */
export const editorIntroContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'document-root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'heading-1',
        type: 'document.heading',
        state: {
          content: [{ type: 'text', text: 'Hybrid block editor', marks: [{ type: 'bold' }] }],
          text: 'Hybrid block editor',
        },
        attributes: { level: 1 },
      }),
      createDocumentBlock({
        id: 'paragraph-1',
        type: 'document.paragraph',
        state: {
          content: [
            { type: 'text', text: 'Only the focused block mounts ' },
            { type: 'text', text: 'ProseMirror', marks: [{ type: 'code' }] },
            { type: 'text', text: '; everything else is static React.' },
          ],
          text: 'Only the focused block mounts ProseMirror; everything else is static React.',
        },
      }),
      createDocumentBlock({
        id: 'paragraph-2',
        type: 'document.paragraph',
        state: {
          content: [
            { type: 'text', text: 'Structure changes are ' },
            { type: 'text', text: 'patches', marks: [{ type: 'italic' }] },
            { type: 'text', text: ' — try Enter, Backspace at start, Tab and Shift-Tab.' },
          ],
          text: 'Structure changes are patches — try Enter, Backspace at start, Tab and Shift-Tab.',
        },
        children: [
          createDocumentBlock({
            id: 'nested-1',
            type: 'document.paragraph',
            state: { text: 'Nested blocks move with their parents.' },
          }),
        ],
      }),
    ],
  }),
}
