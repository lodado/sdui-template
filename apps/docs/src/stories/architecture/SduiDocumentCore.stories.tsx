import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  BadgeRow,
  Callout,
  CodeSnippet,
  DemoFrame,
  DocHero,
  DocPage,
  DocSection,
  type ModuleEntry,
  ModuleMap,
  Prose,
} from './components'
import { AutosaveDemo } from './demos/AutosaveDemo'
import { EditorWithPatchLog } from './demos/EditorWithPatchLog'
import { FractionalOrderDemo } from './demos/FractionalOrderDemo'
import { MarkdownImportDemo } from './demos/MarkdownImportDemo'
import { overviewContent } from './demos/sampleContents'
import { UndoRedoDemo } from './demos/UndoRedoDemo'

const meta: Meta = {
  title: 'Document/Architecture/2. sdui-document (Core)',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '헤드리스 도메인 패키지 @lodado/sdui-document 의 내부 구조 — 패치 엔진, fractional 순서, undo/redo, 마크다운, autosave, 어댑터 계약.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const MODULES: ModuleEntry[] = [
  {
    name: 'blocks/schema',
    tag: 'types',
    desc: 'SduiDocumentBlock · Content · Patch 불변 계약과 zod 검증',
    file: 'blocks/schema/*.ts',
  },
  {
    name: 'blocks/code',
    tag: 'engine',
    desc: 'applyDocumentPatch · computeInverse — 패치 적용 + copy-on-write',
    file: 'blocks/code/blockPatch.ts',
  },
  {
    name: 'ordering',
    tag: 'ordering',
    desc: 'fractional 키 생성·비교·마이그레이션·재균형',
    file: 'ordering/generate.ts',
  },
  {
    name: 'block-types',
    tag: 'strategy',
    desc: '타입별 모듈(9종): 도메인 ↔ SDUI 매핑',
    file: 'block-types/*/*.ts',
  },
  { name: 'marks', tag: 'inline', desc: 'bold·italic·code·link·highlight 등 마크 정의(7종)', file: 'marks/*/*.ts' },
  {
    name: 'content',
    tag: 'traversal',
    desc: 'walkDocumentBlocks · extractPlainText · extractDocumentLinks',
    file: 'content/*.ts',
  },
  {
    name: 'markdown',
    tag: 'import',
    desc: 'markdownToSduiDocumentContent — marked 렉서 → 블록',
    file: 'markdown/fromMarkdown.ts',
  },
  {
    name: 'autosave',
    tag: 'reducer',
    desc: 'reduceAutosaveState — 타이머 없는 순수 상태 머신',
    file: 'autosave/autosaveMachine.ts',
  },
  {
    name: 'permissions',
    tag: 'policy',
    desc: 'canPerformDocumentAction — 역할/액션 순수 정책',
    file: 'permissions/policy.ts',
  },
  {
    name: 'repositories · storage',
    tag: 'contract',
    desc: '영속·첨부 저장 어댑터 인터페이스(구현 없음)',
    file: 'repositories/contracts.ts',
  },
  {
    name: 'search · collaboration',
    tag: 'contract',
    desc: '검색 인덱서·협업 어댑터 계약 (미래 확장점)',
    file: 'collaboration/contracts.ts',
  },
  { name: 'sdui', tag: 'adapter', desc: 'toSduiLayoutDocument — 문서 → SDUI 레이아웃', file: 'sdui/toSduiLayout.ts' },
]

const PATCH_CODE = `// 모든 편집은 직렬화 가능한 패치. 적용은 순수 함수.
const patch: SduiDocumentPatch = {
  type: 'block.insert',
  parentId: 'root',
  block: createDocumentBlock({ id: 'p2', type: 'document.paragraph' }),
}

const next = applyDocumentPatch(content, patch)
// content는 그대로 — 건드린 조상 경로만 복사(copy-on-write),
// 나머지 서브트리는 참조를 공유해 memo 행이 재렌더를 건너뜀.`

const INVERSE_CODE = `// applyDocumentPatchesWithInverse 가 각 배치의 역패치를 함께 계산.
const { content: next, inverse } = applyDocumentPatchesWithInverse(content, patches)

// 2-스택 히스토리에 (undo=inverse, redo=patches) 쌍으로 기록.
let history = recordHistoryEntry(createDocumentHistory(), { undo: inverse, redo: patches })

const step = undoHistory(history)          // → { history, entry }
if (step) applyDocumentPatchesWithInverse(next, step.entry.undo)`

const CONTRACT_CODE = `// 코어는 인터페이스만 정의하고 구현은 소비자가 주입.
interface SduiDocumentRepository {
  load(id: SduiDocumentId): Promise<SduiDocument | null>
  save(document: SduiDocument): Promise<void>
  list(workspaceId: string): Promise<SduiDocumentSummary[]>
}

interface SduiDocumentAttachmentStorage {
  put(file: File): Promise<{ url: string }>
  remove(url: string): Promise<void>
}
// → DB·S3·메모리 어떤 백엔드로도 교체 가능. 도메인은 순수하게 유지.`

const CorePage = () => {
  return (
    <DocPage accent="core">
      <DocHero
        kicker="Package · @lodado/sdui-document"
        title="문서 의미를 소유하는 헤드리스 도메인"
        lead="React도 ProseMirror도 DB도 모르는 순수 TypeScript 패키지. 블록 스키마와 패치 엔진을 중심으로, 순서·마크·마크다운·autosave·권한·어댑터 계약이 모듈로 나뉩니다."
        pills={['applyDocumentPatch', 'fractional-indexing', 'computeInverse', 'reduceAutosaveState', 'zod']}
      />

      <DocSection index="2.1" label="Module map" title="src/ 모듈 지도">
        <Prose>
          <p>
            각 모듈은 좁은 책임을 가지고 <code>index.ts</code> 로 공개 API를 노출합니다. 계약(contract) 모듈은
            인터페이스만 제공하고 구현은 소비자에게 맡깁니다.
          </p>
        </Prose>
        <ModuleMap modules={MODULES} />
      </DocSection>

      <DocSection index="2.2" label="Patch engine" title="패치 시스템 · Copy-on-Write">
        <Prose>
          <p>
            <code>applyDocumentPatch(content, patch)</code> 는 새 content를 반환하는 순수 함수입니다. 패치가 건드린{' '}
            <strong>조상 경로만 복사</strong>되고 나머지 서브트리는 이전 참조를 그대로 공유합니다. 덕분에 React 레이어의
            memo 행이 변하지 않은 블록의 재렌더를 건너뜁니다.
          </p>
        </Prose>
        <CodeSnippet file="blocks/code/blockPatch.ts" code={PATCH_CODE} />
        <DemoFrame title="Live patch log" hint="블록을 클릭해 편집 · Enter/Backspace/Tab">
          <EditorWithPatchLog content={overviewContent} />
        </DemoFrame>
      </DocSection>

      <DocSection index="2.3" label="History" title="Undo / Redo · Command 패턴">
        <Prose>
          <p>
            편집을 패치로 표현하면 역연산이 자연히 나옵니다. <code>applyDocumentPatchesWithInverse</code> 가 각 배치의
            역패치를 계산하고, 2-스택 <code>DocumentHistory</code> 가 양방향으로 재생합니다. 아래 데모는 에디터 없이{' '}
            <strong>도메인 API만으로</strong> 동작합니다.
          </p>
        </Prose>
        <CodeSnippet file="blocks/code/documentHistory.ts" code={INVERSE_CODE} />
        <DemoFrame title="Headless undo/redo" hint="도메인 히스토리 API 직접 구동">
          <UndoRedoDemo />
        </DemoFrame>
      </DocSection>

      <DocSection index="2.4" label="Ordering" title="Fractional Indexing · 충돌 없는 순서">
        <Prose>
          <p>
            형제 블록은 배열 인덱스가 아니라 <strong>fractional 키</strong>로 정렬됩니다. 두 블록 사이에 삽입할 때{' '}
            <code>generatePositionBetween</code> 이 <em>사이 값</em>을 새로 만들 뿐, 이웃의 키는 바뀌지 않습니다.
            재인덱싱 없는 단일 <code>block.insert</code> — 동시 삽입도 충돌하지 않습니다. 키가 소진되면{' '}
            <code>BlockOrigin</code> (clientId·opId)로 결정적 tie-break 합니다.
          </p>
        </Prose>
        <DemoFrame title="Insert between siblings" hint="사이 키를 생성해도 이웃 position 불변">
          <FractionalOrderDemo />
        </DemoFrame>
        <BadgeRow
          items={[
            'generatePositionBetween',
            'sortChildren',
            'resolvePositionBounds',
            'ensureFractionalContent (1.0→1.1)',
            'rebalance',
          ]}
        />
      </DocSection>

      <DocSection index="2.5" label="Types & marks" title="블록 타입 · 마크 모듈 · Strategy 패턴">
        <Prose>
          <p>
            블록 타입마다 <code>SduiBlockTypeModule</code> 하나(도메인 ↔ SDUI 매핑)를, 마크마다{' '}
            <code>SduiMarkModule</code> 하나를 둡니다. 새 타입 추가는 코어 스키마를 건드리지 않고 모듈을 등록하는 것으로
            끝납니다.
          </p>
        </Prose>
        <div
          style={{
            display: 'grid',
            gap: 12,
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            marginTop: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--doc-text-subtle)', marginBottom: 8 }}>
              블록 타입 (9)
            </div>
            <BadgeRow
              items={['root', 'paragraph', 'heading', 'checklist', 'callout', 'divider', 'image', 'file', 'link']}
            />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--doc-text-subtle)', marginBottom: 8 }}>
              인라인 마크 (7)
            </div>
            <BadgeRow items={['bold', 'italic', 'underline', 'strikethrough', 'code', 'link', 'highlight']} />
          </div>
        </div>
      </DocSection>

      <DocSection index="2.6" label="Markdown" title="Markdown 임포트">
        <Prose>
          <p>
            <code>markdownToSduiDocumentContent</code> 는 marked 렉서 토큰을 블록 스키마로 매핑합니다 — 제목·문단·태스크
            리스트·인용문(→callout)·이미지. 붙여넣기 경로도 이 임포터를 거칩니다.
          </p>
        </Prose>
        <DemoFrame title="Markdown → Document" hint="왼쪽을 편집하면 오른쪽이 즉시 변환" split>
          <MarkdownImportDemo />
        </DemoFrame>
      </DocSection>

      <DocSection index="2.7" label="Autosave" title="Autosave 상태 머신">
        <Prose>
          <p>
            <code>reduceAutosaveState(state, event)</code> 는 타이머도 네트워크도 없는 순수 리듀서입니다. 저장 루프가
            발생시킬 이벤트를 직접 디스패치하며 상태 전이를 확인하세요.
          </p>
        </Prose>
        <DemoFrame title="reduceAutosaveState" hint="이벤트를 눌러 상태 전이 관찰">
          <AutosaveDemo />
        </DemoFrame>
      </DocSection>

      <DocSection index="2.8" label="Adapters" title="어댑터 계약 · 구현은 밖으로">
        <Prose>
          <p>
            영속·첨부·검색·협업은 <strong>인터페이스만</strong> 정의됩니다. 도메인은 백엔드 선택을 알지 못하므로
            순수하게 유지되고, 소비자가 DB·스토리지·검색 엔진을 주입합니다. 라이브 데모가 없는 유일한 영역 — 계약만
            존재하기 때문입니다.
          </p>
        </Prose>
        <CodeSnippet file="repositories/contracts.ts · storage/contracts.ts" code={CONTRACT_CODE} />
        <Callout icon="◆">
          <strong>collaboration</strong> 어댑터는 blockVersions·presence 를 포함해 미래의 문자 단위 협업을 위한 확장점을
          열어둡니다 — 지금은 계약만, 구현은 없음.
        </Callout>
      </DocSection>
    </DocPage>
  )
}

export const Core: Story = {
  name: 'sdui-document (Core)',
  render: () => <CorePage />,
}
