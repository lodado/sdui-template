/** Safe external navigation — blocks tab-nabbing and omits referrer. */
export const EXTERNAL_LINK_REL = 'noopener noreferrer nofollow'

const EXTERNAL_LINK_CLASS = 'sdui-doc-link'

/** React anchor props for whitelisted external URLs. */
export function externalLinkProps(href: string) {
  return {
    href,
    target: '_blank' as const,
    rel: EXTERNAL_LINK_REL,
    draggable: false as const,
    className: EXTERNAL_LINK_CLASS,
  }
}

/** ProseMirror toDOM attrs for whitelisted external URLs. */
export function externalLinkDomAttrs(href: string) {
  return {
    href,
    target: '_blank',
    rel: EXTERNAL_LINK_REL,
    draggable: 'false',
    class: EXTERNAL_LINK_CLASS,
  }
}
