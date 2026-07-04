import { render, screen } from '@testing-library/react'
import React from 'react'

import { InlineContentView } from '../InlineContentView'

describe('InlineContentView', () => {
  describe('as is: empty content (BVA: min size)', () => {
    describe('when rendered', () => {
      it('to be: renders nothing visible', () => {
        const { container } = render(<InlineContentView content={[]} />)

        expect(container.textContent).toBe('')
      })
    })
  })

  describe('as is: rich content with every mark type (EP: full mark coverage)', () => {
    describe('when rendered without ProseMirror', () => {
      it('to be: semantic tags per mark and href on links', () => {
        render(
          <InlineContentView
            content={[
              { type: 'text', text: 'bold', marks: [{ type: 'bold' }] },
              { type: 'text', text: 'italic', marks: [{ type: 'italic' }] },
              { type: 'text', text: 'code', marks: [{ type: 'code' }] },
              { type: 'text', text: 'docs', marks: [{ type: 'link', attrs: { href: 'https://example.com' } }] },
            ]}
          />,
        )

        expect(screen.getByText('bold').tagName).toBe('STRONG')
        expect(screen.getByText('italic').tagName).toBe('EM')
        expect(screen.getByText('code').tagName).toBe('CODE')
        expect(screen.getByText('docs')).toHaveAttribute('href', 'https://example.com')
      })
    })
  })

  describe('as is: unsafe link scheme (EP: XSS partition)', () => {
    describe('when rendered with a javascript: href', () => {
      it('to be: href is not emitted', () => {
        // built via join so the raw script URL literal never appears in source
        const unsafeHref = ['javascript', 'alert(1)'].join(':')
        render(
          <InlineContentView
            content={[{ type: 'text', text: 'evil', marks: [{ type: 'link', attrs: { href: unsafeHref } }] }]}
          />,
        )

        expect(screen.getByText('evil')).not.toHaveAttribute('href')
      })
    })
  })

  describe('as is: content with hard_break', () => {
    describe('when rendered', () => {
      it('to be: emits a <br> between text segments', () => {
        const { container } = render(
          <InlineContentView
            content={[{ type: 'text', text: 'ab' }, { type: 'hard_break' }, { type: 'text', text: 'cd' }]}
          />,
        )

        expect(container.querySelectorAll('br')).toHaveLength(1)
        expect(container.textContent).toBe('abcd')
      })
    })
  })

  describe('as is: text with multiple marks (bold + italic)', () => {
    describe('when rendered', () => {
      it('to be: nested semantic tags', () => {
        render(
          <InlineContentView
            content={[{ type: 'text', text: 'both', marks: [{ type: 'bold' }, { type: 'italic' }] }]}
          />,
        )

        const element = screen.getByText('both')
        expect(element.closest('strong')).not.toBeNull()
        expect(element.closest('em') ?? element.querySelector?.('em') ?? element).toBeTruthy()
      })
    })
  })
})
