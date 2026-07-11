import {
  bold,
  bulletedList,
  colored,
  column,
  columnList,
  createDocumentBlock,
  divider,
  heading,
  image,
  inlineCode,
  link,
  paragraph,
  resetBlockIds,
  type SduiDocumentContent,
  tags,
  text,
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

/** Section heading (H2) with the purple accent. */
const section = (title: string) => heading([colored(title, PURPLE)], 2)

/* -------------------------------------------------------------------------- */
/* Resume document — 이충헌 포트폴리오, authored with the library builders.     */
/* problem → approach → impact, with metrics up front and details in toggles. */
/* -------------------------------------------------------------------------- */

resetBlockIds()

const resumeContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'resume-root',
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

      // Skills
      section('Skills'),
      tags([
        { label: 'Next.js', color: 'blue' },
        { label: 'React', color: 'blue' },
        { label: 'TypeScript', color: 'blue' },
        { label: 'Zustand', color: 'green' },
        { label: 'TanStack Query', color: 'green' },
        { label: 'Playwright', color: 'orange' },
        { label: 'Vitest', color: 'orange' },
        { label: 'Storybook', color: 'pink' },
        { label: 'Paddle.js', color: 'yellow' },
        { label: 'Vercel', color: 'gray' },
        { label: 'Sentry', color: 'red' },
      ]),

      // Work experience — Korea Deep Learning first
      section('Work Experience'),

      // ── Korea Deep Learning ──────────────────────────────────────────────
      heading('프론트엔드', 3),
      paragraph([colored('Korea Deep Learning Inc. · 정규직', META_GRAY)]),
      paragraph([colored('2026년 2월 - 현재 · 6개월', META_GRAY)]),
      paragraph([
        text('시리즈 A '),
        inlineCode('120억 원'),
        text(
          ' 투자를 유치한 AI OCR/VLM 스타트업에서 Next.js 기반 글로벌 AI SaaS의 프론트엔드 아키텍처, 결제, 품질 자동화 및 성능 최적화를 담당하고 있습니다.',
        ),
      ]),
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
      bulletedList([
        text('사용자 시나리오와 BVA(경계값 분석) 기반으로 E2E 테스트 '),
        inlineCode('400+'),
        text(', 단위 테스트 '),
        inlineCode('400+'),
        text(' 구축 — 배포 후 프론트엔드 프로덕션 버그를 '),
        inlineCode('1개월당 1~2건'),
        text(' 수준으로 대폭 감소'),
      ]),
      paragraph([bold('아키텍처 & 성능')]),
      bulletedList('비정형 N-depth OCR 결과를 재귀적 트리 구조의 Server-Driven UI로 구현', {
        children: [
          bulletedList([
            text('→ 템플릿 오픈소스: '),
            link('https://github.com/lodado/sdui-template', 'https://github.com/lodado/sdui-template'),
          ]),
        ],
      }),
      bulletedList(
        'OCR 데이터를 ID 기반으로 정규화하고 useSyncExternalStore 기반 노드별 구독 구조를 적용, ' +
          '변경된 컴포넌트만 선택적으로 리렌더링해 대규모 문서에서도 지연 없는 편집 경험 확보',
      ),
      bulletedList([
        text('코드 스플리팅과 vendor chunk 분리로 초기 JavaScript 번들 '),
        inlineCode('68%'),
        text(' 감소, 웹폰트 서브셋 적용으로 폰트 리소스 '),
        inlineCode('70%'),
        text(' 감소'),
      ]),
      paragraph([bold('글로벌 결제')]),
      bulletedList('Paddle.js 기반 글로벌 결제 연동 및 구독 플랜별 UI 노출·기능 접근 제어 로직 설계 (State pattern)'),
      paragraph([
        colored(
          'Next.js · React · TypeScript · Zustand · TanStack Query · Playwright · Vitest · Storybook · Paddle.js · Vercel · Sentry',
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
  title: 'Document/Examples/Resume (포트폴리오)',
  component: SduiDocumentEditor,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A Notion-style portfolio résumé authored with the `@lodado/sdui-document` builders — ' +
          '`tags`/`toggle`/`bookmark` and related blocks. ' +
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
/* element (no dependency). Screen-only; the PDF carries the document text.      */
/* Reference: https://silver-blue-23c.notion.site/Sysmaster-DB-8-6af5a3a52a6b42cda8fa227869ac8e1a */
/* -------------------------------------------------------------------------- */

const SYSMASTER_NOTION_URL = 'https://silver-blue-23c.notion.site/Sysmaster-DB-8-6af5a3a52a6b42cda8fa227869ac8e1a'

const SYSMASTER_BULLETS = [
  '드래그 앤 드롭으로 레이아웃을 조정하는 인터랙션과 progress 애니메이션 구현',
  'breakpoint 기반 반응형 대시보드',
  '차트 렌더링 — Chart.js · Recharts · Canvas',
]

const SYSMASTER_CHIPS = ['React', 'Chart.js', 'Recharts', 'Canvas', 'Server-Driven UI']

/** Scoped styling for the showcase card: two-column, hover, responsive, print-hidden. */
const sysmasterCss = `
.sm-card {
  --sm-accent: #9065b0;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  gap: 0;
  margin: 28px 0;
  border: 1px solid #ececf1;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 2px rgba(16, 15, 24, 0.04), 0 12px 32px -18px rgba(144, 101, 176, 0.35);
}
.sm-media {
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  border-right: 1px solid #f0eef5;
  background: radial-gradient(120% 120% at 20% 0%, #201a2b 0%, #0c0a12 100%);
  cursor: zoom-in;
  overflow: hidden;
}
.sm-media img {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 220px;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.sm-media:hover img { transform: scale(1.04); }
.sm-media__tag {
  position: absolute;
  left: 12px;
  bottom: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: rgba(12, 10, 18, 0.66);
  backdrop-filter: blur(6px);
}
.sm-media__tag::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #4ade80;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.25);
}
.sm-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 22px 24px;
}
.sm-eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--sm-accent);
}
.sm-title { margin: 0; font-size: 19px; font-weight: 700; color: #1c1b22; }
.sm-lede { margin: 0; font-size: 13.5px; line-height: 1.6; color: #6b6875; }
.sm-bullets { margin: 4px 0 0; padding: 0; list-style: none; display: grid; gap: 8px; }
.sm-bullets li {
  position: relative;
  padding-left: 20px;
  font-size: 13.5px;
  line-height: 1.55;
  color: #37343f;
}
.sm-bullets li::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 8px;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--sm-accent);
}
.sm-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 2px; }
.sm-chip {
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 600;
  color: #6d5389;
  background: #f3edf9;
}
.sm-cta {
  align-self: flex-start;
  margin-top: 6px;
  padding: 9px 16px;
  border: none;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 600;
  color: #fff;
  background: var(--sm-accent);
  cursor: pointer;
  transition: filter 0.15s ease, transform 0.15s ease;
}
.sm-cta:hover { filter: brightness(1.08); transform: translateY(-1px); }
.sm-dialog {
  border: none;
  border-radius: 16px;
  padding: 0;
  width: min(880px, 92vw);
  max-width: 92vw;
  box-shadow: 0 24px 70px -20px rgba(16, 15, 24, 0.55);
}
.sm-dialog::backdrop { background: rgba(16, 15, 24, 0.55); backdrop-filter: blur(2px); }
.sm-dialog__inner { padding: 22px 24px 26px; }
.sm-dialog__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.sm-dialog__head h3 { margin: 0; font-size: 20px; }
.sm-dialog__close {
  border: none;
  background: #f2f1f5;
  border-radius: 8px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 14px;
  color: #6b6875;
}
.sm-dialog__close:hover { background: #e7e5ec; }
.sm-dialog img { display: block; width: 100%; height: auto; border-radius: 10px; margin-bottom: 16px; }
.sm-link { color: var(--sm-accent); font-weight: 600; text-decoration: none; }
.sm-link:hover { text-decoration: underline; }

@media (max-width: 640px) {
  .sm-card { grid-template-columns: 1fr; }
  .sm-media { border-right: none; border-bottom: 1px solid #f0eef5; }
  .sm-media img { min-height: 180px; }
}
@media print { .sysmaster-showcase { display: none !important; } }
`

const SysmasterShowcase = () => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const openDialog = () => dialogRef.current?.showModal()

  return (
    <section className="sysmaster-showcase" aria-label="Sysmaster DB 8 데모">
      <style>{sysmasterCss}</style>

      <article className="sm-card">
        {/* Left — embedded autoplaying gif. Click opens the detail dialog. */}
        <button type="button" className="sm-media" onClick={openDialog} aria-label="Sysmaster 데모 크게 보기">
          <img src={sysmasterDemo} alt="Sysmaster DB 8 대시보드 데모" />
          <span className="sm-media__tag">Live Demo</span>
        </button>

        {/* Right — concise bullets. */}
        <div className="sm-body">
          <span className="sm-eyebrow">Featured · Tmax Data</span>
          <h3 className="sm-title">Sysmaster DB 8 — 실시간 DB 모니터링</h3>
          <p className="sm-lede">
            Tibero DB 모니터링 프로그램의 실시간 Dashboard를 구현. 모니터링 항목을 drag &amp; drop으로 자유롭게
            배치·관제.
          </p>
          <ul className="sm-bullets">
            {SYSMASTER_BULLETS.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <div className="sm-chips">
            {SYSMASTER_CHIPS.map((chip) => (
              <span key={chip} className="sm-chip">
                {chip}
              </span>
            ))}
          </div>
          <button type="button" className="sm-cta" onClick={openDialog}>
            상세 보기 →
          </button>
        </div>
      </article>

      <dialog ref={dialogRef} className="sm-dialog">
        <div className="sm-dialog__inner">
          <div className="sm-dialog__head">
            <h3>Sysmaster DB 8</h3>
            <button
              type="button"
              className="sm-dialog__close"
              onClick={() => dialogRef.current?.close()}
              aria-label="닫기"
            >
              ✕
            </button>
          </div>

          <img src={sysmasterDemo} alt="Sysmaster DB 8 대시보드 데모 (확대)" />

          <p style={{ margin: '0 0 12px', color: META_GRAY }}>
            Tibero DB 모니터링 프로그램 SysmasterDB8의 실시간 Dashboard·Realtime Monitoring 화면을 구현했습니다.
            모니터링 항목을 drag &amp; drop으로 자유롭게 배치하고 관제할 수 있습니다.
          </p>
          <ul style={{ margin: '0 0 16px', paddingLeft: 20, lineHeight: 1.7 }}>
            {SYSMASTER_BULLETS.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <a className="sm-link" href={SYSMASTER_NOTION_URL} target="_blank" rel="noreferrer">
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
const ResumeFrame = ({ editable }: { editable: boolean }) => {
  const apiRef = useRef<SduiDocumentEditorApi>(null)
  const [seedContent, setSeedContent] = useState(resumeContent)
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
    anchor.download = 'resume.json'
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
  render: () => <ResumeFrame editable={false} />,
}

export const Editable: Story = {
  render: () => <ResumeFrame editable />,
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
