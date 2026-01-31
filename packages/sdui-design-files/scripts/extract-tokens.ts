/* eslint-disable no-continue */
/* eslint-disable no-cond-assign */
/* eslint-disable no-use-before-define */
/* eslint-disable no-restricted-syntax */
/* eslint-disable local-rules/no-console-log */
/**
 * CSS Token Extraction Script
 *
 * This script parses colors.css and extracts CSS variables into structured
 * TypeScript tokens for vanilla-extract integration.
 *
 * Usage: npx ts-node scripts/extract-tokens.ts
 *
 * @packageDocumentation
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ============================================================================
// Types
// ============================================================================

interface TokenStructure {
  [key: string]: string | TokenStructure
}

interface ExtractedTokens {
  color: TokenStructure
  elevation: TokenStructure
  space: TokenStructure
}

interface ParsedCSSVariable {
  name: string
  value: string
  parts: string[]
}

// ============================================================================
// Constants
// ============================================================================

const CSS_VAR_REGEX = /--([\w-]+):\s*([^;]+);/g
const COLOR_TOKEN_PREFIX = 'color-'
const ELEVATION_TOKEN_PREFIX = 'elevation-'
const SPACE_TOKEN_PREFIX = 'space-'

// ============================================================================
// Parser Functions
// ============================================================================

/**
 * Parse CSS content and extract all CSS variables
 */
function parseCSSVariables(cssContent: string): ParsedCSSVariable[] {
  const variables: ParsedCSSVariable[] = []
  let match: RegExpExecArray | null

  while ((match = CSS_VAR_REGEX.exec(cssContent)) !== null) {
    const name = match[1]
    const value = match[2].trim()

    // Skip variables with special characters (like emoji prefixes)
    if (name.includes('🌮') || name.includes('emoji')) {
      continue
    }

    variables.push({
      name,
      value,
      parts: name.split('-'),
    })
  }

  return variables
}

/**
 * Filter variables by prefix and extract only light theme tokens
 * (first occurrence of each variable name)
 */
function filterUniqueTokensByPrefix(variables: ParsedCSSVariable[], prefix: string): ParsedCSSVariable[] {
  const seen = new Set<string>()
  const filtered: ParsedCSSVariable[] = []

  for (const variable of variables) {
    if (variable.name.startsWith(prefix) && !seen.has(variable.name)) {
      seen.add(variable.name)
      filtered.push(variable)
    }
  }

  return filtered
}

/**
 * Convert kebab-case parts to camelCase
 */
function toCamelCase(str: string): string {
  return str.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase())
}

/**
 * Convert array of parts to nested object path
 * e.g., ['color', 'background', 'brand', 'bold', 'default']
 *    -> { background: { brand: { bold: { default: value } } } }
 */
function buildNestedObject(parts: string[], value: string, skipParts: number = 1): TokenStructure {
  const relevantParts = parts.slice(skipParts)

  if (relevantParts.length === 0) {
    return {}
  }

  if (relevantParts.length === 1) {
    return { [toCamelCase(relevantParts[0])]: value }
  }

  const [first, ...rest] = relevantParts
  const key = toCamelCase(first)

  if (rest.length === 0) {
    return { [key]: value }
  }

  return {
    [key]: buildNestedObject(['_', ...rest], value, 1),
  }
}

/**
 * Deep merge two objects
 */
function deepMerge(target: TokenStructure, source: TokenStructure): TokenStructure {
  const result: TokenStructure = { ...target }

  for (const key of Object.keys(source)) {
    const sourceValue = source[key]
    const targetValue = result[key]

    if (
      typeof sourceValue === 'object' &&
      sourceValue !== null &&
      typeof targetValue === 'object' &&
      targetValue !== null
    ) {
      result[key] = deepMerge(targetValue as TokenStructure, sourceValue as TokenStructure)
    } else {
      result[key] = sourceValue
    }
  }

  return result
}

/**
 * Extract and structure tokens from CSS variables
 */
function extractTokens(cssContent: string): ExtractedTokens {
  const variables = parseCSSVariables(cssContent)

  // Extract color tokens
  const colorVars = filterUniqueTokensByPrefix(variables, COLOR_TOKEN_PREFIX)
  let colorTokens: TokenStructure = {}

  for (const variable of colorVars) {
    const varRef = `var(--${variable.name})`
    const nested = buildNestedObject(variable.parts, varRef, 1) // skip 'color'
    colorTokens = deepMerge(colorTokens, nested)
  }

  // Extract elevation tokens
  const elevationVars = filterUniqueTokensByPrefix(variables, ELEVATION_TOKEN_PREFIX)
  let elevationTokens: TokenStructure = {}

  for (const variable of elevationVars) {
    const varRef = `var(--${variable.name})`
    const nested = buildNestedObject(variable.parts, varRef, 1) // skip 'elevation'
    elevationTokens = deepMerge(elevationTokens, nested)
  }

  // Extract space tokens
  const spaceVars = filterUniqueTokensByPrefix(variables, SPACE_TOKEN_PREFIX)
  const spaceTokens: TokenStructure = {}

  for (const variable of spaceVars) {
    const varRef = `var(--${variable.name})`
    // Space tokens are flat: --space-100, --space-200, etc.
    const key = variable.parts.slice(1).join('')
    spaceTokens[key] = varRef
  }

  return {
    color: colorTokens,
    elevation: elevationTokens,
    space: spaceTokens,
  }
}

// ============================================================================
// Code Generation
// ============================================================================

/**
 * Check if a key needs to be quoted (starts with digit or contains special chars)
 */
function needsQuotes(key: string): boolean {
  return /^[0-9]/.test(key) || !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)
}

/**
 * Format key with quotes if needed
 */
function formatKey(key: string): string {
  return needsQuotes(key) ? `'${key}'` : key
}

/**
 * Generate TypeScript code for token contract (vanilla-extract)
 */
function generateContractCode(tokens: TokenStructure, indent: number = 2): string {
  const spaces = ' '.repeat(indent)
  const lines: string[] = []

  for (const [key, value] of Object.entries(tokens)) {
    const formattedKey = formatKey(key)
    if (typeof value === 'string') {
      // Leaf node - use null for contract placeholder
      lines.push(`${spaces}${formattedKey}: null,`)
    } else {
      // Nested object
      lines.push(`${spaces}${formattedKey}: {`)
      lines.push(generateContractCode(value as TokenStructure, indent + 2))
      lines.push(`${spaces}},`)
    }
  }

  return lines.join('\n')
}

/**
 * Generate TypeScript code for token values
 */
function generateTokenValuesCode(tokens: TokenStructure, indent: number = 2): string {
  const spaces = ' '.repeat(indent)
  const lines: string[] = []

  for (const [key, value] of Object.entries(tokens)) {
    const formattedKey = formatKey(key)
    if (typeof value === 'string') {
      lines.push(`${spaces}${formattedKey}: '${value}',`)
    } else {
      lines.push(`${spaces}${formattedKey}: {`)
      lines.push(generateTokenValuesCode(value as TokenStructure, indent + 2))
      lines.push(`${spaces}},`)
    }
  }

  return lines.join('\n')
}

/**
 * Generate the complete TypeScript file content
 */
function generateTypeScriptFile(extractedTokens: ExtractedTokens): string {
  const header = `/**
 * Auto-generated Design Tokens
 *
 * DO NOT EDIT MANUALLY - This file is generated by scripts/extract-tokens.ts
 * Run \`pnpm run generate:tokens\` to regenerate.
 *
 * @packageDocumentation
 */

`

  const colorContractCode = generateContractCode(extractedTokens.color)
  const elevationContractCode = generateContractCode(extractedTokens.elevation)
  const spaceContractCode = generateContractCode(extractedTokens.space)

  const colorValuesCode = generateTokenValuesCode(extractedTokens.color)
  const elevationValuesCode = generateTokenValuesCode(extractedTokens.elevation)
  const spaceValuesCode = generateTokenValuesCode(extractedTokens.space)

  return `${header}// ============================================================================
// Token Contract Definitions (for vanilla-extract createGlobalThemeContract)
// ============================================================================

/**
 * Color token contract structure
 * Use with createGlobalThemeContract for type-safe theming
 */
export const colorTokenContract = {
${colorContractCode}
} as const

/**
 * Elevation token contract structure
 */
export const elevationTokenContract = {
${elevationContractCode}
} as const

/**
 * Space token contract structure
 */
export const spaceTokenContract = {
${spaceContractCode}
} as const

// ============================================================================
// Token Values (CSS variable references)
// ============================================================================

/**
 * Color tokens with CSS variable references
 *
 * @example
 * import { colorTokens } from '@lodado/sdui-design-files/tokens'
 *
 * const styles = {
 *   backgroundColor: colorTokens.background.brand.bold.default,
 *   // → 'var(--color-background-brand-bold-default)'
 * }
 */
export const colorTokens = {
${colorValuesCode}
} as const

/**
 * Elevation tokens with CSS variable references
 */
export const elevationTokens = {
${elevationValuesCode}
} as const

/**
 * Space tokens with CSS variable references
 */
export const spaceTokens = {
${spaceValuesCode}
} as const

// ============================================================================
// Type Exports
// ============================================================================

export type ColorTokens = typeof colorTokens
export type ElevationTokens = typeof elevationTokens
export type SpaceTokens = typeof spaceTokens

/**
 * All design tokens combined
 */
export const tokens = {
  color: colorTokens,
  elevation: elevationTokens,
  space: spaceTokens,
} as const

export type Tokens = typeof tokens
`
}

// ============================================================================
// Main Execution
// ============================================================================

function main(): void {
  const cssPath = path.resolve(__dirname, '../src/colors.css')
  const outputPath = path.resolve(__dirname, '../src/generated/tokens.ts')

  console.log('🎨 Extracting design tokens from colors.css...')

  // Read CSS file
  if (!fs.existsSync(cssPath)) {
    console.error(`❌ CSS file not found: ${cssPath}`)
    process.exit(1)
  }

  const cssContent = fs.readFileSync(cssPath, 'utf-8')
  console.log(`📄 Read ${cssContent.length} characters from colors.css`)

  // Extract tokens
  const extractedTokens = extractTokens(cssContent)

  const colorCount = countLeafNodes(extractedTokens.color)
  const elevationCount = countLeafNodes(extractedTokens.elevation)
  const spaceCount = countLeafNodes(extractedTokens.space)

  console.log(`✅ Extracted ${colorCount} color tokens`)
  console.log(`✅ Extracted ${elevationCount} elevation tokens`)
  console.log(`✅ Extracted ${spaceCount} space tokens`)

  // Generate TypeScript code
  const tsCode = generateTypeScriptFile(extractedTokens)

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Write output file
  fs.writeFileSync(outputPath, tsCode, 'utf-8')
  console.log(`📝 Generated: ${outputPath}`)

  console.log('\n🎉 Token extraction complete!')
}

/**
 * Count leaf nodes in token structure
 */
function countLeafNodes(obj: TokenStructure): number {
  let count = 0

  for (const value of Object.values(obj)) {
    if (typeof value === 'string') {
      count += 1
    } else {
      count += countLeafNodes(value as TokenStructure)
    }
  }

  return count
}

// Run if called directly
main()
