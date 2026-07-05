import {
  bold,
  bulletedList,
  colored,
  createDocumentBlock,
  divider,
  hardBreak,
  heading,
  highlighted,
  image,
  link,
  paragraph,
  resetBlockIds,
  type SduiDocumentContent,
  text,
} from '@lodado/sdui-document'
import { SduiDocumentEditor } from '@lodado/sdui-document-react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import profilePhoto from './assets/resume-profile.jpg'

/** Accent for the date chips (light background). */
const CHIP_ACCENT = '#E3EAFD'
/** Secondary text color (gray) for role periods. */
const META_GRAY = '#66778F'

/* -------------------------------------------------------------------------- */
/* Resume document — 이충헌 이력서 authored with the library block/inline builders */
/* (heading / paragraph / bulletedList / image / divider + text/bold/link/…),  */
/* laid out to mirror the original markdown structure.                         */
/* -------------------------------------------------------------------------- */

resetBlockIds() // deterministic, readable ids for this document

const resumeContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'resume-root',
    type: 'document.root',
    children: [
      heading('이충헌 이력서', 1),
      image({ src: profilePhoto, alt: '이충헌 프로필 사진', width: 220 }),

      // Contact
      heading('Contact', 2),
      paragraph('📞 Call | 010-3343-0276'),
      paragraph('📌 Email | ycp998@naver.com'),

      // 블로그 & 깃허브
      heading('블로그 & 깃허브', 2),
      paragraph([text('💻 Blog | '), link('https://lodado.tistory.com/', 'https://lodado.tistory.com/')]),
      paragraph([text('🏠 Github | '), link('https://github.com/lodado', 'https://github.com/lodado')]),

      // Intro
      bulletedList(
        '사용자 경험과 제품 완성도를 함께 고민하며, 빠르게 설계하고 안정적으로 구현하는 프론트엔드 개발자입니다!',
      ),
      bulletedList('기획 방향에도 주도적으로 참여하고 디자인, QA등 직군을 가리지 않습니다.'),
      bulletedList([
        text('AI Native한 개발 방식을 지향하며, 새로운 도구와 워크플로우를 빠르게 실무에 적용합니다.'),
        hardBreak,
        text('입사 2개월 내 350+ 커밋을 기여하며 빠른 온보딩과 높은 실행력을 입증했습니다.'),
      ]),
      bulletedList(
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
      paragraph([colored('2026.02 – Present', META_GRAY)]),
      paragraph(
        '구독형 AI Saas입니다. VLM(시각언어모델)과 OCR을 결합하여 영수증, 계약서 등에서 핵심 데이터를 자동으로 추출하는 템플릿 기능을 제공합니다.',
      ),
      paragraph([link('한국딥러닝 작업 포트폴리오', 'https://app.notion.com/p/3520bc6660208095b4b8ca4186ae0e2a')]),
      bulletedList('Paddle.js 기반 글로벌 결제 연동'),
      bulletedList('팩토리 패턴으로 구독 플랜 기반 UI 노출 및 기능 제한 로직 설계/구현'),
      bulletedList('Git Worktree 기반 병렬 AI 에이전트 개발 환경을 설계해 동시 작업 효율을 높였습니다.', {
        children: [
          bulletedList('입사 2개월 내에 350+ 커밋을 기여하며 빠르게 온보딩하고 높은 실행력을 보여주었습니다.'),
        ],
      }),
      bulletedList(
        '사용자 시나리오와 BVA(경계값 분석) 기반으로 E2E 테스트 300+를 구축하고, Playwright Sharding으로 CI 테스트 효율을 개선했습니다.',
      ),
      bulletedList('Claude Code의 Hook 및 테스트 코드를 활용해 AI self-loop feedback 체계를 설계·구축했습니다'),

      divider(),

      heading('Tmax Tibero — Frontend Engineer', 3),
      paragraph([colored('2022.10 – 2026.02', META_GRAY)]),

      heading('Sysmaster DB 8 (Real-time DB Monitoring)', 3),
      paragraph('grafana dashboard와 비슷한 복잡한 db monitoring platform입니다.'),
      paragraph([
        link('Sysmaster DB 8 포트폴리오', 'https://app.notion.com/p/Sysmaster-DB-8-6af5a3a52a6b42cda8fa227869ac8e1a'),
      ]),
      bulletedList('대시보드 - 드래그 앤 드롭 기반 Server-Driven UI 설계'),
      bulletedList('사용자가 모듈을 자유롭게 배치하고 원하는 레이아웃을 만들 수 있는 커스터마이징 경험 제공했습니다.'),
      paragraph([
        text('('),
        bold('SDUI 예시 코드 레포지토리 - '),
        link('https://github.com/lodado/sdui-template', 'https://github.com/lodado/sdui-template'),
        text(')'),
      ]),
      bulletedList('Feature-Sliced Design(FSD) 기반으로 폴더 구조 재설계'),

      heading('Design System (Frontend Platform)', 3),
      paragraph([colored('2024.03 – 2026.02', META_GRAY)]),
      paragraph(
        '사내 React 기반 제품 간 UI 일관성 부족으로, 사용자 학습 비용이 커지고 신규 기능 개발이 "매번 새로 만드는 형태"로 반복되어 해당 문제를 해결하기 위해 제안 및 주도했습니다.',
      ),
      bulletedList('TurboRepo + Changeset + Rollup(ESM) 기반 모노레포 구조 설계'),
      bulletedList('figma & 시멘틱 토큰 기반 CSS variable 관리'),
      bulletedList('Jest + React Testing Library + GitLab Runner 기반 CI/CD 도입'),

      heading('Impact', 3),
      bulletedList('공통 컴포넌트/패턴 재사용률 증가 → 신규 기능 UI 개발 리드타임 단축'),
      bulletedList('storybook 문서 기반 온보딩으로 C++만 배운 신입도 2–3개월 내 실서비스 투입 가능'),

      // Side Projects
      heading('Side Projects', 2),
      heading('Simmey (Web Service)', 3),
      paragraph([
        text('깃허브 주소 : '),
        link('https://github.com/lodado/mamapapa', 'https://github.com/lodado/mamapapa'),
        text(' | 링크 : '),
        link('https://mamapapa.vercel.app/ko', 'https://mamapapa.vercel.app/ko'),
      ]),
      bulletedList([text('광고 없이 MAU '), bold('600–900+'), text(', 해외 사용자 비중 '), bold('95%+ (SEO로 유입)')]),

      divider(),

      // 자격증
      heading('자격증', 2),
      paragraph([highlighted('2021. 06', CHIP_ACCENT), text(' 정보처리기사')]),

      // Education
      heading('Education', 2),
      paragraph([highlighted('2015', CHIP_ACCENT), text(' 전남대학교 전자컴퓨터공학부 입학')]),
      paragraph([highlighted('2016', CHIP_ACCENT), text(' 전남대학교 소프트웨어전공 선택')]),
      paragraph([
        highlighted('2020', CHIP_ACCENT),
        text(' '),
        link('컴퓨터비전 학부연구생', 'https://sites.google.com/site/seokbongyoo/introduction?authuser=0'),
        text(' 근무'),
      ]),
      paragraph([
        highlighted('2021', CHIP_ACCENT),
        text(' 네이버 '),
        link('부스트캠프 챌린지, 멤버쉽 과정 6기', 'https://boostcamp.connect.or.kr/'),
        text(' 수료'),
      ]),
      paragraph([highlighted('2022. 02', CHIP_ACCENT), text(' 졸업 (전공 4.09/4.5, 총합 3.96 / 4.5)')]),
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
          'A real résumé authored with the `@lodado/sdui-document` authoring builders ' +
          '(`heading` / `paragraph` / `bulletedList` / `image` / `divider` + `text`/`bold`/`link`/`colored`/`highlighted`), ' +
          'laid out to mirror the original markdown. Rendered read-only as a faithful document; ' +
          'in the Editable story, hover the image for its layout popover and select text for the color/align toolbar.',
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
          'The same résumé, editable. Select text to open the formatting toolbar (bold/색/정렬), ' +
          'hover the profile image for its size/position popover, and click any block to edit inline.',
      },
    },
  },
}
