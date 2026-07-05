import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { SduiLayoutRenderer } from '@lodado/sdui-template'
import { sduiComponents } from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { type DeepDiveConfig, DeepDiveTemplate, type Principle } from '../components'

const meta: Meta = {
  title: 'Document/Deep Dive/23 · 컴파운드 컴포넌트',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Dialog·Dropdown·Popover 같은 복합 위젯을 여러 SDUI 타입의 트리로 분해하는 방법 — 부모 타입이 상태를 소유하고 자식 타입은 context로 소비.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const dropdownDoc: SduiLayoutDocument = {
  version: '1.0.0',
  metadata: { id: 'dropdown', name: 'Dropdown compound' },
  root: {
    id: 'dropdown-root',
    type: 'Dropdown',
    state: { selectedId: '1', open: false },
    children: [
      {
        id: 'dd-trigger',
        type: 'DropdownTrigger',
        children: [
          {
            id: 'dd-btn',
            type: 'Button',
            state: { appearance: 'default' },
            children: [
              {
                id: 'dd-value',
                type: 'DropdownValue',
                state: {
                  placeholder: '옵션 선택',
                  options: [
                    { id: '1', label: 'Option 1' },
                    { id: '2', label: 'Option 2' },
                    { id: '3', label: 'Option 3' },
                  ],
                },
              },
            ],
          },
        ],
      },
      {
        id: 'dd-content',
        type: 'DropdownContent',
        state: { side: 'bottom', sideOffset: 4 },
        children: [
          { id: 'dd-item-1', type: 'DropdownItem', state: { value: '1', label: 'Option 1' } },
          { id: 'dd-item-2', type: 'DropdownItem', state: { value: '2', label: 'Option 2' } },
          { id: 'dd-item-3', type: 'DropdownItem', state: { value: '3', label: 'Option 3' } },
        ],
      },
    ],
  },
}

const COMPOUND_CODE = `// 컴파운드 컴포넌트는 "여러 SDUI 타입"으로 분해됩니다.
// Dropdown / DropdownTrigger / DropdownContent / DropdownItem / DropdownValue
{
  type: 'Dropdown', state: { selectedId: '1', open: false },
  children: [
    { type: 'DropdownTrigger', children: [{ type: 'Button', children: [{ type: 'DropdownValue', state: { options } }] }] },
    { type: 'DropdownContent', children: [
      { type: 'DropdownItem', state: { value: '1', label: 'Option 1' } },
    ]},
  ],
}
// 부모 타입이 상태를 소유하고, 자식 타입은 context로 소비 — 트리 그대로가 곧 컴파운드 구조.`

const STEPS: Principle[] = [
  {
    num: '01',
    title: '부모 타입이 상태 소유',
    body: (
      <>
        <code>Dropdown</code> 같은 부모 타입이 열림·선택 상태를 소유합니다. 상태는 트리의 루트 노드 한 곳에만
        존재합니다.
      </>
    ),
  },
  {
    num: '02',
    title: '자식 타입은 context 소비',
    body: (
      <>
        <code>DropdownTrigger·DropdownContent·DropdownItem</code> 는 부모가 내려준 context를 구독해 열림 상태와 선택
        값을 읽습니다.
      </>
    ),
  },
  {
    num: '03',
    title: '트리 = 컴파운드',
    body: <>JSON 트리 구조가 그대로 컴파운드 구조입니다. 별도의 조립 코드 없이 문서 모양이 곧 위젯 모양입니다.</>,
  },
]

const config: DeepDiveConfig = {
  accent: 'components',
  kicker: 'Deep Dive · @lodado/sdui-template-component',
  title: '컴파운드 컴포넌트 · 타입으로 분해',
  lead: 'Dialog·Dropdown·Popover 같은 복합 위젯은 여러 SDUI 타입의 트리로 표현됩니다. 부모 타입이 열림/선택 상태를 소유하고 자식 타입은 context로 소비하므로, JSON 트리 구조가 그대로 컴파운드 구조가 됩니다.',
  pills: ['compound', 'Dropdown', 'Dialog', 'Popover', 'context'],
  steps: STEPS,
  sections: [
    {
      index: '23.1',
      label: 'Compound',
      title: '여러 타입의 트리',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              Dialog·Dropdown·Popover 같은 복합 위젯은 <strong>여러 SDUI 타입의 트리</strong>로 표현됩니다. 부모 타입이
              열림/선택 상태를 소유하고 자식 타입은 context로 소비하므로, JSON 트리 구조가 그대로 컴파운드 구조가
              됩니다.
            </>
          ),
        },
        { kind: 'code', file: 'shared/ui/dropdown/*', code: COMPOUND_CODE },
      ],
    },
    {
      index: '23.2',
      label: 'Live',
      title: 'Dropdown compound',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              아래 드롭다운의 트리거를 눌러 열고 항목을 선택해 보세요. 열림 여부와 선택 값은 <code>Dropdown</code> 루트
              노드가 소유하고, 자식 타입들은 그 상태를 context로 읽어 렌더링합니다.
            </>
          ),
        },
        {
          kind: 'demo',
          title: 'Dropdown compound',
          hint: '트리거를 눌러 열기 — 상태는 Dropdown 노드가 소유',
          node: <SduiLayoutRenderer document={dropdownDoc} components={sduiComponents} />,
        },
        {
          kind: 'badges',
          items: [
            'Dialog · Trigger · Portal · Content · Header · Body · Footer',
            'Dropdown · Trigger · Content · Item · Value',
            'Popover · Trigger · Content · Close',
          ],
        },
      ],
    },
  ],
}

export const CompoundComponents: Story = {
  name: '컴파운드 컴포넌트',
  render: () => <DeepDiveTemplate config={config} />,
}
