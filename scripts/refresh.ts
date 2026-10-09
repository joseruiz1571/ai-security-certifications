#!/usr/bin/env bun
/** Manual research helper. It leaves a reviewable diff and never commits or pushes. */
import { spawnSync } from "bun";
import { join } from "node:path";
import { ROOT } from "./registry";

type Result = { exitCode: number; stdout?: Uint8Array | string; stderr?: Uint8Array | string };
type Run = (command: string[], options: { cwd: string; env: Record<string, string | undefined>; stdout: "pipe"; stderr: "pipe" }) => Result;
const text = (value?: Uint8Array | string) => typeof value === "string" ? value : value ? new TextDecoder().decode(value) : "";

export async function refresh(root = ROOT, run: Run = (command, options) => spawnSync(command, options)): Promise<number> {
  const env = { ...process.env };
  // This optional helper uses the maintainer's existing subscription login.
  delete env.ANTHROPIC_API_KEY;
  delete env.ANTHROPIC_AUTH_TOKEN;
  const options = { cwd: root, env, stdout: "pipe" as const, stderr: "pipe" as const };
  const workflow = await Bun.file(join(root, "UPDATING.md")).text();
  const prompt = `Research and update this registry at ${root} following the workflow below. Leave all edits for review. Do not commit, push, merge, install a schedule, or change credentials.\n\n${workflow}`;
  let result: Result;
  try {
    result = run(["claude", "-p", prompt, "--allowedTools", "WebSearch,WebFetch,Read,Edit,Write,Grep,Glob,Bash(bun *),Bash(git status *),Bash(git diff *)"], options);
  } catch (error) {
    console.error(`Research could not start: ${String(error)}`);
    return 1;
  }
  const logFile = Bun.file(join(root, "refresh.log"));
  const log = `${new Date().toISOString()}\nexit=${result.exitCode}\n${text(result.stdout)}\n${text(result.stderr)}\n---\n`;
  await Bun.write(logFile, (await logFile.exists() ? await logFile.text() : "") + log);
  if (result.exitCode !== 0) {
    console.error(`Research failed (exit ${result.exitCode}); stopped before generation. Inspect refresh.log and any partial edits.`);
    return result.exitCode || 1;
  }
  for (const command of [[process.execPath, "run", "generate"], [process.execPath, "run", "check"]]) {
    let check: Result;
    try { check = run(command, options); }
    catch (error) { console.error(`Validation could not start: ${String(error)}`); return 1; }
    if (text(check.stdout)) console.log(text(check.stdout));
    if (text(check.stderr)) console.error(text(check.stderr));
    if (check.exitCode !== 0) {
      console.error("Validation failed. Changes remain local for correction; nothing was committed or pushed.");
      return check.exitCode || 1;
    }
  }
  console.log("Research and local validation complete. Review the source evidence and git diff before publishing.");
  return 0;
}

if (import.meta.main) process.exit(await refresh());
