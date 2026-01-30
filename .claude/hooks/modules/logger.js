/**
 * Logger Module
 * Centralized logging with rotation support
 */

const fs = require('fs')
const path = require('path')

const CONFIG_DIR = path.join(__dirname, '..', '..', 'homunculus')
const LOG_FILE = path.join(CONFIG_DIR, 'hooks.log')
const MAX_LOG_SIZE_MB = 5
const MAX_LOG_FILES = 3

// Ensure directory exists
if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true })
}

function rotateLogIfNeeded() {
  try {
    if (!fs.existsSync(LOG_FILE)) return

    const stats = fs.statSync(LOG_FILE)
    const sizeMB = stats.size / (1024 * 1024)

    if (sizeMB >= MAX_LOG_SIZE_MB) {
      // Rotate existing log files
      for (let i = MAX_LOG_FILES - 1; i >= 1; i--) {
        const oldFile = `${LOG_FILE}.${i}`
        const newFile = `${LOG_FILE}.${i + 1}`
        if (fs.existsSync(oldFile)) {
          if (i === MAX_LOG_FILES - 1) {
            fs.unlinkSync(oldFile) // Delete oldest
          } else {
            fs.renameSync(oldFile, newFile)
          }
        }
      }

      // Rotate current log
      fs.renameSync(LOG_FILE, `${LOG_FILE}.1`)
    }
  } catch (e) {
    // Ignore rotation errors
  }
}

function log(message) {
  // Log to console only, skip file logging
  console.error(message)
}

function getLogPath() {
  return LOG_FILE
}

module.exports = { log, getLogPath, rotateLogIfNeeded }
