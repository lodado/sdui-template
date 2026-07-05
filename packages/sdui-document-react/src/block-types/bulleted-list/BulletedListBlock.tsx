import React from 'react'

import type { BlockChromeProps } from '../BlockChrome'

/** Notion marker cycle: depth 1 → disc, 2 → circle, 3 → square, then repeats. */
const BULLET_MARKERS = ['•', '◦', '▪'] as const

export const BulletedListBlock = ({ depth, children }: BlockChromeProps) => (
  <div data-type="bulleted_list_item" className="list-item">
    <span className="list-marker" contentEditable={false}>
      {BULLET_MARKERS[((depth ?? 1) - 1) % BULLET_MARKERS.length]}
    </span>
    <div className="content">{children}</div>
  </div>
)
