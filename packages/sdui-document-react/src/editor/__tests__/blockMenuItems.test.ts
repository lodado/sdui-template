import { BLOCK_MENU_ITEMS, filterBlockMenuItems } from '../block-menu/blockMenuItems'

describe('blockMenuItems', () => {
  test('registry covers all supported block types', () => {
    expect(BLOCK_MENU_ITEMS.map((item) => item.id)).toEqual([
      'paragraph',
      'heading-1',
      'heading-2',
      'heading-3',
      'checklist',
      'callout',
      'divider',
      'image',
      'file',
      'link',
    ])
  })

  test('empty query returns everything', () => {
    expect(filterBlockMenuItems('')).toHaveLength(BLOCK_MENU_ITEMS.length)
  })

  test('filters by english keyword, case-insensitive', () => {
    const ids = filterBlockMenuItems('HeAd').map((item) => item.id)
    expect(ids).toEqual(['heading-1', 'heading-2', 'heading-3'])
  })

  test('filters by korean keyword', () => {
    expect(filterBlockMenuItems('제목').map((item) => item.id)).toEqual(['heading-1', 'heading-2', 'heading-3'])
    expect(filterBlockMenuItems('이미지').map((item) => item.id)).toEqual(['image'])
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
