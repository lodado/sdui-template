# Notion-Style Portfolio Document + A4 PDF Export Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A Notion-style portfolio Storybook story authored with `@lodado/sdui-document` builders, exportable as an A4-fitted PDF via the browser print pipeline.

**Architecture:** Three layers. (1) Five new authoring builders (`callout`, `toggle`, `toc`, `tags`, `bookmark`) in `packages/sdui-document`, colocated per block folder like the existing seven. (2) One `@media print` block in `packages/sdui-document-react/src/styles/editor.css` pinning output to A4 and cleaning interactive chrome. (3) A new story in `apps/docs` with a PDF button that expands all toggles (collapsed toggle children are NOT in the DOM — print CSS alone cannot reveal them), swaps to a read-only render, calls `window.print()`, and restores.

**Tech Stack:** TypeScript, React, Zod, Jest, Storybook. Zero new dependencies.

**Spec:** `docs/superpowers/specs/2026-07-10-notion-portfolio-document-design.md`

## Global Constraints

- No new dependencies anywhere.
- PDF output must fit A4 exactly: `@page { size: A4; margin: 15mm }`, content width 180mm in print.
- Monorepo rule (CLAUDE.md): after all code changes, `pnpm run test` from the repo root must pass before the work is considered done.
- Two known content placeholders stay in the document until the user supplies data: production-bug metric, SysMasterDB detail bullets. Mark them `[TODO: 사용자 확인]` in document _text content only_ — they are user-visible copy, not plan placeholders.
- All new builders must round-trip `parseSduiDocumentContent` (Zod validation).

## Reference — existing patterns (read before Task 1)

- Builder pattern: `packages/sdui-document/src/block-types/bulleted-list/bulletedList.builder.ts` (text + children), `image/image.builder.ts` (attributes-only).
- Builder tests: `packages/sdui-document/src/block-types/__tests__/builders.test.ts`.
- Story pattern: `apps/docs/src/stories/ResumeDocument.stories.tsx`.
- Block schemas consumed here:
  - callout attrs: `{ tone?: 'info'|'tip'|'warning'|'success', icon?: string }`, text-bearing state, children allowed.
  - toggle state: `{ text?: string }`, attrs `{ collapsed?: boolean }`, children allowed.
  - toc: bare block, no state/attrs.
  - tags attrs: `{ items: { id: string, label: string, color?: PropertyColor }[] }` where `PROPERTY_COLORS = ['gray','blue','green','yellow','orange','red','purple','pink']` (from `../collection/property`).
  - bookmark attrs: `{ url: string (http/https only), title?, description?, imageUrl?, faviconUrl?, unfurledAt? }`.

---

### Task 1: Authoring builders for callout / toggle / toc / tags / bookmark

**Files:**

- Create: `packages/sdui-document/src/block-types/callout/callout.builder.ts`
- Create: `packages/sdui-document/src/block-types/toggle/toggle.builder.ts`
- Create: `packages/sdui-document/src/block-types/toc/toc.builder.ts`
- Create: `packages/sdui-document/src/block-types/tags/tags.builder.ts`
- Create: `packages/sdui-document/src/block-types/bookmark/bookmark.builder.ts`
- Modify: `packages/sdui-document/src/block-types/index.ts` (authoring-builders export section, currently ends at the `paragraph` export)
- Test: `packages/sdui-document/src/block-types/__tests__/builders.test.ts` (append one describe)

**Interfaces:**

- Consumes: `nextBlockId` (`../authoring/blockId`), `inlineState` (`../../content/inlineBuilders`), `CreateDocumentBlockInput` (`../../blocks/schema/block`), `SduiInlineContent` (`../../blocks/schema/inline`), block type constants from each `*.type.ts`, `PropertyColor` from `../collection/property`.
- Produces (Task 3 imports these from `@lodado/sdui-document`):

  - `callout(content: string | SduiInlineContent, opts?: { id?: string; tone?: 'info'|'tip'|'warning'|'success'; icon?: string; children?: CreateDocumentBlockInput[] }): CreateDocumentBlockInput`
  - `toggle(content: string | SduiInlineContent, children?: CreateDocumentBlockInput[], opts?: { id?: string; collapsed?: boolean }): CreateDocumentBlockInput`
  - `toc(opts?: { id?: string }): CreateDocumentBlockInput`
  - `tags(items: (string | { label: string; color?: PropertyColor; id?: string })[], opts?: { id?: string }): CreateDocumentBlockInput`
  - `bookmark(url: string, opts?: { id?: string; title?: string; description?: string }): CreateDocumentBlockInput`

- [ ] **Step 1: Write the failing test**

Append to `packages/sdui-document/src/block-types/__tests__/builders.test.ts`:

```ts
import { bookmark } from '../bookmark/bookmark.builder'
import { callout } from '../callout/callout.builder'
import { tags } from '../tags/tags.builder'
import { toc } from '../toc/toc.builder'
import { toggle } from '../toggle/toggle.builder'

describe('notion block builders (callout/toggle/toc/tags/bookmark)', () => {
  beforeEach(() => resetBlockIds())

  test('callout carries tone/icon and nests children', () => {
    const block = callout('주목!', { id: 'c', tone: 'tip', icon: '🚀', children: [paragraph('detail', { id: 'd' })] })
    expect(block).toMatchObject({
      id: 'c',
      type: 'document.callout',
      state: { text: '주목!' },
      attributes: { tone: 'tip', icon: '🚀' },
    })
    expect(block.children).toHaveLength(1)
    expect(callout('plain').attributes).toBeUndefined()
  })

  test('toggle stores summary text, children, collapsed', () => {
    const block = toggle('열어보기', [paragraph('내용', { id: 'p' })], { id: 't', collapsed: true })
    expect(block).toMatchObject({
      id: 't',
      type: 'document.toggle',
      state: { text: '열어보기' },
      attributes: { collapsed: true },
    })
    expect(block.children).toHaveLength(1)
    expect(toggle('빈 토글').children).toBeUndefined()
  })

  test('toc is a bare block', () => {
    expect(toc({ id: 'toc' })).toEqual({ id: 'toc', type: 'document.toc' })
  })

  test('tags maps strings and objects to TagItem chips with auto ids', () => {
    const block = tags(['React', { label: 'Next.js', color: 'blue' }], { id: 'skills' })
    expect(block.attributes).toEqual({
      items: [
        { id: 'tag-1', label: 'React' },
        { id: 'tag-2', label: 'Next.js', color: 'blue' },
      ],
    })
  })

  test('bookmark carries url/title/description', () => {
    expect(bookmark('https://github.com/lodado', { id: 'b', title: 'GitHub' })).toEqual({
      id: 'b',
      type: 'document.bookmark',
      attributes: { url: 'https://github.com/lodado', title: 'GitHub' },
    })
  })

  test('authored notion blocks validate through createDocumentBlock + parse', () => {
    const content = {
      schemaVersion: '1.0' as const,
      root: createDocumentBlock({
        id: 'root',
        type: 'document.root',
        children: [
          toc(),
          callout('metric', { tone: 'success' }),
          toggle('detail', [paragraph('inner')]),
          tags(['TS', 'React']),
          bookmark('https://example.com'),
        ],
      }),
    }
    expect(() => parseSduiDocumentContent(content)).not.toThrow()
  })
})
```

(`resetBlockIds`, `paragraph`, `createDocumentBlock`, `parseSduiDocumentContent` are already imported at the top of this test file.)

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @lodado/sdui-template-document test -- builders` — if that filter name is wrong, check `packages/sdui-document/package.json` `name` field and use it; fallback: `cd packages/sdui-document && pnpm test -- builders`.
Expected: FAIL — cannot find module `../callout/callout.builder` (and siblings).

- [ ] **Step 3: Write the five builders**

`packages/sdui-document/src/block-types/callout/callout.builder.ts`:

```ts
import type { CreateDocumentBlockInput } from '../../blocks/schema/block'
import type { SduiInlineContent } from '../../blocks/schema/inline'
import { inlineState } from '../../content/inlineBuilders'
import { nextBlockId } from '../authoring/blockId'
import type { CalloutBlockAttributes } from './callout.schema'
import { CALLOUT_BLOCK_TYPE } from './callout.type'

export type CalloutBuilderOptions = {
  id?: string
  /** Visual tint. */
  tone?: CalloutBlockAttributes['tone']
  /** Emoji glyph overriding the tone icon. */
  icon?: string
  /** Nested blocks rendered inside the callout. */
  children?: CreateDocumentBlockInput[]
}

/** Author a callout block. */
export function callout(
  content: string | SduiInlineContent,
  { id, tone, icon, children }: CalloutBuilderOptions = {},
): CreateDocumentBlockInput {
  return {
    id: id ?? nextBlockId('callout'),
    type: CALLOUT_BLOCK_TYPE,
    state: typeof content === 'string' ? { text: content } : inlineState(content),
    ...(tone || icon ? { attributes: { ...(tone ? { tone } : {}), ...(icon ? { icon } : {}) } } : {}),
    ...(children ? { children } : {}),
  }
}
```

`packages/sdui-document/src/block-types/toggle/toggle.builder.ts`:

```ts
import type { CreateDocumentBlockInput } from '../../blocks/schema/block'
import type { SduiInlineContent } from '../../blocks/schema/inline'
import { inlineState } from '../../content/inlineBuilders'
import { nextBlockId } from '../authoring/blockId'
import { TOGGLE_BLOCK_TYPE } from './toggle.type'

export type ToggleBuilderOptions = { id?: string; collapsed?: boolean }

/** Author a toggle: always-visible summary + collapsible children. */
export function toggle(
  content: string | SduiInlineContent,
  children: CreateDocumentBlockInput[] = [],
  { id, collapsed }: ToggleBuilderOptions = {},
): CreateDocumentBlockInput {
  return {
    id: id ?? nextBlockId('toggle'),
    type: TOGGLE_BLOCK_TYPE,
    state: typeof content === 'string' ? { text: content } : inlineState(content),
    ...(collapsed !== undefined ? { attributes: { collapsed } } : {}),
    ...(children.length > 0 ? { children } : {}),
  }
}
```

`packages/sdui-document/src/block-types/toc/toc.builder.ts`:

```ts
import type { CreateDocumentBlockInput } from '../../blocks/schema/block'
import { nextBlockId } from '../authoring/blockId'
import { TOC_BLOCK_TYPE } from './toc.type'

export type TocBuilderOptions = { id?: string }

/** Author a table-of-contents block (headings are collected at render time). */
export function toc({ id }: TocBuilderOptions = {}): CreateDocumentBlockInput {
  return { id: id ?? nextBlockId('toc'), type: TOC_BLOCK_TYPE }
}
```

`packages/sdui-document/src/block-types/tags/tags.builder.ts`:

```ts
import type { CreateDocumentBlockInput } from '../../blocks/schema/block'
import { nextBlockId } from '../authoring/blockId'
import type { PropertyColor } from '../collection/property'
import { TAGS_BLOCK_TYPE } from './tags.type'

export type TagInput = string | { label: string; color?: PropertyColor; id?: string }
export type TagsBuilderOptions = { id?: string }

/** Author a tags (skill chips) block. Bare strings become gray-default chips. */
export function tags(items: TagInput[], { id }: TagsBuilderOptions = {}): CreateDocumentBlockInput {
  return {
    id: id ?? nextBlockId('tags'),
    type: TAGS_BLOCK_TYPE,
    attributes: {
      items: items.map((item) =>
        typeof item === 'string'
          ? { id: nextBlockId('tag'), label: item }
          : { id: item.id ?? nextBlockId('tag'), label: item.label, ...(item.color ? { color: item.color } : {}) },
      ),
    },
  }
}
```

`packages/sdui-document/src/block-types/bookmark/bookmark.builder.ts`:

```ts
import type { CreateDocumentBlockInput } from '../../blocks/schema/block'
import { nextBlockId } from '../authoring/blockId'
import { BOOKMARK_BLOCK_TYPE } from './bookmark.type'

export type BookmarkBuilderOptions = { id?: string; title?: string; description?: string }

/** Author a bookmark card. `url` must be http(s) — schema-enforced. */
export function bookmark(
  url: string,
  { id, title, description }: BookmarkBuilderOptions = {},
): CreateDocumentBlockInput {
  return {
    id: id ?? nextBlockId('bookmark'),
    type: BOOKMARK_BLOCK_TYPE,
    attributes: { url, ...(title ? { title } : {}), ...(description ? { description } : {}) },
  }
}
```

Then extend the authoring-builders export section at the bottom of `packages/sdui-document/src/block-types/index.ts` (after the existing `paragraph` line):

```ts
export { bookmark, type BookmarkBuilderOptions } from './bookmark/bookmark.builder'
export { callout, type CalloutBuilderOptions } from './callout/callout.builder'
export { type TagInput, tags, type TagsBuilderOptions } from './tags/tags.builder'
export { toc, type TocBuilderOptions } from './toc/toc.builder'
export { toggle, type ToggleBuilderOptions } from './toggle/toggle.builder'
```

(Keep the section alphabetized to match the existing lines; if ESLint `sort` rules complain, obey ESLint.)

- [ ] **Step 4: Run test to verify it passes**

Run: same command as Step 2.
Expected: PASS — all builders tests green, including the pre-existing ones.

- [ ] **Step 5: Commit**

```bash
git add packages/sdui-document/src/block-types
git commit -m "feat(sdui-document): authoring builders for callout/toggle/toc/tags/bookmark"
```

---

### Task 2: A4 print stylesheet in the editor CSS

**Files:**

- Modify: `packages/sdui-document-react/src/styles/editor.css` (append at end of file, ~line 3302)

**Interfaces:**

- Consumes: existing selectors — `[data-sdui-document-editor]` (editor root), `[data-drag-handle]` / `[data-plus-handle]` (row chrome), `.toggle-triangle` (toggle disclosure button), `.notice-block` (callout), `.sdui-doc-chip` (tag chip), `.sdui-doc-bookmark` (bookmark card), `.toc-block`.
- Produces: print behavior only — no JS interface. Task 3's story relies on this block existing.

**No unit test** — repo has no CSS test rig. Verification is Task 4's manual print preview. CSS-only change; a build (`pnpm --filter @lodado/sdui-template-component... whichever package builds the css` — in practice the docs storybook build in Task 4) proves it parses.

- [ ] **Step 1: Append the print block**

At the end of `packages/sdui-document-react/src/styles/editor.css`:

```css
/* ------------------------------------------------------------- print/PDF */

/* A4 export: the host triggers window.print() (see the portfolio story for
   the toggle-expansion contract — collapsed toggle children are not in the
   DOM, so hosts must expand toggles before printing). */
@media print {
  @page {
    size: A4;
    margin: 15mm;
  }

  /* Pin content to the A4 printable width (210mm − 2×15mm). */
  [data-sdui-document-editor] {
    width: 180mm;
    max-width: 180mm;
    margin: 0;
    padding: 0;
    /* Keep Notion tint/chip/highlight colors in the PDF. Inherited. */
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  /* Interactive chrome has no place on paper. visibility (not display) on the
     toggle triangle preserves the summary row's indent geometry. */
  [data-sdui-document-editor] [data-drag-handle],
  [data-sdui-document-editor] [data-plus-handle] {
    display: none !important;
  }

  [data-sdui-document-editor] .toggle-triangle {
    visibility: hidden;
  }

  /* Blocks land whole on a page instead of splitting across the A4 boundary. */
  [data-sdui-document-editor] .notice-block,
  [data-sdui-document-editor] .toggle-block,
  [data-sdui-document-editor] .sdui-doc-bookmark,
  [data-sdui-document-editor] .toc-block,
  [data-sdui-document-editor] img {
    break-inside: avoid;
  }

  /* A heading never strands at the bottom of a page. */
  [data-sdui-document-editor] h1,
  [data-sdui-document-editor] h2,
  [data-sdui-document-editor] h3 {
    break-after: avoid;
  }

  [data-sdui-document-editor] p {
    orphans: 3;
    widows: 3;
  }
}
```

- [ ] **Step 2: Sanity-check the stylesheet parses**

Run: `pnpm --filter @lodado/sdui-document-react build` (check the package's real name in `packages/sdui-document-react/package.json` first; use `pnpm build` inside the package dir if the filter misses).
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add packages/sdui-document-react/src/styles/editor.css
git commit -m "feat(document-react): A4 print stylesheet for PDF export"
```

---

### Task 3: Portfolio story with PDF export

**Files:**

- Create: `apps/docs/src/stories/PortfolioDocument.stories.tsx`
- Reuses: `apps/docs/src/stories/assets/resume-profile.jpg` (existing photo)

**Interfaces:**

- Consumes (all from `@lodado/sdui-document`): Task 1 builders `callout` / `toggle` / `toc` / `tags` / `bookmark`, existing builders `heading` / `paragraph` / `bulletedList` / `image` / `divider` / `column` / `columnList`, inline helpers `text` / `bold` / `link` / `colored` / `highlighted` / `hardBreak`, plus `createDocumentBlock`, `resetBlockIds`, `walkDocumentBlocks`, `TOGGLE_BLOCK_TYPE`, `type SduiDocumentContent`. From `@lodado/sdui-document-react`: `SduiDocumentEditor`, `type SduiDocumentEditorApi`.
- Produces: stories `Document/Examples/Portfolio (포트폴리오)` → `ReadOnly`, `Editable`.

- [ ] **Step 1: Write the story file**

`apps/docs/src/stories/PortfolioDocument.stories.tsx` — complete content:

```tsx
import {
  bold,
  bookmark,
  bulletedList,
  callout,
  colored,
  column,
  columnList,
  createDocumentBlock,
  divider,
  heading,
  image,
  link,
  paragraph,
  resetBlockIds,
  type SduiDocumentContent,
  tags,
  text,
  toc,
  toggle,
  TOGGLE_BLOCK_TYPE,
  walkDocumentBlocks,
} from '@lodado/sdui-document'
import { SduiDocumentEditor, type SduiDocumentEditorApi } from '@lodado/sdui-document-react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { type CSSProperties, useEffect, useRef, useState } from 'react'

import profilePhoto from './assets/resume-profile.jpg'

// Colors from the built-in Notion palette (marks/color/notionColors).
/** Notion Purple — section-heading accent. */
const PURPLE = '#9065B0'
/** Notion Gray — secondary/meta text. */
const META_GRAY = '#787774'

/** Section heading (H2) with the purple accent, mirroring the Resume story. */
const section = (title: string) => heading([colored(title, PURPLE)], 2)

/* -------------------------------------------------------------------------- */
/* Portfolio document — 이충헌 포트폴리오, authored with the library builders.  */
/* Unlike the résumé (career listing) this leads with project deep-dives:     */
/* problem → approach → impact, with metrics up front and details in toggles. */
/* -------------------------------------------------------------------------- */

resetBlockIds()

const portfolioContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'portfolio-root',
    type: 'document.root',
    children: [
      heading('이충헌 포트폴리오', 1),

      // Hero — photo beside positioning + links
      columnList([
        column([image({ src: profilePhoto, alt: '이충헌 프로필 사진', width: 200 })], { ratio: 1 }),
        column(
          [
            paragraph([bold('AI Native 프론트엔드 엔지니어')]),
            paragraph('빠르게 설계하고 안정적으로 구현하며, AI 도구를 팀의 워크플로로 만드는 개발자입니다.'),
            paragraph([text('🏠 Github | '), link('https://github.com/lodado', 'https://github.com/lodado')]),
            paragraph([text('💻 Blog | '), link('https://lodado.tistory.com/', 'https://lodado.tistory.com/')]),
            paragraph('📌 Email | ycp998@naver.com'),
          ],
          { ratio: 2 },
        ),
      ]),

      toc(),

      // Highlights — metric-led callouts
      section('Highlights'),
      callout(
        'E2E 테스트 400+ / 단위 테스트 400+ 구축 — 배포 후 프론트엔드 프로덕션 버그 [TODO: 사용자 확인] 수준으로 유지',
        { tone: 'success', icon: '✅' },
      ),
      callout('시리즈 A 120억 투자 AI OCR/VLM 스타트업에서 글로벌 AI SaaS 프론트엔드 아키텍처·결제·품질 자동화 담당', {
        tone: 'info',
        icon: '🚀',
      }),
      callout('사내 디자인 시스템을 제안부터 아키텍처 설계·배포 체계까지 주도 (티맥스데이터)', {
        tone: 'tip',
        icon: '🧱',
      }),

      // Skills
      section('Skills'),
      tags([
        { label: 'TypeScript', color: 'blue' },
        { label: 'React', color: 'blue' },
        { label: 'Next.js (app router)', color: 'blue' },
        { label: 'Zustand', color: 'green' },
        { label: 'Tanstack Query', color: 'green' },
        { label: 'Playwright', color: 'orange' },
        { label: 'Vitest', color: 'orange' },
        { label: 'Jest', color: 'orange' },
        { label: 'Storybook', color: 'pink' },
        { label: 'Paddle.js', color: 'yellow' },
        { label: 'Vercel', color: 'gray' },
        { label: 'Sentry', color: 'red' },
        { label: 'Turborepo', color: 'purple' },
        { label: 'Radix UI', color: 'purple' },
      ]),

      // Featured projects — the portfolio core
      section('Featured Projects'),

      heading('1. AI Agent 자율 QA 도구 (오픈소스)', 3),
      paragraph([colored('Korea Deep Learning · 2026', META_GRAY)]),
      paragraph(
        'Playwright 테스트 명세를 AI Agent가 자율 실행·판정하는 QA 도구를 오픈소스로 개발하고, 사내 테스트 프로세스에 도입해 반복적인 수동 QA 검증을 자동화했습니다.',
      ),
      toggle('상세 보기 — 문제 · 접근 · 임팩트', [
        bulletedList('문제: 릴리즈마다 반복되는 수동 QA 시나리오 검증에 개발/QA 리소스가 소모'),
        bulletedList('접근: 테스트 명세를 AI Agent가 읽고 Playwright로 자율 실행 → 결과 판정까지 자동화'),
        bulletedList('임팩트: 사내 테스트 프로세스에 정식 도입, 반복 수동 검증 제거'),
      ]),
      bookmark('https://github.com/lodado/playwright-spec-for-AI-Agent', {
        title: 'playwright-spec-for-AI-Agent',
        description: 'Playwright spec runner for autonomous AI QA agents',
      }),

      heading('2. Design System MCP', 3),
      paragraph([colored('Korea Deep Learning · 2026', META_GRAY)]),
      paragraph(
        '디자인 시스템 컴포넌트와 사용 규칙을 AI Agent에 제공하는 MCP 서버를 구축, AI 생성 코드가 사내 컨벤션과 디자인 시스템을 준수하도록 개발 워크플로에 적용했습니다.',
      ),
      toggle('상세 보기 — 문제 · 접근 · 임팩트', [
        bulletedList('문제: AI 생성 코드가 사내 컴포넌트/토큰 대신 임의 구현을 생산 → 리뷰 비용 증가'),
        bulletedList('접근: 컴포넌트 목록·사용 규칙·토큰을 MCP 리소스로 노출해 Agent 컨텍스트에 주입'),
        bulletedList('임팩트: AI 생성 코드의 디자인 시스템 준수가 워크플로 차원에서 보장'),
      ]),

      heading('3. 사내 디자인 시스템 (티맥스데이터)', 3),
      paragraph([colored('2024.03 – 2026.01', META_GRAY)]),
      paragraph(
        '사내 React 제품 간 UI 일관성 부족 문제를 해결하기 위해 디자인 시스템을 제안하고, 아키텍처 설계부터 컴포넌트 개발·배포 체계 구축까지 주도했습니다.',
      ),
      toggle('상세 보기 — 설계 · 인프라 · 임팩트', [
        bulletedList('Turborepo + Changesets + Rollup(ESM) 기반 모노레포 및 패키지 버전 관리 구조 설계'),
        bulletedList('Storybook 기반 컴포넌트 문서화 및 UI 개발 협업 표준 정립'),
        bulletedList('Jest + React Testing Library + GitLab Runner 기반 테스트·배포 CI/CD 구축'),
        bulletedList('가상화 기반 렌더링을 적용한 공통 대용량 Table 컴포넌트 설계'),
        bulletedList('Radix UI 기반 Compound Component Pattern으로 확장 가능한 컴포넌트 API 구현'),
        bulletedList('임팩트: 공통 컴포넌트 재사용률 증가 → 신규 기능 UI 리드타임 단축, 문서 기반 온보딩 정착'),
      ]),

      heading('4. SysMasterDB 8 — 실시간 DB 모니터링 플랫폼', 3),
      paragraph([colored('티맥스데이터 · 2022.10 – 2024.03', META_GRAY)]),
      paragraph('Grafana와 유사한 DB 모니터링 플랫폼의 프론트엔드 아키텍처를 설계하고 구축했습니다.'),
      toggle('상세 보기 — 설계 · 임팩트', [
        bulletedList('대시보드 — 드래그 앤 드롭 기반 Server-Driven UI 설계 (본 sdui-template 레포가 예시 구현)'),
        bulletedList('사용자가 모듈을 자유롭게 배치하는 커스터마이징 경험 제공'),
        bulletedList('Feature-Sliced Design(FSD) 기반 폴더 구조 재설계'),
        bulletedList('[TODO: 사용자 확인 — SysMasterDB 상세 성과 추가]'),
      ]),

      divider(),

      // Work experience — compressed timeline
      section('Work Experience'),
      heading('한국딥러닝 — 프론트엔드 (정규직)', 3),
      paragraph([colored('2026.02 – 현재', META_GRAY)]),
      bulletedList('Next.js 기반 글로벌 AI SaaS 프론트엔드 아키텍처, Paddle.js 결제, 품질 자동화 및 성능 최적화 담당'),
      bulletedList([text('입사 2개월 내 '), bold('350+ 커밋'), text(' — 빠른 온보딩과 높은 실행력')]),
      heading('티맥스데이터 — Frontend Web Developer (정규직)', 3),
      paragraph([colored('2022.10 – 2026.01 · 3년 4개월', META_GRAY)]),
      bulletedList('사내 디자인 시스템과 DB 모니터링 플랫폼의 프론트엔드 아키텍처 설계·구축'),

      divider(),

      // Open source
      section('Open Source'),
      bookmark('https://github.com/lodado/playwright-spec-for-AI-Agent', {
        title: 'playwright-spec-for-AI-Agent',
        description: 'AI Agent가 자율 실행·판정하는 Playwright QA 도구',
      }),
      bookmark('https://github.com/lodado/sdui-template', {
        title: 'sdui-template',
        description: 'Server-Driven UI 템플릿 라이브러리 — 이 포트폴리오 문서 자체가 이 라이브러리로 렌더링됩니다',
      }),

      divider(),

      // Footer
      paragraph([
        text('📌 '),
        link('ycp998@naver.com', 'mailto:ycp998@naver.com'),
        text('  ·  '),
        link('github.com/lodado', 'https://github.com/lodado'),
        text('  ·  '),
        link('lodado.tistory.com', 'https://lodado.tistory.com/'),
      ]),
    ],
  }),
}

/* -------------------------------------------------------------------------- */
/* PDF export — collapsed toggle children are not rendered to the DOM, so the */
/* print flow expands every toggle, swaps to a read-only render, prints, and  */
/* restores the previous editor state.                                        */
/* -------------------------------------------------------------------------- */

const expandToggles = (content: SduiDocumentContent): SduiDocumentContent => {
  const clone = structuredClone(content)
  walkDocumentBlocks(clone, (block) => {
    if (block.type === TOGGLE_BLOCK_TYPE && block.attributes?.collapsed === true) {
      block.attributes = { ...block.attributes, collapsed: false }
    }
  })
  return clone
}

/* -------------------------------------------------------------------------- */
/* Story                                                                      */
/* -------------------------------------------------------------------------- */

const meta: Meta<typeof SduiDocumentEditor> = {
  title: 'Document/Examples/Portfolio (포트폴리오)',
  component: SduiDocumentEditor,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A Notion-style portfolio authored with the `@lodado/sdui-document` builders — ' +
          '`toc`/`callout`/`tags`/`toggle`/`bookmark` on top of the résumé block set. ' +
          'The "PDF 저장" button expands all toggles, switches to a read-only render, and ' +
          'prints to A4 via the browser print pipeline (`@media print` in the editor CSS).',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof SduiDocumentEditor>

const toolbarStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 12px',
  borderBottom: '1px solid var(--sdui-doc-divider, #e5e7eb)',
  position: 'sticky',
  top: 0,
  background: 'var(--sdui-doc-background, #fff)',
  zIndex: 10,
}

const badgeStyle: CSSProperties = {
  padding: '2px 8px',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  background: '#efe6f7',
  color: '#9065B0',
}

/** Hides Storybook chrome/padding while printing. */
const printResetCss = `
@media print {
  body { padding: 0 !important; margin: 0 !important; background: #fff !important; }
}
`

/**
 * Storybook-only chrome: undo/redo/reset/export-JSON plus "PDF 저장". Printing
 * remounts a read-only editor seeded with the toggle-expanded snapshot, calls
 * window.print(), then restores the pre-print content on afterprint.
 */
const PortfolioFrame = ({ editable }: { editable: boolean }) => {
  const apiRef = useRef<SduiDocumentEditorApi>(null)
  const [seedContent, setSeedContent] = useState(portfolioContent)
  const [instanceKey, setInstanceKey] = useState(0)
  const [printDoc, setPrintDoc] = useState<SduiDocumentContent | null>(null)

  const exportPdf = () => {
    const current = apiRef.current?.getContent() ?? seedContent
    setSeedContent(current) // restore target after print
    setPrintDoc(expandToggles(current))
  }

  const exportJson = () => {
    const data = apiRef.current?.getContent() ?? seedContent
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'portfolio.json'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    if (!printDoc) return undefined

    const finishPrint = () => {
      setPrintDoc(null)
      setInstanceKey((key) => key + 1) // remount from seedContent
    }

    window.addEventListener('afterprint', finishPrint)
    // Double rAF: the read-only print render must be committed and painted
    // before the print dialog snapshots the page.
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => window.print())
    })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('afterprint', finishPrint)
    }
  }, [printDoc])

  if (printDoc) {
    return (
      <>
        <style>{printResetCss}</style>
        <SduiDocumentEditor content={printDoc} readOnly />
      </>
    )
  }

  return (
    <div>
      <style>{printResetCss}</style>
      <div style={toolbarStyle}>
        <span style={badgeStyle}>{editable ? '편집 모드' : '읽기 모드'}</span>
        {editable ? (
          <>
            <button type="button" onClick={() => apiRef.current?.undo()}>
              Undo
            </button>
            <button type="button" onClick={() => apiRef.current?.redo()}>
              Redo
            </button>
            <button type="button" onClick={() => setInstanceKey((key) => key + 1)}>
              Reset
            </button>
            <button type="button" onClick={exportJson}>
              Export JSON
            </button>
          </>
        ) : null}
        <button type="button" onClick={exportPdf}>
          PDF 저장
        </button>
      </div>
      <SduiDocumentEditor key={instanceKey} content={seedContent} apiRef={apiRef} readOnly={!editable} />
    </div>
  )
}

export const ReadOnly: Story = {
  render: () => <PortfolioFrame editable={false} />,
}

export const Editable: Story = {
  render: () => <PortfolioFrame editable />,
  parameters: {
    docs: {
      description: {
        story:
          '편집 가능한 포트폴리오. 텍스트 선택으로 포매팅 툴바, toggle 클릭으로 프로젝트 상세, ' +
          '"PDF 저장"으로 toggle 전체 펼침 + A4 인쇄.',
      },
    },
  },
}
```

- [ ] **Step 2: Typecheck the story**

Run: `pnpm --filter sdui-template-storybook typecheck` (fallback: `cd apps/docs && pnpm typecheck`).
Expected: PASS. Likely failure modes: builder export names not found → recheck Task 1's index.ts exports; `walkDocumentBlocks`/`TOGGLE_BLOCK_TYPE` import errors → both are exported from `@lodado/sdui-document` root (verified in `src/content/index.ts` and `src/block-types/index.ts`) but the _built_ package may need a rebuild: `pnpm --filter @lodado/sdui-document build` (again, verify the actual package name) or rely on workspace source resolution.

- [ ] **Step 3: Commit**

```bash
git add apps/docs/src/stories/PortfolioDocument.stories.tsx
git commit -m "feat(docs): notion-style portfolio story with A4 PDF export"
```

---

### Task 4: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full monorepo test suite (CLAUDE.md mandate)**

Run from repo root: `pnpm run test`
Expected: PASS. If FAIL → fix, re-run until green. Common risk: lint/sort rules on the new index.ts export ordering.

- [ ] **Step 2: Manual Storybook verification**

Run: `pnpm --filter sdui-template-storybook storybook` → open `http://localhost:6006` → `Document/Examples/Portfolio (포트폴리오)`.

Checklist:

- ReadOnly: toc lists sections; callouts tinted; tag chips colored; toggles open/close; bookmarks render as cards.
- Editable: undo/redo/reset/export-JSON work (Resume story parity).
- PDF 저장 (both stories): print dialog opens; in the preview — every toggle's detail bullets visible; A4 pages with 15mm margins; no block split across a page boundary; no heading stranded at a page bottom; callout tints and chip colors present; drag handles and toggle triangles absent. Cancel the dialog → editor restores with pre-print content (edits preserved in Editable).

- [ ] **Step 3: Report**

Report test totals and the manual checklist outcome to the user. Remind about the two `[TODO: 사용자 확인]` placeholders (production-bug metric, SysMasterDB details).
