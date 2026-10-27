# SEO, AEO, and GEO

How abackui.com is set up to be found by search engines and quoted by answer engines, the audit of
ui.shadcn.com it was benchmarked against, and what is still open. Last reviewed 2026-10-28.

## How it works

Everything flows from one list: `website/src/data/routes.ts`. Each indexable page has one entry with
its title, meta description, kind, social-card label, and the repository files it is built from.
From that list:

| Output | Where | Notes |
|---|---|---|
| `<title>`, description, canonical, Open Graph, Twitter | `pageMetadata(path)` in `website/src/lib/seo.ts` | Every page sets all of them, so nothing inherits the home page's `og:url` or title. |
| Social cards | `website/src/app/og/[...slug]/route.tsx` → `/og/<path>.png` | 1200×630 PNG per page, rendered at build time with Geist. |
| Sitemap | `website/src/app/sitemap.ts` | `lastmod` is the newest git commit to the page's source files, not the build time. Each URL lists its social card as an image. |
| Structured data | `website/src/lib/schema.ts` | One JSON-LD `@graph` per page with stable `@id`s. Docs pages get it from `DocsPageHeader`'s `path` prop. |
| llms.txt / llms-full.txt | `website/src/lib/llms.ts` | Docs, components, blocks, tools, blog, and the full FAQ. |
| RSS | `/blog/rss.xml` | Linked from the blog with `rel=alternate`. |

`website/src/data/routes.test.ts` fails the build's tests when a route points at a missing file, a
title or description is duplicated or too long, or a post lacks its table of contents or FAQ.

### Structured data by page type

| Page | Types |
|---|---|
| Every page | `Organization`, `WebSite`, `WebPage` (or `CollectionPage`/`AboutPage`) with `BreadcrumbList` |
| Home | `SoftwareSourceCode` (the library), `SoftwareApplication` (the CLI, free), `FAQPage` |
| Guides, components, blocks | `TechArticle` |
| Component and block catalogues, blog, tools | `ItemList` |
| Blog posts | `BlogPosting`, `FAQPage` |
| Tools and the theme generator | `WebApplication` (free), `FAQPage` |
| FAQ | `FAQPage` |

No ratings, review counts, or download numbers are asserted anywhere. Google only shows FAQ rich
results for a few site categories, so the FAQ markup is there for answer engines and the knowledge
graph rather than for rich snippets.

## Audit of ui.shadcn.com (2026-10-28)

The reference site has a large surface, about 405 sitemap URLs, but light technical SEO:

- **Pages:** about 198 component pages (each component three times, once per primitive library),
  ten installation guides by framework, dark mode by framework, forms guides, RTL, monorepo,
  Tailwind v4, React 19, MCP, registry docs (14 pages), a dated changelog per release, blocks,
  charts, a `/create` theme and project builder, `/colors`, and a community registry directory.
- **SEO:** per-page titles, descriptions, and generated OG images. Canonicals are missing on some
  top-level pages, the sitemap has no `lastmod`, and JSON-LD is a single `WebSite` node on the home
  page only.
- **AEO:** `llms.txt`, a `.md` version of every docs page, and "Copy page" / "Open in ChatGPT or
  Claude" actions on each page.

### Gap analysis

| shadcn/ui has | abackui.com now | Status |
|---|---|---|
| Install guide per framework | Next.js and Vite guides, each verified end to end with a clean app | Done. React Router, Astro, and TanStack Start are not added until verified. |
| `/colors` | `/colors`, read from `tokens.css` at build time | Done |
| `/create` theme builder | `/themes`, generates a contrast-checked theme with a live preview | Done |
| Blog / changelog posts | `/blog` with seven long-form posts, RSS | Done. The changelog is still one page. |
| FAQ | `/faq`, plus FAQs on the home page, posts, and tools | Done |
| Free tools | Contrast checker, colour converter, Tailwind scale generator | Done (shadcn/ui has none of these) |
| About / E-E-A-T | `/about` | Done |
| Rich JSON-LD | Full graph on every page | Done, well beyond the reference |
| `lastmod` in sitemap | From git history | Done, beyond the reference |
| `.md` per page, "Open in ChatGPT/Claude" | "Copy as Markdown" on component pages only | Open |
| Changelog page per release | One page | Open |
| Forms, monorepo, Tailwind v4, React 19 guides | None | Open, write when there is something true to say |
| Charts | None | Not applicable: Aback UI has no chart component |
| MCP server, registry directory | None | Not applicable until they exist |

## Still to do

In order of impact:

1. **Add abackui.com to Google Search Console** as a domain property (verify through the Cloudflare
   DNS zone) and submit `https://abackui.com/sitemap.xml`. Do the same in Bing Webmaster Tools,
   which also feeds ChatGPT search and Copilot. Nothing else here matters until the sitemap is
   submitted.
2. **Get links from places developers already look:** the GitHub README and repository topics, the
   npm package pages, and the three Aback product sites. Each one should link to abackui.com.
3. **Markdown endpoints and "Open in" actions** for every docs page, so agents can fetch a page as
   Markdown and readers can hand it to an assistant.
4. **A page per release** under `/docs/changelog/<version>`, so release notes can rank and be linked.
5. **More verified install guides** (React Router, Astro, TanStack Start), each run against a clean
   project before publishing.
6. **Contrast of `--input` borders.** `#e5e5e5` on white is 1.26:1. WCAG 1.4.11 asks for 3:1 when
   the border is what identifies a control. This is a design-token decision for `DESIGN.md`, not
   an SEO fix, but audits will flag it.

## Adding a page

1. Add an entry to `routes.ts` with a title of at most 59 characters (the layout appends
   " | Aback UI") and a 70 to 170 character description written for the search it answers.
2. Export `metadata = pageMetadata("/your/path")` from the page.
3. Docs pages pass `path` to `DocsPageHeader`; other pages render `<JsonLd data={routeGraph(...)} />`.
4. Link to it from at least one existing page and from search or navigation where it fits.
5. Run `bun run --filter @aback-ui/website test`.
