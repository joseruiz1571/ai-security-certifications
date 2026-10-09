import { describe, expect, test } from "bun:test";
import { ROOT, amount, current, link, loadRegistry, validateRegistry, type Cert } from "./registry";
import { renderCatalog, renderReadme } from "./generate";

const example = (): Cert => ({
  id: "example-ai", name: "Example C|AI", org: "Example", category: "defensive",
  security_focus: "primary", assessment_type: "practical", focus: "Agent security", format: "A practical exam",
  level: "Intermediate", prerequisites: null, url: "https://example.com/exam", status: "available",
  launched: null, last_verified: "2026-10-09", notes: [],
  pricing: { amount: 0, currency: "USD", basis: "exam", details: "Free initial attempt", purchase_url: "https://example.com/book" },
  sources: [{ url: "https://example.com/exam", label: "Assessment and pricing" }],
});

const validate = (records: unknown) => validateRegistry(records, "2026-10-09");

describe("evidence and schema boundaries", () => {
  test("accepts an explicit free exam without confusing it with an unknown price", () => {
    const c = validate([example()])[0];
    expect(amount(c)).toBe("USD 0");
    c.pricing.amount = null;
    expect(amount(c)).toBe("Price not verified");
  });
  test("rejects duplicate IDs and unknown categories instead of silently omitting records", () => {
    expect(() => validate([example(), example()])).toThrow("duplicate id");
    const c: any = example(); c.category = "offensiv";
    expect(() => validate([c])).toThrow("invalid category");
  });
  test("rejects missing evidence and missing required fields", () => {
    const c: any = example(); c.sources = []; c.format = "";
    expect(() => validate([c])).toThrow("at least one labeled source");
    expect(() => validate([c])).toThrow("format must be non-empty");
  });
  test("rejects ambiguous numeric currencies, negative prices, and old schema fields", () => {
    const c: any = example(); c.pricing.currency = null;
    expect(() => validate([c])).toThrow("numeric prices require a verified currency");
    c.pricing.currency = "CAD"; c.pricing.amount = -1;
    expect(() => validate([c])).toThrow("pricing.amount must be non-negative");
    c.pricing.amount = 900; c.cost_usd = 900;
    expect(() => validate([c])).toThrow("unknown field cost_usd");
  });
  test("rejects future or invalid verification dates and unsafe source URLs", () => {
    const c = example(); c.last_verified = "2026-10-10";
    expect(() => validate([c])).toThrow("last_verified");
    c.last_verified = "2026-02-30";
    expect(() => validate([c])).toThrow("last_verified");
    c.last_verified = "2026-10-09"; c.sources[0].url = "javascript:alert(1)";
    expect(() => validate([c])).toThrow("invalid source");
    c.sources[0].url = "https://example.com/a\nb";
    expect(() => validate([c])).toThrow("invalid source");
  });
  test("keeps course assessments out of current certifications and explains uncertainty", () => {
    const c = example(); c.assessment_type = "course-assessment";
    expect(() => validate([c])).toThrow("course assessments cannot be counted");
    c.status = "excluded"; c.notes = ["Certificate of completion."];
    expect(validate([c])[0].status).toBe("excluded");
    c.assessment_type = "unconfirmed"; c.notes = [];
    expect(() => validate([c])).toThrow("unconfirmed assessment format needs");
  });
});

describe("rendering and catalogue integrity", () => {
  test("preserves literal pipes in certification names without breaking table columns", () => {
    const readme = renderReadme([example()]);
    expect(readme).toContain("Example C&#124;AI");
    const row = readme.split("\n").find(line => line.includes("CATALOG.md#example-ai"))!;
    expect(row.split("|").length).toBe(7);
    expect(link("Exam", "https://example.com/a|b")).toBe("[Exam](https://example.com/a%7Cb)");
  });
  test("separates watchlist/exclusions from current counts and preserves currencies", () => {
    const records = [example(), { ...example(), id: "future-ai", status: "upcoming" as const, notes: ["Not yet available"] }, { ...example(), id: "course-ai", status: "excluded" as const, notes: ["Course certificate"] }];
    records[0].pricing = { ...records[0].pricing, amount: 900, currency: "CAD" };
    const readme = renderReadme(records);
    expect(readme).toContain("**1 current certifications**");
    expect(readme).toContain("**1 upcoming or unverified entries**");
    expect(readme).toContain("CAD 900");
    expect(records.filter(current)).toHaveLength(1);
  });
  test("real data renders every record exactly once and does not mutate its source", async () => {
    const records = await loadRegistry(ROOT.replace(/\/$/, ""));
    const before = JSON.stringify(records);
    const catalog = renderCatalog(records);
    const readme = renderReadme(records);
    expect([...catalog.matchAll(/<a id="([a-z0-9-]+)"><\/a>/g)]).toHaveLength(records.length);
    for (const c of records) {
      expect(catalog.split(`<a id="${c.id}"></a>`)).toHaveLength(2);
      expect(readme.split(`CATALOG.md#${c.id})`)).toHaveLength(2);
    }
    expect(JSON.stringify(records)).toBe(before);
    expect(renderReadme([...records].reverse())).toBe(readme);
    expect(renderCatalog([...records].reverse())).toBe(catalog);
  });
  test("editorial catalogue links resolve to actual stable IDs", async () => {
    const ids = new Set((await loadRegistry()).map(c => c.id));
    const guide = await Bun.file(`${ROOT}docs/CHOOSING.md`).text();
    for (const match of guide.matchAll(/CATALOG\.md#([a-z0-9-]+)/g)) expect(ids.has(match[1])).toBe(true);
  });
});
