import React from 'react'

import { safeHref } from '../../inline/safeHref'
import type { BlockChromeProps } from '../BlockChrome'
import { blockText } from '../blockText'

// ponytail: one generic document glyph; PDF just recolors via .is-pdf.
// Add per-extension glyphs here when more file types need to be distinguished.
const FileIcon = () => (
  <svg className="attachment-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path
      d="M5 2.5h6l4 4V16a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 4 16V4A1.5 1.5 0 0 1 5 2.5Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path d="M11 2.5V6a1 1 0 0 0 1 1h3" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
)

const formatSize = (size: unknown): string | undefined => {
  if (typeof size === 'string') return size || undefined
  if (typeof size !== 'number' || !Number.isFinite(size) || size <= 0) return undefined

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let value = size
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  const rounded = value < 10 && unit > 0 ? value.toFixed(1) : Math.round(value).toString()
  return `${rounded} ${units[unit]}`
}

export const FileBlock = ({ block }: BlockChromeProps) => {
  const href = typeof block.attributes?.url === 'string' ? safeHref(block.attributes.url) : undefined
  const name = typeof block.attributes?.name === 'string' ? block.attributes.name : ''
  const label = name || blockText(block)
  const upload = block.state?.upload
  const size = formatSize(block.attributes?.size)
  const isPdf = label.toLowerCase().endsWith('.pdf')

  // block-menu upload lifecycle: placeholder while uploading, alert on failure
  if (upload === 'uploading') {
    return (
      <div className="attachment attachment-uploading" role="status">
        Uploading {label || 'file'}…
      </div>
    )
  }

  if (upload === 'error') {
    return (
      <div className="attachment attachment-error" role="alert">
        Upload failed{label ? ` — ${label}` : ''}
      </div>
    )
  }

  const body = (
    <>
      <FileIcon />
      <span className="attachment-body">
        <span className="attachment-name">{label}</span>
        {size ? <span className="attachment-size">{size}</span> : null}
      </span>
    </>
  )

  const className = `attachment${isPdf ? ' is-pdf' : ''}`

  return href ? (
    <a
      className={className}
      href={href}
      download={name || undefined}
      data-size={block.attributes?.size}
      draggable={false}
    >
      {body}
    </a>
  ) : (
    <span className={className}>{body}</span>
  )
}
