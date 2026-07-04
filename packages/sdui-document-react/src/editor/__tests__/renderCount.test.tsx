import {
  createBlockId,
  createDocumentBlock,
  ensureFractionalContent,
  findBlockById,
  type SduiDocumentContent,
} from '@lodado/sdui-document'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

/**
 * Render-count probe: BlockChrome renders exactly once per BlockNode render,
 * so counting its calls per block id measures row re-renders from the outside
 * without touching editor internals.
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
 * Fixture tree:
 * root
 * ├── p1 "First"
 * ├── p2 "Second"
 * └── p3 "Third"
 */
function createContent(): SduiDocumentContent {
  return ensureFractionalContent({
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({ id: 'p1', type: 'document.paragraph', state: { text: 'First' } }),
        createDocumentBlock({ id: 'p2', type: 'document.paragraph', state: { text: 'Second' } }),
        createDocumentBlock({ id: 'p3', type: 'document.paragraph', state: { text: 'Third' } }),
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

describe('SduiDocumentEditor render granularity', () => {
  describe('as is: three sibling paragraphs, nothing focused', () => {
    describe('when p1 is clicked to focus (EP: focus enters one row)', () => {
      it('to be: unrelated rows p2/p3 re-render zero times', async () => {
        const user = userEvent.setup()
        render(<SduiDocumentEditor content={createContent()} />)

        const before = snapshotCounts()
        await user.click(screen.getByText('First'))

        // focused row re-renders (static -> PM), siblings must not
        expect(renderCounts.p1).toBeGreaterThan(before.p1)
        expect(renderCounts.p2).toBe(before.p2)
        expect(renderCounts.p3).toBe(before.p3)
      })
    })

    describe('when focus moves p1 -> p2 (BVA: exactly the two affected rows)', () => {
      it('to be: p3 re-renders zero times', async () => {
        const user = userEvent.setup()
        render(<SduiDocumentEditor content={createContent()} />)

        await user.click(screen.getByText('First'))
        const before = snapshotCounts()
        await user.click(screen.getByText('Second'))

        expect(renderCounts.p1).toBeGreaterThan(before.p1) // PM unmounts
        expect(renderCounts.p2).toBeGreaterThan(before.p2) // PM mounts
        expect(renderCounts.p3).toBe(before.p3) // untouched
      })
    })

    describe('when a drag handle is clicked to select p1 (EP: selection enters one row)', () => {
      it('to be: unrelated rows p2/p3 re-render zero times', async () => {
        const user = userEvent.setup()
        render(<SduiDocumentEditor content={createContent()} />)

        const before = snapshotCounts()
        await user.click(screen.getByLabelText('Drag block p1'))

        expect(renderCounts.p1).toBeGreaterThan(before.p1)
        expect(renderCounts.p2).toBe(before.p2)
        expect(renderCounts.p3).toBe(before.p3)
      })
    })

    describe('when Enter splits p1 into a patch (EP: doc mutation partition)', () => {
      it('to be: rows outside the patched path re-render zero times (structural sharing + memo)', async () => {
        const user = userEvent.setup()
        render(<SduiDocumentEditor content={createContent()} generateBlockId={() => 'gen-1'} />)

        await user.click(screen.getByText('First'))
        const before = snapshotCounts()

        // split patch touches p1 and inserts gen-1; p2/p3 subtrees are shared
        await user.keyboard('{Enter}')

        expect(renderCounts.p1).toBeGreaterThan(before.p1) // patched + unfocused
        expect(renderCounts['gen-1']).toBeGreaterThan(0) // new focused block
        expect(renderCounts.p2).toBe(before.p2) // shared subtree — memo bails out
        expect(renderCounts.p3).toBe(before.p3)
      })
    })

    describe('when the selection is cleared with Escape (BVA: selection -> empty)', () => {
      it('to be: only the previously selected row re-renders', async () => {
        const user = userEvent.setup()
        render(<SduiDocumentEditor content={createContent()} />)

        await user.click(screen.getByLabelText('Drag block p1'))
        const before = snapshotCounts()
        await user.keyboard('{Escape}')

        expect(renderCounts.p1).toBeGreaterThan(before.p1)
        expect(renderCounts.p2).toBe(before.p2)
        expect(renderCounts.p3).toBe(before.p3)
      })
    })
  })
})
