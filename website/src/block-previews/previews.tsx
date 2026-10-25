"use client";

// Documentation previews for the blocks. Everything here is example content:
// the block files stay free of it, so an installed block contains only the
// pattern. Links point at in-page anchors so the preview never navigates away.

import { useState } from "react";
import {
  IconAccessible,
  IconBolt,
  IconCode,
  IconLock,
  IconPalette,
  IconWorld,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Stat, StatGrid } from "@/components/ui/stat";
import { ArticleLayoutBlock } from "@registry/blocks/article-layout";
import { ContactFormBlock } from "@registry/blocks/contact-form";
import { CookieConsentBlock, type ConsentDecision } from "@registry/blocks/cookie-consent";
import { CtaBannerBlock } from "@registry/blocks/cta-banner";
import { FaqBlock } from "@registry/blocks/faq";
import { FeatureGridBlock } from "@registry/blocks/feature-grid";
import { HeroBlock } from "@registry/blocks/hero";
import { NewsletterBlock } from "@registry/blocks/newsletter";
import { NotFoundBlock } from "@registry/blocks/not-found";
import { PricingBlock } from "@registry/blocks/pricing";
import { SiteFooterBlock } from "@registry/blocks/site-footer";
import { SiteHeaderBlock } from "@registry/blocks/site-header";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ExampleBrand({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <a href="#top" className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground">
      <span
        aria-hidden="true"
        className={
          size === "sm"
            ? "flex size-6 items-center justify-center bg-brand-fill text-[10px] font-bold text-on-brand-fill"
            : "flex size-7 items-center justify-center bg-brand-fill text-xs font-bold text-on-brand-fill"
        }
      >
        A
      </span>
      Acme
    </a>
  );
}

export function SiteHeaderPreview() {
  return (
    <div id="top" className="min-h-[420px] bg-background">
      <SiteHeaderBlock
        brand={<ExampleBrand />}
        links={[
          { title: "Products", href: "#products" },
          { title: "Pricing", href: "#pricing" },
          { title: "Blog", href: "#blog" },
          { title: "About", href: "#about" },
        ]}
        activePath="#products"
        actions={
          <>
            <Button variant="ghost" size="sm" asChild>
              <a href="#sign-in">Sign in</a>
            </Button>
            <Button size="sm" asChild>
              <a href="#get-started">Get started</a>
            </Button>
          </>
        }
      />
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Example content. Switch the preview to mobile: the links move into the menu sheet. The
          search trigger is omitted because this example has no search to open.
        </p>
      </div>
    </div>
  );
}

export function SiteFooterPreview() {
  return (
    <div className="flex min-h-[420px] flex-col justify-end bg-background">
      <SiteFooterBlock
        brand={<ExampleBrand size="sm" />}
        tagline="Example tagline. Free tools that run in your browser, with nothing to install."
        columns={[
          {
            title: "Product",
            links: [
              { title: "Features", href: "#features" },
              { title: "Pricing", href: "#pricing" },
              { title: "Changelog", href: "#changelog" },
            ],
          },
          {
            title: "Company",
            links: [
              { title: "About", href: "#about" },
              { title: "Blog", href: "#blog" },
              { title: "Contact", href: "#contact" },
            ],
          },
          {
            title: "Developers",
            links: [
              { title: "Documentation", href: "#docs" },
              { title: "Aback UI", href: "https://abackui.com", external: true },
            ],
          },
        ]}
        copyright="© 2026 Acme Inc. Example content."
        legal={[
          { title: "Privacy", href: "#privacy" },
          { title: "Terms", href: "#terms" },
        ]}
      />
    </div>
  );
}

export function HeroPreview() {
  return (
    <HeroBlock
      announcement={{ label: "Example announcement: version 2 is out", href: "#changelog" }}
      title="Launch once."
      highlight="Get found for years."
      description="An example hero. Your product gets a page search engines and AI assistants can read, plus a spot in this week's launch list."
      primaryAction={{ label: "Launch your product", href: "#launch" }}
      secondaryAction={{ label: "Explore launches", href: "#explore" }}
      note="Example note: most founders publish in under three minutes."
      highlights={["10 free launches every week", "Verified badge links", "Readable by search and AI"]}
      aside={
        <div className="border border-border bg-card p-4">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Example data
          </p>
          <StatGrid columns={2} joined>
            <Stat label="Products launched" value="32" size="sm" />
            <Stat label="Upvotes" value="77" size="sm" />
            <Stat label="Founders joined" value="802" size="sm" />
            <Stat label="Page views" value="961" hint="Last 30 days" size="sm" />
          </StatGrid>
        </div>
      }
    />
  );
}

export function FeatureGridPreview() {
  return (
    <FeatureGridBlock
      eyebrow="Why Aback UI"
      title="A design system that earns its place."
      description="Example features for a component library."
      features={[
        {
          icon: <IconAccessible />,
          title: "Accessible by default",
          description: "Semantic HTML, keyboard support, and visible focus in every component.",
          href: "#accessibility",
        },
        {
          icon: <IconCode />,
          title: "Source you own",
          description: "Copy the canonical file into your project and edit it freely.",
          href: "#registry",
        },
        {
          icon: <IconPalette />,
          title: "Tokens with intent",
          description: "Neutral ink actions and Aback Blue as a signal, in light and dark.",
        },
        {
          icon: <IconBolt />,
          title: "Fast by design",
          description: "No runtime to adopt and no global side effects on import.",
        },
        {
          icon: <IconLock />,
          title: "Private by default",
          description: "Nothing calls home. Share links load nothing until clicked.",
        },
        {
          icon: <IconWorld />,
          title: "Ready for locales",
          description: "Dates, numbers, and currency go through Intl, not string templates.",
        },
      ]}
    />
  );
}

export function PricingPreview() {
  return (
    <PricingBlock
      eyebrow="Pricing"
      title="Start free. Upgrade when it pays for itself."
      description="Example plans and prices. They are not real offers."
      yearlyLabel="Yearly, save 20%"
      plans={[
        {
          name: "Starter",
          description: "For a single product getting its first users.",
          price: { monthly: 0, yearly: 0 },
          features: [
            { text: "1 product page", included: true },
            { text: "Weekly launch slot", included: true },
            { text: "Analytics", included: false },
          ],
          cta: { label: "Start free", href: "#start" },
        },
        {
          name: "Growth",
          description: "For teams launching every month.",
          price: { monthly: 29, yearly: 23 },
          features: [
            { text: "10 product pages", included: true },
            { text: "Priority launch slot", included: true },
            { text: "Analytics", included: true },
          ],
          cta: { label: "Choose Growth", href: "#growth" },
          highlighted: true,
          badge: "Most popular",
        },
        {
          name: "Scale",
          description: "For agencies and portfolios.",
          price: { monthly: 99, yearly: 79 },
          features: [
            { text: "Unlimited product pages", included: true },
            { text: "Dedicated launch day", included: true },
            { text: "Analytics and exports", included: true },
          ],
          cta: { label: "Choose Scale", href: "#scale" },
        },
      ]}
      footnote="Example footnote: prices exclude tax. Cancel anytime."
    />
  );
}

export function FaqPreview() {
  return (
    <FaqBlock
      eyebrow="FAQ"
      description="Example questions about a component library."
      items={[
        {
          question: "Is Aback UI free to use?",
          answer: "Yes. The code is MIT licensed. The Aback name and mark are trademarks and are not covered by the license.",
        },
        {
          question: "Do I install a package or copy source?",
          answer:
            "Either. Copy a component into your project with the registry when you want to own and edit it.\n\nUse the npm package when you want updates from a version bump.",
        },
        {
          question: "Does it work without Tailwind?",
          answer: "No. Components use Tailwind CSS v4 utilities and the Aback theme variables.",
        },
        {
          question: "Which React versions are supported?",
          answer: "React 19. Earlier versions are not tested.",
        },
      ]}
      footer={
        <>
          Still have a question?{" "}
          <a href="#contact" className="font-medium text-link underline underline-offset-4">
            Contact us
          </a>
          .
        </>
      }
    />
  );
}

export function NewsletterPreview() {
  return (
    <div className="mx-auto grid w-full max-w-4xl gap-8 px-4 py-12 md:grid-cols-[1fr_260px] md:px-6">
      <NewsletterBlock
        onSubscribe={async (email) => {
          await wait(700);
          if (email.endsWith("@example.com")) {
            return { ok: false, message: "Example error: example.com addresses cannot subscribe." };
          }
          return { ok: true, message: "Example only. No email was sent; in your app, say to check the inbox." };
        }}
        consent="Example consent: one email per release. Unsubscribe from any email."
      />
      <NewsletterBlock
        variant="inline"
        title="Newsletter"
        description="Get new tools and updates."
        buttonLabel="Subscribe"
        onSubscribe={async () => {
          await wait(500);
          return { ok: true, message: "Example only. Nothing was sent." };
        }}
      />
    </div>
  );
}

export function CtaBannerPreview() {
  return (
    <div className="flex flex-col py-6">
      <CtaBannerBlock
        title="Ready to build with Aback UI?"
        description="Install the theme and your first component in under a minute."
        primaryAction={{ label: "Get started", href: "#install" }}
        secondaryAction={{ label: "Browse components", href: "#components" }}
      />
      <CtaBannerBlock
        tone="muted"
        title="Need a hand migrating?"
        description="Example copy for a neutral banner on a dense page."
        primaryAction={{ label: "Read the guide", href: "#guide" }}
      />
    </div>
  );
}

export function CookieConsentPreview() {
  const [decision, setDecision] = useState<ConsentDecision | null>(null);

  return (
    <div className="min-h-[360px] px-4 py-10 md:px-6">
      <div className="mx-auto flex max-w-xl flex-col items-start gap-3">
        <p className="text-sm text-muted-foreground">
          {decision
            ? `You chose "${decision}". This preview remembers nothing, so the banner can come back.`
            : "The banner is fixed to the bottom of this frame. It does not block the page."}
        </p>
        {decision ? (
          <Button size="sm" variant="outline" onClick={() => setDecision(null)}>
            Show the banner again
          </Button>
        ) : null}
      </div>
      {decision ? null : (
        <CookieConsentBlock
          storageKey={null}
          message="Example: may we use analytics to understand how people use this site? Nothing is sent unless you allow it."
          policyHref="#cookies"
          onDecision={setDecision}
        />
      )}
    </div>
  );
}

export function NotFoundPreview() {
  return (
    <NotFoundBlock
      homeHref="#home"
      secondaryAction={{ label: "Browse components", href: "#components" }}
      links={[
        { title: "Installation", description: "Add the theme and your first component.", href: "#install" },
        { title: "Components", description: "Every component with live previews.", href: "#components" },
        { title: "Blocks", description: "Complete page patterns you can own.", href: "#blocks" },
        { title: "Theming", description: "Tokens, light and dark.", href: "#theming" },
      ]}
    />
  );
}

export function ContactFormPreview() {
  return (
    <ContactFormBlock
      description="Example form. Submitting validates the fields and shows the states; nothing is sent."
      onSubmit={async () => {
        await wait(800);
        return { ok: true, message: "Example only. In your app, say when you will reply." };
      }}
    />
  );
}

export function ArticleLayoutPreview() {
  return (
    <ArticleLayoutBlock
      title="How we ship accessible components"
      description="An example article. The body, author, and dates are placeholders that show the layout."
      category="Engineering"
      author={{ name: "Example Author", role: "Design engineer" }}
      publishedAt="2026-10-20T00:00:00Z"
      readingTime="4 min read"
      breadcrumbs={[{ label: "Blog", href: "#blog" }, { label: "Engineering", href: "#engineering" }, { label: "Accessible components" }]}
      shareUrl="https://abackui.com/docs/blocks/article-layout"
      toc={[
        { id: "example-start", title: "Start with the native element" },
        { id: "example-keyboard", title: "Test with a keyboard" },
        { id: "example-focus", title: "Focus you can see", depth: 2 },
        { id: "example-ship", title: "Ship the tests too" },
      ]}
    >
      <h2 id="example-start">Start with the native element</h2>
      <p>
        A <code>button</code> already has a role, a focus behavior, and keyboard activation. Most
        accessibility bugs we fix come from replacing it with a <code>div</code>.
      </p>
      <p>
        When a pattern needs more, such as a dialog or a menu, we use a <strong>mature primitive</strong>{" "}
        instead of writing focus management by hand.
      </p>
      <h2 id="example-keyboard">Test with a keyboard</h2>
      <ul>
        <li>Tab reaches every control in a sensible order.</li>
        <li>Escape closes overlays and returns focus.</li>
        <li>Arrow keys move inside composite widgets.</li>
      </ul>
      <h3 id="example-focus">Focus you can see</h3>
      <blockquote>If you cannot see where focus is, you cannot use the page with a keyboard.</blockquote>
      <p>Every focus ring uses the focus token, which meets contrast in light and dark.</p>
      <h2 id="example-ship">Ship the tests too</h2>
      <p>
        Behavior tests and automated checks run on every change. They catch regressions; they do not
        replace a manual pass with a screen reader.
      </p>
      <p>
        Read more in the <a href="#accessibility">accessibility guide</a>.
      </p>
    </ArticleLayoutBlock>
  );
}
