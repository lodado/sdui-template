/**
 * TypeScript Check Module
 * Runs TypeScript type checking and reports errors
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function runTypeScriptCheck(filePath, log) {
  if (!filePath || !fs.existsSync(filePath)) return;

  // Find tsconfig.json
  let tsconfigDir = path.dirname(filePath);
  while (
    tsconfigDir !== path.dirname(tsconfigDir) &&
    !fs.existsSync(path.join(tsconfigDir, "tsconfig.json"))
  ) {
    tsconfigDir = path.dirname(tsconfigDir);
  }

  if (!fs.existsSync(path.join(tsconfigDir, "tsconfig.json"))) return;

  try {
    execSync("npx tsc --noEmit --pretty false 2>&1", {
      cwd: tsconfigDir,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 60000,
      shell: true,
    });
  } catch (e) {
    const output = e.stdout || e.stderr || "";
    const normalizedPath = filePath.replace(/\\/g, "/");
    const lines = output
      .split("\n")
      .filter((line) => {
        const normalizedLine = line.replace(/\\/g, "/");
        return (
          normalizedLine.includes(normalizedPath) ||
          normalizedLine.includes(path.basename(filePath))
        );
      })
      .slice(0, 10);

    if (lines.length > 0) {
      log(`[Hook] TypeScript errors in ${path.basename(filePath)}:`);
      lines.forEach((line) => log(line));
    }
  }
}

module.exports = { runTypeScriptCheck };
