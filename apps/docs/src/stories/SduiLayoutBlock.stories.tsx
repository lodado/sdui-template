import type { SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock, SDUI_BLOCK_TYPE } from '@lodado/sdui-document'
import { SduiComponentsProvider, SduiDocumentBridgeProvider, SduiDocumentEditor } from '@lodado/sdui-document-react'
import { SduiDocumentViewer } from '@lodado/sdui-document-react/viewer'
import { useSduiVariable } from '@lodado/sdui-template'
import { sduiComponents } from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useState } from 'react'

const meta: Meta = {
  title: 'Document/SDUI Layout Block',
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
  excludeStories: ['hybridContent'],
}

export default meta

const widgetDocument = {
  version: '1.0',
  root: {
    id: 'promo-card',
    type: 'Card',
    attributes: { className: 'shadow-md' },
    children: [
      { id: 'promo-title', type: 'Text', state: { text: 'Server-driven widget' } },
      {
        id: 'promo-body',
        type: 'Text',
        state: { text: 'This card is an SDUI layout document rendered inside a document block.' },
      },
      { id: 'promo-cta', type: 'Button', state: { text: 'Server-defined CTA' } },
    ],
  },
}

export const hybridContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'h',
        type: 'document.heading',
        state: { text: 'Hybrid document' },
        attributes: { level: 1 },
      }),
      createDocumentBlock({
        id: 'p1',
        type: 'document.paragraph',
        state: {
          text: 'Everything above and below is a normal editable block. The card in the middle is server-driven UI.',
        },
      }),
      createDocumentBlock({ id: 'widget', type: SDUI_BLOCK_TYPE, attributes: { document: widgetDocument } }),
      createDocumentBlock({ id: 'p2', type: 'document.paragraph', state: { text: 'Text after the widget.' } }),
    ],
  }),
}

export const InEditor: StoryObj = {
  render: () => (
    <SduiComponentsProvider value={sduiComponents}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <SduiDocumentEditor content={hybridContent} onContentChange={() => {}} />
      </div>
    </SduiComponentsProvider>
  ),
}

export const InViewer: StoryObj = {
  render: () => (
    <SduiComponentsProvider value={sduiComponents}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <SduiDocumentViewer content={hybridContent} />
      </div>
    </SduiComponentsProvider>
  ),
}

export const BlockedWithoutProvider: StoryObj = {
  render: () => (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <SduiDocumentViewer content={hybridContent} />
    </div>
  ),
}

// ---- State bridge demo: document checklist → live progress widget ----

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

const bridgeContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'h',
        type: 'document.heading',
        state: { text: 'Checklist with live widget' },
        attributes: { level: 2 },
      }),
      createDocumentBlock({
        id: 't1',
        type: 'document.checklist',
        state: { text: 'Write the doc' },
        attributes: { checked: true },
      }),
      createDocumentBlock({
        id: 't2',
        type: 'document.checklist',
        state: { text: 'Review it' },
        attributes: { checked: false },
      }),
      createDocumentBlock({
        id: 't3',
        type: 'document.checklist',
        state: { text: 'Ship it' },
        attributes: { checked: false },
      }),
      createDocumentBlock({
        id: 'progress',
        type: SDUI_BLOCK_TYPE,
        attributes: { document: { version: '1.0', root: { id: 'progress-root', type: 'Progress' } } },
      }),
    ],
  }),
}

/** Toggle the checklists — the embedded widget updates through the document→layout variable bridge. */
export const StateBridge: StoryObj = {
  render: () => {
    const [content, setContent] = useState(bridgeContent)

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
