/**
 * Observe Module
 * Logs tool events to observations.jsonl
 */

const fs = require('fs')
const path = require('path')

const CONFIG_DIR = path.join(__dirname, '..', '..', 'homunculus')
const OBSERVATIONS_FILE = path.join(CONFIG_DIR, 'observations.jsonl')
const MAX_FILE_SIZE_MB = 10

// Ensure directory exists
if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true })
}

function logObservation(obs) {
  obs.timestamp = new Date().toISOString()

  // Archive if file too large
  try {
    if (fs.existsSync(OBSERVATIONS_FILE)) {
      const stats = fs.statSync(OBSERVATIONS_FILE)
      if (stats.size / (1024 * 1024) >= MAX_FILE_SIZE_MB) {
        const archiveDir = path.join(CONFIG_DIR, 'observations.archive')
        if (!fs.existsSync(archiveDir)) {
          fs.mkdirSync(archiveDir, { recursive: true })
        }
        const archiveDate = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19)
        fs.renameSync(OBSERVATIONS_FILE, path.join(archiveDir, `observations-${archiveDate}.jsonl`))
      }
    }
  } catch (e) {}

  try {
    fs.appendFileSync(OBSERVATIONS_FILE, JSON.stringify(obs) + '\n')
  } catch (e) {}
}

module.exports = { logObservation }
