#!/usr/bin/env node
/**
 * PR URL Logger Hook
 *
 * Logs PR URL and provides review command after PR creation via gh pr create.
 */

let inputData = "";

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  inputData += chunk;
});

process.stdin.on("end", () => {
  try {
    const data = JSON.parse(inputData);
    const cmd = data.tool_input?.command || "";

    // Check if this was a gh pr create command
    if (/gh pr create/.test(cmd)) {
      const output = data.tool_output?.output || data.tool_output || "";

      // Extract PR URL
      const urlMatch = output.match(/https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/\d+/);
      if (urlMatch) {
        const prUrl = urlMatch[0];
        console.error(`[Hook] PR created: ${prUrl}`);

        // Extract repo and PR number for review command
        const repoMatch = prUrl.match(/https:\/\/github\.com\/([^/]+\/[^/]+)\/pull\/(\d+)/);
        if (repoMatch) {
          const repo = repoMatch[1];
          const prNumber = repoMatch[2];
          console.error(`[Hook] To review: gh pr review ${prNumber} --repo ${repo}`);
        }
      }
    }
  } catch (e) {
    // JSON parse error - ignore
  }

  // Always output original data
  process.stdout.write(inputData);
});
