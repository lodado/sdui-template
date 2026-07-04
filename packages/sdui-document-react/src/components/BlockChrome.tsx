import type { SduiDocumentBlock } from '@lodado/sdui-document'
import React from 'react'

import { safeHref } from './safeHref'

/** Heading levels supported by the chrome — Outline renders h1..h4. */
const MIN_HEADING_LEVEL = 1
const MAX_HEADING_LEVEL = 4

const CALLOUT_STYLES = new Set(['info', 'warning', 'tip', 'success'])

export type BlockChromeProps = {
  block: SduiDocumentBlock
  /** Checklist checkbox toggle — omitted (readOnly) renders a non-interactive box. */
  onToggleChecked?(blockId: string, checked: boolean): void
  /** Inline content: static InlineContentView or the focused ProseMirror editor. */
  children?: React.ReactNode
}

function clampHeadingLevel(level: unknown): number {
  const parsed = typeof level === 'number' ? Math.round(level) : MIN_HEADING_LEVEL

  return Math.min(Math.max(parsed, MIN_HEADING_LEVEL), MAX_HEADING_LEVEL)
}

function calloutStyle(style: unknown): string {
  return typeof style === 'string' && CALLOUT_STYLES.has(style) ? style : 'info'
}

function blockText(block: SduiDocumentBlock): string {
  const text = block.state?.text

  return typeof text === 'string' ? text : ''
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

const Checkbox = ({ checked, onToggle }: { checked: boolean; onToggle?(next: boolean): void }) => (
  <span contentEditable={false}>
    <button
      type="button"
      className="checkbox"
      role="checkbox"
      aria-checked={checked}
      disabled={!onToggle}
      onClick={() => onToggle?.(!checked)}
    >
      <svg viewBox="0 0 16 16" aria-hidden focusable="false">
        <rect className="checkbox-box" x="1" y="1" width="14" height="14" rx="3" />
        <path className="checkbox-tick" d="M4.5 8.5 7 11l4.5-5.5" />
      </svg>
    </button>
  </span>
)

/**
 * Type-appropriate semantic wrapper for a block — tags and class names ported
 * from Outline's node toDOM definitions (shared/editor/nodes/*).
 *
 * Text blocks wrap `children` (static view or the focused PM editor) so the
 * typography is identical in both states. Non-text blocks (divider/image/
 * file/link) render themselves entirely and ignore `children`.
 *
 * Policies:
 * - heading level clamps to 1..4 (Outline's supported range)
 * - callout style falls back to "info" outside info/warning/tip/success
 * - image src and file/link hrefs are scheme-whitelisted via safeHref;
 *   unsafe URLs render without the attribute (span fallback for anchors)
 */
export const BlockChrome = ({ block, onToggleChecked, children }: BlockChromeProps) => {
  switch (block.type) {
    case 'document.heading': {
      const Tag = `h${clampHeadingLevel(block.attributes?.level)}` as 'h1' | 'h2' | 'h3' | 'h4'

      return (
        <Tag dir="auto" className="heading-content">
          {children}
        </Tag>
      )
    }

    case 'document.checklist': {
      const checked = block.attributes?.checked === true

      return (
        <div data-type="checkbox_item" className={checked ? 'checked' : undefined}>
          <Checkbox
            checked={checked}
            onToggle={onToggleChecked ? (next) => onToggleChecked(block.id, next) : undefined}
          />
          <div className="content">{children}</div>
        </div>
      )
    }

    case 'document.callout': {
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

    case 'document.divider':
      return <hr className={block.attributes?.markup === '***' ? 'page-break' : undefined} />

    case 'document.image': {
      const src = typeof block.attributes?.src === 'string' ? safeHref(block.attributes.src) : undefined
      const alt = typeof block.attributes?.alt === 'string' ? block.attributes.alt : ''
      const caption = blockText(block)

      return (
        <div className="image">
          {src && (
            <img
              src={src}
              alt={alt}
              width={typeof block.attributes?.width === 'number' ? block.attributes.width : undefined}
              height={typeof block.attributes?.height === 'number' ? block.attributes.height : undefined}
            />
          )}
          {caption && <p className="caption">{caption}</p>}
        </div>
      )
    }

    case 'document.file': {
      const href = typeof block.attributes?.url === 'string' ? safeHref(block.attributes.url) : undefined
      const name = typeof block.attributes?.name === 'string' ? block.attributes.name : ''
      const label = name || blockText(block)

      return href ? (
        <a className="attachment" href={href} download={name || undefined} data-size={block.attributes?.size}>
          {label}
        </a>
      ) : (
        <span className="attachment">{label}</span>
      )
    }

    case 'document.link': {
      const href = typeof block.attributes?.url === 'string' ? safeHref(block.attributes.url) : undefined
      const label = blockText(block) || (typeof block.attributes?.url === 'string' ? block.attributes.url : '')

      return href ? (
        <a className="embed" href={href} rel="noopener noreferrer nofollow">
          {label}
        </a>
      ) : (
        <span className="embed">{label}</span>
      )
    }

    case 'document.paragraph':
    default:
      return <p dir="auto">{children}</p>
  }
}
