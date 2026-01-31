import { type SduiLayoutDocument,SduiLayoutRenderer } from '@lodado/sdui-template'
import { sduiComponents } from '@lodado/sdui-template-component'
import { createProseMirrorDoc,ProseMirrorRenderer } from '@lodado/sdui-template-prosemirror'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

const meta: Meta<typeof ProseMirrorRenderer> = {
  title: 'SDUI/ProseMirrorRenderer',
  component: ProseMirrorRenderer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Overview

The **ProseMirrorRenderer** component renders a ProseMirror editor within SDUI documents.
It syncs the ProseMirror document state back into the SDUI store via node state updates.

## Highlights

- **SDUI integration**: Uses node state as the single source of truth
- **Editor state sync**: Updates SDUI on document changes
- **Customizable styling**: Leverages SDUI attributes for className/style
        `,
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof ProseMirrorRenderer>

export const Default: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'p-6',
        },
        children: [
          {
            id: 'editor-1',
            type: 'ProseMirrorRenderer',
            attributes: {
              className: 'min-h-[140px] rounded border border-[var(--color-border-default)] p-4',
            },
            state: {
              doc: createProseMirrorDoc('Start typing in ProseMirror…'),
              editable: true,
            },
          },
        ],
      },
    }

    const components = {
      ...sduiComponents,
      ProseMirrorRenderer: (id: string) => <ProseMirrorRenderer id={id} />,
    }

    return <SduiLayoutRenderer document={document} components={components} />
  },
}
