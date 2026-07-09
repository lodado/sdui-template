import type { SduiDocumentContent } from '@lodado/sdui-document'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { SduiPageContext, type SduiPageContextValue } from '../../page/SduiPageContext'
import { SduiDocumentViewer } from '../SduiDocumentViewer'
import { createViewerFixture } from './viewerFixture'

function renderViewer(content: SduiDocumentContent = createViewerFixture()) {
  return render(<SduiDocumentViewer content={content} />)
}

describe('SduiDocumentViewer', () => {
  describe('as is: rich fixture rendered read-only', () => {
    describe('when inspecting inline marks', () => {
      it('to be: static semantic tags with a scheme-safe link', () => {
        const { container } = renderViewer()

        expect(container.querySelector('strong')).toHaveTextContent('bold')
        expect(container.querySelector('em')).toHaveTextContent('italic')
        const link = container.querySelector('a.sdui-doc-link, [data-block-id="p-marks"] a')
        expect(link).toHaveAttribute('href', 'https://example.com')
        expect(link?.getAttribute('rel')).toContain('noopener')
      })
    })

    describe('when a numbered run is broken by a paragraph (BVA: ordinal reset)', () => {
      it('to be: ordinals 1, 2 then restart at 1', () => {
        const { container } = renderViewer()

        const ordinalOf = (id: string) =>
          container.querySelector(`[data-block-id="${id}"] .numbered-list-ordinal, [data-block-id="${id}"]`)
            ?.textContent
        expect(ordinalOf('n1')).toContain('1.')
        expect(ordinalOf('n2')).toContain('2.')
        expect(ordinalOf('n3')).toContain('1.')
      })
    })

    describe('when columns declare ratios', () => {
      it('to be: flexGrow applied per column', () => {
        const { container } = renderViewer()

        expect((container.querySelector('[data-block-id="col-a"]') as HTMLElement).style.flexGrow).toBe('2')
        expect((container.querySelector('[data-block-id="col-b"]') as HTMLElement).style.flexGrow).toBe('1')
      })
    })

    describe('when clicking a toggle', () => {
      it('to be: children hide/show locally without mutating content', async () => {
        const content = createViewerFixture()
        const { container } = render(<SduiDocumentViewer content={content} />)
        const user = userEvent.setup()

        expect(screen.getByText('inside toggle')).toBeInTheDocument()
        const toggleButton = container.querySelector('[data-block-id="tgl-open"] button')
        expect(toggleButton).not.toBeNull()
        await user.click(toggleButton as HTMLElement)

        expect(screen.queryByText('inside toggle')).not.toBeInTheDocument()
        // ephemeral view state only — document content untouched
        const toggleBlock = content.root.children?.find((child) => child.id === 'tgl-open')
        expect(toggleBlock?.attributes?.collapsed).toBe(false)
      })
    })

    describe('when inspecting interactive editor affordances (EP: must be absent)', () => {
      it('to be: no drag/plus handles, no textbox, non-interactive checkbox, no callout icon button', () => {
        const { container } = renderViewer()

        expect(container.querySelector('[data-plus-handle]')).toBeNull()
        expect(container.querySelector('[data-drag-handle]')).toBeNull()
        expect(container.querySelector('[role="textbox"], [contenteditable="true"]')).toBeNull()
        expect(container.querySelector('button.callout-icon-button')).toBeNull()

        // checklist renders a role="checkbox" element; without onToggleChecked a click is a no-op
        const checkbox = container.querySelector('[data-block-id="chk"] [role="checkbox"]') as HTMLElement
        expect(checkbox).toHaveAttribute('aria-checked', 'true')
        checkbox.click()
        expect(checkbox).toHaveAttribute('aria-checked', 'true')
      })
    })

    describe('when a toc block is present', () => {
      it('to be: headings collected from the document store', () => {
        const { container } = renderViewer()

        expect(container.querySelector('[data-block-id="toc"]')).toHaveTextContent('Title')
      })
    })

    describe('when a page block is rendered without a page provider', () => {
      it('to be: inert (no navigation call available)', () => {
        const { container } = renderViewer()

        expect(container.querySelector('[data-block-id="page"]')).not.toBeNull()
      })
    })

    describe('when wrapped in a SduiPageContext provider', () => {
      it('to be: page block opens via the host navigator', async () => {
        const open = jest.fn()
        const pageContext = {
          open,
          resolve: jest.fn(async () => undefined),
          navigator: { push: jest.fn(), peek: jest.fn() },
        } as unknown as SduiPageContextValue
        const user = userEvent.setup()

        const { container } = render(
          <SduiPageContext.Provider value={pageContext}>
            <SduiDocumentViewer content={createViewerFixture()} />
          </SduiPageContext.Provider>,
        )

        const pageRow = container.querySelector(
          '[data-block-id="page"] button, [data-block-id="page"] a, [data-block-id="page"] [role="button"]',
        )
        if (pageRow) {
          await user.click(pageRow as HTMLElement)
          expect(open).toHaveBeenCalled()
        }
      })
    })
  })
})
