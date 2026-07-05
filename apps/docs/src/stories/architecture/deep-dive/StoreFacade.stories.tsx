import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { type DeepDiveConfig, DeepDiveTemplate, type Layer, type Principle } from '../components'

const meta: Meta = {
  title: 'Document/Deep Dive/15 · SduiLayoutStore 파사드',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'SduiLayoutStore는 직접 상태를 들지 않고 4개의 좁은 매니저에 위임하는 파사드 — 구독·상태저장·문서캐시·변수가 서로 얽히지 않습니다.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const MANAGERS: Layer[] = [
  {
    name: 'SubscriptionManager',
    tag: 'observer',
    accent: '#216e4e',
    desc: (
      <>
        노드별·버전별 구독자를 관리. <code>notifyNode(id)</code> 는 그 노드 구독자만, <code>notifyVersion()</code> 은
        구조 구독자를 깨웁니다.
      </>
    ),
  },
  {
    name: 'LayoutStateRepository',
    tag: 'state',
    accent: '#227d9b',
    desc: (
      <>
        평탄한 노드 레지스트리 + <code>rootId</code> · 변수 · 버전 · <code>lastModified</code> 를 보관하는 저장소.
      </>
    ),
  },
  {
    name: 'DocumentManager',
    tag: 'cache',
    accent: '#6e5dc6',
    desc: <>메타데이터와 원본 문서를 캐시 — resetToInitial·cancelEdit 이 여기서 원본을 되살립니다.</>,
  },
  {
    name: 'VariablesManager',
    tag: 'variables',
    accent: '#a54800',
    desc: <>전역 변수 갱신을 깊은 복사로 처리해 참조를 바꾸고 리렌더를 유발.</>,
  },
]

const STEPS: Principle[] = [
  {
    num: '01',
    title: '파사드 진입',
    body: (
      <>
        사용자는 <code>SduiLayoutStore</code> 하나의 API만 만집니다 — <code>updateNodeState</code> ·{' '}
        <code>subscribeNode</code> · <code>getNodeById</code> 가 모두 여기로 모입니다.
      </>
    ),
  },
  {
    num: '02',
    title: '매니저 위임',
    body: (
      <>파사드는 직접 상태를 들지 않고 4개의 좁은 매니저(구독·상태저장·문서캐시·변수)에 각 호출을 그대로 넘깁니다.</>
    ),
  },
  {
    num: '03',
    title: '관심사 분리',
    body: <>「구독」·「상태 저장」·「문서 캐시」·「변수」 가 서로 얽히지 않아 각자 한 가지 일만 합니다.</>,
    wide: true,
  },
]

const config: DeepDiveConfig = {
  accent: 'renderer',
  kicker: 'Deep Dive · @lodado/sdui-template',
  title: 'SduiLayoutStore · 파사드 + 4개 매니저',
  lead: 'SduiLayoutStore는 직접 상태를 들지 않고 4개의 좁은 매니저(구독·상태저장·문서캐시·변수)에 위임하는 파사드. 관심사가 서로 얽히지 않음.',
  pills: ['SduiLayoutStore', 'SubscriptionManager', 'LayoutStateRepository', 'DocumentManager', 'VariablesManager'],
  steps: STEPS,
  stepsIntro: '어떤 호출이든 하나의 파사드로 들어와, 자기 몫만 아는 매니저에게 위임됩니다.',
  sections: [
    {
      index: '15.1',
      label: 'Facade',
      title: '4개 매니저에 위임',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              <code>SduiLayoutStore</code> 는 직접 상태를 들지 않고 4개의 좁은 매니저에 위임하는 파사드입니다. 덕분에
              「구독」, 「상태 저장」, 「문서 캐시」, 「변수」 가 서로 얽히지 않고 각자 한 가지 일만 합니다.
            </>
          ),
        },
        { kind: 'layers', layers: MANAGERS, connector: '+' },
      ],
    },
    {
      index: '15.2',
      label: 'Why',
      title: '왜 나눴나',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              관심사를 <code>SubscriptionManager</code> · <code>LayoutStateRepository</code> ·{' '}
              <code>DocumentManager</code> · <code>VariablesManager</code> 로 쪼갠 이유는 채널을 독립적으로 다루기
              위해서입니다. 노드 변화(<code>notifyNode</code>)와 구조·변수 변화(<code>notifyVersion</code>)가 서로 다른
              구독 채널로 나뉘어, 한쪽을 건드려도 다른 쪽은 흔들리지 않습니다.
            </>
          ),
        },
        {
          kind: 'callout',
          icon: '◆',
          body: (
            <>
              <strong>왜 이렇게 나뉘나:</strong> 구독·상태·문서·변수를 분리했기에 노드 채널의 선택적 리렌더와 버전
              채널을 독립적으로 관리할 수 있습니다. 한 매니저가 여러 관심사를 겸했다면 그 최적화가 깨집니다.
            </>
          ),
        },
      ],
    },
  ],
}

export const StoreFacade: Story = {
  name: 'SduiLayoutStore 파사드',
  render: () => <DeepDiveTemplate config={config} />,
}
