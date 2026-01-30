#!/usr/bin/env node
/**
 * Prettier Format Hook
 *
 * Auto-formats JS/TS files with Prettier after edits.
 * Receives tool data via stdin, applies prettier, and outputs original data.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

let inputData = "";

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  inputData += chunk;
});

process.stdin.on("end", () => {
  try {
    const data = JSON.parse(inputData);
    const filePath = data.tool_input?.file_path;

    if (filePath && fs.existsSync(filePath)) {
      // Find project root with package.json
      let projectRoot = path.dirname(filePath);
      while (
        projectRoot !== path.dirname(projectRoot) &&
        !fs.existsSync(path.join(projectRoot, "package.json"))
      ) {
        projectRoot = path.dirname(projectRoot);
      }

      try {
        // Use npx to run prettier (shell: true for Windows compatibility)
        execSync(`npx prettier --write "${filePath}"`, {
          cwd: projectRoot,
          stdio: ["pipe", "pipe", "pipe"],
          timeout: 30000,
          shell: true,
        });
        console.error(`[Hook] Formatted: ${path.basename(filePath)}`);
      } catch (e) {
        // Silently fail - prettier might not be installed
        if (process.env.DEBUG) {
          console.error(`[Hook] Prettier failed: ${e.message}`);
        }
      }
    }
  } catch (e) {
    // JSON parse error - ignore
  }

  // Always output original data
  process.stdout.write(inputData);
});
