import { existsSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { postModules } from "@/content/blog";
import { pageMetadata } from "@/lib/seo";

import { faqItems } from "./faq";
import { posts } from "./posts";
import { routes } from "./routes";

const root = path.resolve(process.cwd(), "..");

describe("routes", () => {
  it("has one entry per path", () => {
    const paths = routes.map((route) => route.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("points every page at a page file that exists", () => {
    for (const route of routes) {
      if (route.kind === "component" || route.kind === "block" || route.kind === "post") continue;
      const file = route.path === "/" ? "page.tsx" : `${route.path.slice(1)}/page.tsx`;
      expect(existsSync(path.join(root, "website/src/app/(site)", file)), route.path).toBe(true);
    }
  });

  it("lists only source files that exist", () => {
    for (const route of routes) {
      for (const source of route.sources) {
        expect(existsSync(path.join(root, source)), `${route.path}: ${source}`).toBe(true);
      }
    }
  });

  it("keeps titles and descriptions inside search snippet limits", () => {
    for (const route of routes) {
      // The layout appends " | Aback UI" (11 characters) to every title but the home page's.
      expect(route.title.length + (route.path === "/" ? 0 : 11), route.path).toBeLessThanOrEqual(70);
      expect(route.description.length, route.path).toBeGreaterThanOrEqual(70);
      expect(route.description.length, route.path).toBeLessThanOrEqual(170);
    }
  });

  it("gives every title and description to one page only", () => {
    expect(new Set(routes.map((route) => route.title)).size).toBe(routes.length);
    expect(new Set(routes.map((route) => route.description)).size).toBe(routes.length);
  });

  it("builds consistent canonical and social metadata", () => {
    for (const route of routes) {
      const metadata = pageMetadata(route.path);
      expect(metadata.alternates?.canonical).toBe(route.path);
      expect(metadata.openGraph?.url).toBe(route.path);
      expect(metadata.description).toBe(route.description);
    }
  });
});

describe("blog", () => {
  it("has a body, an in-order table of contents, and a FAQ for every post", () => {
    for (const post of posts) {
      const content = postModules[post.slug];
      expect(content, post.slug).toBeDefined();
      expect(content!.toc.length, post.slug).toBeGreaterThanOrEqual(3);
      expect(content!.faq.length, post.slug).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("faq", () => {
  it("has unique questions", () => {
    expect(new Set(faqItems.map((item) => item.question)).size).toBe(faqItems.length);
  });
});
