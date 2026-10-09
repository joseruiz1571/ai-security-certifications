import { afterEach, expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { refresh } from "./refresh";

const roots: string[] = [];
afterEach(async () => { for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true }); });
const workspace = async () => {
  const root = `${await mkdtemp(join(tmpdir(), "ai-cert-refresh-"))}/`;
  roots.push(root);
  await Bun.write(`${root}UPDATING.md`, "Update the fixture without publishing.");
  return root;
};

test("failed research stops before generation or any publication", async () => {
  const calls: string[][] = [];
  const code = await refresh(await workspace(), (command) => { calls.push(command); return { exitCode: 7, stderr: "Research failed" }; });
  expect(code).toBe(7);
  expect(calls).toHaveLength(1);
  expect(calls[0][0]).toBe("claude");
});

test("failed generation stops before later checks", async () => {
  const calls: string[][] = [];
  const code = await refresh(await workspace(), (command) => { calls.push(command); return { exitCode: calls.length === 1 ? 0 : 3 }; });
  expect(code).toBe(3);
  expect(calls).toHaveLength(2);
  expect(calls[1].slice(1)).toEqual(["run", "generate"]);
});

test("successful refresh generates and checks locally without committing or pushing", async () => {
  const calls: string[][] = [];
  const code = await refresh((await workspace()).replace(/\/$/, ""), (command) => { calls.push(command); return { exitCode: 0 }; });
  expect(code).toBe(0);
  expect(calls.map(c => c.slice(0, 1)[0])).not.toContain("git");
  expect(calls.slice(1).map(c => c.slice(1))).toEqual([["run", "generate"], ["run", "check"]]);
  expect(calls[0][2]).toContain("Do not commit, push, merge");
});
