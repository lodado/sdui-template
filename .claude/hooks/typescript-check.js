#!/usr/bin/env node
/**
 * TypeScript Check Hook
 *
 * Runs TypeScript type checking after editing .ts/.tsx files.
 * Shows only errors related to the edited file.
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
      // Find tsconfig.json in parent directories
      let tsconfigDir = path.dirname(filePath);
      while (
        tsconfigDir !== path.dirname(tsconfigDir) &&
        !fs.existsSync(path.join(tsconfigDir, "tsconfig.json"))
      ) {
        tsconfigDir = path.dirname(tsconfigDir);
      }

      if (fs.existsSync(path.join(tsconfigDir, "tsconfig.json"))) {
        try {
          // Run tsc --noEmit (shell: true for Windows compatibility)
          const result = execSync("npx tsc --noEmit --pretty false 2>&1", {
            cwd: tsconfigDir,
            encoding: "utf8",
            stdio: ["pipe", "pipe", "pipe"],
            timeout: 60000,
            shell: true,
          });

          // Filter errors related to the edited file
          const normalizedPath = filePath.replace(/\\/g, "/");
          const lines = result
            .split("\n")
            .filter((line) => {
              const normalizedLine = line.replace(/\\/g, "/");
              return normalizedLine.includes(normalizedPath) || normalizedLine.includes(path.basename(filePath));
            })
            .slice(0, 10);

          if (lines.length > 0) {
            console.error(`[Hook] TypeScript errors in ${path.basename(filePath)}:`);
            lines.forEach((line) => console.error(line));
          }
        } catch (e) {
          // tsc returns non-zero on errors
          const output = e.stdout || e.stderr || "";
          const normalizedPath = filePath.replace(/\\/g, "/");
          const lines = output
            .split("\n")
            .filter((line) => {
              const normalizedLine = line.replace(/\\/g, "/");
              return normalizedLine.includes(normalizedPath) || normalizedLine.includes(path.basename(filePath));
            })
            .slice(0, 10);

          if (lines.length > 0) {
            console.error(`[Hook] TypeScript errors in ${path.basename(filePath)}:`);
            lines.forEach((line) => console.error(line));
          }
        }
      }
    }
  } catch (e) {
    // JSON parse error - ignore
  }

  // Always output original data
  process.stdout.write(inputData);
});
