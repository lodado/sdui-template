export interface SkillSplit {
  overview: string
  components: Record<string, string>
}

export function sanitizeComponentName(heading: string): string {
  return heading
    .replace(/\(.*?\)/g, '')
    .trim()
    .replace(/\s*\/\s*/g, '-')
    .replace(/\s+/g, '-')
}

export function splitComponentsSkill(md: string): SkillSplit {
  const lines = md.split('\n')

  // Overview = everything before the first h2 that is not "## Overview".
  let bodyStartIndex = lines.length
  let seenOverviewHeading = false
  for (let i = 0; i < lines.length; i += 1) {
    if (/^## /.test(lines[i])) {
      if (/^## Overview\b/.test(lines[i])) {
        seenOverviewHeading = true
        continue
      }
      bodyStartIndex = i
      break
    }
  }
  if (!seenOverviewHeading && bodyStartIndex === lines.length) {
    throw new Error('splitComponentsSkill: no category h2 headings found — unexpected SKILL.md shape')
  }

  const overview = lines.slice(0, bodyStartIndex).join('\n').trimEnd() + '\n'

  const components: Record<string, string> = {}
  let currentName: string | undefined
  let currentLines: string[] = []
  const flush = () => {
    if (currentName) components[currentName] = currentLines.join('\n').trimEnd() + '\n'
    currentLines = []
  }

  for (const line of lines.slice(bodyStartIndex)) {
    if (/^## /.test(line)) {
      flush()
      currentName = undefined // category heading itself is dropped; components carry the content
      continue
    }
    const h3 = line.match(/^### (.+)$/)
    if (h3) {
      flush()
      currentName = sanitizeComponentName(h3[1])
      currentLines = [line]
      continue
    }
    if (currentName) currentLines.push(line)
  }
  flush()

  return { overview, components }
}
