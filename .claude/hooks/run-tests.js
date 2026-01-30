#!/usr/bin/env node
/**
 * Run Tests Hook
 *
 * Runs tests after JS/TS edits with 30 second debounce.
 * Prevents excessive test runs during rapid edits.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const DEBOUNCE_SECONDS = 30;
const LOCK_FILE = path.join(os.tmpdir(), "claude-test-lastrun");
const LOG_FILE = path.join(__dirname, "..", "homunculus", "test-hook.log");

let inputData = "";

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  inputData += chunk;
});

process.stdin.on("end", () => {
  const now = Date.now();
  let lastRun = 0;

  // Read last run time
  try {
    if (fs.existsSync(LOCK_FILE)) {
      lastRun = parseInt(fs.readFileSync(LOCK_FILE, "utf8"), 10) || 0;
    }
  } catch (e) {
    // Ignore read errors
  }

  const elapsed = Math.floor((now - lastRun) / 1000);
  const remaining = DEBOUNCE_SECONDS - elapsed;

  if (remaining > 0) {
    console.error(`[Hook] Tests skipped (debounce: ${remaining}s remaining)`);
  } else {
    // Update lock file
    try {
      fs.writeFileSync(LOCK_FILE, String(now));
    } catch (e) {
      // Ignore write errors
    }

    console.error("[Hook] Running tests (30s debounce)...");

    try {
      // Find project root
      let projectRoot = process.cwd();
      try {
        const data = JSON.parse(inputData);
        const filePath = data.tool_input?.file_path;
        if (filePath) {
          projectRoot = path.dirname(filePath);
          while (
            projectRoot !== path.dirname(projectRoot) &&
            !fs.existsSync(path.join(projectRoot, "package.json"))
          ) {
            projectRoot = path.dirname(projectRoot);
          }
        }
      } catch (e) {
        // Use cwd
      }

      // Run tests (shell: true for Windows compatibility)
      const result = execSync("pnpm run test", {
        cwd: projectRoot,
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
        timeout: 120000, // 2 minute timeout
        shell: true,
      });

      // Show truncated output
      const lines = result.split("\n").slice(-20);
      console.error(lines.join("\n"));
    } catch (e) {
      // Tests failed - show error output
      const stdout = e.stdout || "";
      const stderr = e.stderr || "";
      const output = (stdout + "\n" + stderr).trim();
      const lines = output.split("\n").slice(-30);
      console.error(lines.join("\n"));
    }
  }

  // Always output original data
  process.stdout.write(inputData);
});
