import { createDocumentBlock } from '../../blocks/schema'
import { createBlockId } from '../../blocks/schema/ids'
import { bookmarkBlockModule, isBookmarkBlock } from '../bookmark/bookmark'
import { embedBlockModule } from '../embed/embed'
import { blockModuleByType, BOOKMARK_BLOCK_TYPE, EMBED_BLOCK_TYPE, extractBlockLinks, VIDEO_BLOCK_TYPE } from '../index'
import { isSafeHttpUrl, parseVideoUrl, videoEmbedUrl, videoThumbnailUrl } from '../shared/url'
import { videoBlockModule } from '../video/video'

// Assembled to dodge the no-script-url lint rule (a literal would be flagged as eval).
const UNSAFE_JS_URL = `${'java'}${'script'}:alert(1)`
const UNSAFE_JS_SHORT = `${'java'}${'script'}:x`

describe('isSafeHttpUrl', () => {
  test('accepts http/https, rejects everything else', () => {
    expect(isSafeHttpUrl('https://x.dev')).toBe(true)
    expect(isSafeHttpUrl('http://x.dev')).toBe(true)
    expect(isSafeHttpUrl(UNSAFE_JS_URL)).toBe(false)
    expect(isSafeHttpUrl('data:text/html,x')).toBe(false)
    expect(isSafeHttpUrl('ftp://x.dev')).toBe(false)
    expect(isSafeHttpUrl('not a url')).toBe(false)
    expect(isSafeHttpUrl(42)).toBe(false)
  })
})

describe('parseVideoUrl', () => {
  test.each([
    ['https://www.youtube.com/watch?v=abc123', 'youtube', 'abc123'],
    ['https://youtu.be/abc123', 'youtube', 'abc123'],
    ['https://www.youtube.com/shorts/xyz789', 'youtube', 'xyz789'],
    ['https://youtube.com/embed/emb456', 'youtube', 'emb456'],
    ['https://vimeo.com/123456789', 'vimeo', '123456789'],
  ])('parses %s', (url, provider, videoId) => {
    expect(parseVideoUrl(url)).toEqual({ provider, videoId })
  })

  test('rejects non-video and unsafe URLs', () => {
    expect(parseVideoUrl('https://example.com/watch?v=x')).toBeUndefined()
    expect(parseVideoUrl('https://www.youtube.com/')).toBeUndefined()
    expect(parseVideoUrl(UNSAFE_JS_URL)).toBeUndefined()
  })

  test('builds privacy embed + thumbnail urls', () => {
    expect(videoEmbedUrl({ provider: 'youtube', videoId: 'abc' })).toBe('https://www.youtube-nocookie.com/embed/abc')
    expect(videoEmbedUrl({ provider: 'vimeo', videoId: '123' })).toBe('https://player.vimeo.com/video/123')
    expect(videoThumbnailUrl({ provider: 'youtube', videoId: 'abc' })).toBe('https://i.ytimg.com/vi/abc/hqdefault.jpg')
    expect(videoThumbnailUrl({ provider: 'vimeo', videoId: '123' })).toBeUndefined()
  })
})

describe('embed-family registry', () => {
  test('all three registered', () => {
    expect(blockModuleByType[BOOKMARK_BLOCK_TYPE]).toBe(bookmarkBlockModule)
    expect(blockModuleByType[VIDEO_BLOCK_TYPE]).toBe(videoBlockModule)
    expect(blockModuleByType[EMBED_BLOCK_TYPE]).toBe(embedBlockModule)
  })
})

describe('bookmark block', () => {
  const bookmark = (attributes: Record<string, unknown>) =>
    createDocumentBlock({ id: 'bm', type: BOOKMARK_BLOCK_TYPE, attributes })

  test('schema rejects unsafe url', () => {
    expect(bookmarkBlockModule.attributesSchema!.safeParse({ url: 'https://x.dev' }).success).toBe(true)
    expect(bookmarkBlockModule.attributesSchema!.safeParse({ url: UNSAFE_JS_URL }).success).toBe(false)
  })

  test('isBookmarkBlock + createDefault', () => {
    expect(isBookmarkBlock(bookmark({ url: 'https://x.dev' }))).toBe(true)
    const created = bookmarkBlockModule.createDefault!(createBlockId('b1'), { url: 'https://x.dev' })
    expect(created.attributes?.url).toBe('https://x.dev')
  })

  test('toMarkdown + extractLinks', () => {
    const block = bookmark({ url: 'https://x.dev', title: 'X' })
    expect(bookmarkBlockModule.toMarkdown!(block, { inline: () => '', renderChildren: () => '' })).toBe(
      '[X](https://x.dev)',
    )
    expect(extractBlockLinks(block)).toEqual([{ href: 'https://x.dev' }])
    expect(extractBlockLinks(bookmark({ url: UNSAFE_JS_SHORT }))).toEqual([])
  })

  test('round-trips through sdui node', () => {
    const ctx = { theme: { paragraph: 'p' } as never, mapChildren: () => undefined }
    const node = bookmarkBlockModule.toSduiNode(bookmark({ url: 'https://x.dev', title: 'X' }), ctx)
    expect(node.attributes?.['data-block-type']).toBe(BOOKMARK_BLOCK_TYPE)
    const back = bookmarkBlockModule.fromSduiNode(node, { id: createBlockId('bm') })
    expect(back.attributes?.url).toBe('https://x.dev')
    expect(back.attributes?.['data-block-type']).toBeUndefined()
  })
})

describe('video + embed schemas', () => {
  test('video requires provider + videoId', () => {
    expect(
      videoBlockModule.attributesSchema!.safeParse({ url: 'https://youtu.be/x', provider: 'youtube', videoId: 'x' })
        .success,
    ).toBe(true)
    expect(
      videoBlockModule.attributesSchema!.safeParse({ url: 'https://youtu.be/x', provider: 'youtube' }).success,
    ).toBe(false)
  })

  test('embed clamps height range', () => {
    expect(embedBlockModule.attributesSchema!.safeParse({ url: 'https://x.dev', height: 400 }).success).toBe(true)
    expect(embedBlockModule.attributesSchema!.safeParse({ url: 'https://x.dev', height: 50 }).success).toBe(false)
    expect(embedBlockModule.attributesSchema!.parse({ url: 'https://x.dev' }).height).toBe(400)
  })
})
