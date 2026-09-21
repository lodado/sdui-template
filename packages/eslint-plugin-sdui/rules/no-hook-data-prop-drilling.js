const analyze = require('./analyze')

// A new TypeScript Program gets a fresh analysis; never cache by filename alone.
const analyses = new WeakMap()

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Allow one component boundary for SDUI hook data, but forbid forwarding it again',
      url: 'https://github.com/lodado/sdui-template/tree/main/packages/eslint-plugin-sdui#rule-behavior',
    },
    schema: [],
    messages: {
      drilling:
        'SDUI hook data has already crossed a component boundary. Subscribe where the data is needed instead of forwarding it again.',
    },
  },
  create(context) {
    const services = context.sourceCode.parserServices || {}
    if (!services.program || !services.esTreeNodeToTSNodeMap || services.hasFullTypeInformation === false) {
      throw new Error(
        'sdui/no-hook-data-prop-drilling requires type-aware linting. Configure @typescript-eslint/parser with parserOptions.project (or projectService) and include both parent and child components in the TypeScript project.',
      )
    }
    return {
      Program(node) {
        const program = services.program
        if (!analyses.has(program)) analyses.set(program, analyze(program))
        const sourceFile = services.esTreeNodeToTSNodeMap.get(node)
        for (const diagnostic of analyses.get(program).get(sourceFile.fileName) || []) {
          const start = sourceFile.getLineAndCharacterOfPosition(diagnostic.getStart(sourceFile))
          const end = sourceFile.getLineAndCharacterOfPosition(diagnostic.getEnd())
          context.report({
            loc: {
              start: { line: start.line + 1, column: start.character },
              end: { line: end.line + 1, column: end.character },
            },
            messageId: 'drilling',
          })
        }
      },
    }
  },
}
