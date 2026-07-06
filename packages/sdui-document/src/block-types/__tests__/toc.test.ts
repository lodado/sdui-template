import { blockModuleByType } from '../index'
import { TOC_BLOCK_TYPE } from '../toc/toc.type'

it('registers the toc block module', () => {
  const tocModule = blockModuleByType[TOC_BLOCK_TYPE]
  expect(tocModule).toBeDefined()
  expect(tocModule.createDefault?.('t1' as any)).toEqual({ id: 't1', type: 'document.toc' })
})

it('toc exports no markdown content', () => {
  expect(blockModuleByType[TOC_BLOCK_TYPE].toMarkdown?.({ id: 't', type: 'document.toc' } as any, {} as any)).toBe('')
})
