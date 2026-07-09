import {
  type AutosaveState,
  canPerformDocumentAction,
  type SduiDocumentActor,
  type SduiDocumentContent,
  toSduiLayoutDocument,
} from '@lodado/sdui-document'
import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { SduiLayoutRenderer } from '@lodado/sdui-template'
import { sduiComponents } from '@lodado/sdui-template-component'
import React from 'react'

export type ActorRole = 'admin' | 'editor' | 'viewer'

export const ACTORS: Record<ActorRole, SduiDocumentActor> = {
  admin: { id: 'admin', workspaceRole: 'admin' },
  editor: { id: 'editor', workspaceRole: 'member', collectionRole: 'editor' },
  viewer: { id: 'viewer', workspaceRole: 'member', collectionRole: 'viewer' },
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
  return toSduiLayoutDocument(content, {
    documentId: title.toLowerCase().replace(/\s+/g, '-'),
    title,
  }) as SduiLayoutDocument
}

export type DocumentPreviewProps = {
  title: string
  subtitle: string
  content: SduiDocumentContent
  actor?: SduiDocumentActor
  autosave?: AutosaveState
}

export const DocumentPreview = ({
  title,
  subtitle,
  content,
  actor = ACTORS.editor,
  autosave,
}: DocumentPreviewProps) => {
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
