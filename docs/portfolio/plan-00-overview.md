# 포트폴리오 기능 확장 — 전체 개요 (plan-00)

- 상태: Draft (2026-07-09)
- 목표: `sdui-document` / `sdui-document-react` 기반으로 Notion형 포트폴리오를 만들 수 있게 블록·네비게이션 기능 확장
- 결정 사항(브레인스토밍 확정):
  - 페이지 모델: **문서당 1페이지 + 참조** (page 블록이 다른 document id 참조, lazy load)
  - 네비게이션: **어댑터 주입** — 라이브러리는 `DocumentResolver` + `Navigator(push/peek)` 인터페이스만 정의, URL 매핑은 호스트 앱 소유
  - 편집: 모든 신규 블록 **editor 완전 통합** (slash 메뉴 · turnInto · drag · markdown)
  - 포폴 앱: 라이브러리 우선, 앱(Next.js viewer)은 후순위 — plan-04 부록 참고

## 플랜 문서 맵

| 문서                                     | 내용                                                     | 의존       |
| ---------------------------------------- | -------------------------------------------------------- | ---------- |
| [plan-01](./plan-01-page-navigation.md)  | `page` 블록, resolver/navigator, peek dialog, breadcrumb | 없음       |
| [plan-02](./plan-02-collection.md)       | `collection` 블록 + gallery/list/board/timeline 뷰       | plan-01    |
| [plan-03](./plan-03-embed.md)            | `bookmark`(unfurl) · `video` · generic `embed`           | 없음       |
| [plan-04](./plan-04-portfolio-blocks.md) | `tags` · `button` 블록, 포폴 템플릿, 앱 권장안, 백로그   | plan-01·03 |

실행 순서 권장: 01 → 03 → 02 → 04 (01·03은 병렬 가능).

## 신규 블록 공통 컨벤션 (모든 플랜 공통)

블록 1개 추가 시 편집해야 하는 지점 — 기존 registry 패턴 그대로:

### domain (`packages/sdui-document`)

```text
src/block-types/<name>/
  <name>.type.ts      # `document.<name>` 상수
  <name>.schema.ts    # zod state/attributes 스키마 + TS 타입
  <name>.default.ts   # createDefault
  <name>.markdown.ts  # toMarkdown (없으면 paragraph fallback)
  <name>.ts           # 모듈 조립 (`satisfies ContentBlockTypeModule`)
```

- `src/block-types/index.ts` — `BLOCK_TYPE_MODULES` 배열 + 타입 상수 export 추가
- `src/blocks/schema/block.ts` — `SduiDocumentBlockType` union에 타입 추가 (유일한 중앙 편집)

### react (`packages/sdui-document-react`)

- `src/block-types/<name>/` — 렌더러 컴포넌트 (+ `__tests__/`)
- `src/editor/block-menu/blockMenuItems.ts` — slash/블록 메뉴 항목 (`group`, `keywords` 한/영)
- `src/block-types/turnInto.ts` — 전환 허용 매트릭스 (해당 시)
- `src/styles/editor.css` — 블록 스타일

### 테스트 정책

- domain: 모듈 단위 테스트 (schema round-trip, toSduiNode/fromSduiNode 대칭, markdown)
- react: 렌더러 + editor 통합 (slash 삽입, turnInto) — 기존 `__tests__` 패턴
- 완료 기준: 루트 `pnpm run test` 전체 통과 (CLAUDE.md 필수 규칙)

## 공통 신규 개념 (plan-01에서 도입, 이후 플랜이 재사용)

- `DocumentResolver`: `(id: SduiDocumentId) => Promise<SduiDocument | undefined>` — 참조 문서 lazy load
- `SduiDocumentNavigator`: `{ push(id), peek(id) }` — 호스트 주입
- `SduiPageProvider`: 위 둘 + 문서 캐시를 내려주는 React context
- `SduiDocumentRepository.createDocument` 확장 — editor에서 "새 페이지" 생성용

## 비목표 (전체 공통)

- Notion 완전 복제, 실시간 협업, 데이터베이스 수식/롤업, 권한 시스템
- 라이브러리가 URL/라우팅 소유하는 것 (호스트 앱 책임)
