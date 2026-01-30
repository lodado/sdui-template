#!/usr/bin/env node
/**
 * PostToolUse Hook
 * Only tracks edited JS/TS files for Stop hook processing.
 */

const { addEditedFile } = require('./modules/file-tracker')

let inputData = ''
process.stdin.setEncoding('utf8')
process.stdin.on('data', (chunk) => {
  inputData += chunk
})

process.stdin.on('end', () => {
  if (!inputData.trim()) {
    process.exit(0)
  }

  try {
    const data = JSON.parse(inputData)
    const toolName = data.tool_name || data.tool || ''
    const filePath = data.tool_input?.file_path || ''

    if (toolName === 'Edit' && /\.(ts|tsx|js|jsx)$/.test(filePath)) {
      addEditedFile(filePath)
    }
  } catch (e) {}

  process.stdout.write(inputData)
})
