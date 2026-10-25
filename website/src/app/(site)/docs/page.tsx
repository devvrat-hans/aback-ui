import type { Metadata } from "next";
import Link from "next/link";
import {
  IconAccessible,
  IconBox,
  IconCode,
  IconLayoutGrid,
  IconPackage,
  IconPalette,
  IconTerminal2,
} from "@tabler/icons-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@aback-ui/ui";

import { DocsPage, DocsPageHeader, DocsSection, type TocItem } from "@/components/docs-page";
import { GuidePager, LinkCards } from "@/components/docs-ui";
import { PackageCommand } from "@/components/package-command";
import { blocks } from "@/data/blocks";
import { components } from "@/data/component-catalog";
import { products } from "@/data/products";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Introduction",
  description:
    "Aback UI is an open-source React design system from Aback Group: accessible components, blocks, semantic tokens, a CLI that copies source into your project, and an npm package.",
  alternates: { canonical: "/docs" },
};

const toc: TocItem[] = [
  { id: "two-ways", title: "Two ways to use it" },
  { id: "whats-inside", title: "What's inside" },
  { id: "principles", title: "Principles" },
  { id: "faq", title: "Questions" },
  { id: "next", title: "Where to next" },
];

const principles = [
  {
    icon: IconAccessible,
    title: "Accessible by default",
    body: "Native elements first, Radix primitives for complex widgets, visible focus, and keyboard behavior covered by tests.",
  },
  {
    icon: IconCode,
    title: "Source you own",
    body: "The CLI copies the canonical file into your project. There is no runtime to adopt and no lock-in.",
  },
  {
    icon: IconPalette,
    title: "Tokens with intent",
    body: "Components read semantic roles such as foreground, border, and link, never one-off colours.",
  },
  {
    icon: IconLayoutGrid,
    title: "Square and precise",
    body: "Zero radius, one-pixel hairlines, and depth from borders before shadows.",
  },
];

const faqs = [
  {
    question: "Is it free?",
    answer:
      "Yes. The code is MIT licensed, and nothing needs an account or a hosted service. The Aback name and mark are trademarks of Aback Group.",
  },
  {
    question: "Which frameworks does it support?",
    answer:
      "Any React 19 project with Tailwind CSS v4 and a @/ path alias. The CLI detects Next.js, Vite, Remix, and Astro projects and adjusts its defaults. Components that need the browser carry \"use client\", so they work with React Server Components.",
  },
  {
    question: "Should I use the CLI or the npm package?",
    answer:
      "Use the CLI when you want to edit the components: the files live in your project. Use the package when you would rather take updates with a version bump and never touch the source. You can mix both in one project.",
  },
  {
    question: "Does the CLI download code from a website?",
    answer:
      "No. Every component's source ships inside the aback-ui npm package, so the files you get always match the CLI version you ran. Your package manager still installs npm dependencies such as Radix UI.",
  },
  {
    question: "Is it production ready?",
    answer:
      "Aback UI is pre-1.0. Each component page says whether it is stable or beta. Stable components are used in production Aback products; APIs may still change before 1.0, with migration notes in the changelog.",
  },
];

export default function DocsIntroductionPage() {
  const stable = components.filter((item) => item.meta?.status === "stable").length;

  return (
    <DocsPage toc={toc}>
      <DocsPageHeader
        eyebrow="Get started"
        title="Introduction"
        description="Aback UI is the interface foundation for Aback Group products and an open-source React component library for everyone else: accessible components, complete blocks, and one set of design tokens."
        crumbs={[{ label: "Docs", href: "/docs" }, { label: "Introduction" }]}
      />

      <div className="mt-10 flex flex-col gap-14">
        <DocsSection
          id="two-ways"
          title="Two ways to use it"
          description="Pick per project, or mix them. Both use the same components and the same theme."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-4 border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center bg-brand-chip text-brand-icon">
                  <IconTerminal2 aria-hidden="true" className="size-4" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Copy the source</h3>
                  <p className="text-sm text-muted-foreground">Recommended. You own and can edit every file.</p>
                </div>
              </div>
              <PackageCommand args={`${site.cli} add button`} />
              <Link href="/docs/installation" className="mt-auto text-sm font-medium text-link underline-offset-4 hover:underline">
                Installation guide
              </Link>
            </div>
            <div className="flex flex-col gap-4 border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center bg-brand-chip text-brand-icon">
                  <IconPackage aria-hidden="true" className="size-4" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Install the package</h3>
                  <p className="text-sm text-muted-foreground">Import components and update with a version bump.</p>
                </div>
              </div>
              <PackageCommand kind="install" args="@aback-ui/ui @aback-ui/tokens" />
              <Link href="/docs/package" className="mt-auto text-sm font-medium text-link underline-offset-4 hover:underline">
                npm package guide
              </Link>
            </div>
          </div>
        </DocsSection>

        <DocsSection id="whats-inside" title="What's inside">
          <dl className="grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-4">
            {[
              { label: "Components", value: components.length, href: "/docs/components" },
              { label: "Stable", value: stable, href: "/docs/components" },
              { label: "Blocks", value: blocks.length, href: "/docs/blocks" },
              { label: "Aback products", value: products.length, href: "/built-with" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card p-5">
                <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</dt>
                <dd className="mt-1 text-3xl font-extrabold tracking-tight tabular-nums text-foreground">
                  <Link href={stat.href} className="outline-none hover:text-link focus-visible:ring-2 focus-visible:ring-focus-ring">
                    {stat.value}
                  </Link>
                </dd>
              </div>
            ))}
          </dl>
          <div className="prose-docs">
            <p>
              <strong>Components</strong> are focused building blocks: buttons, fields, dialogs,
              menus, tables, and the application patterns around them, such as page headers and
              empty states. <strong>Blocks</strong> are whole sections assembled from those
              components: a sign-in card, a pricing table, a dashboard shell. A block owns no
              routing, data, or backend; you pass the callbacks.
            </p>
            <p>
              <strong>Tokens</strong> are the CSS variables underneath: semantic colour roles for
              light and dark, the Aback Blue ramp, and square geometry. Every component reads them,
              so changing a token changes the whole interface.
            </p>
          </div>
        </DocsSection>

        <DocsSection id="principles" title="Principles" description="In priority order, these decide what gets built and how.">
          <ul className="grid gap-px border border-border bg-border sm:grid-cols-2">
            {principles.map((item) => (
              <li key={item.title} className="flex gap-4 bg-card p-5">
                <span className="flex size-9 shrink-0 items-center justify-center bg-brand-chip text-brand-icon">
                  <item.icon aria-hidden="true" className="size-4" />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-foreground">{item.title}</span>
                  <span className="text-sm leading-relaxed text-muted-foreground">{item.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </DocsSection>

        <DocsSection id="faq" title="Questions">
          <Accordion type="multiple" className="border-y border-border">
            {faqs.map((item) => (
              <AccordionItem key={item.question} value={item.question}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="max-w-[68ch] text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </DocsSection>

        <DocsSection id="next" title="Where to next">
          <LinkCards
            items={[
              {
                title: "Installation",
                description: "Set up a project and add your first component in two commands.",
                href: "/docs/installation",
                icon: IconTerminal2,
              },
              {
                title: "Components",
                description: `Browse all ${components.length} components with live previews and API notes.`,
                href: "/docs/components",
                icon: IconBox,
              },
              {
                title: "Blocks",
                description: "Start from a complete section instead of a blank page.",
                href: "/docs/blocks",
                icon: IconLayoutGrid,
              },
              {
                title: "Theming",
                description: "See the colour roles and change them for your product.",
                href: "/docs/theming",
                icon: IconPalette,
              },
            ]}
          />
        </DocsSection>

        <GuidePager href="/docs" />
      </div>
    </DocsPage>
  );
}
