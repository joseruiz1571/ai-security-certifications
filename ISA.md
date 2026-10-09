# Implementation notes — AI Security Certifications

Updated 2026-10-09. These notes describe the repository as implemented, replacing the historical build checklist and its stale scheduling claims.

## Purpose

Maintain a sourced registry that distinguishes exam-based AI-security certifications from certificate programmes, adjacent governance/vendor qualifications, and future announcements. Help readers compare actual certification assessments, prerequisites, exam purchase routes, and prices in their published currencies. A separate editorial guide applies the catalogue to agentic security, red teaming, safety, and governance interests.

## Source of truth and generated output

- `data/certifications.yaml` contains credential facts, availability, pricing, limitations, and source links.
- `scripts/registry.ts` defines the schema, classifications, validation, and Markdown escaping.
- `scripts/generate.ts` generates README.md and CATALOG.md. Never edit either generated file by hand.
- `docs/SCOPE.md` defines inclusion and evidence rules; `docs/CHOOSING.md` is an editorial guide linking to the catalogue.
- `UPDATING.md` describes the manual research, validation, and publication workflow.
- `scripts/refresh.ts` is an optional manual research helper. It leaves a diff, stops on failure, and never commits or pushes.

## Constraints

Use Bun/TypeScript and built-in APIs. Fetch new dataset URLs before recording them. Prefer issuer assessment pages and stores; identify partner prices and unverified fields explicitly. Do not infer USD from a dollar sign, exam availability from a launch announcement, or practical assessment from training labs.

Keep stable IDs for existing offerings and preserve exclusions/retirements with reasons. Report separate counts for current qualifications, dedicated AI-security emphasis, announcements/unverified entries, and exclusions. Do not claim worldwide completeness, automatic factual freshness, accreditation, or employment outcomes without evidence.

## Validation

Run `bun run generate`, `bun run check`, and `git diff --check`. Tests cover malformed records, duplicate IDs, missing evidence, currencies, status boundaries, Markdown table escaping, generated profile/count parity, internal catalogue references, deterministic output, and failure handling in the manual refresh helper.

Local tests cannot establish that a commercial exam is currently purchasable or that an issuer's certification has a particular reputation. Those are source-review questions. No scheduled fact refresh or CI workflow is configured by this repository.
