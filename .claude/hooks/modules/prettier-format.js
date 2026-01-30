/**
 * Prettier Format Module
 * Auto-formats JS/TS files with Prettier
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function runPrettier(filePath, log) {
  if (!filePath || !fs.existsSync(filePath)) return;

  const projectRoot = findMonorepoRoot(filePath);

  try {
    execSync(`npx prettier --write "${filePath}"`, {
      cwd: projectRoot,
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 30000,
      shell: true,
    });
    log(`[Hook] Formatted: ${path.basename(filePath)}`);
  } catch (e) {
    // Silently fail - prettier might not be installed
  }
}

function findMonorepoRoot(filePath) {
  // Find turborepo/pnpm workspace root
  let dir = path.dirname(filePath);
  while (dir !== path.dirname(dir)) {
    if (
      fs.existsSync(path.join(dir, "pnpm-workspace.yaml")) ||
      fs.existsSync(path.join(dir, "turbo.json"))
    ) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  // Fallback: find nearest package.json
  dir = path.dirname(filePath);
  while (dir !== path.dirname(dir) && !fs.existsSync(path.join(dir, "package.json"))) {
    dir = path.dirname(dir);
  }
  return dir;
}

module.exports = { runPrettier };
