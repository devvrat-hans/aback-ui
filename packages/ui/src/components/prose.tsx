import * as React from "react";
import { Slot } from "radix-ui";

import { cn } from "../lib/utils";

/*
 * Every element rule is written as `[:where(& el)]`, which compiles to
 * `:where(.class el)` and so carries no specificity. Any class on an element
 * inside the prose, including the classes of another component, wins without
 * `!important`. The few spacing rules that must beat the flow rule use
 * `[:where(&) el]` instead, which adds exactly one element of specificity.
 */
const proseElements = [
  // Headings. scroll-mt keeps an anchored heading clear of a sticky header.
  "[:where(&)_h2]:mt-10 [:where(&_h2)]:scroll-mt-24 [:where(&_h2)]:text-2xl [:where(&_h2)]:font-bold [:where(&_h2)]:tracking-tight [:where(&_h2)]:text-foreground [:where(&_h2)]:text-balance",
  "[:where(&)_h3]:mt-7 [:where(&_h3)]:scroll-mt-24 [:where(&_h3)]:text-lg [:where(&_h3)]:font-semibold [:where(&_h3)]:text-foreground",
  "[:where(&)_h4]:mt-6 [:where(&_h4)]:scroll-mt-24 [:where(&_h4)]:text-base [:where(&_h4)]:font-semibold [:where(&_h4)]:text-foreground",
  // Inline text.
  "[:where(&_:is(strong,b))]:font-semibold [:where(&_:is(strong,b))]:text-foreground",
  // Underlined at rest: the link colour alone is too close to body text to tell them apart.
  "[:where(&_a)]:font-medium [:where(&_a)]:text-link [:where(&_a)]:underline [:where(&_a)]:underline-offset-4 [:where(&_a:hover)]:text-link-hover",
  "[:where(&_a:focus-visible)]:outline-2 [:where(&_a:focus-visible)]:outline-offset-2 [:where(&_a:focus-visible)]:outline-focus-ring",
  "[:where(&_:not(pre)>code)]:bg-muted [:where(&_:not(pre)>code)]:px-1 [:where(&_:not(pre)>code)]:font-mono [:where(&_:not(pre)>code)]:text-[0.9em] [:where(&_:not(pre)>code)]:text-foreground",
  // Lists.
  "[:where(&_ul)]:list-disc [:where(&_ol)]:list-decimal [:where(&_:is(ul,ol))]:pl-6",
  "[:where(&_li+li)]:mt-1.5 [:where(&_li)]:pl-1 [:where(&_li)]:marker:text-muted-foreground/60",
  "[:where(&)_li>:where(:first-child)]:mt-0 [:where(&)_li>:where(ul,ol)]:mt-1.5",
  // Quotes, code, rules, media.
  "[:where(&_blockquote)]:border-l-4 [:where(&_blockquote)]:border-primary-300 [:where(&_blockquote)]:py-1 [:where(&_blockquote)]:pl-4 [:where(&_blockquote)]:italic dark:[&_blockquote]:border-primary-500",
  "[:where(&_pre)]:overflow-x-auto [:where(&_pre)]:border [:where(&_pre)]:border-border [:where(&_pre)]:bg-muted/40 [:where(&_pre)]:p-4 [:where(&_pre)]:font-mono [:where(&_pre)]:text-[13px] [:where(&_pre)]:leading-relaxed [:where(&_pre)]:text-foreground",
  "[:where(&)_hr]:my-8 [:where(&_hr)]:border-border",
  "[:where(&_img)]:h-auto [:where(&_img)]:max-w-full",
  "[:where(&_figcaption)]:mt-2 [:where(&_figcaption)]:text-center [:where(&_figcaption)]:text-xs [:where(&_figcaption)]:text-muted-foreground",
  // Tables stay real tables, so their headers still label their cells.
  "[:where(&_table)]:w-full [:where(&_table)]:border-collapse [:where(&_table)]:border [:where(&_table)]:border-border [:where(&_table)]:text-left [:where(&_table)]:text-[13px] [:where(&_table)]:leading-normal",
  "[:where(&_thead)]:bg-muted/60",
  "[:where(&_th)]:px-4 [:where(&_th)]:py-3 [:where(&_th)]:align-bottom [:where(&_th)]:text-xs [:where(&_th)]:font-semibold [:where(&_th)]:uppercase [:where(&_th)]:tracking-wide [:where(&_th)]:text-foreground",
  "[:where(&_td)]:border-t [:where(&_td)]:border-border [:where(&_td)]:px-4 [:where(&_td)]:py-2.5 [:where(&_td)]:align-top",
  "[:where(&_td:first-child)]:font-medium [:where(&_td:first-child)]:text-foreground",
  "[:where(&_tbody_tr:nth-child(even))]:bg-muted/20",
  // The first and last child sit flush with the container.
  "[&>:where(:first-child)]:mt-0 [&>:where(:last-child)]:mb-0",
].join(" ");

const proseSizes = {
  /** Product articles, guides, and legal pages: 14px muted body text. */
  default: [
    "max-w-[72ch] text-sm leading-relaxed text-muted-foreground",
    "[:where(&>*+*)]:mt-4 [:where(&_:is(p,ul,ol,pre,blockquote,table,figure))]:mt-4",
  ].join(" "),
  /** Long reading, such as a blog post: 17px body text in near-ink. */
  lg: [
    "max-w-[70ch] text-[17px] leading-[1.75] text-foreground/90",
    "[:where(&>*+*)]:mt-5 [:where(&_:is(p,ul,ol,pre,blockquote,table,figure))]:mt-5",
  ].join(" "),
} as const;

export interface ProseProps extends React.ComponentProps<"div"> {
  size?: keyof typeof proseSizes;
  /** Render the child instead of a div, such as an `<article>`. */
  asChild?: boolean;
}

/**
 * Typography for long-form content: a blog post, a guide, a legal page, or
 * HTML rendered from Markdown. Write plain h2, h3, p, ul, ol, blockquote, pre,
 * table, and code elements inside it and they pick up the theme. Start at h2;
 * the page title belongs to the page, not the prose.
 */
function Prose({ size = "default", asChild = false, className, ...props }: ProseProps) {
  const Comp = asChild ? Slot.Root : "div";
  return (
    <Comp
      data-slot="prose"
      data-size={size}
      className={cn("min-w-0 break-words", proseSizes[size], proseElements, className)}
      {...props}
    />
  );
}

export { Prose };
