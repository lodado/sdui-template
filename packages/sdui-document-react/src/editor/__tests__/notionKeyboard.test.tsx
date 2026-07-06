import type { SduiDocumentBlock, SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { SduiDocumentEditor } from '../SduiDocumentEditor'
import { stripPatchOrigins } from './patchTestUtils'

function renderEditor(children: SduiDocumentBlock[]) {
  const content: SduiDocumentContent = {
    schemaVersion: '1.0',
    root: createDocumentBlock({ id: 'root', type: 'document.root', children }),
  }
  const ids = ['gen-1', 'gen-2', 'gen-3']
  const onContentChange = jest.fn()
  const utils = render(
    <SduiDocumentEditor
      content={content}
      onContentChange={onContentChange}
      generateBlockId={() => ids.shift() ?? 'gen-x'}
    />,
  )

  const allPatches = () => stripPatchOrigins(onContentChange.mock.calls.flatMap(([, patches]) => patches as unknown[]))

  return { ...utils, onContentChange, allPatches }
}

describe('notion keyboard semantics', () => {
  describe('as is: bulleted item "hello" (non-empty)', () => {
    it('to be: Enter splits and the continuation keeps the list type', async () => {
      const user = userEvent.setup()
      const { allPatches } = renderEditor([
        createDocumentBlock({ id: 'b1', type: 'document.bulleted-list', state: { text: 'hello' } }),
      ])

      await user.click(screen.getByText('hello'))
      await user.keyboard('{End}{Enter}')

      const patches = allPatches()
      expect(patches).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'block.split', blockId: 'b1' })]))
      expect(patches.filter((patch) => (patch as { type: string }).type === 'block.setType')).toEqual([])
    })
  })

  describe('as is: EMPTY bulleted item', () => {
    it('to be: Enter converts it to a paragraph in place (no split)', async () => {
      const user = userEvent.setup()
      const { container, allPatches } = renderEditor([
        createDocumentBlock({ id: 'b1', type: 'document.bulleted-list', state: { text: '' } }),
        createDocumentBlock({ id: 'p9', type: 'document.paragraph', state: { text: 'anchor' } }),
      ])

      // empty block has no text node — click its static inline root directly
      await user.click(container.querySelector('[data-block-id="b1"] [data-inline-root]') as HTMLElement)
      await user.keyboard('{Enter}')

      const patches = allPatches()
      expect(patches).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: 'block.setType', blockId: 'b1', blockType: 'document.paragraph' }),
        ]),
      )
      expect(patches.filter((patch) => (patch as { type: string }).type === 'block.split')).toEqual([])
    })
  })

  describe('as is: quote "wise"', () => {
    it('to be: Enter split produces a paragraph continuation', async () => {
      const user = userEvent.setup()
      const { allPatches } = renderEditor([
        createDocumentBlock({ id: 'q1', type: 'document.quote', state: { text: 'wise' } }),
      ])

      await user.click(screen.getByText('wise'))
      await user.keyboard('{End}{Enter}')

      expect(allPatches()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: 'block.split', blockId: 'q1' }),
          expect.objectContaining({ type: 'block.setType', blockId: 'gen-1', blockType: 'document.paragraph' }),
        ]),
      )
    })
  })

  describe('as is: paragraph then numbered item, caret at item start', () => {
    it('to be: Backspace strips the list type instead of merging', async () => {
      const user = userEvent.setup()
      const { container, allPatches } = renderEditor([
        createDocumentBlock({ id: 'p1', type: 'document.paragraph', state: { text: 'above' } }),
        createDocumentBlock({ id: 'n1', type: 'document.numbered-list', state: { text: 'item' } }),
      ])

      await user.click(screen.getByText('item'))
      await user.keyboard('{Home}{Backspace}')

      const patches = allPatches()
      expect(patches).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: 'block.setType', blockId: 'n1', blockType: 'document.paragraph' }),
        ]),
      )
      expect(patches.filter((patch) => (patch as { type: string }).type === 'block.merge')).toEqual([])
      // list marker gone — the row now renders as a paragraph
      expect(container.querySelector('[data-block-id="n1"] .list-marker')).not.toBeInTheDocument()
    })
  })

  describe('as is: toggle "hi" (expanded)', () => {
    it('to be: Enter inserts a paragraph as the toggle first child, not a sibling', async () => {
      const user = userEvent.setup()
      const { allPatches } = renderEditor([
        createDocumentBlock({
          id: 't1',
          type: 'document.toggle',
          state: { text: 'hi' },
          attributes: { collapsed: false },
        }),
      ])

      await user.click(screen.getByText('hi'))
      await user.keyboard('{End}{Enter}')

      const patches = allPatches()
      expect(patches).toEqual(
        expect.arrayContaining([expect.objectContaining({ type: 'block.insert', parentId: 't1', after: null })]),
      )
      expect(patches.filter((patch) => (patch as { type: string }).type === 'block.split')).toEqual([])
    })
  })

  describe('as is: three paragraphs, first block-selected', () => {
    it('to be: Shift+ArrowDown extends the selection and Cmd+D duplicates every selected block', async () => {
      const user = userEvent.setup()
      const { allPatches } = renderEditor([
        createDocumentBlock({ id: 'p1', type: 'document.paragraph', state: { text: 'one' } }),
        createDocumentBlock({ id: 'p2', type: 'document.paragraph', state: { text: 'two' } }),
        createDocumentBlock({ id: 'p3', type: 'document.paragraph', state: { text: 'three' } }),
      ])

      // Enter block-selection mode on p1, extend to p2, duplicate both.
      await user.click(screen.getByText('one'))
      await user.keyboard('{Escape}{Shift>}{ArrowDown}{/Shift}')
      await user.keyboard('{Meta>}d{/Meta}')

      // One clone per selected block (p1 + p2). Without the Shift+ArrowDown
      // extend, only p1 would be selected and this would be a single insert.
      const inserts = allPatches().filter((patch) => (patch as { type: string }).type === 'block.insert')
      expect(inserts).toHaveLength(2)
    })
  })

  describe('as is: toggle "hi" (collapsed)', () => {
    it('to be: Enter expands the toggle and inserts a first child', async () => {
      const user = userEvent.setup()
      const { allPatches } = renderEditor([
        createDocumentBlock({
          id: 't1',
          type: 'document.toggle',
          state: { text: 'hi' },
          attributes: { collapsed: true },
        }),
      ])

      await user.click(screen.getByText('hi'))
      await user.keyboard('{End}{Enter}')

      const patches = allPatches()
      expect(patches).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: 'block.update', blockId: 't1', attributes: { collapsed: false } }),
          expect.objectContaining({ type: 'block.insert', parentId: 't1', after: null }),
        ]),
      )
    })
  })
})
