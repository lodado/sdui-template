import { collectHeadings } from '@lodado/sdui-document'
import React from 'react'

import { useDocumentContent } from '../../editor/DocumentContentContext'

/** Scrolls to the heading block and moves focus to it. */
function goToHeading(id: string): void {
  const el = document.querySelector<HTMLElement>(`[data-block-id="${id}"]`)
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  el?.focus?.()
}

/**
 * Auto table of contents. Derives its entries live from the document's heading
 * blocks via the DocumentContentContext, so it needs no stored state and updates
 * as headings change.
 */
export const TocBlock = () => {
  const content = useDocumentContent()
  const headings = content ? collectHeadings(content) : []

  if (headings.length === 0) {
    return <div className="toc-block toc-block--empty">Add headings to build a table of contents</div>
  }

  return (
    <nav className="toc-block" aria-label="Table of contents">
      {headings.map((heading) => (
        <button
          key={heading.id}
          type="button"
          className={`toc-block__item toc-block__item--l${heading.level}`}
          style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
          onClick={() => goToHeading(heading.id)}
        >
          {heading.text}
        </button>
      ))}
    </nav>
  )
}
