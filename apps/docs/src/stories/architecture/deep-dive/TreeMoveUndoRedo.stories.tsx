import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { type DeepDiveConfig, DeepDiveTemplate, type Principle } from '../components'
import { UndoRedoDemo } from '../demos/UndoRedoDemo'

const meta: Meta = {
  title: 'Document/Deep Dive/02 · 트리 이동 & Undo/Redo',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '편집을 패치로 표현하면 각 패치의 역패치가 자연히 계산되고, 2-스택 히스토리가 양방향으로 재생합니다.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const STEPS: Principle[] = [
  {
    num: '01',
    title: '편집 = 패치',
    body: (
      <>
        블록 이동·제목 변경 등 모든 편집을 직렬화 가능한 패치로 표현합니다. 명령형 코드가 아니라 데이터로 남기는 것이
        시작점입니다.
      </>
    ),
  },
  {
    num: '02',
    title: '역패치 계산',
    body: (
      <>
        <code>applyDocumentPatchesWithInverse</code> 가 각 배치를 적용하면서 되돌릴 <strong>역패치</strong>를 함께
        계산합니다.
      </>
    ),
  },
  {
    num: '03',
    title: '2-스택 기록',
    body: (
      <>
        <code>DocumentHistory</code> 는 <code>(undo=inverse, redo=patches)</code> 쌍을 2-스택으로 기록합니다.
      </>
    ),
  },
  {
    num: '04',
    title: 'undo/redo 재생',
    body: <>스택을 양방향으로 재생하기만 하면 되돌리기와 다시 실행이 됩니다. 헤드리스 도메인 API만으로 동작합니다.</>,
    wide: true,
  },
]

const INVERSE_CODE = `// applyDocumentPatchesWithInverse 가 각 배치의 역패치를 함께 계산.
const { content: next, inverse } = applyDocumentPatchesWithInverse(content, patches)

// 2-스택 히스토리에 (undo=inverse, redo=patches) 쌍으로 기록.
let history = recordHistoryEntry(createDocumentHistory(), { undo: inverse, redo: patches })

const step = undoHistory(history)          // → { history, entry }
if (step) applyDocumentPatchesWithInverse(next, step.entry.undo)`

const config: DeepDiveConfig = {
  accent: 'core',
  kicker: 'Deep Dive · @lodado/sdui-document',
  title: '트리 이동 & Undo/Redo · 역연산으로 되돌리기',
  lead: '편집을 패치로 표현하면 각 패치의 역패치(inverse)가 자연히 계산되고, 2-스택 히스토리가 그 쌍을 양방향으로 재생합니다. 에디터도 프레임워크도 없이, 헤드리스 도메인 API만으로 되돌리기와 다시 실행이 동작합니다.',
  pills: ['moveDocumentWithInverse', 'applyDocumentPatchesWithInverse', 'DocumentHistory', '2-stack'],
  steps: STEPS,
  stepsIntro: '이동이든 제목 변경이든, 하나의 패치 배치로 수렴하고 그 역패치가 되돌리기 스택을 채웁니다.',
  sections: [
    {
      index: '2.1',
      label: 'Mechanism',
      title: '역패치 · Command 패턴',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              편집을 패치로 표현하면 역연산이 자연히 나옵니다. <code>applyDocumentPatchesWithInverse</code> 가 각 배치의
              역패치를 계산하고, 2-스택 <code>DocumentHistory</code> 가 <code>(undo=inverse, redo=patches)</code> 쌍을
              양방향으로 재생합니다. 아래 코드는 에디터 없이 <strong>도메인 API만으로</strong> 동작합니다.
            </>
          ),
        },
        { kind: 'code', file: 'blocks/code/documentHistory.ts', code: INVERSE_CODE },
      ],
    },
    {
      index: '2.2',
      label: 'Live',
      title: '헤드리스 undo/redo',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              아래 데모는 에디터 UI 없이 <code>DocumentHistory</code> API를 직접 구동합니다. 이동·되돌리기·다시 실행을
              눌러 스택이 어떻게 채워지고 비워지는지 관찰해 보세요 — 모든 변경이 역패치를 남긴다는 것을 눈으로 확인할 수
              있습니다.
            </>
          ),
        },
        {
          kind: 'demo',
          title: 'Headless undo/redo',
          hint: '도메인 히스토리 API 직접 구동',
          node: <UndoRedoDemo />,
        },
        {
          kind: 'callout',
          icon: '◆',
          body: (
            <>
              <strong>비파괴적 트리 이동:</strong> <code>moveDocumentWithInverse</code> 는 원본을 변형하지 않고 이동을
              적용하면서 되돌릴 역패치를 함께 남깁니다. 그래서 각 이동이 <code>(undo, redo)</code> 쌍으로 히스토리에
              기록되고, 언제든 이전 위치로 정확히 복원됩니다.
            </>
          ),
        },
      ],
    },
  ],
}

export const TreeMoveUndoRedo: Story = {
  name: '트리 이동 & Undo/Redo',
  render: () => <DeepDiveTemplate config={config} />,
}
