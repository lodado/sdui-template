import { blockMenuDescription, buildBlockMenuList, filterBlockMenuItems } from '../blockMenuItems'

describe('filterBlockMenuItems relevance', () => {
  test('title-prefix ranks above title-substring', () => {
    // "List view" (title starts with "list") should beat "Bulleted list" (contains).
    const ids = filterBlockMenuItems('list', { canCreatePage: true }).map((item) => item.id)
    expect(ids.indexOf('collection-list')).toBeLessThan(ids.indexOf('bulleted-list'))
  })

  test('equal-score matches keep registry order', () => {
    // all three headings match keyword "heading" as a substring → registry order
    expect(filterBlockMenuItems('heading').map((item) => item.id)).toEqual(['heading-1', 'heading-2', 'heading-3'])
  })

  test('no match returns empty', () => {
    expect(filterBlockMenuItems('zzzz')).toEqual([])
  })
})

describe('buildBlockMenuList', () => {
  test('empty query prepends recent items and reports the count', () => {
    const list = buildBlockMenuList('', { canCreatePage: true }, ['quote', 'code'])
    expect(list.recentCount).toBe(2)
    expect(list.items.slice(0, 2).map((item) => item.id)).toEqual(['quote', 'code'])
    // recent items are duplicated: still present later in their own group
    expect(list.items.filter((item) => item.id === 'quote').length).toBe(2)
  })

  test('unknown recent ids are dropped', () => {
    const list = buildBlockMenuList('', { canCreatePage: true }, ['does-not-exist', 'quote'])
    expect(list.recentCount).toBe(1)
    expect(list.items[0].id).toBe('quote')
  })

  test('a query suppresses the recent section', () => {
    const list = buildBlockMenuList('quote', { canCreatePage: true }, ['quote', 'code'])
    expect(list.recentCount).toBe(0)
    expect(list.items.map((item) => item.id)).toEqual(['quote'])
  })
})

describe('blockMenuDescription', () => {
  test('returns a description for known items', () => {
    expect(blockMenuDescription('heading-1')).toMatch(/heading/i)
  })

  test('returns empty string for unknown ids', () => {
    expect(blockMenuDescription('nope')).toBe('')
  })
})
