import { createDocumentBlock, type SduiDocumentContent } from '@lodado/sdui-document'

/** Small, self-explaining document reused across the architecture demos. */
export const overviewContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'ov-root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'ov-h1',
        type: 'document.heading',
        state: {
          content: [{ type: 'text', text: '문서는 도메인 데이터입니다' }],
          text: '문서는 도메인 데이터입니다',
          level: 1,
        },
      }),
      createDocumentBlock({
        id: 'ov-p1',
        type: 'document.paragraph',
        state: {
          content: [
            { type: 'text', text: '편집 모드와 읽기 모드는 ' },
            { type: 'text', text: '같은 모델', marks: [{ type: 'bold' }] },
            { type: 'text', text: '을 공유합니다. ' },
            { type: 'text', text: 'readOnly', marks: [{ type: 'code' }] },
            { type: 'text', text: ' 플래그만 편집 기능을 끕니다.' },
          ],
          text: '편집 모드와 읽기 모드는 같은 모델을 공유합니다. readOnly 플래그만 편집 기능을 끕니다.',
        },
      }),
      createDocumentBlock({
        id: 'ov-callout',
        type: 'document.callout',
        state: { text: '모든 편집은 불변 패치(insert/update/delete/move/split/merge)로 표현됩니다.' },
        attributes: { tone: 'tip' },
      }),
      createDocumentBlock({
        id: 'ov-check',
        type: 'document.checklist',
        state: { text: '체크박스를 눌러 block.update 패치를 확인하세요', checked: false },
      }),
    ],
  }),
}

/** A block of every renderable type — used by the BlockChrome routing demo. */
export const allBlocksContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'ab-root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'ab-h2',
        type: 'document.heading',
        state: { text: 'document.heading (level 2)', level: 2 },
      }),
      createDocumentBlock({
        id: 'ab-p',
        type: 'document.paragraph',
        state: {
          content: [
            { type: 'text', text: 'paragraph — 인라인 마크: ' },
            { type: 'text', text: 'bold', marks: [{ type: 'bold' }] },
            { type: 'text', text: ' · ' },
            { type: 'text', text: 'italic', marks: [{ type: 'italic' }] },
            { type: 'text', text: ' · ' },
            { type: 'text', text: 'code', marks: [{ type: 'code' }] },
            { type: 'text', text: ' · ' },
            { type: 'text', text: 'highlight', marks: [{ type: 'highlight', attrs: { color: '#FED46A' } }] },
          ],
          text: 'paragraph — 인라인 마크: bold · italic · code · highlight',
        },
      }),
      createDocumentBlock({
        id: 'ab-bullet',
        type: 'document.bulleted-list',
        state: { text: 'bulleted-list — 불릿 항목' },
      }),
      createDocumentBlock({
        id: 'ab-numbered',
        type: 'document.numbered-list',
        state: { text: 'numbered-list — 번호 항목' },
      }),
      createDocumentBlock({
        id: 'ab-check',
        type: 'document.checklist',
        state: { text: 'checklist — 체크 가능한 항목', checked: true },
      }),
      createDocumentBlock({
        id: 'ab-callout',
        type: 'document.callout',
        state: { text: 'callout — info / tip / warning / success 톤' },
        attributes: { tone: 'warning' },
      }),
      createDocumentBlock({
        id: 'ab-quote',
        type: 'document.quote',
        state: { text: 'quote — 인용문' },
      }),
      createDocumentBlock({
        id: 'ab-toggle',
        type: 'document.toggle',
        state: { text: 'toggle — 접기/펼치기' },
        attributes: { collapsed: false },
        children: [
          createDocumentBlock({
            id: 'ab-toggle-child',
            type: 'document.paragraph',
            state: { text: '토글 안의 문단' },
          }),
        ],
      }),
      createDocumentBlock({
        id: 'ab-code',
        type: 'document.code',
        state: { text: 'const x = 1\nconsole.log(x)' },
        attributes: { language: 'typescript' },
      }),
      createDocumentBlock({ id: 'ab-divider', type: 'document.divider' }),
      createDocumentBlock({
        id: 'ab-image',
        type: 'document.image',
        state: { text: 'image — 캡션은 state.text' },
        attributes: { src: 'https://picsum.photos/seed/sdui-arch/560/220', alt: 'sample' },
      }),
      createDocumentBlock({
        id: 'ab-file',
        type: 'document.file',
        state: { text: 'architecture-spec.pdf' },
        attributes: { title: 'architecture-spec.pdf', size: '20 KB' },
      }),
      createDocumentBlock({
        id: 'ab-link',
        type: 'document.link',
        state: { text: 'link — 북마크 카드' },
        attributes: { href: 'https://www.getoutline.com' },
      }),
      createDocumentBlock({
        id: 'ab-column-list',
        type: 'document.columnList',
        children: [
          createDocumentBlock({
            id: 'ab-col-1',
            type: 'document.column',
            attributes: { ratio: 1 },
            children: [
              createDocumentBlock({
                id: 'ab-col-1-p',
                type: 'document.paragraph',
                state: { text: 'columnList + column — 다단 레이아웃' },
              }),
            ],
          }),
          createDocumentBlock({
            id: 'ab-col-2',
            type: 'document.column',
            attributes: { ratio: 1 },
            children: [
              createDocumentBlock({
                id: 'ab-col-2-p',
                type: 'document.paragraph',
                state: { text: '가로 드래그로 생성' },
              }),
            ],
          }),
        ],
      }),
    ],
  }),
}

/** Nested tree for the drag & drop demo (depth 3). */
export const nestedContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'nd-root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'nd-a',
        type: 'document.heading',
        state: { text: 'Section A — ⠿ 핸들을 잡고 드래그하세요' },
        attributes: { level: 3 },
        children: [
          createDocumentBlock({
            id: 'nd-a1',
            type: 'document.paragraph',
            state: { text: 'A-1 — 오른쪽으로 밀면 nest, 왼쪽으로 밀면 outdent' },
            children: [
              createDocumentBlock({
                id: 'nd-a1a',
                type: 'document.paragraph',
                state: { text: 'A-1-1 (depth 3) — 부모와 함께 이동' },
              }),
            ],
          }),
        ],
      }),
      createDocumentBlock({
        id: 'nd-b',
        type: 'document.paragraph',
        state: { text: 'B — 드롭 슬롯은 항상 "hover한 블록의 뒤"' },
      }),
    ],
  }),
}

/** Rich paragraph fixture for the selection toolbar / marks demo. */
export const marksContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'mk-root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'mk-p1',
        type: 'document.paragraph',
        state: {
          content: [
            { type: 'text', text: '이 문장에서 텍스트를 드래그로 선택하면 ' },
            { type: 'text', text: '포맷 툴바', marks: [{ type: 'bold' }] },
            { type: 'text', text: '가 뜹니다. ' },
            { type: 'text', text: '하이라이트', marks: [{ type: 'highlight', attrs: { color: '#B4DC19' } }] },
            { type: 'text', text: ' 팔레트도 열어보세요.' },
          ],
          text: '이 문장에서 텍스트를 드래그로 선택하면 포맷 툴바가 뜹니다. 하이라이트 팔레트도 열어보세요.',
        },
      }),
      createDocumentBlock({
        id: 'mk-p2',
        type: 'document.paragraph',
        state: {
          content: [
            { type: 'text', text: '마크다운 단축키: ' },
            { type: 'text', text: '**bold**', marks: [{ type: 'code' }] },
            { type: 'text', text: ', ' },
            { type: 'text', text: '`code`', marks: [{ type: 'code' }] },
            { type: 'text', text: ' 를 직접 입력해도 마크가 적용됩니다.' },
          ],
          text: '마크다운 단축키: **bold**, `code` 를 직접 입력해도 마크가 적용됩니다.',
        },
      }),
    ],
  }),
}

/** Fixture for the slash / block menu demo. */
export const blockMenuContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'bm-root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'bm-p1',
        type: 'document.paragraph',
        state: { text: '빈 줄에서 "/"를 입력해 슬래시 메뉴를 여세요.' },
      }),
      createDocumentBlock({
        id: 'bm-p2',
        type: 'document.paragraph',
        state: { text: '블록 왼쪽의 + 버튼으로도 아래에 블록을 삽입할 수 있습니다.' },
      }),
    ],
  }),
}
