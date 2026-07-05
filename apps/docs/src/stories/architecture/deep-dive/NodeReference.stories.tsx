import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { type DeepDiveConfig, DeepDiveTemplate, type Principle } from '../components'
import { SduiReferenceDemo } from '../demos/SduiTemplateDemos'

const meta: Meta = {
  title: 'Document/Deep Dive/19 · 노드 레퍼런스',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '노드가 reference 필드로 다른 노드를 가리키고, 참조 대상의 상태를 읽으며 자동 구독하는 파생 UI 패턴.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const STEPS: Principle[] = [
  {
    num: '01',
    title: 'reference 지정',
    body: (
      <>
        노드는 <code>reference</code> 필드로 다른 노드의 <code>id</code> 를 가리킵니다. 원본 상태를 복제하지 않고 그
        노드를 바라보기만 합니다.
      </>
    ),
  },
  {
    num: '02',
    title: '대상 구독',
    body: (
      <>
        <code>useSduiNodeReference({'{ nodeId }'})</code> 는 참조 대상의 상태를 읽고 그 노드를 자동으로 구독합니다.
      </>
    ),
  },
  {
    num: '03',
    title: '원본 변경 시 리렌더',
    body: <>원본 노드가 바뀌면 참조하는 쪽도 함께 리렌더됩니다. 파생 UI가 원본을 그대로 따라갑니다.</>,
  },
]

const config: DeepDiveConfig = {
  accent: 'renderer',
  kicker: 'Deep Dive · @lodado/sdui-template',
  title: '노드 레퍼런스 · 노드가 노드를 구독',
  lead: '노드는 reference 필드로 다른 노드를 가리킬 수 있습니다. useSduiNodeReference는 참조 대상의 상태를 읽고 그 노드를 자동 구독합니다 — 원본이 바뀌면 참조하는 쪽도 리렌더됩니다. 파생 UI를 상태 복제 없이 만듭니다.',
  pills: ['reference field', 'useSduiNodeReference', 'derived UI', 'auto subscribe'],
  steps: STEPS,
  sections: [
    {
      index: '19.1',
      label: 'Mechanism',
      title: 'reference로 파생 상태',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              노드는 <code>reference</code> 필드로 다른 노드를 가리킬 수 있습니다.{' '}
              <code>useSduiNodeReference({'{ nodeId }'})</code> 는 참조 대상의 상태를 읽고 그 노드를 자동 구독합니다 —
              원본이 바뀌면 참조하는 쪽도 리렌더됩니다. 요약 배지·미러 뷰 같은 파생 UI를 <strong>상태 복제 없이</strong>{' '}
              만들 수 있습니다.
            </>
          ),
        },
      ],
    },
    {
      index: '19.2',
      label: 'Live',
      title: 'Node reference',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              아래에서 원본 노드의 값을 올리면, 그 노드를 참조하는 거울 노드가 상태를 복제하지 않고도 곧바로 따라
              리렌더됩니다.
            </>
          ),
        },
        {
          kind: 'demo',
          title: 'Node reference',
          hint: '원본 +1 → 거울 노드가 따라 리렌더',
          node: <SduiReferenceDemo />,
        },
      ],
    },
  ],
}

export const NodeReference: Story = {
  name: '노드 레퍼런스',
  render: () => <DeepDiveTemplate config={config} />,
}
