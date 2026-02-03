/* eslint-disable react/no-unescaped-entities */
/* eslint-disable local-rules/no-console-log */
import { type SduiLayoutDocument, SduiLayoutRenderer } from '@lodado/sdui-template'
import { sduiComponents } from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useState } from 'react'

const meta: Meta<typeof SduiLayoutRenderer> = {
  title: 'Example/Dynamic Document Update',
  component: SduiLayoutRenderer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Overview

This example tests the behavior of the SDUI Renderer when **documents are dynamically changed**.

### Test Scenario

1. **Initial State**: 3 toggles are displayed
2. **Button Click**: Clicking the "Add Toggle" button adds one toggle at a time
3. **State Preservation Test**:
   - Click each toggle to change its state (ON/OFF)
   - Click the "Add Toggle" button to update the document
   - **Important**: Verify that existing toggle states are preserved even when the document is updated

### Improvements

- ✅ Store instance is maintained and not recreated
- ✅ Only \`updateLayout\` is called when the document changes
- ✅ Existing subscribers are not disconnected
- ✅ Component state is preserved

### Expected Behavior

- **Existing toggle states (ON/OFF) should be preserved** even when the document is updated
- Only new toggles should be added, existing toggles should not be affected
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
      children: toggles,
    },
  }
}

/**
 * Dynamic Document Update Example
 *
 * Each time the button is clicked, one toggle is added.
 * Tests whether existing toggle states are preserved when the document is updated.
 */
export const DynamicToggleAddition: Story = {
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
              <strong>Verify that existing toggle states are preserved</strong>
            </li>
            <li>Newly added toggles start in the OFF state</li>
          </ol>

          <SduiLayoutRenderer
            document={document}
            components={sduiComponents}
            onLayoutChange={(doc) => {
              console.log('Document updated:', doc)
            }}
            onError={(error) => {
              console.error('SDUI Error:', error)
            }}
          />
        </div>

        <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
          <strong>Test Point:</strong> Even when the document is updated, existing toggle states (ON/OFF) should
          be preserved and not reset. If states are reset, it means the store is being recreated.
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
## Dynamic Document Update Test

This story tests the behavior of the SDUI Renderer when **documents are dynamically changed**.

### Test Procedure

1. Initially, 3 toggles are displayed
2. Click each toggle to change its state (ON/OFF)
3. Click the "Add Toggle" button to add a toggle
4. **Verify that existing toggle states are preserved**

### Expected Results

- ✅ Existing toggle states (ON/OFF) are preserved
- ✅ Only new toggles are added
- ✅ Store instance is not recreated
- ✅ Subscriber connections are not broken

### Previous Issues

In the previous implementation, whenever the \`document\` changed:
- ❌ Store instance was recreated
- ❌ Existing subscribers were disconnected
- ❌ Component state was reset

### After Improvement

In the current implementation:
- ✅ Store instance is maintained
- ✅ \`useEffect\` detects \`document\` changes and only calls \`updateLayout\`
- ✅ Existing state is preserved
        `,
      },
    },
  },
}
