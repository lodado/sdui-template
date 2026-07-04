import type { SduiDocumentBlock } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { BlockChrome } from '../BlockChrome'

function block(type: string, attributes?: Record<string, unknown>, text?: string): SduiDocumentBlock {
  return createDocumentBlock({
    id: 'target',
    type: type as SduiDocumentBlock['type'],
    attributes,
    state: text === undefined ? undefined : { text },
  })
}

describe('BlockChrome', () => {
  describe('as is: paragraph block (EP: default text partition)', () => {
    describe('when rendered with children', () => {
      it('to be: a <p dir="auto"> wrapping the children', () => {
        const { container } = render(<BlockChrome block={block('document.paragraph')}>hello</BlockChrome>)

        const paragraph = container.querySelector('p[dir="auto"]')
        expect(paragraph).not.toBeNull()
        expect(paragraph).toHaveTextContent('hello')
      })
    })
  })

  describe('as is: heading levels (BVA: supported range is 1..4)', () => {
    it.each([
      // [input level, expected tag] — boundaries 1/4 plus out-of-range 0/5 clamp
      [1, 'H1'],
      [4, 'H4'],
      [0, 'H1'],
      [5, 'H4'],
    ])('when level = %d, to be: rendered as <%s class="heading-content">', (level, tag) => {
      const { container } = render(<BlockChrome block={block('document.heading', { level })}>title</BlockChrome>)

      const heading = container.querySelector('.heading-content')
      expect(heading?.tagName).toBe(tag)
    })

    describe('when level is missing (EP: default partition)', () => {
      it('to be: h1', () => {
        const { container } = render(<BlockChrome block={block('document.heading')}>title</BlockChrome>)

        expect(container.querySelector('.heading-content')?.tagName).toBe('H1')
      })
    })
  })

  describe('as is: callout variants (EP: info/warning/tip/success + unknown fallback)', () => {
    it.each([['info'], ['warning'], ['tip'], ['success']])(
      'when style = %s, to be: .notice-block.%s with icon and content',
      (style) => {
        const { container } = render(<BlockChrome block={block('document.callout', { style })}>note</BlockChrome>)

        const notice = container.querySelector(`.notice-block.${style}`)
        expect(notice).not.toBeNull()
        expect(notice?.querySelector('.icon svg')).not.toBeNull()
        expect(notice?.querySelector('.content')).toHaveTextContent('note')
      },
    )

    describe('when style is unknown (EP: invalid partition)', () => {
      it('to be: falls back to info', () => {
        const { container } = render(<BlockChrome block={block('document.callout', { style: 'nope' })}>x</BlockChrome>)

        expect(container.querySelector('.notice-block.info')).not.toBeNull()
      })
    })
  })

  describe('as is: checklist checked states (EP: true/false partitions)', () => {
    describe('when checked = false and the checkbox is clicked', () => {
      it('to be: aria-checked false, toggle called with true', async () => {
        const user = userEvent.setup()
        const onToggleChecked = jest.fn()
        render(
          <BlockChrome block={block('document.checklist', { checked: false })} onToggleChecked={onToggleChecked}>
            todo
          </BlockChrome>,
        )

        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).toHaveAttribute('aria-checked', 'false')

        await user.click(checkbox)
        expect(onToggleChecked).toHaveBeenCalledWith('target', true)
      })
    })

    describe('when checked = true', () => {
      it('to be: aria-checked true with the checked class on the item', () => {
        const { container } = render(
          <BlockChrome block={block('document.checklist', { checked: true })} onToggleChecked={jest.fn()}>
            done
          </BlockChrome>,
        )

        expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true')
        expect(container.querySelector('[data-type="checkbox_item"].checked')).not.toBeNull()
      })
    })

    describe('when no toggle handler is provided (EP: readOnly partition)', () => {
      it('to be: checkbox disabled', () => {
        render(<BlockChrome block={block('document.checklist', { checked: false })}>todo</BlockChrome>)

        expect(screen.getByRole('checkbox')).toBeDisabled()
      })
    })
  })

  describe('as is: divider markup variants (EP: "---" vs "***")', () => {
    describe('when markup = "---" (default)', () => {
      it('to be: plain <hr>', () => {
        const { container } = render(<BlockChrome block={block('document.divider')} />)

        const hr = container.querySelector('hr')
        expect(hr).not.toBeNull()
        expect(hr).not.toHaveClass('page-break')
      })
    })

    describe('when markup = "***"', () => {
      it('to be: <hr class="page-break">', () => {
        const { container } = render(<BlockChrome block={block('document.divider', { markup: '***' })} />)

        expect(container.querySelector('hr.page-break')).not.toBeNull()
      })
    })
  })

  describe('as is: image block (EP: safe vs unsafe src partitions)', () => {
    describe('when src is https and caption text exists', () => {
      it('to be: div.image > img + p.caption', () => {
        const { container } = render(
          <BlockChrome
            block={block('document.image', { src: 'https://example.com/a.png', alt: 'a', width: 100 }, 'my caption')}
          />,
        )

        const img = container.querySelector('.image img')
        expect(img).toHaveAttribute('src', 'https://example.com/a.png')
        expect(img).toHaveAttribute('width', '100')
        expect(container.querySelector('p.caption')).toHaveTextContent('my caption')
      })
    })

    describe('when src uses a disallowed scheme (EP: security partition)', () => {
      it('to be: no <img> emitted', () => {
        const dangerous = ['javascript', 'alert(1)'].join(':')
        const { container } = render(<BlockChrome block={block('document.image', { src: dangerous })} />)

        expect(container.querySelector('img')).toBeNull()
      })
    })
  })

  describe('as is: file block (EP: safe vs unsafe url partitions)', () => {
    describe('when url is https', () => {
      it('to be: a.attachment with href and download', () => {
        render(<BlockChrome block={block('document.file', { url: 'https://example.com/f.pdf', name: 'f.pdf' })} />)

        const anchor = screen.getByText('f.pdf')
        expect(anchor.tagName).toBe('A')
        expect(anchor).toHaveClass('attachment')
        expect(anchor).toHaveAttribute('href', 'https://example.com/f.pdf')
        expect(anchor).toHaveAttribute('download', 'f.pdf')
      })
    })

    describe('when url uses a disallowed scheme', () => {
      it('to be: span fallback without href', () => {
        const dangerous = ['javascript', 'alert(1)'].join(':')
        render(<BlockChrome block={block('document.file', { url: dangerous, name: 'f.pdf' })} />)

        expect(screen.getByText('f.pdf').tagName).toBe('SPAN')
      })
    })
  })

  describe('as is: link block (EP: safe vs unsafe url partitions)', () => {
    describe('when url is https and state.text is the title', () => {
      it('to be: a.embed with rel noopener', () => {
        render(<BlockChrome block={block('document.link', { url: 'https://example.com' }, 'Example')} />)

        const anchor = screen.getByText('Example')
        expect(anchor.tagName).toBe('A')
        expect(anchor).toHaveClass('embed')
        expect(anchor).toHaveAttribute('rel', 'noopener noreferrer nofollow')
      })
    })

    describe('when url uses a disallowed scheme', () => {
      it('to be: span fallback', () => {
        const dangerous = ['javascript', 'alert(1)'].join(':')
        render(<BlockChrome block={block('document.link', { url: dangerous }, 'Example')} />)

        expect(screen.getByText('Example').tagName).toBe('SPAN')
      })
    })
  })

  describe('as is: natively draggable elements inside the editor (img, a)', () => {
    it('to be: image is not draggable (native image drag competes with text drag)', () => {
      const { container } = render(
        <BlockChrome block={block('document.image', { src: 'https://example.com/x.png', alt: 'x' })} />,
      )

      expect(container.querySelector('img')).toHaveAttribute('draggable', 'false')
    })

    it('to be: file attachment anchor is not draggable', () => {
      render(<BlockChrome block={block('document.file', { url: 'https://example.com/f.pdf', name: 'f.pdf' })} />)

      expect(screen.getByText('f.pdf')).toHaveAttribute('draggable', 'false')
    })

    it('to be: link embed anchor is not draggable', () => {
      render(<BlockChrome block={block('document.link', { url: 'https://example.com' }, 'Example')} />)

      expect(screen.getByText('Example')).toHaveAttribute('draggable', 'false')
    })
  })
})
