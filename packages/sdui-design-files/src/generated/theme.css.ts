/* eslint-disable no-restricted-syntax */
/**
 * Vanilla-Extract Theme Contract
 *
 * This file provides vanilla-extract integration for the design tokens.
 * It creates a type-safe theme contract that maps to the existing CSS variables.
 *
 * DO NOT EDIT MANUALLY - Regenerate with `pnpm run generate:tokens`
 *
 * @packageDocumentation
 */

import { createGlobalThemeContract } from '@vanilla-extract/css'

// ============================================================================
// Theme Contract Definition
// ============================================================================

/**
 * Maps a nested object structure to CSS variable names
 * e.g., { background: { brand: { bold: { default: null } } } }
 * -> { background: { brand: { bold: { default: '--color-background-brand-bold-default' } } } }
 */
function createVarNames<T extends Record<string, unknown>>(obj: T, prefix: string = ''): T {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(obj)) {
    const varName = prefix ? `${prefix}-${key}` : key

    if (value === null) {
      result[key] = varName
    } else if (typeof value === 'object' && value !== null) {
      result[key] = createVarNames(value as Record<string, unknown>, varName)
    }
  }

  return result as T
}

// ============================================================================
// Color Token Contract
// ============================================================================

const colorContract = {
  background: {
    disabled: null,
    accent: {
      blue: {
        bolder: { default: null, hovered: null, pressed: null },
        subtle: { default: null, hovered: null, pressed: null },
        subtler: { default: null, hovered: null, pressed: null },
        subtlest: { default: null, hovered: null, pressed: null },
      },
      gray: {
        bolder: { default: null, hovered: null, pressed: null },
        subtle: { default: null, hovered: null, pressed: null },
        subtler: { default: null, hovered: null, pressed: null },
        subtlest: { default: null, hovered: null, pressed: null },
      },
      green: {
        bolder: { default: null, hovered: null, pressed: null },
        subtle: { default: null, hovered: null, pressed: null },
        subtler: { default: null, hovered: null, pressed: null },
        subtlest: { default: null, hovered: null, pressed: null },
      },
      lime: {
        bolder: { default: null, hovered: null, pressed: null },
        subtle: { default: null, hovered: null, pressed: null },
        subtler: { default: null, hovered: null, pressed: null },
        subtlest: { default: null, hovered: null, pressed: null },
      },
      magenta: {
        bolder: { default: null, hovered: null, pressed: null },
        subtle: { default: null, hovered: null, pressed: null },
        subtler: { default: null, hovered: null, pressed: null },
        subtlest: { default: null, hovered: null, pressed: null },
      },
      orange: {
        bolder: { default: null, hovered: null, pressed: null },
        subtle: { default: null, hovered: null, pressed: null },
        subtler: { default: null, hovered: null, pressed: null },
        subtlest: { default: null, hovered: null, pressed: null },
      },
      purple: {
        bolder: { default: null, hovered: null, pressed: null },
        subtle: { default: null, hovered: null, pressed: null },
        subtler: { default: null, hovered: null, pressed: null },
        subtlest: { default: null, hovered: null, pressed: null },
      },
      red: {
        bolder: { default: null, hovered: null, pressed: null },
        subtle: { default: null, hovered: null, pressed: null },
        subtler: { default: null, hovered: null, pressed: null },
        subtlest: { default: null, hovered: null, pressed: null },
      },
      teal: {
        bolder: { default: null, hovered: null, pressed: null },
        subtle: { default: null, hovered: null, pressed: null },
        subtler: { default: null, hovered: null, pressed: null },
        subtlest: { default: null, hovered: null, pressed: null },
      },
      yellow: {
        bolder: { default: null, hovered: null, pressed: null },
        subtle: { default: null, hovered: null, pressed: null },
        subtler: { default: null, hovered: null, pressed: null },
        subtlest: { default: null, hovered: null, pressed: null },
      },
    },
    brand: {
      bold: { default: null, hovered: null, pressed: null },
      boldest: { default: null, hovered: null, pressed: null },
      subtlest: { default: null, hovered: null, pressed: null },
    },
    danger: {
      default: null,
      hovered: null,
      pressed: null,
      bold: { default: null, hovered: null, pressed: null },
      subtler: { default: null, hovered: null, pressed: null },
    },
    discovery: {
      default: null,
      hovered: null,
      pressed: null,
      bold: { default: null, hovered: null, pressed: null },
      subtler: { default: null, hovered: null, pressed: null },
    },
    information: {
      default: null,
      hovered: null,
      pressed: null,
      bold: { default: null, hovered: null, pressed: null },
      subtler: { default: null, hovered: null, pressed: null },
    },
    input: { default: null, hovered: null, pressed: null },
    inverse: {
      subtle: { default: null, hovered: null, pressed: null },
    },
    neutral: {
      default: null,
      hovered: null,
      pressed: null,
      bold: { default: null, hovered: null, pressed: null },
      subtle: { default: null, hovered: null, pressed: null },
    },
    selected: {
      default: null,
      hovered: null,
      pressed: null,
      bold: { default: null, hovered: null, pressed: null },
    },
    success: {
      default: null,
      hovered: null,
      pressed: null,
      bold: { default: null, hovered: null, pressed: null },
      subtler: { default: null, hovered: null, pressed: null },
    },
    warning: {
      default: null,
      hovered: null,
      pressed: null,
      bold: { default: null, hovered: null, pressed: null },
      subtler: { default: null, hovered: null, pressed: null },
    },
  },
  blanket: {
    danger: null,
    default: null,
    selected: null,
  },
  border: {
    bold: null,
    brand: null,
    danger: null,
    default: null,
    disabled: null,
    discovery: null,
    focused: null,
    information: null,
    input: null,
    inverse: null,
    selected: null,
    success: null,
    warning: null,
    accent: {
      blue: null,
      gray: null,
      green: null,
      lime: null,
      magenta: null,
      orange: null,
      purple: null,
      red: null,
      teal: null,
      yellow: null,
    },
  },
  icon: {
    default: null,
    disabled: null,
    inverse: null,
    selected: null,
    subtle: null,
    brand: null,
    danger: null,
    discovery: null,
    information: null,
    success: null,
    warning: null,
    warningInverse: null,
    accent: {
      blue: null,
      gray: null,
      green: null,
      lime: null,
      magenta: null,
      orange: null,
      purple: null,
      red: null,
      teal: null,
      yellow: null,
    },
  },
  link: {
    default: null,
    hovered: null,
    pressed: null,
    visited: null,
  },
  skeleton: {
    default: null,
    subtle: null,
  },
  text: {
    default: null,
    disabled: null,
    inverse: null,
    selected: null,
    subtle: null,
    subtlest: null,
    brand: null,
    danger: { default: null, bolder: null },
    discovery: { default: null, bolder: null },
    information: { default: null, bolder: null },
    success: { default: null, bolder: null },
    warning: { default: null, bolder: null, inverse: null },
    warningInverse: null,
    accent: {
      blue: { bolder: null, default: null },
      gray: { bolder: null, default: null },
      green: { bolder: null, default: null },
      lime: { bolder: null, default: null },
      magenta: { bolder: null, default: null },
      orange: { bolder: null, default: null },
      purple: { bolder: null, default: null },
      red: { bolder: null, default: null },
      teal: { bolder: null, default: null },
      yellow: { bolder: null, default: null },
    },
  },
} as const

// ============================================================================
// Elevation Token Contract
// ============================================================================

const elevationContract = {
  shadow: {
    overflow: {
      color: null,
      default: null,
      perimeter: null,
      spread: null,
    },
    overlay: {
      default: null,
      inner: null,
    },
    raised: {
      default: null,
      inner: null,
      perimeter: null,
      spread: null,
    },
  },
  surface: {
    default: null,
    hovered: null,
    pressed: null,
    overlay: { default: null, hovered: null, pressed: null },
    raised: { default: null, hovered: null, pressed: null },
    sunken: { default: null },
  },
} as const

// ============================================================================
// Space Token Contract
// ============================================================================

const spaceContract = {
  '0': null,
  '025': null,
  '050': null,
  '075': null,
  '100': null,
  '150': null,
  '200': null,
  '250': null,
  '300': null,
  '400': null,
  '500': null,
  '600': null,
  '800': null,
  '1000': null,
} as const

// ============================================================================
// Create Global Theme Contracts
// ============================================================================

/**
 * Color theme contract for vanilla-extract
 *
 * @example
 * import { style } from '@vanilla-extract/css'
 * import { colorVars } from '@lodado/sdui-design-files/theme'
 *
 * export const button = style({
 *   backgroundColor: colorVars.background.brand.bold.default,
 *   color: colorVars.text.inverse,
 * })
 */
export const colorVars = createGlobalThemeContract(colorContract, (value: string | null, path: string[]) => {
  const tokenName = value ?? path.join('-')
  return `color-${tokenName}`
})

/**
 * Elevation theme contract for vanilla-extract
 */
export const elevationVars = createGlobalThemeContract(
  elevationContract,
  (value: string | null, path: string[]) => {
    const tokenName = value ?? path.join('-')
    return `elevation-${tokenName}`
  },
)

/**
 * Space theme contract for vanilla-extract
 */
export const spaceVars = createGlobalThemeContract(spaceContract, (value: string | null, path: string[]) => {
  const tokenName = value ?? path.join('-')
  return `space-${tokenName}`
})

// ============================================================================
// Combined Vars Export
// ============================================================================

/**
 * All CSS variable contracts combined
 */
export const vars = {
  color: colorVars,
  elevation: elevationVars,
  space: spaceVars,
} as const

export type ColorVars = typeof colorVars
export type ElevationVars = typeof elevationVars
export type SpaceVars = typeof spaceVars
export type Vars = typeof vars
