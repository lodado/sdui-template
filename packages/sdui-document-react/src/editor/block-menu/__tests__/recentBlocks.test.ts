import { getRecentBlockIds, recordRecentBlock } from '../recentBlocks'

describe('recentBlocks', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  test('records newest first and dedupes', () => {
    recordRecentBlock('heading-1')
    recordRecentBlock('quote')
    recordRecentBlock('heading-1')
    expect(getRecentBlockIds()).toEqual(['heading-1', 'quote'])
  })

  test('caps at 3 entries', () => {
    recordRecentBlock('a')
    recordRecentBlock('b')
    recordRecentBlock('c')
    recordRecentBlock('d')
    expect(getRecentBlockIds()).toEqual(['d', 'c', 'b'])
  })

  test('returns empty list when nothing stored', () => {
    expect(getRecentBlockIds()).toEqual([])
  })

  test('tolerates corrupt storage', () => {
    window.localStorage.setItem('sdui-doc:recent-blocks', '{not json')
    expect(getRecentBlockIds()).toEqual([])
  })
})
