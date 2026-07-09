# plan-01 — `page` 블록 + 네비게이션 (서브페이지 / peek dialog)

- 상태: Draft (2026-07-09)
- 의존: 없음
- 산출물: `document.page` 블록, `SduiPageProvider`, `SduiPeekDialog`, `Breadcrumbs`, repository 확장

## 1. 목표

Notion처럼 문서 안에 서브페이지 링크 블록을 넣고, 클릭하면 전체 페이지 이동(push) 또는
다이얼로그 미리보기(peek)로 대상 문서를 여는 기능. 라이브러리는 headless — URL을 모름.

```text
doc:home
 ├ paragraph
 ├ page → doc:project-a   (클릭 → navigator.push / hover 액션 → navigator.peek)
 └ page → doc:project-b

doc:project-a  (별도 SduiDocument JSON, resolver로 lazy fetch)
```

## 2. Domain (`packages/sdui-document`)

### 2.1 `page` 블록 모듈

`src/block-types/page/` (공통 컨벤션 5파일):

- 타입 상수: `PAGE_BLOCK_TYPE = 'document.page'`
- attributes 스키마:

```ts
pageAttributesSchema = z.object({
  documentId: z.string(), // 대상 문서 id (필수)
  icon: z.string().optional(), // emoji
  coverUrl: z.string().optional(),
})
```

- state: `{ text }` — 표시 제목. `canHostInlineText: true` (제목 인라인 편집).
  대상 문서 `metadata.name`과의 동기화는 후순위(비목표 아님, MVP 제외).
- `extractLinks` → `[{ targetDocumentId: attributes.documentId }]` — 기존 `BlockLinkRef`가
  이미 `targetDocumentId` 필드를 갖고 있어 링크 인덱스에 그대로 편입됨
- `toMarkdown` → `[제목](sdui-doc://<documentId>)` (커스텀 스킴으로 왕복 가능하게)
- `toSduiNode` → `data-block-type: 'document.page'` Div, children 없음
- children 불허: page 블록은 leaf. 내용은 대상 문서 소유.

### 2.2 문서 metadata 확장

- `SduiDocument.metadata`(또는 상위 필드)에 `parentDocumentId?: SduiDocumentId` 추가
  — breadcrumb 체인·"페이지 밖으로 이동" 계산 근거. zod 스키마 optional이라 기존 문서 호환.

### 2.3 repository 확장

`src/repositories/contracts.ts`:

```ts
export interface SduiDocumentRepository {
  getDocument(id: SduiDocumentId): Promise<SduiDocument | undefined>
  savePatches(input: SaveDocumentPatchesInput): Promise<SaveDocumentPatchesResult>
  moveDocument(input: MoveDocumentInput): Promise<MoveDocumentResult>
  // 신규
  createDocument(input: CreateDocumentInput): Promise<SduiDocument> // 빈 서브페이지 생성
  archiveDocument(id: SduiDocumentId): Promise<void> // page 블록 삭제 시 고아 방지
}
```

- 기존 in-memory/테스트 구현체 업데이트 포함.
- `CreateDocumentInput = { title?, parentDocumentId?, icon? }` → state `'draft'`로 생성.

## 3. React (`packages/sdui-document-react`)

### 3.1 `SduiPageProvider`

`src/page/SduiPageProvider.tsx`:

```ts
type DocumentResolver = (id: SduiDocumentId) => Promise<SduiDocument | undefined>

interface SduiDocumentNavigator {
  push(id: SduiDocumentId): void
  peek(id: SduiDocumentId): void
}

<SduiPageProvider resolver={...} navigator={...} defaultOpenMode="push">
```

- 내부 문서 캐시(Map) + `useResolvedDocument(id)` 훅: `{ status: 'loading'|'ready'|'error'|'missing', document }`
- navigator 미주입 시: push는 no-op + dev 경고, peek는 내장 dialog fallback

### 3.2 `PageBlock` 렌더러

`src/block-types/page/PageBlock.tsx`:

- icon(없으면 📄) + 제목 행, Notion처럼 밑줄 hover 스타일
- 클릭 → `defaultOpenMode` 실행 (기본 push), hover 우측 액션 버튼 → peek
- 키보드: Enter/Space로 열기 (버튼 시맨틱), 접근성 `aria-label`

### 3.3 `SduiPeekDialog`

`src/page/SduiPeekDialog.tsx`:

- `@radix-ui/react-dialog` 의존성 추가 (sdui-template-component 재사용 대신 직접 의존 —
  패키지 간 결합 최소화, dialog 하나에 컴포넌트 패키지 전체 끌고 오지 않기)
- props: `documentId | null`, `onOpenChange`, `onOpenFull(id)` ("전체 페이지로 열기" 버튼)
- 내부: `useResolvedDocument`로 lazy load → 뷰어 렌더. loading skeleton / error / missing 상태 필수
- 중첩 페이지 클릭 시: dialog 내용 교체(스택 없음) + 상단 breadcrumb으로 뒤로가기

### 3.4 `Breadcrumbs`

`src/page/Breadcrumbs.tsx`:

- `parentDocumentId` 체인을 resolver로 거슬러 올라가 렌더 (최대 깊이 제한, 순환 가드)
- 각 항목 클릭 → `navigator.push`

## 4. Editor 통합

- `blockMenuItems.ts`: `{ id: 'page', type: PAGE_BLOCK_TYPE, title: 'Page', glyph: '📄', action: 'insert', group: 'basic', keywords: ['page', 'subpage', '페이지', '하위'] }`
  - 삽입 시 `repository.createDocument({ parentDocumentId: 현재 문서 })` → 반환 id를 attributes에 기록.
    비동기 생성이므로 `action: 'insert'` 확장 또는 신규 `action: 'create-page'` 플로우 추가
  - repository 미주입 편집 환경: 메뉴에서 page 항목 숨김
- page 블록 삭제: 확인 후 `archiveDocument` 호출 (즉시 하드삭제 금지)
- turnInto: **MVP 제외.** "기존 블록들을 새 페이지로 이동"은 이동 patch + 문서 생성 트랜잭션이
  얽혀 복잡 — 백로그(plan-04 §백로그) 이동
- drag: 일반 블록과 동일 (leaf라 특수 처리 없음)

## 5. 호스트 앱 연동 예시 (라이브러리 밖, 참고용)

```tsx
// Next.js — app/p/[docId]/page.tsx 전체 페이지, @modal/(.)p/[docId] intercepting route로 peek
<SduiPageProvider
  resolver={(id) => fetch(`/api/docs/${id}`).then((r) => (r.ok ? r.json() : undefined))}
  navigator={{ push: (id) => router.push(`/p/${id}`), peek: (id) => router.push(`/p/${id}`, { scroll: false }) }}
>
```

- intercepting route 사용 시 peek에도 URL 부여 — 새로고침하면 전체 페이지 (Notion 동작 동일)
- slug 원하면 호스트에서 slug→id 매핑 함수만 교체

## 6. 테스트

- domain: page 모듈 schema/round-trip/markdown/extractLinks 단위 테스트
- react: PageBlock 클릭·키보드 → navigator 호출, PeekDialog loading/error/교체, Breadcrumbs 순환 가드
- editor: slash "page" 삽입 → createDocument 호출 + 블록 attributes 검증, 삭제 → archive 호출
- e2e(후순위, 앱 생기면): push/peek 흐름 Playwright

## 7. 단계

1. domain: page 모듈 + metadata/parent + repository 확장 (+테스트)
2. react viewer: Provider / PageBlock / PeekDialog / Breadcrumbs (+테스트)
3. editor: 메뉴 삽입 플로우 + 삭제 archive (+테스트)
4. Storybook 스토리 (`apps/docs`) — 2문서 예제

## 8. 리스크

- 비동기 블록 삽입(문서 생성 후 patch)이 기존 동기 insert 플로우와 다름 → `action` 플로우 확장 지점 먼저 확인
- resolver 캐시 무효화: 편집 후 peek가 stale 문서 보여줄 수 있음 → MVP는 dialog 열 때마다 refetch 옵션(`staleTime=0`)으로 회피
