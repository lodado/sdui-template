import type { SduiDocument, SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock, createDocumentId, createWorkspaceId, PAGE_BLOCK_TYPE } from '@lodado/sdui-document'
import { Breadcrumbs, SduiDocumentEditor, SduiPageProvider } from '@lodado/sdui-document-react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useMemo, useRef, useState } from 'react'

const meta: Meta = {
  title: 'Document/Page Navigation',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Notion-style sub-page navigation (plan-01). A `document.page` block references another document; ' +
          'the library only calls the injected navigator — `push` swaps the full page (host routing), the hover ' +
          '⧉ action opens the built-in side-peek dialog (no `peek` injected → provider fallback). ' +
          'In the editable story, `/page` creates a new document through `onCreatePage` and deleting a page ' +
          'block archives its target via `onArchivePage`.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta

/** In-memory 3-document vault: home → project-a / project-b. */
function makeVault(): Map<string, SduiDocument> {
  const doc = (id: string, title: string, parent: string | undefined, content: SduiDocumentContent): SduiDocument => ({
    id: createDocumentId(id),
    workspaceId: createWorkspaceId('storybook'),
    ...(parent ? { parentDocumentId: createDocumentId(parent) } : {}),
    title,
    state: 'published',
    content,
    version: 1,
    createdAt: '2026-07-09T00:00:00.000Z',
    updatedAt: '2026-07-09T00:00:00.000Z',
  })

  const home = doc('home', 'Portfolio', undefined, {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'home-root',
      type: 'document.root',
      children: [
        { id: 'home-h1', type: 'document.heading', state: { text: 'Portfolio' }, attributes: { level: 1 } },
        {
          id: 'home-intro',
          type: 'document.paragraph',
          state: { text: 'Click a page block to push into it; hover and press ⧉ for a side peek.' },
        },
        {
          id: 'home-page-a',
          type: PAGE_BLOCK_TYPE,
          state: { text: 'Project A — SDUI template' },
          attributes: { documentId: 'project-a', icon: '🧩' },
        },
        {
          id: 'home-page-b',
          type: PAGE_BLOCK_TYPE,
          state: { text: 'Project B — Block editor' },
          attributes: { documentId: 'project-b', icon: '📝' },
        },
      ],
    }),
  })

  const projectA = doc('project-a', 'Project A — SDUI template', 'home', {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'pa-root',
      type: 'document.root',
      children: [
        {
          id: 'pa-h1',
          type: 'document.heading',
          state: { text: 'Project A — SDUI template' },
          attributes: { level: 1 },
        },
        {
          id: 'pa-p1',
          type: 'document.paragraph',
          state: { text: 'Server-driven UI runtime with subscription-based rendering.' },
        },
        {
          id: 'pa-quote',
          type: 'document.quote',
          state: { text: 'Only changed nodes re-render — ID-based subscriptions.' },
        },
      ],
    }),
  })

  const projectB = doc('project-b', 'Project B — Block editor', 'home', {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'pb-root',
      type: 'document.root',
      children: [
        {
          id: 'pb-h1',
          type: 'document.heading',
          state: { text: 'Project B — Block editor' },
          attributes: { level: 1 },
        },
        {
          id: 'pb-p1',
          type: 'document.paragraph',
          state: { text: 'Hybrid ProseMirror editor: block tree via patches, inline text via a single PM instance.' },
        },
      ],
    }),
  })

  return new Map([
    ['home', home],
    ['project-a', projectA],
    ['project-b', projectB],
  ])
}

/** Viewer: push swaps the rendered document (host-routing stand-in), peek uses the built-in dialog. */
const ViewerDemo = () => {
  const vault = useMemo(makeVault, [])
  const [currentId, setCurrentId] = useState('home')
  const current = vault.get(currentId)!

  return (
    <SduiPageProvider resolver={async (id) => vault.get(id)} navigator={{ push: (id) => setCurrentId(id) }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <Breadcrumbs documentId={currentId} />
        <SduiDocumentEditor key={currentId} content={current.content} readOnly />
      </div>
    </SduiPageProvider>
  )
}

export const Viewer: StoryObj = {
  render: () => <ViewerDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Read-only viewer. `push` is wired to local state (stand-in for router.push); breadcrumbs resolve the ' +
          '`parentDocumentId` chain. Peek is not injected, so the ⧉ hover action opens the provider fallback dialog.',
      },
    },
  },
}

/** Editable: /page creates documents via onCreatePage; deleting a page block archives via onArchivePage. */
const EditableDemo = () => {
  const vault = useMemo(makeVault, [])
  const home = vault.get('home')!
  const counter = useRef(0)
  const [log, setLog] = useState<string[]>([])
  const appendLog = (line: string) => setLog((prev) => [...prev.slice(-7), line])

  return (
    <SduiPageProvider resolver={async (id) => vault.get(id)} navigator={{ push: (id) => appendLog(`push → ${id}`) }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <SduiDocumentEditor
          content={home.content}
          onCreatePage={async () => {
            counter.current += 1
            const id = `new-page-${counter.current}`
            const title = `New page ${counter.current}`
            vault.set(id, {
              ...vault.get('home')!,
              id: createDocumentId(id),
              parentDocumentId: createDocumentId('home'),
              title,
              state: 'draft',
              content: {
                schemaVersion: '1.0',
                root: createDocumentBlock({ id: `${id}-root`, type: 'document.root', children: [] }),
              },
            })
            appendLog(`onCreatePage → ${id}`)
            return { documentId: id, title }
          }}
          onArchivePage={(documentId) => {
            appendLog(`onArchivePage → ${documentId}`)
          }}
        />
        <pre style={{ fontSize: 12, background: '#f5f5f5', padding: 12, marginTop: 16 }}>
          {log.join('\n') || 'Type "/page" in an empty block, or delete a page block (⠿ → Delete).'}
        </pre>
      </div>
    </SduiPageProvider>
  )
}

export const Editable: StoryObj = {
  render: () => <EditableDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Editor with the page adapters wired to an in-memory vault. The "Page" slash item only appears because ' +
          '`onCreatePage` is provided; the adapter log shows creation and archive calls.',
      },
    },
  },
}

/** Shareable read-only peek: the ⧉ action opens a lightweight viewer preview and mirrors its id to ?peek=… */
const SharablePeekDemo = () => {
  const vault = useMemo(makeVault, [])
  const home = vault.get('home')!

  return (
    <SduiPageProvider
      resolver={async (id) => vault.get(id)}
      navigator={{ push: () => {} }}
      peekReadOnly
      peekUrlParam="peek"
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <SduiDocumentEditor content={home.content} readOnly />
      </div>
    </SduiPageProvider>
  )
}

export const SharablePeek: StoryObj = {
  render: () => <SharablePeekDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Hover a page block and press ⧉: the peek opens read-only through the lightweight `SduiDocumentViewer` ' +
          '(no ProseMirror instantiated) and its id is written to the `?peek=` URL param — reload or share the URL ' +
          'to reopen the same preview, and the browser back button closes it. Enabled via `peekReadOnly` + ' +
          '`peekUrlParam` on `SduiPageProvider`.',
      },
    },
  },
}
