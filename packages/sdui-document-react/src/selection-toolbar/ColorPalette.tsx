import React from 'react'

import { TEXT_COLOR_PALETTE } from '../marks/color/palette'

export type ColorPaletteProps = {
  activeColor: string | null
  onSelect(color: string | null): void
}

/** Foreground text-color submenu — presets plus "None" (mirrors HighlightPalette). */
export const ColorPalette = ({ activeColor, onSelect }: ColorPaletteProps) => {
  return (
    <div className="sdui-doc-toolbar-palette" role="group" aria-label="Text colors">
      <button
        type="button"
        className="sdui-doc-toolbar-swatch"
        data-none
        aria-label="Remove text color"
        aria-pressed={activeColor === null}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => onSelect(null)}
      >
        ⃠
      </button>
      {TEXT_COLOR_PALETTE.map((preset) => (
        <button
          key={preset.hex}
          type="button"
          className="sdui-doc-toolbar-swatch"
          style={{ color: preset.hex }}
          aria-label={`Text color ${preset.name}`}
          aria-pressed={activeColor === preset.hex}
          data-active={activeColor === preset.hex || undefined}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onSelect(preset.hex)}
        >
          A
        </button>
      ))}
    </div>
  )
}
