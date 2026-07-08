import type { SduiDocumentBlock, SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'

import {
  blockAttrsPatch,
  computeApplyMenuType,
  computeIndent,
  computeInsertBlockBelow,
  computeInsertToggleChild,
  computeMergeBackward,
  computeMoveBlock,
  computeNavigate,
  computeOutdent,
  computeSplit,
  computeTurnInto,
  orderedTextBlocks,
} from '../handlerLogic'

function doc(children: SduiDocumentBlock[]): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({ id: 'root', type: 'document.root', children }),
  }
}

function idSeq(...ids: string[]) {
  const queue = [...ids]
  const thunk = jest.fn(() => queue.shift() ?? 'gen-x')

  return thunk
}

const paragraph = (id: string, text: string) => createDocumentBlock({ id, type: 'document.paragraph', state: { text } })

describe('computeSplit (Notion Enter policy)', () => {
  describe('as is: EMPTY list-like block', () => {
    it.each(['document.bulleted-list', 'document.numbered-list', 'document.checklist'])(
      'to be: %s converts to paragraph in place, no id consumed',
      (type) => {
        const nextBlockId = idSeq('n1')
        const decision = computeSplit(doc([createDocumentBlock({ id: 'b1', type, state: { text: '' } })]), {
          blockId: 'b1',
          offset: 0,
          nextBlockId,
        })

        expect(decision.patches).toEqual([{ type: 'block.setType', blockId: 'b1', blockType: 'document.paragraph' }])
        expect(decision.focus).toEqual({ blockId: 'b1', caret: 'start' })
        expect(nextBlockId).not.toHaveBeenCalled()
      },
    )
  })

  describe('as is: toggle summary', () => {
    it('to be: expands collapsed toggle and inserts first child, focus lands in child', () => {
      const decision = computeSplit(
        doc([
          createDocumentBlock({
            id: 't1',
            type: 'document.toggle',
            state: { text: 'summary' },
            attributes: { collapsed: true },
          }),
        ]),
        { blockId: 't1', offset: 3, nextBlockId: idSeq('c1') },
      )

      expect(decision.patches).toEqual([
        { type: 'block.update', blockId: 't1', attributes: { collapsed: false } },
        expect.objectContaining({ type: 'block.insert', parentId: 't1', after: null }),
      ])
      expect(decision.focus).toEqual({ blockId: 'c1', caret: 'start', justInserted: true })
    })

    it('to be: expanded toggle skips the collapse patch', () => {
      const decision = computeSplit(
        doc([createDocumentBlock({ id: 't1', type: 'document.toggle', state: { text: 'summary' } })]),
        { blockId: 't1', offset: 0, nextBlockId: idSeq('c1') },
      )

      expect(decision.patches).toHaveLength(1)
      expect(decision.patches[0]).toEqual(expect.objectContaining({ type: 'block.insert', parentId: 't1' }))
    })
  })

  describe('as is: plain split', () => {
    it.each([
      ['document.heading', true],
      ['document.quote', true],
      ['document.paragraph', false],
      ['document.bulleted-list', false],
    ])('to be: %s continuation becomes paragraph? %s', (type, convertsToParagraph) => {
      const decision = computeSplit(doc([createDocumentBlock({ id: 'b1', type, state: { text: 'hello' } })]), {
        blockId: 'b1',
        offset: 2,
        nextBlockId: idSeq('n1'),
      })

      expect(decision.patches[0]).toEqual({ type: 'block.split', blockId: 'b1', offset: 2, newBlockId: 'n1' })
      if (convertsToParagraph) {
        expect(decision.patches[1]).toEqual({
          type: 'block.setType',
          blockId: 'n1',
          blockType: 'document.paragraph',
        })
      } else {
        expect(decision.patches).toHaveLength(1)
      }
      expect(decision.focus).toEqual({ blockId: 'n1', caret: 'start', justInserted: true })
    })
  })
})

describe('computeMergeBackward (Notion Backspace policy)', () => {
  it('to be: list-like/quote strips its type first (no merge yet)', () => {
    const decision = computeMergeBackward(
      doc([paragraph('p0', 'above'), createDocumentBlock({ id: 'q1', type: 'document.quote', state: { text: 'x' } })]),
      'q1',
    )

    expect(decision.patches).toEqual([{ type: 'block.setType', blockId: 'q1', blockType: 'document.paragraph' }])
    expect(decision.focus).toEqual({ blockId: 'q1', caret: 'start' })
  })

  it('to be: paragraph merges into previous text block, caret at join offset', () => {
    const decision = computeMergeBackward(doc([paragraph('p0', 'above'), paragraph('p1', 'below')]), 'p1')

    expect(decision.patches).toEqual([{ type: 'block.merge', blockId: 'p1', intoBlockId: 'p0' }])
    expect(decision.focus).toEqual({ blockId: 'p0', caret: 5 }) // 'above'.length
  })

  it('to be: first block has nowhere to merge — refocus only, zero patches', () => {
    const decision = computeMergeBackward(doc([paragraph('p0', 'only')]), 'p0')

    expect(decision.patches).toEqual([])
    expect(decision.focus).toEqual({ blockId: 'p0', caret: 'start' })
  })
})

describe('computeIndent / computeOutdent', () => {
  it('indent: moves block under its previous sibling', () => {
    const decision = computeIndent(doc([paragraph('p0', 'a'), paragraph('p1', 'b')]), 'p1')

    expect(decision.patches).toEqual([expect.objectContaining({ type: 'block.move', blockId: 'p1', parentId: 'p0' })])
    expect(decision.focus).toEqual({ blockId: 'p1', caret: 'start' })
  })

  it('indent: first sibling has no previous — refocus only', () => {
    const decision = computeIndent(doc([paragraph('p0', 'a')]), 'p0')

    expect(decision.patches).toEqual([])
  })

  it('outdent: nested block moves to be its parent’s next sibling', () => {
    const decision = computeOutdent(
      doc([
        createDocumentBlock({
          id: 'p0',
          type: 'document.paragraph',
          state: { text: 'a' },
          children: [paragraph('p1', 'b')],
        }),
      ]),
      'p1',
    )

    expect(decision.patches).toEqual([expect.objectContaining({ type: 'block.move', blockId: 'p1', parentId: 'root' })])
  })

  it('outdent: top-level block cannot outdent — refocus only', () => {
    const decision = computeOutdent(doc([paragraph('p0', 'a')]), 'p0')

    expect(decision.patches).toEqual([])
  })
})

describe('computeNavigate', () => {
  const content = doc([paragraph('p0', 'a'), paragraph('p1', 'b')])

  it.each([
    ['up from p1 lands at end of p0', 'p1', 'up', { blockId: 'p0', caret: 'end' }],
    ['down from p0 lands at start of p1', 'p0', 'down', { blockId: 'p1', caret: 'start' }],
    ['up from first block stays (caret start)', 'p0', 'up', { blockId: 'p0', caret: 'start' }],
    ['down from last block stays (caret end)', 'p1', 'down', { blockId: 'p1', caret: 'end' }],
  ] as const)('%s', (_name, blockId, direction, focus) => {
    expect(computeNavigate(content, blockId, direction)).toEqual({ patches: [], focus })
  })
})

describe('computeMoveBlock', () => {
  const content = doc([paragraph('p0', 'a'), paragraph('p1', 'b')])

  it('to be: swaps with adjacent sibling', () => {
    expect(computeMoveBlock(content, 'p1', 'up')?.patches).toEqual([
      expect.objectContaining({ type: 'block.move', blockId: 'p1', parentId: 'root' }),
    ])
  })

  it('to be: null at the boundary (no-op)', () => {
    expect(computeMoveBlock(content, 'p0', 'up')).toBeNull()
    expect(computeMoveBlock(content, 'p1', 'down')).toBeNull()
  })
})

describe('computeTurnInto', () => {
  it('text type: setType patch, no block selection', () => {
    const decision = computeTurnInto(doc([paragraph('p0', 'a')]), 'p0', 'document.heading', { level: 2 })

    expect(decision.patches).toEqual([
      { type: 'block.setType', blockId: 'p0', blockType: 'document.heading', attributes: { level: 2 } },
    ])
    expect(decision.selectBlockId).toBeUndefined()
  })

  it('non-text type: ends the inline session via block selection intent', () => {
    const decision = computeTurnInto(doc([paragraph('p0', 'a')]), 'p0', 'document.divider')

    expect(decision.selectBlockId).toBe('p0')
  })
})

describe('computeApplyMenuType (block menu)', () => {
  it('empty block converts in place — no id consumed', () => {
    const nextBlockId = idSeq('n1')
    const applied = computeApplyMenuType(doc([paragraph('p0', '')]), {
      blockId: 'p0',
      type: 'document.heading',
      attributes: { level: 1 },
      nextBlockId,
    })

    expect(applied?.targetId).toBe('p0')
    expect(applied?.patches[0]).toEqual(
      expect.objectContaining({ type: 'block.setType', blockId: 'p0', blockType: 'document.heading' }),
    )
    expect(nextBlockId).not.toHaveBeenCalled()
  })

  it('empty block with extraState appends a block.update patch', () => {
    const applied = computeApplyMenuType(doc([paragraph('p0', '')]), {
      blockId: 'p0',
      type: 'document.image',
      extraState: { upload: 'uploading' },
      nextBlockId: idSeq(),
    })

    expect(applied?.patches[1]).toEqual({ type: 'block.update', blockId: 'p0', state: { upload: 'uploading' } })
  })

  it('non-empty block inserts a fresh sibling below with the new id', () => {
    const applied = computeApplyMenuType(doc([paragraph('p0', 'text')]), {
      blockId: 'p0',
      type: 'document.code',
      nextBlockId: idSeq('n1'),
    })

    expect(applied?.targetId).toBe('n1')
    expect(applied?.patches).toEqual([expect.objectContaining({ type: 'block.insert', parentId: 'root' })])
  })
})

describe('computeInsertToggleChild / computeInsertBlockBelow', () => {
  it('non-toggle block: null, no id consumed', () => {
    const nextBlockId = idSeq('c1')

    expect(computeInsertToggleChild(doc([paragraph('p0', 'a')]), 'p0', nextBlockId)).toBeNull()
    expect(nextBlockId).not.toHaveBeenCalled()
  })

  it('insertBlockBelow: paragraph below with block menu open', () => {
    const decision = computeInsertBlockBelow(doc([paragraph('p0', 'a')]), 'p0', idSeq('n1'))

    expect(decision?.patches).toEqual([expect.objectContaining({ type: 'block.insert', parentId: 'root' })])
    expect(decision?.focus).toEqual({ blockId: 'n1', caret: 'start', openBlockMenu: true, justInserted: true })
  })
})

describe('helpers', () => {
  it('blockAttrsPatch builds a single attribute update patch', () => {
    expect(blockAttrsPatch('b1', { checked: true })).toEqual({
      type: 'block.update',
      blockId: 'b1',
      attributes: { checked: true },
    })
  })

  it('orderedTextBlocks skips root and non-text blocks', () => {
    const content = doc([
      paragraph('p0', 'a'),
      createDocumentBlock({ id: 'd1', type: 'document.divider' }),
      paragraph('p1', 'b'),
    ])

    expect(orderedTextBlocks(content).map((item) => item.id)).toEqual(['p0', 'p1'])
  })
})
