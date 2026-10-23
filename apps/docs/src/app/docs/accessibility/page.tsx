import type { Metadata } from "next";

import {
  Badge,
  Breadcrumbs,
  PageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@aback-ui/ui";

import { componentDocs } from "@/data/component-docs";
import { components } from "@/data/component-catalog";

export const metadata: Metadata = {
  title: "Accessibility",
  description:
    "The Aback UI accessibility contract, keyboard behavior by component, automated checks, and what has not been verified.",
  alternates: { canonical: "/docs/accessibility" },
};

const keyboardRows = components.flatMap((component) => {
  const rows = componentDocs[component.name]?.keyboard ?? [];
  return rows.map((row) => ({
    component: component.title,
    name: component.name,
    key: row.key,
    action: row.action,
  }));
});

export default function AccessibilityPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <PageHeader
          eyebrow="Quality"
          title="Accessibility"
          description="Accessibility is part of correctness. This page states the contract and separates what has been tested from what has not."
        />
        <Breadcrumbs
          items={[{ label: "Docs", href: "/docs" }, { label: "Accessibility" }]}
        />
      </div>

      <div className="prose-docs">
        <h2>The contract</h2>
        <ul>
          <li>Semantic HTML first. A button for an action, an anchor for navigation.</li>
          <li>Every interactive control is reachable and operable by keyboard.</li>
          <li>Focus is visible with at least 3:1 contrast, using focus-visible.</li>
          <li>Icon-only controls have an accessible name; decorative icons are hidden.</li>
          <li>State is never communicated by color alone.</li>
          <li>Readable text meets WCAG AA contrast and is never faded with opacity.</li>
          <li>Motion respects prefers-reduced-motion and never delays an essential action.</li>
          <li>Status messages use role status or alert; errors are tied to their control.</li>
        </ul>

        <h2>What is verified</h2>
        <p>
          The component package runs behavior tests for buttons, dialogs, tabs, accordions,
          checkboxes, switches, dropdown menus, tooltips, and form fields. Axe runs on
          representative renders for structural checks. The docs site is checked for landmarks, a
          skip link, one H1 per page, and keyboard-operable navigation.
        </p>
        <p>
          The automated suite cannot evaluate color contrast in jsdom. Contrast was checked against
          the measured token pairs in the design system: ink on canvas 19.8:1, mute on canvas 4.7:1,
          link 700 on white 7.0:1, and primary-400 on dark surfaces 8.0:1 or better.
        </p>

        <h2>What is not verified</h2>
        <ul>
          <li>Manual screen-reader sessions across NVDA, JAWS, and VoiceOver.</li>
          <li>Every browser and assistive-technology combination.</li>
          <li>Automated visual regression.</li>
        </ul>
        <p>
          Do not describe Aback UI as WCAG conformant until those reviews are complete. Report a
          gap with the component, the environment, and the steps to reproduce.
        </p>

        <h2>Keyboard behavior by component</h2>
        <p>
          The table lists the documented keys. Native controls keep native behavior, and complex
          widgets follow the WAI-ARIA Authoring Practices through Radix primitives.
        </p>
      </div>

      <Table containerProps={{ "aria-label": "Keyboard behavior by component" }}>
        <TableHeader>
          <TableRow>
            <TableHead>Component</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keyboardRows.map((row) => (
            <TableRow key={`${row.name}-${row.key}`}>
              <TableCell>
                <a
                  href={`/docs/components/${row.name}`}
                  className="text-sm font-medium text-link underline-offset-4 hover:underline"
                >
                  {row.component}
                </a>
              </TableCell>
              <TableCell className="whitespace-nowrap font-mono text-xs">{row.key}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{row.action}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex flex-wrap items-center gap-2 border border-border bg-muted/20 p-4">
        <Badge variant="success">Automated behavior tests</Badge>
        <Badge variant="outline">Axe structural checks</Badge>
        <Badge variant="warning">Manual screen reader pending</Badge>
        <span className="text-xs text-muted-foreground">
          The full policy lives in the repository at docs/accessibility.md.
        </span>
      </div>
    </div>
  );
}
