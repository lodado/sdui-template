import type { SduiDocumentContent } from '../blocks/schema'
import { collectHeadings } from './collectHeadings'

const content: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: {
    id: 'root',
    type: 'document.root',
    children: [
      {
        id: 'h1',
        type: 'document.heading',
        attributes: { level: 1 },
        state: { content: [{ type: 'text', text: 'Intro' }] },
      },
      { id: 'p', type: 'document.paragraph', state: { content: [{ type: 'text', text: 'body' }] } },
      {
        id: 'h2',
        type: 'document.heading',
        attributes: { level: 2 },
        state: { content: [{ type: 'text', text: 'Details' }] },
      },
    ],
  },
}

it('collects headings in order with level and text', () => {
  expect(collectHeadings(content)).toEqual([
    { id: 'h1', level: 1, text: 'Intro' },
    { id: 'h2', level: 2, text: 'Details' },
  ])
})

it('returns an empty array when there are no headings', () => {
  const noHeadings: SduiDocumentContent = {
    schemaVersion: '1.0',
    root: {
      id: 'root',
      type: 'document.root',
      children: [{ id: 'p', type: 'document.paragraph', state: { content: [{ type: 'text', text: 'x' }] } }],
    },
  }

  expect(collectHeadings(noHeadings)).toEqual([])
})
