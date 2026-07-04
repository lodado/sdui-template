import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import type { SelectionSnapshot } from '../selectionSnapshot'
import { SelectionToolbar } from '../SelectionToolbar'

function makeSnapshot(overrides: Partial<SelectionSnapshot> = {}): SelectionSnapshot {
  return {
    empty: false,
    from: 0,
    to: 4,
    activeMarks: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      highlight: false,
      code: false,
      link: false,
    },
    highlightColor: null,
    linkHref: null,
    anchorRect: { left: 10, top: 100, width: 40, height: 20 },
    ...overrides,
  }
}

function renderToolbar(snapshot: SelectionSnapshot) {
  const onToggleMark = jest.fn()
  const onSetHighlight = jest.fn()
  const onSetLink = jest.fn()
  render(
    <SelectionToolbar
      snapshot={snapshot}
      onToggleMark={onToggleMark}
      onSetHighlight={onSetHighlight}
      onSetLink={onSetLink}
    />,
  )

  return { onToggleMark, onSetHighlight, onSetLink }
}

describe('SelectionToolbar', () => {
  describe('as is: a ranged selection with a measurable rect (EP: visible partition)', () => {
    describe('when rendered', () => {
      it('to be: shows the formatting menu in Outline button order', () => {
        renderToolbar(makeSnapshot())

        const toolbar = screen.getByRole('toolbar', { name: 'Text formatting' })
        expect(toolbar).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Italic' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Strikethrough' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Code' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Highlight' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Link' })).toBeInTheDocument()
      })
    })

    describe('when the Bold button is clicked (mouse success flow)', () => {
      it('to be: onToggleMark fires with bold', async () => {
        const user = userEvent.setup()
        const { onToggleMark } = renderToolbar(makeSnapshot())

        await user.click(screen.getByRole('button', { name: 'Bold' }))

        expect(onToggleMark).toHaveBeenCalledWith('bold')
      })
    })

    describe('when a mark is already active (EP: active state)', () => {
      it('to be: its button is aria-pressed', () => {
        renderToolbar(makeSnapshot({ activeMarks: { ...makeSnapshot().activeMarks, bold: true } }))

        expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true')
        expect(screen.getByRole('button', { name: 'Italic' })).toHaveAttribute('aria-pressed', 'false')
      })
    })
  })

  describe('as is: collapsed selection (BVA: empty -> hidden boundary)', () => {
    describe('when rendered', () => {
      it('to be: no toolbar in the document', () => {
        renderToolbar(makeSnapshot({ empty: true, anchorRect: null }))

        expect(screen.queryByRole('toolbar')).not.toBeInTheDocument()
      })
    })
  })

  describe('as is: unmeasurable selection rect (EP: anchorRect null)', () => {
    describe('when rendered', () => {
      it('to be: toolbar stays hidden', () => {
        renderToolbar(makeSnapshot({ anchorRect: null }))

        expect(screen.queryByRole('toolbar')).not.toBeInTheDocument()
      })
    })
  })

  describe('as is: the highlight submenu', () => {
    describe('when Highlight is clicked and Coral picked (keyboard-reachable flow)', () => {
      it('to be: onSetHighlight fires with the Outline Coral hex', async () => {
        const user = userEvent.setup()
        const { onSetHighlight } = renderToolbar(makeSnapshot())

        await user.click(screen.getByRole('button', { name: 'Highlight' }))
        await user.click(screen.getByRole('button', { name: 'Highlight Coral' }))

        expect(onSetHighlight).toHaveBeenCalledWith('#FDEA9B')
      })
    })

    describe('when "Remove highlight" is picked (EP: clear partition)', () => {
      it('to be: onSetHighlight fires with null', async () => {
        const user = userEvent.setup()
        const { onSetHighlight } = renderToolbar(makeSnapshot({ highlightColor: '#FDEA9B' }))

        await user.click(screen.getByRole('button', { name: 'Highlight' }))
        await user.click(screen.getByRole('button', { name: 'Remove highlight' }))

        expect(onSetHighlight).toHaveBeenCalledWith(null)
      })
    })
  })

  describe('as is: the link submenu', () => {
    describe('when a URL is typed and Enter pressed (keyboard success flow)', () => {
      it('to be: onSetLink fires with the typed href', async () => {
        const user = userEvent.setup()
        const { onSetLink } = renderToolbar(makeSnapshot())

        await user.click(screen.getByRole('button', { name: 'Link' }))
        await user.type(screen.getByRole('textbox', { name: 'Link URL' }), 'https://example.com{Enter}')

        expect(onSetLink).toHaveBeenCalledWith('https://example.com')
      })
    })

    describe('when Enter is pressed on an empty input (BVA: empty submit)', () => {
      it('to be: onSetLink fires with null (removal)', async () => {
        const user = userEvent.setup()
        const { onSetLink } = renderToolbar(makeSnapshot({ linkHref: 'https://old.example.com' }))

        await user.click(screen.getByRole('button', { name: 'Link' }))
        await user.clear(screen.getByRole('textbox', { name: 'Link URL' }))
        await user.keyboard('{Enter}')

        expect(onSetLink).toHaveBeenCalledWith(null)
      })
    })

    describe('when Escape is pressed (EP: cancel partition)', () => {
      it('to be: returns to the mark menu without calling onSetLink', async () => {
        const user = userEvent.setup()
        const { onSetLink } = renderToolbar(makeSnapshot())

        await user.click(screen.getByRole('button', { name: 'Link' }))
        await user.keyboard('{Escape}')

        expect(onSetLink).not.toHaveBeenCalled()
        expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument()
      })
    })
  })
})
