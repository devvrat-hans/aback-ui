import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

import { Badge, Breadcrumbs } from "@aback-ui/ui";

import { JsonLd } from "@/components/json-ld";
import { Prose } from "@/components/prose";
import { getRoute } from "@/data/routes";
import { tools } from "@/data/tools";
import { faqSchema, routeGraph, webApplicationSchema } from "@/lib/schema";

/**
 * The frame every free tool shares: a title block, the tool itself, then
 * written guidance, questions, and links to the other tools. The guidance is
 * what makes the page worth reading when the tool alone would be thin.
 */
export function ToolPage({
  path,
  title,
  lead,
  crumbs,
  features,
  faq,
  tool,
  children,
}: {
  path: string;
  /** The visible h1, which can be shorter than the SEO title. */
  title: string;
  lead: string;
  crumbs: { label: string; href?: string }[];
  features: string[];
  faq: { question: string; answer: string }[];
  /** The interactive client component. */
  tool: React.ReactNode;
  /** How-to and explanation, as plain h2/p/ul elements styled by Prose. */
  children: React.ReactNode;
}) {
  const route = getRoute(path);
  if (!route) throw new Error(`No route entry for ${path}.`);
  const others = tools.filter((item) => `/tools/${item.slug}` !== path);

  return (
    <div className="container-page pb-24 pt-10 lg:pt-14">
      <JsonLd data={routeGraph(path, crumbs, [webApplicationSchema(route, features), faqSchema(faq)])} />
      <header className="flex flex-col gap-3 border-b border-border pb-8">
        <p className="flex flex-wrap items-center gap-2">
          <Badge variant="brand">Free tool</Badge>
          <Badge variant="outline">Runs in your browser</Badge>
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">{title}</h1>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, ...crumbs]} />
        <p className="mt-1 max-w-[68ch] text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">{lead}</p>
      </header>

      <div className="mt-10">{tool}</div>

      <div className="mt-20 grid gap-16 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0">
          <Prose>{children}</Prose>

          <section aria-labelledby="faq" className="mt-16 max-w-[70ch]">
            <h2 id="faq" className="text-2xl font-semibold tracking-tight text-foreground">
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
        </div>

        <aside aria-labelledby="more-tools" className="flex flex-col gap-3 lg:sticky lg:top-24 lg:self-start">
          <h2 id="more-tools" className="text-sm font-semibold text-foreground">
            More free tools
          </h2>
          <ul className="flex flex-col gap-2">
            {[
              ...others.map((item) => ({ title: item.title, href: `/tools/${item.slug}`, description: item.description })),
              ...(path === "/themes"
                ? []
                : [{ title: "Theme generator", href: "/themes", description: "A full, contrast-checked theme from one brand colour." }]),
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex flex-col gap-1 border border-border p-4 outline-none transition-colors duration-200 hover:border-primary-300 focus-visible:ring-2 focus-visible:ring-focus-ring dark:hover:border-primary-700"
                >
                  <span className="flex items-center justify-between text-sm font-semibold text-foreground group-hover:text-link">
                    {item.title}
                    <IconArrowRight aria-hidden="true" className="size-4 text-muted-foreground group-hover:text-link" />
                  </span>
                  <span className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{item.description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
