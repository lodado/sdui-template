import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { type DeepDiveConfig, DeepDiveTemplate, type Principle } from '../components'
import { EditorWithPatchLog } from '../demos/EditorWithPatchLog'
import { cheapWinsContent } from '../demos/sampleContents'

const meta: Meta = {
  title: 'Document/Deep Dive/28 · Notion Cheap-Wins',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '프론트엔드 전용 노션 기능 4종(문서 카운트·이모지 피커·목차 블록·인라인 @날짜)과 그 뒤의 4가지 확장 원리.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const STEPS: Principle[] = [
  {
    num: '01',
    title: '블록 = 모듈 (복제로 확장)',
    body: (
      <>
        목차 블록은 <code>divider</code> 모듈을 그대로 베껴 <code>block-types/toc/</code>에 타입·기본값·마크다운·SDUI
        매핑을 담은 모듈 하나로 추가됩니다. 코어 스키마 편집은 유니온에 <code>TOC_BLOCK_TYPE</code> 한 줄뿐 — 나머지는
        레지스트리가 파생합니다.
      </>
    ),
  },
  {
    num: '02',
    title: '인라인 = 닫힌 유니온',
    body: (
      <>
        인라인 노드 종류는 <code>text · hard_break · date</code>로 타입이 닫혀 있습니다. <code>date</code>를 더하자
        &ldquo;hard_break 아니면 text&rdquo;로 좁히던 모든 지점(<code>mapInlineRange</code>·
        <code>inlineToMarkdown</code>
        )이 <strong>컴파일 에러로 드러났고</strong>, 가드로 명시 처리했습니다. 타입체커가 파급 지점의 안전망입니다.
      </>
    ),
  },
  {
    num: '03',
    title: '라이브 파생은 좁은 컨텍스트',
    body: (
      <>
        목차는 문서 전체를 읽어야 합니다. 이를 공용 <code>EditorRuntime</code> 컨텍스트에 실으면 편집마다 컨텍스트
        identity가 바뀌어 <strong>모든 블록이 리렌더</strong>됩니다(구조적 공유+memo 붕괴). 전용{' '}
        <code>DocumentContentContext</code>로 분리해 목차만 구독시켜 렌더 granularity를 보존합니다.
      </>
    ),
  },
  {
    num: '04',
    title: '적정 복잡도(게으른 사다리)',
    body: (
      <>
        @날짜는 달력 팝오버 대신 기존 <code>inputRules</code>를 재활용한 입력 규칙(<code>@today</code>·
        <code>@tomorrow</code>·<code>@YYYY-MM-DD</code> + 스페이스)으로 ~30줄에 끝냈습니다. 이모지도 라이브러리 없이
        작은 curated JSON 하나. 필요가 실제로 커지면 그때 올립니다.
      </>
    ),
  },
]

const config: DeepDiveConfig = {
  accent: 'core',
  kicker: 'Deep Dive · cheap-wins bucket',
  title: 'Notion Cheap-Wins · 프론트 전용 4기능',
  lead: '서버·스토리지 없이 추가한 노션 기능 4종 — 문서 카운트, 이모지 피커, 목차 블록, 인라인 @날짜 노드. 각 기능이 두 확장 메커니즘(신규 블록 모듈 · 신규 인라인 노드)을 어떻게 밟는지 보여줍니다.',
  pills: ['document counts', 'emoji picker', 'toc block', 'inline @date', 'frontend-only'],
  steps: STEPS,
  stepsIntro: '4기능은 4가지 확장 원리 위에 얹혀 있습니다. 코어를 건드리지 않고 모듈/노드/컨텍스트를 더하는 방식.',
  sections: [
    {
      index: '28.1',
      label: 'Features',
      title: '기능 4종',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              <strong>문서 카운트</strong> — <code>documentStats(content)</code> 순수 파생(단어·글자·블록) +{' '}
              <code>&lt;DocumentCounts&gt;</code> opt-in 푸터. 에디터는 기본적으로 아무것도 안 그리고, 소비자가 원하는
              곳에 배치합니다.
            </>
          ),
        },
        {
          kind: 'prose',
          body: (
            <>
              <strong>이모지 피커</strong> — curated <code>EMOJI_DATA</code> + <code>filterEmojis</code> +{' '}
              <code>&lt;EmojiPicker&gt;</code>. 콜아웃의 <code>attributes.icon</code>에 이모지를 실으면 톤 아이콘 대신
              그 이모지가 렌더됩니다.
            </>
          ),
        },
        {
          kind: 'prose',
          body: (
            <>
              <strong>목차 블록</strong> — <code>document.toc</code> 블록 모듈 + <code>collectHeadings(content)</code>{' '}
              파생. 저장 상태 없이 문서의 제목 블록에서 라이브로 목록을 만들고, 클릭하면 해당 블록으로 스크롤합니다.
            </>
          ),
        },
        {
          kind: 'prose',
          body: (
            <>
              <strong>인라인 @날짜</strong> — <code>SduiInlineDateNode</code>(leaf, 1 offset) → PM atom 노드 → serialize
              라운드트립 → static <code>&lt;time&gt;</code> 칩. 삽입은 입력 규칙으로.
            </>
          ),
        },
        {
          kind: 'badges',
          items: ['documentStats', 'EmojiPicker', 'document.toc', 'SduiInlineDateNode', 'DocumentContentContext'],
        },
      ],
    },
    {
      index: '28.2',
      label: 'Live',
      title: '한 문서에 4기능',
      blocks: [
        {
          kind: 'prose',
          body: (
            <>
              아래 문서는 맨 위 <strong>목차</strong>(제목에서 자동 파생, 클릭 시 스크롤), 이모지 아이콘{' '}
              <strong>콜아웃</strong>, 본문의 <strong>@날짜 칩</strong>을 담고 있습니다. 편집 모드이니 빈 줄에서{' '}
              <code>@today </code>를 입력해 날짜를 넣거나, 콜아웃 아이콘을 클릭해 이모지를 바꿔보세요. 제목을
              추가/삭제하면 목차가 즉시 갱신됩니다.
            </>
          ),
        },
        {
          kind: 'demo',
          title: 'cheap-wins',
          hint: '목차 · 이모지 콜아웃 · @날짜',
          node: <EditorWithPatchLog content={cheapWinsContent} />,
        },
      ],
    },
  ],
}

export const CheapWins: Story = {
  name: 'Notion Cheap-Wins',
  render: () => <DeepDiveTemplate config={config} />,
}
