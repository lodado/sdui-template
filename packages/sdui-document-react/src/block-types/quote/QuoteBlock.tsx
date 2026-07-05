import React from 'react'

import type { BlockChromeProps } from '../BlockChrome'

export const QuoteBlock = ({ children }: BlockChromeProps) => (
  <blockquote className="quote-block">{children}</blockquote>
)
