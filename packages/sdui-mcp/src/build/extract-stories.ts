import ts from 'typescript'

export interface ExtractedStory {
  name: string
  document: string
}

export interface ExtractResult {
  component: string
  stories: ExtractedStory[]
}

const DEFAULT_MAX_STORIES = 3

/** Finds `const document: SduiLayoutDocument = {...}` inside an exported story initializer. */
function findDocumentLiteral(node: ts.Node, sourceFile: ts.SourceFile): string | undefined {
  if (
    ts.isVariableDeclaration(node) &&
    ts.isIdentifier(node.name) &&
    node.name.text === 'document' &&
    node.type?.getText(sourceFile).includes('SduiLayoutDocument') &&
    node.initializer &&
    ts.isObjectLiteralExpression(node.initializer)
  ) {
    return node.initializer.getText(sourceFile)
  }
  let found: string | undefined
  node.forEachChild((child) => {
    found = found ?? findDocumentLiteral(child, sourceFile)
  })
  return found
}

function isExported(statement: ts.VariableStatement): boolean {
  return statement.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false
}

export function extractStories(
  fileName: string,
  source: string,
  maxStories: number = DEFAULT_MAX_STORIES,
): ExtractResult {
  const component = fileName.replace(/\.stories\.tsx?$/, '')
  const sourceFile = ts.createSourceFile(fileName, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)

  const stories: ExtractedStory[] = []
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement) || !isExported(statement)) continue
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || !declaration.initializer) continue
      const document = findDocumentLiteral(declaration.initializer, sourceFile)
      if (document) stories.push({ name: declaration.name.text, document })
    }
  }

  const shortestFirst = [...stories].sort((a, b) => a.document.length - b.document.length)
  return { component, stories: shortestFirst.slice(0, maxStories) }
}

export function renderExamplesMarkdown(result: ExtractResult): string {
  const sections = result.stories.map(
    (story) => `## ${story.name}\n\n\`\`\`ts\nconst document: SduiLayoutDocument = ${story.document}\n\`\`\``,
  )
  return [
    `# ${result.component} — Storybook usage examples`,
    '',
    'Render pattern: `<SduiLayoutRenderer document={document} components={sduiComponents} />`',
    '',
    sections.join('\n\n'),
    '',
  ].join('\n')
}
