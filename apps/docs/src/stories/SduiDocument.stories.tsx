import { SduiLayoutRenderer } from '@lodado/sdui-template'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  type ActorRole,
  ACTORS,
  adapterBaseContent,
  adapterMediaContent,
  adapterNestedContent,
  type AutosaveStatus,
  buildAutosaveState,
  DocumentPreview,
} from './fixtures'

const meta: Meta<typeof SduiLayoutRenderer> = {
  title: 'Document/Adapter',
  component: SduiLayoutRenderer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Block documents lowered to `SduiLayoutDocument` and rendered through @lodado/sdui-template — ' +
          'no MobX or ProseMirror. Use the controls to explore permission badges and autosave state machine output. ' +
          'For interactive policy details see **Document/Deep Dive/07 · 권한 정책**; for autosave transitions see **06 · Autosave 상태 머신**.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta

type LifecycleArgs = {
  actorRole: ActorRole
  autosaveStatus: AutosaveStatus
}

type Story = StoryObj<LifecycleArgs>

const LIFECYCLE_SUBTITLES: Record<ActorRole, string> = {
  admin: 'Admin can perform privileged document actions.',
  editor: 'Editor can apply block patches and save draft changes.',
  viewer: 'Viewer is read-only and should not see edit controls.',
}

const LIFECYCLE_TITLES: Record<ActorRole, string> = {
  admin: 'Admin access',
  editor: 'Editor access',
  viewer: 'Viewer access',
}

export const LifecycleAndPermissions: Story = {
  name: 'Lifecycle & Permissions',
  args: {
    actorRole: 'editor',
    autosaveStatus: 'dirty',
  },
  argTypes: {
    actorRole: {
      control: 'select',
      options: ['admin', 'editor', 'viewer'] satisfies ActorRole[],
      description: 'Workspace/collection role — drives `canPerformDocumentAction` badges.',
    },
    autosaveStatus: {
      control: 'select',
      options: ['dirty', 'saving', 'failed', 'offline', 'saved'] satisfies AutosaveStatus[],
      description: 'Reduced autosave state machine output shown in the header badge.',
    },
  },
  render: ({ actorRole, autosaveStatus }) => (
    <DocumentPreview
      title={LIFECYCLE_TITLES[actorRole]}
      subtitle={LIFECYCLE_SUBTITLES[actorRole]}
      content={adapterBaseContent}
      actor={ACTORS[actorRole]}
      autosave={buildAutosaveState(autosaveStatus)}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Interactive preview of actor role × autosave status. Replaces the previous separate stories for ' +
          'read-only knowledge base, editable draft, saving/failure grids, and the three-column permission matrix.',
      },
    },
  },
}

export const ContentVariations: Story = {
  name: 'Content Variations',
  render: () => (
    <div className="grid min-h-screen gap-8 bg-slate-100 p-6">
      <DocumentPreview
        title="Nested blocks and document links"
        subtitle="Nested semantic blocks are lowered to generic SDUI nodes by the layout adapter."
        content={adapterNestedContent}
        actor={ACTORS.admin}
        autosave={buildAutosaveState('saved')}
      />
      <DocumentPreview
        title="Media and attachment contract"
        subtitle="Object storage is represented as document metadata and linked adapter contracts, not direct renderer logic."
        content={adapterMediaContent}
        actor={ACTORS.editor}
        autosave={buildAutosaveState('offline')}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Adapter lowering for nested trees, cross-document links, and media/file metadata — ' +
          'the renderer never talks to object storage directly.',
      },
    },
  },
}
