import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowRight, IconRss } from "@tabler/icons-react";

import { Badge, Breadcrumbs } from "@aback-ui/ui";

import { JsonLd } from "@/components/json-ld";
import { posts } from "@/data/posts";
import { site } from "@/data/site";
import { formatDate } from "@/lib/format";
import { itemListSchema, routeGraph } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata("/blog"),
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": [{ url: "/blog/rss.xml", title: `${site.name} blog` }] },
  },
};

const crumbs = [{ label: "Blog" }];

export default function BlogPage() {
  return (
    <div className="container-page pb-24 pt-10 lg:pt-14">
      <JsonLd
        data={routeGraph("/blog", crumbs, [
          {
            "@type": "Blog",
            "@id": `${site.url}/blog#blog`,
            name: `${site.name} blog`,
            url: `${site.url}/blog`,
            publisher: { "@id": `${site.url}/#organization` },
          },
          itemListSchema(posts.map((post) => ({ name: post.title, path: `/blog/${post.slug}` }))),
        ])}
      />
      <header className="flex flex-col gap-3 border-b border-border pb-10">
        <p className="text-xs font-medium uppercase tracking-wide text-link">Blog</p>
        <h1 className="text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
          Notes on building interfaces
        </h1>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, ...crumbs]} />
        <p className="mt-1 max-w-[68ch] text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
          Practical guides on React components, Tailwind CSS v4, design tokens, colour, and
          accessibility, written while building Aback UI.
        </p>
        <a
          href="/blog/rss.xml"
          className="mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-link underline-offset-4 hover:underline"
        >
          <IconRss aria-hidden="true" className="size-4" />
          RSS feed
        </a>
      </header>

      <ul className="mt-10 grid gap-px border border-border bg-border md:grid-cols-2">
        {posts.map((post) => (
          <li key={post.slug} className="bg-background">
            <article className="group relative flex h-full flex-col gap-3 p-6 transition-colors duration-200 hover:bg-muted/40">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <time dateTime={post.published}>{formatDate(post.published)}</time>
                <span aria-hidden="true">·</span>
                <span>{post.minutes} min read</span>
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-balance text-foreground group-hover:text-link">
                <Link
                  href={`/blog/${post.slug}`}
                  className="outline-none after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-focus-ring"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{post.description}</p>
              <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
                <IconArrowRight
                  aria-hidden="true"
                  className="ml-auto size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-link motion-reduce:transition-none"
                />
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
