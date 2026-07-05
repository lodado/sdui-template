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
        },
        attributes: { level: 1 },
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
        attributes: { style: 'tip' },
      }),
      createDocumentBlock({
        id: 'ov-check',
        type: 'document.checklist',
        state: { text: '체크박스를 눌러 block.update 패치를 확인하세요' },
        attributes: { checked: false },
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
        state: { text: 'document.heading (level 2)' },
        attributes: { level: 2 },
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
        id: 'ab-check',
        type: 'document.checklist',
        state: { text: 'checklist — 체크 가능한 항목' },
        attributes: { checked: true },
      }),
      createDocumentBlock({
        id: 'ab-callout',
        type: 'document.callout',
        state: { text: 'callout — info / warning / tip / success 톤' },
        attributes: { style: 'warning' },
      }),
      createDocumentBlock({ id: 'ab-divider', type: 'document.divider' }),
      createDocumentBlock({
        id: 'ab-image',
        type: 'document.image',
        state: { text: 'image — 캡션은 state.text' },
        attributes: { src: 'https://picsum.photos/seed/sdui-arch/560/220', alt: 'sample', width: 560 },
      }),
      createDocumentBlock({
        id: 'ab-file',
        type: 'document.file',
        attributes: { url: 'https://example.com/spec.pdf', name: 'architecture-spec.pdf', size: 20480 },
      }),
      createDocumentBlock({
        id: 'ab-link',
        type: 'document.link',
        state: { text: 'link — 북마크 카드' },
        attributes: { url: 'https://www.getoutline.com' },
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
