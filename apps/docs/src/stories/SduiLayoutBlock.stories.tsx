import type { SduiDocumentContent } from '@lodado/sdui-document'
import { SduiComponentsProvider, SduiDocumentBridgeProvider, SduiDocumentEditor } from '@lodado/sdui-document-react'
import { SduiDocumentViewer } from '@lodado/sdui-document-react/viewer'
import { useSduiVariable } from '@lodado/sdui-template'
import { sduiComponents } from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useState } from 'react'

import { hybridSduiContent, stateBridgeContent } from './fixtures'

const meta: Meta = {
  title: 'Document/Hybrid/SDUI Layout Block',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The `document.sdui` block embeds a server-defined SDUI layout document inside a text document — ' +
          'the hybrid direction: notion-like blocks and `SduiLayoutRenderer` widgets in one page. ' +
          'The host controls what may render via `SduiComponentsProvider` (no provider → placeholder, ' +
          'same blocked-by-default posture as iframe embeds).',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta

export const InEditor: StoryObj = {
  render: () => (
    <SduiComponentsProvider value={sduiComponents}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <SduiDocumentEditor content={hybridSduiContent} onContentChange={() => {}} />
      </div>
    </SduiComponentsProvider>
  ),
}

export const InViewer: StoryObj = {
  render: () => (
    <SduiComponentsProvider value={sduiComponents}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <SduiDocumentViewer content={hybridSduiContent} />
      </div>
    </SduiComponentsProvider>
  ),
}

export const BlockedWithoutProvider: StoryObj = {
  render: () => (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <SduiDocumentViewer content={hybridSduiContent} />
    </div>
  ),
}

function countChecked(content: SduiDocumentContent): number {
  return (content.root.children ?? []).filter((child) => child.attributes?.checked === true).length
}

const ProgressWidget = () => {
  const done = useSduiVariable<number>('doc.checkedCount')
  const total = useSduiVariable<number>('doc.checklistTotal')

  return (
    <div style={{ padding: 16, borderRadius: 12, background: '#eef2ff', fontWeight: 600 }}>
      Progress (server-driven widget): {done ?? 0} / {total ?? 0} done
    </div>
  )
}

const bridgeComponents = { ...sduiComponents, Progress: () => <ProgressWidget /> }

export const StateBridge: StoryObj = {
  render: () => {
    const [content, setContent] = useState(stateBridgeContent)

    return (
      <SduiComponentsProvider value={bridgeComponents}>
        <SduiDocumentBridgeProvider
          value={(doc) => ({
            'doc.checkedCount': countChecked(doc),
            'doc.checklistTotal': (doc.root.children ?? []).filter((child) => child.type === 'document.checklist')
              .length,
          })}
        >
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <SduiDocumentEditor content={content} onContentChange={(next) => setContent(next)} />
          </div>
        </SduiDocumentBridgeProvider>
      </SduiComponentsProvider>
    )
  },
}
