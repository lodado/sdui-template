import React from 'react'

import { safeHref } from '../../inline/safeHref'
import type { BlockChromeProps } from '../BlockChrome'
import { blockText } from '../blockText'

export const ImageBlock = ({ block }: BlockChromeProps) => {
  const src = typeof block.attributes?.src === 'string' ? safeHref(block.attributes.src) : undefined
  const alt = typeof block.attributes?.alt === 'string' ? block.attributes.alt : ''
  const caption = blockText(block)

  return (
    <div className="image">
      {src && (
        <img
          src={src}
          alt={alt}
          draggable={false}
          width={typeof block.attributes?.width === 'number' ? block.attributes.width : undefined}
          height={typeof block.attributes?.height === 'number' ? block.attributes.height : undefined}
        />
      )}
      {caption && <p className="caption">{caption}</p>}
    </div>
  )
}
