/**
 * Block menu registry — analog of Outline app/editor/menus/block.tsx.
 * `action` decides the select flow: 'insert' patches immediately, 'file'
 * opens the file picker first, 'link' switches the menu to a URL input.
 */
import {
  BOOKMARK_BLOCK_TYPE,
  BUTTON_BLOCK_TYPE,
  CODE_BLOCK_TYPE,
  COLLECTION_BLOCK_TYPE,
  EMBED_BLOCK_TYPE,
  PAGE_BLOCK_TYPE,
  TAGS_BLOCK_TYPE,
  TOGGLE_BLOCK_TYPE,
  VIDEO_BLOCK_TYPE,
} from '@lodado/sdui-document'

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
    keywords: ['link', 'url', '링크', '주소'],
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
  {
    id: 'bookmark',
    type: BOOKMARK_BLOCK_TYPE,
    title: 'Bookmark',
    glyph: '🔖',
    action: 'link',
    group: 'media',
    keywords: ['bookmark', 'link preview', 'url', '북마크', '링크', '미리보기'],
  },
  {
    id: 'video',
    type: VIDEO_BLOCK_TYPE,
    title: 'Video',
    glyph: '▶',
    action: 'link',
    group: 'media',
    keywords: ['video', 'youtube', 'vimeo', '영상', '비디오', '유튜브'],
  },
  {
    id: 'embed',
    type: EMBED_BLOCK_TYPE,
    title: 'Embed',
    glyph: '🖼',
    action: 'link',
    group: 'media',
    keywords: ['embed', 'iframe', 'codepen', 'codesandbox', '임베드'],
  },
  {
    id: 'tags',
    type: TAGS_BLOCK_TYPE,
    title: 'Tags',
    glyph: '🏷',
    action: 'insert',
    group: 'advanced',
    attributes: { items: [] },
    keywords: ['tags', 'skills', 'chips', 'stack', '태그', '기술', '스킬'],
  },
  {
    id: 'button',
    type: BUTTON_BLOCK_TYPE,
    title: 'Button',
    glyph: '🔘',
    action: 'link',
    group: 'advanced',
    attributes: { variant: 'primary' },
    keywords: ['button', 'cta', 'link button', '버튼', '링크버튼'],
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

/**
 * One-line descriptions shown under each item's title (Notion-style menu row).
 * Kept as a keyed map — a single source that never forces per-item edits.
 */
export const BLOCK_MENU_DESCRIPTIONS: Record<string, string> = {
  paragraph: 'Just start writing with plain text.',
  'heading-1': 'Big section heading.',
  'heading-2': 'Medium section heading.',
  'heading-3': 'Small section heading.',
  checklist: 'Track tasks with a to-do list.',
  'bulleted-list': 'Create a simple bulleted list.',
  'numbered-list': 'Create a numbered list.',
  toggle: 'Collapsible content you can expand.',
  quote: 'Capture a quote.',
  callout: 'Make text stand out in a box.',
  divider: 'Visually divide sections.',
  code: 'Capture a code snippet.',
  image: 'Upload or embed an image.',
  file: 'Attach a file.',
  link: 'Add an inline link.',
  toc: 'Auto-generated table of contents.',
  page: 'Embed a sub-page inside this one.',
  'collection-gallery': 'Card gallery backed by a collection.',
  'collection-list': 'List view backed by a collection.',
  bookmark: 'Save a link as a visual bookmark.',
  video: 'Embed a video from a URL.',
  embed: 'Embed an iframe (CodePen, etc.).',
  tags: 'A row of tag / skill chips.',
  button: 'A call-to-action button.',
}

/** Description for a menu item id, or empty string when none is registered. */
export function blockMenuDescription(id: string): string {
  return BLOCK_MENU_DESCRIPTIONS[id] ?? ''
}

/**
 * Relevance score for `item` against `needle` (already lowercased, non-empty).
 * Lower = better. null when the item does not match at all.
 *
 *   0 title starts with needle   1 title contains needle
 *   2 a keyword starts with it   3 a keyword contains it
 */
function scoreMenuItem(item: BlockMenuItem, needle: string): number | null {
  const title = item.title.toLowerCase()
  if (title.startsWith(needle)) {
    return 0
  }
  if (title.includes(needle)) {
    return 1
  }

  if (item.keywords.some((keyword) => keyword.toLowerCase().startsWith(needle))) {
    return 2
  }
  if (item.keywords.some((keyword) => keyword.toLowerCase().includes(needle))) {
    return 3
  }
  return null
}

export function filterBlockMenuItems(query: string, capabilities?: BlockMenuCapabilities): BlockMenuItem[] {
  const needle = query.trim().toLowerCase()
  const available = BLOCK_MENU_ITEMS.filter(
    (item) => !DOCUMENT_FACTORY_TYPES.has(item.type) || capabilities?.canCreatePage === true,
  )
  if (!needle) {
    return available
  }

  // Score, drop non-matches, then STABLE-sort by score so equal-score items
  // keep registry order (heading 1/2/3 stay in level order, etc.).
  return available
    .map((item, index) => ({ item, index, score: scoreMenuItem(item, needle) }))
    .filter((entry): entry is { item: BlockMenuItem; index: number; score: number } => entry.score !== null)
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .map((entry) => entry.item)
}

export type BlockMenuList = {
  /** Final ordered items: recent (when query empty) followed by the main list. */
  items: BlockMenuItem[]
  /** How many leading items belong to the "Recent" section (0 when searching). */
  recentCount: number
}

/**
 * Builds the ordered slash-menu list. With an empty query, up to 3 recent items
 * (resolved from `recentIds`) are prepended as a "Recent" section above the
 * full grouped list; while searching, only the relevance-sorted matches show.
 *
 * The keyboard owner and the renderer MUST both consume this single ordering so
 * `activeIndex` stays aligned with what the user sees.
 */
export function buildBlockMenuList(
  query: string,
  capabilities?: BlockMenuCapabilities,
  recentIds: readonly string[] = [],
): BlockMenuList {
  const main = filterBlockMenuItems(query, capabilities)
  if (query.trim() !== '') {
    return { items: main, recentCount: 0 }
  }

  const byId = new Map(main.map((item) => [item.id, item]))
  const recent = recentIds
    .map((id) => byId.get(id))
    .filter((item): item is BlockMenuItem => item !== undefined)
    .slice(0, 3)

  return { items: [...recent, ...main], recentCount: recent.length }
}
