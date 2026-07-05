import React from 'react'

import type { BlockChromeProps } from '../BlockChrome'

const CALLOUT_TONES = new Set(['info', 'warning', 'tip', 'success'])

function calloutTone(tone: unknown): string {
  return typeof tone === 'string' && CALLOUT_TONES.has(tone) ? tone : 'info'
}

/** Minimal glyphs standing in for Outline's icon set (outline-icons). */
const CALLOUT_ICON_PATHS: Record<string, string> = {
  info: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z',
  warning: 'M12 3 2 21h20L12 3Zm1 13h-2v2h2v-2Zm0-6h-2v4h2v-4Z',
  tip: 'm12 2 2.4 7.2H22l-6 4.6 2.3 7.2-6.3-4.5-6.3 4.5L8 13.8 2 9.2h7.6L12 2Z',
  success: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.2 14.5-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4-7 7Z',
}

const CalloutIcon = ({ tone }: { tone: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden focusable="false">
    <path d={CALLOUT_ICON_PATHS[tone]} />
  </svg>
)

export const CalloutBlock = ({ block, children }: BlockChromeProps) => {
  // Schema + mapper store the variant under `tone`; older docs may use `style`.
  const tone = calloutTone(block.attributes?.tone ?? block.attributes?.style)

  return (
    <div className={`notice-block ${tone}`}>
      <div className="icon">
        <CalloutIcon tone={tone} />
      </div>
      <div className="content">{children}</div>
    </div>
  )
}
