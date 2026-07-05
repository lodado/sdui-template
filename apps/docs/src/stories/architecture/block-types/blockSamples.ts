import { createDocumentBlock, type SduiDocumentContent } from '@lodado/sdui-document'

/** Wrap a single block (or tree) under a root for editor demos. */
export function wrapBlockSample(...children: ReturnType<typeof createDocumentBlock>[]): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'sample-root',
      type: 'document.root',
      children,
    }),
  }
}

export const paragraphSample = wrapBlockSample(
  createDocumentBlock({
    id: 'sample-paragraph',
    type: 'document.paragraph',
    state: {
      content: [
        { type: 'text', text: '기본 텍스트 블록. 인라인 마크: ' },
        { type: 'text', text: 'bold', marks: [{ type: 'bold' }] },
        { type: 'text', text: ' · ' },
        { type: 'text', text: 'italic', marks: [{ type: 'italic' }] },
        { type: 'text', text: ' · ' },
        { type: 'text', text: 'code', marks: [{ type: 'code' }] },
      ],
      text: '기본 텍스트 블록. 인라인 마크: bold · italic · code',
    },
  }),
)

export const headingSample = wrapBlockSample(
  createDocumentBlock({
    id: 'sample-heading',
    type: 'document.heading',
    state: { text: 'document.heading (level 2)', level: 2 },
  }),
)

export const bulletedListSample = wrapBlockSample(
  createDocumentBlock({
    id: 'sample-bullet',
    type: 'document.bulleted-list',
    state: { text: '불릿 항목 — Tab으로 중첩' },
    children: [
      createDocumentBlock({
        id: 'sample-bullet-nested',
        type: 'document.bulleted-list',
        state: { text: '중첩 불릿' },
      }),
    ],
  }),
)

export const numberedListSample = wrapBlockSample(
  createDocumentBlock({
    id: 'sample-numbered',
    type: 'document.numbered-list',
    state: { text: '번호 목록 1' },
    children: [
      createDocumentBlock({
        id: 'sample-numbered-2',
        type: 'document.numbered-list',
        state: { text: '번호 목록 2' },
      }),
    ],
  }),
)

export const checklistSample = wrapBlockSample(
  createDocumentBlock({
    id: 'sample-checklist',
    type: 'document.checklist',
    state: { text: '체크리스트 — 클릭하면 block.update', checked: true },
  }),
)

export const dividerSample = wrapBlockSample(createDocumentBlock({ id: 'sample-divider', type: 'document.divider' }))

export const calloutSample = wrapBlockSample(
  createDocumentBlock({
    id: 'sample-callout',
    type: 'document.callout',
    state: { text: 'callout — info / tip / warning / success 톤' },
    attributes: { tone: 'warning' },
  }),
)

export const quoteSample = wrapBlockSample(
  createDocumentBlock({
    id: 'sample-quote',
    type: 'document.quote',
    state: { text: '인용문 — 자식 블록을 담을 수 있습니다' },
    children: [
      createDocumentBlock({
        id: 'sample-quote-child',
        type: 'document.paragraph',
        state: { text: '인용 안의 문단' },
      }),
    ],
  }),
)

export const toggleSample = wrapBlockSample(
  createDocumentBlock({
    id: 'sample-toggle',
    type: 'document.toggle',
    state: { text: '토글 제목 — 클릭해 접기/펼치기' },
    attributes: { collapsed: false },
    children: [
      createDocumentBlock({
        id: 'sample-toggle-child',
        type: 'document.paragraph',
        state: { text: '접혀 있어도 문서 트리에는 남습니다' },
      }),
    ],
  }),
)

export const codeSample = wrapBlockSample(
  createDocumentBlock({
    id: 'sample-code',
    type: 'document.code',
    state: { text: "const hello = 'world'\nconsole.log(hello)" },
    attributes: { language: 'typescript' },
  }),
)

export const imageSample = wrapBlockSample(
  createDocumentBlock({
    id: 'sample-image',
    type: 'document.image',
    state: { text: '이미지 캡션' },
    attributes: { src: 'https://picsum.photos/seed/sdui-block-image/560/220', alt: 'sample' },
  }),
)

export const fileSample = wrapBlockSample(
  createDocumentBlock({
    id: 'sample-file',
    type: 'document.file',
    state: { text: 'architecture-spec.pdf' },
    attributes: { title: 'architecture-spec.pdf', size: '20 KB' },
  }),
)

export const linkSample = wrapBlockSample(
  createDocumentBlock({
    id: 'sample-link',
    type: 'document.link',
    state: { text: 'Outline — 북마크 카드' },
    attributes: { href: 'https://www.getoutline.com' },
  }),
)

export const columnListSample = wrapBlockSample(
  createDocumentBlock({
    id: 'sample-column-list',
    type: 'document.columnList',
    children: [
      createDocumentBlock({
        id: 'sample-col-1',
        type: 'document.column',
        attributes: { ratio: 1 },
        children: [
          createDocumentBlock({
            id: 'sample-col-1-p',
            type: 'document.paragraph',
            state: { text: '왼쪽 컬럼 — 가로 드래그로 columnList 생성' },
          }),
        ],
      }),
      createDocumentBlock({
        id: 'sample-col-2',
        type: 'document.column',
        attributes: { ratio: 1 },
        children: [
          createDocumentBlock({
            id: 'sample-col-2-p',
            type: 'document.paragraph',
            state: { text: '오른쪽 컬럼' },
          }),
        ],
      }),
    ],
  }),
)

export const rootSample: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'sample-root-only',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'sample-root-p',
        type: 'document.paragraph',
        state: { text: 'document.root — 모든 문서의 최상위 컨테이너' },
      }),
    ],
  }),
}

export const columnSample = wrapBlockSample(
  createDocumentBlock({
    id: 'sample-column-list-standalone',
    type: 'document.columnList',
    children: [
      createDocumentBlock({
        id: 'sample-column-a',
        type: 'document.column',
        attributes: { ratio: 2 },
        children: [
          createDocumentBlock({
            id: 'sample-column-a-p',
            type: 'document.paragraph',
            state: { text: 'ratio 2 — grow 가중치' },
          }),
        ],
      }),
      createDocumentBlock({
        id: 'sample-column-b',
        type: 'document.column',
        attributes: { ratio: 1 },
        children: [
          createDocumentBlock({
            id: 'sample-column-b-p',
            type: 'document.paragraph',
            state: { text: 'ratio 1' },
          }),
        ],
      }),
    ],
  }),
)
