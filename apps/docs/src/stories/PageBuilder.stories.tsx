import { createDocumentBlock, type SduiDocumentContent } from '@lodado/sdui-document'
import { documentEditorComponent, documentViewerComponent } from '@lodado/sdui-document-react'
import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { SduiLayoutRenderer } from '@lodado/sdui-template'
import { sduiComponents } from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

const meta: Meta = {
  title: 'Document/Page Builder (SDUI shell + document body)',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The reverse of the `document.sdui` block: a document rendered as an SDUI layout node. ' +
          'The page shell (header, sidebar) is server-driven UI; the body is a document region — ' +
          'editable (`documentEditorComponent`) or read-only (`documentViewerComponent`). ' +
          'Register either factory under a layout node type (here `Document`).',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta

function bodyContent(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({
          id: 'h',
          type: 'document.heading',
          state: { text: 'Editable body region' },
          attributes: { level: 1 },
        }),
        createDocumentBlock({
          id: 'p',
          type: 'document.paragraph',
          state: { text: 'This paragraph is a notion-like document block. The header and sidebar around it are SDUI.' },
        }),
        createDocumentBlock({
          id: 'todo1',
          type: 'document.checklist',
          state: { text: 'Server owns the shell' },
          attributes: { checked: true },
        }),
        createDocumentBlock({
          id: 'todo2',
          type: 'document.checklist',
          state: { text: 'Document owns the body' },
          attributes: { checked: true },
        }),
      ],
    }),
  }
}

// SDUI page shell: header + two-column (sidebar / document body).
function pageLayout(): SduiLayoutDocument {
  return {
    version: '1.0',
    root: {
      id: 'page',
      type: 'Div',
      attributes: { className: 'min-h-screen' },
      children: [
        {
          id: 'header',
          type: 'Card',
          attributes: { className: 'rounded-none border-x-0 border-t-0' },
          children: [{ id: 'header-title', type: 'Text', state: { text: 'Acme Docs — server-driven header' } }],
        },
        {
          id: 'grid',
          type: 'Div',
          attributes: { className: 'grid', style: { gridTemplateColumns: '220px 1fr', gap: 24, padding: 24 } },
          children: [
            {
              id: 'sidebar',
              type: 'Card',
              children: [
                { id: 'nav-title', type: 'Text', state: { text: 'Navigation (SDUI)' } },
                { id: 'nav-1', type: 'Text', state: { text: '• Overview' } },
                { id: 'nav-2', type: 'Text', state: { text: '• Getting started' } },
              ],
            },
            { id: 'body', type: 'Document', state: { content: bodyContent() } },
          ],
        },
      ],
    },
  } as SduiLayoutDocument
}

/** SDUI shell with an editable document body — edits persist to the layout store node state. */
export const EditableBody: StoryObj = {
  render: () => (
    <SduiLayoutRenderer document={pageLayout()} components={{ ...sduiComponents, Document: documentEditorComponent }} />
  ),
}

/** Same shell, read-only document body (published view). */
export const ReadOnlyBody: StoryObj = {
  render: () => (
    <SduiLayoutRenderer document={pageLayout()} components={{ ...sduiComponents, Document: documentViewerComponent }} />
  ),
}
