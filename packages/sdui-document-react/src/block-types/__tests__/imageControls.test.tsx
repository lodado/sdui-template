import type { SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import { SduiDocumentEditor } from '../../editor/SduiDocumentEditor'

function imageContent(attributes: Record<string, unknown>): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({
      id: 'root',
      type: 'document.root',
      children: [{ id: 'img', type: 'document.image', attributes: { src: 'https://x/y.png', ...attributes } }],
    }),
  }
}

/** Latest image-block attributes as seen by the parent via onContentChange. */
function lastImageAttrs(onContentChange: jest.Mock): Record<string, unknown> {
  const content = onContentChange.mock.calls.at(-1)?.[0] as SduiDocumentContent
  const img = content.root.children?.find((child) => child.id === 'img')
  return (img?.attributes ?? {}) as Record<string, unknown>
}

async function openControls() {
  const user = userEvent.setup()
  await user.click(screen.getByLabelText('Image layout options'))
  return user
}

describe('image lightbox', () => {
  test('clicking the image opens a full-view preview, Escape closes it', async () => {
    const user = userEvent.setup()
    render(<SduiDocumentEditor content={imageContent({ alt: 'Cat' })} onContentChange={jest.fn()} />)

    await user.click(screen.getByRole('button', { name: /Open image preview/ }))
    expect(screen.getByRole('dialog', { name: 'Cat' })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: 'Cat' })).not.toBeInTheDocument()
  })

  test('clicking the backdrop closes the preview', async () => {
    const user = userEvent.setup()
    render(<SduiDocumentEditor content={imageContent({ alt: 'Cat' })} onContentChange={jest.fn()} />)

    await user.click(screen.getByRole('button', { name: /Open image preview/ }))
    await user.click(screen.getByRole('button', { name: 'Dismiss image preview' }))
    expect(screen.queryByRole('dialog', { name: 'Cat' })).not.toBeInTheDocument()
  })
})

describe('image layout controls', () => {
  test('alt text commits on blur', async () => {
    const onContentChange = jest.fn()
    render(<SduiDocumentEditor content={imageContent({})} onContentChange={onContentChange} />)

    const user = await openControls()
    const altInput = screen.getByLabelText('Image alt text')
    await user.type(altInput, 'Profile photo')
    fireEvent.blur(altInput)

    expect(lastImageAttrs(onContentChange).alt).toBe('Profile photo')
  })

  test('width does not commit per keystroke and clamps the minimum on Enter', async () => {
    const onContentChange = jest.fn()
    render(<SduiDocumentEditor content={imageContent({})} onContentChange={onContentChange} />)

    const user = await openControls()
    const widthInput = screen.getByLabelText('Image width in pixels')

    await user.type(widthInput, '10')
    expect(onContentChange).not.toHaveBeenCalled() // no commit while typing

    await user.type(widthInput, '{Enter}')
    // below MIN_IMAGE_WIDTH (40) → clamped up
    expect(lastImageAttrs(onContentChange).width).toBe(40)
  })

  test('Escape reverts the width draft without committing', async () => {
    const onContentChange = jest.fn()
    render(<SduiDocumentEditor content={imageContent({ width: 200 })} onContentChange={onContentChange} />)

    const user = await openControls()
    const widthInput = screen.getByLabelText('Image width in pixels') as HTMLInputElement

    await user.clear(widthInput)
    await user.type(widthInput, '80')
    fireEvent.keyDown(widthInput, { key: 'Escape' })

    expect(widthInput.value).toBe('200')
    expect(onContentChange).not.toHaveBeenCalled()
  })

  test('the active alignment button is marked', async () => {
    const onContentChange = jest.fn()
    render(<SduiDocumentEditor content={imageContent({ align: 'right' })} onContentChange={onContentChange} />)

    await openControls()

    expect(screen.getByLabelText('Align image right')).toHaveAttribute('data-active')
    expect(screen.getByLabelText('Align image left')).not.toHaveAttribute('data-active')
  })

  test('an edge resize drag commits a single clamped width', () => {
    const onContentChange = jest.fn()
    const { container } = render(
      <SduiDocumentEditor content={imageContent({ width: 300 })} onContentChange={onContentChange} />,
    )

    const img = container.querySelector('.image-frame img') as HTMLImageElement
    jest.spyOn(img, 'getBoundingClientRect').mockReturnValue({
      width: 300,
      height: 200,
      top: 0,
      left: 0,
      right: 300,
      bottom: 200,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect)

    const handle = container.querySelector('[data-image-resize-handle="right"]') as HTMLElement
    fireEvent(handle, new MouseEvent('pointerdown', { bubbles: true, clientX: 300, button: 0 }))
    fireEvent(window, new MouseEvent('pointermove', { clientX: 260 })) // drag left 40px
    fireEvent(window, new MouseEvent('pointerup', { clientX: 260 }))

    expect(onContentChange).toHaveBeenCalledTimes(1)
    expect(lastImageAttrs(onContentChange).width).toBe(260)
    expect(img.style.width).toBe('') // inline preview cleared on commit
  })

  describe('as is: an image edge-resize drag in progress', () => {
    describe('when the gesture is interrupted by pointercancel (touch steal)', () => {
      it('to be: the inline preview reverts and no width is committed', () => {
        const onContentChange = jest.fn()
        const { container } = render(
          <SduiDocumentEditor content={imageContent({ width: 300 })} onContentChange={onContentChange} />,
        )

        const img = container.querySelector('.image-frame img') as HTMLImageElement
        jest.spyOn(img, 'getBoundingClientRect').mockReturnValue({
          width: 300,
          height: 200,
          top: 0,
          left: 0,
          right: 300,
          bottom: 200,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        } as DOMRect)

        const handle = container.querySelector('[data-image-resize-handle="right"]') as HTMLElement
        fireEvent(handle, new MouseEvent('pointerdown', { bubbles: true, clientX: 300, button: 0 }))
        fireEvent(window, new MouseEvent('pointermove', { clientX: 260 })) // 40px preview
        expect(img.style.width).not.toBe('') // preview is live

        fireEvent(window, new MouseEvent('pointercancel', { clientX: 260 }))

        expect(img.style.width).toBe('') // reverted, not stranded
        expect(onContentChange).not.toHaveBeenCalled() // cancel never commits

        // a stray pointerup after the cancel is inert
        fireEvent(window, new MouseEvent('pointerup', { clientX: 260 }))
        expect(onContentChange).not.toHaveBeenCalled()
      })
    })
  })
})
