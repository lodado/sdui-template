import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { type DeepDiveConfig, DeepDiveTemplate, type Principle } from '../components'

const meta: Meta = {
  title: 'Document/Deep Dive/18 · 컴포넌트 팩토리',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '타입 문자열을 실제 React 컴포넌트로 잇는 유일한 연결점 — ComponentFactory와 렌더 우선순위.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const STEPS: Principle[] = [
  {
    num: '01',
    title: '타입 문자열',
    body: (
      <>
        노드는 <code>type</code> 문자열만 들고 있습니다: <code>&quot;CounterCard&quot;</code> 같은 이름표일 뿐, 실제
        컴포넌트는 아닙니다.
      </>
    ),
  },
  {
    num: '02',
    title: '팩토리 조회',
    body: (
      <>
        렌더러가 그 타입에 맞는 <code>ComponentFactory</code> 를 찾습니다:{' '}
        <code>byNodeId · byNodeType · components · 기본</code> 순서로.
      </>
    ),
  },
  {
    num: '03',
    title: '재귀 렌더',
    body: (
      <>
        컨테이너는 <code>useRenderNode</code> 의 <code>renderChildren</code> 으로 자식을 그리고, root부터 아래로 재귀가
        이어집니다.
      </>
    ),
  },
]

const FACTORY_CODE = `// 컴포넌트 팩토리 = (id, parentPath) => ReactNode.
// 타입 문자열을 실제 React 컴포넌트로 잇는 유일한 연결점.
const CounterCard: ComponentFactory = (id) => <CounterCardView nodeId={id} />

function CounterCardView({ nodeId }: { nodeId: string }) {
  // 이 노드 하나만 구독 — 다른 노드가 바뀌어도 여기는 안 깨어남
  const { state } = useSduiNodeSubscription({ nodeId })
  return <div>count: {String(state.count ?? 0)}</div>
}

// 렌더러에 맵으로 주입. 우선순위: byNodeId > byNodeType > components > 기본
<SduiLayoutRenderer document={doc} components={{ CounterCard }} />`

const RENDER_PRIORITY = `// 자식 렌더링은 render-props 훅으로.
function Container({ nodeId }: { nodeId: string }) {
  const { childrenIds } = useSduiNodeSubscription({ nodeId })
  const { renderChildren } = useRenderNode({ nodeId })
  return <div>{renderChildren(childrenIds)}</div>
}
// renderNode(id) 우선순위:
//   byNodeId[id] > byNodeType[type] > componentMap[type] > defaultComponentFactory`

const config: DeepDiveConfig = {
  accent: 'renderer',
  kicker: 'Deep Dive · @lodado/sdui-template',
  title: '컴포넌트 팩토리 · 타입을 컴포넌트로',
  lead: '타입 문자열을 실제 React 컴포넌트로 잇는 건 ComponentFactory 하나뿐. 렌더러는 root부터 재귀로 내려가며 노드 타입에 맞는 팩토리를 찾고, 컨테이너는 useRenderNode의 renderChildren으로 자식을 그림.',
  pills: ['ComponentFactory', 'useRenderNode', 'renderChildren', 'byNodeId > byNodeType'],
  steps: STEPS,
  sections: [
    {
      index: '18.1',
      label: 'Factory',
      title: '(id, parentPath) => ReactNode',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              타입 문자열(<code>&quot;CounterCard&quot;</code>)을 실제 React 컴포넌트로 잇는 건{' '}
              <code>ComponentFactory</code> 하나뿐입니다. 렌더러는 root부터 재귀로 내려가며 각 노드 타입에 맞는 팩토리를
              찾습니다. 컨테이너는 <code>useRenderNode</code> 의 <code>renderChildren</code> 으로 자식을 그립니다.
            </>
          ),
        },
        { kind: 'code', file: 'components/types.ts · 사용 예', code: FACTORY_CODE },
      ],
    },
    {
      index: '18.2',
      label: 'Priority',
      title: '렌더 우선순위',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              같은 타입이라도 특정 노드만 다르게 그리고 싶을 때가 있습니다. 그래서 <code>renderNode(id)</code> 는{' '}
              <code>byNodeId[id]</code> 를 가장 먼저 보고, 없으면 <code>byNodeType[type]</code>,{' '}
              <code>componentMap[type]</code>, 마지막으로 <code>defaultComponentFactory</code> 순서로 내려갑니다. 좁은
              규칙이 넓은 규칙을 이깁니다.
            </>
          ),
        },
        { kind: 'code', file: 'react-wrapper/hooks/useRenderNode.ts · 우선순위', code: RENDER_PRIORITY },
      ],
    },
  ],
}

export const ComponentFactory: Story = {
  name: '컴포넌트 팩토리',
  render: () => <DeepDiveTemplate config={config} />,
}
