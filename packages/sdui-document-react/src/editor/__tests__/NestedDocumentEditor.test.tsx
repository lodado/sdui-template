import type { SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'
import { render, screen } from '@testing-library/react'
import React from 'react'

import { SduiDocumentEditor } from '../SduiDocumentEditor'

/**
 * Complex nested fixture — same tree as the "Nested Drag And Drop" Storybook
 * story and packages/sdui-document nestedDragScenario.test.ts. Keep in sync.
 *
 * root
 * ├── section-a  heading            depth 1
 * │   ├── a-1    paragraph          depth 2
 * │   │   ├── a-1-1   paragraph     depth 3
 * │   │   │   └── a-1-1-1 checklist depth 4
 * │   │   └── a-1-2   paragraph     depth 3
 * │   └── a-2    callout            depth 2
 * ├── section-b  heading            depth 1
 * │   └── b-1    paragraph          depth 2
 * └── tail       paragraph          depth 1
 */
function createNestedContent(): SduiDocumentContent {
  return {
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
                      type: 'document.checklist',
                      state: { text: 'A-1-1-1' },
                      attributes: { checked: false },
                    }),
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
  }
}

const depthOf = (container: HTMLElement, blockId: string): string | null =>
  container.querySelector(`[data-block-id="${blockId}"]`)?.getAttribute('data-depth') ?? null

describe('SduiDocumentEditor with complex nested document', () => {
  describe('as is: 4-depth tree with 9 blocks (BVA: deepest supported nesting in the fixture)', () => {
    describe('when rendered without focus', () => {
      it('to be: every block rendered at its exact depth', () => {
        const { container } = render(<SduiDocumentEditor content={createNestedContent()} />)

        // depth boundaries: shallowest (1) and deepest (4) plus each level between
        expect(depthOf(container, 'section-a')).toBe('1')
        expect(depthOf(container, 'a-1')).toBe('2')
        expect(depthOf(container, 'a-1-1')).toBe('3')
        expect(depthOf(container, 'a-1-1-1')).toBe('4')
        expect(depthOf(container, 'a-1-2')).toBe('3')
        expect(depthOf(container, 'a-2')).toBe('2')
        expect(depthOf(container, 'section-b')).toBe('1')
        expect(depthOf(container, 'b-1')).toBe('2')
        expect(depthOf(container, 'tail')).toBe('1')
      })

      it('to be: one drag handle per block — deep blocks are just as draggable', () => {
        const { container } = render(<SduiDocumentEditor content={createNestedContent()} />)

        expect(container.querySelectorAll('[data-drag-handle]')).toHaveLength(9)
        expect(screen.getByLabelText('Drag block a-1-1-1')).toBeInTheDocument()
      })
    })

    describe('when rendered readOnly (EP: no-interaction partition)', () => {
      it('to be: zero drag handles while all nested texts stay visible', () => {
        const { container } = render(<SduiDocumentEditor content={createNestedContent()} readOnly />)

        expect(container.querySelectorAll('[data-drag-handle]')).toHaveLength(0)
        expect(screen.getByText('A-1-1-1')).toBeInTheDocument()
        expect(screen.getByText('Tail')).toBeInTheDocument()
      })
    })
  })
})
