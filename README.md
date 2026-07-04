# @lodado/sdui-template

**SDUI Template for React** — 서버가 UI 구조를 JSON 문서로 정의하고, React 앱이 그 문서를 타입 안전하게 렌더링하는 Server-Driven UI 템플릿 라이브러리입니다.

`sdui-template`은 “서버가 어떤 화면을 보여줄지 결정하고, 클라이언트는 등록된 React 컴포넌트로 그 결정을 해석한다”는 단순한 모델 위에 만들어졌습니다. 대시보드 빌더, 폼 빌더, 실험형 UI, CMS/어드민 화면처럼 **배포 없이 화면 구성을 바꾸고 싶은 React/Next.js 앱**에 맞춰져 있습니다.

## 핵심 요약

- **Server-Driven UI**: UI 트리를 `SduiLayoutDocument` JSON으로 표현합니다.
- **React renderer**: `SduiLayoutRenderer`가 문서를 읽고 등록된 컴포넌트 팩토리를 호출합니다.
- **Typed state**: 각 노드의 `state`는 Zod 스키마로 검증하고 타입 추론할 수 있습니다.
- **Node-level subscription**: 전체 트리를 다시 그리지 않고 변경된 노드 중심으로 구독/갱신합니다.
- **Node reference**: 한 노드가 다른 노드의 상태를 참조하고 변경을 구독할 수 있습니다.
- **Recursive rendering**: `children` 기반 중첩 UI를 자연스럽게 재귀 렌더링합니다.
- **Next.js friendly**: App Router 환경에서 client component로 사용할 수 있습니다.
- **Monorepo packages**: 코어 렌더러, 기본 컴포넌트, 디자인 토큰, 문서 에디터 도메인이 분리되어 있습니다.

## 설치

```bash
pnpm add @lodado/sdui-template zod
# or
npm install @lodado/sdui-template zod
# or
yarn add @lodado/sdui-template zod
```

기본 UI 컴포넌트와 디자인 토큰까지 쓰려면 다음 패키지도 함께 설치합니다.

```bash
pnpm add @lodado/sdui-template-component @lodado/sdui-design-files
```

> 이 저장소는 Zod v4 타입을 기준으로 개발됩니다. 앱에서도 호환되는 Zod 버전을 사용하세요.

## 가장 작은 예제

```tsx
'use client'

import SduiLayoutRenderer, { type ComponentFactory, type SduiLayoutDocument } from '@lodado/sdui-template'

const document: SduiLayoutDocument = {
  version: '1.0.0',
  root: {
    id: 'root-card',
    type: 'Card',
    state: {
      title: 'Hello SDUI',
      body: 'This UI came from a JSON document.',
    },
  },
}

const CardFactory: ComponentFactory = (id) => <Card id={id} />

function Card({ id }: { id: string }) {
  return <article data-node-id={id}>Card node: {id}</article>
}

export default function Page() {
  return <SduiLayoutRenderer document={document} components={{ Card: CardFactory }} />
}
```

위 예제에서 서버가 담당하는 것은 `document`입니다. 클라이언트는 `type: 'Card'`를 보고 `components.Card` 팩토리를 실행합니다.

## 주요 철학

### 1. 서버는 “화면의 의도”를 보낸다

SDUI 문서는 JSX가 아니라 데이터입니다.

```ts
{
  id: 'submit-button',
  type: 'Button',
  state: { label: 'Submit', variant: 'primary' },
  attributes: { className: 'w-full' }
}
```

서버는 컴포넌트 이름, 상태, 자식 관계, 참조 관계를 내려줍니다. 브라우저로 함수나 임의 코드를 보내지 않기 때문에 직렬화가 쉽고, 보안 경계도 명확합니다.

### 2. 클라이언트는 “허용된 컴포넌트”만 렌더링한다

문서의 `type`은 React 컴포넌트를 직접 담지 않습니다. 앱이 명시적으로 등록한 `components` 맵에서만 렌더링됩니다.

```tsx
<SduiLayoutRenderer
  document={document}
  components={{
    Card: (id) => <Card id={id} />,
    Button: (id) => <Button id={id} />,
  }}
/>
```

이 방식은 서버가 화면 구성을 주도하면서도, 실제 렌더링 권한은 클라이언트 코드가 통제하게 만듭니다.

### 3. 상태는 노드 단위로 소유한다

각 노드는 자신의 `state`, `attributes`, `children`, `reference`를 가집니다. 컴포넌트는 자기 노드만 구독하고 필요할 때만 다른 노드를 참조합니다.

- `state`: 컴포넌트의 데이터와 동작 상태
- `attributes`: 스타일, className, HTML 성격의 속성
- `children`: 중첩 렌더링을 위한 자식 노드
- `reference`: 다른 노드의 상태를 읽기 위한 노드 ID 또는 ID 배열

### 4. 전체 재렌더보다 구독을 우선한다

일반적인 React Context만으로 큰 JSON UI 트리를 관리하면 작은 변경에도 많은 컴포넌트가 다시 렌더링되기 쉽습니다. `sdui-template`은 내부 store와 subscription manager를 통해 노드 단위 변경을 전파합니다.

### 5. 기본은 headless, 필요하면 컴포넌트 패키지를 얹는다

`@lodado/sdui-template`은 렌더링 엔진입니다. 디자인 시스템이나 버튼/카드 구현을 강제하지 않습니다. 빠른 시작이 필요하면 `@lodado/sdui-template-component`를 사용하고, 제품에 맞는 디자인 시스템이 있다면 직접 컴포넌트 팩토리를 등록하면 됩니다.

## 아키텍처

```text
Server / CMS / Builder
        │
        │ SduiLayoutDocument(JSON)
        ▼
┌──────────────────────────────────────────┐
│ @lodado/sdui-template                     │
│                                          │
│  React layer                              │
│  - SduiLayoutRenderer                     │
│  - SduiLayoutProvider                     │
│  - hooks                                  │
│        │                                  │
│        ▼                                  │
│  Store layer                              │
│  - SduiLayoutStore                        │
│  - LayoutStateRepository                  │
│  - DocumentManager                        │
│  - SubscriptionManager                    │
│  - VariablesManager                       │
│        │                                  │
│        ▼                                  │
│  Data layer                               │
│  - schema/types                           │
│  - normalize / denormalize                │
└──────────────────────────────────────────┘
        │
        │ ComponentFactory(id, parentPath)
        ▼
Consumer React Components
```

### 패키지 구조

| Package                           | 역할                                                                 |
| --------------------------------- | -------------------------------------------------------------------- |
| `@lodado/sdui-template`           | SDUI 문서 렌더러, store, hooks, schema, normalization                |
| `@lodado/sdui-template-component` | 버튼, 카드, 폼, 다이얼로그, 드롭다운 등 기본 SDUI 컴포넌트 맵        |
| `@lodado/sdui-design-files`       | Figma에서 추출한 디자인 토큰과 CSS variables                         |
| `@lodado/sdui-document`           | Notion-like block document 도메인, tree/markdown/search/storage 로직 |
| `@lodado/sdui-document-react`     | `@lodado/sdui-document`를 React 에디터 UI로 연결하는 바인딩          |
| `apps/docs`                       | Storybook 문서/예제 앱                                               |
| `apps/reactGridLayoutExample`     | React Grid Layout 기반 예제 앱                                       |
| `apps/nextAuthOauthLoginExample`  | NextAuth/Supabase 연동 예제 앱                                       |

### `sdui-document-react`는 어디에 쓰나

`@lodado/sdui-document-react`는 SDUI 레이아웃 렌더러가 아니라, `@lodado/sdui-document`의 block document를 React에서 편집하기 위한 패키지입니다. 문단/헤딩/체크리스트/콜아웃 같은 block tree는 React가 렌더링하고, 현재 포커스된 텍스트 블록만 ProseMirror editor로 전환합니다.

```text
@lodado/sdui-document
  └─ block schema, patches, tree, markdown, storage contracts
        │
        ▼
@lodado/sdui-document-react
  ├─ SduiDocumentEditor: 전체 문서 편집 surface
  ├─ BlockChrome: block type별 React wrapper
  ├─ FocusedBlockEditor: focused text block용 ProseMirror bridge
  ├─ InlineContentView: read/static inline content renderer
  └─ SelectionToolbar / MARK_DEFINITIONS
```

간단히 구분하면 다음과 같습니다.

- 화면 레이아웃 JSON을 React 컴포넌트로 렌더링하려면 `@lodado/sdui-template`
- Notion-like block document를 편집하려면 `@lodado/sdui-document-react`
- 문서 도메인 로직만 필요하면 `@lodado/sdui-document`

자세한 사용법과 철학은 `packages/sdui-document-react/README.md`에 정리되어 있습니다.

### 렌더링 흐름

```text
1. 서버/빌더가 SduiLayoutDocument를 만든다.
2. SduiLayoutRenderer가 document를 받아 SduiLayoutStore를 구성한다.
3. 문서는 정규화되어 node id 기반 저장소에 들어간다.
4. root node부터 renderNode가 실행된다.
5. node.type에 맞는 ComponentFactory를 찾는다.
6. 컴포넌트는 useSduiNodeSubscription으로 자기 node state를 구독한다.
7. 상호작용이 발생하면 store.updateNodeState가 노드 상태를 갱신한다.
8. SubscriptionManager가 해당 노드 구독자에게만 변경을 알린다.
```

### 컴포넌트 해석 우선순위

노드가 렌더링될 때 컴포넌트는 다음 순서로 결정됩니다.

1. `componentOverrides.byNodeId[node.id]`
2. `componentOverrides.byNodeType[node.type]`
3. `components[node.type]`
4. `defaultComponentFactory`

이 우선순위 덕분에 서버 문서는 그대로 두고 특정 노드나 타입만 앱에서 교체할 수 있습니다.

## 문서 모델

```ts
interface SduiLayoutDocument {
  version: string
  metadata?: {
    id?: string
    name?: string
    description?: string
    createdAt?: string
    updatedAt?: string
    author?: string
    [key: string]: unknown
  }
  root: SduiLayoutNode
  variables?: Record<string, unknown>
}

interface SduiLayoutNode {
  id: string
  type: string
  state?: Record<string, unknown>
  attributes?: Record<string, unknown>
  children?: SduiLayoutNode[]
  childrenIds?: string[]
  reference?: string | string[]
  parentId?: string
}
```

작성 규칙은 단순합니다.

- `id`는 문서 안에서 유일해야 합니다.
- `type`은 클라이언트의 component map에 등록된 키와 맞아야 합니다.
- 컴포넌트 데이터는 `state`에 둡니다.
- 스타일/HTML 성격의 값은 `attributes`에 둡니다.
- 중첩 UI는 `children`으로 표현합니다.
- 다른 노드 상태가 필요하면 `reference`에 대상 노드 ID를 둡니다.
- `childrenIds`와 `parentId`는 정규화/렌더링 과정에서 쓰이는 내부 지향 필드입니다. 일반적인 서버 문서는 `children`만 내려주면 됩니다.

## 타입 안전한 노드 상태

```tsx
'use client'

import { useSduiLayoutAction, useSduiNodeSubscription, type ComponentFactory } from '@lodado/sdui-template'
import { z } from 'zod'

const counterSchema = z.object({
  label: z.string(),
  count: z.number().default(0),
})

const CounterFactory: ComponentFactory = (id) => <Counter id={id} />

function Counter({ id }: { id: string }) {
  const { state } = useSduiNodeSubscription({
    nodeId: id,
    schema: counterSchema,
  })
  const store = useSduiLayoutAction()

  return (
    <button type="button" onClick={() => store.updateNodeState(id, { count: state.count + 1 })}>
      {state.label}: {state.count}
    </button>
  )
}
```

`useSduiNodeSubscription`은 노드 데이터를 읽고 변경을 구독합니다. Zod 스키마를 넘기면 런타임 검증과 TypeScript 타입 추론을 함께 얻을 수 있습니다.

## 중첩 UI와 재귀 렌더링

컨테이너형 컴포넌트는 자신의 `childrenIds`를 읽고 `useRenderNode`로 자식을 렌더링합니다.

```tsx
'use client'

import { useRenderNode, useSduiNodeSubscription, type ComponentFactory, type ParentPath } from '@lodado/sdui-template'

const ContainerFactory: ComponentFactory = (id, parentPath) => <Container id={id} parentPath={parentPath} />

function Container({ id, parentPath }: { id: string; parentPath?: ParentPath }) {
  const { childrenIds } = useSduiNodeSubscription({ nodeId: id })
  const { renderChildren } = useRenderNode({ nodeId: id, parentPath })

  return <section>{renderChildren(childrenIds)}</section>
}
```

문서는 다음처럼 중첩될 수 있습니다.

```ts
const document = {
  version: '1.0.0',
  root: {
    id: 'page',
    type: 'Container',
    children: [
      { id: 'hero', type: 'Card', state: { title: 'Hero' } },
      {
        id: 'content',
        type: 'Container',
        children: [{ id: 'cta', type: 'Button', state: { label: 'Start' } }],
      },
    ],
  },
}
```

## Node reference

한 노드가 다른 노드의 상태에 의존해야 할 때 `reference`를 사용합니다. 예를 들어 `StatusText`가 `Toggle` 노드의 상태를 보여줄 수 있습니다.

```ts
const document = {
  version: '1.0.0',
  root: {
    id: 'root',
    type: 'Container',
    children: [
      {
        id: 'feature-toggle',
        type: 'Toggle',
        state: { checked: false, label: 'Enable feature' },
      },
      {
        id: 'feature-status',
        type: 'StatusText',
        reference: 'feature-toggle',
      },
    ],
  },
}
```

```tsx
import { useSduiNodeReference, type ComponentFactory } from '@lodado/sdui-template'
import { z } from 'zod'

const toggleSchema = z.object({
  checked: z.boolean(),
  label: z.string().optional(),
})

const StatusTextFactory: ComponentFactory = (id) => <StatusText id={id} />

function StatusText({ id }: { id: string }) {
  const { referencedNodesMap } = useSduiNodeReference({
    nodeId: id,
    schema: toggleSchema,
  })

  const toggle = referencedNodesMap['feature-toggle']

  return <p>Status: {toggle?.state.checked ? 'ON' : 'OFF'}</p>
}
```

`reference`는 `string` 또는 `string[]`를 지원합니다. 여러 노드를 참조할 때는 `referencedNodes` 배열로 순회하거나 `referencedNodesMap[id]`로 O(1)에 가깝게 접근할 수 있습니다.

## 기본 컴포넌트 패키지 사용

`@lodado/sdui-template-component`는 자주 쓰는 컴포넌트들을 SDUI용 component map으로 제공합니다.

```tsx
'use client'

import SduiLayoutRenderer from '@lodado/sdui-template'
import { sduiComponents } from '@lodado/sdui-template-component'
import '@lodado/sdui-design-files/index.css'

export default function Page({ document }: { document: any }) {
  return <SduiLayoutRenderer document={document} components={sduiComponents} />
}
```

필요하면 옵션으로 컴포넌트 맵을 만들 수 있습니다.

```tsx
import { createSduiComponents } from '@lodado/sdui-template-component'

const components = createSduiComponents({
  canvas3DRenderStrategy: myCanvas3DRenderStrategy,
})
```

## 주요 API

### `SduiLayoutRenderer`

```tsx
<SduiLayoutRenderer
  document={document}
  components={components}
  componentOverrides={{
    byNodeId: {
      'special-card': (id) => <SpecialCard id={id} />,
    },
    byNodeType: {
      Card: (id) => <ProductCard id={id} />,
    },
  }}
  onLayoutChange={(nextDocument) => save(nextDocument)}
  onError={(error) => report(error)}
/>
```

### `useSduiLayoutAction()`

Store 인스턴스를 가져와 상태를 변경합니다.

```ts
const store = useSduiLayoutAction()

store.updateNodeState('node-1', { count: 1 })
store.updateNodeAttributes('node-1', { className: 'rounded-xl' })
store.updateNodeReference('node-1', 'other-node')
store.updateVariables({ theme: 'dark' })
store.setSelectedNodeId('node-1')
```

### `SduiLayoutStore`

주요 메서드:

- `updateLayout(document)`
- `mergeLayout(document)`
- `getDocument()`
- `getNodeById(nodeId)`
- `getNodeTypeById(nodeId)`
- `getChildrenIdsById(nodeId)`
- `getLayoutStateById(nodeId)`
- `getAttributesById(nodeId)`
- `getReferenceById(nodeId)`
- `subscribeNode(nodeId, callback)`
- `subscribeVersion(callback)`
- `reset()` / `resetToInitial()`
- `cancelEdit(documentId?)`

## Next.js App Router에서 사용

렌더러와 hooks는 React client component에서 사용합니다.

```tsx
// app/page.tsx
'use client'

import SduiLayoutRenderer from '@lodado/sdui-template'

export default function Page() {
  return <SduiLayoutRenderer document={document} components={components} />
}
```

서버 컴포넌트에서는 SDUI 문서를 가져오고, 실제 렌더링은 client component에 위임하는 구성이 깔끔합니다.

```tsx
// app/page.tsx - Server Component
import SduiClientPage from './SduiClientPage'

export default async function Page() {
  const document = await fetchDocument()
  return <SduiClientPage document={document} />
}
```

```tsx
// app/SduiClientPage.tsx
'use client'

import SduiLayoutRenderer, { type SduiLayoutDocument } from '@lodado/sdui-template'

export default function SduiClientPage({ document }: { document: SduiLayoutDocument }) {
  return <SduiLayoutRenderer document={document} components={components} />
}
```

## 개발 명령어

이 저장소는 pnpm workspace와 Turborepo를 사용합니다.

```bash
pnpm install
pnpm dev             # workspace dev tasks
pnpm storybook       # Storybook 실행
pnpm build           # 전체 빌드
pnpm test            # 테스트
pnpm typecheck       # 타입 체크
pnpm lint            # lint
```

개별 앱/패키지는 `apps/*`, `packages/*` 아래에 있습니다.

## 설계상 하지 않는 것

`sdui-template`은 의도적으로 모든 문제를 해결하지 않습니다.

- 서버 데이터 fetching 정책은 앱이 정합니다.
- 인증/권한은 앱 또는 API 레이어가 담당합니다.
- 접근성의 최종 구현은 실제 컴포넌트가 담당합니다.
- persistence는 store가 아니라 앱의 저장소/API가 담당합니다.
- 기본 렌더러는 임의 HTML 실행이나 서버 전달 함수 실행을 하지 않습니다.

이 경계 덕분에 코어는 작고, 제품별 요구사항은 컴포넌트와 API 레이어에서 확장할 수 있습니다.

## 언제 쓰면 좋은가

- 관리자 페이지/대시보드를 JSON으로 구성하고 싶을 때
- 폼/카드/리스트 조합을 서버 설정으로 바꾸고 싶을 때
- CMS나 빌더에서 만든 화면을 React 앱에서 렌더링하고 싶을 때
- 특정 노드만 override하면서 A/B 테스트나 고객별 화면을 만들고 싶을 때
- 디자인 시스템 컴포넌트를 유지하면서 레이아웃 결정만 서버로 옮기고 싶을 때

## License

MIT
