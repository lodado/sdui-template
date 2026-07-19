import { readFileSync } from 'fs'
import { join } from 'path'

const colorsCss = readFileSync(join(__dirname, '../colors.css'), 'utf-8')

// Theme blocks: light runs until the dark selector, dark until the font-theme selector
const lightBlock = colorsCss.slice(0, colorsCss.indexOf("[data-theme='dark']"))
const darkBlock = colorsCss.slice(
  colorsCss.indexOf("[data-theme='dark']"),
  colorsCss.indexOf("[data-theme='Default - Atlassian Fonts']"),
)

/** First declaration of a token inside a block, e.g. getDeclaration(lightBlock, '--color-text-brand') */
const getDeclaration = (block: string, tokenName: string): string => {
  const match = block.match(new RegExp(`${tokenName}:\\s*([^;]+);`))
  if (!match) throw new Error(`token not found: ${tokenName}`)
  return match[1].trim()
}

/** Last #rrggbb inside a declaration (the fallback hex, or the direct value) */
const getHex = (declaration: string): string => {
  const hexes = declaration.match(/#[0-9a-fA-F]{6}\b/g)
  if (!hexes) throw new Error(`no hex in declaration: ${declaration}`)
  return hexes[hexes.length - 1].toLowerCase()
}

/** WCAG 2.x relative luminance */
const luminance = (hex: string): number => {
  const channel = (offset: number) => {
    const c = parseInt(hex.slice(offset, offset + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5)
}

/** WCAG 2.x contrast ratio */
const contrast = (hexA: string, hexB: string): number => {
  const [hi, lo] = [luminance(hexA), luminance(hexB)].sort((a, b) => b - a)
  return (hi + 0.05) / (lo + 0.05)
}

const BRAND_LEVELS = ['100', '200', '250', '300', '400', '500', '600', '700', '800', '850', '900', '1000']

// Semantic tokens that must resolve from the brand ramp in BOTH themes
const BRAND_SEMANTIC_TOKENS = [
  '--color-background-brand-bold-default',
  '--color-background-brand-bold-hovered',
  '--color-background-brand-bold-pressed',
  '--color-background-brand-boldest-default',
  '--color-background-brand-boldest-hovered',
  '--color-background-brand-boldest-pressed',
  '--color-background-brand-subtlest-default',
  '--color-background-brand-subtlest-hovered',
  '--color-background-brand-subtlest-pressed',
  '--color-background-selected-default',
  '--color-background-selected-hovered',
  '--color-background-selected-pressed',
  '--color-background-selected-bold-default',
  '--color-background-selected-bold-hovered',
  '--color-background-selected-bold-pressed',
  '--color-border-brand',
  '--color-border-selected',
  '--color-border-focused',
  '--color-icon-brand',
  '--color-icon-selected',
  '--color-link-default',
  '--color-link-pressed',
  '--color-text-brand',
  '--color-text-selected',
]

describe('brand primitives (Scan Teal ramp)', () => {
  it.each(BRAND_LEVELS)('defines --brand-%s with a valid hex value', (level) => {
    const declaration = getDeclaration(lightBlock, `--brand-${level}`)
    expect(declaration).toMatch(/^#[0-9a-fA-F]{6}$/)
  })

  it('orders the ramp from light (100) to dark (1000)', () => {
    const luminances = BRAND_LEVELS.map((level) => luminance(getDeclaration(lightBlock, `--brand-${level}`)))
    const sortedDescending = [...luminances].sort((a, b) => b - a)
    expect(luminances).toEqual(sortedDescending)
  })
})

describe('brand semantic tokens reference the brand ramp', () => {
  it.each(BRAND_SEMANTIC_TOKENS)('%s uses --brand-* in the light theme', (token) => {
    expect(getDeclaration(lightBlock, token)).toMatch(/var\(--brand-\d+/)
  })

  it.each(BRAND_SEMANTIC_TOKENS)('%s uses --brand-* in the dark theme', (token) => {
    expect(getDeclaration(darkBlock, token)).toMatch(/var\(--brand-\d+/)
  })
})

describe('non-brand semantics keep their original hues', () => {
  it.each([
    '--color-background-information-bold-default',
    '--color-border-information',
    '--color-text-information',
    '--color-chart-brand-default',
  ])('%s stays on the blue ramp', (token) => {
    expect(getDeclaration(lightBlock, token)).toMatch(/var\(--blue-/)
    expect(getDeclaration(darkBlock, token)).toMatch(/var\(--blue-/)
  })

  it('visited links stay purple', () => {
    expect(getDeclaration(lightBlock, '--color-link-visited-default')).toMatch(/var\(--purple-/)
    expect(getDeclaration(darkBlock, '--color-link-visited-default')).toMatch(/var\(--purple-/)
  })
})

describe('brand contrast (WCAG AA boundaries)', () => {
  const lightSurface = getHex(getDeclaration(lightBlock, '--color-text-inverse')) // #ffffff
  const darkSurface = getHex(getDeclaration(darkBlock, '--elevation-surface-default'))

  it('light: inverse text on brand bold background >= 4.5:1', () => {
    const bg = getHex(getDeclaration(lightBlock, '--color-background-brand-bold-default'))
    expect(contrast(lightSurface, bg)).toBeGreaterThanOrEqual(4.5)
  })

  it('light: brand text on default surface >= 4.5:1', () => {
    const text = getHex(getDeclaration(lightBlock, '--color-text-brand'))
    expect(contrast(text, lightSurface)).toBeGreaterThanOrEqual(4.5)
  })

  it('light: focus ring on default surface >= 3:1 (non-text)', () => {
    const ring = getHex(getDeclaration(lightBlock, '--color-border-focused'))
    expect(contrast(ring, lightSurface)).toBeGreaterThanOrEqual(3)
  })

  it('dark: inverse text on brand bold background >= 4.5:1', () => {
    const bg = getHex(getDeclaration(darkBlock, '--color-background-brand-bold-default'))
    const inverse = getHex(getDeclaration(darkBlock, '--color-text-inverse'))
    expect(contrast(inverse, bg)).toBeGreaterThanOrEqual(4.5)
  })

  it('dark: brand text on default surface >= 4.5:1', () => {
    const text = getHex(getDeclaration(darkBlock, '--color-text-brand'))
    expect(contrast(text, darkSurface)).toBeGreaterThanOrEqual(4.5)
  })

  it('dark: focus ring on default surface >= 3:1 (non-text)', () => {
    const ring = getHex(getDeclaration(darkBlock, '--color-border-focused'))
    expect(contrast(ring, darkSurface)).toBeGreaterThanOrEqual(3)
  })
})
