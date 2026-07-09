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

/** Cheap-wins bucket demo: TOC block, emoji callout, inline @date chip. */
export const cheapWinsContent: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'cw-root',
    type: 'document.root',
    children: [
      createDocumentBlock({
        id: 'cw-toc',
        type: 'document.toc',
      }),
      createDocumentBlock({
        id: 'cw-h1',
        type: 'document.heading',
        attributes: { level: 1 },
        state: { content: [{ type: 'text', text: '개요' }], text: '개요' },
      }),
      createDocumentBlock({
        id: 'cw-callout',
        type: 'document.callout',
        attributes: { tone: 'tip', icon: '🔥' },
        state: {
          content: [{ type: 'text', text: '콜아웃 아이콘은 이모지로 바꿀 수 있습니다 (편집 시 아이콘 클릭).' }],
          text: '콜아웃 아이콘은 이모지로 바꿀 수 있습니다 (편집 시 아이콘 클릭).',
        },
      }),
      createDocumentBlock({
        id: 'cw-h2',
        type: 'document.heading',
        attributes: { level: 2 },
        state: { content: [{ type: 'text', text: '일정' }], text: '일정' },
      }),
      createDocumentBlock({
        id: 'cw-date',
        type: 'document.paragraph',
        state: {
          content: [
            { type: 'text', text: '마감일 ' },
            { type: 'date', iso: '2026-07-06', display: '2026년 7월 6일' },
            { type: 'text', text: ' 까지. 본문에서 "@today "를 입력하면 날짜 칩이 삽입됩니다.' },
          ],
          text: '마감일 2026년 7월 6일 까지. 본문에서 "@today "를 입력하면 날짜 칩이 삽입됩니다.',
        },
      }),
      createDocumentBlock({
        id: 'cw-h2b',
        type: 'document.heading',
        attributes: { level: 2 },
        state: { content: [{ type: 'text', text: '참고' }], text: '참고' },
      }),
      createDocumentBlock({
        id: 'cw-p',
        type: 'document.paragraph',
        state: { text: '맨 위 목차는 제목 블록에서 자동 파생됩니다. 항목을 클릭하면 해당 제목으로 스크롤됩니다.' },
      }),
    ],
  }),
}
