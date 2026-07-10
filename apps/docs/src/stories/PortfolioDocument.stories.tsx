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

      // Work experience — the core of the portfolio, placed first
      section('Work Experience'),

      // ── Korea Deep Learning ──────────────────────────────────────────────
      heading('Korea Deep Learning Inc. — 프론트엔드', 3),
      paragraph([colored('정규직 · 2026.02 – 현재 · 6개월', META_GRAY)]),
      paragraph(
        '시리즈 A 120억 원 투자를 유치한 AI OCR/VLM 스타트업에서 Next.js 기반 글로벌 AI SaaS의 ' +
          '프론트엔드 아키텍처, 결제, 품질 자동화 및 성능 최적화를 담당하고 있습니다.',
      ),
      bulletedList([bold('AI 기반 개발 워크플로 구축')], {
        children: [
          bulletedList([
            text('Playwright 테스트 명세를 AI Agent가 자율 실행·판정하는 QA 도구를 '),
            bold('오픈소스로 개발'),
            text('하고, 사내 테스트 프로세스에 도입해 반복적인 수동 QA 검증을 자동화'),
          ]),
          bulletedList([
            text('→ '),
            link(
              'github.com/lodado/playwright-spec-for-AI-Agent',
              'https://github.com/lodado/playwright-spec-for-AI-Agent',
            ),
          ]),
          bulletedList(
            '디자인 시스템 컴포넌트와 사용 규칙을 AI Agent에 제공하는 Design System MCP를 구축, ' +
              'AI 생성 코드가 사내 컨벤션과 디자인 시스템을 준수하도록 개발 워크플로에 적용',
          ),
        ],
      }),
      bulletedList([bold('품질 자동화')], {
        children: [
          bulletedList([
            text('사용자 시나리오와 BVA(경계값 분석) 기반으로 '),
            bold('E2E 테스트 400+, 단위 테스트 400+'),
            text(' 구축 — 배포 후 프론트엔드 프로덕션 버그 [TODO: 사용자 확인] 수준으로 유지'),
          ]),
        ],
      }),
      bulletedList([bold('결제 · 성능 · 온보딩')], {
        children: [
          bulletedList('Paddle.js 기반 글로벌 구독 결제 연동 및 플랜별 기능 노출/제한 로직 설계'),
          bulletedList([text('입사 2개월 내 '), bold('350+ 커밋'), text(' — 빠른 온보딩과 높은 실행력 입증')]),
        ],
      }),
      paragraph([
        colored(
          'React.js · TypeScript · Next.js · Zustand · TanStack Query · Playwright · Vitest · Storybook · Paddle.js · Vercel · Sentry',
          META_GRAY,
        ),
      ]),

      divider(),

      // ── Tmax Data ────────────────────────────────────────────────────────
      heading('티맥스데이터 — Frontend Web Developer', 3),
      paragraph([colored('정규직 · 2022.10 – 2026.01 · 3년 4개월 · 성남시 · 대면근무', META_GRAY)]),
      paragraph(
        '제품 전반에서 재사용할 수 있는 사내 디자인 시스템과 DB 모니터링 플랫폼의 프론트엔드 ' +
          '아키텍처를 설계하고 구축했습니다.',
      ),
      bulletedList([bold('사내 디자인 시스템 구축')], {
        children: [
          bulletedList('디자인 시스템을 제안하고 아키텍처 설계부터 컴포넌트 개발·배포 체계 구축까지 주도'),
          bulletedList('Turborepo, Changesets, Rollup 기반 ESM 모노레포 및 패키지 버전 관리 구조 설계'),
          bulletedList('Storybook 기반 컴포넌트 문서화 및 UI 개발 협업 표준 정립'),
          bulletedList('Jest, React Testing Library, GitLab Runner 기반 컴포넌트 테스트·배포 CI/CD 구축'),
          bulletedList('가상화 기반 렌더링을 적용한 공통 대용량 Table 컴포넌트 설계'),
          bulletedList('Radix UI 기반 Compound Component Pattern을 적용해 확장 가능한 컴포넌트 API 구현'),
        ],
      }),
      bulletedList([bold('SysMasterDB 8 — 실시간 DB 모니터링 플랫폼')], {
        children: [
          bulletedList('Grafana와 유사한 복잡한 DB 모니터링 플랫폼의 프론트엔드 아키텍처 설계·구축'),
          bulletedList('대시보드 — 드래그 앤 드롭 기반 Server-Driven UI 설계 (본 sdui-template 레포가 예시 구현)'),
          bulletedList('Feature-Sliced Design(FSD) 기반 폴더 구조 재설계'),
        ],
      }),
      paragraph([
        colored('React.js · TypeScript · JavaScript · HTML · Storybook · Jest · Rollup · Turborepo', META_GRAY),
      ]),

      divider(),

      // Projects & Open Source — project writeups and their repos, unified
      section('Projects & Open Source'),

      heading('AI Agent 자율 QA 도구 (오픈소스)', 3),
      paragraph([colored('Korea Deep Learning · 2026', META_GRAY)]),
      paragraph(
        'Playwright 테스트 명세를 AI Agent가 자율 실행·판정하는 QA 도구를 오픈소스로 개발하고, ' +
          '사내 테스트 프로세스에 도입해 반복적인 수동 QA 검증을 자동화했습니다.',
      ),
      toggle('상세 보기 — 문제 · 접근 · 임팩트', [
        bulletedList('문제: 릴리즈마다 반복되는 수동 QA 시나리오 검증에 개발/QA 리소스가 소모'),
        bulletedList('접근: 테스트 명세를 AI Agent가 읽고 Playwright로 자율 실행 → 결과 판정까지 자동화'),
        bulletedList('임팩트: 사내 테스트 프로세스에 정식 도입, 반복 수동 검증 제거'),
      ]),
      bookmark('https://github.com/lodado/playwright-spec-for-AI-Agent', {
        title: 'playwright-spec-for-AI-Agent',
        description: 'AI Agent가 자율 실행·판정하는 Playwright QA 도구',
      }),

      heading('Design System MCP', 3),
      paragraph([colored('Korea Deep Learning · 2026', META_GRAY)]),
      paragraph(
        '디자인 시스템 컴포넌트와 사용 규칙을 AI Agent에 제공하는 MCP 서버를 구축, ' +
          'AI 생성 코드가 사내 컨벤션과 디자인 시스템을 준수하도록 개발 워크플로에 적용했습니다.',
      ),
      toggle('상세 보기 — 문제 · 접근 · 임팩트', [
        bulletedList('문제: AI 생성 코드가 사내 컴포넌트/토큰 대신 임의 구현을 생산 → 리뷰 비용 증가'),
        bulletedList('접근: 컴포넌트 목록·사용 규칙·토큰을 MCP 리소스로 노출해 Agent 컨텍스트에 주입'),
        bulletedList('임팩트: AI 생성 코드의 디자인 시스템 준수가 워크플로 차원에서 보장'),
      ]),

      heading('sdui-template (오픈소스)', 3),
      paragraph('Server-Driven UI 템플릿 라이브러리 — 이 포트폴리오 문서 자체가 이 라이브러리로 렌더링됩니다.'),
      bookmark('https://github.com/lodado/sdui-template', {
        title: 'sdui-template',
        description: 'Server-Driven UI 템플릿 라이브러리 (Notion 스타일 문서 에디터 포함)',
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

const expandBlock = (block: SduiDocumentContent['root']): SduiDocumentContent['root'] => ({
  ...block,
  ...(block.type === TOGGLE_BLOCK_TYPE && block.attributes?.collapsed === true
    ? { attributes: { ...block.attributes, collapsed: false } }
    : {}),
  ...(block.children ? { children: block.children.map(expandBlock) } : {}),
})

const expandToggles = (content: SduiDocumentContent): SduiDocumentContent => ({
  ...content,
  root: expandBlock(content.root),
})

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
