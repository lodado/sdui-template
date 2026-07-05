import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { type DeepDiveConfig, DeepDiveTemplate, type Principle } from '../components'
import { AutosaveDemo } from '../demos/AutosaveDemo'

const meta: Meta = {
  title: 'Document/Deep Dive/06 · Autosave 상태 머신',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '타이머도 네트워크도 없는 순수 리듀서로 저장 상태를 결정론적으로 계산하는 방법.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const STEPS: Principle[] = [
  {
    num: '01',
    title: '이벤트 디스패치',
    body: (
      <>
        저장 루프가 발생시킬 이벤트를 상태 머신에 그대로 흘려보냅니다:{' '}
        <code>local.change · save.request · save.success · save.failure · network.offline · network.online</code>.
      </>
    ),
  },
  {
    num: '02',
    title: '순수 전이',
    body: (
      <>
        <code>reduceAutosaveState(state, event)</code> 는 새 상태를 반환하는 순수 함수입니다. 타이머도 네트워크도 없이{' '}
        <code>dirty · saving · offline · failed</code> 전이가 결정론적으로 계산됩니다.
      </>
    ),
  },
  {
    num: '03',
    title: '오프라인·실패 큐잉',
    body: <>오프라인이거나 저장이 실패하면 변경을 큐에 남겨 두었다가, 온라인이 되면 다시 저장 루프로 흘려보냅니다.</>,
    wide: true,
  },
]

const config: DeepDiveConfig = {
  accent: 'core',
  kicker: 'Deep Dive · @lodado/sdui-document',
  title: 'Autosave 상태 머신 · 타이머 없는 순수 리듀서',
  lead: 'reduceAutosaveState(state, event) 는 타이머도 네트워크도 없는 순수 리듀서입니다. 저장 루프가 발생시킬 이벤트를 디스패치하며 dirty·saving·offline·failed 전이를 결정론적으로 확인합니다.',
  pills: ['reduceAutosaveState', 'pure reducer', 'no timers', 'deterministic'],
  steps: STEPS,
  stepsIntro:
    '키 입력이든 네트워크 상태 변화든, 결국 하나의 이벤트로 수렴하고 순수 리듀서가 다음 저장 상태를 계산합니다.',
  sections: [
    {
      index: '6.1',
      label: 'Model',
      title: '이벤트 → 상태 전이',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              <code>reduceAutosaveState(state, event)</code> 는 타이머도 네트워크도 없는 <strong>순수 리듀서</strong>
              입니다. 저장 루프가 발생시킬 이벤트를 직접 디스패치하면{' '}
              <code>idle · dirty · saving · saved · failed · offline</code> 사이의 전이가 결정론적으로 계산됩니다.
              시간에 의존하는 요소가 없으니 같은 이벤트 시퀀스는 언제나 같은 상태로 수렴합니다.
            </>
          ),
        },
      ],
    },
    {
      index: '6.2',
      label: 'Live',
      title: 'reduceAutosaveState',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              아래 이벤트 버튼을 눌러 저장 루프가 내보낼 이벤트를 직접 디스패치해 보세요. 상단 상태 링이 그때그때{' '}
              <code>dirty · saving · offline · failed</code> 로 전이하는 것을 눈으로 확인할 수 있습니다.
            </>
          ),
        },
        {
          kind: 'demo',
          title: 'reduceAutosaveState',
          hint: '이벤트를 눌러 상태 전이 관찰',
          node: <AutosaveDemo />,
        },
        {
          kind: 'callout',
          icon: '◆',
          body: (
            <>
              <strong>왜 순수 리듀서인가:</strong> 타이머와 네트워크는 어댑터 경계 밖에 두고 상태 전이만 순수 함수로
              남겼기 때문에, 실제 타이머나 서버 없이도 이벤트 시퀀스만으로 모든 전이를 헤드리스로 테스트할 수 있습니다.
            </>
          ),
        },
      ],
    },
  ],
}

export const AutosaveStateMachine: Story = {
  name: 'Autosave 상태 머신',
  render: () => <DeepDiveTemplate config={config} />,
}
