# plan-02 — `collection` 블록 (gallery / list / board / timeline 뷰)

- 상태: Draft (2026-07-09)
- 의존: plan-01 (`page` 블록, resolver/navigator)
- 산출물: `document.collection` 블록, 4개 뷰 렌더러, page 아이템 properties, 편집 UI

## 1. 목표

Notion database의 포폴용 경량판. 프로젝트 카드 그리드·경력 타임라인을 하나의 블록으로:

```text
collection (view: gallery, properties: [tags, period, status])
 ├ page → doc:project-a  (properties: { tags: ['React','SDUI'], period: {...} })
 ├ page → doc:project-b
 └ page → doc:project-c
```

- 아이템 = **`page` 블록 재사용** (children으로 소유). 별도 아이템 타입 안 만듦 —
  클릭하면 plan-01 네비게이션 그대로 push/peek. Notion 모델과 동일.
- 뷰는 렌더링 방식일 뿐 데이터는 하나 — view 전환해도 patch는 attributes 변경 1개.

## 2. Domain (`packages/sdui-document`)

### 2.1 `collection` 블록 모듈 (`src/block-types/collection/`)

```ts
type CollectionView = 'gallery' | 'list' | 'board' | 'timeline'

collectionAttributesSchema = z.object({
  view: collectionViewSchema.default('gallery'),
  properties: z.array(propertyDefSchema).default([]), // 속성 스키마 정의
  groupBy: z.string().optional(), // board: select property id
  sortBy: z.object({ propertyId: z.string(), direction: z.enum(['asc', 'desc']) }).optional(),
  cardSize: z.enum(['small', 'medium', 'large']).optional(), // gallery
})
```

- children: `page` 블록만 허용 (검증은 느슨하게 — 다른 타입은 렌더에서 무시 + dev 경고)
- `canHostInlineText: false`
- `toMarkdown`: 링크 목록으로 degrade (`- [title](sdui-doc://id)`)

### 2.2 property 시스템 (`src/block-types/collection/property.ts`)

```ts
type PropertyDef = {
  id: string
  name: string
  type: 'text' | 'select' | 'multiSelect' | 'date' | 'dateRange' | 'url'
  options?: { id: string; label: string; color?: string }[] // select 계열
}

type PropertyValueMap = Record<string, unknown> // propertyId → 값, zod로 타입별 파싱
```

- `page` 블록 attributes 확장: `properties?: PropertyValueMap` (plan-01 스키마에 optional 추가 —
  collection 밖 page 블록엔 없음, 하위 호환)
- 값 파서/포매터 유틸: `parsePropertyValue(def, raw)`, 정렬 comparator, groupBy 버킷 함수 —
  **순수 함수로 domain에** (뷰 로직이 아니라 데이터 로직)

### 2.3 정렬·그룹 유틸

- `sortCollectionItems(items, def, sortBy)` / `groupCollectionItems(items, def)` 순수 함수 + 단위 테스트
- 필터는 MVP 제외 (백로그) — 포폴은 정적 콘텐츠라 정렬·그룹이면 충분

## 3. React (`packages/sdui-document-react`)

`src/block-types/collection/`:

| 컴포넌트              | 내용                                                                                                                                                  |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CollectionBlock.tsx` | view 스위치 + 공통 헤더(뷰 전환 탭은 editor 전용)                                                                                                     |
| `GalleryView.tsx`     | 카드 그리드. 카드 = coverUrl(또는 icon) + 제목 + property chip. 클릭 → navigator (기본 peek — 갤러리는 훑어보기 UX, `openMode` attribute로 변경 가능) |
| `ListView.tsx`        | 행 목록: 제목 + property 열                                                                                                                           |
| `BoardView.tsx`       | `groupBy` select 옵션별 컬럼, 카드 재사용                                                                                                             |
| `TimelineView.tsx`    | `dateRange`/`date` property 기준 세로 타임라인 — 경력용. 좌측 기간, 우측 카드                                                                         |
| `PropertyChip.tsx`    | select/multiSelect 색상 chip, date 포맷                                                                                                               |

- 반응형: gallery grid `auto-fill minmax`, board 가로 스크롤
- 카드 cover: `page.attributes.coverUrl` → 없으면 대상 문서 첫 image 블록(후순위, MVP는 coverUrl만)

## 4. Editor 통합

- `blockMenuItems.ts`: Gallery / Board / Timeline 3항목 (모두 `type: COLLECTION_BLOCK_TYPE`,
  `attributes: { view }` 프리셋, group: 'advanced', keywords 한/영)
- 아이템 추가: 뷰 하단/컬럼 하단 "+ New" → plan-01 createDocument 플로우 재사용
- property 편집 (MVP 최소):
  - collection 헤더 ⚙ → property 목록 팝오버: 추가(이름+타입) / 삭제 / select 옵션 관리
  - 카드/행의 chip 클릭 → 값 편집 팝오버 (select: 옵션 선택, text: input, date: native `<input type="date">`)
- 뷰 전환 탭: gallery↔list↔board↔timeline — attributes patch 1건
- drag: 컬렉션 내 아이템 순서 변경 = 기존 블록 drag 재사용. board 컬럼 간 drag = groupBy 값 변경 patch (M2)
- turnInto: bulleted-list ↔ collection 변환은 백로그 (아이템이 문서 생성을 동반해서 무거움)

## 5. 테스트

- domain: property 파서/정렬/그룹 순수 함수, collection schema, markdown degrade
- react: 뷰 4종 렌더 스냅샷 + 클릭 → navigator 호출, 뷰 전환 patch
- editor: "+ New" → createDocument, property 추가/값 편집 patch 검증

## 6. 단계 (뷰별 분할 출시)

1. **M1**: domain 전체 + gallery + list 뷰 + "+ New" + property 표시(편집은 chip 값만)
2. **M2**: board 뷰 + 컬럼 간 drag + property 정의 편집 UI
3. **M3**: timeline 뷰 + dateRange property + 정렬 UI
4. Storybook: 포폴 프로젝트 갤러리 / 경력 타임라인 예제 스토리

## 7. 리스크

- 뷰 렌더러 4종은 UI 작업량이 큼 → M1~M3 분할로 흡수, timeline은 마지막
- page 블록 attributes 확장이 plan-01과 맞물림 → plan-01 머지 후 착수
- N개 아이템 × resolver fetch 폭발 방지: 카드 렌더는 page 블록 자체 데이터(제목/cover/properties)만 사용,
  대상 문서 fetch는 클릭 시에만
