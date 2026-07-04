import React from 'react'

import { safeHref } from '../../inline/safeHref'
import type { BlockChromeProps } from '../BlockChrome'
import { blockText } from '../blockText'

export const FileBlock = ({ block }: BlockChromeProps) => {
  const href = typeof block.attributes?.url === 'string' ? safeHref(block.attributes.url) : undefined
  const name = typeof block.attributes?.name === 'string' ? block.attributes.name : ''
  const label = name || blockText(block)
  const upload = block.state?.upload

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

  return href ? (
    <a
      className="attachment"
      href={href}
      download={name || undefined}
      data-size={block.attributes?.size}
      draggable={false}
    >
      {label}
    </a>
  ) : (
    <span className="attachment">{label}</span>
  )
}
