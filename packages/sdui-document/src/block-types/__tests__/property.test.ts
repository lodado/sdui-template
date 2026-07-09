import {
  groupByProperty,
  NO_GROUP_KEY,
  parsePropertyValue,
  type PropertyDef,
  sortByProperty,
} from '../collection/property'

const selectDef: PropertyDef = {
  id: 'status',
  name: 'Status',
  type: 'select',
  options: [
    { id: 'active', label: 'Active', color: 'green' },
    { id: 'done', label: 'Done', color: 'gray' },
  ],
}

describe('parsePropertyValue', () => {
  test('text/url/select pass strings through, reject non-strings', () => {
    expect(parsePropertyValue({ id: 't', name: 'T', type: 'text' }, 'hi')).toBe('hi')
    expect(parsePropertyValue({ id: 't', name: 'T', type: 'text' }, 42)).toBeUndefined()
    expect(parsePropertyValue(selectDef, 'active')).toBe('active')
  })

  test('multiSelect keeps only string entries', () => {
    const def: PropertyDef = { id: 'tags', name: 'Tags', type: 'multiSelect' }
    expect(parsePropertyValue(def, ['a', 2, 'b'])).toEqual(['a', 'b'])
    expect(parsePropertyValue(def, 'a')).toBeUndefined()
  })

  test('dateRange requires a start', () => {
    const def: PropertyDef = { id: 'period', name: 'Period', type: 'dateRange' }
    expect(parsePropertyValue(def, { start: '2020-01-01', end: '2021-01-01' })).toEqual({
      start: '2020-01-01',
      end: '2021-01-01',
    })
    expect(parsePropertyValue(def, { end: '2021-01-01' })).toBeUndefined()
  })

  test('absent value is undefined', () => {
    expect(parsePropertyValue({ id: 't', name: 'T', type: 'text' }, undefined)).toBeUndefined()
    expect(parsePropertyValue({ id: 't', name: 'T', type: 'text' }, null)).toBeUndefined()
  })
})

describe('sortByProperty', () => {
  const dateDef: PropertyDef = { id: 'd', name: 'D', type: 'date' }
  const items = [
    { id: 'a', d: '2022-05-01' },
    { id: 'b', d: '2020-01-01' },
    { id: 'c', d: '2021-03-01' },
  ]

  test('sorts dates ascending and descending', () => {
    expect(sortByProperty(items, dateDef, 'asc', (i) => i.d).map((i) => i.id)).toEqual(['b', 'c', 'a'])
    expect(sortByProperty(items, dateDef, 'desc', (i) => i.d).map((i) => i.id)).toEqual(['a', 'c', 'b'])
  })

  test('is stable for equal keys and puts empty dates last', () => {
    const withEmpty = [
      { id: 'x', d: undefined },
      { id: 'y', d: '2020-01-01' },
      { id: 'z', d: undefined },
    ]
    expect(sortByProperty(withEmpty, dateDef, 'asc', (i) => i.d).map((i) => i.id)).toEqual(['y', 'x', 'z'])
  })
})

describe('groupByProperty', () => {
  const items = [
    { id: 'a', status: 'active' },
    { id: 'b', status: 'done' },
    { id: 'c', status: 'active' },
    { id: 'd', status: undefined },
    { id: 'e', status: 'unknown-option' },
  ]

  test('buckets by select option order, empty/unknown last', () => {
    const groups = groupByProperty(items, selectDef, (i) => i.status)
    expect(groups.map((g) => g.key)).toEqual(['active', 'done', NO_GROUP_KEY])
    expect(groups[0].items.map((i) => i.id)).toEqual(['a', 'c'])
    expect(groups[1].items.map((i) => i.id)).toEqual(['b'])
    expect(groups[2].items.map((i) => i.id)).toEqual(['d', 'e'])
    expect(groups[0].option?.label).toBe('Active')
  })

  test('non-select defs group everything under NO_GROUP_KEY', () => {
    const textDef: PropertyDef = { id: 't', name: 'T', type: 'text' }
    const groups = groupByProperty(items, textDef, (i) => i.status)
    expect(groups).toHaveLength(1)
    expect(groups[0].key).toBe(NO_GROUP_KEY)
    expect(groups[0].items).toHaveLength(5)
  })
})
