import { type SduiLayoutDocument, SduiLayoutRenderer } from '@lodado/sdui-template'
import { ConfirmDialog, Dialog, sduiComponents,SimpleDialog } from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

const meta: Meta<typeof SimpleDialog> = {
  title: 'Features/Dialog',
  component: SimpleDialog,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'xlarge'],
      description: 'Dialog size',
      table: {
        defaultValue: { summary: 'small' },
      },
    },
    hasCloseButton: {
      control: 'boolean',
      description: 'Whether to show close button',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    title: {
      control: 'text',
      description: 'Dialog title',
    },
    description: {
      control: 'text',
      description: 'Dialog description (optional)',
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
## Overview

The **Dialog** component is a modal overlay following the Atlassian Design System (ADS) specifications. It provides a focused interaction layer for important content or actions.

## Size Variants

| Size | Width | Use Case |
|------|-------|----------|
| \`small\` | 400px | Simple confirmations, alerts |
| \`medium\` | 600px | Forms, settings |
| \`large\` | 800px | Complex content, tables |
| \`xlarge\` | 968px | Full page-like content |

## Appearance Variants (ConfirmDialog)

| Appearance | Description |
|------------|-------------|
| \`default\` | Neutral confirmation |
| \`danger\` | Destructive actions (delete, remove) |
| \`warning\` | Warning actions |

## Features

- Compound component pattern for flexibility
- Keyboard navigation (Escape to close)
- Focus trap and restoration
- ARIA attributes for accessibility
- SDUI template integration
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof SimpleDialog>

// ============================================================================
// Playground
// ============================================================================

export const Playground: Story = {
  args: {
    title: 'Modal Title',
    description: 'This is a description of the dialog content.',
    size: 'small',
    hasCloseButton: true,
  },
  render: (args) => (
    <SimpleDialog
      {...args}
      trigger={
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Open Dialog
        </button>
      }
    >
      <p className="text-sm text-gray-600">
        Dialog body content goes here. You can put any content inside the dialog.
      </p>
    </SimpleDialog>
  ),
  parameters: {
    docs: {
      description: {
        story: `
## Interactive Playground

Use the controls panel to experiment with different dialog configurations.

### Available Controls

- **size**: small, medium, large, xlarge
- **hasCloseButton**: Show/hide close button
- **title**: Dialog title text
- **description**: Optional description text
        `,
      },
    },
  },
}

// ============================================================================
// Size Variants
// ============================================================================

export const SizeSmall: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dialog-small',
        type: 'Dialog',
        state: { open: false },
        children: [
          {
            id: 'trigger',
            type: 'DialogTrigger',
            children: [
              {
                id: 'btn',
                type: 'Button',
                state: { appearance: 'primary' },
                children: [{ id: 'text', type: 'Span', state: { text: 'Open Small Dialog' } }],
              },
            ],
          },
          {
            id: 'portal',
            type: 'DialogPortal',
            children: [
              {
                id: 'content',
                type: 'DialogContent',
                attributes: { size: 'small' },
                children: [
                  {
                    id: 'header',
                    type: 'DialogHeader',
                    attributes: { title: 'Small Dialog (400px)', hasCloseButton: true },
                  },
                  {
                    id: 'body',
                    type: 'DialogBody',
                    children: [
                      {
                        id: 'body-text',
                        type: 'Span',
                        state: { text: 'This is a small dialog, perfect for simple confirmations and alerts.' },
                      },
                    ],
                  },
                  {
                    id: 'footer',
                    type: 'DialogFooter',
                    attributes: { cancelLabel: 'Cancel', confirmLabel: 'Confirm' },
                  },
                ],
              },
            ],
          },
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Small Size (400px)

The smallest dialog size. Best for:
- Simple confirmations
- Alert messages
- Quick actions
        `,
      },
    },
  },
}

export const SizeMedium: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dialog-medium',
        type: 'Dialog',
        state: { open: false },
        children: [
          {
            id: 'trigger',
            type: 'DialogTrigger',
            children: [
              {
                id: 'btn',
                type: 'Button',
                state: { appearance: 'primary' },
                children: [{ id: 'text', type: 'Span', state: { text: 'Open Medium Dialog' } }],
              },
            ],
          },
          {
            id: 'portal',
            type: 'DialogPortal',
            children: [
              {
                id: 'content',
                type: 'DialogContent',
                attributes: { size: 'medium' },
                children: [
                  {
                    id: 'header',
                    type: 'DialogHeader',
                    attributes: { title: 'Medium Dialog (600px)', hasCloseButton: true },
                  },
                  {
                    id: 'body',
                    type: 'DialogBody',
                    children: [
                      {
                        id: 'body-text',
                        type: 'Span',
                        state: { text: 'This is a medium dialog. Suitable for forms, settings panels, and moderate content.' },
                      },
                    ],
                  },
                  {
                    id: 'footer',
                    type: 'DialogFooter',
                    attributes: { cancelLabel: 'Cancel', confirmLabel: 'Save' },
                  },
                ],
              },
            ],
          },
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Medium Size (600px)

A balanced dialog size. Best for:
- Forms and inputs
- Settings panels
- Moderate content
        `,
      },
    },
  },
}

export const SizeLarge: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dialog-large',
        type: 'Dialog',
        state: { open: false },
        children: [
          {
            id: 'trigger',
            type: 'DialogTrigger',
            children: [
              {
                id: 'btn',
                type: 'Button',
                state: { appearance: 'primary' },
                children: [{ id: 'text', type: 'Span', state: { text: 'Open Large Dialog' } }],
              },
            ],
          },
          {
            id: 'portal',
            type: 'DialogPortal',
            children: [
              {
                id: 'content',
                type: 'DialogContent',
                attributes: { size: 'large' },
                children: [
                  {
                    id: 'header',
                    type: 'DialogHeader',
                    attributes: { title: 'Large Dialog (800px)', hasCloseButton: true },
                  },
                  {
                    id: 'body',
                    type: 'DialogBody',
                    children: [
                      {
                        id: 'body-text',
                        type: 'Span',
                        state: { text: 'This is a large dialog. Ideal for complex content, data tables, and detailed views.' },
                      },
                    ],
                  },
                  {
                    id: 'footer',
                    type: 'DialogFooter',
                    attributes: { cancelLabel: 'Cancel', confirmLabel: 'Apply' },
                  },
                ],
              },
            ],
          },
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Large Size (800px)

A spacious dialog size. Best for:
- Complex content
- Data tables
- Detailed views
        `,
      },
    },
  },
}

export const SizeXLarge: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dialog-xlarge',
        type: 'Dialog',
        state: { open: false },
        children: [
          {
            id: 'trigger',
            type: 'DialogTrigger',
            children: [
              {
                id: 'btn',
                type: 'Button',
                state: { appearance: 'primary' },
                children: [{ id: 'text', type: 'Span', state: { text: 'Open XLarge Dialog' } }],
              },
            ],
          },
          {
            id: 'portal',
            type: 'DialogPortal',
            children: [
              {
                id: 'content',
                type: 'DialogContent',
                attributes: { size: 'xlarge' },
                children: [
                  {
                    id: 'header',
                    type: 'DialogHeader',
                    attributes: { title: 'XLarge Dialog (968px)', hasCloseButton: true },
                  },
                  {
                    id: 'body',
                    type: 'DialogBody',
                    children: [
                      {
                        id: 'body-text',
                        type: 'Span',
                        state: { text: 'This is an extra large dialog. Use for full page-like content, comprehensive forms, or complex workflows.' },
                      },
                    ],
                  },
                  {
                    id: 'footer',
                    type: 'DialogFooter',
                    attributes: { cancelLabel: 'Cancel', confirmLabel: 'Submit' },
                  },
                ],
              },
            ],
          },
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## XLarge Size (968px)

The largest dialog size. Best for:
- Full page-like content
- Comprehensive forms
- Complex workflows
        `,
      },
    },
  },
}

// ============================================================================
// Appearance Variants (ConfirmDialog)
// ============================================================================

export const AppearanceDefault: Story = {
  render: () => (
    <ConfirmDialog
      trigger={
        <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
          Default Confirm
        </button>
      }
      title="Confirm Action"
      size="small"
      appearance="default"
      confirmLabel="Confirm"
      cancelLabel="Cancel"
      onConfirm={() => alert('Confirmed!')}
    >
      <p className="text-sm text-gray-600">
        Are you sure you want to proceed with this action?
      </p>
    </ConfirmDialog>
  ),
  parameters: {
    docs: {
      description: {
        story: `
## Default Appearance

Neutral confirmation dialog. Use for general confirmations that don't have destructive consequences.
        `,
      },
    },
  },
}

export const AppearanceDanger: Story = {
  render: () => (
    <ConfirmDialog
      trigger={
        <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Delete Item
        </button>
      }
      title="Delete Item"
      description="This action cannot be undone."
      size="small"
      appearance="danger"
      confirmLabel="Delete"
      cancelLabel="Cancel"
      onConfirm={() => alert('Deleted!')}
    >
      <p className="text-sm text-gray-600">
        Are you sure you want to delete this item? All associated data will be permanently removed.
      </p>
    </ConfirmDialog>
  ),
  parameters: {
    docs: {
      description: {
        story: `
## Danger Appearance

Red-themed confirmation dialog. Use for destructive actions like:
- Delete operations
- Permanent removals
- Irreversible changes
        `,
      },
    },
  },
}

export const AppearanceWarning: Story = {
  render: () => (
    <ConfirmDialog
      trigger={
        <button className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600">
          Proceed with Caution
        </button>
      }
      title="Warning"
      description="This may have unintended consequences."
      size="small"
      appearance="warning"
      confirmLabel="Proceed"
      cancelLabel="Cancel"
      onConfirm={() => alert('Proceeded!')}
    >
      <p className="text-sm text-gray-600">
        This action may affect other parts of the system. Please review before proceeding.
      </p>
    </ConfirmDialog>
  ),
  parameters: {
    docs: {
      description: {
        story: `
## Warning Appearance

Yellow-themed confirmation dialog. Use for actions that need attention:
- Potential side effects
- Important changes
- Actions requiring review
        `,
      },
    },
  },
}

// ============================================================================
// Practical Examples
// ============================================================================

export const WithFormContent: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dialog-form',
        type: 'Dialog',
        state: { open: false },
        children: [
          {
            id: 'trigger',
            type: 'DialogTrigger',
            children: [
              {
                id: 'btn',
                type: 'Button',
                state: { appearance: 'primary' },
                children: [{ id: 'text', type: 'Span', state: { text: 'Edit Profile' } }],
              },
            ],
          },
          {
            id: 'portal',
            type: 'DialogPortal',
            children: [
              {
                id: 'content',
                type: 'DialogContent',
                attributes: { size: 'medium' },
                children: [
                  {
                    id: 'header',
                    type: 'DialogHeader',
                    attributes: { title: 'Edit Profile', hasCloseButton: true },
                  },
                  {
                    id: 'body',
                    type: 'DialogBody',
                    children: [
                      {
                        id: 'form-container',
                        type: 'Div',
                        attributes: { className: 'space-y-4' },
                        children: [
                          {
                            id: 'name-field',
                            type: 'TextField',
                            state: { label: 'Name', placeholder: 'Enter your name' },
                          },
                          {
                            id: 'email-field',
                            type: 'TextField',
                            state: { label: 'Email', placeholder: 'Enter your email', type: 'email' },
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: 'footer',
                    type: 'DialogFooter',
                    attributes: { cancelLabel: 'Cancel', confirmLabel: 'Save Changes' },
                  },
                ],
              },
            ],
          },
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Dialog with Form

A practical example showing a dialog with form fields inside. This pattern is common for:
- Edit forms
- Settings dialogs
- User profile updates
        `,
      },
    },
  },
}

export const ConfirmationPattern: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: { className: 'flex gap-4' },
        children: [
          {
            id: 'dialog-save',
            type: 'Dialog',
            state: { open: false },
            children: [
              {
                id: 'trigger-save',
                type: 'DialogTrigger',
                children: [
                  {
                    id: 'btn-save',
                    type: 'Button',
                    state: { appearance: 'primary' },
                    children: [{ id: 'text-save', type: 'Span', state: { text: 'Save Draft' } }],
                  },
                ],
              },
              {
                id: 'portal-save',
                type: 'DialogPortal',
                children: [
                  {
                    id: 'content-save',
                    type: 'DialogContent',
                    attributes: { size: 'small' },
                    children: [
                      {
                        id: 'header-save',
                        type: 'DialogHeader',
                        attributes: { title: 'Save Draft?', hasCloseButton: true },
                      },
                      {
                        id: 'body-save',
                        type: 'DialogBody',
                        children: [
                          {
                            id: 'body-text-save',
                            type: 'Span',
                            state: { text: 'Your changes will be saved as a draft. You can continue editing later.' },
                          },
                        ],
                      },
                      {
                        id: 'footer-save',
                        type: 'DialogFooter',
                        attributes: { cancelLabel: 'Discard', confirmLabel: 'Save Draft' },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'dialog-delete',
            type: 'Dialog',
            state: { open: false },
            children: [
              {
                id: 'trigger-delete',
                type: 'DialogTrigger',
                children: [
                  {
                    id: 'btn-delete',
                    type: 'Button',
                    state: { appearance: 'danger' },
                    children: [{ id: 'text-delete', type: 'Span', state: { text: 'Delete' } }],
                  },
                ],
              },
              {
                id: 'portal-delete',
                type: 'DialogPortal',
                children: [
                  {
                    id: 'content-delete',
                    type: 'DialogContent',
                    attributes: { size: 'small' },
                    children: [
                      {
                        id: 'header-delete',
                        type: 'DialogHeader',
                        attributes: { title: 'Delete Item?', hasCloseButton: true },
                      },
                      {
                        id: 'body-delete',
                        type: 'DialogBody',
                        children: [
                          {
                            id: 'body-text-delete',
                            type: 'Span',
                            state: { text: 'This action cannot be undone. Are you sure you want to delete this item?' },
                          },
                        ],
                      },
                      {
                        id: 'footer-delete',
                        type: 'DialogFooter',
                        attributes: { cancelLabel: 'Cancel', confirmLabel: 'Delete', appearance: 'danger' },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    }
    return <SduiLayoutRenderer document={document} components={sduiComponents} />
  },
  parameters: {
    docs: {
      description: {
        story: `
## Confirmation Pattern

Multiple confirmation dialogs showing different use cases:
- **Save Draft**: Default appearance for neutral actions
- **Delete**: Danger appearance for destructive actions
        `,
      },
    },
  },
}

export const CompoundPatternExample: Story = {
  render: () => (
    <Dialog.Root>
      <Dialog.Trigger>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Open Compound Dialog
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content size="medium">
          <Dialog.Header>
            <div className="flex-1">
              <Dialog.Title>Compound Pattern</Dialog.Title>
              <Dialog.Description>
                This dialog uses the compound component pattern for maximum flexibility.
              </Dialog.Description>
            </div>
            <Dialog.Close />
          </Dialog.Header>
          <Dialog.Body>
            <p className="text-sm text-gray-600 mb-4">
              The compound pattern gives you full control over the dialog structure.
              You can customize each part independently.
            </p>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Dialog.Root - Context provider</li>
              <li>Dialog.Trigger - Opens the dialog</li>
              <li>Dialog.Portal - Renders in portal</li>
              <li>Dialog.Overlay - Background blanket</li>
              <li>Dialog.Content - Main container</li>
              <li>Dialog.Header - Title area</li>
              <li>Dialog.Body - Content area</li>
              <li>Dialog.Footer - Action buttons</li>
            </ul>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close asChild>
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                Cancel
              </button>
            </Dialog.Close>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Got it!
            </button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  ),
  parameters: {
    docs: {
      description: {
        story: `
## Compound Component Pattern

This example demonstrates the full compound component pattern, giving you maximum control over the dialog structure.

Each sub-component can be styled and positioned independently.
        `,
      },
    },
  },
}

// ============================================================================
// All Sizes Comparison
// ============================================================================

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <SimpleDialog
        trigger={
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Small (400px)
          </button>
        }
        title="Small Dialog"
        size="small"
      >
        <p className="text-sm text-gray-600">This is a small dialog.</p>
      </SimpleDialog>

      <SimpleDialog
        trigger={
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Medium (600px)
          </button>
        }
        title="Medium Dialog"
        size="medium"
      >
        <p className="text-sm text-gray-600">This is a medium dialog.</p>
      </SimpleDialog>

      <SimpleDialog
        trigger={
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Large (800px)
          </button>
        }
        title="Large Dialog"
        size="large"
      >
        <p className="text-sm text-gray-600">This is a large dialog.</p>
      </SimpleDialog>

      <SimpleDialog
        trigger={
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            XLarge (968px)
          </button>
        }
        title="XLarge Dialog"
        size="xlarge"
      >
        <p className="text-sm text-gray-600">This is an extra large dialog.</p>
      </SimpleDialog>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
## All Sizes Comparison

Quick comparison of all available dialog sizes. Click each button to see the different widths.
        `,
      },
    },
  },
}
