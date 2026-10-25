import { blockDocs, blocks } from "@/data/blocks";
import { componentDocs } from "@/data/component-docs";
import { componentGroups } from "@/data/component-catalog";
import { gettingStartedNav, site } from "@/data/site";

const intro = `# ${site.name}

> ${site.name} is an open-source React component library and design system from Aback Group. Components install by copying source through a shadcn-compatible registry, so the code lives in your project. They use square corners, neutral ink actions, the Aback Blue brand ramp, and semantic CSS tokens with light and dark themes.

- Website: ${site.url}
- Registry item: ${site.registry}/{name}.json
- Registry index: ${site.registry}/index.json
- License: MIT (code). The Aback name and mark are trademarks.
- Status: pre-1.0. APIs may change before the first stable release.
- Requirements: React 19, Tailwind CSS v4.

## Install

\`\`\`bash
npx shadcn@latest add ${site.registry}/theme.json
npx shadcn@latest add ${site.registry}/button.json
\`\`\`

Then import the theme once, after Tailwind:

\`\`\`css
@import "tailwindcss";
@import "../styles/aback.css";
\`\`\`
`;

function docsSection() {
  return [
    "## Documentation",
    "",
    ...gettingStartedNav.items.map(
      (item) => `- [${item.title}](${site.url}${item.href}): ${item.description ?? ""}`.trimEnd(),
    ),
    "",
  ].join("\n");
}

function componentSection() {
  const lines = ["## Components", ""];
  for (const group of componentGroups) {
    lines.push(`### ${group.category}`, "");
    for (const item of group.items) {
      lines.push(`- [${item.title}](${site.url}/docs/components/${item.name}): ${item.description}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

function blockSection() {
  return [
    "## Blocks",
    "",
    ...blocks.map((block) => `- [${block.title}](${site.url}/docs/blocks/${block.name}): ${block.description}`),
    "",
  ].join("\n");
}

/** The short index: what exists and where to read about it. */
export function llmsIndex() {
  return [intro, docsSection(), componentSection(), blockSection()].join("\n");
}

/** The full reference: every component's install command, API, keyboard, and accessibility notes. */
export function llmsFull() {
  const parts = [intro, docsSection()];
  for (const group of componentGroups) {
    for (const item of group.items) {
      const doc = componentDocs[item.name];
      parts.push(`## ${item.title}`, "");
      parts.push(item.description, "");
      parts.push(`- Docs: ${site.url}/docs/components/${item.name}`);
      parts.push(`- Install: \`npx shadcn@latest add ${site.registry}/${item.name}.json\``);
      parts.push(`- Status: ${item.meta?.status ?? "beta"}`);
      if (item.dependencies?.length) parts.push(`- npm dependencies: ${item.dependencies.join(", ")}`);
      parts.push("");
      if (doc) {
        parts.push("### API", "");
        for (const row of doc.api) {
          const fallback = row.defaultValue ? ` Default: ${row.defaultValue}.` : "";
          parts.push(`- \`${row.prop}\` (${row.type}): ${row.description}${fallback}`);
        }
        parts.push("");
        if (doc.keyboard?.length) {
          parts.push("### Keyboard", "");
          for (const row of doc.keyboard) parts.push(`- ${row.key}: ${row.action}`);
          parts.push("");
        }
        parts.push("### Accessibility", "");
        for (const line of doc.accessibility) parts.push(`- ${line}`);
        parts.push("");
        if (doc.note) parts.push(doc.note, "");
      }
    }
  }
  for (const block of blocks) {
    const doc = blockDocs[block.name];
    parts.push(`## Block: ${block.title}`, "", block.description, "");
    parts.push(`- Docs: ${site.url}/docs/blocks/${block.name}`);
    parts.push(`- Install: \`npx shadcn@latest add ${site.registry}/${block.name}.json\``, "");
    if (doc) {
      for (const line of doc.notes) parts.push(`- ${line}`);
      parts.push("");
    }
  }
  return parts.join("\n");
}
