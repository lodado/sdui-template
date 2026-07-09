import type { SduiDocument, SduiDocumentContent } from '@lodado/sdui-document'
import {
  BOOKMARK_BLOCK_TYPE,
  BUTTON_BLOCK_TYPE,
  CALLOUT_BLOCK_TYPE,
  CHECKLIST_BLOCK_TYPE,
  CODE_BLOCK_TYPE,
  COLLECTION_BLOCK_TYPE,
  COLUMN_BLOCK_TYPE,
  COLUMN_LIST_BLOCK_TYPE,
  createDocumentBlock,
  DIVIDER_BLOCK_TYPE,
  EMBED_BLOCK_TYPE,
  FILE_BLOCK_TYPE,
  HEADING_BLOCK_TYPE,
  IMAGE_BLOCK_TYPE,
  LINK_BLOCK_TYPE,
  PAGE_BLOCK_TYPE,
  PARAGRAPH_BLOCK_TYPE,
  TAGS_BLOCK_TYPE,
  TOGGLE_BLOCK_TYPE,
  VIDEO_BLOCK_TYPE,
} from '@lodado/sdui-document'
import { SduiDocumentEditor, SduiEmbedConfigProvider, SduiPageProvider } from '@lodado/sdui-document-react'
import type { Meta, StoryObj } from '@storybook/react-vite'

// Constants not re-exported from the package barrel — use the literal type strings.
const BULLETED_LIST_BLOCK_TYPE = 'document.bulleted-list'
const NUMBERED_LIST_BLOCK_TYPE = 'document.numbered-list'
const QUOTE_BLOCK_TYPE = 'document.quote'
const TOC_BLOCK_TYPE = 'document.toc'

const meta: Meta = {
  title: 'Document/All Blocks',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Catalog of every built-in `document.*` block, rendered read-only in a single document. ' +
          'One meaningful example per block type — the same JSON the server would send. Embed-family ' +
          'blocks are wrapped in `SduiEmbedConfigProvider`; page/collection cards resolve through ' +
          '`SduiPageProvider`.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta

/** Section label — a level-3 heading that also feeds the ToC example. */
const section = (id: string, text: string) => ({
  id,
  type: HEADING_BLOCK_TYPE,
  state: { text },
  attributes: { level: 3 },
})

const STATUS = {
  id: 'status',
  name: 'Status',
  type: 'select' as const,
  options: [
    { id: 'shipped', label: 'Shipped', color: 'green' as const },
    { id: 'wip', label: 'In progress', color: 'yellow' as const },
  ],
}

const content: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'root',
    type: 'document.root',
    children: [
      { id: 'title', type: HEADING_BLOCK_TYPE, state: { text: 'Block catalog' }, attributes: { level: 1 } },
      {
        id: 'intro',
        type: PARAGRAPH_BLOCK_TYPE,
        state: {
          content: [
            { type: 'text', text: 'Paragraph text supports ' },
            { type: 'text', text: 'bold', marks: [{ type: 'bold' }] },
            { type: 'text', text: ', ' },
            { type: 'text', text: 'italic', marks: [{ type: 'italic' }] },
            { type: 'text', text: ', and ' },
            { type: 'text', text: 'code', marks: [{ type: 'code' }] },
            { type: 'text', text: ' marks.' },
          ],
          text: 'Paragraph text supports bold, italic, and code marks.',
        },
      },

      section('s-toc', 'Table of contents'),
      { id: 'toc', type: TOC_BLOCK_TYPE },

      section('s-headings', 'Headings'),
      { id: 'h1', type: HEADING_BLOCK_TYPE, state: { text: 'Heading level 1' }, attributes: { level: 1 } },
      { id: 'h2', type: HEADING_BLOCK_TYPE, state: { text: 'Heading level 2' }, attributes: { level: 2 } },
      { id: 'h3', type: HEADING_BLOCK_TYPE, state: { text: 'Heading level 3' }, attributes: { level: 3 } },

      section('s-lists', 'Lists'),
      {
        id: 'ul',
        type: BULLETED_LIST_BLOCK_TYPE,
        state: { text: 'Bulleted item' },
        children: [{ id: 'ul-nested', type: BULLETED_LIST_BLOCK_TYPE, state: { text: 'Nested bullet' } }],
      },
      { id: 'ol1', type: NUMBERED_LIST_BLOCK_TYPE, state: { text: 'First numbered item' } },
      { id: 'ol2', type: NUMBERED_LIST_BLOCK_TYPE, state: { text: 'Second numbered item' } },
      { id: 'cl1', type: CHECKLIST_BLOCK_TYPE, state: { text: 'Done task' }, attributes: { checked: true } },
      { id: 'cl2', type: CHECKLIST_BLOCK_TYPE, state: { text: 'Pending task' }, attributes: { checked: false } },

      section('s-toggle', 'Toggle'),
      {
        id: 'toggle',
        type: TOGGLE_BLOCK_TYPE,
        state: { text: 'Click to expand' },
        attributes: { collapsed: false },
        children: [{ id: 'toggle-child', type: PARAGRAPH_BLOCK_TYPE, state: { text: 'Hidden content revealed.' } }],
      },

      section('s-quote', 'Quote'),
      { id: 'quote', type: QUOTE_BLOCK_TYPE, state: { text: 'The server defines the UI; the client renders it.' } },

      section('s-callouts', 'Callouts'),
      { id: 'ca-info', type: CALLOUT_BLOCK_TYPE, state: { text: 'Info tone' }, attributes: { tone: 'info' } },
      { id: 'ca-tip', type: CALLOUT_BLOCK_TYPE, state: { text: 'Tip tone' }, attributes: { tone: 'tip' } },
      { id: 'ca-warn', type: CALLOUT_BLOCK_TYPE, state: { text: 'Warning tone' }, attributes: { tone: 'warning' } },
      { id: 'ca-ok', type: CALLOUT_BLOCK_TYPE, state: { text: 'Success tone' }, attributes: { tone: 'success' } },

      section('s-divider', 'Divider'),
      { id: 'divider', type: DIVIDER_BLOCK_TYPE },

      section('s-code', 'Code'),
      {
        id: 'code',
        type: CODE_BLOCK_TYPE,
        state: { text: "const store = new SduiLayoutStore()\nstore.updateNodeState('id', { open: true })" },
        attributes: { language: 'typescript' },
      },

      section('s-media', 'Image / File / Link'),
      {
        id: 'image',
        type: IMAGE_BLOCK_TYPE,
        state: { text: '' },
        attributes: { src: 'https://picsum.photos/seed/sdui/640/280', alt: 'Sample image', width: 640, height: 280 },
      },
      {
        id: 'file',
        type: FILE_BLOCK_TYPE,
        state: { text: 'spec.pdf' },
        attributes: { title: 'spec.pdf', size: '128 KB' },
      },
      {
        id: 'link',
        type: LINK_BLOCK_TYPE,
        state: { text: 'Project repository' },
        attributes: { href: 'https://github.com/lodado/sdui-template' },
      },

      section('s-embed', 'Bookmark / Video / Embed'),
      {
        id: 'bookmark',
        type: BOOKMARK_BLOCK_TYPE,
        attributes: {
          url: 'https://github.com/lodado/sdui-template',
          title: '@lodado/sdui-template',
          description: 'Server-Driven UI template library for React.',
          faviconUrl: 'https://github.com/favicon.ico',
        },
      },
      {
        id: 'video',
        type: VIDEO_BLOCK_TYPE,
        attributes: {
          url: 'https://youtu.be/dQw4w9WgXcQ',
          provider: 'youtube',
          videoId: 'dQw4w9WgXcQ',
          aspectRatio: '16:9',
        },
      },
      {
        id: 'embed',
        type: EMBED_BLOCK_TYPE,
        attributes: { url: 'https://codepen.io/team/codepen/embed/PNaGbb', height: 320 },
      },

      section('s-tags', 'Tags'),
      {
        id: 'tags',
        type: TAGS_BLOCK_TYPE,
        attributes: {
          items: [
            { id: 't1', label: 'React', color: 'blue' },
            { id: 't2', label: 'TypeScript', color: 'purple' },
            { id: 't3', label: 'SDUI', color: 'orange' },
          ],
        },
      },

      section('s-buttons', 'Buttons'),
      {
        id: 'btn-p',
        type: BUTTON_BLOCK_TYPE,
        state: { text: 'Primary' },
        attributes: { href: 'https://example.com', variant: 'primary' },
      },
      {
        id: 'btn-s',
        type: BUTTON_BLOCK_TYPE,
        state: { text: 'Secondary' },
        attributes: { href: 'https://example.com', variant: 'secondary' },
      },
      {
        id: 'btn-o',
        type: BUTTON_BLOCK_TYPE,
        state: { text: 'Outline' },
        attributes: { href: 'https://example.com', variant: 'outline' },
      },

      section('s-columns', 'Columns'),
      {
        id: 'cols',
        type: COLUMN_LIST_BLOCK_TYPE,
        children: [
          {
            id: 'col-l',
            type: COLUMN_BLOCK_TYPE,
            attributes: { ratio: 1 },
            children: [{ id: 'col-l-p', type: PARAGRAPH_BLOCK_TYPE, state: { text: 'Left column.' } }],
          },
          {
            id: 'col-r',
            type: COLUMN_BLOCK_TYPE,
            attributes: { ratio: 1 },
            children: [{ id: 'col-r-p', type: PARAGRAPH_BLOCK_TYPE, state: { text: 'Right column.' } }],
          },
        ],
      },

      section('s-collection', 'Collection'),
      {
        id: 'collection',
        type: COLLECTION_BLOCK_TYPE,
        attributes: { view: 'gallery', properties: [STATUS] },
        children: [
          {
            id: 'item-a',
            type: PAGE_BLOCK_TYPE,
            state: { text: 'SDUI template' },
            attributes: { documentId: 'item-a', icon: '🧩', properties: { status: 'shipped' } },
          },
          {
            id: 'item-b',
            type: PAGE_BLOCK_TYPE,
            state: { text: 'Block editor' },
            attributes: { documentId: 'item-b', icon: '📝', properties: { status: 'wip' } },
          },
        ],
      },
    ],
  }),
}

const vault = new Map<string, SduiDocument>()

/** All blocks in one read-only document — the full built-in catalog. */
export const AllBlocks: StoryObj = {
  render: () => (
    <SduiEmbedConfigProvider value={{ allowedHosts: ['codepen.io', 'codesandbox.io'] }}>
      <SduiPageProvider resolver={async (docId) => vault.get(docId)} navigator={{ push: () => {} }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <SduiDocumentEditor content={content} readOnly />
        </div>
      </SduiPageProvider>
    </SduiEmbedConfigProvider>
  ),
}
