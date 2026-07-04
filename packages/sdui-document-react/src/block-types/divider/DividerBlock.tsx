import React from 'react'

import type { BlockChromeProps } from '../BlockChrome'

export const DividerBlock = ({ block }: BlockChromeProps) => (
  <hr className={block.attributes?.markup === '***' ? 'page-break' : undefined} />
)
