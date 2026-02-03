/* eslint-disable react/no-unescaped-entities */
/* eslint-disable local-rules/no-console-log */
import { type ComponentFactory, type SduiLayoutDocument, SduiLayoutRenderer, useSduiLayoutAction } from '@lodado/sdui-template'
import { sduiComponents } from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useState } from 'react'

const meta: Meta<typeof SduiLayoutRenderer> = {
  title: 'Example/Reset to Initial',
  component: SduiLayoutRenderer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Overview

This example demonstrates the **reset to initial document** functionality in SDUI.

### Test Scenario

1. **Initial State**: 3 toggles are displayed
2. **State Changes**: Click each toggle to change its state (ON/OFF)
3. **Document Update**: Click "Add Toggle" to add more toggles
4. **Reset to Initial**: Click "Reset to Initial" to restore the document to its initial state

### Key Features

- ✅ Initial document is automatically saved when first loaded
- ✅ \`resetToInitial()\` method restores the document to its initial state
- ✅ All node states are reset to their initial values
- ✅ Document structure returns to the original layout

### Expected Behavior

- **Initial state**: 3 toggles, all in OFF state
- **After changes**: Toggle states can be changed, toggles can be added
- **After reset**: Document returns to initial state (3 toggles, all OFF)
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof SduiLayoutRenderer>

/**
 * Helper function to create a document dynamically
 */
function createDocument(toggleCount: number): SduiLayoutDocument {
  const toggles = Array.from({ length: toggleCount }, (_, index) => ({
    id: `toggle-${index + 1}`,
    type: 'Toggle',
    state: {
      isChecked: false,
      label: `Toggle ${index + 1}`,
    },
  }))

  return {
    version: '1.0.0',
    root: {
      id: 'root',
      type: 'Div',
      state: {},
      children: [
        ...toggles,
        {
          id: 'reset-button-container',
          type: 'Div',
          attributes: { className: 'mt-4 flex justify-center' },
          children: [
            {
              id: 'reset-button',
              type: 'ResetButton',
            },
          ],
        },
      ],
    },
  }
}

/**
 * Reset Button Factory
 * Creates a component that uses useSduiLayoutAction to access the store and call resetToInitial()
 */
const ResetButtonFactory: ComponentFactory = () => {
  const store = useSduiLayoutAction()
  const [error, setError] = useState<string | null>(null)

  const handleReset = () => {
    try {
      store.resetToInitial()
      setError(null)
      console.log('Reset to initial document successful')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('Reset to initial failed:', errorMessage)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleReset}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        type="button"
      >
        Reset to Initial
      </button>
      {error && (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
          Error: {error}
        </div>
      )}
    </div>
  )
}

/**
 * Reset to Initial Example
 *
 * Demonstrates the resetToInitial() functionality:
 * 1. Initial document is loaded (3 toggles)
 * 2. User can change toggle states and add more toggles
 * 3. Click "Reset to Initial" to restore the initial document state
 */
export const ResetToInitialExample: Story = {
  render: () => {
    const [toggleCount, setToggleCount] = useState(3)
    const [document, setDocument] = useState<SduiLayoutDocument>(() => createDocument(3))

    const handleAddToggle = () => {
      const newCount = toggleCount + 1
      setToggleCount(newCount)
      setDocument(createDocument(newCount))
    }

    const handleReset = () => {
      setToggleCount(3)
      setDocument(createDocument(3))
    }

    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleAddToggle}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            type="button"
          >
            Add Toggle ({toggleCount} → {toggleCount + 1})
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            type="button"
          >
            Reset to 3 Toggles
          </button>
          <span className="text-sm text-gray-600">
            Current: {toggleCount} toggles
          </span>
        </div>

        <div className="border border-gray-300 rounded p-4 bg-gray-50">
          <div className="mb-2 text-sm font-semibold text-gray-700">
            Instructions:
          </div>
          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1 mb-4">
            <li>Click each toggle to change its ON/OFF state</li>
            <li>Click the "Add Toggle" button</li>
            <li>
              <strong>Click "Reset to Initial" (rendered via SDUI) to restore the initial document state</strong>
            </li>
            <li>Verify that all toggles return to their initial state (3 toggles, all OFF)</li>
          </ol>

          <SduiLayoutRenderer
            document={document}
            components={{
              ...sduiComponents,
              ResetButton: ResetButtonFactory,
            }}
            onLayoutChange={(doc) => {
              console.log('Document updated:', doc)
            }}
            onError={(error) => {
              console.error('SDUI Error:', error)
            }}
          />
        </div>

        <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
          <strong>Test Point:</strong> The "Reset to Initial" button uses \`store.resetToInitial()\` to restore
          the document to its initial state. This should reset all toggle states to their initial values
          (all OFF) and restore the document structure to 3 toggles, regardless of how many toggles were added
          or what states were changed.
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
## Reset to Initial Document Test

This story demonstrates the \`resetToInitial()\` functionality in SDUI.

### Test Procedure

1. Initially, 3 toggles are displayed (all in OFF state)
2. Click each toggle to change its state (ON/OFF)
3. Click "Add Toggle" to add more toggles to the document
4. Click "Reset to Initial" to restore the document to its initial state
5. **Verify that the document returns to 3 toggles, all in OFF state**

### Expected Results

- ✅ Initial document is automatically saved when first loaded
- ✅ \`resetToInitial()\` restores the document to its initial state
- ✅ All toggle states return to their initial values (all OFF)
- ✅ Document structure returns to the original layout (3 toggles)
- ✅ Store instance is maintained (not recreated)

### Implementation Details

- The initial document is saved automatically when \`updateLayout()\` or \`mergeLayout()\` is first called
- \`resetToInitial()\` internally calls \`updateLayout()\` with the saved initial document
- This ensures that all node states, structure, and variables are restored to their initial values

### Use Cases

- **Undo all changes**: Reset the entire document to its initial state
- **Form reset**: Restore form fields to their initial values
- **Configuration reset**: Restore UI configuration to defaults
        `,
      },
    },
  },
}
