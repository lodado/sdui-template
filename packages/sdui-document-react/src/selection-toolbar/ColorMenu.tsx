import React from 'react'

import { highlightBackground } from '../marks'
import { NOTION_COLORS } from '../marks/color/notionColors'

export type ColorMenuProps = {
  /** Active foreground color mark under the selection, if any. */
  activeTextColor: string | null
  /** Active highlight (background) color under the selection, if any. */
  activeHighlight: string | null
  onSetColor(color: string | null): void
  onSetHighlight(color: string | null): void
}

/**
 * Notion-style unified color picker — one popover with a "텍스트 색상" (foreground
 * `color` mark) section and a "배경 색상" (`highlight` mark) section, sharing the
 * Notion palette. Each section leads with a reset ("기본") swatch.
 */
export const ColorMenu = ({ activeTextColor, activeHighlight, onSetColor, onSetHighlight }: ColorMenuProps) => (
  <div className="sdui-doc-color-menu" role="group" aria-label="Colors">
    <div className="sdui-doc-color-section">
      <p className="sdui-doc-color-heading">텍스트 색상</p>
      <div className="sdui-doc-color-grid">
        <button
          type="button"
          className="sdui-doc-color-swatch sdui-doc-color-text"
          data-none
          aria-label="Default text color"
          aria-pressed={activeTextColor === null}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onSetColor(null)}
        >
          A
        </button>
        {NOTION_COLORS.map((color) => (
          <button
            key={`text-${color.hex}`}
            type="button"
            className="sdui-doc-color-swatch sdui-doc-color-text"
            style={{ color: color.hex }}
            aria-label={`Text ${color.name}`}
            aria-pressed={activeTextColor === color.hex}
            data-active={activeTextColor === color.hex || undefined}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onSetColor(color.hex)}
          >
            A
          </button>
        ))}
      </div>
    </div>

    <div className="sdui-doc-color-section">
      <p className="sdui-doc-color-heading">배경 색상</p>
      <div className="sdui-doc-color-grid">
        <button
          type="button"
          className="sdui-doc-color-swatch sdui-doc-color-bg"
          data-none
          aria-label="Default background"
          aria-pressed={activeHighlight === null}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onSetHighlight(null)}
        />
        {NOTION_COLORS.map((color) => (
          <button
            key={`bg-${color.hex}`}
            type="button"
            className="sdui-doc-color-swatch sdui-doc-color-bg"
            style={{ backgroundColor: highlightBackground(color.hex) }}
            aria-label={`Background ${color.name}`}
            aria-pressed={activeHighlight === color.hex}
            data-active={activeHighlight === color.hex || undefined}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onSetHighlight(color.hex)}
          />
        ))}
      </div>
    </div>
  </div>
)
