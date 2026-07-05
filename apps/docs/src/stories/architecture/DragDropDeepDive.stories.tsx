import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  Callout,
  CodeSnippet,
  DemoFrame,
  DocHero,
  DocPage,
  DocSection,
  DropZoneDiagram,
  type Principle,
  PrincipleCards,
  Prose,
} from './components'
import { EditorWithPatchLog } from './demos/EditorWithPatchLog'
import { nestedContent } from './demos/sampleContents'

const meta: Meta = {
  title: 'Document/Deep Dive/11 · 중첩 드래그앤드랍',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '드래그한 블록을 중첩 트리의 정확히 어디에 꽂을지 어떻게 계산하는가. 초심자를 위해 세로 3존 → 가로 깊이 → block.move 패치까지 한 단계씩 풀어봅니다.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const STEPS: Principle[] = [
  {
    num: '01',
    title: '트리를 한 줄로 편다',
    body: (
      <>
        중첩 문서를 <code>flattenDocumentBlocks</code> 로 평탄화. 각 행은 <code>{'{ id, depth, parentId }'}</code> 를
        가진 화면상의 한 줄이 됩니다. 계산은 이 평면 리스트 위에서 이뤄집니다.
      </>
    ),
  },
  {
    num: '02',
    title: '못 놓는 곳을 먼저 쳐낸다',
    body: (
      <>
        루트 자신, 드래그 중인 블록 자신, 그리고 <strong>그 블록의 모든 자손</strong>은 드롭 대상에서 제외. 자기
        안으로는 못 들어가니까요. 여기서 걸리면 <code>null</code> 을 반환하고 끝.
      </>
    ),
  },
  {
    num: '03',
    title: '세로 위치로 존을 고른다',
    body: (
      <>
        포인터가 hover한 행의 <strong>세로 비율</strong> <code>overRatio</code> 로 3등분: 위 25%는 <code>before</code>,
        가운데는 <code>inside</code>(첫 자식으로 nest), 아래 25%는 <code>after</code>.
      </>
    ),
  },
  {
    num: '04',
    title: 'after면 가로로 깊이를 정한다',
    body: (
      <>
        <code>after</code> 존에서는 <strong>가로 오프셋</strong>(레벨당 24px)이 깊이를 결정. 오른쪽으로 밀면 nest,
        왼쪽은 outdent. 트리가 깨지지 않도록 <code>[minDepth, maxDepth]</code> 로 clamp.
      </>
    ),
    wide: true,
  },
]

const PROJECT_SIGNATURE = `export function projectNestedBlockDrop(input: {
  content: SduiDocumentContent
  activeId: string          // 드래그 중인 블록
  overId: string            // 지금 hover한 행
  offsetX: number           // 가로 이동량(px, +면 오른쪽)
  indentWidth: number       // 레벨당 픽셀(24)
  overRatio?: number        // 행 안의 세로 비율(0=위, 1=아래)
}): { overId, position, depth } | null`

const ZONE_LOGIC = `// 세로 3존 분기 — overRatio가 주어졌을 때
if (overRatio < 0.25) {
  // 위 25% → 이 행 "앞"에, 같은 깊이로
  return { overId: previous.id, position: 'before', depth: previous.depth }
}
if (overRatio <= 0.75) {
  // 가운데 → 이 행의 "첫 자식"으로 nest
  return { overId: previous.id, position: 'inside', depth: previous.depth + 1 }
}
// 아래 25% → 가로 오프셋이 깊이를 정하는 after 로직으로`

const DEPTH_LOGIC = `// after 존 — 가로 오프셋으로 깊이 결정
const maxDepth = previous.depth + 1          // 최대: over의 자식
const minDepth = next ? next.depth : 1       // 최소: 다음 행 깊이(트리 보존)

const desiredDepth = active.depth + Math.round(offsetX / indentWidth)
const projectedDepth = clamp(desiredDepth, minDepth, maxDepth)

// 깊이를 실제 위치로 환원
if (projectedDepth === previous.depth + 1) return { position: 'inside', ... } // 자식
if (projectedDepth === previous.depth)     return { position: 'after',  ... } // 형제
// 그 위 → 조상 중 해당 깊이를 찾아 그 뒤로 (outdent)
const ancestor = ancestorAtDepth(flattened, previous, projectedDepth)
return { overId: ancestor.id, position: 'after', depth: projectedDepth }`

const DeepDivePage = () => {
  return (
    <DocPage accent="react">
      <DocHero
        kicker="Deep Dive · Nested Drag & Drop"
        title="드래그한 블록은 트리의 어디에 꽂히나"
        lead="Notion처럼 블록을 좌우로 밀어 깊이를 바꾸는 그 동작. 화려해 보이지만 계산은 순수 함수 하나(projectNestedBlockDrop)로 끝납니다. 포인터 좌표를 받아 '어느 블록의 · 어느 위치에 · 어느 깊이로' 를 돌려줄 뿐입니다."
        pills={['flatten', '3 vertical zones', 'horizontal depth', 'clamp', 'block.move']}
      />

      <DocSection index="4.1" label="Big idea" title="역할 분리: 계산은 도메인, 손맛은 React">
        <Prose>
          <p>
            드래그앤드랍은 두 조각입니다. <strong>어디에 놓을지 계산</strong>하는 순수 함수(
            <code>@lodado/sdui-document</code>)와, dnd-kit 센서·드롭 인디케이터로 <strong>손맛</strong>을 내는 React 훅(
            <code>@lodado/sdui-document-react</code>). 계산이 순수하니 헤드리스로 테스트되고, UI는 그 결과만 그립니다.
          </p>
        </Prose>
        <PrincipleCards principles={STEPS} />
      </DocSection>

      <DocSection index="4.2" label="Try it" title="직접 눌러보며 규칙 익히기">
        <Prose>
          <p>
            아래 다이어그램에서 <strong>Configuration</strong> 행에 블록을 떨어뜨린다고 상상해 보세요. 존을 바꾸면 결과
            트리와 그때 나가는 <code>block.move</code> 패치가 실시간으로 바뀝니다. <code>after</code> 를 고르면 좌우
            깊이 버튼이 나타납니다.
          </p>
        </Prose>
        <DemoFrame title="Drop projection playground" hint="존을 클릭 · after면 깊이 조절">
          <DropZoneDiagram />
        </DemoFrame>
        <Callout icon="◆">
          <strong>핵심 직관:</strong> <code>inside</code> 와 <code>after</code>+최대 깊이는 결과가 같습니다 — 둘 다
          over의 자식이 됩니다. 그래서 코드도 <code>projectedDepth === previous.depth + 1</code> 이면 position을{' '}
          <code>inside</code> 로 통일합니다.
        </Callout>
      </DocSection>

      <DocSection index="4.3" label="Signature" title="함수 하나가 받는 것과 주는 것">
        <Prose>
          <p>
            입력은 포인터 정보(어떤 블록을 잡아 · 어디에 hover · 세로 비율 · 가로 이동량)뿐이고, 출력은 삽입 지점
            삼총사(
            <code>overId · position · depth</code>)입니다. 대상이 부적절하면(루트·자기 자신·자손) <code>null</code>.
          </p>
        </Prose>
        <CodeSnippet file="blocks/drag/dropProjection.ts" code={PROJECT_SIGNATURE} />
      </DocSection>

      <DocSection index="4.4" label="Vertical" title="세로 3존 — before · inside · after">
        <Prose>
          <p>
            <code>overRatio</code> 는 hover한 행 안에서 포인터의 세로 위치(0=위 모서리, 1=아래 모서리)입니다. 위/아래
            가장자리는 &quot;이 행 앞/뒤&quot;, 가운데 넓은 영역은 &quot;이 행 안&quot;으로 읽습니다.
          </p>
        </Prose>
        <CodeSnippet file="projectNestedBlockDrop — 세로 분기" code={ZONE_LOGIC} />
      </DocSection>

      <DocSection index="4.5" label="Horizontal" title="가로 깊이 — 밀어서 nest / outdent">
        <Prose>
          <p>
            <code>after</code> 존에서만 가로가 의미를 가집니다. 원하는 깊이는{' '}
            <code>active.depth + round(offsetX / 24)</code> 로 계산하되, 트리가 망가지지 않도록{' '}
            <code>[minDepth, maxDepth]</code> 로 clamp합니다. 그 뒤 깊이를 다시 &quot;누구의 · 앞뒤 어디&quot;로
            환원합니다.
          </p>
        </Prose>
        <CodeSnippet file="projectNestedBlockDrop — 가로 깊이" code={DEPTH_LOGIC} />
        <Callout icon="▲">
          <strong>왜 clamp가 필요한가:</strong> 아무 깊이나 허용하면 &quot;공중에 뜬&quot; 블록(부모가 두 단계 위)이
          생겨 트리가 깨집니다. <code>maxDepth = over.depth + 1</code>, <code>minDepth = 다음 행 깊이</code> 로 가두면
          항상 연결된 트리가 유지됩니다.
        </Callout>
      </DocSection>

      <DocSection index="4.6" label="Result" title="계산은 단 하나의 패치로 끝난다">
        <Prose>
          <p>
            투영 결과는 곧장 <code>block.move</code> 패치 하나로 변환됩니다(<code>createProjectedBlockMovePatch</code>).
            패치라서 되돌리기·낙관적 UI·오프라인 재생이 자연히 따라옵니다. 아래 에디터에서 <strong>⠿ 핸들</strong>을
            잡고 좌우로 밀면 오른쪽 로그에 실제로 나가는 패치가 보입니다.
          </p>
        </Prose>
        <DemoFrame title="Live editor · patch log" hint="⠿ 핸들을 잡고 좌우로 밀어 깊이 조절">
          <EditorWithPatchLog content={nestedContent} />
        </DemoFrame>
      </DocSection>
    </DocPage>
  )
}

export const DragDropDeepDive: Story = {
  name: 'Deep Dive · 중첩 드래그앤드랍',
  render: () => <DeepDivePage />,
}
