import { createDocumentBlock } from '../../blocks/schema'
import { sduiDocumentContentToMarkdown } from '../../markdown'
import { mapDocumentBlockToSduiNode } from '../../sdui/toSduiLayout'
import { COLUMN_BLOCK_TYPE, columnBlockModule } from '../column/column'
import { COLUMN_LIST_BLOCK_TYPE, columnListBlockModule } from '../column-list/columnList'
import { canHostInlineText } from '../index'

const paragraph = (id: string, text: string) =>
  createDocumentBlock({ id, type: 'document.paragraph', state: { text, content: [{ type: 'text', text }] } })

const column = (id: string, children: ReturnType<typeof createDocumentBlock>[], ratio?: number) =>
  createDocumentBlock({
    id,
    type: COLUMN_BLOCK_TYPE,
    ...(ratio !== undefined ? { attributes: { ratio } } : {}),
    children,
  })

const columnList = (id: string, children: ReturnType<typeof createDocumentBlock>[]) =>
  createDocumentBlock({ id, type: COLUMN_LIST_BLOCK_TYPE, children })

describe('columnList block module', () => {
  describe('as is: a columnList with two columns', () => {
    const block = columnList('cl-1', [
      column('col-a', [paragraph('p-a', 'Left')]),
      column('col-b', [paragraph('p-b', 'Right')]),
    ])

    describe('when mapped to an SDUI layout node', () => {
      const node = mapDocumentBlockToSduiNode(block)

      it('to be: a Div tagged with its block type', () => {
        expect(node.type).toBe('Div')
        expect(node.attributes?.['data-block-type']).toBe(COLUMN_LIST_BLOCK_TYPE)
      })

      it('to be: a horizontal flex row (not the vertical flex-col stacks)', () => {
        const className = String(node.attributes?.className ?? '')
        expect(className).toContain('flex')
        expect(className).not.toContain('flex-col')
      })

      it('to be: rendering both columns as children in order', () => {
        expect(node.children?.map((child) => child.id)).toEqual(['col-a', 'col-b'])
      })
    })

    describe('when round-tripped through fromSduiNode', () => {
      it('to be: the same columnList structure', () => {
        const node = mapDocumentBlockToSduiNode(block)
        const roundTripped = columnListBlockModule.fromSduiNode(node, {
          id: block.id,
          children: block.children,
        })

        expect(roundTripped.type).toBe(COLUMN_LIST_BLOCK_TYPE)
        expect(roundTripped.children?.map((child) => child.id)).toEqual(['col-a', 'col-b'])
      })
    })
  })

  describe('as is: container capability policy', () => {
    describe('when asked whether it hosts inline text', () => {
      it('to be: false for columnList and column (pure containers)', () => {
        expect(canHostInlineText(columnList('cl', []))).toBe(false)
        expect(canHostInlineText(column('col', []))).toBe(false)
      })
    })

    describe('when the block menu asks for a default block', () => {
      it('to be: not menu-insertable (createDefault omitted, drag-only creation)', () => {
        expect(columnListBlockModule.createDefault).toBeUndefined()
        expect(columnBlockModule.createDefault).toBeUndefined()
      })
    })
  })
})

describe('column block module', () => {
  // EP/BVA for `ratio`: valid partition (positive finite), boundary 0 (invalid),
  // negative (invalid), non-finite (invalid), absent (default equal split)
  describe('as is: a column with a valid ratio', () => {
    describe('when mapped with ratio=2 (valid partition)', () => {
      it('to be: a grow-weighted flex column carrying data-ratio', () => {
        const node = mapDocumentBlockToSduiNode(column('col-a', [paragraph('p', 'x')], 2))

        expect(node.attributes?.['data-block-type']).toBe(COLUMN_BLOCK_TYPE)
        expect(node.attributes?.['data-ratio']).toBe(2)
        expect(String(node.attributes?.className)).toContain('grow-[2]')
      })
    })
  })

  describe('as is: a column without ratio (default equal split)', () => {
    describe('when mapped to an SDUI layout node', () => {
      it('to be: an unweighted grow column without data-ratio', () => {
        const node = mapDocumentBlockToSduiNode(column('col-a', [paragraph('p', 'x')]))

        expect(node.attributes?.['data-ratio']).toBeUndefined()
        expect(String(node.attributes?.className)).not.toContain('grow-[')
      })
    })
  })

  describe('as is: invalid ratio values', () => {
    describe.each([
      ['zero (lower boundary, exclusive)', 0],
      ['negative', -1],
      ['NaN', Number.NaN],
      ['Infinity', Number.POSITIVE_INFINITY],
    ])('when mapped with ratio=%s', (_label, ratio) => {
      it('to be: treated as absent (equal split, no weight class)', () => {
        const node = mapDocumentBlockToSduiNode(column('col-a', [], ratio))

        expect(node.attributes?.['data-ratio']).toBeUndefined()
        expect(String(node.attributes?.className)).not.toContain('grow-[')
      })
    })
  })

  describe('as is: a mapped column node coming back from the layout', () => {
    describe('when fromSduiNode reads a data-ratio attribute', () => {
      it('to be: restored into attributes.ratio', () => {
        const node = mapDocumentBlockToSduiNode(column('col-a', [], 2))
        const roundTripped = columnBlockModule.fromSduiNode(node, { id: column('col-a', []).id })

        expect(roundTripped.type).toBe(COLUMN_BLOCK_TYPE)
        expect(roundTripped.attributes?.ratio).toBe(2)
      })
    })
  })
})

describe('columns markdown serialization', () => {
  describe('as is: markdown has no column construct (lossy-by-policy)', () => {
    describe('when a document with a two-column split is serialized', () => {
      it('to be: columns flattened vertically in column order', () => {
        const content = {
          schemaVersion: '1.0',
          root: createDocumentBlock({
            id: 'root',
            type: 'document.root',
            children: [
              paragraph('p-0', 'Intro'),
              columnList('cl-1', [
                column('col-a', [paragraph('p-a', 'Left')]),
                column('col-b', [paragraph('p-b', 'Right')]),
              ]),
            ],
          }),
        }

        expect(sduiDocumentContentToMarkdown(content)).toBe('Intro\n\nLeft\n\nRight')
      })
    })

    describe('when a columnList has no columns (empty boundary)', () => {
      it('to be: serialized as nothing', () => {
        const content = {
          schemaVersion: '1.0',
          root: createDocumentBlock({
            id: 'root',
            type: 'document.root',
            children: [columnList('cl-1', [])],
          }),
        }

        expect(sduiDocumentContentToMarkdown(content)).toBe('')
      })
    })
  })
})
