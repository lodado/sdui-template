import { createDocumentBlock } from '../../blocks/schema'
import {
  BLOCK_TYPE_MODULES,
  BOOKMARK_BLOCK_TYPE,
  BULLETED_LIST_BLOCK_TYPE,
  CALLOUT_BLOCK_TYPE,
  canHostInlineText,
  CHECKLIST_BLOCK_TYPE,
  CODE_BLOCK_TYPE,
  COLLECTION_BLOCK_TYPE,
  COLUMN_BLOCK_TYPE,
  COLUMN_LIST_BLOCK_TYPE,
  DIVIDER_BLOCK_TYPE,
  EMBED_BLOCK_TYPE,
  extractBlockLinks,
  FILE_BLOCK_TYPE,
  HEADING_BLOCK_TYPE,
  IMAGE_BLOCK_TYPE,
  LINK_BLOCK_TYPE,
  NUMBERED_LIST_BLOCK_TYPE,
  PAGE_BLOCK_TYPE,
  PARAGRAPH_BLOCK_TYPE,
  QUOTE_BLOCK_TYPE,
  ROOT_BLOCK_TYPE,
  TOC_BLOCK_TYPE,
  TOGGLE_BLOCK_TYPE,
  VIDEO_BLOCK_TYPE,
} from '../index'

const make = (type: string, attributes?: Record<string, unknown>) => createDocumentBlock({ id: 'b', type, attributes })

describe('block-type constants', () => {
  test('every registry module type is covered by an exported constant', () => {
    const constants = new Set([
      ROOT_BLOCK_TYPE,
      PARAGRAPH_BLOCK_TYPE,
      HEADING_BLOCK_TYPE,
      BULLETED_LIST_BLOCK_TYPE,
      NUMBERED_LIST_BLOCK_TYPE,
      CHECKLIST_BLOCK_TYPE,
      DIVIDER_BLOCK_TYPE,
      CALLOUT_BLOCK_TYPE,
      QUOTE_BLOCK_TYPE,
      TOGGLE_BLOCK_TYPE,
      CODE_BLOCK_TYPE,
      IMAGE_BLOCK_TYPE,
      FILE_BLOCK_TYPE,
      LINK_BLOCK_TYPE,
      COLUMN_LIST_BLOCK_TYPE,
      COLUMN_BLOCK_TYPE,
      TOC_BLOCK_TYPE,
      PAGE_BLOCK_TYPE,
      COLLECTION_BLOCK_TYPE,
      BOOKMARK_BLOCK_TYPE,
      VIDEO_BLOCK_TYPE,
      EMBED_BLOCK_TYPE,
    ])
    const moduleTypes = new Set(BLOCK_TYPE_MODULES.map((blockModule) => blockModule.type))
    expect(moduleTypes).toEqual(constants)
  })
})

describe('canHostInlineText capability', () => {
  test.each([
    [PARAGRAPH_BLOCK_TYPE, true],
    [HEADING_BLOCK_TYPE, true],
    [CHECKLIST_BLOCK_TYPE, true],
    [CALLOUT_BLOCK_TYPE, true],
    [ROOT_BLOCK_TYPE, false],
    [DIVIDER_BLOCK_TYPE, false],
    [IMAGE_BLOCK_TYPE, false],
    [FILE_BLOCK_TYPE, false],
    [LINK_BLOCK_TYPE, false],
    [COLUMN_LIST_BLOCK_TYPE, false],
    [COLUMN_BLOCK_TYPE, false],
  ])('%s -> %s', (type, expected) => {
    expect(canHostInlineText(make(type))).toBe(expected)
  })

  test('unknown block types default to true', () => {
    expect(canHostInlineText(make('custom.block'))).toBe(true)
  })
})

describe('extractBlockLinks capability', () => {
  test('link blocks expose href and targetDocumentId', () => {
    const block = make(LINK_BLOCK_TYPE, { href: '/docs/x', targetDocumentId: 'doc-x' })
    expect(extractBlockLinks(block)).toEqual([{ href: '/docs/x', targetDocumentId: 'doc-x' }])
  })

  test('non-link blocks contribute no links', () => {
    expect(extractBlockLinks(make(PARAGRAPH_BLOCK_TYPE))).toEqual([])
  })
})
