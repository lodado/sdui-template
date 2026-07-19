import { readdirSync, readFileSync, statSync } from 'fs'
import { join, relative } from 'path'

/**
 * Guards against fallback drift: component classes embed `var(--color-x, #hex)`
 * fallbacks that silently rot when colors.css changes. Every referenced token
 * must exist in colors.css, and every hardcoded fallback must equal the
 * light-theme value (fallbacks only render when the stylesheet is missing,
 * so they must mirror it exactly).
 */

const SRC_DIR = join(__dirname, '..')
const colorsCss = readFileSync(join(__dirname, '../../../sdui-design-files/src/colors.css'), 'utf-8')
const lightBlock = colorsCss.slice(0, colorsCss.indexOf("[data-theme='dark']"))

// token name -> light-theme hex (fallback hex, or direct value)
const lightValues = new Map<string, string>()
Array.from(lightBlock.matchAll(/--((?:color|elevation)-[\w-]+):\s*([^;]+);/g)).forEach(([, name, value]) => {
  if (lightValues.has(name)) return
  const hexes = value.match(/#[0-9a-fA-F]{3,8}\b/g)
  if (hexes) lightValues.set(name, hexes[hexes.length - 1].toLowerCase())
})

const collectSourceFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry)
    if (statSync(fullPath).isDirectory()) {
      return entry === '__tests__' || entry === 'node_modules' ? [] : collectSourceFiles(fullPath)
    }
    return /\.(ts|tsx)$/.test(entry) && !/\.test\./.test(entry) ? [fullPath] : []
  })

interface TokenUsage {
  location: string
  token: string
  fallback: string
}

const usages: TokenUsage[] = collectSourceFiles(SRC_DIR).flatMap((file) => {
  const content = readFileSync(file, 'utf-8')
  return [...content.matchAll(/var\(--((?:color|elevation)-[\w-]+)\s*,\s*(#[0-9a-fA-F]{3,8})\)/g)].map((match) => ({
    location: `${relative(SRC_DIR, file)}:${content.slice(0, match.index).split('\n').length}`,
    token: match[1],
    fallback: match[2].toLowerCase(),
  }))
})

describe('token fallback sync with colors.css', () => {
  it('finds token usages to check (guards the scanner itself)', () => {
    expect(usages.length).toBeGreaterThan(0)
  })

  it('references only tokens that exist in colors.css', () => {
    const missing = usages.filter(({ token }) => !lightValues.has(token)).map(({ location, token }) => `${location} ${token}`)
    expect(missing).toEqual([])
  })

  it('hardcoded fallbacks match the colors.css light-theme values', () => {
    const mismatched = usages
      .filter(({ token, fallback }) => lightValues.has(token) && lightValues.get(token) !== fallback)
      .map(({ location, token, fallback }) => `${location} ${token}: ${fallback} != ${lightValues.get(token)}`)
    expect(mismatched).toEqual([])
  })
})
