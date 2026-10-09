# Update workflow

The registry's facts are refreshed manually. No fact-refresh schedule is installed by this repository. Generated-file and data checks are local validation, not live source verification.

## Research and edit

1. Read [docs/SCOPE.md](docs/SCOPE.md), the current YAML, and the relevant profiles in CATALOG.md. Use **Bun/TypeScript**; no external package dependencies are required. Bun 1.4.2 was used for the October 2026 refresh.
2. Fetch the issuer's programme and assessment pages. Verify the exact name, distinct certification assessment, current exam availability, and prerequisite conditions. Classify securing AI separately from using AI in cybersecurity. Do not infer a practical exam from hands-on training.
3. Fetch the exam store, registration, or authorized partner page. Verify the **initial attempt**, currency, required bundle or subscription, membership restrictions, additional application fees, retakes, and recurring charges where published. Never use a retake price as the initial exam price. Preserve explicit unknowns and conflicting product information.
4. Edit `data/certifications.yaml`. Keep stable, issuer-specific IDs and all required fields. Replace the old `cost_usd` model with the structured `pricing` object described below. Add labeled `sources`, and use `last_verified` only for a substantive check actually performed. Regenerating Markdown is not verification. If part of a record remains unverified or uses older evidence, say so in its notes.
5. Sweep for omissions across AI security, agentic security, AI/ML red teaming, AI governance, and provider exam stores. Add a programme only when the evidence meets the scope policy. Place announcement-only entries in `upcoming`, uncertain assessment/availability in `unverified`, and certificate programmes in `excluded`. Retain retired and excluded records with reasons; do not inflate current-certification counts.
6. Review [docs/CHOOSING.md](docs/CHOOSING.md) when an exam's availability, coverage, or prerequisites materially change its recommendation. The guide is editorial prose; prices and detailed credential facts remain in the YAML and generated catalogue.

## Record schema

Required fields are `id`, `name`, `org`, `category`, `security_focus`, `assessment_type`, `focus`, `format`, `level`, `prerequisites`, `url`, `status`, `launched`, `last_verified`, `notes`, `pricing`, and `sources`. Nullable fields are explicit, not omitted.

- Categories: `offensive`, `defensive`, `ai-for-security`, `governance`, `management-systems`, `vendor-ai`.
- Security focus: `primary`, `mixed`, `minor`, `none`.
- Assessment: `practical`, `mixed`, `knowledge`, `unconfirmed`, `course-assessment`. An unconfirmed format does not itself disprove a distinct certification scheme; explain exactly what is unknown.
- Status: `available`, `beta`, `upcoming`, `unverified`, `retired`, `excluded`.
- Level: `Entry`, `Intermediate`, `Advanced`, `Unspecified`. These are audience descriptions, not cross-issuer difficulty scores.
- `prerequisites` and `launched`: text or `null`. Differentiate required eligibility from recommended preparation.
- `last_verified`: a quoted `YYYY-MM-DD` date, never a future date.
- `notes`: an array of strings. The first note for an excluded entry must explain its exclusion.
- `pricing`: `{ amount, currency, basis, details, purchase_url }`. Use `null` for unknown numeric price, currency, or purchase link. A numeric price requires an evidenced currency. Basis is `exam`, `bundle`, `subscription`, `quote`, or `unknown`.
- `sources`: one or more `{ url, label }` objects linking the supporting evidence. Keep purchase/registration links separate from descriptive sources when helpful.

## Validate and review

```sh
bun run generate
bun run check
git diff --check
git diff --stat
git diff
```

`generate` validates the source and writes README.md plus CATALOG.md. `check` verifies that generated files are current and runs focused regression tests. Output is deterministic; a build does not insert today's date into unchanged records. Review classification, currency, checkout identity, every newly added URL, exclusions, and recommendation changes before publishing.

Commit the intended files on a branch and use the repository's normal review/merge process. A maintenance script should not stage unrelated work or publish after a failed research or validation step.

## Optional manual research helper

`bun run refresh` runs UPDATING.md through an installed, authenticated Claude CLI using the maintainer's subscription login. The helper removes API-key environment variables from its child process, preserves other session restrictions, logs to ignored `refresh.log`, and stops if research or validation fails.

It **does not commit, push, merge, or install a schedule**. It can leave partial local edits when research fails; inspect the log and diff. The helper is optional: the same workflow can be followed manually without Claude. Do not claim a schedule or automatic maintenance exists unless one has separately been installed and verified.
