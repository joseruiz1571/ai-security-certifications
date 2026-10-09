import { fileURLToPath } from "node:url";
import { join } from "node:path";

export const ROOT = fileURLToPath(new URL("../", import.meta.url));
export const CATEGORIES = {
  offensive: { title: "AI red teaming and offensive security", description: "Assessing and attacking AI systems, models, and agents." },
  defensive: { title: "AI security engineering and defense", description: "Designing, testing, and operating controls that protect AI systems." },
  "ai-for-security": { title: "AI for cybersecurity", description: "Using AI for offensive operations, detection, automation, or response. This is a different emphasis from securing AI itself." },
  governance: { title: "AI governance, risk, and audit", description: "Oversight, risk decisions, assurance, and accountability. Security depth varies by qualification." },
  "management-systems": { title: "AI management systems", description: "Implementing or auditing management systems such as ISO/IEC 42001. These are not technical AI penetration-testing qualifications." },
  "vendor-ai": { title: "Adjacent cloud and vendor AI certifications", description: "Platform knowledge with a limited or mixed security component. These are included for comparison, not counted as dedicated AI security qualifications." },
} as const;
export const SECURITY_FOCUS = {
  primary: "Securing AI is central",
  mixed: "Substantial AI-system security component",
  minor: "Minor AI-system security component",
  none: "AI-system security not explicit",
} as const;
export const ASSESSMENTS = {
  practical: "Practical exam",
  mixed: "Knowledge + practical exam",
  knowledge: "Knowledge exam",
  unconfirmed: "Assessment format unconfirmed",
  "course-assessment": "Course assessment",
} as const;
export const STATUSES = ["available", "beta", "upcoming", "unverified", "retired", "excluded"] as const;
export const PRICE_BASES = ["exam", "bundle", "subscription", "quote", "unknown"] as const;
export interface Cert {
  id: string;
  name: string;
  org: string;
  category: keyof typeof CATEGORIES;
  security_focus: keyof typeof SECURITY_FOCUS;
  assessment_type: keyof typeof ASSESSMENTS;
  focus: string;
  format: string;
  level: "Entry" | "Intermediate" | "Advanced" | "Unspecified";
  prerequisites: string | null;
  url: string;
  status: (typeof STATUSES)[number];
  launched: string | null;
  last_verified: string;
  notes: string[];
  pricing: { amount: number | null; currency: string | null; basis: (typeof PRICE_BASES)[number]; details: string; purchase_url: string | null };
  sources: { url: string; label: string }[];
}

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const isText = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
const isUrl = (v: unknown) => {
  if (!isText(v) || /[\u0000-\u0020\u007f]/.test(v)) return false;
  try { const u = new URL(v); return ["https:", "http:"].includes(u.protocol) && !u.username && !u.password; }
  catch { return false; }
};
const isDate = (v: unknown) => isText(v) && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v;

/** Reject silent omissions, ambiguous currencies, and invalid classifications before rendering. */
export function validateRegistry(input: unknown, today = new Date().toISOString().slice(0, 10)): Cert[] {
  if (!Array.isArray(input) || input.length === 0) throw new Error("Registry must be a non-empty array.");
  const errors: string[] = [];
  const ids = new Set<string>();
  const fields = ["id", "name", "org", "category", "security_focus", "assessment_type", "focus", "format", "level", "prerequisites", "url", "status", "launched", "last_verified", "notes", "pricing", "sources"];
  input.forEach((c, i) => {
    if (!isObject(c)) { errors.push(`Entry ${i + 1}: expected an object.`); return; }
    const label = typeof c.id === "string" ? c.id : `Entry ${i + 1}`;
    const fail = (message: string) => errors.push(`${label}: ${message}`);
    for (const key of Object.keys(c)) if (!fields.includes(key)) fail(`unknown field ${key}`);
    for (const key of ["id", "name", "org", "focus", "format"]) if (!isText(c[key])) fail(`${key} must be non-empty text`);
    if (typeof c.id === "string") {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(c.id)) fail("id must be a lowercase URL-safe identifier");
      if (ids.has(c.id)) fail("duplicate id");
      ids.add(c.id);
    }
    for (const [key, values] of Object.entries({ category: Object.keys(CATEGORIES), security_focus: Object.keys(SECURITY_FOCUS), assessment_type: Object.keys(ASSESSMENTS), status: STATUSES, level: ["Entry", "Intermediate", "Advanced", "Unspecified"] })) {
      if (!values.includes(c[key] as string)) fail(`invalid ${key}: ${String(c[key])}`);
    }
    for (const key of ["prerequisites", "launched"]) if (c[key] !== null && !isText(c[key])) fail(`${key} must be text or null`);
    if (!isUrl(c.url)) fail("url must be an HTTP(S) URL without credentials");
    if (!isDate(c.last_verified) || (typeof c.last_verified === "string" && c.last_verified > today)) fail("last_verified must be a real date, not in the future");
    if (!Array.isArray(c.notes) || !c.notes.every(isText)) fail("notes must be an array of non-empty strings");
    if (["excluded", "unverified", "upcoming", "retired"].includes(c.status as string) && (!Array.isArray(c.notes) || c.notes.length === 0)) fail("non-current entries need an explanatory note");
    if (["available", "beta"].includes(c.status as string) && c.assessment_type === "course-assessment") fail("course assessments cannot be counted as current certifications");
    if (c.assessment_type === "unconfirmed" && (!Array.isArray(c.notes) || c.notes.length === 0)) fail("unconfirmed assessment format needs an explanatory note");
    if (!Array.isArray(c.sources) || c.sources.length === 0) fail("at least one labeled source is required");
    else c.sources.forEach((s, n) => { if (!isObject(s) || !isUrl(s.url) || !isText(s.label)) fail(`invalid source ${n + 1}`); });
    if (!isObject(c.pricing)) { fail("pricing must be an object"); return; }
    const p = c.pricing;
    if (p.amount !== null && (typeof p.amount !== "number" || !Number.isFinite(p.amount) || p.amount < 0)) fail("pricing.amount must be non-negative or null");
    if (p.currency !== null && (typeof p.currency !== "string" || !/^[A-Z]{3}$/.test(p.currency))) fail("pricing.currency must be a three-letter currency code or null");
    if (typeof p.amount === "number" && p.currency === null) fail("numeric prices require a verified currency");
    if (!(PRICE_BASES as readonly unknown[]).includes(p.basis)) fail("invalid pricing.basis");
    if (!isText(p.details)) fail("pricing.details must explain what the price buys or what is unknown");
    if (p.purchase_url !== null && !isUrl(p.purchase_url)) fail("pricing.purchase_url must be an HTTP(S) URL or null");
    for (const key of Object.keys(p)) if (!["amount", "currency", "basis", "details", "purchase_url"].includes(key)) fail(`unknown pricing field ${key}`);
  });
  if (errors.length) throw new Error(`Registry validation failed:\n${errors.map(e => `- ${e}`).join("\n")}`);
  return input as Cert[];
}

export async function loadRegistry(root = ROOT): Promise<Cert[]> {
  return validateRegistry(Bun.YAML.parse(await Bun.file(join(root, "data/certifications.yaml")).text()));
}
export function md(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\\/g, "\\\\").replace(/([`*_\[\]])/g, "\\$1").replace(/\|/g, "&#124;").replace(/\r?\n/g, "<br>");
}
export const link = (label: string, url: string) => `[${md(label)}](${url.replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\|/g, "%7C").replace(/ /g, "%20")})`;
export const sorted = (certs: Cert[]) => [...certs].sort((a, b) => a.org.localeCompare(b.org, "en") || a.name.localeCompare(b.name, "en"));
export const current = (c: Cert) => c.status === "available" || c.status === "beta";
export const catalogLink = (c: Cert, prefix = "") => link(c.name, `${prefix}CATALOG.md#${c.id}`);
export const amount = (c: Cert) => c.pricing.amount === null ? (c.pricing.basis === "quote" ? "Quote required" : "Price not verified") : `${c.pricing.currency} ${c.pricing.amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
