// Resume-only chrome (masthead, showcase, print extras) — the document itself
// uses the package's default Swiss theme.
import './ResumeSwiss.css'

import {
  bold,
  bulletedList,
  colored,
  column,
  columnList,
  createDocumentBlock,
  divider,
  heading,
  inlineCode,
  link,
  paragraph,
  resetBlockIds,
  type SduiDocumentContent,
  text,
  TOGGLE_BLOCK_TYPE,
} from '@lodado/sdui-document'
import { SduiDocumentEditor, type SduiDocumentEditorApi } from '@lodado/sdui-document-react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { type CSSProperties, useEffect, useRef, useState } from 'react'

// TODO: 실제 Sysmaster 화면 녹화 gif로 교체 (같은 경로/파일명 sysmaster-demo.gif).
import sysmasterDemo from './assets/sysmaster-demo.gif'

/** Meta/secondary text — Swiss gray. */
const META_GRAY = '#555555'

/** Section heading (H2) — the Swiss theme renders it as an uppercase label over a 2px rule. */
const section = (title: string) => heading(title, 2)

/* -------------------------------------------------------------------------- */
/* Resume document — 이충헌 이력서, authored with the library builders.        */
/* Swiss layout: each entry is a columnList with a period rail on the left.   */
/* problem → approach → impact, with metrics up front.                        */
/* -------------------------------------------------------------------------- */

resetBlockIds()

const resumeContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'resume-root',
    type: 'document.root',
    children: [
      // Skills — plain text line, no chips
      section('Skills'),
      paragraph(
        'Next.js · React · TypeScript · Zustand · TanStack Query · Playwright · Vitest · Storybook · ' +
          'Paddle.js · Vercel · Sentry',
      ),

      // Work experience — Korea Deep Learning first
      section('Work Experience'),

      // ── Korea Deep Learning ──────────────────────────────────────────────
      columnList([
        column([paragraph([colored('2026.02 — 현재', META_GRAY)]), paragraph([colored('6개월', META_GRAY)])], {
          ratio: 1,
        }),
        column(
          [
            heading('프론트엔드', 3),
            paragraph([colored('Korea Deep Learning Inc. · 정규직', META_GRAY)]),
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
            bulletedList(
              'Paddle.js 기반 글로벌 결제 연동 및 구독 플랜별 UI 노출·기능 접근 제어 로직 설계 (State pattern)',
            ),
            paragraph([
              colored(
                'Next.js · React · TypeScript · Zustand · TanStack Query · Playwright · Vitest · Storybook · Paddle.js · Vercel · Sentry',
                META_GRAY,
              ),
            ]),
          ],
          { ratio: 3.5 },
        ),
      ]),

      divider(),

      // ── Tmax Data ────────────────────────────────────────────────────────
      columnList([
        column([paragraph([colored('2022.10 — 2026.01', META_GRAY)]), paragraph([colored('3년 4개월', META_GRAY)])], {
          ratio: 1,
        }),
        column(
          [
            heading('Frontend Web Developer', 3),
            paragraph([colored('티맥스데이터 · 정규직 · 성남시 · 대면근무', META_GRAY)]),
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
          ],
          { ratio: 3.5 },
        ),
      ]),
    ],
  }),
}

/**
 * Tail document — rendered as a second editor BELOW the Sysmaster showcase so
 * the featured card stays anchored to the Tmax entry. Merged with the main
 * document for PDF/JSON export (see mergeContents).
 */
const tailContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'resume-tail-root',
    type: 'document.root',
    children: [
      // Side projects & open source
      section('Side Projects & Open Source'),
      heading('Simmey (Web Service)', 3),
      paragraph([
        link('github.com/lodado/mamapapa', 'https://github.com/lodado/mamapapa'),
        text('  ·  '),
        link('mamapapa.vercel.app/ko', 'https://mamapapa.vercel.app/ko'),
      ]),
      bulletedList([
        text('광고 없이 MAU '),
        inlineCode('600–900+'),
        text(', 해외 사용자 비중 '),
        inlineCode('95%+'),
        text(' (SEO로 유입)'),
      ]),
      heading('Sdui-document', 3),
      paragraph([
        link(
          'github.com/lodado/sdui-template — packages/sdui-document-react',
          'https://github.com/lodado/sdui-template/tree/main/packages/sdui-document-react',
        ),
        text('  ·  '),
        link(
          'Storybook 라이브 데모 (이 이력서)',
          'https://lodado.github.io/sdui-template/?path=/story/document-examples-resume-%ED%8F%AC%ED%8A%B8%ED%8F%B4%EB%A6%AC%EC%98%A4--editable',
        ),
      ]),
      bulletedList([bold('지금 보고 계신 이 이력서가 이 에디터로 작성·렌더링·PDF 출력된 문서입니다')]),
      bulletedList('ProseMirror + React 기반 Notion형 블록 에디터 — 계층형 drag & drop, 컬럼 레이아웃, 컬렉션 뷰'),
      bulletedList('이벤트 소싱 패턴으로 undo/redo 구현'),
      bulletedList('문서를 ID 기반으로 정규화하고 노드별 구독을 적용, 변경된 블록만 리렌더링'),
      bulletedList('CSS cascade layer 기반 테마 시스템 — 이 이력서의 Swiss 테마도 CSS 오버라이드만으로 구현'),

      heading('playwright-spec-for-AI-Agent', 3),
      paragraph([
        link(
          'github.com/lodado/playwright-spec-for-AI-Agent',
          'https://github.com/lodado/playwright-spec-for-AI-Agent',
        ),
      ]),
      bulletedList('비결정적인 production 테스트 결과 검수를 AI Agent(Hermes Agent)로 1차 자동화'),
      bulletedList(
        'Playwright spec 주석을 AI가 읽는 QA 시나리오로 변환, 실제 스테이징 환경을 에이전트가 직접 검증 — ' +
          '모호한 결과는 manual_review로 사람에게 에스컬레이션',
      ),

      // Education
      section('Education'),
      paragraph([inlineCode('2015'), text(' 전남대학교 전자컴퓨터공학부 입학')]),
      paragraph([inlineCode('2016'), text(' 전남대학교 소프트웨어전공 선택')]),
      paragraph([inlineCode('2020'), text(' 컴퓨터비전 학부연구생 근무')]),
      paragraph([inlineCode('2021'), text(' 네이버 부스트캠프 챌린지, 멤버쉽 과정 6기 수료')]),
      paragraph([inlineCode('2022.02'), text(' 졸업 (전공 4.09/4.5, 총합 3.96/4.5)')]),

      divider(),

      // Footer
      paragraph([
        link('ycp998@naver.com', 'mailto:ycp998@naver.com'),
        text('  ·  '),
        link('github.com/lodado', 'https://github.com/lodado'),
        text('  ·  '),
        link('lodado.tistory.com', 'https://lodado.tistory.com/'),
      ]),
    ],
  }),
}

/** Concatenates the two on-screen documents into one for print/JSON export. */
const mergeContents = (main: SduiDocumentContent, tail: SduiDocumentContent): SduiDocumentContent => ({
  ...main,
  root: {
    ...main.root,
    children: [...(main.root.children ?? []), ...(tail.root.children ?? [])],
  },
})

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
          'A Swiss/print-editorial résumé authored with the `@lodado/sdui-document` builders, rendered ' +
          "by the package's default **Swiss theme** (see Document/Themes — " +
          '`@lodado/sdui-document-react/styles/themes/swiss.css`). ' +
          'The masthead is story-level chrome; the body is document blocks (columnList period rails). ' +
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
  border: '1px solid #111',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  background: '#fff',
  color: '#111',
}

/** Hides Storybook chrome/padding while printing; the gif showcase is screen-only. */
const printResetCss = `
@media print {
  body { padding: 0 !important; margin: 0 !important; background: #fff !important; }
}
`

/**
 * Masthead — name, positioning, and contact links. Story-level chrome (like a
 * Notion page cover): rendered above the document on screen AND in the print
 * tree, so the PDF keeps the identity header.
 */
const Masthead = () => (
  <header className="resume-masthead">
    <div>
      <h1>이충헌</h1>
      <p className="resume-masthead__role">AI Native 프론트엔드 엔지니어</p>
      <p className="resume-masthead__tagline">
        빠르게 설계하고 안정적으로 구현하며, AI 도구를 팀의 워크플로로 만드는 개발자입니다.
      </p>
    </div>
    <address className="resume-masthead__contact">
      <a href="https://github.com/lodado" target="_blank" rel="noreferrer">
        github.com/lodado
      </a>
      <br />
      <a href="https://lodado.tistory.com/" target="_blank" rel="noreferrer">
        lodado.tistory.com
      </a>
      <br />
      <a href="mailto:ycp998@naver.com">ycp998@naver.com</a>
    </address>
  </header>
)

/* -------------------------------------------------------------------------- */
/* Sysmaster DB 8 showcase — an embedded, autoplaying gif preview with a       */
/* click-to-open detail dialog. Story-level React (not a document block): the  */
/* gif animates natively as an <img>, the dialog is the native <dialog>        */
/* element (no dependency). Screen-only; the PDF carries the document text.    */
/* Styles live in ResumeSwiss.css (.sm-*).                                     */
/* Reference: https://silver-blue-23c.notion.site/Sysmaster-DB-8-6af5a3a52a6b42cda8fa227869ac8e1a */
/* -------------------------------------------------------------------------- */

const SYSMASTER_NOTION_URL = 'https://silver-blue-23c.notion.site/Sysmaster-DB-8-6af5a3a52a6b42cda8fa227869ac8e1a'

const SYSMASTER_BULLETS = [
  '드래그 앤 드롭으로 레이아웃을 조정하는 인터랙션과 progress 애니메이션 구현',
  'breakpoint 기반 반응형 대시보드',
  '차트 렌더링 — Chart.js · Recharts · Canvas',
]

const SYSMASTER_CHIPS = ['React', 'Chart.js', 'Recharts', 'Canvas', 'Server-Driven UI']

const SysmasterShowcase = () => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const openDialog = () => dialogRef.current?.showModal()

  return (
    <section className="sysmaster-showcase" aria-label="Sysmaster DB 8 데모">
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
  const tailApiRef = useRef<SduiDocumentEditorApi>(null)
  const [seedContent, setSeedContent] = useState(resumeContent)
  const [seedTail, setSeedTail] = useState(tailContent)
  const [instanceKey, setInstanceKey] = useState(0)
  const [printDoc, setPrintDoc] = useState<SduiDocumentContent | null>(null)

  const exportPdf = () => {
    const currentMain = apiRef.current?.getContent() ?? seedContent
    const currentTail = tailApiRef.current?.getContent() ?? seedTail
    setSeedContent(currentMain) // restore target after print
    setSeedTail(currentTail)
    setPrintDoc(expandToggles(mergeContents(currentMain, currentTail)))
  }

  const exportJson = () => {
    const data = mergeContents(
      apiRef.current?.getContent() ?? seedContent,
      tailApiRef.current?.getContent() ?? seedTail,
    )
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
      <div className="resume-swiss">
        <style>{printResetCss}</style>
        <Masthead />
        <SduiDocumentEditor content={printDoc} readOnly />
      </div>
    )
  }

  return (
    <div className="resume-swiss">
      <style>{printResetCss}</style>
      <div className="resume-toolbar" style={toolbarStyle}>
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
      <Masthead />
      <SduiDocumentEditor key={instanceKey} content={seedContent} apiRef={apiRef} readOnly={!editable} />
      <SysmasterShowcase />
      {/* ponytail: undo/redo buttons drive the main editor only; the tail editor keeps its own PM history */}
      <SduiDocumentEditor key={`tail-${instanceKey}`} content={seedTail} apiRef={tailApiRef} readOnly={!editable} />
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
          '편집 가능한 이력서. 텍스트 선택으로 포매팅 툴바, "PDF 저장"으로 read-only 전환 후 A4 인쇄. ' +
          'Swiss 테마는 패키지 기본 테마 (Document/Themes 참고).',
      },
    },
  },
}
