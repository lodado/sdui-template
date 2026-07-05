import { createDocumentBlock, type SduiDocumentContent } from '@lodado/sdui-document'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { type DeepDiveConfig, DeepDiveTemplate, type Principle } from '../components'
import { EditorWithPatchLog } from '../demos/EditorWithPatchLog'

const meta: Meta = {
  title: 'Document/Deep Dive/27 · 컬럼 레이아웃 & 리사이즈',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '가로 드롭으로 columnList/column 구조를 만들고, gutter 리사이즈는 인접 컬럼 ratio만 패치하는 컬럼 편집 흐름.',
      },
    },
  },
}

export default meta

type Story = StoryObj

const columnContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'column-root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'column-title',
        type: 'document.heading',
        state: { text: '컬럼 레이아웃은 블록 트리입니다', level: 2 },
      }),
      createDocumentBlock({
        id: 'column-intro',
        type: 'document.paragraph',
        state: {
          text: '가로 드롭은 새 레이아웃 타입이 아니라 columnList 아래 column들을 만들고 block.move로 내용을 옮깁니다.',
        },
      }),
      createDocumentBlock({
        id: 'column-list',
        type: 'document.columnList',
        children: [
          createDocumentBlock({
            id: 'column-left',
            type: 'document.column',
            attributes: { ratio: 1.35 },
            children: [
              createDocumentBlock({
                id: 'column-left-copy',
                type: 'document.paragraph',
                state: { text: '왼쪽 column — ratio 1.35' },
              }),
              createDocumentBlock({
                id: 'column-left-check',
                type: 'document.checklist',
                state: { text: 'gutter 키보드 조작도 block.update ratio 패치', checked: false },
              }),
            ],
          }),
          createDocumentBlock({
            id: 'column-right',
            type: 'document.column',
            attributes: { ratio: 0.65 },
            children: [
              createDocumentBlock({
                id: 'column-right-copy',
                type: 'document.callout',
                state: { text: '오른쪽 column — 빈 컬럼은 cleanup 패치로 정리됩니다.' },
                attributes: { tone: 'tip' },
              }),
            ],
          }),
        ],
      }),
    ],
  }),
}

const STEPS: Principle[] = [
  {
    num: '01',
    title: '가로 edge 감지',
    body: (
      <>
        포인터가 블록의 좌·우 <code>40px</code> 밴드에 붙으면 <code>projectHorizontalBlockDrop</code> 이 세로 이동 대신
        컬럼 분할 후보를 반환합니다.
      </>
    ),
  },
  {
    num: '02',
    title: '컬럼 패치 배치',
    body: (
      <>
        <code>createHorizontalBlockDropPatches</code> 는 <code>columnList</code> 와 두 <code>column</code> 을 삽입한 뒤,
        기존 over 블록과 active 블록을 각 column 아래로 <code>block.move</code> 합니다.
      </>
    ),
    wide: true,
  },
  {
    num: '03',
    title: '구조 불변식 정리',
    body: (
      <>
        빈 column은 삭제하고, column이 하나만 남으면 자식을 부모로 승격합니다. 저장 전에는{' '}
        <code>normalizeColumnStructure</code> 로 <code>columnList → column → content</code> 형태를 보정합니다.
      </>
    ),
    wide: true,
  },
  {
    num: '04',
    title: '리사이즈 커밋',
    body: (
      <>
        gutter 드래그 중에는 DOM <code>flexGrow</code> 만 미리 칠하고, 놓는 순간 인접 두 column의{' '}
        <code>attributes.ratio</code> 를 <code>block.update</code> 패치로 커밋합니다.
      </>
    ),
  },
]

const COLUMN_DROP_CODE = `// packages/sdui-document/src/blocks/drag/columnDropPatches.ts
projectHorizontalBlockDrop({ pointerX, overRect })
// → { side: 'left' | 'right' } when pointer is inside the 40px edge band

createHorizontalBlockDropPatches({ content, activeId, overId, side })
// → [
//   block.insert(columnList with two column children),
//   block.move(overId into one column),
//   block.move(activeId into the other column),
// ]`

const COLUMN_RESIZE_CODE = `// packages/sdui-document/src/blocks/code/columnResize.ts
resizeColumnPair({
  leftRatio,
  rightRatio,
  deltaFraction,
})
// keeps each side >= MIN_COLUMN_RATIO

createColumnResizePatches({ content, leftColumnId, rightColumnId, deltaFraction })
// → block.update(left.attributes.ratio) + block.update(right.attributes.ratio)`

const COLUMN_INVARIANT_CODE = `// packages/sdui-document/src/blocks/code/columnStructure.ts
normalizeColumnStructure(content)
// guarantees:
// - columnList only contains column children
// - column children contain normal content blocks
// - empty/single-column wrappers are removed or promoted`

const config: DeepDiveConfig = {
  accent: 'core',
  kicker: 'Deep Dive · @lodado/sdui-document + react',
  title: '컬럼 레이아웃 · 가로 드롭과 ratio 리사이즈',
  lead: '컬럼은 CSS 트릭이 아니라 문서 트리의 구조입니다. 가로 드롭은 columnList/column 패치 배치를 만들고, 리사이즈는 인접 column ratio만 갱신합니다.',
  pills: ['columnList', 'column', 'horizontal drop', 'ratio resize', 'cleanup patches'],
  steps: STEPS,
  stepsIntro: '사용자는 블록을 옆으로 놓거나 gutter를 끌지만, 코어에는 항상 검증 가능한 패치와 구조 불변식만 남습니다.',
  sections: [
    {
      index: '27.1',
      label: 'Drop',
      title: '가로 드롭은 columnList 생성 패치',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              일반 중첩 드롭은 <code>block.move</code> 하나로 끝나지만, 가로 드롭은 레이아웃 구조를 먼저 만듭니다. 이미
              column 안에 드롭하면 새 sibling column을 추가하고, 일반 블록 위에 드롭하면 over/active 둘 다 새 column으로
              감쌉니다.
            </>
          ),
        },
        { kind: 'code', file: 'blocks/drag/columnDropPatches.ts', code: COLUMN_DROP_CODE },
      ],
    },
    {
      index: '27.2',
      label: 'Live',
      title: '컬럼 문서도 같은 패치 로그를 쓴다',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              아래 데모는 실제 <code>SduiDocumentEditor</code> 입니다. 체크박스나 텍스트 편집, 컬럼 gutter 조작은 모두
              오른쪽 패치 로그에 같은 형식의 <code>SduiDocumentPatch</code> 로 쌓입니다.
            </>
          ),
        },
        {
          kind: 'demo',
          title: 'Column layout patch log',
          hint: '컬럼 사이 gutter와 블록 내용을 조작해 패치 형태를 확인',
          node: <EditorWithPatchLog content={columnContent} />,
        },
      ],
    },
    {
      index: '27.3',
      label: 'Resize',
      title: '드래그 preview와 ratio commit 분리',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              리사이즈 중 매 프레임 문서 상태를 바꾸면 undo stack과 렌더 비용이 커집니다. 그래서{' '}
              <code>ColumnResizeGutter</code> 는 pointermove 동안 DOM style만 미리 적용하고, pointerup/키보드 입력
              순간에만 <code>createColumnResizePatches</code> 를 호출합니다.
            </>
          ),
        },
        { kind: 'code', file: 'blocks/code/columnResize.ts · editor/BlockNode.tsx', code: COLUMN_RESIZE_CODE },
      ],
    },
    {
      index: '27.4',
      label: 'Invariant',
      title: '저장되는 모양은 항상 columnList → column',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              외부 입력·동시 편집·drop cleanup 뒤에도 저장 모델은 단순해야 합니다. <code>normalizeColumnStructure</code>{' '}
              는 columnList의 직접 자식을 column으로 맞추고, 비어 있거나 하나만 남은 wrapper를 제거해 렌더러가 예외
              분기를 덜 갖게 합니다.
            </>
          ),
        },
        { kind: 'code', file: 'blocks/code/columnStructure.ts', code: COLUMN_INVARIANT_CODE },
      ],
    },
  ],
}

export const ColumnLayout: Story = {
  name: '컬럼 레이아웃 & 리사이즈',
  render: () => <DeepDiveTemplate config={config} />,
}
