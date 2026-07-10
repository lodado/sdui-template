import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

type ImageLightboxProps = {
  src: string
  alt: string
  onClose(): void
}

/**
 * Full-viewport image preview. Rendered in a body portal so editor transforms /
 * overflow never clip it. Closes on Esc, backdrop click, or the close button.
 */
export const ImageLightbox = ({ src, alt, onClose }: ImageLightboxProps) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', onKeyDown, true)
    return () => document.removeEventListener('keydown', onKeyDown, true)
  }, [onClose])

  if (typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div className="sdui-doc-lightbox" role="dialog" aria-modal="true" aria-label={alt || 'Image preview'}>
      {/* Full-bleed backdrop button: a click anywhere outside the image closes.
          A real <button> gives keyboard/close semantics for free (plus Esc above). */}
      <button
        type="button"
        className="sdui-doc-lightbox-backdrop"
        aria-label="Dismiss image preview"
        onClick={onClose}
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- editor renders arbitrary user image URLs, next/image is not applicable here */}
      <img className="sdui-doc-lightbox-img" src={src} alt={alt} />
      <button type="button" className="sdui-doc-lightbox-close" aria-label="Close preview" onClick={onClose}>
        ✕
      </button>
    </div>,
    document.body,
  )
}
