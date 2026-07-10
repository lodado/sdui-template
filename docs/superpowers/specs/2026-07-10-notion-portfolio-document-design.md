# Notion-Style Portfolio Document (Storybook) + PDF Export

**Date:** 2026-07-10
**Status:** Approved design, pending implementation plan
**Scope:** `packages/sdui-document` (authoring builders), `packages/sdui-document-react` (print CSS), `apps/docs` (new story). No new dependencies.

## Context

`apps/docs/src/stories/ResumeDocument.stories.tsx` already demonstrates a real résumé
authored with the terse authoring builders (`heading` / `paragraph` / `bulletedList` /
`image` / `divider` / `column` / `columnList`) and rendered via `SduiDocumentEditor`
(ReadOnly + Editable stories with an apiRef-driven toolbar).

This spec adds a **portfolio** document in the same style. A portfolio differs from a
résumé: project deep-dives with evidence (metrics, links) instead of a career listing.
It also adds **PDF export** via the browser-native print pipeline.

## Goals

1. `PortfolioDocument.stories.tsx` — a Notion-style one-page portfolio for 이충헌,
   authored with library builders, ReadOnly + Editable stories.
2. Authoring builders for the block types the portfolio needs that currently lack one:
   `callout`, `toggle`, `toc`, `tags`, `bookmark`.
3. PDF export: a toolbar button that prints the document cleanly (browser print → PDF).

## Non-Goals

- Multi-page navigation via `page` blocks (approach B — rejected as overkill).
- Server-side or canvas-based PDF generation (jspdf/html2canvas/puppeteer).
- New portfolio-specific block types. Existing 20+ block types cover everything.

## Part 1 — Authoring builders (`packages/sdui-document`)

Follow the existing colocated pattern (`heading/heading.builder.ts`): each builder
returns `CreateDocumentBlockInput`, uses `nextBlockId(hint)`, accepts
`string | SduiInlineContent` where the block has inline text.

| Builder    | File                           | Signature sketch                                  |
| ---------- | ------------------------------ | ------------------------------------------------- |
| `callout`  | `callout/callout.builder.ts`   | `callout(content, { icon?, color?, id? })`        |
| `toggle`   | `toggle/toggle.builder.ts`     | `toggle(content, children?, { collapsed?, id? })` |
| `toc`      | `toc/toc.builder.ts`           | `toc({ id? })`                                    |
| `tags`     | `tags/tags.builder.ts`         | `tags(items: (string \| TagItem)[], { id? })`     |
| `bookmark` | `bookmark/bookmark.builder.ts` | `bookmark(url, { title?, description?, id? })`    |

Attribute shapes come from each block's `*.schema.ts` / `*.type.ts` — builders must
produce blocks that pass the existing block schema validation. Export from
`block-types/index.ts` under the existing "Authoring builders" section. One
schema-validation unit test per builder (same convention as existing builder tests).

## Part 2 — Portfolio story (`apps/docs`)

New file `apps/docs/src/stories/PortfolioDocument.stories.tsx`, story title
`Document/Examples/Portfolio (포트폴리오)`. Reuses the Resume story's conventions:
`resetBlockIds()`, Notion palette constants, purple `section()` heading helper,
apiRef toolbar chrome for the Editable story.

### Content structure

| #   | Section           | Blocks                                                   | Content                                                                                                                                 |
| --- | ----------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Hero header       | `columnList` + `image` + `paragraph`                     | Photo, name, one-line positioning, GitHub/blog/email links                                                                              |
| 2   | 목차              | `toc`                                                    | Auto-collected headings                                                                                                                 |
| 3   | Highlights        | `callout` ×3                                             | Metric-led: E2E 400+ / unit 400+ quality automation; Series-A(120억) AI SaaS frontend architecture; design system founded & led at Tmax |
| 4   | Skills            | `tags`                                                   | TS, React, Next.js, Playwright, Vitest, Storybook, Paddle.js, Vercel, Sentry, Turborepo, Zustand, Tanstack Query, …                     |
| 5   | Featured Projects | `heading` + `paragraph` + `toggle` + `tags` + `bookmark` | 4 projects, each: 문제 → 접근 → 임팩트 → stack tags → link. Detail collapsed in `toggle`                                                |
| 6   | Work Experience   | `heading` + `bulletedList`                               | Korea Deep Learning (2026.02–, 프론트엔드) / 티맥스데이터 (2022.10–2026.01, FE) — compressed timeline                                   |
| 7   | Open Source       | `bookmark` ×2                                            | playwright-spec-for-AI-Agent, this sdui-template repo                                                                                   |
| 8   | Footer            | `divider` + `paragraph`                                  | Contact re-surface                                                                                                                      |

### Featured projects (from user's career data)

1. **AI Agent QA 도구** (오픈소스) — Playwright 명세를 AI Agent가 자율 실행·판정,
   사내 QA 프로세스 도입으로 수동 검증 자동화.
   Link: <https://github.com/lodado/playwright-spec-for-AI-Agent>
2. **Design System MCP** — 디자인 시스템 컴포넌트/규칙을 AI Agent에 제공, AI 생성
   코드의 컨벤션 준수를 워크플로에 강제.
3. **사내 디자인 시스템 (티맥스데이터)** — 제안부터 주도. Turborepo/Changesets/Rollup
   ESM 모노레포, Storybook 문서화, Jest/RTL/GitLab Runner CI/CD, 가상화 대용량 Table,
   Radix 기반 Compound Component API.
4. **SysMasterDB 8 모니터링 플랫폼** — Grafana 유사 DB 모니터링 프론트엔드 설계·구축.

**Known data gaps (placeholders in first draft, user fills later):**

- Production bug metric truncated in source ("프로덕션 버그를 1개…") — placeholder
  `[프로덕션 버그 수치 확인 필요]`.
- SysMasterDB detail bullets truncated — placeholder bullets.

## Part 3 — PDF export

**Mechanism: browser-native `window.print()`** — zero dependencies, real vector text,
same pipeline Notion's own PDF export uses.

### Constraint discovered

Collapsed toggle children are **not rendered to the DOM** (`BlockNode.tsx` — "toggle
collapse hides children at render time only"). Print CSS alone cannot reveal them, so
the export flow must expand toggles first.

### Design

1. **Story toolbar "PDF 저장" button** (Editable story chrome, story-only code):
   - `apiRef.getContent()` → walk blocks (`walkBlocks` util) → produce a copy with all
     toggle `attributes.collapsed = false`.
   - Remount the editor with the expanded copy (existing `key` remount pattern),
     read-only, then `window.print()`.
   - On `afterprint`, restore the previous content/key.
   - ReadOnly story: same button in a minimal chrome, same flow.
2. **Library print CSS** (`packages/sdui-document-react/src/styles/editor.css`,
   one `@media print` block — reusable by every consumer):
   - Hide interactive chrome: drag handles, toggle triangles, slash-menu artifacts,
     placeholder text.
   - `print-color-adjust: exact` on callout backgrounds, tag chips, highlights so the
     Notion colors survive printing.
   - Page-break hygiene: `break-inside: avoid` on callout/toggle/image blocks,
     `break-after: avoid` on headings.
3. **Story print CSS** (story-scoped `<style>`): hide the story toolbar and Storybook
   padding in print.

## Testing

- One schema-validation unit test per new builder (Part 1).
- Portfolio document fixture passes document schema validation (one test in apps/docs
  or authored so existing story smoke coverage applies — follow Resume story precedent).
- Manual: Storybook visual check; print preview check (toggles expanded, colors kept,
  no orphan headings).
- `pnpm run test` from repo root must pass (CLAUDE.md mandate).

## Risks

- `toc` / `tags` / `bookmark` attribute schemas may require fields not obvious from
  type names — builders must be written against the actual `*.schema.ts` files.
- Print output of `columnList` at narrow print widths — verify hero columns don't
  collapse badly in print preview; if they do, print CSS may force single-column.
