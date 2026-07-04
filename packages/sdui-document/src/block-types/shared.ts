// packages/sdui-document/src/block-types/shared.ts
import type { SduiDocumentBlock } from '../blocks/schema/block'
import type { SduiLayoutLikeNode } from './types'

export function blockText(block: SduiDocumentBlock): string {
  return typeof block.state?.text === 'string' ? block.state.text : ''
}

const ALLOWED_HREF_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:'])

export function sanitizeHref(href: unknown): string | undefined {
  if (typeof href !== 'string') {
    return undefined
  }

  try {
    const url = new URL(href)
    return ALLOWED_HREF_SCHEMES.has(url.protocol) ? href : undefined
  } catch {
    if (/^javascript:/i.test(href) || /^data:/i.test(href)) {
      return undefined
    }
    return href
  }
}

export function textChild(id: string, text: unknown, className?: string): SduiLayoutLikeNode {
  return {
    id,
    type: 'Span',
    state: { text: typeof text === 'string' ? text : '' },
    attributes: className ? { className } : undefined,
  }
}

export function stripKeys(attrs: Record<string, unknown>, ...keys: string[]): Record<string, unknown> {
  return Object.keys(attrs)
    .filter((k) => !keys.includes(k))
    .reduce<Record<string, unknown>>((acc, k) => ({ ...acc, [k]: attrs[k] }), {})
}

export function stateText(node: SduiLayoutLikeNode): string {
  return typeof node.state?.text === 'string' ? node.state.text : ''
}

export function realBlockChildren(node: SduiLayoutLikeNode): SduiLayoutLikeNode[] {
  return (node.children ?? []).filter((child) => typeof child.attributes?.['data-block-type'] === 'string')
}
