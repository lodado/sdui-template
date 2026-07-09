import type { SduiInlineMark } from '@lodado/sdui-document'
import React from 'react'

import { externalLinkProps } from '../inline/externalLinkProps'
import { safeHref } from '../inline/safeHref'
import { highlightBackground } from './highlight/palette'

// Static (non-ProseMirror) mark renderers, split out from the mark definition
// files so the read-only viewer entry can render marks without pulling
// prosemirror-commands/prosemirror-inputrules into its import graph.
// Each renderer must stay visually identical to its mark's `spec.toDOM`.

export type StaticMarkRenderer = (children: React.ReactNode, mark: SduiInlineMark) => React.ReactNode

export const staticMarkRenderers: Record<string, StaticMarkRenderer> = {
  bold: (children) => <strong>{children}</strong>,
  italic: (children) => <em>{children}</em>,
  strikethrough: (children) => <del>{children}</del>,
  underline: (children) => <u>{children}</u>,
  code: (children) => <code className="inline">{children}</code>,
  highlight: (children, mark) => {
    if (mark.type !== 'highlight') {
      return children
    }

    return (
      <mark data-color={mark.attrs.color} style={{ backgroundColor: highlightBackground(mark.attrs.color) }}>
        {children}
      </mark>
    )
  },
  color: (children, mark) => {
    if (mark.type !== 'color') {
      return children
    }

    return (
      <span data-text-color={mark.attrs.color} style={{ color: mark.attrs.color }}>
        {children}
      </span>
    )
  },
  link: (children, mark) => {
    if (mark.type !== 'link') {
      return children
    }

    const href = safeHref(mark.attrs.href)

    return href ? <a {...externalLinkProps(href)}>{children}</a> : <span>{children}</span>
  },
}
