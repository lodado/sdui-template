import './Colors.css'

// @ts-expect-error - Vite raw import, type declarations not available
import colorsCssRaw from '@lodado/sdui-design-files/colors.css?raw'
import { useEffect, useState } from 'react'

interface ColorBoxProps {
  name: string
  variable: string
  value: string
}

const ColorBox = ({ name, variable, value }: ColorBoxProps) => {
  return (
    <div className="color-box" data-color-value={value}>
      <div
        className="color-box__swatch"
        style={{ backgroundColor: `var(${variable}, ${value})` }}
        aria-label={`${name} color swatch`}
      />
      <div className="color-box__info">
        <div className="color-box__name">{name}</div>
        <div className="color-box__variable">{variable}</div>
        <div className="color-box__value">{value}</div>
      </div>
    </div>
  )
}

interface ColorGroupProps {
  title: string
  colors: Array<{ name: string; variable: string; value: string }>
}

const ColorGroup = ({ title, colors }: ColorGroupProps) => {
  return (
    <div className="color-group">
      <h3 className="color-group__title">{title}</h3>
      <div className="color-group__grid">
        {colors.map((color) => (
          <ColorBox key={color.variable} name={color.name} variable={color.variable} value={color.value} />
        ))}
      </div>
    </div>
  )
}

interface ParsedColor {
  name: string
  variable: string
  value: string
}

/**
 * Parses color variables from the CSS file.
 * Extracts only variables in the --color-* format.
 */
function parseColorsFromCss(cssText: string): ParsedColor[] {
  const colors: ParsedColor[] = []
  // Extract variables starting with --color- from :root or [data-theme='light'] blocks.
  const colorVarRegex = /--color-([^:]+):\s*([^;]+);/g
  const seen = new Set<string>()

  let match: RegExpExecArray | null = null
  // eslint-disable-next-line no-cond-assign
  while ((match = colorVarRegex.exec(cssText)) !== null) {
    const variable = `--color-${match[1].trim()}`
    const value = match[2].trim()

    // Remove duplicates (light/dark themes can include the same variables).
    if (!seen.has(variable)) {
      seen.add(variable)

      // Extract fallback value (grab #color from var(--other-var, #color) format).
      let fallbackValue = value
      const fallbackMatch = value.match(/,\s*([^)]+)\)$/)
      if (fallbackMatch) {
        fallbackValue = fallbackMatch[1].trim()
      } else if (value.startsWith('var(')) {
        // If there is only var() and no fallback, keep the variable name as-is.
        fallbackValue = value
      }

      // Convert variable name into a readable label.
      const name = variable
        .replace('--color-', '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())

      colors.push({
        name,
        variable,
        value: fallbackValue,
      })
    }
  }

  return colors
}

/**
 * Groups colors by category.
 */
function groupColorsByCategory(colors: ParsedColor[]): Array<{ title: string; colors: ParsedColor[] }> {
  const groups: Record<string, ParsedColor[]> = {}

  colors.forEach((color) => {
    // Extract category from variable name (e.g., --color-background-* -> Background).
    const categoryMatch = color.variable.match(/--color-([^-]+)/)
    if (!categoryMatch) {
      return
    }

    const category = categoryMatch[1]
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')

    if (!groups[categoryTitle]) {
      groups[categoryTitle] = []
    }
    groups[categoryTitle].push(color)
  })

  // Sort by category.
  return Object.entries(groups)
    .sort(([a], [b]) => {
      // Sort in a specific order.
      const order = ['Background', 'Text', 'Border', 'Icon', 'Link', 'Chart', 'Interaction', 'Skeleton', 'Blanket']
      const indexA = order.indexOf(a)
      const indexB = order.indexOf(b)
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB
      }
      if (indexA !== -1) {
        return -1
      }
      if (indexB !== -1) {
        return 1
      }
      return a.localeCompare(b)
    })
    .map(([title, groupColors]) => ({
      title,
      colors: groupColors.sort((a, b) => a.variable.localeCompare(b.variable)),
    }))
}

export const Colors = () => {
  const [colorGroups, setColorGroups] = useState<Array<{ title: string; colors: ParsedColor[] }>>([])

  useEffect(() => {
    const parsedColors = parseColorsFromCss(colorsCssRaw)
    const grouped = groupColorsByCategory(parsedColors)
    setColorGroups(grouped)
  }, [])

  return (
    <div className="colors-container">
      <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#666' }}>
          Source:{' '}
          <a
            href="https://www.figma.com/design/RXclnIXmr2835BdXOKBJDL/ADS-Foundations--Community-?node-id=14439-10399&p=f&t=i4NwiBe0wp852FUm-0"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0066cc', textDecoration: 'none' }}
          >
            Jira Design System
          </a>
        </p>
      </div>
      {colorGroups.map((group) => (
        <ColorGroup key={group.title} title={group.title} colors={group.colors} />
      ))}
    </div>
  )
}
