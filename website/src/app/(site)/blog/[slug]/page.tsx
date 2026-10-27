import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrowRight } from "@tabler/icons-react";

import { Badge, Breadcrumbs, Button, ShareButtons } from "@aback-ui/ui";

import { DocsPage } from "@/components/docs-page";
import { JsonLd } from "@/components/json-ld";
import { Prose } from "@/components/prose";
import { postModules } from "@/content/blog";
import { getPost, posts } from "@/data/posts";
import { getRoute } from "@/data/routes";
import { formatDate } from "@/lib/format";
import { blogPostingSchema, faqSchema, routeGraph } from "@/lib/schema";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return getPost(slug) ? pageMetadata(`/blog/${slug}`) : {};
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  const content = postModules[slug];
  const route = getRoute(`/blog/${slug}`);
  if (!post || !content || !route) notFound();

  const { default: Body, toc, faq } = content;
  const crumbs = [{ label: "Blog", href: "/blog" }, { label: post.title }];
  const updated = route.lastModified && route.lastModified.slice(0, 10) > post.published ? route.lastModified : undefined;
  // Posts that share a tag first, then the newest of the rest.
  const related = [...posts]
    .filter((other) => other.slug !== post.slug)
    .sort((a, b) => {
      const shared = (other: typeof a) => other.tags.filter((tag) => post.tags.includes(tag)).length;
      return shared(b) - shared(a);
    })
    .slice(0, 3);

  return (
    <div className="container-page pb-24 pt-10 lg:pt-14">
      <JsonLd
        data={routeGraph(route.path, crumbs, [
          blogPostingSchema(route),
          ...(faq.length ? [faqSchema(faq)] : []),
        ])}
      />
      <DocsPage
        toc={[...toc, ...(faq.length ? [{ id: "faq", title: "FAQ" }] : []), { id: "related", title: "Keep reading" }]}
      >
        <header className="flex flex-col gap-3 border-b border-border pb-8">
          <p className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            {post.title}
          </h1>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, ...crumbs]} />
          <p className="mt-1 max-w-[68ch] text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            {post.description}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
            <span>
              By <Link href="/about" className="font-medium text-foreground underline-offset-4 hover:underline">the Aback UI team</Link>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Published <time dateTime={post.published}>{formatDate(post.published)}</time>
            </span>
            {updated ? (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  Updated <time dateTime={updated}>{formatDate(updated)}</time>
                </span>
              </>
            ) : null}
            <span aria-hidden="true">·</span>
            <span>{post.minutes} min read</span>
          </div>
        </header>

        <Prose className="mt-10">
          <Body />
        </Prose>

        {faq.length ? (
          <section aria-labelledby="faq" className="mt-16 max-w-[70ch] border-t border-border pt-10">
            <h2 id="faq" className="scroll-mt-24 text-2xl font-semibold tracking-tight text-foreground">
              Frequently asked questions
            </h2>
            <div className="mt-6 flex flex-col divide-y divide-border border-y border-border">
              {faq.map((item) => (
                <div key={item.question} className="py-5">
                  <h3 className="text-base font-semibold text-foreground">{item.question}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <div className="mt-12 flex max-w-[70ch] flex-wrap items-center justify-between gap-4 border border-border bg-muted/30 p-5">
          <p className="text-sm font-medium text-foreground">Share this post</p>
          <ShareButtons url={absoluteUrl(route.path)} title={post.title} networks={["x", "linkedin", "reddit", "email"]} />
        </div>

        <section aria-labelledby="related" className="mt-16">
          <h2 id="related" className="scroll-mt-24 text-2xl font-semibold tracking-tight text-foreground">
            Keep reading
          </h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-3">
            {related.map((other) => (
              <li key={other.slug}>
                <Link
                  href={`/blog/${other.slug}`}
                  className="group flex h-full flex-col gap-2 border border-border p-4 outline-none transition-colors duration-200 hover:border-primary-300 focus-visible:ring-2 focus-visible:ring-focus-ring dark:hover:border-primary-700"
                >
                  <span className="text-sm font-semibold text-foreground group-hover:text-link">{other.title}</span>
                  <span className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">{other.description}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col items-start gap-4 border border-border bg-brand-wash p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold text-foreground">Try Aback UI in your project</p>
              <p className="mt-1 text-sm text-muted-foreground">Accessible React components you install as source. MIT licensed.</p>
            </div>
            <Button variant="brand" asChild>
              <Link href="/docs/installation">
                Get started
                <IconArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      </DocsPage>
    </div>
  );
}
