import { render, screen, waitFor } from '@testing-library/react'
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
      color: false,
      code: false,
      link: false,
    },
    highlightColor: null,
    textColor: null,
    linkHref: null,
    anchorRect: { left: 10, top: 100, width: 40, height: 20 },
    ...overrides,
  }
}

function renderToolbar(snapshot: SelectionSnapshot, align?: { blockAlign: 'left' | 'center' | 'right' | null }) {
  const onToggleMark = jest.fn()
  const onSetHighlight = jest.fn()
  const onSetColor = jest.fn()
  const onSetLink = jest.fn()
  const onSetAlign = jest.fn()
  render(
    <SelectionToolbar
      snapshot={snapshot}
      onToggleMark={onToggleMark}
      onSetHighlight={onSetHighlight}
      onSetColor={onSetColor}
      onSetLink={onSetLink}
      {...(align ? { blockAlign: align.blockAlign, onSetAlign } : {})}
    />,
  )

  return { onToggleMark, onSetHighlight, onSetColor, onSetLink, onSetAlign }
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
        expect(screen.getByRole('button', { name: 'Color' })).toBeInTheDocument()
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

  describe('when a formatting button is hovered', () => {
    it('to be: a shortcut tooltip is shown', async () => {
      const user = userEvent.setup()
      renderToolbar(makeSnapshot())

      await user.hover(screen.getByRole('button', { name: 'Bold' }))

      await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent('Bold'))
      expect(screen.getByRole('tooltip')).toHaveTextContent('Ctrl/Cmd+B')
    })
  })

  describe('as is: block alignment controls (single-block range)', () => {
    describe('when onSetAlign is provided', () => {
      it('to be: renders the three align buttons', () => {
        renderToolbar(makeSnapshot(), { blockAlign: null })

        expect(screen.getByRole('button', { name: 'Align left' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Align center' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Align right' })).toBeInTheDocument()
      })
    })

    describe('when onSetAlign is omitted (cross-block range)', () => {
      it('to be: renders no align buttons', () => {
        renderToolbar(makeSnapshot())

        expect(screen.queryByRole('button', { name: 'Align right' })).not.toBeInTheDocument()
      })
    })

    describe('when an align button is clicked', () => {
      it('to be: onSetAlign fires with that alignment', async () => {
        const user = userEvent.setup()
        const { onSetAlign } = renderToolbar(makeSnapshot(), { blockAlign: null })

        await user.click(screen.getByRole('button', { name: 'Align right' }))

        expect(onSetAlign).toHaveBeenCalledWith('right')
      })
    })

    describe('when the active alignment is clicked again (toggle off)', () => {
      it('to be: onSetAlign fires with null', async () => {
        const user = userEvent.setup()
        const { onSetAlign } = renderToolbar(makeSnapshot(), { blockAlign: 'right' })

        await user.click(screen.getByRole('button', { name: 'Align right' }))

        expect(onSetAlign).toHaveBeenCalledWith(null)
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

  describe('as is: the unified color menu (text color + background color)', () => {
    describe('when Color is clicked and a text swatch picked', () => {
      it('to be: onSetColor fires with the Notion hex', async () => {
        const user = userEvent.setup()
        const { onSetColor } = renderToolbar(makeSnapshot())

        await user.click(screen.getByRole('button', { name: 'Color' }))
        await user.click(screen.getByRole('button', { name: 'Text Purple' }))

        expect(onSetColor).toHaveBeenCalledWith('#9065B0')
      })
    })

    describe('when Color is clicked and a background swatch picked', () => {
      it('to be: onSetHighlight fires with the Notion hex', async () => {
        const user = userEvent.setup()
        const { onSetHighlight } = renderToolbar(makeSnapshot())

        await user.click(screen.getByRole('button', { name: 'Color' }))
        await user.click(screen.getByRole('button', { name: 'Background Yellow' }))

        expect(onSetHighlight).toHaveBeenCalledWith('#CB912F')
      })
    })

    describe('when the reset swatches are picked (EP: clear partitions)', () => {
      it('to be: text/background reset to null', async () => {
        const user = userEvent.setup()
        const { onSetColor, onSetHighlight } = renderToolbar(
          makeSnapshot({ textColor: '#9065B0', highlightColor: '#CB912F' }),
        )

        await user.click(screen.getByRole('button', { name: 'Color' }))
        await user.click(screen.getByRole('button', { name: 'Default text color' }))
        await user.click(screen.getByRole('button', { name: 'Default background' }))

        expect(onSetColor).toHaveBeenCalledWith(null)
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
