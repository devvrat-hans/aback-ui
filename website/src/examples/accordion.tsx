"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    value: "install",
    question: "How do I install a component?",
    answer:
      "Run the registry command for the component, then import the theme once in your global stylesheet. The source lands in your project and belongs to you.",
  },
  {
    value: "updates",
    question: "How do I receive updates?",
    answer:
      "Copying source means updates are deliberate. Read the changelog, then run the registry command again or diff the component against the new version.",
  },
  {
    value: "theming",
    question: "Can I change the brand color?",
    answer:
      "Yes. The theme is a CSS file. Override the semantic variables, keep the contrast ratios, and the components follow automatically.",
  },
  {
    value: "react",
    question: "Does it work with React Server Components?",
    answer:
      "Presentational components render on the server. Interactive components carry the use client directive and are imported into client boundaries.",
  },
];

export function AccordionExample() {
  return (
    <Accordion type="single" collapsible defaultValue="install" className="max-w-xl">
      {faqs.map((faq) => (
        <AccordionItem key={faq.value} value={faq.value}>
          <AccordionTrigger>{faq.question}</AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
