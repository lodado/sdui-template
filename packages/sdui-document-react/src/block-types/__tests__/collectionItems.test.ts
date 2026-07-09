import { COLLECTION_BLOCK_TYPE, createDocumentBlock, PAGE_BLOCK_TYPE } from '@lodado/sdui-document'

import { collectionConfig, collectionItems } from '../collection/items'

const collection = createDocumentBlock({
  id: 'col',
  type: COLLECTION_BLOCK_TYPE,
  attributes: {
    view: 'list',
    properties: [{ id: 'status', name: 'Status', type: 'select', options: [] }],
  },
  children: [
    {
      id: 'i1',
      type: PAGE_BLOCK_TYPE,
      state: { text: 'Project A' },
      attributes: { documentId: 'doc-a', icon: '🚀', properties: { status: 'active' } },
    },
    { id: 'note', type: 'document.paragraph', state: { text: 'ignored' } },
    { id: 'i2', type: PAGE_BLOCK_TYPE, state: { text: '' }, attributes: { documentId: 'doc-b' } },
  ],
})

describe('collectionItems', () => {
  test('extracts only page children with defaults', () => {
    const items = collectionItems(collection)
    expect(items).toHaveLength(2)
    expect(items[0]).toMatchObject({ id: 'i1', documentId: 'doc-a', title: 'Project A', icon: '🚀' })
    expect(items[0].properties).toEqual({ status: 'active' })
    expect(items[1]).toMatchObject({ id: 'i2', documentId: 'doc-b', title: 'Untitled' })
    expect(items[1].properties).toEqual({})
  })
})

describe('collectionConfig', () => {
  test('reads view + properties with defaults', () => {
    expect(collectionConfig(collection).view).toBe('list')
    expect(collectionConfig(collection).properties).toHaveLength(1)
    const bare = createDocumentBlock({ id: 'c2', type: COLLECTION_BLOCK_TYPE })
    expect(collectionConfig(bare).view).toBe('gallery')
    expect(collectionConfig(bare).properties).toEqual([])
  })
})
