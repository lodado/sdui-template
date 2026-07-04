import {
  createDocumentBlock,
  type SduiDocumentContent,
  toSduiLayoutDocument,
} from '../index';

describe('SDUI layout adapter', () => {
  const content: SduiDocumentContent = {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'doc-root',
      type: 'document.root',
      children: [
        createDocumentBlock({
          id: 'heading',
          type: 'document.heading',
          state: { text: 'Launch plan', level: 1 },
        }),
        createDocumentBlock({
          id: 'paragraph',
          type: 'document.paragraph',
          state: { text: 'Use SDUI blocks without ProseMirror.' },
        }),
        createDocumentBlock({
          id: 'todo',
          type: 'document.checklist',
          state: { text: 'Write Storybook variations', checked: true },
        }),
        createDocumentBlock({ id: 'divider', type: 'document.divider' }),
        createDocumentBlock({
          id: 'callout',
          type: 'document.callout',
          state: { text: 'Block-level collaboration can come later.' },
          attributes: { tone: 'info' },
        }),
        createDocumentBlock({
          id: 'link',
          type: 'document.link',
          state: { text: 'Related document' },
          attributes: { href: '/docs/related' },
        }),
      ],
    }),
  };

  it('maps document content to an SDUI layout document', () => {
    const layout = toSduiLayoutDocument(content, {
      documentId: 'doc-1',
      title: 'Document story',
    });

    expect(layout).toMatchObject({
      version: '1.0.0',
      metadata: { id: 'doc-1', name: 'Document story' },
      root: {
        id: 'doc-root',
        type: 'Div',
        children: [
          expect.objectContaining({ id: 'heading', type: 'Div' }),
          expect.objectContaining({ id: 'paragraph', type: 'Span' }),
          expect.objectContaining({ id: 'todo', type: 'Div' }),
          expect.objectContaining({ id: 'divider', type: 'Div' }),
          expect.objectContaining({ id: 'callout', type: 'Div' }),
          expect.objectContaining({ id: 'link', type: 'Span' }),
        ],
      },
    });
  });

  it('preserves readable text in mapped node state', () => {
    const layout = toSduiLayoutDocument(content);

    expect(layout.root.children?.[0].children?.[0]).toMatchObject({
      type: 'Span',
      state: { text: 'Launch plan' },
    });
    expect(layout.root.children?.[2].children?.[1]).toMatchObject({
      type: 'Span',
      state: { text: 'Write Storybook variations' },
    });
  });
});
