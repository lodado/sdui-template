import { createDocumentBlock } from '../../blocks/schema'
import { createBlockId } from '../../blocks/schema/ids'
import { blockModuleByType, extractBlockLinks, PAGE_BLOCK_TYPE } from '../index'
import { isPageBlock, pageBlockModule } from '../page/page'
import { pageAttributesSchema } from '../page/page.schema'

const make = (attributes?: Record<string, unknown>, text = 'Project A') =>
  createDocumentBlock({ id: 'page-1', type: PAGE_BLOCK_TYPE, state: { text }, attributes })

describe('page block module', () => {
  test('registered in the registry under document.page', () => {
    expect(PAGE_BLOCK_TYPE).toBe('document.page')
    expect(blockModuleByType[PAGE_BLOCK_TYPE]).toBe(pageBlockModule)
  })

  test('is a leaf that cannot host inline text', () => {
    expect(pageBlockModule.canHostInlineText).toBe(false)
  })

  test('isPageBlock narrows by type', () => {
    expect(isPageBlock(make({ documentId: 'doc-a' }))).toBe(true)
    expect(isPageBlock(createDocumentBlock({ id: 'p', type: 'document.paragraph' }))).toBe(false)
  })

  describe('attributes schema', () => {
    test('requires a non-empty documentId', () => {
      expect(pageAttributesSchema.safeParse({ documentId: 'doc-a' }).success).toBe(true)
      expect(pageAttributesSchema.safeParse({ documentId: '' }).success).toBe(false)
      expect(pageAttributesSchema.safeParse({}).success).toBe(false)
    })

    test('icon and coverUrl are optional', () => {
      const parsed = pageAttributesSchema.safeParse({
        documentId: 'doc-a',
        icon: '🚀',
        coverUrl: 'https://x.dev/c.png',
      })
      expect(parsed.success).toBe(true)
    })
  })

  describe('createDefault', () => {
    test('creates an empty-title page carrying provided attributes', () => {
      const block = pageBlockModule.createDefault!(createBlockId('p1'), { documentId: 'doc-a' })
      expect(block.type).toBe(PAGE_BLOCK_TYPE)
      expect(block.state?.text).toBe('')
      expect(block.attributes).toEqual({ documentId: 'doc-a' })
    })
  })

  describe('sdui mapping', () => {
    const ctx = {
      theme: { paragraph: 'para-class' } as never,
      mapChildren: () => undefined,
    }

    test('toSduiNode emits a leaf Div tagged with the block type and target document', () => {
      const node = pageBlockModule.toSduiNode(make({ documentId: 'doc-a', icon: '🚀' }), ctx)
      expect(node.attributes?.['data-block-type']).toBe(PAGE_BLOCK_TYPE)
      expect(node.attributes?.documentId).toBe('doc-a')
      expect(node.attributes?.icon).toBe('🚀')
      expect(node.state?.text).toBe('Project A')
      expect(node.children).toBeUndefined()
    })

    test('fromSduiNode round-trips attributes and title', () => {
      const node = pageBlockModule.toSduiNode(make({ documentId: 'doc-a' }), ctx)
      const back = pageBlockModule.fromSduiNode(node, { id: createBlockId('page-1') })
      expect(back.type).toBe(PAGE_BLOCK_TYPE)
      expect(back.state?.text).toBe('Project A')
      expect(back.attributes?.documentId).toBe('doc-a')
      expect(back.attributes?.['data-block-type']).toBeUndefined()
    })
  })

  test('extractLinks contributes the target document to the link index', () => {
    expect(extractBlockLinks(make({ documentId: 'doc-a' }))).toEqual([{ targetDocumentId: 'doc-a' }])
    expect(extractBlockLinks(make({}))).toEqual([])
  })

  describe('markdown', () => {
    test('serializes as a sdui-doc link with the title', () => {
      const md = pageBlockModule.toMarkdown!(make({ documentId: 'doc-a' }), {
        inline: () => 'Project A',
        renderChildren: () => '',
      })
      expect(md).toBe('[Project A](sdui-doc://doc-a)')
    })

    test('falls back to Untitled when the title is empty', () => {
      const md = pageBlockModule.toMarkdown!(make({ documentId: 'doc-a' }, ''), {
        inline: () => '',
        renderChildren: () => '',
      })
      expect(md).toBe('[Untitled](sdui-doc://doc-a)')
    })
  })
})
