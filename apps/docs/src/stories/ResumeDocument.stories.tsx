import {
  type BlockAlign,
  createDocumentBlock,
  type CreateDocumentBlockInput,
  type SduiDocumentContent,
  type SduiInlineContent,
  type SduiInlineMark,
  type SduiInlineNode,
} from '@lodado/sdui-document'
import { SduiDocumentEditor } from '@lodado/sdui-document-react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import profilePhoto from './assets/resume-profile.jpg'

/* -------------------------------------------------------------------------- */
/* Inline helpers — build SduiInlineContent nodes                             */
/* -------------------------------------------------------------------------- */

const text = (value: string, marks?: SduiInlineMark[]): SduiInlineNode =>
  marks ? { type: 'text', text: value, marks } : { type: 'text', text: value }

const bold = (value: string): SduiInlineNode => text(value, [{ type: 'bold' }])
const italic = (value: string): SduiInlineNode => text(value, [{ type: 'italic' }])
const link = (value: string, href: string): SduiInlineNode => text(value, [{ type: 'link', attrs: { href } }])
/** Colored highlight (background) chip. */
const highlight = (value: string, color: string): SduiInlineNode =>
  text(value, [{ type: 'highlight', attrs: { color } }])
/** Foreground text color — used for secondary/meta text. */
const colored = (value: string, color: string): SduiInlineNode => text(value, [{ type: 'color', attrs: { color } }])
const hardBreak: SduiInlineNode = { type: 'hard_break' }

/** Accent palette for date chips — light backgrounds, one per section family. */
const CHIP_ACCENT = '#E3EAFD'
/** Secondary text color (gray) for periods and meta lines. */
const META_GRAY = '#66778F'

/** Derive the plain-text fallback (search/SSR) from rich inline content. */
const plainText = (content: SduiInlineContent): string =>
  content.map((node) => (node.type === 'text' ? node.text : '\n')).join('')

const richState = (content: SduiInlineContent) => ({ content, text: plainText(content) })

/* -------------------------------------------------------------------------- */
/* Block helpers — return CreateDocumentBlockInput                            */
/* -------------------------------------------------------------------------- */

let blockCounter = 0
const nextId = (hint: string): string => {
  blockCounter += 1
  return `${hint}-${blockCounter}`
}

const heading = (value: string, level: 1 | 2 | 3, align?: BlockAlign): CreateDocumentBlockInput => ({
  id: nextId('heading'),
  type: 'document.heading',
  state: { text: value },
  attributes: { level, ...(align ? { align } : {}) },
})

const paragraph = (content: string | SduiInlineContent, align?: BlockAlign): CreateDocumentBlockInput => ({
  id: nextId('paragraph'),
  type: 'document.paragraph',
  state: typeof content === 'string' ? { text: content } : richState(content),
  ...(align ? { attributes: { align } } : {}),
})

const image = (opts: {
  src: string
  alt: string
  caption?: string
  width?: number
  align?: BlockAlign
}): CreateDocumentBlockInput => ({
  id: nextId('image'),
  type: 'document.image',
  state: opts.caption ? { text: opts.caption } : undefined,
  attributes: {
    src: opts.src,
    alt: opts.alt,
    ...(opts.width ? { width: opts.width } : {}),
    ...(opts.align ? { align: opts.align } : {}),
  },
})

const bullet = (
  content: string | SduiInlineContent,
  children?: CreateDocumentBlockInput[],
): CreateDocumentBlockInput => ({
  id: nextId('bullet'),
  type: 'document.bulleted-list',
  state: typeof content === 'string' ? { text: content } : richState(content),
  ...(children ? { children } : {}),
})

const divider = (): CreateDocumentBlockInput => ({ id: nextId('divider'), type: 'document.divider' })

const column = (ratio: number, children: CreateDocumentBlockInput[]): CreateDocumentBlockInput => ({
  id: nextId('column'),
  type: 'document.column',
  attributes: { ratio },
  children,
})

const columnList = (columns: CreateDocumentBlockInput[]): CreateDocumentBlockInput => ({
  id: nextId('column-list'),
  type: 'document.columnList',
  children: columns,
})

/* -------------------------------------------------------------------------- */
/* Resume document — 이충헌 이력서 reconstructed as an SDUI block tree           */
/* -------------------------------------------------------------------------- */

const resumeContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'resume-root',
    type: 'document.root',
    children: [
      // Header — photo (left) beside name + contact (right), via a 1:2 column split
      columnList([
        column(1, [
          {
            id: nextId('image'),
            type: 'document.image',
            state: { text: '이충헌' },
            attributes: { src: profilePhoto, alt: '이충헌 프로필 사진' },
          },
        ]),
        column(2, [
          heading('이충헌 이력서', 1),
          paragraph('📞 Call | 010-3343-0276'),
          paragraph('📌 Email | ycp998@naver.com'),
          paragraph([text('💻 Blog | '), link('https://lodado.tistory.com/', 'https://lodado.tistory.com/')]),
          paragraph([text('🏠 Github | '), link('https://github.com/lodado', 'https://github.com/lodado')]),
        ]),
      ]),

      // Intro
      bullet('사용자 경험과 제품 완성도를 함께 고민하며, 빠르게 설계하고 안정적으로 구현하는 프론트엔드 개발자입니다!'),
      bullet('기획 방향에도 주도적으로 참여하고 디자인, QA등 직군을 가리지 않습니다.'),
      bullet([
        text('AI Native한 개발 방식을 지향하며, 새로운 도구와 워크플로우를 빠르게 실무에 적용합니다.'),
        hardBreak,
        text('입사 2개월 내 350+ 커밋을 기여하며 빠른 온보딩과 높은 실행력을 입증했습니다.'),
      ]),
      bullet(
        '사용자 시나리오 및 BVA(경계값 분석) 기반 E2E 테스트 300+를 구축해 핵심 플로우의 품질 안정성을 강화했습니다.',
      ),

      // Skill
      heading('Skill', 2),
      paragraph([bold('LANGUAGE')]),
      paragraph('TypeScript | JavaScript'),
      paragraph([bold('FRONT-END')]),
      paragraph('React | Next.js(app router)'),
      paragraph('Zustand | Tanstack Query'),
      paragraph('Tailwind | Storybook | Jest | MSW'),
      paragraph([bold('COMMON')]),
      paragraph('HTML5 | CSS3 | SCSS | Canvas'),
      paragraph([bold('TOOLS')]),
      paragraph('Git | Github Actions | husky | turbo repo | Jira | JScodeshift | spec-kit(SDD) | MCP | n8n'),

      // Work Experience
      heading('Work Experience', 2),

      heading('한국딥러닝 - Global AI SaaS 개발 (Next.js, next-intl, Vercel)', 3),
      paragraph([italic('2026.02 – Present')]),
      paragraph(
        '구독형 AI Saas입니다. VLM(시각언어모델)과 OCR을 결합하여 영수증, 계약서 등에서 핵심 데이터를 자동으로 추출하는 템플릿 기능을 제공합니다.',
      ),
      paragraph([link('한국딥러닝 작업 포트폴리오', 'https://app.notion.com/p/3520bc6660208095b4b8ca4186ae0e2a')]),
      bullet('Paddle.js 기반 글로벌 결제 연동'),
      bullet('팩토리 패턴으로 구독 플랜 기반 UI 노출 및 기능 제한 로직 설계/구현'),
      bullet('Git Worktree 기반 병렬 AI 에이전트 개발 환경을 설계해 동시 작업 효율을 높였습니다.', [
        bullet('입사 2개월 내에 350+ 커밋을 기여하며 빠르게 온보딩하고 높은 실행력을 보여주었습니다.'),
      ]),
      bullet(
        '사용자 시나리오와 BVA(경계값 분석) 기반으로 E2E 테스트 300+를 구축하고, Playwright Sharding으로 CI 테스트 효율을 개선했습니다.',
      ),
      bullet('Claude Code의 Hook 및 테스트 코드를 활용해 AI self-loop feedback 체계를 설계·구축했습니다'),

      divider(),

      heading('Tmax Tibero — Frontend Engineer', 3),
      paragraph([italic('2022.10 – 2026.02')]),

      heading('Sysmaster DB 8 (Real-time DB Monitoring)', 3),
      paragraph('grafana dashboard와 비슷한 복잡한 db monitoring platform입니다.'),
      paragraph([
        link('Sysmaster DB 8 포트폴리오', 'https://app.notion.com/p/Sysmaster-DB-8-6af5a3a52a6b42cda8fa227869ac8e1a'),
      ]),
      bullet('대시보드 - 드래그 앤 드롭 기반 Server-Driven UI 설계'),
      bullet('사용자가 모듈을 자유롭게 배치하고 원하는 레이아웃을 만들 수 있는 커스터마이징 경험 제공했습니다.'),
      paragraph([
        text('('),
        bold('SDUI 예시 코드 레포지토리 - '),
        link('https://github.com/lodado/sdui-template', 'https://github.com/lodado/sdui-template'),
        text(')'),
      ]),
      bullet('Feature-Sliced Design(FSD) 기반으로 폴더 구조 재설계'),

      heading('Design System (Frontend Platform)', 3),
      paragraph([italic('2024.03 – 2026.02')]),
      paragraph(
        '사내 React 기반 제품 간 UI 일관성 부족으로, 사용자 학습 비용이 커지고 신규 기능 개발이 "매번 새로 만드는 형태"로 반복되어 해당 문제를 해결하기 위해 제안 및 주도했습니다.',
      ),
      bullet('TurboRepo + Changeset + Rollup(ESM) 기반 모노레포 구조 설계'),
      bullet('figma & 시멘틱 토큰 기반 CSS variable 관리'),
      bullet('Jest + React Testing Library + GitLab Runner 기반 CI/CD 도입'),

      heading('Impact', 3),
      bullet('공통 컴포넌트/패턴 재사용률 증가 → 신규 기능 UI 개발 리드타임 단축'),
      bullet('storybook 문서 기반 온보딩으로 C++만 배운 신입도 2–3개월 내 실서비스 투입 가능'),

      // Side Projects
      heading('Side Projects', 2),
      heading('Simmey (Web Service)', 3),
      paragraph([
        text('깃허브 주소 : '),
        link('https://github.com/lodado/mamapapa', 'https://github.com/lodado/mamapapa'),
        text(' | 링크 : '),
        link('https://mamapapa.vercel.app/ko', 'https://mamapapa.vercel.app/ko'),
      ]),
      bullet([text('광고 없이 MAU '), bold('600–900+'), text(', 해외 사용자 비중 '), bold('95%+ (SEO로 유입)')]),

      divider(),

      // 자격증
      heading('자격증', 2),
      paragraph([highlight('2021. 06', CHIP_ACCENT), text(' 정보처리기사')]),

      // Education
      heading('Education', 2),
      paragraph([highlight('2015', CHIP_ACCENT), text(' 전남대학교 전자컴퓨터공학부 입학')]),
      paragraph([highlight('2016', CHIP_ACCENT), text(' 전남대학교 소프트웨어전공 선택')]),
      paragraph([
        highlight('2020', CHIP_ACCENT),
        text(' '),
        link('컴퓨터비전 학부연구생', 'https://sites.google.com/site/seokbongyoo/introduction?authuser=0'),
        text(' 근무'),
      ]),
      paragraph([
        highlight('2021', CHIP_ACCENT),
        text(' 네이버 '),
        link('부스트캠프 챌린지, 멤버쉽 과정 6기', 'https://boostcamp.connect.or.kr/'),
        text(' 수료'),
      ]),
      paragraph([highlight('2022. 02', CHIP_ACCENT), text(' 졸업 (전공 4.09/4.5, 총합 3.96 / 4.5)')]),
    ],
  }),
}

/* -------------------------------------------------------------------------- */
/* Story                                                                      */
/* -------------------------------------------------------------------------- */

const meta: Meta<typeof SduiDocumentEditor> = {
  title: 'Document/Examples/Resume (이력서)',
  component: SduiDocumentEditor,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A real résumé authored directly as an `@lodado/sdui-document` block tree — no markdown import. ' +
          'Every section is a native block (heading / paragraph / bulleted_list / image / divider) and every ' +
          'inline emphasis (bold, italic, inline code, link) is an `SduiInlineMark`. Rendered read-only as a ' +
          'faithful document; drop `readOnly` to make it editable.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof SduiDocumentEditor>

export const ReadOnly: Story = {
  render: () => <SduiDocumentEditor content={resumeContent} readOnly />,
}

export const Editable: Story = {
  render: () => <SduiDocumentEditor content={resumeContent} />,
  parameters: {
    docs: {
      description: {
        story:
          'The same résumé document, editable. Click any block to edit inline; Enter splits, Tab/Shift-Tab ' +
          'indent/outdent — the whole Notion-like editing surface works because the résumé is real document blocks.',
      },
    },
  },
}
