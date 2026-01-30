#!/usr/bin/env node
/**
 * Stop Hook
 *
 * Runs when Claude finishes responding.
 * Only: Prettier format + TypeScript check
 */

const fs = require('fs')

const { runPrettier } = require('./modules/prettier-format')
const { runTypeScriptCheck } = require('./modules/typescript-check')
const { getEditedFiles, clearEditedFiles } = require('./modules/file-tracker')
const { log } = require('./modules/logger')

function isTsFile(filePath) {
  return /\.(ts|tsx)$/.test(filePath)
}

// Read stdin
let inputData = ''
process.stdin.setEncoding('utf8')
process.stdin.on('data', (chunk) => {
  inputData += chunk
})

process.stdin.on('end', () => {
  const editedFiles = getEditedFiles()

  if (editedFiles.length === 0) {
    process.stdout.write(inputData)
    process.exit(0)
  }

  log(`[Hook] Processing ${editedFiles.length} file(s)...`)

  for (const filePath of editedFiles) {
    if (!fs.existsSync(filePath)) continue

    runPrettier(filePath, log)

    if (isTsFile(filePath)) {
      runTypeScriptCheck(filePath, log)
    }
  }

  clearEditedFiles()
  process.stdout.write(inputData)
})
