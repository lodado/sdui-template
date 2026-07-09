import type { SduiDocumentBlock, VideoProvider } from '@lodado/sdui-document'
import { videoEmbedUrl, videoThumbnailUrl } from '@lodado/sdui-document'
import React, { useState } from 'react'

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

/**
 * YouTube / Vimeo embed with a facade: the thumbnail (or a play button) shows
 * first, and the iframe only mounts on click — protects LCP/TBT.
 */
export const VideoBlock = ({ block }: { block: SduiDocumentBlock }) => {
  const [active, setActive] = useState(false)
  const provider = str(block.attributes?.provider) as VideoProvider | undefined
  const videoId = str(block.attributes?.videoId)
  const aspect = str(block.attributes?.aspectRatio) === '4:3' ? '4 / 3' : '16 / 9'

  if (!provider || !videoId) {
    return <div className="sdui-doc-video sdui-doc-video--invalid">Invalid video</div>
  }

  const parsed = { provider, videoId }
  const thumbnail = videoThumbnailUrl(parsed)

  return (
    <div className="sdui-doc-video" style={{ aspectRatio: aspect }} contentEditable={false}>
      {active ? (
        <iframe
          title="Embedded video"
          src={`${videoEmbedUrl(parsed)}?autoplay=1`}
          loading="lazy"
          allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-presentation"
          allowFullScreen
        />
      ) : (
        <button type="button" className="sdui-doc-video-facade" onClick={() => setActive(true)} aria-label="Play video">
          {thumbnail ? <img src={thumbnail} alt="" loading="lazy" /> : <span className="sdui-doc-video-bg" />}
          <span className="sdui-doc-video-play" aria-hidden>
            ▶
          </span>
        </button>
      )}
    </div>
  )
}
