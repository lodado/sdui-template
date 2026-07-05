import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { type DeepDiveConfig, DeepDiveTemplate, type Principle } from '../components'
import { EditorWithStateInspector } from '../demos/EditorWithStateInspector'
import { overviewContent } from '../demos/sampleContents'

const meta: Meta = {
  title: 'Document/Deep Dive/09 · SDUI 어댑터',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '의미 블록(document.heading 등)을 SDUI 레이아웃 노드로 낮춰(lower) @lodado/sdui-template 렌더러가 발행·미리보기에 재사용하는 방법 — 편집 모델과 렌더 모델의 분리.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const STEPS: Principle[] = [
  {
    num: '01',
    title: '의미 블록',
    body: (
      <>
        편집 모델은 의도를 담은 의미 블록입니다: <code>document.heading</code> · <code>document.paragraph</code> ·{' '}
        <code>document.callout</code>. 편집기가 다루는 유일한 진실입니다.
      </>
    ),
  },
  {
    num: '02',
    title: 'toSduiLayoutDocument',
    body: (
      <>
        <code>toSduiLayoutDocument(content, options)</code> 가 의미 블록을 순회하며 각 타입을 렌더 가능한 레이아웃
        노드로 낮춥니다(lower).
      </>
    ),
  },
  {
    num: '03',
    title: 'SDUI 레이아웃 노드',
    body: (
      <>
        결과는 <code>@lodado/sdui-template</code> 가 이해하는 <code>SduiLayoutDocument</code> — 발행·미리보기·서버 구동
        렌더에 그대로 재사용됩니다.
      </>
    ),
  },
]

const config: DeepDiveConfig = {
  accent: 'core',
  kicker: 'Deep Dive · @lodado/sdui-document',
  title: 'SDUI 어댑터 · 의미 블록을 레이아웃 노드로',
  lead: 'toSduiLayoutDocument 가 의미 블록(document.heading 등)을 SDUI 레이아웃 노드로 낮춰(lower) @lodado/sdui-template 렌더러로 발행·미리보기에 재사용합니다. 편집 모델과 렌더 모델을 분리해 각 레이어가 독립적으로 진화합니다.',
  pills: ['toSduiLayoutDocument', 'lower to SDUI', 'publish/preview', 'model split'],
  steps: STEPS,
  stepsIntro: '편집기가 다루는 의미 블록은 어댑터를 거쳐 렌더러가 이해하는 레이아웃 노드로 낮아집니다.',
  sections: [
    {
      index: '9.1',
      label: 'Mechanism',
      title: '문서 → 레이아웃 낮추기',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              편집 모델과 렌더 모델은 서로 다른 관심사입니다. 편집기는 <code>document.heading</code> 같은{' '}
              <strong>의미 블록</strong>으로 의도를 표현하고, 렌더러는 <code>SduiLayoutNode</code> 트리를 소비합니다.{' '}
              <code>toSduiLayoutDocument(content, options)</code> 가 그 사이의 어댑터입니다 — 의미 블록을 순회하며 각
              타입을 대응하는 레이아웃 노드로 <strong>낮춰(lower)</strong> 하나의 <code>SduiLayoutDocument</code> 로
              합칩니다. 덕분에 편집기와 렌더러는 서로의 내부 표현에 결합되지 않고, 같은 문서를 발행·미리보기·서버 구동
              렌더에 재사용할 수 있습니다.
            </>
          ),
        },
      ],
    },
    {
      index: '9.2',
      label: 'Live',
      title: 'Editor → toSduiLayoutDocument',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              왼쪽 편집기에서 블록을 편집하면 <code>SduiDocumentContent</code> 가 갱신되고, 그 즉시{' '}
              <code>toSduiLayoutDocument</code> 를 거쳐 낮춰진 SDUI 레이아웃이 오른쪽 인스펙터에 반영됩니다. 하나의
              편집이 어떻게 레이아웃 노드로 번역되는지 눈으로 따라가 보세요.
            </>
          ),
        },
        {
          kind: 'demo',
          title: 'Editor → layout JSON',
          hint: '편집하면 오른쪽 인스펙터에 lower된 SDUI 레이아웃이 갱신',
          node: <EditorWithStateInspector content={overviewContent} title="Editor → toSduiLayoutDocument" />,
        },
      ],
    },
  ],
}

export const SduiAdapter: Story = {
  name: 'SDUI 어댑터',
  render: () => <DeepDiveTemplate config={config} />,
}
