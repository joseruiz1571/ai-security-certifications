#!/usr/bin/env bun
/**
 * Monthly self-update: runs a headless Claude session that executes UPDATING.md,
 * then regenerates the README and commits.
 *
 * Invoked by cron (see UPDATING.md for the crontab line). Safe to run manually:
 *   bun run refresh
 */
import { spawnSync } from "bun";

const root = new URL("..", import.meta.url).pathname;

// Subscription billing only — never let API-key env vars hijack billing.
const env = { ...process.env };
delete env.ANTHROPIC_API_KEY;
delete env.ANTHROPIC_AUTH_TOKEN;
delete env.CLAUDECODE; // allow headless run even if launched from odd contexts

const prompt = await Bun.file(`${root}UPDATING.md`).text();

const claude = spawnSync(
  [
    "claude",
    "-p",
    `Execute this update workflow for the repo at ${root}:\n\n${prompt}`,
    "--allowedTools",
    "WebSearch,WebFetch,Read,Edit,Write,Grep,Glob,Bash(bun *),Bash(git *)",
  ],
  { cwd: root, env, stdout: "pipe", stderr: "pipe" },
);

const log = `${new Date().toISOString()}\nexit=${claude.exitCode}\n${claude.stdout?.toString() ?? ""}\n${claude.stderr?.toString() ?? ""}\n---\n`;
const logFile = Bun.file(`${root}refresh.log`);
await Bun.write(logFile, (await logFile.exists() ? await logFile.text() : "") + log);

// Regenerate + commit regardless (idempotent if nothing changed)
spawnSync(["bun", `${root}scripts/generate.ts`], { cwd: root });
spawnSync(["git", "add", "-A"], { cwd: root });
spawnSync(["git", "commit", "-m", `refresh: automated update ${new Date().toISOString().slice(0, 10)}`], {
  cwd: root,
});
spawnSync(["git", "push"], { cwd: root });

console.log(`Refresh complete, exit=${claude.exitCode}. See refresh.log.`);
