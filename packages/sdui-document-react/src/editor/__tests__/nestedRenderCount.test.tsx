/* eslint-disable no-restricted-syntax */
import { createDocumentBlock, ensureFractionalContent, type SduiDocumentContent } from '@lodado/sdui-document'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

/**
 * Recursive (nested) document + re-render isolation.
 *
 * renderCount.test.tsx proves isolation on a FLAT sibling list.
 * NestedDocumentEditor.test.tsx proves a deep tree RENDERS at correct depth.
 * This file covers the intersection neither does: mutate ONE deep block in a
 * recursively nested tree and assert unrelated branches re-render zero times.
 *
 * Probe: BlockChrome renders once per BlockNode render, so counting its calls
 * per block id measures row re-renders from the outside.
 */
const renderCounts: Record<string, number> = {}

jest.mock('../../block-types/BlockChrome', () => {
  const actual = jest.requireActual('../../block-types/BlockChrome')

  return {
    ...actual,
    BlockChrome: (props: { block: { id: string } } & Record<string, unknown>) => {
      renderCounts[props.block.id] = (renderCounts[props.block.id] ?? 0) + 1

      return actual.BlockChrome(props)
    },
  }
})

// eslint-disable-next-line import/first -- must come after jest.mock
import { SduiDocumentEditor } from '../SduiDocumentEditor'

/**
 * Recursively nested fixture (depth 5):
 * root
 * ├── section-a  heading            depth 1
 * │   ├── a-1    paragraph          depth 2
 * │   │   ├── a-1-1   paragraph     depth 3
 * │   │   │   ├── a-1-1-1 paragraph depth 4
 * │   │   │   │   └── a-1-1-1-1 checklist depth 5   <- mutation target (deepest)
 * │   │   │   └── a-1-1-2 paragraph depth 4         <- near sibling, stays quiet
 * │   │   └── a-1-2   paragraph     depth 3
 * │   └── a-2    callout            depth 2
 * ├── section-b  heading            depth 1   <- far branch, must stay quiet
 * │   └── b-1    paragraph          depth 2
 * └── tail       paragraph          depth 1   <- far branch, must stay quiet
 */
function createNestedContent(): SduiDocumentContent {
  return ensureFractionalContent({
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({
          id: 'section-a',
          type: 'document.heading',
          state: { text: 'Section A' },
          attributes: { level: 2 },
          children: [
            createDocumentBlock({
              id: 'a-1',
              type: 'document.paragraph',
              state: { text: 'A-1' },
              children: [
                createDocumentBlock({
                  id: 'a-1-1',
                  type: 'document.paragraph',
                  state: { text: 'A-1-1' },
                  children: [
                    createDocumentBlock({
                      id: 'a-1-1-1',
                      type: 'document.paragraph',
                      state: { text: 'A-1-1-1' },
                      children: [
                        createDocumentBlock({
                          id: 'a-1-1-1-1',
                          type: 'document.checklist',
                          state: { text: 'A-1-1-1-1' },
                          attributes: { checked: false },
                        }),
                      ],
                    }),
                    createDocumentBlock({ id: 'a-1-1-2', type: 'document.paragraph', state: { text: 'A-1-1-2' } }),
                  ],
                }),
                createDocumentBlock({ id: 'a-1-2', type: 'document.paragraph', state: { text: 'A-1-2' } }),
              ],
            }),
            createDocumentBlock({ id: 'a-2', type: 'document.callout', state: { text: 'A-2' } }),
          ],
        }),
        createDocumentBlock({
          id: 'section-b',
          type: 'document.heading',
          state: { text: 'Section B' },
          attributes: { level: 2 },
          children: [createDocumentBlock({ id: 'b-1', type: 'document.paragraph', state: { text: 'B-1' } })],
        }),
        createDocumentBlock({ id: 'tail', type: 'document.paragraph', state: { text: 'Tail' } }),
      ],
    }),
  })
}

function snapshotCounts(): Record<string, number> {
  return { ...renderCounts }
}

beforeEach(() => {
  Object.keys(renderCounts).forEach((key) => delete renderCounts[key])
})

// deepest block (depth 5) is the mutation target
const TARGET = 'a-1-1-1-1'
// blocks in a different top-level branch from the target — structural sharing must spare them
const FAR_BRANCH = ['section-b', 'b-1', 'tail'] as const
// ancestors ABOVE the split's direct parent (a-1-1-1). In the old tree-prop model
// these re-rendered O(depth); with the per-id render model they must stay put — the
// split only changes a-1-1-1's childrenIds, so nothing above it is notified.
const ANCESTORS_ABOVE_PARENT = ['section-a', 'a-1', 'a-1-1'] as const

describe('SduiDocumentEditor nested render granularity', () => {
  describe('as is: 5-depth recursive tree, nothing focused', () => {
    it('to be: the depth-5 block renders at its exact depth', () => {
      const { container } = render(<SduiDocumentEditor content={createNestedContent()} />)

      expect(container.querySelector(`[data-block-id="${TARGET}"]`)?.getAttribute('data-depth')).toBe('5')
    })

    describe('when the deepest block is clicked to focus (EP: focus enters one depth-5 row)', () => {
      it('to be: far-branch rows re-render zero times', async () => {
        const user = userEvent.setup()
        render(<SduiDocumentEditor content={createNestedContent()} />)

        const before = snapshotCounts()
        await user.click(screen.getByText('A-1-1-1-1'))

        expect(renderCounts[TARGET]).toBeGreaterThan(before[TARGET]) // focused row swaps static -> PM
        for (const id of FAR_BRANCH) {
          expect(renderCounts[id]).toBe(before[id])
        }
      })
    })

    describe('when the deepest block value changes via Enter split (EP: doc mutation partition)', () => {
      it('to be: only the patched path re-renders; far branches bail via memo', async () => {
        const user = userEvent.setup()
        render(<SduiDocumentEditor content={createNestedContent()} generateBlockId={() => 'gen-1'} />)

        await user.click(screen.getByText('A-1-1-1-1'))
        const before = snapshotCounts()

        // split mutates the depth-5 block and inserts gen-1 as its sibling; far branches are shared
        await user.keyboard('{Enter}')

        expect(renderCounts[TARGET]).toBeGreaterThan(before[TARGET]) // patched
        expect(renderCounts['gen-1']).toBeGreaterThan(0) // new block
        for (const id of FAR_BRANCH) {
          expect(renderCounts[id]).toBe(before[id]) // untouched subtree
        }
        // O(1) proof: ancestors above the direct parent do NOT re-render (was O(depth))
        for (const id of ANCESTORS_ABOVE_PARENT) {
          expect(renderCounts[id]).toBe(before[id])
        }
      })
    })
  })
})
