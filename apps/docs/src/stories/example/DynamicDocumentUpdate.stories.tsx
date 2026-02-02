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

이 예제는 **동적으로 document가 변경될 때** SDUI Renderer의 동작을 테스트합니다.

### 테스트 시나리오

1. **초기 상태**: 토글 3개가 표시됩니다
2. **버튼 클릭**: "Add Toggle" 버튼을 누르면 토글이 하나씩 추가됩니다
3. **상태 초기화 테스트**:
   - 각 토글을 클릭하여 상태를 변경합니다 (ON/OFF)
   - "Add Toggle" 버튼을 누르면 document가 업데이트됩니다
   - **중요**: document가 업데이트되어도 기존 토글들의 상태가 유지되는지 확인합니다

### 개선 사항

- ✅ Store 인스턴스가 재생성되지 않고 유지됩니다
- ✅ document 변경 시 \`updateLayout\`만 호출됩니다
- ✅ 기존 구독자들이 끊어지지 않습니다
- ✅ 컴포넌트 상태가 보존됩니다

### 기대 동작

- document가 업데이트되어도 **기존 토글들의 상태(ON/OFF)가 유지**되어야 합니다
- 새로운 토글만 추가되고, 기존 토글은 영향받지 않아야 합니다
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof SduiLayoutRenderer>

/**
 * 동적으로 document를 생성하는 헬퍼 함수
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
 * 동적 Document 업데이트 예제
 *
 * 버튼을 누를 때마다 토글이 하나씩 추가됩니다.
 * document가 업데이트되어도 기존 토글들의 상태가 유지되는지 테스트합니다.
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
            <li>각 토글을 클릭하여 ON/OFF 상태를 변경합니다</li>
            <li>"Add Toggle" 버튼을 클릭합니다</li>
            <li>
              <strong>기존 토글들의 상태가 유지되는지 확인합니다</strong>
            </li>
            <li>새로 추가된 토글은 OFF 상태로 시작합니다</li>
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
          <strong>테스트 포인트:</strong> document가 업데이트되어도 기존 토글들의 상태(ON/OFF)가
          초기화되지 않고 유지되어야 합니다. 만약 상태가 초기화된다면, store가 재생성되고 있다는
          의미입니다.
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
## 동적 Document 업데이트 테스트

이 스토리는 **document가 동적으로 변경될 때** SDUI Renderer의 동작을 테스트합니다.

### 테스트 절차

1. 초기 상태에서 토글 3개가 표시됩니다
2. 각 토글을 클릭하여 상태를 변경합니다 (ON/OFF)
3. "Add Toggle" 버튼을 클릭하여 토글을 추가합니다
4. **기존 토글들의 상태가 유지되는지 확인합니다**

### 기대 결과

- ✅ 기존 토글들의 상태(ON/OFF)가 유지됩니다
- ✅ 새로운 토글만 추가됩니다
- ✅ Store 인스턴스가 재생성되지 않습니다
- ✅ 구독자 연결이 끊어지지 않습니다

### 개선 전 문제점

이전 구현에서는 \`document\`가 변경될 때마다:
- ❌ Store 인스턴스가 재생성되었습니다
- ❌ 기존 구독자들이 끊어졌습니다
- ❌ 컴포넌트 상태가 초기화되었습니다

### 개선 후

현재 구현에서는:
- ✅ Store 인스턴스가 유지됩니다
- ✅ \`useEffect\`로 \`document\` 변경을 감지하여 \`updateLayout\`만 호출합니다
- ✅ 기존 상태가 보존됩니다
        `,
      },
    },
  },
}
