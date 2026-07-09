import { externalLinkDomAttrs } from '../../inline/externalLinkProps'
import { staticMarkRenderers } from '../staticRenderers'
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
    toDOM: (mark) => ['a', externalLinkDomAttrs(String(mark.attrs.href)), 0],
  },
  renderStatic: staticMarkRenderers.link,
  toPmAttrs: (mark) => (mark.type === 'link' ? { href: mark.attrs.href } : undefined),
  toSduiMark: (mark) => ({ type: 'link', attrs: { href: String(mark.attrs.href) } }),
}
