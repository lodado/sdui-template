/** True only for http/https URLs — the scheme whitelist for embed-family blocks. */
export function isSafeHttpUrl(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false
  }
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export type VideoProvider = 'youtube' | 'vimeo'
export type ParsedVideo = { provider: VideoProvider; videoId: string }

const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com'])

/**
 * Parse a YouTube / Vimeo watch URL into { provider, videoId }. Returns
 * undefined for anything else — callers must reject (video blocks only accept
 * parseable URLs; other URLs go to bookmark/embed).
 */
export function parseVideoUrl(value: string): ParsedVideo | undefined {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    return undefined
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return undefined
  }

  const host = url.hostname.toLowerCase()

  if (host === 'youtu.be') {
    const id = url.pathname.slice(1).split('/')[0]
    return id ? { provider: 'youtube', videoId: id } : undefined
  }
  if (YOUTUBE_HOSTS.has(host)) {
    if (url.pathname === '/watch') {
      const id = url.searchParams.get('v')
      return id ? { provider: 'youtube', videoId: id } : undefined
    }
    const shortsMatch = url.pathname.match(/^\/(shorts|embed)\/([^/?]+)/)
    if (shortsMatch) {
      return { provider: 'youtube', videoId: shortsMatch[2] }
    }
    return undefined
  }
  if (host === 'vimeo.com' || host === 'www.vimeo.com' || host === 'player.vimeo.com') {
    const id = url.pathname.match(/(\d+)/)?.[1]
    return id ? { provider: 'vimeo', videoId: id } : undefined
  }

  return undefined
}

/** Build the privacy-enhanced embed URL for a parsed video. */
export function videoEmbedUrl({ provider, videoId }: ParsedVideo): string {
  return provider === 'youtube'
    ? `https://www.youtube-nocookie.com/embed/${videoId}`
    : `https://player.vimeo.com/video/${videoId}`
}

/** YouTube thumbnail (facade image shown before the iframe mounts). */
export function videoThumbnailUrl({ provider, videoId }: ParsedVideo): string | undefined {
  return provider === 'youtube' ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : undefined
}
