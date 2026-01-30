/**
 * File Tracker Module
 * Tracks edited files during a session for batch processing at Stop
 */

const fs = require("fs");
const path = require("path");

const CONFIG_DIR = path.join(__dirname, "..", "..", "homunculus");
const EDITED_FILES_PATH = path.join(CONFIG_DIR, "edited-files.json");

// Ensure directory exists
if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

function addEditedFile(filePath) {
  if (!filePath) return;

  let files = [];
  try {
    if (fs.existsSync(EDITED_FILES_PATH)) {
      files = JSON.parse(fs.readFileSync(EDITED_FILES_PATH, "utf8"));
    }
  } catch (e) {
    files = [];
  }

  // Add if not already in list
  if (!files.includes(filePath)) {
    files.push(filePath);
  }

  try {
    fs.writeFileSync(EDITED_FILES_PATH, JSON.stringify(files, null, 2));
  } catch (e) {}
}

function getEditedFiles() {
  try {
    if (fs.existsSync(EDITED_FILES_PATH)) {
      return JSON.parse(fs.readFileSync(EDITED_FILES_PATH, "utf8"));
    }
  } catch (e) {}
  return [];
}

function clearEditedFiles() {
  try {
    if (fs.existsSync(EDITED_FILES_PATH)) {
      fs.unlinkSync(EDITED_FILES_PATH);
    }
  } catch (e) {}
}

module.exports = { addEditedFile, getEditedFiles, clearEditedFiles };
