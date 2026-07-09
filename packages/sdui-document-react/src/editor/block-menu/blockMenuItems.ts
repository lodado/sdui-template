/**
 * Block menu registry — analog of Outline app/editor/menus/block.tsx.
 * `action` decides the select flow: 'insert' patches immediately, 'file'
 * opens the file picker first, 'link' switches the menu to a URL input.
 */
import { CODE_BLOCK_TYPE, COLLECTION_BLOCK_TYPE, PAGE_BLOCK_TYPE, TOGGLE_BLOCK_TYPE } from '@lodado/sdui-document'

export type BlockMenuGroup = 'basic' | 'media' | 'advanced'

export const BLOCK_MENU_GROUP_LABELS: Record<BlockMenuGroup, string> = {
  basic: 'Basic blocks',
  media: 'Media',
  advanced: 'Advanced',
}

export type BlockMenuItem = {
  id: string
  type: string
  title: string
  /** Plain-text glyph — no icon dependency in this package. */
  glyph: string
  keywords: readonly string[]
  attributes?: Record<string, unknown>
  action: 'insert' | 'file' | 'link'
  /** Section the item renders under when the menu is unfiltered. */
  group: BlockMenuGroup
  /** Markdown shortcut hint shown right-aligned (mirrors the input rules). */
  hint?: string
}

export const BLOCK_MENU_ITEMS: readonly BlockMenuItem[] = [
  {
    id: 'paragraph',
    type: 'document.paragraph',
    title: 'Text',
    glyph: '¶',
    action: 'insert',
    group: 'basic',
    keywords: ['text', 'paragraph', 'plain', '텍스트', '본문', '문단'],
  },
  {
    id: 'heading-1',
    type: 'document.heading',
    title: 'Heading 1',
    glyph: 'H1',
    action: 'insert',
    group: 'basic',
    hint: '#',
    attributes: { level: 1 },
    keywords: ['heading', 'h1', 'title', '제목', '제목1', '헤딩'],
  },
  {
    id: 'heading-2',
    type: 'document.heading',
    title: 'Heading 2',
    glyph: 'H2',
    action: 'insert',
    group: 'basic',
    hint: '##',
    attributes: { level: 2 },
    keywords: ['heading', 'h2', 'subtitle', '제목', '제목2', '헤딩'],
  },
  {
    id: 'heading-3',
    type: 'document.heading',
    title: 'Heading 3',
    glyph: 'H3',
    action: 'insert',
    group: 'basic',
    hint: '###',
    attributes: { level: 3 },
    keywords: ['heading', 'h3', '제목', '제목3', '헤딩'],
  },
  {
    id: 'checklist',
    type: 'document.checklist',
    title: 'To-do list',
    glyph: '☑',
    action: 'insert',
    group: 'basic',
    hint: '[]',
    keywords: ['todo', 'checkbox', 'checklist', 'task', '할일', '체크', '체크리스트'],
  },
  {
    id: 'bulleted-list',
    type: 'document.bulleted-list',
    title: 'Bulleted list',
    glyph: '•',
    action: 'insert',
    group: 'basic',
    hint: '-',
    keywords: ['bullet', 'list', 'unordered', '글머리', '리스트', '목록'],
  },
  {
    id: 'numbered-list',
    type: 'document.numbered-list',
    title: 'Numbered list',
    glyph: '1.',
    action: 'insert',
    group: 'basic',
    hint: '1.',
    keywords: ['number', 'list', 'ordered', '번호', '숫자', '목록'],
  },
  {
    id: 'toggle',
    type: TOGGLE_BLOCK_TYPE,
    title: 'Toggle list',
    glyph: '▸',
    action: 'insert',
    group: 'basic',
    keywords: ['toggle', 'collapse', 'expand', '토글', '접기'],
  },
  {
    id: 'quote',
    type: 'document.quote',
    title: 'Quote',
    glyph: '❝',
    action: 'insert',
    group: 'basic',
    hint: '>',
    keywords: ['quote', 'blockquote', 'citation', '인용', '인용구'],
  },
  {
    id: 'callout',
    type: 'document.callout',
    title: 'Callout',
    glyph: '❐',
    action: 'insert',
    group: 'basic',
    keywords: ['callout', 'info', 'notice', '콜아웃', '강조', '안내'],
  },
  {
    id: 'divider',
    type: 'document.divider',
    title: 'Divider',
    glyph: '—',
    action: 'insert',
    group: 'basic',
    hint: '***',
    keywords: ['divider', 'hr', 'rule', 'separator', '구분선', '분선'],
  },
  {
    id: 'code',
    type: CODE_BLOCK_TYPE,
    title: 'Code',
    glyph: '</>',
    action: 'insert',
    group: 'basic',
    hint: '```',
    keywords: ['code', 'snippet', 'codeblock', '코드'],
  },
  {
    id: 'image',
    type: 'document.image',
    title: 'Image',
    glyph: '▨',
    action: 'file',
    group: 'media',
    keywords: ['image', 'picture', 'photo', '이미지', '사진', '그림'],
  },
  {
    id: 'file',
    type: 'document.file',
    title: 'File',
    glyph: '▣',
    action: 'file',
    group: 'media',
    keywords: ['file', 'attachment', 'upload', '파일', '첨부'],
  },
  {
    id: 'link',
    type: 'document.link',
    title: 'Link',
    glyph: '⇗',
    action: 'link',
    group: 'media',
    keywords: ['link', 'url', 'bookmark', '링크', '주소'],
  },
  {
    id: 'toc',
    type: 'document.toc',
    title: 'Table of contents',
    glyph: '≡',
    action: 'insert',
    group: 'advanced',
    keywords: ['toc', 'contents', 'outline', 'table of contents', '목차', '개요'],
  },
  {
    id: 'page',
    type: PAGE_BLOCK_TYPE,
    title: 'Page',
    glyph: '📄',
    action: 'insert',
    group: 'basic',
    keywords: ['page', 'subpage', 'document', '페이지', '하위', '문서'],
  },
  {
    id: 'collection-gallery',
    type: COLLECTION_BLOCK_TYPE,
    title: 'Gallery',
    glyph: '▦',
    action: 'insert',
    group: 'advanced',
    attributes: { view: 'gallery', properties: [] },
    keywords: ['gallery', 'collection', 'database', 'cards', '갤러리', '컬렉션', '카드'],
  },
  {
    id: 'collection-list',
    type: COLLECTION_BLOCK_TYPE,
    title: 'List view',
    glyph: '☰',
    action: 'insert',
    group: 'advanced',
    attributes: { view: 'list', properties: [] },
    keywords: ['list', 'collection', 'database', '리스트', '목록', '컬렉션'],
  },
]

/**
 * Turn-into targets = the insertable block types, minus the ones with no text
 * content to carry over (divider / image / file / link). Turning an existing
 * text block into those would silently drop its content. Page is excluded
 * too: turn-into-page implies moving content to a new document (backlog).
 */
export const TURN_INTO_ITEMS: readonly BlockMenuItem[] = BLOCK_MENU_ITEMS.filter(
  (item) =>
    item.action === 'insert' &&
    item.type !== 'document.divider' &&
    item.type !== PAGE_BLOCK_TYPE &&
    item.type !== COLLECTION_BLOCK_TYPE,
)

/** Page and collection insertion both need the host document factory (onCreatePage). */
const DOCUMENT_FACTORY_TYPES = new Set<string>([PAGE_BLOCK_TYPE, COLLECTION_BLOCK_TYPE])

/** Menu item matching a live block (heading levels disambiguated via attrs). */
export function blockMenuItemIdFor(type: string, attributes?: Record<string, unknown>): string | null {
  const match = BLOCK_MENU_ITEMS.find((item) => {
    if (item.type !== type) {
      return false
    }
    const level = item.attributes?.level

    return level === undefined || level === attributes?.level
  })

  return match?.id ?? null
}

export type BlockMenuCapabilities = {
  /** Page insertion needs a host document factory (onCreatePage) — hidden without one. */
  canCreatePage?: boolean
}

export function filterBlockMenuItems(query: string, capabilities?: BlockMenuCapabilities): BlockMenuItem[] {
  const needle = query.trim().toLowerCase()
  const available = BLOCK_MENU_ITEMS.filter(
    (item) => !DOCUMENT_FACTORY_TYPES.has(item.type) || capabilities?.canCreatePage === true,
  )
  if (!needle) {
    return available
  }

  return available.filter(
    (item) =>
      item.title.toLowerCase().includes(needle) ||
      item.keywords.some((keyword) => keyword.toLowerCase().includes(needle)),
  )
}
