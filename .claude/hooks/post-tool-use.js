#!/usr/bin/env node
/**
 * PostToolUse Hook
 * - Logs tool events to observations.jsonl
 * - Tracks edited JS/TS files for Stop hook
 */

const { addEditedFile } = require('./modules/file-tracker')
const { logObservation } = require('./modules/observe')

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
    const toolName = data.tool_name || data.tool || 'unknown'
    const filePath = data.tool_input?.file_path || ''

    // Log observation
    logObservation({
      event: 'tool_complete',
      tool: toolName,
      session: data.session_id || 'unknown',
    })

    // Track edited JS/TS files
    if (toolName === 'Edit' && /\.(ts|tsx|js|jsx)$/.test(filePath)) {
      addEditedFile(filePath)
    }
  } catch (e) {
    logObservation({ event: 'parse_error', error: e.message })
  }

  process.stdout.write(inputData)
})
