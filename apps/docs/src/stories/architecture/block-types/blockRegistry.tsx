import type { SduiDocumentContent } from '@lodado/sdui-document'
import type React from 'react'

import {
  bulletedListSample,
  calloutSample,
  checklistSample,
  codeSample,
  columnListSample,
  columnSample,
  dividerSample,
  fileSample,
  headingSample,
  imageSample,
  linkSample,
  numberedListSample,
  paragraphSample,
  quoteSample,
  rootSample,
  toggleSample,
} from './blockSamples'

export interface BlockTypeDoc {
  /** Storybook sidebar slug, e.g. "Paragraph" */
  slug: string
  /** Full block type id */
  type: string
  /** Korean title for the doc page */
  titleKo: string
  lead: string
  pills: string[]
  /** Module folder under block-types/ */
  modulePath: string
  sduiNodeType: string
  menuInsertable: boolean
  canHostInlineText: boolean
  markdownSupport: boolean
  stateFields: string[]
  attributesFields: string[]
  description: React.ReactNode
  sampleContent: SduiDocumentContent
}

export const BLOCK_TYPE_DOCS: BlockTypeDoc[] = [
  {
    slug: 'Root',
    type: 'document.root',
    titleKo: 'Root · 문서 루트',
    lead: '모든 문서의 최상위 컨테이너. 메뉴에서 삽입하지 않으며, SDUI Div로 children을 감쌉니다.',
    pills: ['container', 'document.root', 'canHostInlineText: false'],
    modulePath: 'block-types/root/',
    sduiNodeType: 'Div',
    menuInsertable: false,
    canHostInlineText: false,
    markdownSupport: true,
    stateFields: [],
    attributesFields: [],
    description: (
      <>
        문서 JSON의 <code>root</code> 노드입니다. 테마의 배경·최대 너비·타이포그래피를 SDUI className으로 적용하고, 자식
        블록만 렌더합니다.
      </>
    ),
    sampleContent: rootSample,
  },
  {
    slug: 'Paragraph',
    type: 'document.paragraph',
    titleKo: 'Paragraph · 문단',
    lead: '기본 인라인 텍스트 블록. 알 수 없는 타입의 폴백 모듈이기도 합니다.',
    pills: ['content', 'inline text', 'fallback module'],
    modulePath: 'block-types/paragraph/',
    sduiNodeType: 'Span',
    menuInsertable: true,
    canHostInlineText: true,
    markdownSupport: true,
    stateFields: ['text', 'content'],
    attributesFields: [],
    description: (
      <>
        ProseMirror 포커스 블록의 기본 타입입니다. <code>state.content</code> 가 인라인 마크 트리,{' '}
        <code>state.text</code> 는 검색·미리보기용 평문입니다.
      </>
    ),
    sampleContent: paragraphSample,
  },
  {
    slug: 'Heading',
    type: 'document.heading',
    titleKo: 'Heading · 제목',
    lead: '레벨 1–3 제목. state.level로 크기를 결정합니다.',
    pills: ['content', 'level 1–3', '# markdown'],
    modulePath: 'block-types/heading/',
    sduiNodeType: 'Div + Title child',
    menuInsertable: true,
    canHostInlineText: true,
    markdownSupport: true,
    stateFields: ['text', 'content', 'level'],
    attributesFields: [],
    description: (
      <>
        마크다운 <code>#</code>–<code>###</code> 와 1:1 대응합니다. SDUI 매핑 시 Title 자식 노드에 레벨별 className을
        적용합니다.
      </>
    ),
    sampleContent: headingSample,
  },
  {
    slug: 'Bulleted List',
    type: 'document.bulleted-list',
    titleKo: 'Bulleted List · 불릿 목록',
    lead: '불릿 리스트 항목. Tab/Shift-Tab으로 중첩합니다.',
    pills: ['content', 'nested children', '- markdown'],
    modulePath: 'block-types/bulleted-list/',
    sduiNodeType: 'Div',
    menuInsertable: true,
    canHostInlineText: true,
    markdownSupport: true,
    stateFields: ['text', 'content'],
    attributesFields: [],
    description: (
      <>
        Outline/Notion 스타일 불릿입니다. 자식도 같은 타입으로 중첩되며, 마크다운 <code>-</code> / <code>*</code>{' '}
        토큰에서 생성됩니다.
      </>
    ),
    sampleContent: bulletedListSample,
  },
  {
    slug: 'Numbered List',
    type: 'document.numbered-list',
    titleKo: 'Numbered List · 번호 목록',
    lead: '번호 매김 리스트. 순서는 형제 position 키로 결정됩니다.',
    pills: ['content', 'nested children', '1. markdown'],
    modulePath: 'block-types/numbered-list/',
    sduiNodeType: 'Div',
    menuInsertable: true,
    canHostInlineText: true,
    markdownSupport: true,
    stateFields: ['text', 'content'],
    attributesFields: [],
    description: (
      <>
        마크다운 ordered list와 대응합니다. 번호 자체는 블록 state에 저장하지 않고, fractional ordering + 렌더러가
        계산합니다.
      </>
    ),
    sampleContent: numberedListSample,
  },
  {
    slug: 'Checklist',
    type: 'document.checklist',
    titleKo: 'Checklist · 체크리스트',
    lead: '체크박스가 있는 할 일 항목. checked는 state에 저장됩니다.',
    pills: ['content', 'block.update', '- [ ] markdown'],
    modulePath: 'block-types/checklist/',
    sduiNodeType: 'Div + check/text children',
    menuInsertable: true,
    canHostInlineText: true,
    markdownSupport: true,
    stateFields: ['text', 'content', 'checked'],
    attributesFields: [],
    description: (
      <>
        클릭 시 <code>block.update</code> 로 <code>state.checked</code> 를 토글합니다. GFM task list(
        <code>- [ ]</code>)에서 임포트됩니다.
      </>
    ),
    sampleContent: checklistSample,
  },
  {
    slug: 'Divider',
    type: 'document.divider',
    titleKo: 'Divider · 구분선',
    lead: '텍스트 없는 수평 구분선. state/attributes 없음.',
    pills: ['content', 'leaf block', '--- markdown'],
    modulePath: 'block-types/divider/',
    sduiNodeType: 'Div',
    menuInsertable: true,
    canHostInlineText: false,
    markdownSupport: true,
    stateFields: [],
    attributesFields: [],
    description: (
      <>
        <code>canHostInlineText: false</code> — 캐럿을 둘 수 없는 leaf 블록입니다. 마크다운 <code>---</code> 로
        삽입됩니다.
      </>
    ),
    sampleContent: dividerSample,
  },
  {
    slug: 'Callout',
    type: 'document.callout',
    titleKo: 'Callout · 콜아웃',
    lead: '톤(info/tip/warning/success)이 있는 강조 블록.',
    pills: ['content', 'attributes.tone', '> markdown → callout'],
    modulePath: 'block-types/callout/',
    sduiNodeType: 'Div + icon/text children',
    menuInsertable: true,
    canHostInlineText: true,
    markdownSupport: true,
    stateFields: ['text', 'content'],
    attributesFields: ['tone'],
    description: (
      <>
        마크다운 blockquote는 기본적으로 callout으로 매핑됩니다. <code>attributes.tone</code> 이 테마
        색상(border/bg/icon)을 고릅니다.
      </>
    ),
    sampleContent: calloutSample,
  },
  {
    slug: 'Quote',
    type: 'document.quote',
    titleKo: 'Quote · 인용',
    lead: '인용문 컨테이너. 자식 블록을 중첩할 수 있습니다.',
    pills: ['content', 'container', '> markdown'],
    modulePath: 'block-types/quote/',
    sduiNodeType: 'Div',
    menuInsertable: true,
    canHostInlineText: true,
    markdownSupport: true,
    stateFields: ['text', 'content'],
    attributesFields: [],
    description: (
      <>
        callout과 달리 시각적으로 인용 블록입니다. 슬래시 메뉴·마크다운 단축키 <code>&gt; </code> 로 삽입할 수 있습니다.
      </>
    ),
    sampleContent: quoteSample,
  },
  {
    slug: 'Toggle',
    type: 'document.toggle',
    titleKo: 'Toggle · 토글',
    lead: '접기/펼치기 가능한 컨테이너. collapsed는 attributes에 저장됩니다.',
    pills: ['content', 'container', 'attributes.collapsed'],
    modulePath: 'block-types/toggle/',
    sduiNodeType: 'Div',
    menuInsertable: true,
    canHostInlineText: true,
    markdownSupport: true,
    stateFields: ['text', 'content'],
    attributesFields: ['collapsed'],
    description: (
      <>
        접혀 있어도 자식은 문서 트리에 유지됩니다. SDUI <code>state.collapsed</code> 로 렌더러에 전달해 표시만 숨깁니다.
      </>
    ),
    sampleContent: toggleSample,
  },
  {
    slug: 'Code',
    type: 'document.code',
    titleKo: 'Code · 코드 블록',
    lead: '여러 줄 코드. language는 attributes, 본문은 state.text.',
    pills: ['content', '``` markdown', 'attributes.language'],
    modulePath: 'block-types/code/',
    sduiNodeType: 'Div',
    menuInsertable: true,
    canHostInlineText: true,
    markdownSupport: true,
    stateFields: ['text'],
    attributesFields: ['language'],
    description: (
      <>
        fenced code block(<code>```lang</code>)에서 생성됩니다. 하이라이팅은 아직 없고, 언어 피커용 메타데이터만
        보관합니다.
      </>
    ),
    sampleContent: codeSample,
  },
  {
    slug: 'Image',
    type: 'document.image',
    titleKo: 'Image · 이미지',
    lead: '이미지 + 캡션. src/alt는 attributes, 캡션은 state.text.',
    pills: ['content', 'leaf block', '![alt](src) markdown'],
    modulePath: 'block-types/image/',
    sduiNodeType: 'Div + label/caption children',
    menuInsertable: true,
    canHostInlineText: false,
    markdownSupport: true,
    stateFields: ['text'],
    attributesFields: ['src', 'alt'],
    description: (
      <>
        <code>canHostInlineText: false</code> — 인라인 편집 대신 블록 단위 속성 편집입니다. 업로드 placeholder는 React
        레이어에서 처리합니다.
      </>
    ),
    sampleContent: imageSample,
  },
  {
    slug: 'File',
    type: 'document.file',
    titleKo: 'File · 파일 첨부',
    lead: '첨부 파일 카드. title/size는 attributes.',
    pills: ['content', 'leaf block', 'attachment'],
    modulePath: 'block-types/file/',
    sduiNodeType: 'Div + icon/title/size children',
    menuInsertable: true,
    canHostInlineText: false,
    markdownSupport: true,
    stateFields: ['text'],
    attributesFields: ['title', 'size'],
    description: (
      <>
        파일 URL·업로드 상태는 React 어댑터가 주입합니다. 도메인 모듈은 표시용 title/size와 SDUI 카드 레이아웃만
        담당합니다.
      </>
    ),
    sampleContent: fileSample,
  },
  {
    slug: 'Link',
    type: 'document.link',
    titleKo: 'Link · 링크 카드',
    lead: '북마크/내부 문서 링크. href는 sanitize 후 SDUI에 전달.',
    pills: ['content', 'leaf block', 'extractLinks', 'safeHref'],
    modulePath: 'block-types/link/',
    sduiNodeType: 'Span (anchor)',
    menuInsertable: true,
    canHostInlineText: false,
    markdownSupport: true,
    stateFields: ['text'],
    attributesFields: ['href', 'targetDocumentId'],
    description: (
      <>
        <code>extractLinks</code> 로 문서 링크 인덱스에 기여합니다. 렌더 시 <code>safeHref</code> 가
        http/https/mailto/tel 만 허용합니다.
      </>
    ),
    sampleContent: linkSample,
  },
  {
    slug: 'Column List',
    type: 'document.columnList',
    titleKo: 'Column List · 다단 레이아웃',
    lead: '가로 flex 컨테이너. 자식은 column만 허용. 메뉴 삽입 없음.',
    pills: ['container', 'drag-only', 'Notion-style wrap'],
    modulePath: 'block-types/column-list/',
    sduiNodeType: 'Div (flex row)',
    menuInsertable: false,
    canHostInlineText: false,
    markdownSupport: true,
    stateFields: [],
    attributesFields: [],
    description: (
      <>
        블록을 옆으로 드래그해 wrap하면 생성됩니다. Notion과 같이 슬래시 메뉴에는 없고, <code>createDefault</code> 도
        제공하지 않습니다.
      </>
    ),
    sampleContent: columnListSample,
  },
  {
    slug: 'Column',
    type: 'document.column',
    titleKo: 'Column · 단일 컬럼',
    lead: 'columnList 안의 세로 스택. attributes.ratio로 너비 가중치.',
    pills: ['container', 'attributes.ratio', 'drag-only'],
    modulePath: 'block-types/column/',
    sduiNodeType: 'Div (grow-[ratio])',
    menuInsertable: false,
    canHostInlineText: false,
    markdownSupport: true,
    stateFields: [],
    attributesFields: ['ratio'],
    description: (
      <>
        형제 column들 사이에서 <code>ratio</code> 가 flex grow 가중치입니다. 없으면 균등 분할, 리사이즈 핸들은 React
        에디터가 patch로 갱신합니다.
      </>
    ),
    sampleContent: columnSample,
  },
]

export function blockDocByType(type: string): BlockTypeDoc | undefined {
  return BLOCK_TYPE_DOCS.find((doc) => doc.type === type)
}
