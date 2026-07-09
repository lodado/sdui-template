import type { SduiDocumentBlock } from '@lodado/sdui-document'
import { isSafeHttpUrl } from '@lodado/sdui-document'
import React from 'react'

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

/**
 * Notion-style link-preview card. Metadata is read from persisted attributes —
 * no network at render. Missing metadata degrades to a URL-only card.
 */
export const BookmarkBlock = ({ block }: { block: SduiDocumentBlock }) => {
  const url = str(block.attributes?.url)
  if (!url || !isSafeHttpUrl(url)) {
    return <div className="sdui-doc-bookmark sdui-doc-bookmark--invalid">Invalid bookmark URL</div>
  }

  const title = str(block.attributes?.title) ?? hostname(url)
  const description = str(block.attributes?.description)
  const imageUrl = str(block.attributes?.imageUrl)
  const faviconUrl = str(block.attributes?.faviconUrl)

  return (
    <a className="sdui-doc-bookmark" href={url} target="_blank" rel="noopener noreferrer" contentEditable={false}>
      <span className="sdui-doc-bookmark-text">
        <span className="sdui-doc-bookmark-title">{title}</span>
        {description ? <span className="sdui-doc-bookmark-desc">{description}</span> : null}
        <span className="sdui-doc-bookmark-host">
          {faviconUrl ? <img src={faviconUrl} alt="" width={16} height={16} loading="lazy" /> : null}
          {hostname(url)}
        </span>
      </span>
      {imageUrl ? (
        <span className="sdui-doc-bookmark-thumb">
          <img src={imageUrl} alt="" loading="lazy" />
        </span>
      ) : null}
    </a>
  )
}
