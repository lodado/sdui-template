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
  type Layer,
  LayerDiagram,
  type ModuleEntry,
  ModuleMap,
  Prose,
} from './components'
import {
  SduiInspectorDemo,
  SduiNormalizeDemo,
  SduiReferenceDemo,
  SduiSubscriptionDemo,
} from './demos/SduiTemplateDemos'

const meta: Meta = {
  title: 'Document/Architecture/5. sdui-template (SDUI Renderer)',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '서버가 내려준 JSON을 React 트리로 그리는 렌더링 엔진 @lodado/sdui-template — 정규화, ID 기반 선택적 구독 렌더링, 컴포넌트 팩토리, 노드 레퍼런스, Zod 검증, 라이브 인스펙터.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const MODULES: ModuleEntry[] = [
  {
    name: 'store/SduiLayoutStore',
    tag: 'facade',
    desc: '4개 매니저를 하나의 API로 묶는 파사드. updateNodeState·subscribeNode·getNodeById…',
    file: 'store/SduiLayoutStore.ts',
  },
  {
    name: 'store/managers',
    tag: 'managers',
    desc: 'Subscription · LayoutStateRepository · Document · Variables',
    file: 'store/managers/*.ts',
  },
  {
    name: 'react-wrapper/hooks',
    tag: 'hooks',
    desc: 'useSduiNodeSubscription · useRenderNode · useSduiLayoutAction · useSduiNodeReference',
    file: 'react-wrapper/hooks/*.ts',
  },
  {
    name: 'react-wrapper/components',
    tag: 'render',
    desc: 'SduiLayoutRenderer(파사드) · Inner · SduiLayoutStateInspector',
    file: 'react-wrapper/components/*.tsx',
  },
  {
    name: 'utils/normalize',
    tag: 'normalize',
    desc: 'normalizeSduiLayout · denormalizeSduiLayout — 트리 ↔ 평탄 맵',
    file: 'utils/normalize/*.ts',
  },
  {
    name: 'schema',
    tag: 'zod',
    desc: 'SduiLayoutDocument · SduiLayoutNode 계약과 검증',
    file: 'schema/*.ts',
  },
  {
    name: 'components',
    tag: 'factory',
    desc: 'ComponentFactory 타입 · componentMap · defaultComponentFactory',
    file: 'components/*.ts',
  },
]

const MANAGERS: Layer[] = [
  {
    name: 'SubscriptionManager',
    tag: 'observer',
    accent: '#216e4e',
    desc: (
      <>
        노드별·버전별 구독자를 관리. <code>notifyNode(id)</code> 는 그 노드 구독자만, <code>notifyVersion()</code> 은
        구조 구독자를 깨웁니다.
      </>
    ),
  },
  {
    name: 'LayoutStateRepository',
    tag: 'state',
    accent: '#227d9b',
    desc: (
      <>
        평탄한 노드 레지스트리 + <code>rootId</code> · 변수 · 버전 · <code>lastModified</code> 를 보관하는 저장소.
      </>
    ),
  },
  {
    name: 'DocumentManager',
    tag: 'cache',
    accent: '#6e5dc6',
    desc: <>메타데이터와 원본 문서를 캐시 — resetToInitial·cancelEdit 이 여기서 원본을 되살립니다.</>,
  },
  {
    name: 'VariablesManager',
    tag: 'variables',
    accent: '#a54800',
    desc: <>전역 변수 갱신을 깊은 복사로 처리해 참조를 바꾸고 리렌더를 유발.</>,
  },
]

const FACTORY_CODE = `// 컴포넌트 팩토리 = (id, parentPath) => ReactNode.
// 타입 문자열을 실제 React 컴포넌트로 잇는 유일한 연결점.
const CounterCard: ComponentFactory = (id) => <CounterCardView nodeId={id} />

function CounterCardView({ nodeId }: { nodeId: string }) {
  // 이 노드 하나만 구독 — 다른 노드가 바뀌어도 여기는 안 깨어남
  const { state } = useSduiNodeSubscription({ nodeId })
  return <div>count: {String(state.count ?? 0)}</div>
}

// 렌더러에 맵으로 주입. 우선순위: byNodeId > byNodeType > components > 기본
<SduiLayoutRenderer document={doc} components={{ CounterCard }} />`

const RENDER_PRIORITY = `// 자식 렌더링은 render-props 훅으로.
function Container({ nodeId }: { nodeId: string }) {
  const { childrenIds } = useSduiNodeSubscription({ nodeId })
  const { renderChildren } = useRenderNode({ nodeId })
  return <div>{renderChildren(childrenIds)}</div>
}
// renderNode(id) 우선순위:
//   byNodeId[id] > byNodeType[type] > components[type] > defaultComponentFactory`

const ZOD_CODE = `import { z } from 'zod'

const toggleStateSchema = z.object({
  isChecked: z.boolean(),
  label: z.string(),
})

// 구독하면서 동시에 검증 — 실패 시 throw, 성공 시 타입이 스키마로 좁혀짐
const { state } = useSduiNodeSubscription({
  nodeId: 'toggle-1',
  schema: toggleStateSchema,
})
state.isChecked // boolean 으로 타입 추론`

const RendererPage = () => {
  return (
    <DocPage accent="renderer">
      <DocHero
        kicker="Package · @lodado/sdui-template"
        title="서버 JSON을 그리는 SDUI 렌더링 엔진"
        lead="레포 이름값을 하는 핵심 패키지. 문서 편집과 무관하게, 어떤 JSON 레이아웃이든 컴포넌트 트리로 렌더합니다. 비결은 정규화된 노드 맵과 ID 기반 구독 — 노드 하나가 바뀌면 그 노드만 다시 그립니다."
        pills={['SduiLayoutRenderer', 'normalize', 'useSyncExternalStore', 'ComponentFactory', 'node reference', 'zod']}
      />

      <DocSection index="5.1" label="Module map" title="src/ 모듈 지도">
        <Prose>
          <p>
            스토어(파사드 + 4매니저), 훅, 렌더러, 정규화, 스키마, 컴포넌트 팩토리로 나뉩니다. 대부분의 사용자는{' '}
            <code>SduiLayoutRenderer</code> 하나만 쓰지만, 내부는 이렇게 쪼개져 각자 한 가지 일만 합니다.
          </p>
        </Prose>
        <ModuleMap modules={MODULES} />
      </DocSection>

      <DocSection index="5.2" label="Facade" title="파사드 + 4개 매니저">
        <Prose>
          <p>
            <code>SduiLayoutStore</code> 는 직접 상태를 들지 않고 4개의 좁은 매니저에 위임하는 파사드입니다. 덕분에
            &quot;구독&quot;, &quot;상태 저장&quot;, &quot;문서 캐시&quot;, &quot;변수&quot; 가 서로 얽히지 않습니다.
          </p>
        </Prose>
        <LayerDiagram layers={MANAGERS} connector="+" />
      </DocSection>

      <DocSection index="5.3" label="Normalize" title="정규화 · 트리를 평탄한 맵으로">
        <Prose>
          <p>
            들어온 중첩 문서는 <code>normalizeSduiLayout</code> 으로 <code>id → 노드</code> 맵과 각 노드의{' '}
            <code>childrenIds</code> 로 평탄화됩니다. 이래야 어떤 노드든 O(1)로 찾고, <strong>ID 단위로 구독</strong>할
            수 있습니다. 아래에서 입력/출력을 나란히 보세요.
          </p>
        </Prose>
        <DemoFrame title="normalizeSduiLayout" hint="입력 트리 ↔ 출력 nodes 맵 전환">
          <SduiNormalizeDemo />
        </DemoFrame>
      </DocSection>

      <DocSection index="5.4" label="Subscription" title="ID 기반 선택적 리렌더 · 핵심">
        <Prose>
          <p>
            이 패키지의 심장입니다. 각 컴포넌트는 <code>useSduiNodeSubscription({'{ nodeId }'})</code> 로{' '}
            <strong>자기 노드 하나만</strong> 구독합니다. <code>store.updateNodeState(id, …)</code> 는{' '}
            <code>notifyNode(id)</code> 로 그 노드 구독자만 깨우므로, 큰 문서에서도 바뀐 노드만 리렌더됩니다. 아래
            카드마다 자기 렌더 횟수를 표시합니다 — 한 카드를 +1 해보세요.
          </p>
        </Prose>
        <DemoFrame title="Selective re-render" hint="한 카드만 +1 → 그 카드 렌더 횟수만 증가">
          <SduiSubscriptionDemo />
        </DemoFrame>
        <Callout icon="◆">
          <strong>왜 빠른가:</strong> cloneDeep 없이 노드 상태만 병합하고, <code>lastModified</code> 참조 비교로{' '}
          <code>useSyncExternalStore</code> 가 변화를 감지합니다. 구독하지 않은 수백 개 노드는 애초에 콜백이 걸리지
          않습니다.
        </Callout>
      </DocSection>

      <DocSection index="5.5" label="Factory" title="컴포넌트 팩토리 + 렌더러">
        <Prose>
          <p>
            타입 문자열(<code>&quot;CounterCard&quot;</code>)을 실제 React 컴포넌트로 잇는 건{' '}
            <code>ComponentFactory</code> 하나뿐입니다. 렌더러는 root부터 재귀로 내려가며 각 노드 타입에 맞는 팩토리를
            찾습니다. 컨테이너는 <code>useRenderNode</code> 의 <code>renderChildren</code> 으로 자식을 그립니다.
          </p>
        </Prose>
        <CodeSnippet file="components/types.ts · 사용 예" code={FACTORY_CODE} />
        <CodeSnippet file="react-wrapper/hooks/useRenderNode.ts · 우선순위" code={RENDER_PRIORITY} />
      </DocSection>

      <DocSection index="5.6" label="Reference" title="노드 레퍼런스 · 노드가 노드를 구독">
        <Prose>
          <p>
            노드는 <code>reference</code> 필드로 다른 노드를 가리킬 수 있습니다.{' '}
            <code>useSduiNodeReference({'{ nodeId }'})</code> 는 참조 대상의 상태를 읽고 그 노드를 자동 구독합니다 —
            원본이 바뀌면 참조하는 쪽도 리렌더. 파생 UI(요약 배지, 미러 뷰)를 상태 복제 없이 만듭니다.
          </p>
        </Prose>
        <DemoFrame title="Node reference" hint="원본 +1 → 거울 노드가 따라 리렌더">
          <SduiReferenceDemo />
        </DemoFrame>
      </DocSection>

      <DocSection index="5.7" label="Validation" title="Zod 스키마 검증">
        <Prose>
          <p>
            구독 시 <code>schema</code> 를 넘기면 노드 상태를 Zod로 검증하고, 성공 시 반환 <code>state</code> 타입이
            스키마로 좁혀집니다. 서버가 내려준 신뢰할 수 없는 JSON을 시스템 경계에서 안전하게 다루는 지점입니다.
          </p>
        </Prose>
        <CodeSnippet file="react-wrapper/hooks/useSduiNodeSubscription.ts" code={ZOD_CODE} />
        <BadgeRow
          items={['SduiLayoutDocument', 'SduiLayoutNode', 'z.infer<TSchema>', 'safeParse', 'throw on invalid']}
        />
      </DocSection>

      <DocSection index="5.8" label="Inspect" title="라이브 인스펙터 · 두 개의 구독 채널">
        <Prose>
          <p>
            <code>SduiLayoutStateInspector</code> 를 <code>SduiLayoutRenderer</code> 의 자식으로 넣으면 같은 스토어에
            붙습니다. 단, 커넥티드 인스펙터는 <strong>버전 구독</strong>(<code>subscribeVersion</code>)만 합니다. 그래서{' '}
            <strong>노드 +1</strong>(<code>updateNodeState → notifyNode</code>)은 5.4의 선택적 리렌더 그대로 — 그 카드만
            바뀌고 <em>인스펙터는 움직이지 않습니다</em>. <strong>버전 갱신</strong>(
            <code>updateVariable → notifyVersion</code>)을 눌러야 인스펙터가 전체를 다시 읽어 그동안 쌓인 노드 변화가
            한꺼번에 반영됩니다.
          </p>
        </Prose>
        <DemoFrame title="Live SduiLayoutStore" hint="노드 +1 → 인스펙터 정지 · 버전 갱신 → 반영">
          <SduiInspectorDemo />
        </DemoFrame>
        <Callout icon="◆">
          <strong>왜 이렇게 나뉘나:</strong> 노드 채널과 버전 채널을 분리했기에 5.4의 선택적 리렌더가 가능합니다. 디버그
          패널이 모든 노드 편집마다 전체를 다시 그리면 그 최적화가 깨지므로, 인스펙터는 구조·변수 변화(버전)에만
          반응합니다.
        </Callout>
      </DocSection>
    </DocPage>
  )
}

export const Renderer: Story = {
  name: 'sdui-template (SDUI Renderer)',
  render: () => <RendererPage />,
}
