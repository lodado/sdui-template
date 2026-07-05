import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import {
  Callout,
  DocHero,
  DocPage,
  DocSection,
  type FeatureGroup,
  FeatureTable,
  type Layer,
  LayerDiagram,
  Prose,
} from './components'

const meta: Meta = {
  title: 'Document/Architecture/0. 기능 지도 (Feature Map)',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '이 레포에 어떤 기능이 있는지 한 페이지로 훑어보는 지도. 각 기능이 무엇을 하고, 무엇을 호출하며, 어느 파일에 사는지 정리했습니다. 처음 온 사람은 여기서 시작하세요.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const LAYERS: Layer[] = [
  {
    name: '@lodado/sdui-document',
    tag: 'domain · headless',
    accent: '#6e5dc6',
    desc: (
      <>
        문서의 <strong>의미</strong>를 소유하는 순수 TypeScript 코어. 블록 트리, 패치 엔진, 순서 키, 마크다운, 권한,
        autosave. React를 모릅니다.
      </>
    ),
  },
  {
    name: '@lodado/sdui-document-react',
    tag: 'editor UI',
    accent: '#1868db',
    desc: (
      <>
        코어를 <strong>Notion형 에디터</strong>로 바인딩. 드래그앤드랍, 블록 메뉴, undo/redo, 포커스 블록 ProseMirror.
      </>
    ),
  },
  {
    name: '@lodado/sdui-template',
    tag: 'SDUI renderer',
    accent: '#227d9b',
    desc: (
      <>
        서버 JSON을 React 컴포넌트로 렌더링하는 <strong>SDUI 엔진</strong>. 구독 기반 부분 렌더링, 정규화, 컴포넌트
        레지스트리.
      </>
    ),
  },
]

const CORE_GROUP: FeatureGroup = {
  package: '@lodado/sdui-document',
  tag: 'headless core',
  accent: '#6e5dc6',
  rows: [
    {
      name: '패치 엔진',
      what: (
        <>
          모든 편집은 불변 패치. <code>insert · update · delete · move · split · merge · setType</code> 를 순수 리듀서로
          적용. 직렬화 가능해 undo·오프라인 재생·감사로그가 공짜.
        </>
      ),
      api: 'applyDocumentPatch, SduiDocumentPatch',
      file: 'blocks/code/patchEngine.ts',
    },
    {
      name: '중첩 드래그 계산',
      what: (
        <>
          포인터 위치 → 드롭 슬롯 투영. 세로 3존 + 가로 깊이로 트리 어디에 꽂을지 계산. 자기 자손으로의 드롭은 거부.{' '}
          <strong>자세한 원리는 4번 문서</strong>.
        </>
      ),
      api: 'projectNestedBlockDrop, createProjectedBlockMovePatch',
      file: 'blocks/drag/dropProjection.ts',
    },
    {
      name: '트리 이동 + 역연산',
      what: <>블록 재배치. 되돌리기용 inverse 연산을 함께 반환해 undo/redo가 정확히 복원됩니다.</>,
      api: 'moveDocument, moveDocumentWithInverse',
      file: 'tree/documentTree.ts',
    },
    {
      name: 'Fractional 순서 키',
      what: <>형제 사이에 삽입해도 재정렬 없이 O(1). 두 키 사이의 중간 키를 생성하는 사전식 인덱싱.</>,
      api: 'generateOrderKey, rebalanceOrderKeys',
      file: 'ordering/generate.ts',
    },
    {
      name: '블록 타입 · 마크',
      what: (
        <>heading·paragraph·checklist 등 블록 스키마와 bold·italic·link 인라인 마크를 Strategy 레지스트리로 확장.</>
      ),
      api: 'BLOCK_TYPES, createDefaultBlock, MARK_TYPES',
      file: 'block-types/, marks/',
    },
    {
      name: '컬럼 레이아웃 · 리사이즈',
      what: (
        <>
          <code>columnList/column</code> 불변식을 정규화하고, 가로 드롭으로 2단 레이아웃을 만들며, gutter 드래그는 인접
          컬럼의 <code>ratio</code> 만 패치합니다.
        </>
      ),
      api: 'createHorizontalBlockDropPatches, resizeColumnPair, normalizeColumnStructure',
      file: 'blocks/drag/columnDropPatches.ts, blocks/code/columnResize.ts',
    },

    {
      name: '마크다운 임포트/익스포트',
      what: <>marked 토큰 ↔ 문서 트리 양방향 변환.</>,
      api: 'fromMarkdown, toMarkdown',
      file: 'markdown/',
    },
    {
      name: '권한 정책',
      what: <>역할 × 액션 매트릭스. 상태 없는 순수 함수 — viewer는 move 불가 같은 규칙을 판정.</>,
      api: 'hasPermission, ActorRole, DocumentAction',
      file: 'permissions/policy.ts',
    },
    {
      name: 'Autosave 상태 머신',
      what: <>local·saving·offline 전이를 결정론적 리듀서로. 언제 flush할지, 네트워크 에러를 어떻게 큐잉할지 정의.</>,
      api: 'autosaveReducer, AutosaveState',
      file: 'autosave/autosaveMachine.ts',
    },
    {
      name: '어댑터 계약',
      what: <>저장소·스토리지·검색·협업 전송을 인터페이스로만 열어둠. 구현은 코어 밖에서 주입.</>,
      api: 'DocumentRepository, StorageProvider, SearchIndex, CollaborationAdapter',
      file: 'repositories/, storage/, search/, collaboration/',
    },
    {
      name: '협업 패치 로그 (이벤트소싱)',
      what: (
        <>
          편집을 append-only 로그의 이벤트로. HLC 시계 + <code>PatchEnvelope</code> 전송, 순수 서버 sequencer가
          블록단위로 충돌 판정 후 seq 부여, 클라이언트 outbox가 낙관적 편집을 rebase. 순서 권위는 서버 seq.{' '}
          <strong>Deep Dive 26번</strong>.
        </>
      ),
      api: 'commitEnvelope, appendToLog, reconcileRemote, hlcTick, upsertPresence, createSnapshot',
      file: 'collaboration/{sequencer,documentLog,outbox,hlc,presence,snapshot}.ts',
    },
    {
      name: 'SDUI 어댑터',
      what: <>의미 블록 → SDUI 레이아웃 노드로 변환해 sdui-template 렌더러로 발행/미리보기 재사용.</>,
      api: 'toSduiLayoutDocument, fromSduiLayout',
      file: 'sdui/toSduiLayout.ts',
    },
  ],
}

const REACT_GROUP: FeatureGroup = {
  package: '@lodado/sdui-document-react',
  tag: 'editor UI',
  accent: '#1868db',
  rows: [
    {
      name: 'SduiDocumentEditor',
      what: <>블록 구조는 React가, 포커스된 한 블록만 ProseMirror가 담당하는 하이브리드 에디터 컴포넌트.</>,
      api: 'SduiDocumentEditor',
      file: 'editor/SduiDocumentEditor.tsx',
    },
    {
      name: '중첩 드래그앤드랍',
      what: (
        <>
          dnd-kit 이벤트를 투영 로직에 연결. 드롭 인디케이터는 React state가 아닌 DOM 조작으로 60fps 유지. 놓으면{' '}
          <code>block.move</code> 패치.
        </>
      ),
      api: 'useNestedBlockDragDrop',
      file: 'editor/hooks/useNestedBlockDragDrop.ts',
    },
    {
      name: 'Undo / Redo (트리 이동)',
      what: (
        <>트리 이동 전용 2-스택 히스토리. 인라인 패치 히스토리와 분리. 충돌 시 조용히 드롭, archive/restore는 우회.</>
      ),
      api: 'useDocumentTreeHistory',
      file: 'editor/hooks/useDocumentTreeHistory.ts',
    },
    {
      name: '블록 메뉴 (슬래시 / + 버튼)',
      what: <>10종 블록 레지스트리 + 한/영 키워드 검색. `/` 키 또는 좌측 + 버튼으로 Radix Popover 오픈.</>,
      api: 'BLOCK_MENU_ITEMS, filterBlockMenuItems, BlockMenu',
      file: 'editor/block-menu/',
    },
    {
      name: '셀렉션 툴바',
      what: <>텍스트 선택 시 떠오르는 서식·링크 툴바.</>,
      api: 'SelectionToolbar',
      file: 'selection-toolbar/',
    },
    {
      name: '에디터 UI 스토어',
      what: <>포커스 블록 ID·메뉴 열림 같은 일시적 UI 상태를 문서 내용과 분리해 구독형으로 관리.</>,
      api: 'EditorUIStore',
      file: 'editor/uiStore.ts',
    },
  ],
}

const TEMPLATE_GROUP: FeatureGroup = {
  package: '@lodado/sdui-template',
  tag: 'SDUI renderer',
  accent: '#227d9b',
  rows: [
    {
      name: 'SduiLayoutStore (Facade)',
      what: <>정규화된 노드 레지스트리 + 버전 기반 변경 추적. 4개 매니저(구독·문서·상태·변수)를 조율.</>,
      api: 'SduiLayoutStore',
      file: 'store/SduiLayoutStore.ts',
    },
    {
      name: '구독 기반 렌더링',
      what: (
        <>
          <code>useSyncExternalStore</code> 로 노드별/버전별 구독. 바뀐 노드만 리렌더 — 큰 문서도 부분 갱신.
        </>
      ),
      api: 'useSduiNodeSubscription, useRenderNode, useSduiLayoutAction',
      file: 'react-wrapper/hooks/',
    },
    {
      name: '컴포넌트 팩토리 + 렌더러',
      what: <>type 문자열 → React 컴포넌트 매핑. root부터 재귀 순회하며 state·attributes·children 주입.</>,
      api: 'SduiLayoutRenderer, ComponentFactory',
      file: 'react-wrapper/components/SduiLayoutRenderer.tsx',
    },
    {
      name: '정규화 / 역정규화',
      what: <>중첩 트리 ↔ 평탄한 {'{ nodes, root }'} 레지스트리. O(1) 조회를 위해 normalizr 방식으로 분해·재조립.</>,
      api: 'normalizeSduiLayout, denormalizeSduiLayout',
      file: 'utils/normalize/',
    },
    {
      name: 'Zod 스키마',
      what: <>SduiLayoutDocument·Node 계약을 Zod로 검증. 시스템 경계에서 외부 JSON을 안전하게 파싱.</>,
      api: 'SduiLayoutDocument, SduiLayoutNode',
      file: 'schema/',
    },
    {
      name: '레이아웃 상태 인스펙터',
      what: <>Document·Nodes·Store 3탭 디버그 패널. 정적 문서 또는 라이브 스토어 스냅샷을 JSON으로 표시.</>,
      api: 'SduiLayoutStateInspector',
      file: 'react-wrapper/components/SduiLayoutStateInspector.tsx',
    },
  ],
}

const COMPONENT_GROUP: FeatureGroup = {
  package: '@lodado/sdui-template-component',
  tag: 'component library',
  accent: '#227d9b',
  rows: [
    {
      name: 'sduiComponents 레지스트리',
      what: <>Div·Button·Dialog·Dropdown·TextField·Canvas3D 등 45개 컴포넌트 타입을 한 맵으로. 렌더러에 그대로 주입.</>,
      api: 'sduiComponents, createSduiComponents',
      file: 'app/sduiComponents.tsx',
    },
    {
      name: '컴파운드 컴포넌트',
      what: <>Dialog·Dropdown·Popover를 Trigger/Content/Item 하위 타입으로 분해한 SDUI 컴파운드 패턴.</>,
      api: 'DialogContainer, DropdownContainer',
      file: 'shared/ui/dialog|dropdown|popover/',
    },
    {
      name: '폼 검증 통합',
      what: <>폼 ID별 Zod 스키마 등록 후 제출 시 검증.</>,
      api: 'registerSchemas',
      file: 'features/form/',
    },
    {
      name: 'Canvas3D 렌더 전략 주입',
      what: <>기본은 렌더 없음. 클라이언트가 3D 렌더 전략을 주입해 확장.</>,
      api: 'Canvas3DContainer, RenderStrategy',
      file: 'shared/ui/canvas-3d/',
    },
  ],
}

const GROUPS = [CORE_GROUP, REACT_GROUP, TEMPLATE_GROUP, COMPONENT_GROUP]

const FeatureMapPage = () => {
  return (
    <DocPage accent="overview">
      <DocHero
        kicker="SDUI · 기능 지도"
        title="이 레포에 뭐가 들어있나"
        lead="세 개의 패키지가 각자 한 가지 일을 합니다 — 코어는 문서의 의미를, React 레이어는 편집 UI를, 템플릿 레이어는 서버 주도 렌더링을. 아래 표에서 기능마다 '무엇을 / 무엇을 호출 / 어디에' 를 확인하세요."
        pills={['headless core', 'hybrid editor', 'SDUI renderer', 'patch-based', 'zod-validated']}
      />

      <DocSection index="0.1" label="Big picture" title="세 개의 레이어, 한 방향 의존">
        <Prose>
          <p>
            의존은 <strong>한 방향</strong>입니다: <code>sdui-document-react → sdui-document</code>. 코어는 어떤 UI도
            모르므로 같은 문서 모델을 CLI·서버·다른 렌더러에서 재사용할 수 있습니다. 렌더링이 필요할 때만 SDUI 어댑터가
            코어를 <code>sdui-template</code> 노드로 변환합니다.
          </p>
        </Prose>
        <LayerDiagram layers={LAYERS} />
      </DocSection>

      <DocSection index="0.2" label="Catalogue" title="기능 카탈로그">
        <Prose>
          <p>
            처음이라면 이름과 <strong>하는 일</strong> 컬럼만 읽어도 전체 그림이 잡힙니다. 더 파고들 땐 API 이름으로
            코드를, 파일 경로로 위치를 찾으세요. 아래 표의 <strong>모든 기능</strong>은 <code>Document/Deep Dive</code>{' '}
            챕터에 기능별 전용 문서나 섹션(인터랙티브 데모 + 단계별 설명)으로 정리돼 있습니다.
          </p>
        </Prose>
        <FeatureTable groups={GROUPS} />
        <Callout icon="◆">
          <strong>더 파고들기:</strong> 아키텍처 개요는 <code>1~3. sdui-document / react</code> 와{' '}
          <code>5~6. sdui-template / component</code>, 기능별 딥다이브는 <code>Document/Deep Dive</code> 챕터의 27개
          문서로. 각 문서가 이 표의 한 줄에 대응합니다.
        </Callout>
      </DocSection>
    </DocPage>
  )
}

export const FeatureMap: Story = {
  name: '기능 지도 (Feature Map)',
  render: () => <FeatureMapPage />,
}
