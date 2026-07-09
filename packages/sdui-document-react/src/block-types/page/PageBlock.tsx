import React from 'react'

import { useSduiPage } from '../../page/SduiPageContext'
import type { BlockChromeProps } from '../BlockChrome'
import { blockText } from '../blockText'

const DEFAULT_PAGE_ICON = '📄'

function stringAttr(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

/**
 * Sub-page reference row. Click opens the target document through the page
 * context (host navigator); the hover action opens a side peek. Outside a
 * provider — or without a documentId — it renders as an inert row.
 */
export const PageBlock = ({ block }: BlockChromeProps) => {
  const page = useSduiPage()
  const documentId = stringAttr(block.attributes?.documentId)
  const icon = stringAttr(block.attributes?.icon) ?? DEFAULT_PAGE_ICON
  const title = blockText(block) || 'Untitled'

  if (!page || !documentId) {
    return (
      <div className="sdui-doc-page-block sdui-doc-page-block--inert">
        <span className="sdui-doc-page-icon" aria-hidden>
          {icon}
        </span>
        <span className="sdui-doc-page-title">{title}</span>
      </div>
    )
  }

  return (
    <div className="sdui-doc-page-block">
      <button
        type="button"
        className="sdui-doc-page-open"
        onClick={(event) => {
          event.stopPropagation()
          page.open(documentId)
        }}
      >
        <span className="sdui-doc-page-icon" aria-hidden>
          {icon}
        </span>
        <span className="sdui-doc-page-title">{title}</span>
      </button>
      <button
        type="button"
        className="sdui-doc-page-peek"
        aria-label="Open in side peek"
        onClick={(event) => {
          event.stopPropagation()
          page.open(documentId, 'peek')
        }}
      >
        ⧉
      </button>
    </div>
  )
}
