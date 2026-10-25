import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../../../packages/ui/src/test-utils/axe";
import { blockPreviewMap } from "./index";
import { ContactFormBlock } from "@registry/blocks/contact-form";
import { CookieConsentBlock } from "@registry/blocks/cookie-consent";
import { FaqBlock } from "@registry/blocks/faq";
import { NewsletterBlock } from "@registry/blocks/newsletter";
import { PricingBlock, type PricingPlan } from "@registry/blocks/pricing";
import { SiteHeaderBlock } from "@registry/blocks/site-header";

afterEach(() => {
  localStorage.clear();
});

describe("SiteHeaderBlock", () => {
  const links = [
    { title: "Products", href: "/products" },
    { title: "Blog", href: "/blog" },
  ];

  it("marks the active section and omits search without a handler", () => {
    render(<SiteHeaderBlock brand={<a href="/">Acme</a>} links={links} activePath="/products/tools" />);
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(nav.querySelector('[aria-current="page"]')).toHaveTextContent("Products");
    expect(screen.queryByRole("button", { name: "Search" })).not.toBeInTheDocument();
  });

  it("renders search when a handler exists and calls it", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SiteHeaderBlock brand={<a href="/">Acme</a>} links={links} onSearch={onSearch} />);
    await user.click(screen.getAllByRole("button", { name: /search/i })[0]!);
    expect(onSearch).toHaveBeenCalled();
  });
});

describe("PricingBlock", () => {
  const plans: PricingPlan[] = [
    {
      name: "Growth",
      description: "For teams.",
      price: { monthly: 29, yearly: 23 },
      features: [
        { text: "Analytics", included: true },
        { text: "SSO", included: false },
      ],
      cta: { label: "Choose Growth", href: "#growth" },
    },
  ];

  it("switches between monthly and yearly prices", async () => {
    const user = userEvent.setup();
    render(<PricingBlock title="Pricing" plans={plans} />);
    expect(screen.getByText("$29")).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "Yearly" }));
    expect(screen.getByText("$23")).toBeInTheDocument();
    expect(screen.getByText("per month, billed yearly")).toBeInTheDocument();
  });

  it("names excluded features and the plan behind each action", () => {
    render(<PricingBlock title="Pricing" plans={plans} />);
    expect(screen.getByText("Not included:")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Choose Growth, Growth plan" })).toHaveAttribute("href", "#growth");
  });
});

describe("FaqBlock", () => {
  const items = [
    { question: "First?", answer: "One.\n\nTwo." },
    { question: "Second?", answer: "Has </script> in it." },
  ];

  it("opens the first answer and keeps closed answers in the HTML", () => {
    const { container } = render(<FaqBlock items={items} />);
    expect(screen.getByRole("button", { name: "First?" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: "Second?" })).toHaveAttribute("aria-expanded", "false");
    expect(container).toHaveTextContent("Has </script> in it.");
    expect(screen.getByText("Two.").tagName).toBe("P");
  });

  it("escapes structured data so an answer cannot close the script tag", () => {
    const html = renderToString(<FaqBlock items={items} structuredData />);
    expect(html).toContain('"@type":"FAQPage"');
    expect(html).toContain("\\u003c/script>");
    expect(html.match(/<\/script>/g)).toHaveLength(1);
  });
});

describe("NewsletterBlock", () => {
  it("shows the result the subscribe call returns", async () => {
    const user = userEvent.setup();
    const onSubscribe = vi.fn(async () => ({ ok: true, message: "Check your inbox to confirm." }));
    render(<NewsletterBlock onSubscribe={onSubscribe} />);

    await user.type(screen.getByLabelText("Email address"), " you@company.com ");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));

    expect(onSubscribe).toHaveBeenCalledWith("you@company.com");
    expect(await screen.findByText("Check your inbox to confirm.")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toHaveValue("");
  });

  it("reports a thrown error instead of claiming success", async () => {
    const user = userEvent.setup();
    render(<NewsletterBlock onSubscribe={() => Promise.reject(new Error("network"))} />);
    await user.type(screen.getByLabelText("Email address"), "you@company.com");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));
    expect(await screen.findByText(/Something went wrong/)).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toHaveAttribute("aria-invalid", "true");
  });
});

describe("ContactFormBlock", () => {
  it("marks every invalid field and focuses the first", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ContactFormBlock onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(onSubmit).not.toHaveBeenCalled();
    const name = screen.getByRole("textbox", { name: /Name/ });
    expect(name).toHaveFocus();
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription("Enter your name.");
    expect(screen.getByText("Choose what your message is about.")).toBeInTheDocument();
  });

  it("submits trimmed values and shows the confirmation", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(async () => ({ ok: true, message: "We reply within two days." }));
    render(<ContactFormBlock onSubmit={onSubmit} />);

    await user.type(screen.getByRole("textbox", { name: /Name/ }), "  Aditi Rao ");
    await user.type(screen.getByRole("textbox", { name: /Email/ }), "aditi@example.com");
    await user.selectOptions(screen.getByRole("combobox", { name: /Topic/ }), "support");
    await user.type(screen.getByRole("textbox", { name: /Message/ }), "The export button is greyed out.");
    await user.click(screen.getByRole("button", { name: "Send message" }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: "Aditi Rao",
      email: "aditi@example.com",
      topic: "support",
      message: "The export button is greyed out.",
    });
    expect(await screen.findByRole("heading", { name: "Message sent" })).toBeInTheDocument();
  });
});

describe("CookieConsentBlock", () => {
  it("offers equal choices, remembers the decision, and hides", async () => {
    const user = userEvent.setup();
    const onDecision = vi.fn();
    render(<CookieConsentBlock message="May we use analytics?" onDecision={onDecision} storageKey="consent-test" />);

    const region = await screen.findByRole("region", { name: "Cookie consent" });
    expect(region).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Decline" }));

    expect(onDecision).toHaveBeenCalledWith("rejected");
    expect(localStorage.getItem("consent-test")).toBe("rejected");
    await waitFor(() => expect(screen.queryByRole("region", { name: "Cookie consent" })).not.toBeInTheDocument());
  });

  it("stays hidden for a visitor who already chose", () => {
    localStorage.setItem("consent-test", "accepted");
    render(<CookieConsentBlock message="May we use analytics?" onDecision={() => {}} storageKey="consent-test" />);
    expect(screen.queryByRole("region", { name: "Cookie consent" })).not.toBeInTheDocument();
  });

  it("renders nothing on the server", () => {
    const html = renderToString(<CookieConsentBlock message="Hi" onDecision={() => {}} />);
    expect(html).toBe("");
  });
});

describe("block previews", () => {
  for (const [name, Preview] of Object.entries(blockPreviewMap)) {
    it(`${name} renders without accessibility violations`, async () => {
      const { container } = render(<Preview />);
      await expectNoA11yViolations(container);
    });
  }
});
