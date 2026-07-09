import type { SduiDocument, SduiDocumentContent } from '@lodado/sdui-document'
import {
  COLLECTION_BLOCK_TYPE,
  createDocumentBlock,
  createDocumentId,
  createWorkspaceId,
  PAGE_BLOCK_TYPE,
} from '@lodado/sdui-document'
import { SduiDocumentEditor, SduiPageProvider } from '@lodado/sdui-document-react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useMemo, useState } from 'react'

const meta: Meta = {
  title: 'Document/Collection Views',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Database-like `document.collection` block (plan-02). Children are page blocks (items); ' +
          '`attributes.view` picks gallery / list / board / timeline. Property values (select, date, ' +
          'dateRange, …) render as chips and are editable in edit mode. Cards navigate through the page context.',
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
const STACK = {
  id: 'stack',
  name: 'Stack',
  type: 'multiSelect' as const,
  options: [
    { id: 'react', label: 'React', color: 'blue' as const },
    { id: 'ts', label: 'TypeScript', color: 'purple' as const },
    { id: 'sdui', label: 'SDUI', color: 'orange' as const },
  ],
}
const PERIOD = { id: 'period', name: 'Period', type: 'dateRange' as const }

function projectItem(id: string, title: string, icon: string, props: Record<string, unknown>) {
  return { id, type: PAGE_BLOCK_TYPE, state: { text: title }, attributes: { documentId: id, icon, properties: props } }
}

function collectionContent(view: string): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        { id: 'h', type: 'document.heading', state: { text: 'Projects' }, attributes: { level: 2 } },
        {
          id: 'col',
          type: COLLECTION_BLOCK_TYPE,
          attributes: {
            view,
            groupBy: 'status',
            sortBy: { propertyId: 'period', direction: 'desc' },
            properties: [STATUS, STACK, PERIOD],
          },
          children: [
            projectItem('proj-sdui', 'SDUI template', '🧩', {
              status: 'shipped',
              stack: ['react', 'ts', 'sdui'],
              period: { start: '2025-06-01', end: '2026-02-01' },
            }),
            projectItem('proj-editor', 'Block editor', '📝', {
              status: 'wip',
              stack: ['react', 'ts'],
              period: { start: '2026-03-01' },
            }),
            projectItem('proj-portfolio', 'Portfolio site', '🎨', {
              status: 'shipped',
              stack: ['react'],
              period: { start: '2024-11-01', end: '2025-01-01' },
            }),
          ],
        },
      ],
    }),
  }
}

const emptyDoc = (id: string, title: string): SduiDocument => ({
  id: createDocumentId(id),
  workspaceId: createWorkspaceId('storybook'),
  title,
  state: 'published',
  content: {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: `${id}-root`,
      type: 'document.root',
      children: [{ id: `${id}-h`, type: 'document.heading', state: { text: title }, attributes: { level: 1 } }],
    }),
  },
  version: 1,
  createdAt: '2026-07-09T00:00:00.000Z',
  updatedAt: '2026-07-09T00:00:00.000Z',
})

const ViewDemo = ({ view, readOnly }: { view: string; readOnly?: boolean }) => {
  const [content, setContent] = useState(() => collectionContent(view))
  const counter = useMemo(() => ({ n: 0 }), [])

  return (
    <SduiPageProvider resolver={async (id) => emptyDoc(id, id)} navigator={{ push: () => {} }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <SduiDocumentEditor
          content={content}
          readOnly={readOnly}
          onContentChange={setContent}
          onCreatePage={async () => {
            counter.n += 1
            return { documentId: `new-${counter.n}`, title: `New project ${counter.n}` }
          }}
        />
      </div>
    </SduiPageProvider>
  )
}

export const Gallery: StoryObj = { render: () => <ViewDemo view="gallery" readOnly /> }
export const Board: StoryObj = { render: () => <ViewDemo view="board" readOnly /> }
export const Timeline: StoryObj = { render: () => <ViewDemo view="timeline" readOnly /> }
export const Editable: StoryObj = {
  render: () => <ViewDemo view="gallery" />,
  parameters: {
    docs: {
      description: {
        story:
          'Edit mode: the toolbar switches views, manages properties, and sets sort/groupBy; property chips ' +
          'open value editors; "+ New" creates an item through onCreatePage.',
      },
    },
  },
}
