import { type BlockAlign, resolveBlockAlign } from '@lodado/sdui-document'
import * as Popover from '@radix-ui/react-popover'
import React, { useEffect, useRef, useState } from 'react'

import { safeHref } from '../../inline/safeHref'
import type { BlockChromeProps } from '../BlockChrome'
import { blockText } from '../blockText'

const MIN_IMAGE_WIDTH = 40

const ALIGN_OPTIONS: ReadonlyArray<{ value: BlockAlign; label: string; glyph: string }> = [
  { value: 'left', label: 'Align image left', glyph: '⇤' },
  { value: 'center', label: 'Align image center', glyph: '↔' },
  { value: 'right', label: 'Align image right', glyph: '⇥' },
]

const clampWidth = (value: number, max: number): number => Math.min(Math.max(value, MIN_IMAGE_WIDTH), max)

type ImageLayoutControlsProps = {
  blockId: string
  align: BlockAlign | undefined
  width: number | undefined
  alt: string
  frameRef: React.RefObject<HTMLSpanElement>
  onSetImageLayout: NonNullable<BlockChromeProps['onSetImageLayout']>
}

/**
 * Notion-style image controls: a trigger button revealed on hover/focus of the
 * image, opening a Radix Popover with alignment, width, and alt text. Rendered
 * only in editable mode. Marked contentEditable=false so it never enters the
 * doc model. Width and alt commit on blur/Enter (not per keystroke) and clamp
 * to the container; Escape reverts the draft.
 */
const ImageLayoutControls = ({ blockId, align, width, alt, frameRef, onSetImageLayout }: ImageLayoutControlsProps) => {
  const [widthDraft, setWidthDraft] = useState(width?.toString() ?? '')
  const [altDraft, setAltDraft] = useState(alt)

  // Re-sync drafts when the committed values change out from under the popover.
  useEffect(() => setWidthDraft(width?.toString() ?? ''), [width])
  useEffect(() => setAltDraft(alt), [alt])

  const commitWidth = () => {
    const trimmed = widthDraft.trim()
    if (trimmed === '') {
      onSetImageLayout(blockId, { width: undefined })
      return
    }
    const parsed = Number(trimmed)
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setWidthDraft(width?.toString() ?? '')
      return
    }
    const max = frameRef.current?.parentElement?.clientWidth || Infinity
    onSetImageLayout(blockId, { width: Math.round(clampWidth(parsed, max)) })
  }

  const commitAlt = () => {
    const trimmed = altDraft.trim()
    onSetImageLayout(blockId, { alt: trimmed || undefined })
  }

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="image-controls-trigger"
          aria-label="Image layout options"
          contentEditable={false}
          onMouseDown={(event) => event.preventDefault()}
        >
          ⋯
        </button>
      </Popover.Trigger>
      <Popover.Content
        className="image-controls-popover"
        side="top"
        align="end"
        sideOffset={6}
        contentEditable={false}
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <div className="image-controls" role="group" aria-label="Image layout">
          {ALIGN_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-label={option.label}
              aria-pressed={align === option.value}
              data-active={align === option.value || undefined}
              onClick={() => onSetImageLayout(blockId, { align: align === option.value ? undefined : option.value })}
            >
              {option.glyph}
            </button>
          ))}
          <label className="image-width" htmlFor={`${blockId}-image-width`}>
            <input
              id={`${blockId}-image-width`}
              type="number"
              min={MIN_IMAGE_WIDTH}
              step={10}
              placeholder="auto"
              aria-label="Image width in pixels"
              value={widthDraft}
              onChange={(event) => setWidthDraft(event.target.value)}
              onBlur={commitWidth}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  commitWidth()
                } else if (event.key === 'Escape') {
                  setWidthDraft(width?.toString() ?? '')
                }
              }}
            />
            px
          </label>
          <label className="image-alt" htmlFor={`${blockId}-image-alt`}>
            <span className="image-alt-label">Alt</span>
            <input
              id={`${blockId}-image-alt`}
              type="text"
              placeholder="Describe the image"
              aria-label="Image alt text"
              value={altDraft}
              onChange={(event) => setAltDraft(event.target.value)}
              onBlur={commitAlt}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  commitAlt()
                } else if (event.key === 'Escape') {
                  setAltDraft(alt)
                }
              }}
            />
          </label>
        </div>
      </Popover.Content>
    </Popover.Root>
  )
}

type ImageResizeHandleProps = {
  blockId: string
  side: 'left' | 'right'
  imgRef: React.RefObject<HTMLImageElement>
  frameRef: React.RefObject<HTMLSpanElement>
  onSetImageLayout: NonNullable<BlockChromeProps['onSetImageLayout']>
}

/**
 * Edge drag handles that resize the image directly, mirroring the column
 * gutter's pointer pattern: live inline-style preview, single commit on
 * pointerup, Escape cancels. Hidden from AT — the popover width input is the
 * keyboard-accessible path.
 */
const ImageResizeHandle = ({ blockId, side, imgRef, frameRef, onSetImageLayout }: ImageResizeHandleProps) => (
  <span
    className="image-resize-handle"
    data-image-resize-handle={side}
    aria-hidden="true"
    onPointerDown={(event) => {
      const img = imgRef.current
      if (!img || event.button !== 0) return
      event.preventDefault()
      const startX = event.clientX
      const startWidth = img.getBoundingClientRect().width
      const max = frameRef.current?.parentElement?.clientWidth || Infinity
      const restore = img.style.width
      let previewWidth = startWidth

      const controller = new AbortController()
      const { signal } = controller
      const teardown = () => {
        controller.abort()
        img.style.width = restore
      }

      window.addEventListener(
        'pointermove',
        (move: PointerEvent) => {
          const delta = (move.clientX - startX) * (side === 'right' ? 1 : -1)
          previewWidth = clampWidth(startWidth + delta, max)
          img.style.width = `${previewWidth}px`
        },
        { signal },
      )
      window.addEventListener(
        'pointerup',
        () => {
          teardown()
          // height cleared so the natural aspect ratio follows the new width
          onSetImageLayout(blockId, { width: Math.round(previewWidth), height: undefined })
        },
        { signal, once: true },
      )
      window.addEventListener(
        'keydown',
        (key: KeyboardEvent) => {
          if (key.key === 'Escape') teardown()
        },
        { signal },
      )
    }}
  />
)

export const ImageBlock = ({ block, onSetImageLayout }: BlockChromeProps) => {
  const src = typeof block.attributes?.src === 'string' ? safeHref(block.attributes.src) : undefined
  const alt = typeof block.attributes?.alt === 'string' ? block.attributes.alt : ''
  const width = typeof block.attributes?.width === 'number' ? block.attributes.width : undefined
  const height = typeof block.attributes?.height === 'number' ? block.attributes.height : undefined
  const align = resolveBlockAlign(block.attributes?.align)
  const caption = blockText(block)
  const upload = block.state?.upload

  const frameRef = useRef<HTMLSpanElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  // block-menu upload lifecycle: placeholder while uploading, alert on failure
  if (upload === 'uploading') {
    return (
      <div className="image image-uploading" role="status">
        Uploading {alt || 'image'}…
      </div>
    )
  }

  if (upload === 'error') {
    return (
      <div className="image image-error" role="alert">
        Upload failed{alt ? ` — ${alt}` : ''}
      </div>
    )
  }

  return (
    <div className="image" style={align ? { textAlign: align } : undefined}>
      {src && (
        <span className="image-frame" ref={frameRef}>
          <img ref={imgRef} src={src} alt={alt} draggable={false} width={width} height={height} />
          {onSetImageLayout && (
            <>
              <ImageResizeHandle
                blockId={block.id}
                side="left"
                imgRef={imgRef}
                frameRef={frameRef}
                onSetImageLayout={onSetImageLayout}
              />
              <ImageResizeHandle
                blockId={block.id}
                side="right"
                imgRef={imgRef}
                frameRef={frameRef}
                onSetImageLayout={onSetImageLayout}
              />
              <ImageLayoutControls
                blockId={block.id}
                align={align}
                width={width}
                alt={alt}
                frameRef={frameRef}
                onSetImageLayout={onSetImageLayout}
              />
            </>
          )}
        </span>
      )}
      {caption && <p className="caption">{caption}</p>}
    </div>
  )
}
