import { useId, type ReactNode } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading } from "@/components/ui/section-heading";

export interface FaqItem {
  question: string;
  /** Plain text, so it can be mirrored in structured data. Blank lines start new paragraphs. */
  answer: string;
}

export interface FaqBlockProps {
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  items: FaqItem[];
  /** Emit FAQPage JSON-LD for search engines. Only for questions you answer on the page. */
  structuredData?: boolean;
  /** A line after the list, such as a contact link. */
  footer?: ReactNode;
}

function faqJsonLd(items: FaqItem[]) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  // Escaping "<" keeps an answer containing "</script>" inside the tag.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Frequently asked questions in an accordion. The first answer is open and
 * closed answers stay in the HTML, so they are searchable and indexable.
 */
export function FaqBlock({
  eyebrow,
  title = "Frequently asked questions",
  description,
  items,
  structuredData = false,
  footer,
}: FaqBlockProps) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="mx-auto w-full max-w-3xl px-4 py-16 md:px-6 lg:py-20">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} headingId={headingId} />

      <Accordion
        type="multiple"
        defaultValue={items.length ? ["faq-0"] : []}
        className="mt-8 border-t border-border"
      >
        {items.map((item, index) => (
          <AccordionItem key={item.question} value={`faq-${index}`}>
            <AccordionTrigger className="text-base">{item.question}</AccordionTrigger>
            <AccordionContent forceMount className="flex flex-col gap-3 [[data-state=closed]>&]:hidden">
              {item.answer.split(/\n\s*\n/).map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraph}</p>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {footer ? <div className="mt-6 text-sm text-muted-foreground">{footer}</div> : null}

      {structuredData && items.length ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd(items) }} />
      ) : null}
    </section>
  );
}
