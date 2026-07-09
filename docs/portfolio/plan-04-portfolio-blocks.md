# plan-04 — 포폴 보조 블록 (`tags` / `button`) + 템플릿 + 앱 권장안 + 백로그

- 상태: Draft (2026-07-09)
- 의존: plan-01 (템플릿이 page 사용), plan-03 (템플릿이 bookmark/video 사용)
- 산출물: `document.tags`, `document.button` 블록, 포폴 템플릿 문서 세트, Next.js 앱 권장안

## 1. 신규 블록은 2개뿐 (의도적 최소화)

Hero/프로필 카드·소개 섹션은 **기존 블록 조합으로 충분** — `column-list` + `image` + `heading` + `paragraph`.
전용 블록 대신 §3 템플릿으로 제공. 블록 수 = 유지보수 부담이므로 조합 가능한 건 안 만든다.

### 1.1 `tags` — 기술 스택 chip (`src/block-types/tags/`)

```ts
tagsAttributesSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        color: tagColorSchema.optional(), // 프리셋 팔레트 키 ('gray'|'blue'|...) — hex 자유입력 금지
      }),
    )
    .default([]),
})
```

- `canHostInlineText: false`
- 렌더: flex-wrap chip 행. plan-02 `PropertyChip` 재사용 (색 팔레트 공유)
- `toMarkdown` → `` `React` `TypeScript` `` (inline code 나열)
- editor: 블록 클릭 → chip 추가 input(Enter로 추가, Backspace 삭제), chip 클릭 → 색 선택 팝오버
- 메뉴: `{ title: 'Tags', glyph: '🏷', group: 'advanced', keywords: ['tags', 'skills', '태그', '기술'] }`

### 1.2 `button` — CTA 링크 (`src/block-types/button/`)

```ts
buttonAttributesSchema = z.object({
  href: z.string().url().refine(isSafeHttpUrl), // plan-03 §2.4 가드 재사용 + mailto: 허용 추가
  variant: z.enum(['primary', 'secondary', 'outline']).default('primary'),
  align: blockAlignSchema.optional(), // 기존 shared/align 재사용
})
```

- state: `{ text }` — 버튼 라벨, `canHostInlineText: true`
- href 스킴: `http:`/`https:`/`mailto:` 화이트리스트 (연락처 CTA용 mailto 필요)
- 렌더: `<a role 없이 시맨틱 앵커>` + `rel="noopener noreferrer"`, variant별 스타일
- `toMarkdown` → `[label](href)`
- editor: 삽입 시 URL 입력(`action: 'link'`), 이후 라벨 인라인 편집, ⚙로 variant/href 수정
- turnInto: `paragraph ↔ button`, `link ↔ button`

## 2. 테스트

- domain: 두 스키마 + markdown + href 스킴 가드 (mailto 허용, javascript: 차단)
- react: tags 추가/삭제 인터랙션, button variant 렌더 + rel 속성 검증
- editor: 메뉴 삽입, turnInto 매트릭스

## 3. 포폴 템플릿 (코드 아님, 콘텐츠 자산)

`apps/docs/src/stories/portfolio/` Storybook 스토리 + `templates/` JSON:

- `home.json` — hero(column-list 조합) + tags + collection(gallery, 프로젝트) + collection(timeline, 경력) + button(연락)
- `project-detail.json` ×2 — heading/이미지/video/bookmark(GitHub)/code 블록 조합
- 문서 간 page 참조로 연결 — plan-01 resolver mock으로 Storybook에서 네비게이션 시연
- 목적: (a) 신규 블록 통합 검증장 (b) 실제 포폴 시작점 (c) 라이브러리 데모

## 4. 포폴 앱 권장안 (착수는 별도 결정)

- `apps/portfolio` — Next.js App Router viewer 앱
- 라우팅: `/` (home 문서), `/p/[docId]` (문서 페이지), `@modal/(.)p/[docId]` intercepting route (peek dialog에 URL 부여 — 새로고침 시 전체 페이지, Notion 동일 UX)
- 문서 소스: MVP는 repo 내 정적 JSON import (서버/DB 불필요, SSG) → 편집은 로컬 editor로 하고 JSON 커밋
- unfurl: 편집 시점에만 필요하므로 앱에는 unfurl 서버 불필요 (attributes에 영속된 메타 사용)
- 이후 확장: slug 라우팅, OG 이미지 생성, 문서 CMS화

## 5. 백로그 (아이디어 주차장 — 착수 전 재논의)

| 아이디어           | 메모                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------ |
| turn into page     | 선택 블록들을 새 문서로 이동. 이동 patch + 문서 생성 트랜잭션 필요 (plan-01에서 제외된 것) |
| URL paste 인터셉트 | paragraph에 URL 붙여넣기 → bookmark/video/embed 선택 메뉴 (plan-03에서 제외)               |
| collection 필터 UI | 뷰어에서 tag 필터링. 포폴엔 정렬로 충분해 보류                                             |
| table 블록         | Notion simple table. 셀 편집 UX 비용 큼                                                    |
| synced block       | 여러 문서에 동일 블록 — 참조 렌더링이라 SDUI 구조와 궁합 좋음                              |
| mention / backlink | `@문서` 인라인 참조 + 역링크 패널. extractLinks 인덱스 이미 있어 기반은 존재               |
| math (KaTeX)       | 기술 포폴엔 수요 낮음                                                                      |
| audio 블록         | file 블록 변형으로 가능                                                                    |
| 방문자용 comments  | 서버 필요 — 앱 단계 이후                                                                   |
| OG 메타 자동화     | 문서 → og:title/description/image 생성 (앱 레벨)                                           |

## 6. 단계

1. tags + button 블록 (domain→react→editor, +테스트)
2. 템플릿 JSON + Storybook 스토리 (plan-01·02·03 산출물 통합 검증)
3. (별도 결정 후) apps/portfolio 착수
