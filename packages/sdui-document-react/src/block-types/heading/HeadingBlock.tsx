import React from 'react'

import type { BlockChromeProps } from '../BlockChrome'

/** Heading levels supported by the chrome — Outline renders h1..h4. */
const MIN_HEADING_LEVEL = 1
const MAX_HEADING_LEVEL = 4

function clampHeadingLevel(level: unknown): number {
  const parsed = typeof level === 'number' ? Math.round(level) : MIN_HEADING_LEVEL

  return Math.min(Math.max(parsed, MIN_HEADING_LEVEL), MAX_HEADING_LEVEL)
}

export const HeadingBlock = ({ block, children }: BlockChromeProps) => {
  const Tag = `h${clampHeadingLevel(block.attributes?.level)}` as 'h1' | 'h2' | 'h3' | 'h4'

  return (
    <Tag dir="auto" className="heading-content">
      {children}
    </Tag>
  )
}
