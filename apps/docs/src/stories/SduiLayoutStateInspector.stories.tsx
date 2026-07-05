import { createDocumentBlock, type SduiDocumentContent } from '@lodado/sdui-document'
import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { SduiLayoutRenderer, SduiLayoutStateInspector } from '@lodado/sdui-template'
import { sduiComponents } from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { EditorWithStateInspector } from './architecture/demos/EditorWithStateInspector'

const meta: Meta = {
  title: 'Debug/SDUI Layout State Inspector',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Inspect sdui-template internal JSON: denormalized document, normalized nodes map, and store metadata. ' +
          'Use the connected variant inside SduiLayoutRenderer, or pass a layout document directly.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj

const toggleDocument: SduiLayoutDocument = {
  version: '1.0.0',
  metadata: { id: 'inspector-demo', name: 'Toggle demo' },
  root: {
    id: 'root',
    type: 'Div',
    children: [
      {
        id: 'toggle-1',
        type: 'Toggle',
        state: { isChecked: false, label: 'Subscribe to store changes' },
      },
      {
        id: 'toggle-2',
        type: 'Toggle',
        state: { isChecked: true, label: 'Only changed nodes re-render' },
      },
    ],
  },
}

export const ConnectedToRenderer: Story = {
  name: 'Live store (SduiLayoutRenderer)',
  render: () => (
    <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: 16, background: '#fff' }}>
      <SduiLayoutRenderer document={toggleDocument} components={sduiComponents}>
        <SduiLayoutStateInspector title="Live SduiLayoutStore" maxHeight={480} />
      </SduiLayoutRenderer>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Toggle switches mutate SduiLayoutStore. The inspector is rendered as a child of SduiLayoutRenderer ' +
          '(inside SduiLayoutProvider) and updates live when you flip toggles — check the Nodes tab.',
      },
    },
  },
}

const sampleContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'document-root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'heading-1',
        type: 'document.heading',
        state: {
          content: [{ type: 'text', text: 'Edit me — watch layout JSON', marks: [{ type: 'bold' }] }],
          text: 'Edit me — watch layout JSON',
        },
        attributes: { level: 1 },
      }),
      createDocumentBlock({
        id: 'paragraph-1',
        type: 'document.paragraph',
        state: {
          text: 'Type, split blocks with Enter, indent with Tab. The right panel shows domain content and the lowered SDUI layout.',
        },
      }),
    ],
  }),
}

export const DocumentReactEditFlow: Story = {
  name: 'Document editor → layout JSON',
  render: () => <EditorWithStateInspector content={sampleContent} title="Editor → toSduiLayoutDocument" />,
  parameters: {
    docs: {
      description: {
        story:
          'When @lodado/sdui-document-react applies patches, the parent tracks SduiDocumentContent and runs ' +
          'toSduiLayoutDocument on each change. The inspector shows what sdui-template would normalize/render.',
      },
    },
  },
}
