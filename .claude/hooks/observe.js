#!/usr/bin/env node
/**
 * Continuous Learning v2 - Observation Hook (Project-Local)
 *
 * Captures tool use events for pattern analysis.
 * Claude Code passes hook data via stdin as JSON.
 *
 * Cross-platform compatible (Windows/macOS/Linux)
 */

const fs = require("fs");
const path = require("path");

// Get project root (assuming .claude is one level deep)
const SCRIPT_DIR = __dirname;
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..", "..");
const CONFIG_DIR = path.join(PROJECT_ROOT, ".claude", "homunculus");
const OBSERVATIONS_FILE = path.join(CONFIG_DIR, "observations.jsonl");
const MAX_FILE_SIZE_MB = 10;

// Ensure directory exists
if (!fs.existsSync(CONFIG_DIR)) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
}

// Skip if disabled
if (fs.existsSync(path.join(CONFIG_DIR, "disabled"))) {
  process.exit(0);
}

// Read JSON from stdin
let inputData = "";

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  inputData += chunk;
});

process.stdin.on("end", () => {
  if (!inputData.trim()) {
    process.exit(0);
  }

  processInput(inputData);
});

function processInput(inputJson) {
  const timestamp = new Date().toISOString();
  let observation;

  try {
    const data = JSON.parse(inputJson);

    // Extract fields - Claude Code hook format
    const hookType = data.hook_type || "unknown";
    const toolName = data.tool_name || data.tool || "unknown";
    const toolInput = data.tool_input || data.input || {};
    const toolOutput = data.tool_output || data.output || "";
    const sessionId = data.session_id || "unknown";

    // Truncate large inputs/outputs
    const toolInputStr = truncate(
      typeof toolInput === "object" ? JSON.stringify(toolInput) : String(toolInput),
      5000
    );
    const toolOutputStr = truncate(
      typeof toolOutput === "object" ? JSON.stringify(toolOutput) : String(toolOutput),
      5000
    );

    // Determine event type
    const event = hookType.includes("Pre") ? "tool_start" : "tool_complete";

    observation = {
      timestamp,
      event,
      tool: toolName,
      session: sessionId,
    };

    if (event === "tool_start" && toolInputStr) {
      observation.input = toolInputStr;
    }
    if (event === "tool_complete" && toolOutputStr) {
      observation.output = toolOutputStr;
    }
  } catch (e) {
    // Fallback: log parse error
    observation = {
      timestamp,
      event: "parse_error",
      raw: truncate(inputJson, 1000),
      error: e.message,
    };
  }

  // Archive if file too large
  archiveIfNeeded();

  // Write observation
  fs.appendFileSync(OBSERVATIONS_FILE, JSON.stringify(observation) + "\n");

  // Signal observer if running (Unix only)
  signalObserver();

  process.exit(0);
}

function truncate(str, maxLen) {
  if (str && str.length > maxLen) {
    return str.substring(0, maxLen) + "...[truncated]";
  }
  return str;
}

function archiveIfNeeded() {
  if (!fs.existsSync(OBSERVATIONS_FILE)) {
    return;
  }

  try {
    const stats = fs.statSync(OBSERVATIONS_FILE);
    const fileSizeMB = stats.size / (1024 * 1024);

    if (fileSizeMB >= MAX_FILE_SIZE_MB) {
      const archiveDir = path.join(CONFIG_DIR, "observations.archive");
      if (!fs.existsSync(archiveDir)) {
        fs.mkdirSync(archiveDir, { recursive: true });
      }

      const archiveDate = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .replace("T", "-")
        .substring(0, 19);
      const archivePath = path.join(archiveDir, `observations-${archiveDate}.jsonl`);
      fs.renameSync(OBSERVATIONS_FILE, archivePath);
    }
  } catch (e) {
    // Ignore archiving errors
  }
}

function signalObserver() {
  // Unix-only: signal observer process if running
  if (process.platform === "win32") {
    return;
  }

  const observerPidFile = path.join(CONFIG_DIR, ".observer.pid");
  if (!fs.existsSync(observerPidFile)) {
    return;
  }

  try {
    const pid = parseInt(fs.readFileSync(observerPidFile, "utf8").trim(), 10);
    if (pid) {
      process.kill(pid, "SIGUSR1");
    }
  } catch (e) {
    // Ignore signaling errors
  }
}
