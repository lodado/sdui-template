import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { type DeepDiveConfig, DeepDiveTemplate, type Principle } from '../components'
import { EditorWithPatchLog } from '../demos/EditorWithPatchLog'
import { marksContent } from '../demos/sampleContents'

const meta: Meta = {
  title: 'Document/Deep Dive/10 · 하이브리드 에디터',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '전체 문서에 ProseMirror를 깔지 않고 포커스된 블록에만 단일 에디터를 마운트하는 하이브리드 전략.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const STEPS: Principle[] = [
  {
    num: '01',
    title: '포커스 이동',
    body: <>블록을 클릭하면 그 블록만 편집 대상이 됩니다. 나머지는 손대지 않습니다.</>,
  },
  {
    num: '02',
    title: 'PM 1개 마운트',
    body: (
      <>
        포커스된 블록에만 단일 <code>FocusedBlockEditor</code> (ProseMirror EditorView)가 마운트됩니다.
      </>
    ),
  },
  {
    num: '03',
    title: '나머지는 정적',
    body: (
      <>
        비포커스 블록은 정적 <code>InlineContentView</code> (마크 렌더러 트리)로 그려집니다. PM이 붙지 않습니다.
      </>
    ),
  },
  {
    num: '04',
    title: 'blur 커밋',
    body: (
      <>
        blur·unmount 시 PM 상태가 <code>block.state.content</code> 로 커밋됩니다. 같은 래퍼 태그를 써서 레이아웃
        시프트가 없습니다.
      </>
    ),
    wide: true,
  },
]

const HYBRID_CODE = `// 포커스된 블록만 ProseMirror EditorView 를 마운트.
// 나머지 블록은 정적 InlineContentView (마크 렌더러 트리).
{isFocused ? (
  <FocusedBlockEditor content={blockInlineContent(block)} onCommit={commitInline} />  // PM 1개
) : (
  <InlineContentView content={blockInlineContent(block)} />                           // 정적 React
)}
// blur/unmount 시 PM 상태 → block.state.content 로 커밋(block.update).`

const TRAILING_CODE = `// packages/sdui-document/src/blocks/code/trailingBlock.ts
createTrailingBlockPatch(content, generateBlockId)
// → root의 마지막 블록이 텍스트를 받을 수 없으면 빈 paragraph insert patch

// packages/sdui-document-react/src/editor/hooks/useDocumentPatches.ts
const trailing = createTrailingBlockPatch(next, generateBlockId)
applyPatches([...userPatches, trailing].filter(Boolean))
// user action과 같은 history entry에 묶여 undo가 정확히 복원됩니다.`

const config: DeepDiveConfig = {
  accent: 'react',
  kicker: 'Deep Dive · @lodado/sdui-document-react',
  title: '하이브리드 에디터 · ProseMirror는 하나만',
  lead: '전체 문서에 PM을 깔지 않고 포커스된 블록에만 단일 FocusedBlockEditor를 마운트, 나머지는 정적 InlineContentView. blur 시 block.state.content로 커밋. 편집 진입·이탈에 레이아웃 시프트 없음.',
  pills: ['SduiDocumentEditor', 'FocusedBlockEditor', 'InlineContentView', 'one ProseMirror'],
  steps: STEPS,
  stepsIntro: '포커스가 이동할 때마다 PM은 딱 하나만 살아 있고, 나머지 수백 개 블록은 정적 뷰로 남습니다.',
  sections: [
    {
      index: '10.1',
      label: 'Hybrid',
      title: '포커스된 블록에만 PM',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              전체 문서에 ProseMirror를 깔지 않습니다. <strong>포커스된 블록에만</strong> 단일{' '}
              <code>FocusedBlockEditor</code>
              (PM EditorView)가 마운트되고, 나머지는 정적 <code>InlineContentView</code> 로 렌더링됩니다. blur 시 PM
              상태가 <code>block.state.content</code> 로 커밋됩니다. 포커스·정적 뷰가 같은 래퍼 태그를 쓰므로 편집
              진입·이탈 시 레이아웃 시프트가 없습니다.
            </>
          ),
        },
        {
          kind: 'code',
          file: 'editor/SduiDocumentEditor.tsx · focused-block/FocusedBlockEditor.tsx',
          code: HYBRID_CODE,
        },
      ],
    },
    {
      index: '10.2',
      label: 'Live',
      title: 'Focus mounts one editor',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              아래 에디터에서 서로 다른 블록을 클릭해 포커스를 옮겨 보세요. 포커스된 블록에만 PM이 살아 있고, 이동할
              때마다 이전 블록은 <code>InlineContentView</code> 로 되돌아갑니다. 오른쪽 로그에서 커밋 패치를 확인할 수
              있습니다.
            </>
          ),
        },
        {
          kind: 'demo',
          title: 'Focus mounts one editor',
          hint: '블록을 클릭해 포커스 이동 — 패치 로그 확인',
          node: <EditorWithPatchLog content={marksContent} />,
        },
      ],
    },
    {
      index: '10.3',
      label: 'Invariant',
      title: '항상 클릭 가능한 trailing paragraph',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              문서 마지막이 divider·image·columnList처럼 직접 텍스트를 받을 수 없는 블록이면 사용자가 아래를 클릭해도
              커서를 둘 곳이 없습니다. 그래서 편집 패치 적용 후 <code>createTrailingBlockPatch</code> 로 빈 paragraph를
              보강하고, 이 보강 패치는 사용자 액션과 같은 history entry에 묶습니다. 덕분에 undo는 “사용자 편집 +
              trailing 보강”을 한 번에 되돌립니다.
            </>
          ),
        },
        {
          kind: 'code',
          file: 'blocks/code/trailingBlock.ts · editor/hooks/useDocumentPatches.ts',
          code: TRAILING_CODE,
        },
      ],
    },
  ],
}

export const HybridEditor: Story = {
  name: '하이브리드 에디터',
  render: () => <DeepDiveTemplate config={config} />,
}
