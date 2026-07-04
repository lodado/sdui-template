import React from 'react'

import { safeHref } from '../../inline/safeHref'
import type { SduiMarkDefinition } from '../types'

/**
 * Outline marks/Link.tsx — <a>, inclusive:false so typing at the edge
 * doesn't extend the link. Static hrefs are scheme-whitelisted via safeHref;
 * unsafe URLs render as a plain span (no navigable href emitted).
 */
export const linkMark: SduiMarkDefinition = {
  name: 'link',
  spec: {
    attrs: { href: {} },
    inclusive: false,
    parseDOM: [
      {
        tag: 'a[href]',
        getAttrs: (dom) => ({ href: (dom as HTMLElement).getAttribute('href') }),
      },
    ],
    // draggable=false: dragging a link mark must not start a native link drag —
    // inline text drag works off the selection, not the anchor element
    toDOM: (mark) => [
      'a',
      { href: String(mark.attrs.href), rel: 'noopener noreferrer nofollow', draggable: 'false' },
      0,
    ],
  },
  renderStatic: (children, mark) => {
    if (mark.type !== 'link') {
      return children
    }

    const href = safeHref(mark.attrs.href)

    return href ? (
      <a href={href} rel="noopener noreferrer nofollow" draggable={false}>
        {children}
      </a>
    ) : (
      <span>{children}</span>
    )
  },
  toPmAttrs: (mark) => (mark.type === 'link' ? { href: mark.attrs.href } : undefined),
  toSduiMark: (mark) => ({ type: 'link', attrs: { href: String(mark.attrs.href) } }),
}
