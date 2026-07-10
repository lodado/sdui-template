import {
  bold,
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
  TOGGLE_BLOCK_TYPE,
} from '@lodado/sdui-document'
import { SduiDocumentEditor, type SduiDocumentEditorApi } from '@lodado/sdui-document-react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { type CSSProperties, useEffect, useRef, useState } from 'react'

import profilePhoto from './assets/resume-profile.jpg'
// TODO: 실제 Sysmaster 화면 녹화 gif로 교체 (같은 경로/파일명 sysmaster-demo.gif).
import sysmasterDemo from './assets/sysmaster-demo.gif'

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
      callout('E2E 테스트 400+ / 단위 테스트 400+ 구축 — 배포 후 프론트엔드 프로덕션 버그 월 1~2회로 감소', {
        tone: 'success',
        icon: '✅',
      }),
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

      // Work experience — verbatim from the source resume, placed first
      section('Work Experience'),

      // ── Korea Deep Learning ──────────────────────────────────────────────
      heading('프론트엔드', 3),
      paragraph([colored('Korea Deep Learning Inc. · 정규직', META_GRAY)]),
      paragraph([colored('2026년 2월 - 현재 · 6개월', META_GRAY)]),
      paragraph(
        '시리즈 A 120억 원 투자를 유치한 AI OCR/VLM 스타트업에서 Next.js 기반 글로벌 AI SaaS의 ' +
          '프론트엔드 아키텍처, 결제, 품질 자동화 및 성능 최적화를 담당하고 있습니다.',
      ),
      paragraph([bold('AI 기반 개발 워크플로 구축')]),
      bulletedList(
        'Playwright 테스트 명세를 AI Agent가 자율 실행·판정하는 QA 도구를 오픈소스로 개발하고, ' +
          '사내 테스트 프로세스에 도입해 반복적인 수동 QA 검증을 자동화',
        {
          children: [
            bulletedList([
              text('→ '),
              link(
                'https://github.com/lodado/playwright-spec-for-AI-Agent',
                'https://github.com/lodado/playwright-spec-for-AI-Agent',
              ),
            ]),
          ],
        },
      ),
      bulletedList(
        '디자인 시스템 컴포넌트와 사용 규칙을 AI Agent에 제공하는 Design System MCP를 구축, ' +
          'AI 생성 코드가 사내 컨벤션과 디자인 시스템을 준수하도록 개발 워크플로에 적용',
      ),
      paragraph([bold('품질 자동화')]),
      bulletedList(
        '사용자 시나리오와 BVA(경계값 분석) 기반으로 E2E 테스트 400+, 단위 테스트 400+ 구축 — ' +
          '배포 후 프론트엔드 프로덕션 버그를 월 1~2회로 감소',
      ),
      paragraph([
        colored(
          'React.js · Zustand · TanStack Query · Playwright · Vitest · Storybook · Paddle.js · Vercel · Sentry · Front-end 개발 외 보유기술 +1개',
          META_GRAY,
        ),
      ]),

      divider(),

      // ── Tmax Data ────────────────────────────────────────────────────────
      heading('Frontend Web Developer', 3),
      paragraph([colored('티맥스데이터 · 정규직', META_GRAY)]),
      paragraph([colored('2022년 10월 - 2026년 1월 · 3년 4개월 · 성남시 · 대면근무', META_GRAY)]),
      paragraph(
        '제품 전반에서 재사용할 수 있는 사내 디자인 시스템과 DB 모니터링 플랫폼의 프론트엔드 ' +
          '아키텍처를 설계하고 구축했습니다.',
      ),
      paragraph([bold('사내 디자인 시스템 구축')]),
      bulletedList('디자인 시스템을 제안하고 아키텍처 설계부터 컴포넌트 개발·배포 체계 구축까지 주도'),
      bulletedList('Turborepo, Changesets, Rollup 기반 ESM 모노레포 및 패키지 버전 관리 구조 설계'),
      bulletedList('Storybook 기반 컴포넌트 문서화 및 UI 개발 협업 표준 정립'),
      bulletedList('Jest, React Testing Library, GitLab Runner 기반 컴포넌트 테스트·배포 CI/CD 구축'),
      bulletedList('가상화 기반 렌더링을 적용한 공통 대용량 Table 컴포넌트 설계'),
      bulletedList('Radix UI 기반 Compound Component Pattern을 적용해 확장 가능한 컴포넌트 API 구현'),
      paragraph([colored('React.js · JavaScript · HTML 외 보유기술 +4개', META_GRAY)]),

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

/** Hides Storybook chrome/padding while printing; the gif showcase is screen-only. */
const printResetCss = `
@media print {
  body { padding: 0 !important; margin: 0 !important; background: #fff !important; }
  .sysmaster-showcase { display: none !important; }
}
`

/* -------------------------------------------------------------------------- */
/* Sysmaster DB 8 showcase — an embedded, autoplaying gif preview with a       */
/* click-to-open detail dialog. Story-level React (not a document block): the  */
/* gif animates natively as an <img>, the dialog is the native <dialog>        */
/* element (no dependency). Screen-only; the PDF carries the résumé text.      */
/* Reference: https://silver-blue-23c.notion.site/Sysmaster-DB-8-6af5a3a52a6b42cda8fa227869ac8e1a */
/* -------------------------------------------------------------------------- */

const SYSMASTER_NOTION_URL = 'https://silver-blue-23c.notion.site/Sysmaster-DB-8-6af5a3a52a6b42cda8fa227869ac8e1a'

const showcaseStyle: CSSProperties = {
  margin: '24px 0',
  border: '1px solid var(--sdui-doc-divider, #e5e7eb)',
  borderRadius: 12,
  overflow: 'hidden',
  background: '#fafafa',
}

const showcaseHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '12px 16px',
  borderBottom: '1px solid var(--sdui-doc-divider, #e5e7eb)',
}

const previewButtonStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  padding: 0,
  border: 'none',
  background: '#000',
  cursor: 'zoom-in',
}

const dialogStyle: CSSProperties = {
  border: 'none',
  borderRadius: 12,
  padding: 0,
  width: 'min(900px, 92vw)',
  maxWidth: '92vw',
}

const SysmasterShowcase = () => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (
    <section className="sysmaster-showcase" style={showcaseStyle} aria-label="Sysmaster DB 8 데모">
      <div style={showcaseHeaderStyle}>
        <div>
          <strong>Sysmaster DB 8 — 실시간 DB 모니터링</strong>
          <div style={{ fontSize: 12, color: META_GRAY }}>드래그 앤 드롭 Server-Driven UI 대시보드</div>
        </div>
        <button type="button" onClick={() => dialogRef.current?.showModal()}>
          상세 보기
        </button>
      </div>

      {/* Embedded autoplaying preview (gif). Click opens the detail dialog. */}
      <button type="button" style={previewButtonStyle} onClick={() => dialogRef.current?.showModal()}>
        <img
          src={sysmasterDemo}
          alt="Sysmaster DB 8 대시보드 데모"
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
      </button>

      <dialog ref={dialogRef} style={dialogStyle}>
        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>Sysmaster DB 8</h3>
            <button type="button" onClick={() => dialogRef.current?.close()} aria-label="닫기">
              ✕
            </button>
          </div>

          <img
            src={sysmasterDemo}
            alt="Sysmaster DB 8 대시보드 데모 (확대)"
            style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 8, marginBottom: 16 }}
          />

          {/* TODO: Notion 내용 붙여주면 이 목록을 그대로 교체 */}
          <ul style={{ margin: '0 0 16px', paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Grafana와 유사한 복잡한 DB 모니터링 플랫폼의 프론트엔드 아키텍처 설계·구축</li>
            <li>대시보드 — 드래그 앤 드롭 기반 Server-Driven UI 설계</li>
            <li>사용자가 모듈을 자유롭게 배치하는 커스터마이징 경험 제공</li>
            <li>Feature-Sliced Design(FSD) 기반 폴더 구조 재설계</li>
            <li>[TODO: Notion 상세 내용 추가]</li>
          </ul>

          <a href={SYSMASTER_NOTION_URL} target="_blank" rel="noreferrer">
            Notion에서 전체 보기 →
          </a>
        </div>
      </dialog>
    </section>
  )
}

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
      <SysmasterShowcase />
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
