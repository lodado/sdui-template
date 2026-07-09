import type { SduiDocumentBlock } from '@lodado/sdui-document'
import { isSafeHttpUrl } from '@lodado/sdui-document'
import React from 'react'

import { isEmbedAllowed, useEmbedConfig } from './EmbedConfigContext'

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

/**
 * Generic iframe embed, gated by the host allowlist. A URL whose host is not
 * allowed renders a bookmark-style fallback card instead of an iframe — the
 * document data alone never causes an embed.
 */
export const EmbedBlock = ({ block }: { block: SduiDocumentBlock }) => {
  const { allowedHosts } = useEmbedConfig()
  const url = str(block.attributes?.url)
  const height = typeof block.attributes?.height === 'number' ? block.attributes.height : 400

  if (!url || !isSafeHttpUrl(url)) {
    return <div className="sdui-doc-embed sdui-doc-embed--invalid">Invalid embed URL</div>
  }

  if (!isEmbedAllowed(url, allowedHosts)) {
    return (
      <a
        className="sdui-doc-embed-fallback"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        contentEditable={false}
      >
        <span className="sdui-doc-embed-fallback-label">Embedded content</span>
        <span className="sdui-doc-embed-fallback-url">{url}</span>
      </a>
    )
  }

  return (
    <div className="sdui-doc-embed" contentEditable={false}>
      <iframe
        title="Embedded content"
        src={url}
        height={height}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  )
}
