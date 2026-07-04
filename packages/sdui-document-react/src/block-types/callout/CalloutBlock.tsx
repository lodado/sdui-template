import React from 'react'

import type { BlockChromeProps } from '../BlockChrome'

const CALLOUT_STYLES = new Set(['info', 'warning', 'tip', 'success'])

function calloutStyle(style: unknown): string {
  return typeof style === 'string' && CALLOUT_STYLES.has(style) ? style : 'info'
}

/** Minimal glyphs standing in for Outline's icon set (outline-icons). */
const CALLOUT_ICON_PATHS: Record<string, string> = {
  info: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z',
  warning: 'M12 3 2 21h20L12 3Zm1 13h-2v2h2v-2Zm0-6h-2v4h2v-4Z',
  tip: 'm12 2 2.4 7.2H22l-6 4.6 2.3 7.2-6.3-4.5-6.3 4.5L8 13.8 2 9.2h7.6L12 2Z',
  success: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.2 14.5-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4-7 7Z',
}

const CalloutIcon = ({ style }: { style: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden focusable="false">
    <path d={CALLOUT_ICON_PATHS[style]} />
  </svg>
)

export const CalloutBlock = ({ block, children }: BlockChromeProps) => {
  const style = calloutStyle(block.attributes?.style)

  return (
    <div className={`notice-block ${style}`}>
      <div className="icon">
        <CalloutIcon style={style} />
      </div>
      <div className="content">{children}</div>
    </div>
  )
}
