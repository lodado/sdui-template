import { createDocumentBlock } from '../../blocks/schema'
import { createBlockId } from '../../blocks/schema/ids'
import { buttonBlockModule, isButtonBlock } from '../button/button'
import { blockModuleByType, BUTTON_BLOCK_TYPE, extractBlockLinks, TAGS_BLOCK_TYPE } from '../index'
import { isSafeCtaUrl } from '../shared/url'
import { isTagsBlock, tagsBlockModule } from '../tags/tags'

const UNSAFE_JS = `${'java'}${'script'}:alert(1)`

describe('isSafeCtaUrl', () => {
  test('allows http/https/mailto, blocks the rest', () => {
    expect(isSafeCtaUrl('https://x.dev')).toBe(true)
    expect(isSafeCtaUrl('mailto:a@b.com')).toBe(true)
    expect(isSafeCtaUrl(UNSAFE_JS)).toBe(false)
    expect(isSafeCtaUrl('tel:123')).toBe(false)
  })
})

describe('tags block', () => {
  const tags = (items: unknown[]) => createDocumentBlock({ id: 't', type: TAGS_BLOCK_TYPE, attributes: { items } })

  test('registered + guard + createDefault', () => {
    expect(blockModuleByType[TAGS_BLOCK_TYPE]).toBe(tagsBlockModule)
    expect(isTagsBlock(tags([]))).toBe(true)
    expect(tagsBlockModule.createDefault!(createBlockId('t1')).attributes?.items).toEqual([])
  })

  test('schema validates chip colors against the palette', () => {
    expect(
      tagsBlockModule.attributesSchema!.safeParse({ items: [{ id: 'a', label: 'React', color: 'blue' }] }).success,
    ).toBe(true)
    expect(
      tagsBlockModule.attributesSchema!.safeParse({ items: [{ id: 'a', label: 'React', color: '#fff' }] }).success,
    ).toBe(false)
  })

  test('toMarkdown lists chips as inline code', () => {
    const block = tags([
      { id: 'a', label: 'React' },
      { id: 'b', label: 'TypeScript' },
    ])
    expect(tagsBlockModule.toMarkdown!(block, { inline: () => '', renderChildren: () => '' })).toBe(
      '`React` `TypeScript`',
    )
  })
})

describe('button block', () => {
  const button = (attributes: Record<string, unknown>, text = 'Contact') =>
    createDocumentBlock({ id: 'b', type: BUTTON_BLOCK_TYPE, state: { text }, attributes })

  test('registered + guard', () => {
    expect(blockModuleByType[BUTTON_BLOCK_TYPE]).toBe(buttonBlockModule)
    expect(isButtonBlock(button({ href: 'mailto:a@b.com' }))).toBe(true)
  })

  test('schema href guard + variant default', () => {
    expect(buttonBlockModule.attributesSchema!.safeParse({ href: 'mailto:a@b.com' }).success).toBe(true)
    expect(buttonBlockModule.attributesSchema!.safeParse({ href: UNSAFE_JS }).success).toBe(false)
    expect(buttonBlockModule.attributesSchema!.parse({ href: 'https://x.dev' }).variant).toBe('primary')
  })

  test('toMarkdown + extractLinks + canHostInlineText', () => {
    const block = button({ href: 'https://x.dev' }, 'Visit')
    expect(buttonBlockModule.toMarkdown!(block, { inline: () => '', renderChildren: () => '' })).toBe(
      '[Visit](https://x.dev)',
    )
    expect(extractBlockLinks(block)).toEqual([{ href: 'https://x.dev' }])
    expect(buttonBlockModule.canHostInlineText).toBe(false)
  })
})
