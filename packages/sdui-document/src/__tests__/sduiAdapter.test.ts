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
        createDocumentBlock({
          id: 'image',
          type: 'document.image',
          state: { text: 'Architecture diagram' },
          attributes: { src: '/diagram.png' },
        }),
        createDocumentBlock({
          id: 'file',
          type: 'document.file',
          state: { text: 'Requirements.pdf' },
          attributes: { size: '240 KB' },
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
          expect.objectContaining({ id: 'image', type: 'Div' }),
          expect.objectContaining({ id: 'file', type: 'Div' }),
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

  it('uses Outline-derived editor tokens and block classes', () => {
    const layout = toSduiLayoutDocument(content);

    expect(layout.root.attributes?.className).toContain('#FFFFFF');
    expect(layout.root.attributes?.className).toContain('#111319');
    expect(layout.root.children?.[3].attributes?.className).toContain('bg-[#DAE1E9]');
    expect(layout.root.children?.[4].attributes?.className).toContain('notice-block info');
    expect(layout.root.children?.[5].attributes?.className).toContain('use-hover-preview');
    expect(layout.root.children?.[5].attributes?.className).toContain('#0366d6');
    expect(layout.root.children?.[6].attributes?.className).toContain('image');
    expect(layout.root.children?.[7].attributes?.className).toContain('attachment');
  });

});
