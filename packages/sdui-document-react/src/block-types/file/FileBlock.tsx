import React from 'react'

import { safeHref } from '../../inline/safeHref'
import type { BlockChromeProps } from '../BlockChrome'
import { blockText } from '../blockText'

export const FileBlock = ({ block }: BlockChromeProps) => {
  const href = typeof block.attributes?.url === 'string' ? safeHref(block.attributes.url) : undefined
  const name = typeof block.attributes?.name === 'string' ? block.attributes.name : ''
  const label = name || blockText(block)

  return href ? (
    <a className="attachment" href={href} download={name || undefined} data-size={block.attributes?.size}>
      {label}
    </a>
  ) : (
    <span className="attachment">{label}</span>
  )
}
