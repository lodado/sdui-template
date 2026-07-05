import React from 'react'

import type { BlockChromeProps } from '../BlockChrome'

/** Ordinal arrives via props — computed from siblings at render, never stored. */
export const NumberedListBlock = ({ listOrdinal, children }: BlockChromeProps) => (
  <div data-type="numbered_list_item" className="list-item">
    <span className="list-marker list-marker-number" contentEditable={false}>
      {`${listOrdinal ?? 1}.`}
    </span>
    <div className="content">{children}</div>
  </div>
)
