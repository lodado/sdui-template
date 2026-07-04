const SAFE_LINK_PROTOCOLS = ['http:', 'https:', 'mailto:', 'tel:']

/**
 * Scheme-whitelists a URL for use in href/src attributes.
 *
 * @param href - candidate URL (absolute or relative)
 * @returns the original string when its protocol is http/https/mailto/tel,
 *          undefined otherwise (caller must omit the attribute)
 */
export function safeHref(href: string): string | undefined {
  try {
    // Relative hrefs resolve against the dummy https base and stay allowed.
    const { protocol } = new URL(href, 'https://relative.invalid')

    return SAFE_LINK_PROTOCOLS.includes(protocol) ? href : undefined
  } catch {
    return undefined
  }
}
