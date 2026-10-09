# Choosing certifications for agentic AI security, red teaming, safety, and governance

**Recommended starting point: choose a practical certification that matches the work you want to perform, then add a governance qualification if your role requires oversight or assurance.** There is little value in collecting every overlapping foundational exam.

This guide ranks fit for an engineering-oriented interest in **agentic AI security, red teaming, safety, and governance**. It is editorial guidance, not a universal ranking of issuer reputation or employment value. It assumes basic security and scripting knowledge, but does not assume an existing pentesting certification. Eligibility and readiness can change the order.

Reviewed 2026-10-09. Follow each catalogue link for current status, actual exam format, prerequisites, purchase links, prices, and primary sources. Prices are kept in the catalogue rather than duplicated here.

## Four related learning goals

| Goal | Competence to look for | What a credential may leave untested |
|---|---|---|
| Agentic AI security | Threat models for tool use, identity and authorization, memory and retrieval, delegation, trust boundaries, approvals, and audit evidence. | Secure operation across a long-running, changing production system. |
| Red teaming | Designing attacks, executing tests, finding exploitable consequences, and reporting reproducible evidence. | Building and operating the controls that prevent recurrence. |
| Safety and reliability | Evaluating unacceptable outcomes, failure handling, supervision, interruption, and the validity of evaluation methods. | A security exploit lab does not establish broad competence in model-behavior or frontier-model safety evaluation. |
| Governance and assurance | Assigning responsibility, making risk decisions, defining controls, and connecting deployment decisions to evidence. | A governance knowledge exam does not demonstrate technical implementation or empirical control effectiveness. |

NIST treats safety and security/resilience as related but distinct characteristics of trustworthy AI. The UK AI Security Institute's control-evaluation work also distinguishes proposing a control from obtaining evidence that it works under adversarial conditions. These distinctions are why this guide combines practical assessment and governance rather than treating one credential as coverage of all four goals. See [NIST's AI RMF characteristics](https://airc.nist.gov/airmf-resources/airmf/3-sec-characteristics/) and [AISI's guide to evaluating control measures for AI agents](https://www.aisi.gov.uk/blog/how-to-evaluate-control-measures-for-ai-agents).

## Recommended order by fit

This is a priority order, **not a requirement to take every exam in sequence**. The reason and condition columns are more useful than the number alone.

| Priority | Certification | Why it fits | When to change its position |
|---|---|---|---|
| 1 | [Practical DevSecOps CMCPSE](../CATALOG.md#pdso-cmcpse) | Direct fit for securing MCP-connected agents: tool access, authorization, policy enforcement, and evidence, assessed through practical work. | Move a broader foundation first if Linux, scripting, or basic application security is a substantial gap. The narrower MCP scope does not cover every agent architecture. |
| 2 | [SecOps C-AgAIPen](../CATALOG.md#secops-c-agaipen) | A direct practical test of agentic attack surfaces and exploitation. | Treat it as a readiness target when you already have pentesting ability: the provider recommends two years of pentesting experience and does not bundle a training course. |
| 3 | [TCM PAPA](../CATALOG.md#tcm-papa) | A useful bridge into assessing an agentic application and producing a professional report. | Take it before C-AgAIPen when structured preparation and reporting practice would help; both are not automatically necessary. |
| 4 | [GIAC GAIPS](../CATALOG.md#giac-gaips) | Broader AI-platform security and practical control knowledge complements an agent-specific exam. | Move it higher for a platform security or assurance role, especially when an employer funds the preparation. |
| 5 | [Practical DevSecOps CAISP](../CATALOG.md#pdso-caisp) | Broad AI-security foundations and a practical certification exam can fill gaps across attacks, threat modeling, and supply chains. | Move it before CMCPSE if those foundations are weak. CAISP is not a mandatory prerequisite for CMCPSE. |
| 6 | [Learn Prompting AIRTP+](../CATALOG.md#learn-prompting-airtp-plus) | Focused LLM adversarial testing, prompt injection, and jailbreak work complements agent infrastructure security. | Move it higher for model-behavior red teaming; combine it with agent/tool boundary testing for broader agent assurance. |
| 7 | [OffSec OSAI / OSAI+](../CATALOG.md#offsec-osai) | A longer enterprise-style offensive assessment can deepen practical AI red teaming. | Prioritize it when general pentesting skills are already strong. The two designations are not different exam performance levels. |
| 8 | [HTB COAE](../CATALOG.md#htb-coae) | Adds depth in adversarial ML and offensive AI beyond prompt-only testing. | Move it higher for an offensive-ML role and when the Python/ML and required learning-path prerequisites are realistic. |
| 9 | [IAPP AIGP](../CATALOG.md#iapp-aigp) | Complements technical work with governance, lifecycle oversight, and risk decisions. | Move it near the top for governance or assurance leadership; it does not replace hands-on agent security testing. |
| 10 | [INE eAIS](../CATALOG.md#ine-eais) | Another AI-security assessment route, with training and purchase options worth comparing. | Verify the exam mechanics and subscription conditions; do not infer a practical format from training alone. |
| 11 | [TryHackMe AI1](../CATALOG.md#tryhackme-ai1) | Accessible attack-and-defense practice across AI-security scenarios. | Move it toward the start when a structured introductory route is more useful than an advanced specialization. |

The learning-path order is an inference from the published curricula and assessment formats linked in each profile. It is not a measured comparison of exam rigor or hiring outcomes.

## Adjust the path to the role

**Agent security engineering or technical assurance:** start with CMCPSE or the broader CAISP, then demonstrate secure tool use, authorization, and audit evidence. Add C-AgAIPen or PAPA when you need to demonstrate adversarial assessment. GAIPS is a broader platform option; AIGP complements governance responsibilities.

**AI red teaming:** choose PAPA for an assessment-and-reporting bridge, or C-AgAIPen when already ready for an agentic pentest. Add AIRTP+ for concentrated LLM behavior testing, or OSAI/COAE for deeper enterprise or offensive-ML work. Match the second credential to a new skill gap rather than repeating the first.

**Governance, risk, or audit:** move AIGP upward. Consider ISACA [AAISM](../CATALOG.md#isaca-aaism), [AAIA](../CATALOG.md#isaca-aaia), or [AAIR](../CATALOG.md#isaca-aair) only after checking the specific prerequisite credentials and intended role. AI-security management, AI auditing, and AI risk are different specializations. Exam eligibility, certification application, and renewal are separate conditions.

**Foundational knowledge:** [CompTIA SecAI+](../CATALOG.md#comptia-secai-plus) can provide a survey across securing AI, AI-assisted security, and governance. [EXIN AISP](../CATALOG.md#exin-aisp) is a knowledge qualification with AI-security objectives. Either may be useful preparation, but neither should be presented as equivalent evidence to a practical agent-security engagement merely because its training includes exercises.

**A specific cloud platform:** add the relevant vendor AI or security certification when the job requires that platform. A broader AI exam with a minor security domain is a supporting credential. A security/governance/safety domain percentage is not a pure security percentage.

## Upcoming options to watch

[Practical DevSecOps CAASE](../CATALOG.md#pdso-caase) is especially relevant to the stated agentic interests on its advertised curriculum, but it remains a future option until the exam is verified as available. [GIAC GAIPT](../CATALOG.md#giac-gaipt) is also a watchlist item rather than an available exam purchase. Check the [upcoming and verification watchlist](../README.md#upcoming-and-verification-watchlist) for these and other announced programmes, including ISC2's planned certification.

Do not delay useful practical work solely for a future credential. A compelling syllabus does not establish an operational exam, final assessment rigor, or a known purchase price.

## Evidence to build alongside an exam

A small, reproducible agent-security assessment can connect the four learning goals. For an authorized test system, document the intended task, trust boundaries, allowed actions, prohibited actions, and the outcome you want to prevent. Then show an allowed action succeeding, a prohibited action being blocked, attempts through an alternate tool or delegation path, and how interruption or approval handling behaves.

Repeat the relevant tests under stated conditions and retain the logs, configuration, findings, and limitations. Explain what the evidence supports and what it leaves uncertain. This is suggested practice, not a claim that any listed exam requires all of these artifacts. It makes the connection between attack discovery, control implementation, safety evaluation, and governance decisions concrete.
