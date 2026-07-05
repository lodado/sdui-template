import { safeHref } from '../inline/safeHref'

/** Normalizes toolbar link input: bare domains get https://, unsafe schemes are rejected. */
export function normalizeLinkHref(input: string): string | null {
  const candidate = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(input) ? input : `https://${input}`

  return safeHref(candidate) ?? null
}
