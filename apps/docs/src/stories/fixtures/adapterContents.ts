import { createDocumentBlock, type SduiDocumentContent } from '@lodado/sdui-document'

export const adapterBaseContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'document-root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'heading-intro',
        type: 'document.heading',
        state: { text: 'SDUI Document System', level: 1 },
      }),
      createDocumentBlock({
        id: 'paragraph-intro',
        type: 'document.paragraph',
        state: {
          text: 'A block document rendered by sdui-template, with document semantics owned by sdui-document.',
        },
      }),
      createDocumentBlock({
        id: 'todo-domain',
        type: 'document.checklist',
        state: { text: 'Keep document domain independent from renderer implementation', checked: true },
      }),
      createDocumentBlock({
        id: 'todo-editor',
        type: 'document.checklist',
        state: { text: 'Add native block editor after adapter is stable', checked: false },
      }),
      createDocumentBlock({ id: 'divider-1', type: 'document.divider' }),
      createDocumentBlock({
        id: 'callout-scope',
        type: 'document.callout',
        state: { text: 'MVP is block-level editing. Rich text and Yjs stay out until proven necessary.' },
        attributes: { tone: 'info' },
      }),
    ],
  }),
}

export const adapterNestedContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'nested-root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'nested-heading',
        type: 'document.heading',
        state: { text: 'Product Requirements', level: 1 },
      }),
      createDocumentBlock({
        id: 'nested-summary',
        type: 'document.paragraph',
        state: { text: 'This variation shows nested planning blocks and cross-document references.' },
      }),
      createDocumentBlock({
        id: 'nested-callout',
        type: 'document.callout',
        state: { text: 'Document links are extracted by sdui-document and rendered as SDUI Span nodes.' },
        children: [
          createDocumentBlock({
            id: 'nested-child-text',
            type: 'document.paragraph',
            state: { text: 'Child blocks stay in the semantic tree even when rendered through generic Div nodes.' },
          }),
        ],
      }),
      createDocumentBlock({
        id: 'related-link',
        type: 'document.link',
        state: { text: 'Open architecture ADR' },
        attributes: { href: '/docs/architecture-adr', targetDocumentId: 'architecture-adr' },
      }),
    ],
  }),
}

export const adapterMediaContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'media-root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'media-heading',
        type: 'document.heading',
        state: { text: 'Media-heavy Notes', level: 2 },
      }),
      createDocumentBlock({
        id: 'media-paragraph',
        type: 'document.paragraph',
        state: { text: 'Image/file blocks are metadata-first in the headless model.' },
      }),
      createDocumentBlock({
        id: 'media-image',
        type: 'document.image',
        state: { text: 'Architecture diagram placeholder' },
        attributes: { src: '/architecture-diagram.png', alt: 'Architecture diagram placeholder' },
      }),
      createDocumentBlock({
        id: 'media-file',
        type: 'document.file',
        state: { text: 'implementation-plan.pdf' },
        attributes: { title: 'implementation-plan.pdf', size: '240 KB' },
      }),
      createDocumentBlock({
        id: 'media-callout',
        type: 'document.callout',
        state: { text: 'Actual object storage is intentionally an adapter contract, not part of the renderer.' },
      }),
      createDocumentBlock({
        id: 'media-link',
        type: 'document.link',
        state: { text: 'Attachment storage contract' },
        attributes: { href: '/docs/attachment-storage' },
      }),
    ],
  }),
}
