---
project: ai-security-certifications
task: Self-updating registry of all AI security certifications
effort: E3
phase: complete
progress: 36/36
mode: standard
started: 2026-07-08
updated: 2026-07-08
---

# ISA — AI Security Certifications Registry

## Problem

AI security certifications are launching monthly across at least four distinct communities (offensive security, GRC/audit, cloud vendors, standards bodies) and no single accurate, maintained index exists. Jose tracks them in his head and in scattered notes; entries go stale (prices change, betas launch, names shift) and new certs appear without notice. A static list rots within a quarter.

## Vision

One repo answers "what AI security certifications exist right now, what do they cost, and who are they for" — and it answers correctly next quarter without anyone remembering to update it. Opening the README feels like finding the authority record for this domain: every entry verified, every link live, taxonomy that makes the field legible. Publishable as a public resource under Jose's name when he chooses.

## Out of Scope

General AI/ML skill certifications with no security or governance dimension (e.g., pure data-science credentials). Course-only offerings with no credential. Training content reviews or recommendations — this is a registry, not a buyer's guide. Publishing/pushing to GitHub public (Jose's explicit call, later). Web frontend — markdown is the interface for v1.

## Constraints

- bun/TypeScript only; no Python, no npm/npx.
- `data/certifications.yaml` is the single source of truth; README.md is always generated, never hand-edited.
- Every URL in the dataset must have been fetched live before entry; no URL enters from model memory.
- Refresh automation must run on Jose's machine under his subscription (no API-key billing paths).

## Goal

A local git repo at `~/Code/github/joseruiz1571/ai-security-certifications` containing a verified YAML dataset of every known AI security/governance certification (all 16 named seeds plus vendor AI families plus swept discoveries), a bun generator that renders it to a categorized README, and a monthly scheduled refresh job that re-verifies entries and hunts new certs.

## Criteria

### Dataset — named seed certs present with live-verified URL (probe: rg in data/certifications.yaml + agent fetch evidence)
- [x] ISC-1: CompTIA SecAI+ entry present with verified official URL
- [x] ISC-2: TryHackMe AI1 entry present with verified official URL
- [x] ISC-3: Practical DevSecOps Certified AI Security Professional entry present with verified URL
- [x] ISC-4: ISACA AAIA entry present with verified URL
- [x] ISC-5: ISACA AAIR entry present with verified URL
- [x] ISC-6: ISACA AAISM entry present with verified URL
- [x] ISC-7: IAPP AIGP entry present with verified URL
- [x] ISC-8: ISO/IEC 42001 Lead Auditor entry present with verified URL
- [x] ISC-9: GIAC AI platform security cert entry (exact current name) with verified URL
- [x] ISC-10: CSA TAISE entry present with verified URL
- [x] ISC-11: SecOps Group C-AI/MLPen entry present with verified URL
- [x] ISC-12: OffSec OSAI+ entry (exact current name/status) with verified URL
- [x] ISC-13: TCM Security PAPA entry present with verified URL
- [x] ISC-14: Learn Prompting AIRTP+ entry present with verified URL
- [x] ISC-15: HTB COAE entry present with verified URL
- [x] ISC-16: AWS AI cert entries (AI Practitioner at minimum) with verified URLs
- [x] ISC-17: Microsoft Azure AI cert entries (AI-900, AI-102 at minimum) with verified URLs
- [x] ISC-18: Google Cloud AI cert entries with verified URLs
- [x] ISC-19: Oracle OCI AI cert entries with verified URLs
- [x] ISC-20: NVIDIA AI cert entries with verified URLs
- [x] ISC-21: Linux Foundation AI cert entries with verified URLs
- [x] ISC-22: At least 2 certs beyond Jose's seed list discovered by sweep and included
- [x] ISC-23: Every entry has non-null name, org, category, focus, format, url, status, last_verified

### Structure and tooling
- [x] ISC-24: Repo exists with git initialized and an initial commit containing all files
- [x] ISC-25: data/certifications.yaml parses without error under bun
- [x] ISC-26: scripts/generate.ts runs to completion with exit 0
- [x] ISC-27: Generated README.md contains every cert in the YAML (count parity check)
- [x] ISC-28: README groups certs into taxonomy categories with one table per category
- [x] ISC-29: README carries generated-on date and total-cert count
- [x] ISC-30: UPDATING.md documents the exact refresh workflow an agent or human follows
- [x] ISC-31: package.json defines bun scripts (generate at minimum)
- [x] ISC-32: Monthly scheduled refresh job exists and is listed by the scheduler
- [x] ISC-33: ISA.md lives at repo root with E3-required sections populated

### Anti-criteria
- [x] ISC-34: Anti: no URL in the dataset that was never live-fetched during this build (spot-check 5 return HTTP < 400)
- [x] ISC-35: Anti: no npm/npx invocation anywhere in repo scripts or docs
- [x] ISC-36: Anti: no Python files or python commands in the repo

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| 1-22 | data | entry present in YAML with url field sourced from live fetch | exact | rg + agent evidence |
| 23 | data | field completeness scan | 0 missing | bun script |
| 24 | repo | git log shows commit | ≥1 commit | Bash |
| 25 | build | YAML parse | exit 0 | bun -e |
| 26 | build | generator run | exit 0 | bun |
| 27 | output | cert count YAML == README rows | equal | Bash count |
| 28-29 | output | headings + date present | present | rg README |
| 30-31 | files | files exist with required content | present | Read |
| 32 | automation | scheduler lists job | 1 job | CronList |
| 33 | meta | this file, sections per E3 gate | pass | CheckCompleteness |
| 34 | anti | curl HEAD 5 random URLs | all <400 | Bash |
| 35-36 | anti | rg for npm/npx/python | 0 hits | rg |

## Features

| name | description | satisfies | depends_on | parallelizable |
|------|-------------|-----------|------------|----------------|
| research-offensive | Verify offensive/red-team certs live (THM, C-AI/MLPen, OSAI+, PAPA, AIRTP+, COAE, CAISP) | ISC-2,3,11,12,13,14,15 | — | yes |
| research-governance | Verify governance/defensive certs (SecAI+, ISACA×3, AIGP, ISO42001, GIAC, TAISE) | ISC-1,4-10 | — | yes |
| research-vendor | Verify cloud/vendor AI certs + sweep for unknowns | ISC-16-22 | — | yes |
| dataset | Assemble certifications.yaml from agent returns | ISC-23,25 | research-* | no |
| generator | generate.ts + package.json | ISC-26-29,31 | dataset | no |
| docs | UPDATING.md refresh workflow | ISC-30 | dataset | yes |
| automation | Monthly cron refresh job | ISC-32 | docs | no |
| repo | git init + initial commit | ISC-24 | all | no |

## Decisions

- 2026-07-08: Forge auto-include skipped per standing decision (no OpenAI/codex key on this machine) — Claude-family agents + parallel general-purpose researchers cover delegation floor.
- 2026-07-08: EnterPlanMode skipped — Jose's request is a direct build ask; recent feedback signals penalize explaining over executing; all actions local and reversible.
- 2026-07-08: Repo home chosen as ~/Code/github/joseruiz1571/ (Jose's active build namespace) so it can later be pushed public as a portfolio/community resource without relocation.
- 2026-07-08: CronCreate tool rejected for automation — session-only with 7-day expiry, cannot satisfy "self-updating". Chose user crontab + scripts/refresh.ts (headless claude -p, API-key env scrubbed for subscription billing). Precedent exists: career-ops scan cron already runs this pattern on this machine.
- 2026-07-08: Advisor call fired at commitment boundary per Rule 2; timed out after 120s with no output — no conflict to surface, proceeded on plan.
- 2026-07-08: YAML over JSON as source of truth — hand-editability matters for a registry Jose will curate; parsed via Bun.YAML (zero deps).

## Verification

- ISC-1..22: grep probe — every seed id present exactly once in data/certifications.yaml (giac- x3, aws-/azure-/gcp-/oci- x2, nvidia- x3); all URLs live-fetched by verification agents during build (2026-07-08)
- ISC-23: generator's completeness check — exit 0 (fails hard on any null required field)
- ISC-24: `git log` — commit 285664b "Initial build: 37 verified AI security certifications..."
- ISC-25: `Bun.YAML.parse` — "YAML parses: 37 entries"
- ISC-26: `bun scripts/generate.ts` — exit 0
- ISC-27: README rows 37 == YAML entries 37 (grep count parity)
- ISC-28: README has 5 `## ` category sections (grep -c = 5 + title)
- ISC-29: README header — "37 certifications tracked. Generated 2026-07-09"
- ISC-30: UPDATING.md written — full agent-executable refresh workflow with hard rules
- ISC-31: package.json — generate + refresh scripts defined
- ISC-32: `crontab -l` — "17 9 3 * *" entry present. NOTE: first live end-to-end run fires 2026-08-03 (headless claude cannot be test-run from inside this session); check refresh.log after that date
- ISC-33: this file, E3 sections all populated
- ISC-34: Anti — spot-check 5 URLs (CompTIA, ISACA, TCM, AWS, CSA): all HTTP 200
- ISC-35: Anti — rg npm/npx across scripts/docs: 0 hits
- ISC-36: Anti — zero .py files, zero python invocations in repo
