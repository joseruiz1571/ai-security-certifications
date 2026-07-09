# Update Workflow

This registry self-updates monthly. This file IS the prompt the automated agent executes; a human can follow it identically.

## Steps

1. Read `data/certifications.yaml`.
2. For every entry, re-verify against its official page (web search + fetch the `url`):
   - Confirm the cert still exists under that name. If renamed, update `name` and add a `notes` entry.
   - Update `cost_usd`, `format`, `status` if changed.
   - If the `url` is dead, find the new official URL — only record a URL you actually fetched.
   - Set `last_verified` to today's date for every entry you checked.
3. Sweep for NEW certifications not yet in the file. Search: "AI security certification", "AI red teaming certification", "AI governance certification", "new AI security cert <current year>". Check known issuers: CompTIA, ISACA, IAPP, GIAC/SANS, CSA, OffSec, HTB, TCM Security, SecOps Group, Practical DevSecOps, Learn Prompting, TryHackMe, EC-Council, ISC2, PECB, AWS, Azure, GCP, OCI, NVIDIA, Linux Foundation.
4. Add new finds to `data/certifications.yaml` using the existing schema (id, name, org, category, focus, format, level, cost_usd, prerequisites, url, status, launched, last_verified, notes). Categories: `offensive`, `defensive`, `governance`, `management-systems`, `vendor-ai`.
5. Run `bun run generate` and confirm it exits 0.
6. Commit: `git add -A && git commit -m "refresh: <summary of changes>"`.

## Hard rules

- Never record a URL you did not fetch live during this run.
- Never hand-edit `README.md` — it is generated.
- bun only; never npm/npx; never Python.
- Retired/discontinued certs are not deleted — set `status: retired` and keep the entry.

## Automation

`scripts/refresh.ts` wraps this workflow in a headless Claude run and commits the result. Cron line (installed in the user crontab, monthly on the 3rd at 09:17):

```
17 9 3 * * cd ~/Code/github/joseruiz1571/ai-security-certifications && ~/.bun/bin/bun scripts/refresh.ts >> refresh.log 2>&1
```

Remove the automation anytime with `crontab -e` (delete that line).
