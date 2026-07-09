import { createDocumentBlock, SDUI_BLOCK_TYPE, type SduiDocumentContent } from '@lodado/sdui-document'

const widgetDocument = {
  version: '1.0',
  root: {
    id: 'promo-card',
    type: 'Card',
    attributes: { className: 'shadow-md' },
    children: [
      { id: 'promo-title', type: 'Text', state: { text: 'Server-driven widget' } },
      {
        id: 'promo-body',
        type: 'Text',
        state: { text: 'This card is an SDUI layout document rendered inside a document block.' },
      },
      { id: 'promo-cta', type: 'Button', state: { text: 'Server-defined CTA' } },
    ],
  },
}

export const hybridSduiContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'h',
        type: 'document.heading',
        state: { text: 'Hybrid document' },
        attributes: { level: 1 },
      }),
      createDocumentBlock({
        id: 'p1',
        type: 'document.paragraph',
        state: {
          text: 'Everything above and below is a normal editable block. The card in the middle is server-driven UI.',
        },
      }),
      createDocumentBlock({ id: 'widget', type: SDUI_BLOCK_TYPE, attributes: { document: widgetDocument } }),
      createDocumentBlock({ id: 'p2', type: 'document.paragraph', state: { text: 'Text after the widget.' } }),
    ],
  }),
}

export const stateBridgeContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'h',
        type: 'document.heading',
        state: { text: 'Checklist with live widget' },
        attributes: { level: 2 },
      }),
      createDocumentBlock({
        id: 't1',
        type: 'document.checklist',
        state: { text: 'Write the doc' },
        attributes: { checked: true },
      }),
      createDocumentBlock({
        id: 't2',
        type: 'document.checklist',
        state: { text: 'Review it' },
        attributes: { checked: false },
      }),
      createDocumentBlock({
        id: 't3',
        type: 'document.checklist',
        state: { text: 'Ship it' },
        attributes: { checked: false },
      }),
      createDocumentBlock({
        id: 'progress',
        type: SDUI_BLOCK_TYPE,
        attributes: { document: { version: '1.0', root: { id: 'progress-root', type: 'Progress' } } },
      }),
    ],
  }),
}
