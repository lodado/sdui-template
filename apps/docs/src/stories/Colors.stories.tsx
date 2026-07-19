import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { Colors } from './Colors'

const meta: Meta<typeof Colors> = {
  title: 'Design System/Colors',
  component: Colors,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Overview

A comprehensive color palette extracted from the **Jira Design System**. This component automatically parses CSS custom properties (CSS variables) from the design system files and displays them in an organized, categorized grid.

## Features

- **Automatic parsing**: Extracts color variables from CSS files
- **Categorized display**: Colors grouped by logical categories
- **Complete information**: Each swatch shows variable name, CSS reference, and color value
- **Design system integration**: Based on Jira Design System specifications

## Categories

Colors are organized into the following categories:
- Background
- Text
- Border
- Icon
- Link
- Chart
- Interaction
- Skeleton
- Blanket

## Source

[View in Figma](https://www.figma.com/design/RXclnIXmr2835BdXOKBJDL/ADS-Foundations--Community-?node-id=14439-10399&p=f&t=i4NwiBe0wp852FUm-0)
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Colors>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: `
## Overview

Displays the complete color palette organized by category, providing a visual reference for all available colors in the design system.

## Display Format

Each color is presented as a **swatch** containing:
- **Color name**: Human-readable identifier
- **CSS variable**: Reference like \`--color-background-default\`
- **Color value**: Actual hex/rgb value

## Organization

Colors are automatically:
- Extracted from design system CSS files
- Grouped into logical categories
- Sorted for easy reference

## Usage

Use this palette to:
- Find the right color for your design
- Reference CSS variable names in code
- Ensure consistency across the application
        `,
      },
    },
  },
}

// Brand ramp is the only primitive ramp defined as real CSS variables, and the
// auto-parser above only reads --color-*, so it gets its own story.
const BRAND_RAMP = [
  ['100', '#e6faf7'],
  ['200', '#c3f0e9'],
  ['250', '#9fe5db'],
  ['300', '#79d8cb'],
  ['400', '#45c7b6'],
  ['500', '#0d9488'],
  ['600', '#0f857c'],
  ['700', '#0f766e'],
  ['800', '#115e58'],
  ['850', '#134c47'],
  ['900', '#123c38'],
  ['1000', '#16302d'],
] as const

const luminance = (hex: string): number => {
  const channel = (offset: number) => {
    const c = parseInt(hex.slice(offset, offset + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5)
}

const contrastRatio = (hexA: string, hexB: string): string => {
  const [hi, lo] = [luminance(hexA), luminance(hexB)].sort((a, b) => b - a)
  return `${((hi + 0.05) / (lo + 0.05)).toFixed(2)}:1`
}

// theme, pair, foreground, background, WCAG requirement — mirrors colors.test.ts
const CONTRAST_CHECKS = [
  ['light', 'inverse text on brand bold', '#ffffff', '#0f766e', '4.5:1'],
  ['light', 'brand text on surface', '#0f766e', '#ffffff', '4.5:1'],
  ['light', 'focus ring on surface', '#0d9488', '#ffffff', '3:1'],
  ['dark', 'inverse text on brand bold', '#1f1f21', '#45c7b6', '4.5:1'],
  ['dark', 'brand text on surface', '#45c7b6', '#1d2220', '4.5:1'],
  ['dark', 'focus ring on surface', '#79d8cb', '#1d2220', '3:1'],
] as const

const monoStyle: React.CSSProperties = { fontFamily: 'monospace', fontSize: 13 }
const cellStyle: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }

export const BrandRamp: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Scan Teal brand primitives (`--brand-100..1000`). Brand/selected/link/focus semantics map onto this ramp: ' +
          'light bold = 700, dark bold = 400. Information stays blue, visited links stay purple.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', maxWidth: 720 }}>
      {BRAND_RAMP.map(([level, hex]) => (
        <div key={level} style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ background: `var(--brand-${level}, ${hex})`, height: 56 }} />
          <div style={{ ...monoStyle, marginTop: 4 }}>{level}</div>
          <div style={{ ...monoStyle, color: '#6b7280' }}>{hex}</div>
        </div>
      ))}
    </div>
  ),
}

export const ContrastMatrix: Story = {
  parameters: {
    docs: {
      description: {
        story: 'WCAG AA boundaries enforced by `colors.test.ts` in `@lodado/sdui-design-files`.',
      },
    },
  },
  render: () => (
    <table style={{ borderCollapse: 'collapse', maxWidth: 720 }}>
      <thead>
        <tr>
          <th style={cellStyle}>theme</th>
          <th style={cellStyle}>pair</th>
          <th style={cellStyle}>ratio</th>
          <th style={cellStyle}>required</th>
        </tr>
      </thead>
      <tbody>
        {CONTRAST_CHECKS.map(([theme, label, fg, bg, required]) => (
          <tr key={`${theme}-${label}`}>
            <td style={cellStyle}>{theme}</td>
            <td style={cellStyle}>
              <span style={{ background: bg, color: fg, padding: '2px 8px', borderRadius: 4 }}>{label}</span>
            </td>
            <td style={{ ...cellStyle, ...monoStyle }}>{contrastRatio(fg, bg)}</td>
            <td style={{ ...cellStyle, ...monoStyle }}>{required}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
}
