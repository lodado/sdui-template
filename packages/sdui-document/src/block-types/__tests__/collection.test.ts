import { createDocumentBlock } from '../../blocks/schema'
import { createBlockId } from '../../blocks/schema/ids'
import { collectionBlockModule, isCollectionBlock } from '../collection/collection'
import { collectionAttributesSchema } from '../collection/collection.schema'
import { blockModuleByType, COLLECTION_BLOCK_TYPE, PAGE_BLOCK_TYPE } from '../index'

const collection = (view: string, children: Parameters<typeof createDocumentBlock>[0][] = []) =>
  createDocumentBlock({ id: 'col-1', type: COLLECTION_BLOCK_TYPE, attributes: { view }, children })

const pageItem = (id: string, title: string, documentId: string) => ({
  id,
  type: PAGE_BLOCK_TYPE,
  state: { text: title },
  attributes: { documentId },
})

describe('collection block module', () => {
  test('registered under document.collection', () => {
    expect(COLLECTION_BLOCK_TYPE).toBe('document.collection')
    expect(blockModuleByType[COLLECTION_BLOCK_TYPE]).toBe(collectionBlockModule)
  })

  test('isCollectionBlock narrows by type', () => {
    expect(isCollectionBlock(collection('gallery'))).toBe(true)
    expect(isCollectionBlock(createDocumentBlock({ id: 'p', type: 'document.paragraph' }))).toBe(false)
  })

  describe('schema', () => {
    test('defaults view to gallery and properties to empty', () => {
      const parsed = collectionAttributesSchema.parse({})
      expect(parsed.view).toBe('gallery')
      expect(parsed.properties).toEqual([])
    })

    test('rejects an unknown view', () => {
      expect(collectionAttributesSchema.safeParse({ view: 'kanban' }).success).toBe(false)
    })

    test('accepts property definitions with options', () => {
      const parsed = collectionAttributesSchema.safeParse({
        view: 'board',
        groupBy: 'status',
        properties: [{ id: 'status', name: 'Status', type: 'select', options: [{ id: 'a', label: 'A' }] }],
      })
      expect(parsed.success).toBe(true)
    })
  })

  test('createDefault makes an empty gallery collection', () => {
    const block = collectionBlockModule.createDefault!(createBlockId('c1'), { view: 'board' })
    expect(block.type).toBe(COLLECTION_BLOCK_TYPE)
    expect(block.attributes?.view).toBe('board')
    expect(block.children).toEqual([])
  })

  describe('sdui mapping', () => {
    const ctx = { theme: { paragraph: 'para' } as never, mapChildren: (b: any) => b.children }

    test('toSduiNode tags the block type and view', () => {
      const node = collectionBlockModule.toSduiNode(collection('board'), ctx)
      expect(node.attributes?.['data-block-type']).toBe(COLLECTION_BLOCK_TYPE)
      expect(node.attributes?.['data-view']).toBe('board')
    })
  })

  test('toMarkdown degrades to a link list of page items', () => {
    const block = collection('gallery', [pageItem('i1', 'Project A', 'doc-a'), pageItem('i2', 'Project B', 'doc-b')])
    const md = collectionBlockModule.toMarkdown!(block, { inline: () => '', renderChildren: () => '' })
    expect(md).toBe('- [Project A](sdui-doc://doc-a)\n- [Project B](sdui-doc://doc-b)')
  })

  test('toMarkdown is empty for an empty collection', () => {
    const md = collectionBlockModule.toMarkdown!(collection('gallery'), { inline: () => '', renderChildren: () => '' })
    expect(md).toBe('')
  })
})
