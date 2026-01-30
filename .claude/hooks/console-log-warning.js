#!/usr/bin/env node
/**
 * Console.log Warning Hook
 *
 * Warns about console.log statements in edited JS/TS files.
 * Helps maintain clean code by catching debug statements before commit.
 */

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
      const content = fs.readFileSync(filePath, "utf8");
      const lines = content.split("\n");
      const matches = [];

      lines.forEach((line, idx) => {
        // Match console.log but not commented out ones
        if (/console\.log/.test(line) && !/^\s*(\/\/|\/\*|\*)/.test(line)) {
          matches.push(`  ${idx + 1}: ${line.trim()}`);
        }
      });

      if (matches.length > 0) {
        console.error(`[Hook] WARNING: console.log found in ${path.basename(filePath)}`);
        matches.slice(0, 5).forEach((m) => console.error(m));
        if (matches.length > 5) {
          console.error(`  ... and ${matches.length - 5} more`);
        }
        console.error("[Hook] Consider removing console.log before committing");
      }
    }
  } catch (e) {
    // JSON parse error - ignore
  }

  // Always output original data
  process.stdout.write(inputData);
});
