# plan-03 — embed 계열 블록 (`bookmark` / `video` / `embed`)

- 상태: Draft (2026-07-09)
- 의존: 없음 (plan-01과 병렬 가능)
- 산출물: `document.bookmark`, `document.video`, `document.embed` 블록 + `UnfurlAdapter`

## 1. 목표

포폴 필수 외부 콘텐츠: GitHub 저장소·배포 링크는 카드 미리보기(bookmark),
데모 영상은 YouTube/Vimeo 임베드(video), 그 외 iframe(embed).

기존 `link` 블록(인라인형 링크)과 역할 분리 — bookmark는 unfurl 메타데이터를 가진 카드형.

## 2. Domain (`packages/sdui-document`)

### 2.1 `bookmark` (`src/block-types/bookmark/`)

```ts
bookmarkAttributesSchema = z.object({
  url: z.string().url(),
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
  faviconUrl: z.string().url().optional(),
  unfurledAt: z.string().datetime().optional(), // 메타 수집 시각
})
```

- **unfurl 결과를 편집 시점에 attributes로 영속화** — viewer는 네트워크 요청 없음 (SDUI 철학: 문서가 자기완결)
- `canHostInlineText: false`, `extractLinks` → `[{ href: url }]`
- `toMarkdown` → `[title ?? url](url)`

### 2.2 `video` (`src/block-types/video/`)

```ts
videoAttributesSchema = z.object({
  url: z.string().url(), // 원본 URL (사용자 입력)
  provider: z.enum(['youtube', 'vimeo']),
  videoId: z.string(), // 파싱 결과
  aspectRatio: z.enum(['16:9', '4:3']).default('16:9'),
})
```

- `parseVideoUrl(url): { provider, videoId } | undefined` 순수 함수 — youtube.com/watch, youtu.be,
  shorts, vimeo.com 패턴. **화이트리스트 밖 URL은 video 블록 생성 거부** (embed로 유도)
- embed URL은 렌더 시 조립 (`https://www.youtube-nocookie.com/embed/<id>` — privacy-enhanced 도메인)
- `toMarkdown` → `[video](url)`

### 2.3 `embed` (`src/block-types/embed/`)

```ts
embedAttributesSchema = z.object({
  url: z.string().url(),
  height: z.number().int().min(100).max(2000).default(400),
})
```

- 범용 iframe. 렌더 측에서 allowlist 검증 (아래 §3.3) — 문서 데이터만으로 신뢰하지 않음
- `toMarkdown` → `[embed](url)`

### 2.4 공통 URL 가드 (`src/block-types/shared/url.ts`)

- `isSafeHttpUrl(url)`: `http:`/`https:` 스킴만 허용 (CLAUDE.md XSS 규칙).
  세 블록 zod 스키마 모두 `.refine(isSafeHttpUrl)` 적용 — `javascript:` 등 차단은 스키마 레벨에서.

## 3. React (`packages/sdui-document-react`)

### 3.1 `BookmarkBlock.tsx`

- 카드: 좌측 텍스트(title/description/favicon+domain) + 우측 imageUrl 썸네일, Notion bookmark 레이아웃
- 클릭 → `window.open(url, '_blank', 'noopener,noreferrer')`
- 메타 없음(unfurl 실패/미수행) → URL만 있는 plain 카드로 graceful degrade

### 3.2 `VideoBlock.tsx`

- `aspect-ratio` 박스 + lazy iframe (`loading="lazy"`), **클릭 전엔 썸네일만** (youtube `i.ytimg.com` 썸네일,
  facade 패턴 — LCP/TBT 보호, 성능 규칙 준수)
- iframe 속성: `sandbox="allow-scripts allow-same-origin allow-presentation"`,
  `allow="accelerometer; autoplay; encrypted-media; picture-in-picture"`, `referrerPolicy="strict-origin-when-cross-origin"`

### 3.3 `EmbedBlock.tsx` + allowlist

- `SduiEmbedConfig` (SduiPageProvider 또는 별도 provider로 주입):

```ts
type SduiEmbedConfig = {
  allowedHosts: string[] // ['codesandbox.io', 'codepen.io', ...] — 기본값 빈 배열 = 전부 차단
}
```

- allowlist 밖 host → iframe 대신 bookmark형 fallback 카드 렌더 (조용히 임베드하지 않음)
- iframe: `sandbox` 기본 최소 권한, height는 attributes

### 3.4 `UnfurlAdapter` (편집 전용 어댑터)

```ts
interface UnfurlAdapter {
  unfurl(url: string): Promise<{ title?; description?; imageUrl?; faviconUrl? } | undefined>
}
```

- 호스트가 서버 라우트로 구현 (브라우저 CORS 때문에 클라 직접 fetch 불가)
- **호스트 구현 가이드 문서화(보안)**: 서버 unfurl은 SSRF 위험 — private IP 대역·redirect 검증,
  타임아웃, content-type 제한을 README에 명시. 라이브러리는 인터페이스만 소유.
- 미주입 시: bookmark는 URL-only 카드로 삽입 (unfurl 스킵), 기능 자체는 동작

## 4. Editor 통합

- `blockMenuItems.ts` 3항목, `group: 'media'`, `action: 'link'` (기존 URL 입력 플로우 재사용):
  - Bookmark 📑 keywords: ['bookmark', 'link preview', '북마크', '링크']
  - Video ▶ keywords: ['video', 'youtube', 'vimeo', '영상', '비디오']
  - Embed 🖼 keywords: ['embed', 'iframe', '임베드']
- URL 확정 시: video는 `parseVideoUrl` 성공 필수(실패 → embed/bookmark 제안), bookmark는 unfurl 비동기
  실행 후 attributes patch (낙관적: URL-only 카드 먼저 삽입 → 메타 도착 시 업데이트)
- paste 인터셉트(후순위): 빈 paragraph에 URL 붙여넣기 → "Bookmark/Video/Embed/그냥 텍스트" 선택 메뉴 —
  Notion 동작. MVP 이후.
- turnInto: `link ↔ bookmark ↔ embed`, `bookmark → video` (URL 파싱 가능할 때) — `turnInto.ts` 매트릭스 확장

## 5. 테스트

- domain: URL 파서(youtube/vimeo 변형 URL 표), `isSafeHttpUrl`(javascript:/data: 차단), 스키마
- react: bookmark degrade 렌더, video facade(클릭 전 iframe 없음), embed allowlist 차단 → fallback
- editor: link 플로우 삽입, unfurl 낙관적 업데이트 patch

## 6. 단계

1. domain 3블록 + URL 가드/파서 (+테스트)
2. react 렌더러 3종 (+테스트) — 여기까지로 viewer 완성
3. editor 메뉴 + unfurl 어댑터 + turnInto
4. Storybook 스토리 (unfurl은 mock adapter)

## 7. 리스크

- unfurl 품질은 호스트 구현에 종속 — 라이브러리 테스트는 mock으로 한정, 실통합은 앱 단계에서
- 임베드 보안이 이 플랜의 핵심 리뷰 포인트 → 구현 후 security-review 필수 (iframe sandbox, URL 스킴, SSRF 가이드)
