import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { type DeepDiveConfig, DeepDiveTemplate, type Principle } from '../components'
import { SduiInspectorDemo } from '../demos/SduiTemplateDemos'

const meta: Meta = {
  title: 'Document/Deep Dive/21 · 라이브 인스펙터',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'SduiLayoutStateInspector를 SduiLayoutRenderer의 자식으로 넣었을 때 — 노드 채널과 버전 채널이라는 두 개의 구독 채널이 어떻게 갈라지는가.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const STEPS: Principle[] = [
  {
    num: '01',
    title: '인스펙터 = 버전 구독',
    body: (
      <>
        커넥티드 <code>SduiLayoutStateInspector</code> 는 같은 스토어에 붙지만 오직 <code>subscribeVersion</code> 만
        합니다.
      </>
    ),
  },
  {
    num: '02',
    title: '노드 편집은 안 보임',
    body: (
      <>
        <code>updateNodeState → notifyNode</code> 는 5.4의 선택적 리렌더 그대로 — 그 카드만 바뀌고 인스펙터는
        정지합니다.
      </>
    ),
  },
  {
    num: '03',
    title: '버전 갱신 시 반영',
    body: (
      <>
        <code>updateVariable → notifyVersion</code> 을 눌러야 인스펙터가 전체를 다시 읽어 그동안 쌓인 노드 변화를
        한꺼번에 보여줍니다.
      </>
    ),
  },
]

const config: DeepDiveConfig = {
  accent: 'renderer',
  kicker: 'Deep Dive · @lodado/sdui-template',
  title: '라이브 인스펙터 · 두 개의 구독 채널',
  lead: 'SduiLayoutStateInspector를 SduiLayoutRenderer의 자식으로 넣으면 같은 스토어에 붙지만, 커넥티드 인스펙터는 버전 구독만 합니다. 노드 +1(notifyNode)은 인스펙터를 안 움직이고, 버전 갱신(notifyVersion)을 눌러야 전체를 다시 읽습니다.',
  pills: ['SduiLayoutStateInspector', 'subscribeVersion', 'notifyNode vs notifyVersion', 'two channels'],
  steps: STEPS,
  stepsIntro:
    '같은 스토어에 붙어도 인스펙터는 버전 채널만 듣습니다. 노드 편집은 흘려보내고, 버전 갱신에서만 깨어납니다.',
  sections: [
    {
      index: '21.1',
      label: 'Channels',
      title: '노드 채널 vs 버전 채널',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              <code>SduiLayoutStateInspector</code> 를 <code>SduiLayoutRenderer</code> 의 자식으로 넣으면 같은 스토어에
              붙습니다. 단, 커넥티드 인스펙터는 <strong>버전 구독</strong>(<code>subscribeVersion</code>)만 합니다.
              그래서 <strong>노드 +1</strong>(<code>updateNodeState → notifyNode</code>)은 5.4의 선택적 리렌더 그대로 —
              그 카드만 바뀌고 <em>인스펙터는 움직이지 않습니다</em>. <strong>버전 갱신</strong>(
              <code>updateVariable → notifyVersion</code>)을 눌러야 인스펙터가 전체를 다시 읽어 그동안 쌓인 노드 변화가
              한꺼번에 반영됩니다.
            </>
          ),
        },
      ],
    },
    {
      index: '21.2',
      label: 'Live',
      title: 'Live SduiLayoutStore',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              아래 데모에서 노드 <code>+1</code> 을 눌러 보세요 — 카드는 바뀌어도 인스펙터는 정지한 채 그대로입니다. 그
              다음 <strong>버전 갱신</strong> 을 누르면 인스펙터가 전체를 다시 읽어 그동안의 변화가 한꺼번에 나타납니다.
            </>
          ),
        },
        {
          kind: 'demo',
          title: 'Live SduiLayoutStore',
          hint: '노드 +1 → 인스펙터 정지 · 버전 갱신 → 반영',
          node: <SduiInspectorDemo />,
        },
        {
          kind: 'callout',
          icon: '◆',
          body: (
            <>
              <strong>왜 이렇게 나뉘나:</strong> 노드 채널과 버전 채널을 분리했기에 5.4의 선택적 리렌더가 가능합니다.
              디버그 패널이 모든 노드 편집마다 전체를 다시 그리면 그 최적화가 깨지므로, 인스펙터는 구조·변수
              변화(버전)에만 반응합니다.
            </>
          ),
        },
      ],
    },
  ],
}

export const LiveInspector: Story = {
  name: '라이브 인스펙터',
  render: () => <DeepDiveTemplate config={config} />,
}
