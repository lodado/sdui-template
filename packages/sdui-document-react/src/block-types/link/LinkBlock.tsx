import React from 'react'

import { externalLinkProps } from '../../inline/externalLinkProps'
import { safeHref } from '../../inline/safeHref'
import type { BlockChromeProps } from '../BlockChrome'
import { blockText } from '../blockText'

function stringAttr(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function resolveLinkHref(block: BlockChromeProps['block']): string | undefined {
  const raw = stringAttr(block.attributes?.href) ?? stringAttr(block.attributes?.url)
  return raw ? safeHref(raw) : undefined
}

export const LinkBlock = ({ block }: BlockChromeProps) => {
  const href = resolveLinkHref(block)
  const fallback = blockText(block) || stringAttr(block.attributes?.href) || stringAttr(block.attributes?.url) || ''

  return href ? (
    <a {...externalLinkProps(href)}>{fallback}</a>
  ) : (
    <span className="sdui-doc-link-fallback">{fallback}</span>
  )
}
