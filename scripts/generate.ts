#!/usr/bin/env bun
/** Generated files are deterministic: rendering does not refresh verification dates. */
import { ROOT, CATEGORIES, SECURITY_FOCUS, ASSESSMENTS, amount, catalogLink, current, link, loadRegistry, md, sorted, type Cert } from "./registry";

function price(c: Cert): string {
  const p = c.pricing;
  const text = `${amount(c)}${["exam", "bundle", "subscription"].includes(p.basis) ? ` · ${p.basis}` : ""}`;
  return p.purchase_url ? link(text, p.purchase_url) : md(text);
}

function table(certs: Cert[], showStatus = false): string {
  const header = `| Certification / issuer | Securing AI: emphasis | Certification assessment | Exam purchase / price | ${showStatus ? "Status / checked" : "Checked"} |\n|---|---|---|---|---|`;
  return `${header}\n${sorted(certs).map(c => `| ${catalogLink(c)}<br>${md(c.org)} | ${SECURITY_FOCUS[c.security_focus]} | ${ASSESSMENTS[c.assessment_type]} | ${price(c)} | ${showStatus || c.status === "beta" ? `${c.status}<br>` : ""}${c.last_verified} |`).join("\n")}\n`;
}

export function renderReadme(certs: Cert[]): string {
  const live = certs.filter(current);
  const watch = certs.filter(c => c.status === "upcoming" || c.status === "unverified");
  const excluded = certs.filter(c => c.status === "excluded");
  const retired = certs.filter(c => c.status === "retired");
  const dates = certs.map(c => c.last_verified).sort();
  const core = live.filter(c => c.security_focus === "primary" && c.category !== "ai-for-security" && c.category !== "vendor-ai");
  const sections = Object.entries(CATEGORIES).flatMap(([key, meta]) => {
    const entries = live.filter(c => c.category === key);
    return entries.length ? [`## ${meta.title}\n\n${meta.description}\n\n${table(entries)}`] : [];
  }).join("\n");
  return `# AI Security Certifications

A sourced registry of exam-based AI security certifications, with separate comparisons for AI governance, AI for cybersecurity, and vendor AI qualifications.

**${live.length} current certifications** (${core.length} with securing AI as their primary emphasis), **${watch.length} upcoming or unverified entries**, **${excluded.length} exclusions**, and **${retired.length} retired entries.** The current total includes beta exams and adjacent qualifications; it is not a count of dedicated AI-security exams. Latest source check: **${dates.at(-1)}**. See each entry's date and limitations.

**Start here:** [Choosing certifications for agentic security, red teaming, safety, and governance](docs/CHOOSING.md) · [Full catalogue, prerequisites, and sources](CATALOG.md) · [Scope and inclusion rules](docs/SCOPE.md) · [Update workflow](UPDATING.md)

## How to read this registry

- **Securing AI is central:** protecting, assessing, or managing the security of AI is a main purpose of the qualification.
- **Substantial AI-system security component:** securing AI shares the curriculum with governance, engineering, operations, or other subjects. **Minor AI-system security component** means limited coverage of protecting AI within a broader qualification. The **AI for cybersecurity** section identifies credentials chiefly about using AI to do security work; a low AI-system-security emphasis does not imply little cybersecurity content overall.
- **Practical exam** means the certification assessment itself requires practical work. Hands-on training before a multiple-choice exam does not make the exam practical. **Knowledge + practical** is a hybrid assessment.
- Prices use the **published currency**. An **exam** price, required **bundle**, and recurring **subscription** are different purchases. Follow the certification name for member discounts, application fees, retakes, eligibility, promotions, and other conditions. Taxes and country-specific pricing may differ; no currency conversions are estimated.
- Purchase links lead to the provider's exam checkout, registration, booking, or required bundle page where verified. **Price not verified** and missing purchase links are deliberate gaps. A future launch date or a presale does not establish that an exam can already be taken.

This is a best-effort directory, not a claim of complete worldwide coverage or an endorsement of every issuer. **Certificates, professional certificate programs, and certificates of completion are excluded**, even when their course includes a quiz or final exam. Exclusion reasons are retained for auditability. See the [scope policy](docs/SCOPE.md).

The maintainer refreshes sources manually; there is no automatic fact refresh or fixed schedule. A successful build checks data integrity, not whether an issuer's claims are true. README.md and CATALOG.md are generated from [data/certifications.yaml](data/certifications.yaml).

${sections}
## Upcoming and verification watchlist

These entries are **not included in the current-certification count**. An advertised price is not a confirmed exam purchase. Open the details for the specific availability or evidence gap.

${watch.length ? table(watch, true) : "None recorded.\n"}
## Excluded certificate programs and out-of-scope offerings

These are retained only to explain exclusions; they are not certification recommendations.

| Offering | Reason for exclusion | Checked |
|---|---|---|
${sorted(excluded).map(c => `| ${catalogLink(c)} | ${md(c.notes[0])} | ${c.last_verified} |`).join("\n")}

${retired.length ? `## Retired certifications\n\n${table(retired, true)}\n` : ""}## Contributing

Use [UPDATING.md](UPDATING.md) to verify a change, edit the YAML, and run:

\`\`\`sh
bun run generate
bun run check
\`\`\`

Keep names issuer-specific: acronyms such as CAISP, OSAI, and CAISR can identify different qualifications from unrelated providers. To report an omission, include the issuer's certification assessment page and an exam purchase or pricing source.
`;
}

function profile(c: Cert): string {
  const p = c.pricing;
  return `<a id="${c.id}"></a>

### ${md(c.name)}

**${md(c.org)}** · **${c.status}** · Checked ${c.last_verified}

${md(c.focus)}

- **Security emphasis:** ${SECURITY_FOCUS[c.security_focus]}. Category: ${CATEGORIES[c.category].title}.
- **Assessment:** ${ASSESSMENTS[c.assessment_type]}. ${md(c.format)}
- **Level:** ${md(c.level)}.
- **Prerequisites:** ${md(c.prerequisites ?? "No prerequisite information verified; check the issuer before booking.")}
- **Price:** ${md(amount(c))}; basis: **${p.basis}**. ${md(p.details)}
- **Purchase / booking:** ${p.purchase_url ? link("Provider purchase or registration page", p.purchase_url) : "No verified purchase link recorded."}
- **Official programme:** ${link("Issuer page", c.url)}${c.launched ? `\n- **Launch information:** ${md(c.launched)}.` : ""}

${c.notes.length ? `**Notes and limitations**\n\n${c.notes.map(n => `- ${md(n)}`).join("\n")}\n\n` : ""}**Sources**\n\n${c.sources.map(s => `- ${link(s.label, s.url)}`).join("\n")}
`;
}

export function renderCatalog(certs: Cert[]): string {
  const sections = Object.entries(CATEGORIES).flatMap(([key, meta]) => {
    const entries = sorted(certs.filter(c => c.category === key));
    return entries.length ? [`## ${meta.title}\n\n${entries.map(profile).join("\n")}\n`] : [];
  }).join("\n");
  return `# Certification catalogue and source notes

[Registry overview](README.md) · [Choosing a path](docs/CHOOSING.md) · [Inclusion rules](docs/SCOPE.md)

Generated from [data/certifications.yaml](data/certifications.yaml). Do not edit this file by hand. All ${certs.length} tracked records appear here, including upcoming, unverified, retired, and excluded offerings. **Read the status before interpreting an entry as an available certification.** Prices are snapshots of the stated purchase route, not estimates of universal eligibility or total lifetime cost.

Level labels describe intended audience; they are not comparable measures of exam difficulty across issuers.

${sections.trimEnd()}
`;
}

if (import.meta.main) {
  const certs = await loadRegistry();
  const outputs = { "README.md": renderReadme(certs), "CATALOG.md": renderCatalog(certs) };
  const check = process.argv.includes("--check");
  let stale = false;
  for (const [path, content] of Object.entries(outputs)) {
    if (check) {
      const file = Bun.file(`${ROOT}${path}`);
      if (!await file.exists() || await file.text() !== content) { console.error(`${path} is stale. Run bun run generate.`); stale = true; }
    } else await Bun.write(`${ROOT}${path}`, content);
  }
  if (stale) process.exit(1);
  console.log(`${check ? "Verified" : "Generated"} README.md and CATALOG.md from ${certs.length} records.`);
}
