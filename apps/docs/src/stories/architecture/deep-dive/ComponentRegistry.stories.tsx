import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { SduiLayoutRenderer } from '@lodado/sdui-template'
import { sduiComponents } from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { type DeepDiveConfig, DeepDiveTemplate, type Principle } from '../components'

const meta: Meta = {
  title: 'Document/Deep Dive/22 · 컴포넌트 레지스트리',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '타입 문자열을 ComponentFactory로 잇는 하나의 맵 — 렌더러의 components로 넘기면 끝.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const STEPS: Principle[] = [
  {
    num: '01',
    title: '맵 정의',
    body: (
      <>
        <code>sduiComponents</code> 는 타입 문자열을 <code>ComponentFactory</code> 로 잇는 하나의 맵입니다.
      </>
    ),
  },
  {
    num: '02',
    title: '렌더러 주입',
    body: (
      <>
        렌더러의 <code>components</code> 로 넘기면 끝. 트리를 순회하며 타입에 맞는 팩토리를 찾아 렌더합니다.
      </>
    ),
  },
  {
    num: '03',
    title: '필요 시 createSduiComponents',
    body: (
      <>
        주입점(예: Canvas3D 렌더 전략)이 필요하면 <code>createSduiComponents(options)</code> 로 맵을 만들어 넘깁니다.
      </>
    ),
  },
]

const REGISTRY_CODE = `import { sduiComponents, createSduiComponents } from '@lodado/sdui-template-component'

// 기본 맵 — 타입 문자열 → 팩토리. 그대로 렌더러에 주입.
<SduiLayoutRenderer document={doc} components={sduiComponents} />

// 커스터마이즈가 필요하면 팩토리로 생성해 주입점을 넘김.
const components = createSduiComponents({ canvas3DRenderStrategy })
<SduiLayoutRenderer document={doc} components={components} />`

const basicsDoc: SduiLayoutDocument = {
  version: '1.0.0',
  metadata: { id: 'basics', name: 'Basics' },
  root: {
    id: 'root',
    type: 'Div',
    state: { style: { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' } },
    children: [
      {
        id: 'btn-primary',
        type: 'Button',
        state: { appearance: 'primary' },
        children: [{ id: 'btn-primary-t', type: 'Span', state: { text: 'Primary' } }],
      },
      {
        id: 'btn-subtle',
        type: 'Button',
        state: { appearance: 'subtle' },
        children: [{ id: 'btn-subtle-t', type: 'Span', state: { text: 'Subtle' } }],
      },
      { id: 'badge-1', type: 'Badge', state: { label: 8, appearance: 'default' } },
      { id: 'toggle-1', type: 'Toggle', state: { isChecked: true, label: '알림' } },
    ],
  },
}

const config: DeepDiveConfig = {
  accent: 'components',
  kicker: 'Deep Dive · @lodado/sdui-template-component',
  title: '컴포넌트 레지스트리 · 한 맵으로 주입',
  lead: 'sduiComponents는 타입 문자열을 ComponentFactory로 잇는 하나의 맵. 렌더러의 components로 넘기면 끝. 주입점이 필요하면 createSduiComponents(options)로 맵을 만들어 넘김.',
  pills: ['sduiComponents', 'createSduiComponents', 'ComponentFactory map'],
  steps: STEPS,
  sections: [
    {
      index: '22.1',
      label: 'Registry',
      title: '타입 → 팩토리 맵',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              <code>sduiComponents</code> 는 타입 문자열을 <code>ComponentFactory</code> 로 잇는 하나의 맵입니다.
              렌더러의 <code>components</code> 로 넘기면 끝. 주입점(예: Canvas3D 렌더 전략)이 필요하면{' '}
              <code>createSduiComponents(options)</code> 로 맵을 만들어 넘깁니다.
            </>
          ),
        },
        { kind: 'code', file: 'app/sduiComponents.tsx', code: REGISTRY_CODE },
      ],
    },
    {
      index: '22.2',
      label: 'Live',
      title: 'Basic components',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              아래 컴포넌트는 모두 같은 <code>sduiComponents</code> 맵으로 렌더됩니다. Button·Badge·Toggle 같은 서로
              다른 타입이 하나의 문서 트리 안에서 각자의 팩토리로 그려집니다.
            </>
          ),
        },
        {
          kind: 'demo',
          title: 'Basic components',
          hint: '모두 같은 sduiComponents 맵으로 렌더',
          node: <SduiLayoutRenderer document={basicsDoc} components={sduiComponents} />,
        },
      ],
    },
  ],
}

export const ComponentRegistry: Story = {
  name: '컴포넌트 레지스트리',
  render: () => <DeepDiveTemplate config={config} />,
}
