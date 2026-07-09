import { createDocumentBlock, type SduiDocumentContent } from '@lodado/sdui-document'

export const textDragContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'drag-source',
        type: 'document.paragraph',
        state: {
          content: [
            { type: 'text', text: 'Select any text here — like ' },
            { type: 'text', text: 'this bold fragment', marks: [{ type: 'bold' }] },
            { type: 'text', text: ' or ' },
            { type: 'text', text: 'this highlight', marks: [{ type: 'highlight', attrs: { color: '#FED46A' } }] },
            { type: 'text', text: ' — and drag it into another block.' },
          ],
          text: 'Select any text here — like this bold fragment or this highlight — and drag it into another block.',
        },
      }),
      createDocumentBlock({
        id: 'drag-target',
        type: 'document.paragraph',
        state: {
          content: [{ type: 'text', text: 'Drop it anywhere in this paragraph; marks travel along.' }],
          text: 'Drop it anywhere in this paragraph; marks travel along.',
        },
      }),
      createDocumentBlock({
        id: 'drag-checklist',
        type: 'document.checklist',
        state: { text: 'Checklists accept text drops too' },
        attributes: { checked: false },
      }),
      createDocumentBlock({
        id: 'drag-callout',
        type: 'document.callout',
        state: { text: 'Callouts as well — hold Alt/Option while dropping to copy instead of move.' },
        attributes: { style: 'tip' },
      }),
      createDocumentBlock({ id: 'drag-divider', type: 'document.divider' }),
    ],
  }),
}

export const rangeClipboardContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'range-heading',
        type: 'document.heading',
        state: { text: 'Drag across blocks to select them' },
        attributes: { level: 2 },
      }),
      createDocumentBlock({
        id: 'range-p1',
        type: 'document.paragraph',
        state: { text: 'Start a text drag here and cross into the next block — the selection snaps to whole blocks.' },
      }),
      createDocumentBlock({
        id: 'range-p2',
        type: 'document.paragraph',
        state: { text: 'Then Cmd/Ctrl-C to copy, X to cut, V to paste after the selection.' },
        children: [
          createDocumentBlock({
            id: 'range-p2-child',
            type: 'document.paragraph',
            state: { text: 'Nested children travel with their parent.' },
          }),
        ],
      }),
      createDocumentBlock({
        id: 'range-check',
        type: 'document.checklist',
        state: { text: 'Paste also accepts plain markdown from other apps' },
        attributes: { checked: false },
      }),
      createDocumentBlock({
        id: 'range-tail',
        type: 'document.paragraph',
        state: { text: 'Pasted blocks get fresh ids and become the new selection.' },
      }),
    ],
  }),
}

export const emptyDocumentContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({ id: 'empty-root', type: 'document.root' }),
}

export const dividerTailContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'divider-tail-root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'divider-tail-heading',
        type: 'document.heading',
        state: { text: 'Document ending in a divider' },
        attributes: { level: 2 },
      }),
      createDocumentBlock({ id: 'divider-tail-hr', type: 'document.divider' }),
    ],
  }),
}
