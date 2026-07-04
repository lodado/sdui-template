import React from 'react'

import { HIGHLIGHT_PALETTE, highlightBackground } from '../marks'

export type HighlightPaletteProps = {
  activeColor: string | null
  onSelect(color: string | null): void
}

/**
 * Highlight color submenu — the 6 Outline presets plus "None"
 * (Outline formatting.tsx highlight submenu shape).
 */
export const HighlightPalette = ({ activeColor, onSelect }: HighlightPaletteProps) => {
  return (
    <div className="sdui-doc-toolbar-palette" role="group" aria-label="Highlight colors">
      <button
        type="button"
        className="sdui-doc-toolbar-swatch"
        data-none
        aria-label="Remove highlight"
        aria-pressed={activeColor === null}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => onSelect(null)}
      >
        ⃠
      </button>
      {HIGHLIGHT_PALETTE.map((preset) => (
        <button
          key={preset.hex}
          type="button"
          className="sdui-doc-toolbar-swatch"
          style={{ backgroundColor: highlightBackground(preset.hex) }}
          aria-label={`Highlight ${preset.name}`}
          aria-pressed={activeColor === preset.hex}
          data-active={activeColor === preset.hex || undefined}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onSelect(preset.hex)}
        />
      ))}
    </div>
  )
}
