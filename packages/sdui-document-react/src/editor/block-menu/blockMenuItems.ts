/**
 * Block menu registry — analog of Outline app/editor/menus/block.tsx.
 * `action` decides the select flow: 'insert' patches immediately, 'file'
 * opens the file picker first, 'link' switches the menu to a URL input.
 */
export type BlockMenuItem = {
  id: string
  type: string
  title: string
  /** Plain-text glyph — no icon dependency in this package. */
  glyph: string
  keywords: readonly string[]
  attributes?: Record<string, unknown>
  action: 'insert' | 'file' | 'link'
}

export const BLOCK_MENU_ITEMS: readonly BlockMenuItem[] = [
  {
    id: 'paragraph',
    type: 'document.paragraph',
    title: 'Text',
    glyph: '¶',
    action: 'insert',
    keywords: ['text', 'paragraph', 'plain', '텍스트', '본문', '문단'],
  },
  {
    id: 'heading-1',
    type: 'document.heading',
    title: 'Heading 1',
    glyph: 'H1',
    action: 'insert',
    attributes: { level: 1 },
    keywords: ['heading', 'h1', 'title', '제목', '헤딩'],
  },
  {
    id: 'heading-2',
    type: 'document.heading',
    title: 'Heading 2',
    glyph: 'H2',
    action: 'insert',
    attributes: { level: 2 },
    keywords: ['heading', 'h2', 'subtitle', '제목', '헤딩'],
  },
  {
    id: 'heading-3',
    type: 'document.heading',
    title: 'Heading 3',
    glyph: 'H3',
    action: 'insert',
    attributes: { level: 3 },
    keywords: ['heading', 'h3', '제목', '헤딩'],
  },
  {
    id: 'checklist',
    type: 'document.checklist',
    title: 'To-do list',
    glyph: '☑',
    action: 'insert',
    keywords: ['todo', 'checkbox', 'checklist', 'task', '할일', '체크', '체크리스트'],
  },
  {
    id: 'bulleted-list',
    type: 'document.bulleted-list',
    title: 'Bulleted list',
    glyph: '•',
    action: 'insert',
    keywords: ['bullet', 'list', 'unordered', '글머리', '리스트', '목록'],
  },
  {
    id: 'numbered-list',
    type: 'document.numbered-list',
    title: 'Numbered list',
    glyph: '1.',
    action: 'insert',
    keywords: ['number', 'list', 'ordered', '번호', '숫자', '목록'],
  },
  {
    id: 'toggle',
    type: 'document.toggle',
    title: 'Toggle list',
    glyph: '▸',
    action: 'insert',
    keywords: ['toggle', 'collapse', 'expand', '토글', '접기'],
  },
  {
    id: 'quote',
    type: 'document.quote',
    title: 'Quote',
    glyph: '❝',
    action: 'insert',
    keywords: ['quote', 'blockquote', 'citation', '인용', '인용구'],
  },
  {
    id: 'callout',
    type: 'document.callout',
    title: 'Callout',
    glyph: '❐',
    action: 'insert',
    keywords: ['callout', 'info', 'notice', '콜아웃', '강조', '안내'],
  },
  {
    id: 'divider',
    type: 'document.divider',
    title: 'Divider',
    glyph: '—',
    action: 'insert',
    keywords: ['divider', 'hr', 'rule', 'separator', '구분선', '분선'],
  },
  {
    id: 'code',
    type: 'document.code',
    title: 'Code',
    glyph: '</>',
    action: 'insert',
    keywords: ['code', 'snippet', 'codeblock', '코드'],
  },
  {
    id: 'image',
    type: 'document.image',
    title: 'Image',
    glyph: '▨',
    action: 'file',
    keywords: ['image', 'picture', 'photo', '이미지', '사진', '그림'],
  },
  {
    id: 'file',
    type: 'document.file',
    title: 'File',
    glyph: '▣',
    action: 'file',
    keywords: ['file', 'attachment', 'upload', '파일', '첨부'],
  },
  {
    id: 'link',
    type: 'document.link',
    title: 'Link',
    glyph: '⇗',
    action: 'link',
    keywords: ['link', 'url', 'bookmark', '링크', '주소'],
  },
]

export function filterBlockMenuItems(query: string): BlockMenuItem[] {
  const needle = query.trim().toLowerCase()
  if (!needle) {
    return [...BLOCK_MENU_ITEMS]
  }

  return BLOCK_MENU_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(needle) ||
      item.keywords.some((keyword) => keyword.toLowerCase().includes(needle)),
  )
}
