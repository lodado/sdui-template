import React from 'react'

import { safeHref } from '../../inline/safeHref'
import type { BlockChromeProps } from '../BlockChrome'
import { blockText } from '../blockText'

export const LinkBlock = ({ block }: BlockChromeProps) => {
  const href = typeof block.attributes?.url === 'string' ? safeHref(block.attributes.url) : undefined
  const label = blockText(block) || (typeof block.attributes?.url === 'string' ? block.attributes.url : '')

  return href ? (
    <a className="embed" href={href} rel="noopener noreferrer nofollow" draggable={false}>
      {label}
    </a>
  ) : (
    <span className="embed">{label}</span>
  )
}
