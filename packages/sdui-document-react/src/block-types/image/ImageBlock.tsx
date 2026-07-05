import { type BlockAlign, resolveBlockAlign } from '@lodado/sdui-document'
import * as Popover from '@radix-ui/react-popover'
import React from 'react'

import { safeHref } from '../../inline/safeHref'
import type { BlockChromeProps } from '../BlockChrome'
import { blockText } from '../blockText'

const ALIGN_OPTIONS: ReadonlyArray<{ value: BlockAlign; label: string; glyph: string }> = [
  { value: 'left', label: 'Align image left', glyph: '⇤' },
  { value: 'center', label: 'Align image center', glyph: '↔' },
  { value: 'right', label: 'Align image right', glyph: '⇥' },
]

type ImageLayoutControlsProps = {
  blockId: string
  align: BlockAlign | undefined
  width: number | undefined
  onSetImageLayout: NonNullable<BlockChromeProps['onSetImageLayout']>
}

/**
 * Notion-style image controls: a trigger button revealed on hover/focus of the
 * image, opening a Radix Popover with alignment + width. Rendered only in
 * editable mode. Marked contentEditable=false so it never enters the doc model.
 */
const ImageLayoutControls = ({ blockId, align, width, onSetImageLayout }: ImageLayoutControlsProps) => (
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
            min={40}
            step={10}
            placeholder="auto"
            aria-label="Image width in pixels"
            value={width ?? ''}
            onChange={(event) => {
              const next = event.target.valueAsNumber
              onSetImageLayout(blockId, { width: Number.isFinite(next) && next > 0 ? next : undefined })
            }}
          />
          px
        </label>
      </div>
    </Popover.Content>
  </Popover.Root>
)

export const ImageBlock = ({ block, onSetImageLayout }: BlockChromeProps) => {
  const src = typeof block.attributes?.src === 'string' ? safeHref(block.attributes.src) : undefined
  const alt = typeof block.attributes?.alt === 'string' ? block.attributes.alt : ''
  const width = typeof block.attributes?.width === 'number' ? block.attributes.width : undefined
  const height = typeof block.attributes?.height === 'number' ? block.attributes.height : undefined
  const align = resolveBlockAlign(block.attributes?.align)
  const caption = blockText(block)
  const upload = block.state?.upload

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
        <span className="image-frame">
          <img src={src} alt={alt} draggable={false} width={width} height={height} />
          {onSetImageLayout && (
            <ImageLayoutControls blockId={block.id} align={align} width={width} onSetImageLayout={onSetImageLayout} />
          )}
        </span>
      )}
      {caption && <p className="caption">{caption}</p>}
    </div>
  )
}
