import type { SduiDocument, SduiDocumentContent } from '@lodado/sdui-document'
import {
  BOOKMARK_BLOCK_TYPE,
  BUTTON_BLOCK_TYPE,
  COLLECTION_BLOCK_TYPE,
  createDocumentBlock,
  createDocumentId,
  createWorkspaceId,
  PAGE_BLOCK_TYPE,
  TAGS_BLOCK_TYPE,
  VIDEO_BLOCK_TYPE,
} from '@lodado/sdui-document'
import { SduiDocumentEditor, SduiEmbedConfigProvider, SduiPageProvider } from '@lodado/sdui-document-react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useMemo, useState } from 'react'

const meta: Meta = {
  title: 'Document/Portfolio Template',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A full portfolio home document assembled from the plan-01…04 blocks: a hero built from existing ' +
          'column/heading/paragraph blocks, a tags (skill) row, a project gallery collection, a career timeline ' +
          'collection, a bookmark, and a contact button. Click a project card to peek into its detail document.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta

const STATUS = {
  id: 'status',
  name: 'Status',
  type: 'select' as const,
  options: [
    { id: 'shipped', label: 'Shipped', color: 'green' as const },
    { id: 'wip', label: 'In progress', color: 'yellow' as const },
  ],
}
const PERIOD = { id: 'period', name: 'Period', type: 'dateRange' as const }
const ROLE = { id: 'role', name: 'Role', type: 'text' as const }

const projectItem = (id: string, title: string, icon: string, props: Record<string, unknown>) => ({
  id,
  type: PAGE_BLOCK_TYPE,
  state: { text: title },
  attributes: { documentId: id, icon, properties: props },
})

const home: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'home-root',
    type: 'document.root',
    children: [
      // hero — existing blocks (column-list + heading/paragraph), no dedicated block
      {
        id: 'hero',
        type: 'document.column-list',
        children: [
          {
            id: 'hero-l',
            type: 'document.column',
            attributes: { ratio: 2 },
            children: [
              { id: 'hero-h', type: 'document.heading', state: { text: 'Jane Doe' }, attributes: { level: 1 } },
              {
                id: 'hero-p',
                type: 'document.paragraph',
                state: { text: 'Frontend engineer building server-driven UI systems and design tooling.' },
              },
              {
                id: 'hero-cta',
                type: BUTTON_BLOCK_TYPE,
                state: { text: 'Get in touch' },
                attributes: { href: 'mailto:jane@example.com', variant: 'primary' },
              },
            ],
          },
          {
            id: 'hero-r',
            type: 'document.column',
            attributes: { ratio: 1 },
            children: [{ id: 'hero-img', type: 'document.image', attributes: { src: '', alt: 'avatar' } }],
          },
        ],
      },
      { id: 'skills-h', type: 'document.heading', state: { text: 'Skills' }, attributes: { level: 3 } },
      {
        id: 'skills',
        type: TAGS_BLOCK_TYPE,
        attributes: {
          items: [
            { id: 's1', label: 'React', color: 'blue' },
            { id: 's2', label: 'TypeScript', color: 'purple' },
            { id: 's3', label: 'SDUI', color: 'orange' },
            { id: 's4', label: 'ProseMirror', color: 'green' },
          ],
        },
      },
      { id: 'proj-h', type: 'document.heading', state: { text: 'Projects' }, attributes: { level: 3 } },
      {
        id: 'projects',
        type: COLLECTION_BLOCK_TYPE,
        attributes: {
          view: 'gallery',
          sortBy: { propertyId: 'period', direction: 'desc' },
          properties: [STATUS, PERIOD],
        },
        children: [
          projectItem('proj-sdui', 'SDUI template', '🧩', {
            status: 'shipped',
            period: { start: '2025-06-01', end: '2026-02-01' },
          }),
          projectItem('proj-editor', 'Notion-style editor', '📝', { status: 'wip', period: { start: '2026-03-01' } }),
        ],
      },
      { id: 'career-h', type: 'document.heading', state: { text: 'Career' }, attributes: { level: 3 } },
      {
        id: 'career',
        type: COLLECTION_BLOCK_TYPE,
        attributes: {
          view: 'timeline',
          sortBy: { propertyId: 'period', direction: 'desc' },
          properties: [PERIOD, ROLE],
        },
        children: [
          projectItem('job-a', 'Acme Corp', '🏢', { role: 'Senior FE', period: { start: '2023-01-01' } }),
          projectItem('job-b', 'Startup Inc', '🚀', {
            role: 'FE Engineer',
            period: { start: '2021-03-01', end: '2022-12-01' },
          }),
        ],
      },
      { id: 'links-h', type: 'document.heading', state: { text: 'Links' }, attributes: { level: 3 } },
      {
        id: 'gh',
        type: BOOKMARK_BLOCK_TYPE,
        attributes: {
          url: 'https://github.com/lodado/sdui-template',
          title: 'github.com/lodado/sdui-template',
          description: 'Server-Driven UI template library.',
        },
      },
    ],
  }),
}

const projectDetail = (id: string, title: string): SduiDocument => ({
  id: createDocumentId(id),
  workspaceId: createWorkspaceId('storybook'),
  parentDocumentId: createDocumentId('home'),
  title,
  state: 'published',
  content: {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: `${id}-root`,
      type: 'document.root',
      children: [
        { id: `${id}-h`, type: 'document.heading', state: { text: title }, attributes: { level: 1 } },
        { id: `${id}-p`, type: 'document.paragraph', state: { text: `Detail page for ${title}.` } },
        {
          id: `${id}-vid`,
          type: VIDEO_BLOCK_TYPE,
          attributes: {
            url: 'https://youtu.be/dQw4w9WgXcQ',
            provider: 'youtube',
            videoId: 'dQw4w9WgXcQ',
            aspectRatio: '16:9',
          },
        },
      ],
    }),
  },
  version: 1,
  createdAt: '2026-07-09T00:00:00.000Z',
  updatedAt: '2026-07-09T00:00:00.000Z',
})

const vault = new Map<string, SduiDocument>([
  ['proj-sdui', projectDetail('proj-sdui', 'SDUI template')],
  ['proj-editor', projectDetail('proj-editor', 'Notion-style editor')],
])

const PortfolioDemo = ({ readOnly }: { readOnly?: boolean }) => {
  const [content, setContent] = useState(home)
  const counter = useMemo(() => ({ n: 0 }), [])

  return (
    <SduiEmbedConfigProvider value={{ allowedHosts: [] }}>
      <SduiPageProvider resolver={async (docId) => vault.get(docId)} navigator={{ push: () => {} }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <SduiDocumentEditor
            content={content}
            readOnly={readOnly}
            onContentChange={setContent}
            onCreatePage={async () => {
              counter.n += 1
              return { documentId: `new-${counter.n}`, title: `New ${counter.n}` }
            }}
          />
        </div>
      </SduiPageProvider>
    </SduiEmbedConfigProvider>
  )
}

export const Home: StoryObj = { render: () => <PortfolioDemo readOnly /> }
export const Editable: StoryObj = { render: () => <PortfolioDemo /> }
