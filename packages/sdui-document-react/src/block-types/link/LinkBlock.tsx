import React from 'react'

import { externalLinkProps } from '../../inline/externalLinkProps'
import { safeHref } from '../../inline/safeHref'
import type { BlockChromeProps } from '../BlockChrome'
import { blockText } from '../blockText'

function resolveLinkHref(block: BlockChromeProps['block']): string | undefined {
  const hrefAttr = block.attributes?.href
  const urlAttr = block.attributes?.url
  const raw = typeof hrefAttr === 'string' ? hrefAttr : typeof urlAttr === 'string' ? urlAttr : undefined
  return raw ? safeHref(raw) : undefined
}

export const LinkBlock = ({ block }: BlockChromeProps) => {
  const href = resolveLinkHref(block)
  const fallback =
    blockText(block) ||
    (typeof block.attributes?.href === 'string'
      ? block.attributes.href
      : typeof block.attributes?.url === 'string'
      ? block.attributes.url
      : '')

  return href ? (
    <a {...externalLinkProps(href)}>{fallback}</a>
  ) : (
    <span className="sdui-doc-link-fallback">{fallback}</span>
  )
}
