import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { type DeepDiveConfig, DeepDiveTemplate, type Principle } from '../components'
import { EditorWithPatchLog } from '../demos/EditorWithPatchLog'
import { allBlocksContent } from '../demos/sampleContents'

const meta: Meta = {
  title: 'Document/Deep Dive/04 · 블록 타입 & 마크',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '블록 타입마다 SduiBlockTypeModule 하나, 마크마다 SduiMarkModule 하나 — Strategy 레지스트리로 확장.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const STEPS: Principle[] = [
  {
    num: '01',
    title: '타입 = 모듈',
    body: (
      <>
        블록 타입마다 <code>SduiBlockTypeModule</code> 하나를 둡니다. 도메인 블록 ↔ SDUI 노드 매핑을 그 모듈이 온전히
        소유합니다.
      </>
    ),
  },
  {
    num: '02',
    title: '마크 = 모듈',
    body: (
      <>
        인라인 마크마다 <code>SduiMarkModule</code> 하나. <code>bold</code>·<code>italic</code>·<code>code</code>·
        <code>link</code>·<code>highlight</code> 등 각 마크가 독립적으로 정의됩니다.
      </>
    ),
  },
  {
    num: '03',
    title: '확장은 등록만',
    body: <>새 타입·마크 추가는 코어 스키마를 건드리지 않고 모듈을 레지스트리에 등록하는 것으로 끝납니다.</>,
    wide: true,
  },
]

const config: DeepDiveConfig = {
  accent: 'core',
  kicker: 'Deep Dive · @lodado/sdui-document',
  title: '블록 타입 & 마크 · Strategy 레지스트리',
  lead: '블록 타입마다 SduiBlockTypeModule 하나(도메인↔SDUI 매핑), 마크마다 SduiMarkModule 하나. 새 타입 추가는 코어 스키마를 건드리지 않고 모듈만 등록.',
  pills: ['SduiBlockTypeModule', 'SduiMarkModule', 'strategy registry', 'extensible'],
  steps: STEPS,
  stepsIntro: '타입도 마크도 각자의 모듈로 콜로케이션됩니다. 코어는 레지스트리를 순회할 뿐, 개별 타입을 알지 못합니다.',
  sections: [
    {
      index: '4.1',
      label: 'Registry',
      title: '타입/마크마다 모듈 하나',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              블록 타입마다 <code>SduiBlockTypeModule</code> 하나(도메인 ↔ SDUI 매핑)를, 마크마다{' '}
              <code>SduiMarkModule</code> 하나를 둡니다. 새 타입 추가는 코어 스키마를 건드리지 않고 모듈을 등록하는
              것으로 끝납니다.
            </>
          ),
        },
        {
          kind: 'prose',
          body: (
            <>
              <strong>블록 타입 (9)</strong>
            </>
          ),
        },
        {
          kind: 'badges',
          items: ['root', 'paragraph', 'heading', 'checklist', 'callout', 'divider', 'image', 'file', 'link'],
        },
        {
          kind: 'prose',
          body: (
            <>
              <strong>인라인 마크 (7)</strong>
            </>
          ),
        },
        {
          kind: 'badges',
          items: ['bold', 'italic', 'underline', 'strikethrough', 'code', 'link', 'highlight'],
        },
      ],
    },
    {
      index: '4.2',
      label: 'Live',
      title: '모든 블록 타입 렌더',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              아래 문서는 등록된 <strong>모든 렌더 타입</strong>을 한 번에 담고 있습니다. 각 블록은 해당 타입 모듈이
              SDUI 노드로 매핑한 결과입니다 — 레지스트리에 모듈이 있으면 그대로 렌더됩니다.
            </>
          ),
        },
        {
          kind: 'demo',
          title: 'Every block type',
          hint: '한 문서에 모든 렌더 타입',
          node: <EditorWithPatchLog content={allBlocksContent} readOnly />,
        },
      ],
    },
  ],
}

export const BlockTypesAndMarks: Story = {
  name: '블록 타입 & 마크',
  render: () => <DeepDiveTemplate config={config} />,
}
