import { describe, it, expect } from "vitest";
import { translations } from "../i18n";

const enKeys = Object.keys(translations.en) as (keyof typeof translations.en)[];
const koKeys = Object.keys(translations.ko) as (keyof typeof translations.ko)[];

describe("i18n completeness", () => {
  it("Korean has all English keys", () => {
    const missing = enKeys.filter((k) => !koKeys.includes(k as never));
    expect(missing).toEqual([]);
  });

  it("English has all Korean keys", () => {
    const extra = koKeys.filter((k) => !enKeys.includes(k as never));
    expect(extra).toEqual([]);
  });

  it("EN and KO have the same number of keys", () => {
    expect(enKeys.length).toBe(koKeys.length);
  });
});

describe("i18n string values", () => {
  it("EN string keys are non-empty", () => {
    for (const key of enKeys) {
      const val = translations.en[key];
      if (typeof val === "string") {
        expect(val.length, `EN key "${key}" is empty`).toBeGreaterThan(0);
      }
    }
  });

  it("KO string keys are non-empty", () => {
    for (const key of koKeys) {
      const val = translations.ko[key as keyof typeof translations.ko];
      if (typeof val === "string") {
        expect(val.length, `KO key "${key}" is empty`).toBeGreaterThan(0);
      }
    }
  });

  it("EN and KO strings differ (not copy-pasted)", () => {
    // Keys intentionally shared across languages (brand phrases, universal terms)
    const allowSame = new Set(["footer.powered"]);
    const stringKeys = enKeys.filter((k) => typeof translations.en[k] === "string" && !allowSame.has(k));
    for (const key of stringKeys) {
      const en = translations.en[key] as string;
      const ko = translations.ko[key as keyof typeof translations.ko] as string;
      expect(en, `Key "${key}" has identical EN/KO value`).not.toBe(ko);
    }
  });
});

describe("i18n formatter functions", () => {
  it("stats.summary EN returns correct format", () => {
    const fn = translations.en["stats.summary"];
    const result = fn(3, "10.0 MB", "4.2 MB", 58);
    expect(result).toContain("3 files");
    expect(result).toContain("10.0 MB");
    expect(result).toContain("58%");
  });

  it("stats.summary KO returns correct format", () => {
    const fn = translations.ko["stats.summary"];
    const result = fn(2, "5.0 MB", "2.0 MB", 60);
    expect(result).toContain("2개");
    expect(result).toContain("60%");
  });

  it("file.status.done EN includes size and savings", () => {
    const fn = translations.en["file.status.done"];
    const result = fn("1.2 MB", 45);
    expect(result).toContain("1.2 MB");
    expect(result).toContain("45%");
  });

  it("file.status.done KO includes size and savings", () => {
    const fn = translations.ko["file.status.done"];
    const result = fn("1.2 MB", 45);
    expect(result).toContain("1.2 MB");
    expect(result).toContain("45%");
  });
});
