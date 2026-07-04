import {
  type AutosaveState,
  canPerformDocumentAction,
  createDocumentBlock,
  createInitialAutosaveState,
  reduceAutosaveState,
  type SduiDocumentActor,
  type SduiDocumentContent,
  toSduiLayoutDocument,
} from '@lodado/sdui-document'
import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { SduiLayoutRenderer } from '@lodado/sdui-template'
import { sduiComponents } from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta: Meta<typeof SduiLayoutRenderer> = {
  title: 'Document/SDUI Block Document',
  component: SduiLayoutRenderer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Clean-room block document examples rendered through @lodado/sdui-template without MobX or ProseMirror.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof SduiLayoutRenderer>

type DocumentPreviewProps = {
  title: string
  subtitle: string
  content: SduiDocumentContent
  actor?: SduiDocumentActor
  autosave?: AutosaveState
}

const adminActor: SduiDocumentActor = { id: 'admin', workspaceRole: 'admin' }
const editorActor: SduiDocumentActor = {
  id: 'editor',
  workspaceRole: 'member',
  collectionRole: 'editor',
}
const viewerActor: SduiDocumentActor = {
  id: 'viewer',
  workspaceRole: 'member',
  collectionRole: 'viewer',
}

const baseContent: SduiDocumentContent = {
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

const nestedContent: SduiDocumentContent = {
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

const imageLikeContent: SduiDocumentContent = {
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

function statusBadge(autosave?: AutosaveState): string {
  if (!autosave) {
    return 'clean'
  }

  return `${autosave.status} · local v${autosave.localVersion} · ack v${autosave.acknowledgedVersion} · ${autosave.pendingPatchCount} pending`
}

function accessBadge(actor?: SduiDocumentActor): string {
  if (!actor) {
    return 'no actor'
  }

  const read = canPerformDocumentAction({ actor, action: 'read' }).allowed
  const update = canPerformDocumentAction({ actor, action: 'update' }).allowed

  if (update) {
    return 'editable'
  }

  return read ? 'read only' : 'hidden'
}

function renderDocument(content: SduiDocumentContent, title: string): SduiLayoutDocument {
  return toSduiLayoutDocument(content, { documentId: title.toLowerCase().replace(/\s+/g, '-'), title }) as SduiLayoutDocument
}

const DocumentPreview = ({ title, subtitle, content, actor = editorActor, autosave }: DocumentPreviewProps) => {
  return (
    <div className="min-h-screen bg-slate-100 px-8 py-10 text-slate-950">
      <div className="mx-auto mb-6 flex max-w-3xl flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">SDUI Document</p>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-medium">
          <span className="rounded-full bg-white px-3 py-1 text-slate-700 ring-1 ring-slate-200">
            access: {accessBadge(actor)}
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-slate-700 ring-1 ring-slate-200">
            autosave: {statusBadge(autosave)}
          </span>
        </div>
      </div>
      <SduiLayoutRenderer document={renderDocument(content, title)} components={sduiComponents} />
    </div>
  )
}

function autosaveState(status: 'dirty' | 'saving' | 'failed' | 'offline' | 'saved'): AutosaveState {
  const dirty = reduceAutosaveState(createInitialAutosaveState(), { type: 'local.change', patchCount: 2 })

  if (status === 'dirty') {
    return dirty
  }

  if (status === 'saving') {
    return reduceAutosaveState(dirty, { type: 'save.request' })
  }

  if (status === 'failed') {
    return reduceAutosaveState(reduceAutosaveState(dirty, { type: 'save.request' }), {
      type: 'save.failure',
      error: 'network_error',
    })
  }

  if (status === 'offline') {
    return reduceAutosaveState(dirty, { type: 'network.offline' })
  }

  return reduceAutosaveState(reduceAutosaveState(dirty, { type: 'save.request' }), {
    type: 'save.success',
    acknowledgedVersion: 1,
  })
}

export const ReadOnlyKnowledgeBase: Story = {
  render: () => (
    <DocumentPreview
      title="Read-only knowledge base"
      subtitle="Viewer role can read the SDUI document but cannot apply block patches."
      content={baseContent}
      actor={viewerActor}
      autosave={autosaveState('saved')}
    />
  ),
}

export const EditableDraft: Story = {
  render: () => (
    <DocumentPreview
      title="Editable draft"
      subtitle="Editor role with dirty local changes waiting for debounce/save."
      content={baseContent}
      actor={editorActor}
      autosave={autosaveState('dirty')}
    />
  ),
}

export const SavingAndFailureStates: Story = {
  render: () => (
    <div className="grid min-h-screen gap-6 bg-slate-100 p-6 xl:grid-cols-2">
      <DocumentPreview
        title="Saving state"
        subtitle="Patch queue has been sent; stale acknowledgements are ignored by the state machine."
        content={baseContent}
        actor={editorActor}
        autosave={autosaveState('saving')}
      />
      <DocumentPreview
        title="Failed save state"
        subtitle="Pending patches stay local after a failed save so the user can retry."
        content={baseContent}
        actor={editorActor}
        autosave={autosaveState('failed')}
      />
    </div>
  ),
}

export const NestedBlocksAndLinks: Story = {
  render: () => (
    <DocumentPreview
      title="Nested blocks and document links"
      subtitle="Nested semantic blocks are lowered to generic SDUI nodes by the layout adapter."
      content={nestedContent}
      actor={adminActor}
      autosave={autosaveState('saved')}
    />
  ),
}

export const MediaAndAttachmentContract: Story = {
  render: () => (
    <DocumentPreview
      title="Media and attachment contract"
      subtitle="Object storage is represented as document metadata and linked adapter contracts, not direct renderer logic."
      content={imageLikeContent}
      actor={editorActor}
      autosave={autosaveState('offline')}
    />
  ),
}

export const PermissionMatrix: Story = {
  render: () => (
    <div className="grid min-h-screen gap-6 bg-slate-100 p-6 xl:grid-cols-3">
      <DocumentPreview
        title="Admin"
        subtitle="Admin can perform privileged document actions."
        content={baseContent}
        actor={adminActor}
        autosave={autosaveState('saved')}
      />
      <DocumentPreview
        title="Editor"
        subtitle="Editor can apply block patches and save draft changes."
        content={baseContent}
        actor={editorActor}
        autosave={autosaveState('dirty')}
      />
      <DocumentPreview
        title="Viewer"
        subtitle="Viewer is read-only and should not see edit controls."
        content={baseContent}
        actor={viewerActor}
        autosave={autosaveState('saved')}
      />
    </div>
  ),
}
