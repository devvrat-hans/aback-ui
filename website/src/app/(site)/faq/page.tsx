import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

import { Breadcrumbs } from "@aback-ui/ui";

import { JsonLd } from "@/components/json-ld";
import { faqGroups, faqItems } from "@/data/faq";
import { site } from "@/data/site";
import { faqSchema, routeGraph } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/faq");

const crumbs = [{ label: "FAQ" }];
const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function FaqPage() {
  return (
    <div className="container-page pb-24 pt-10 lg:pt-14">
      <JsonLd data={routeGraph("/faq", crumbs, [faqSchema(faqItems)])} />
      <header className="flex flex-col gap-3 border-b border-border pb-10">
        <p className="text-xs font-medium uppercase tracking-wide text-link">FAQ</p>
        <h1 className="text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
          Frequently asked questions
        </h1>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, ...crumbs]} />
        <p className="mt-1 max-w-[68ch] text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
          Short answers about licensing, requirements, installing, theming, and accessibility. Each one
          links to the page that covers it in full.
        </p>
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <nav aria-label="FAQ sections" className="hidden lg:block">
          <ul className="sticky top-24 flex flex-col gap-1 text-sm">
            {faqGroups.map((group) => (
              <li key={group.title}>
                <a href={`#${slug(group.title)}`} className="text-muted-foreground hover:text-foreground">
                  {group.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex max-w-3xl flex-col gap-14">
          {faqGroups.map((group) => (
            <section key={group.title} aria-labelledby={slug(group.title)}>
              <h2 id={slug(group.title)} className="scroll-mt-24 text-2xl font-semibold tracking-tight text-foreground">
                {group.title}
              </h2>
              <div className="mt-4 flex flex-col divide-y divide-border border-y border-border">
                {group.items.map((item) => (
                  <div key={item.question} id={slug(item.question)} className="scroll-mt-24 py-6">
                    <h3 className="text-base font-semibold text-foreground">{item.question}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{item.answer}</p>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-link underline-offset-4 hover:underline"
                      >
                        Read more
                        <span className="sr-only">: {item.question}</span>
                        <IconArrowRight aria-hidden="true" className="size-3.5" />
                      </Link>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ))}

          <p className="border border-border bg-muted/30 p-5 text-sm leading-relaxed text-muted-foreground">
            Still stuck? Open an issue on{" "}
            <a
              href={`${site.repository}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-link underline underline-offset-4"
            >
              GitHub
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
