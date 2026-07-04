import {
  createDocumentBlock,
  extractDocumentLinks,
  extractPlainText,
  type SduiDocument,
  type SduiDocumentContent,
  walkDocumentBlocks,
} from '../index';

describe('SDUI document schema and content helpers', () => {
  const content: SduiDocumentContent = {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({
          id: 'heading-1',
          type: 'document.heading',
          state: { text: 'Project notes', level: 1 },
        }),
        createDocumentBlock({
          id: 'todo-1',
          type: 'document.checklist',
          state: { text: 'Ship headless core', checked: false },
        }),
        createDocumentBlock({
          id: 'link-1',
          type: 'document.link',
          attributes: { targetDocumentId: 'doc-2', href: '/docs/doc-2' },
        }),
      ],
    }),
  };

  it('allows draft documents without a collection', () => {
    const document: SduiDocument = {
      id: 'doc-1',
      workspaceId: 'workspace-1',
      title: 'Draft',
      state: 'draft',
      content,
      version: 1,
      createdAt: '2026-07-04T00:00:00.000Z',
      updatedAt: '2026-07-04T00:00:00.000Z',
    };

    expect(document.collectionId).toBeUndefined();
  });

  it('walks blocks depth-first from the root', () => {
    const visited: string[] = [];

    walkDocumentBlocks(content, (block) => {
      visited.push(block.id);
    });

    expect(visited).toEqual(['root', 'heading-1', 'todo-1', 'link-1']);
  });

  it('extracts plain text from text-bearing blocks', () => {
    expect(extractPlainText(content)).toBe('Project notes\nShip headless core');
  });

  it('extracts document links from link blocks', () => {
    expect(extractDocumentLinks(content)).toEqual([
      {
        blockId: 'link-1',
        targetDocumentId: 'doc-2',
        href: '/docs/doc-2',
      },
    ]);
  });
});
