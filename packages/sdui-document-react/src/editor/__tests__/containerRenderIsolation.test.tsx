import { createDocumentBlock, ensureFractionalContent, type SduiDocumentContent } from '@lodado/sdui-document'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

/**
 * Container-render isolation.
 *
 * renderCount.test.tsx proves ROW isolation (a block edit re-renders only that
 * row). This file proves the layer above: the document CONTAINER
 * (SduiDocumentEditor) must render exactly once and never re-render on a
 * document commit — content lives in the render-model store + a stable doc
 * store, so no commit path reaches the container.
 *
 * Probe: SduiDocumentEditor renders <DocumentContentProvider> inline, exactly
 * once per its own render, so counting Provider renders counts container
 * renders. The mock wraps the REAL provider so context still works for TOC /
 * empty-flag consumers underneath.
 */
let containerRenders = 0

jest.mock('../DocumentContentContext', () => {
  const actual = jest.requireActual('../DocumentContentContext')
  const RealProvider = actual.DocumentContentProvider

  return {
    ...actual,
    DocumentContentProvider: (props: Record<string, unknown>) => {
      containerRenders += 1

      return <RealProvider {...props} />
    },
  }
})

// eslint-disable-next-line import/first -- must come after jest.mock
import { SduiDocumentEditor } from '../SduiDocumentEditor'

/** root > p1 "First", checklist c1 (unchecked) — checkbox click commits without PM. */
function createChecklistContent(): SduiDocumentContent {
  return ensureFractionalContent({
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({ id: 'p1', type: 'document.paragraph', state: { text: 'First' } }),
        createDocumentBlock({
          id: 'c1',
          type: 'document.checklist',
          state: { text: 'Task' },
          attributes: { checked: false },
        }),
      ],
    }),
  })
}

/** root > three paragraphs — Enter on a focused row splits (structural commit). */
function createParagraphContent(): SduiDocumentContent {
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

/** root > a single empty paragraph — the empty-document placeholder condition. */
function createEmptyContent(): SduiDocumentContent {
  return ensureFractionalContent({
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [createDocumentBlock({ id: 'p0', type: 'document.paragraph', state: { text: '' } })],
    }),
  })
}

/** root > toc, two headings — TOC derives its entries from the whole tree. */
function createTocContent(): SduiDocumentContent {
  return ensureFractionalContent({
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [
        createDocumentBlock({ id: 'toc', type: 'document.toc' }),
        createDocumentBlock({
          id: 'h1',
          type: 'document.heading',
          state: { content: [{ type: 'text', text: 'Alpha' }] },
          attributes: { level: 1 },
        }),
        createDocumentBlock({
          id: 'h2',
          type: 'document.heading',
          state: { content: [{ type: 'text', text: 'Beta' }] },
          attributes: { level: 2 },
        }),
      ],
    }),
  })
}

const editorEl = () => document.querySelector('[data-sdui-document-editor]') as HTMLElement

beforeEach(() => {
  containerRenders = 0
})

describe('SduiDocumentEditor container render isolation', () => {
  describe('as is: mounted document, container rendered once', () => {
    describe('when a checklist toggle commits (EP: state-only doc mutation)', () => {
      it('to be: the document container does not re-render', async () => {
        const user = userEvent.setup()
        render(<SduiDocumentEditor content={createChecklistContent()} />)

        const before = containerRenders // mount render(s) captured
        await user.click(screen.getByRole('checkbox'))

        // commit flows through the render-model store, never the container
        expect(containerRenders).toBe(before)
      })
    })

    describe('when Enter splits a focused row (EP: structural doc mutation)', () => {
      it('to be: the document container does not re-render', async () => {
        const user = userEvent.setup()
        render(<SduiDocumentEditor content={createParagraphContent()} generateBlockId={() => 'gen-1'} />)

        // focus lives in the UI store, not the doc — must not bump the container
        await user.click(screen.getByText('First'))
        const before = containerRenders
        await user.keyboard('{Enter}')

        expect(containerRenders).toBe(before)
      })
    })
  })
})

describe('SduiDocumentEditor data-doc-empty flag', () => {
  describe('as is: a single empty paragraph (empty-document condition)', () => {
    describe('when mounted (BVA: zero content)', () => {
      it('to be: the container carries data-doc-empty', () => {
        render(<SduiDocumentEditor content={createEmptyContent()} />)

        expect(editorEl()).toHaveAttribute('data-doc-empty')
      })
    })

    describe('when a block is inserted below (BVA: 1 -> 2 children, no longer empty)', () => {
      it('to be: data-doc-empty is removed reactively', async () => {
        const user = userEvent.setup()
        render(<SduiDocumentEditor content={createEmptyContent()} generateBlockId={() => 'ins-1'} />)

        expect(editorEl()).toHaveAttribute('data-doc-empty')
        await user.click(screen.getByLabelText('Add block below p0'))

        expect(editorEl()).not.toHaveAttribute('data-doc-empty')
      })
    })
  })
})

describe('TocBlock content wiring', () => {
  describe('as is: a document with a TOC block and two headings', () => {
    describe('when mounted (EP: headings present)', () => {
      it('to be: every heading appears as a TOC entry', () => {
        render(<SduiDocumentEditor content={createTocContent()} />)

        const toc = screen.getByRole('navigation', { name: 'Table of contents' })
        expect(toc).toHaveTextContent('Alpha')
        expect(toc).toHaveTextContent('Beta')
      })
    })
  })
})
