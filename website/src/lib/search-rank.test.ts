import { describe, expect, it } from "vitest";

import { searchItems } from "@/data/search";

import { rankSearch } from "./search-rank";

function results(query: string) {
  return searchItems
    .map((item) => ({ item, score: rankSearch(query, item.title, item.description, item.group) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item.title);
}

describe("rankSearch", () => {
  it("matches everything for an empty query", () => {
    expect(rankSearch("", "Button")).toBe(1);
    expect(rankSearch("   ", "Button")).toBe(1);
  });

  it("puts the entry whose name was typed first", () => {
    expect(results("meter")[0]).toBe("Meter");
    expect(results("button")[0]).toBe("Button");
    expect(results("Dialog")[0]).toBe("Dialog");
  });

  it("orders exact, prefix, word, and inner title matches before description matches", () => {
    const exact = rankSearch("button", "Button");
    const prefix = rankSearch("but", "Button");
    const word = rankSearch("but", "Copy Button");
    const inner = rankSearch("utto", "Button");
    const description = rankSearch("button", "Dialog", "Opens from a button.");
    expect(exact).toBeGreaterThan(prefix);
    expect(prefix).toBeGreaterThan(word);
    expect(word).toBeGreaterThan(inner);
    expect(inner).toBeGreaterThan(description);
    expect(description).toBeGreaterThan(0);
  });

  it("does not match letters scattered through a description", () => {
    expect(rankSearch("meter", "Theming", "Semantic colour roles and how to override them safely.")).toBe(0);
  });

  it("needs every word of the query", () => {
    expect(rankSearch("date picker", "Date Picker", "A date field.")).toBeGreaterThan(0);
    expect(rankSearch("date zebra", "Date Picker", "A date field.")).toBe(0);
  });

  it("finds an entry by what it is for", () => {
    expect(results("drag")).toContain("Dropzone");
  });

  it("returns nothing for a query that matches no entry", () => {
    expect(results("zzzzqqq")).toEqual([]);
  });
});
