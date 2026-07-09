import { BLOCK_MENU_ITEMS, filterBlockMenuItems } from '../block-menu/blockMenuItems'

describe('blockMenuItems', () => {
  test('registry covers all supported block types', () => {
    expect(BLOCK_MENU_ITEMS.map((item) => item.id)).toEqual([
      'paragraph',
      'heading-1',
      'heading-2',
      'heading-3',
      'checklist',
      'bulleted-list',
      'numbered-list',
      'toggle',
      'quote',
      'callout',
      'divider',
      'code',
      'image',
      'file',
      'link',
      'toc',
      'page',
    ])
  })

  test('offers a table of contents item', () => {
    expect(filterBlockMenuItems('contents').map((item) => item.type)).toContain('document.toc')
    expect(filterBlockMenuItems('목차').map((item) => item.type)).toContain('document.toc')
  })

  test.each([
    ['bulleted', 'document.bulleted-list'],
    ['numbered', 'document.numbered-list'],
    ['toggle', 'document.toggle'],
    ['quote', 'document.quote'],
    ['code', 'document.code'],
  ])('query "%s" surfaces %s', (query, expectedType) => {
    expect(filterBlockMenuItems(query).map((item) => item.type)).toContain(expectedType)
  })

  test('korean keywords surface the new items', () => {
    expect(filterBlockMenuItems('글머리').map((item) => item.type)).toContain('document.bulleted-list')
    expect(filterBlockMenuItems('번호').map((item) => item.type)).toContain('document.numbered-list')
    expect(filterBlockMenuItems('토글').map((item) => item.type)).toContain('document.toggle')
    expect(filterBlockMenuItems('인용').map((item) => item.type)).toContain('document.quote')
    expect(filterBlockMenuItems('코드').map((item) => item.type)).toContain('document.code')
  })

  test('empty query returns everything except capability-gated items', () => {
    // page needs onCreatePage — hidden by default
    expect(filterBlockMenuItems('')).toHaveLength(BLOCK_MENU_ITEMS.length - 1)
    expect(filterBlockMenuItems('', { canCreatePage: true })).toHaveLength(BLOCK_MENU_ITEMS.length)
  })

  test('page item is capability-gated', () => {
    expect(filterBlockMenuItems('page').map((item) => item.id)).toEqual([])
    expect(filterBlockMenuItems('page', { canCreatePage: true }).map((item) => item.id)).toContain('page')
    expect(filterBlockMenuItems('페이지', { canCreatePage: true }).map((item) => item.id)).toContain('page')
  })

  test('filters by english keyword, case-insensitive', () => {
    const ids = filterBlockMenuItems('HeAd').map((item) => item.id)
    expect(ids).toEqual(['heading-1', 'heading-2', 'heading-3'])
  })

  test('filters by korean keyword', () => {
    expect(filterBlockMenuItems('제목').map((item) => item.id)).toEqual(['heading-1', 'heading-2', 'heading-3'])
    expect(filterBlockMenuItems('이미지').map((item) => item.id)).toEqual(['image'])
  })

  test('numbered korean heading aliases target a single level', () => {
    expect(filterBlockMenuItems('제목1').map((item) => item.id)).toEqual(['heading-1'])
    expect(filterBlockMenuItems('제목2').map((item) => item.id)).toEqual(['heading-2'])
    expect(filterBlockMenuItems('제목3').map((item) => item.id)).toEqual(['heading-3'])
  })

  test('no match returns empty list', () => {
    expect(filterBlockMenuItems('zzzz')).toEqual([])
  })

  test('heading items carry level attribute and image/file/link carry non-insert actions', () => {
    expect(BLOCK_MENU_ITEMS.find((item) => item.id === 'heading-2')?.attributes).toEqual({ level: 2 })
    expect(BLOCK_MENU_ITEMS.find((item) => item.id === 'image')?.action).toBe('file')
    expect(BLOCK_MENU_ITEMS.find((item) => item.id === 'file')?.action).toBe('file')
    expect(BLOCK_MENU_ITEMS.find((item) => item.id === 'link')?.action).toBe('link')
  })
})
