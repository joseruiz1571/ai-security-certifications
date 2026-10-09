# Scope, inclusion rules, and evidence

This registry helps readers find **exam-based certifications** relevant to securing AI and compare them with adjacent AI governance and platform qualifications. It is a best-effort catalogue of identified programmes, not a guarantee that every provider worldwide has been discovered or independently audited.

## What qualifies for the current list

A current entry needs an identifiable issuer, a named certification, evidence of a distinct certification assessment, and evidence that the exam is available or in an active beta. A certification may require training, a subscription, prior credentials, professional experience, an application, or continuing education. Those conditions must be stated separately from the exam price.

We exclude **certificates, professional certificate programmes, and certificates of completion**. A final quiz or examination inside a provider-described certificate programme does not change that classification. The word “Professional” in a certification's name is not itself a reason for exclusion. A certification exam that awards a digital certificate is also not excluded merely because its award is called a certificate; the issuer's scheme and assessment determine the distinction.

The evidence threshold is an identifiable certification scheme and assessment, not an assertion that all included exams have equivalent quality. Proctoring, independent accreditation, renewal, and practical testing vary; none should be inferred from a badge or from the word “certified.” When a course and a certification exam are bundled, the exam must be identifiable separately in the programme description.

Ambiguous programmes belong in **unverified**, with the missing evidence explained. Offerings explicitly described as certificate programmes belong in **excluded**. Excluded records are retained for transparency and are not included in certification counts. A course can be useful learning material while falling outside this registry's certification list.

## Classification

| Field | Meaning |
|---|---|
| `category: offensive` | Assessment and exploitation of AI systems, including models, applications, and agents. |
| `category: defensive` | Security engineering, architecture, testing, and operation of AI systems. |
| `category: ai-for-security` | Using AI to perform security work, such as detection, security automation, or offensive operations. |
| `category: governance` | Governance, risk, assurance, and audit. Security may be one of several concerns. |
| `category: management-systems` | Implementation or auditing of AI management systems. |
| `category: vendor-ai` | Adjacent platform AI certifications with security or governance relevance. |
| `security_focus: primary` | Securing AI is central to the qualification. |
| `security_focus: mixed` | Securing AI is material but shares the qualification with other subjects. |
| `security_focus: minor` | Securing AI is limited within a broader curriculum. |
| `security_focus: none` | No explicit objective about securing AI was verified. This is not an AI-security recommendation. |

The focus labels are editorial interpretations of published objectives. They do not measure exam difficulty, employer recognition, or the exact percentage of assessed questions. A domain combining security, safety, compliance, and governance must not be presented as an equivalent percentage devoted to security alone. Training labs must not be represented as hands-on certification assessment.

## Availability

| Status | Interpretation |
|---|---|
| `available` | A distinct certification assessment is currently offered. Price or purchase-route details may still be unavailable; those gaps are explicit. |
| `beta` | An active beta certification exam is offered; scoring, terms, and credential timing may differ. |
| `upcoming` | Announced, presale, or scheduled, without verified current exam availability. |
| `unverified` | The programme is advertised, but certification assessment, availability, or other foundational evidence is insufficient or contradictory. |
| `retired` | The qualification or recorded exam version has been discontinued. Keep the historical entry and successor information. |
| `excluded` | A certificate programme, completion award, course-only offering, or out-of-scope qualification. The first note explains the exclusion. |

Current totals include `available` and `beta` entries only. Upcoming, unverified, retired, and excluded entries are not counted as current certifications. Adjacent governance and vendor qualifications remain identified separately from the subset with AI security as its primary emphasis. Planned dates are issuer claims, not proof of launch.

## Pricing and purchase links

Every record has a structured `pricing` object:

- `amount`: a verified price for the stated route, or `null` when not established.
- `currency`: the published three-letter currency code; never infer USD from a dollar sign.
- `basis`: `exam`, `bundle`, `subscription`, `quote`, or `unknown`.
- `details`: what the price buys, exam attempts or retakes, membership or eligibility restrictions, required extra fees, promotional conditions, and recurring charges where verified.
- `purchase_url`: a fetched provider or authorized partner purchase, registration, or inquiry route, or `null` when no such route has been verified.

An exam voucher may not cover mandatory training or a required platform subscription. A retake price is not an initial exam price. Do not turn a partner quote into a universal issuer price, silently convert currencies, reuse expired discounts, or assume taxes are included. Upcoming entries can retain clearly labeled advertised prices without suggesting that an exam attempt is already purchasable.

When a page mixes products or contains conflicting figures, prefer the current product-specific checkout or official pricing document when it clearly identifies the correct certification. Otherwise record the uncertainty. Login requirements, geographic pricing, course prerequisites, and application charges should remain visible in the profile.

## Sources and verification dates

`data/certifications.yaml` is the source of truth for credential facts. Each record includes the issuer URL, labeled supporting sources, and `last_verified`. That date records the most recent substantive source check, not the date on which Markdown was regenerated. An older source or unverified field must be described in the notes; checking one URL does not reverify every claim automatically.

Use issuer exam pages, official handbooks, published syllabi, stores, and authorized partner pricing. Fetch new URLs before adding them. An HTTP 200 response, search snippet, checkout shell, or course advertisement alone is not proof of an operational certification exam. Do not claim independent accreditation, employment outcomes, or employer recognition without direct supporting evidence.

`bun run check` validates structure, classifications, internal links, and generated output. It does not perform a live commercial or accreditation audit. Sources and prices still require human review according to [UPDATING.md](../UPDATING.md).
