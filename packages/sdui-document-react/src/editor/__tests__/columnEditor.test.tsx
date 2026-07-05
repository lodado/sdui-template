import type { SduiDocumentContent } from '@lodado/sdui-document'
import { COLUMN_BLOCK_TYPE, COLUMN_LIST_BLOCK_TYPE, createDocumentBlock } from '@lodado/sdui-document'
import { render, screen } from '@testing-library/react'
import React from 'react'

import { SduiDocumentEditor } from '../SduiDocumentEditor'

/**
 * root
 * ├── intro        paragraph
 * ├── split        columnList
 * │   ├── col-left    column            (ratio 2)
 * │   │   ├── left-1  paragraph
 * │   │   └── left-2  paragraph
 * │   └── col-right   column            (no ratio)
 * │       └── right-1 paragraph
 * └── outro        paragraph
 */
function createColumnContent(): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({ id: 'intro', type: 'document.paragraph', state: { text: 'Intro' } }),
        createDocumentBlock({
          id: 'split',
          type: COLUMN_LIST_BLOCK_TYPE,
          children: [
            createDocumentBlock({
              id: 'col-left',
              type: COLUMN_BLOCK_TYPE,
              attributes: { ratio: 2 },
              children: [
                createDocumentBlock({ id: 'left-1', type: 'document.paragraph', state: { text: 'Left one' } }),
                createDocumentBlock({ id: 'left-2', type: 'document.paragraph', state: { text: 'Left two' } }),
              ],
            }),
            createDocumentBlock({
              id: 'col-right',
              type: COLUMN_BLOCK_TYPE,
              children: [
                createDocumentBlock({ id: 'right-1', type: 'document.paragraph', state: { text: 'Right one' } }),
              ],
            }),
          ],
        }),
        createDocumentBlock({ id: 'outro', type: 'document.paragraph', state: { text: 'Outro' } }),
      ],
    }),
  }
}

describe('SduiDocumentEditor column rendering', () => {
  describe('as is: a document with a two-column split between two paragraphs', () => {
    describe('when rendered editable', () => {
      it('to be: the columnList marked as a horizontal container, columns as its direct children', () => {
        const { container } = render(<SduiDocumentEditor content={createColumnContent()} />)

        const list = container.querySelector('[data-block-id="split"]')
        expect(list).not.toBeNull()
        expect(list!.hasAttribute('data-column-list')).toBe(true)

        const columns = list!.querySelectorAll(':scope > [data-column]')
        expect(Array.from(columns).map((col) => col.getAttribute('data-block-id'))).toEqual(['col-left', 'col-right'])
      })

      it('to be: all leaf texts visible inside their columns', () => {
        render(<SduiDocumentEditor content={createColumnContent()} />)

        expect(screen.getByText('Left one')).toBeInTheDocument()
        expect(screen.getByText('Left two')).toBeInTheDocument()
        expect(screen.getByText('Right one')).toBeInTheDocument()
      })

      it('to be: drag handles only on content rows — containers expose none (5 rows total)', () => {
        const { container } = render(<SduiDocumentEditor content={createColumnContent()} />)

        // intro, left-1, left-2, right-1, outro = 5; split/col-left/col-right = 0
        expect(container.querySelectorAll('[data-drag-handle]')).toHaveLength(5)
        expect(screen.queryByLabelText('Drag block split')).toBeNull()
        expect(screen.queryByLabelText('Drag block col-left')).toBeNull()
      })

      it('to be: no block row chrome on containers (they are layout, not content)', () => {
        const { container } = render(<SduiDocumentEditor content={createColumnContent()} />)

        expect(container.querySelector('[data-block-id="split"] > [data-block-row]')).toBeNull()
        expect(container.querySelector('[data-block-id="col-left"] > [data-block-row]')).toBeNull()
        // while ordinary rows still have their chrome
        expect(container.querySelector('[data-block-id="left-1"] [data-block-row]')).not.toBeNull()
      })

      it('to be: column children NOT wrapped in the vertical indent container', () => {
        const { container } = render(<SduiDocumentEditor content={createColumnContent()} />)

        // columns lay out horizontally — the [data-block-nested] indent unit is
        // strictly for vertical nesting
        expect(container.querySelector('[data-block-id="col-left"] [data-block-nested]')).toBeNull()
      })
    })

    // EP for ratio: present (weighted) / absent (equal split)
    describe('when a column carries ratio=2 and its sibling none', () => {
      it('to be: flexGrow 2 on the weighted column, default grow on the other', () => {
        const { container } = render(<SduiDocumentEditor content={createColumnContent()} />)

        const left = container.querySelector('[data-block-id="col-left"]') as HTMLElement
        const right = container.querySelector('[data-block-id="col-right"]') as HTMLElement

        expect(left.style.flexGrow).toBe('2')
        expect(right.style.flexGrow).toBe('')
      })
    })

    describe('when rendered readOnly (no-interaction partition)', () => {
      it('to be: zero drag handles while the split content stays visible', () => {
        const { container } = render(<SduiDocumentEditor content={createColumnContent()} readOnly />)

        expect(container.querySelectorAll('[data-drag-handle]')).toHaveLength(0)
        expect(screen.getByText('Left one')).toBeInTheDocument()
        expect(screen.getByText('Right one')).toBeInTheDocument()
      })
    })
  })

  describe('as is: a column whose child has its own nested children (vertical inside horizontal)', () => {
    describe('when rendered', () => {
      it('to be: vertical nesting still indents INSIDE a column', () => {
        const content: SduiDocumentContent = {
          schemaVersion: '1.0',
          root: createDocumentBlock({
            id: 'root',
            type: 'document.root',
            children: [
              createDocumentBlock({
                id: 'split',
                type: COLUMN_LIST_BLOCK_TYPE,
                children: [
                  createDocumentBlock({
                    id: 'col-a',
                    type: COLUMN_BLOCK_TYPE,
                    children: [
                      createDocumentBlock({
                        id: 'parent-block',
                        type: 'document.paragraph',
                        state: { text: 'Parent' },
                        children: [
                          createDocumentBlock({
                            id: 'child-block',
                            type: 'document.paragraph',
                            state: { text: 'Child' },
                          }),
                        ],
                      }),
                    ],
                  }),
                  createDocumentBlock({
                    id: 'col-b',
                    type: COLUMN_BLOCK_TYPE,
                    children: [
                      createDocumentBlock({ id: 'b-1', type: 'document.paragraph', state: { text: 'B one' } }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        }

        const { container } = render(<SduiDocumentEditor content={content} />)

        expect(container.querySelector('[data-block-id="parent-block"] [data-block-nested]')).not.toBeNull()
        expect(screen.getByText('Child')).toBeInTheDocument()
      })
    })
  })
})
