import { blockDocs, blocks } from "@/data/blocks";
import { componentDocs } from "@/data/component-docs";
import { componentGroups, components } from "@/data/component-catalog";
import { faqItems } from "@/data/faq";
import { posts } from "@/data/posts";
import { guides, site } from "@/data/site";
import { tools } from "@/data/tools";

const intro = `# ${site.name}

> ${site.name} is an open-source React component library and design system from Aback Group. Components are copied into your project as source by the aback-ui CLI, or imported from the @aback-ui/ui npm package. They use square corners, neutral ink actions, the Aback Blue brand ramp, and semantic CSS tokens with light and dark themes.

- Website: ${site.url}
- CLI: \`npx ${site.cli} <command>\` (npm package \`aback-ui\`; the registry ships inside it)
- Components package: \`@aback-ui/ui\`, theme package: \`@aback-ui/tokens\`
- Registry item JSON: ${site.registry}/{name}.json, index: ${site.registry}/index.json
- License: MIT (code). The Aback name and mark are trademarks.
- Status: pre-1.0. APIs may change before the first stable release.
- Requirements: React 19, Tailwind CSS v4, a \`@/\` path alias.

## Install with the CLI

\`\`\`bash
npx ${site.cli} init
npx ${site.cli} add button
\`\`\`

\`init\` writes aback-ui.json, styles/aback.css, and lib/utils.ts, and imports the theme in your global stylesheet. \`add\` copies each component and the components it uses into components/ui.

## Install the npm package

\`\`\`bash
npm install @aback-ui/ui @aback-ui/tokens
\`\`\`

\`\`\`css
@import "tailwindcss";
@import "@aback-ui/tokens/tokens.css";
@source "../node_modules/@aback-ui/ui/dist";
\`\`\`
`;

function docsSection() {
  return [
    "## Documentation",
    "",
    ...guides.map(
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

function resourceSection() {
  return [
    "## Tools",
    "",
    `- [Theme generator](${site.url}/themes): Build a contrast-checked Aback UI theme (ramp plus brand roles, light and dark) from one colour, as CSS.`,
    `- [Colors](${site.url}/colors): Every Aback UI colour token as HEX, RGB, HSL, and OKLCH.`,
    ...tools.map((tool) => `- [${tool.title}](${site.url}/tools/${tool.slug}): ${tool.description}`),
    "",
    "## Blog",
    "",
    ...posts.map((post) => `- [${post.title}](${site.url}/blog/${post.slug}): ${post.description}`),
    "",
    "## Optional",
    "",
    `- [FAQ](${site.url}/faq): Short answers on licensing, requirements, install paths, theming, and accessibility.`,
    `- [About](${site.url}/about): Why Aback UI exists and how it is maintained.`,
    `- [Full reference](${site.url}/llms-full.txt): Every component's API, keyboard, and accessibility notes in one file.`,
    "",
  ].join("\n");
}

function faqSection() {
  return ["## FAQ", "", ...faqItems.flatMap((item) => [`### ${item.question}`, "", item.answer, ""])].join("\n");
}

/** The short index: what exists and where to read about it. */
export function llmsIndex() {
  return [intro, docsSection(), componentSection(), blockSection(), resourceSection()].join("\n");
}

/** One component's reference as Markdown: install command, API, keyboard, and accessibility notes. */
export function componentMarkdown(name: string) {
  const item = components.find((component) => component.name === name);
  if (!item) return "";
  const doc = componentDocs[item.name];
  const parts: string[] = [];
  parts.push(`## ${item.title}`, "");
  parts.push(item.description, "");
  parts.push(`- Docs: ${site.url}/docs/components/${item.name}`);
  parts.push(`- Install: \`npx ${site.cli} add ${item.name}\``);
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
  return parts.join("\n");
}

/** One block's reference as Markdown: install command and customization notes. */
export function blockMarkdown(name: string) {
  const block = blocks.find((item) => item.name === name);
  if (!block) return "";
  const doc = blockDocs[block.name];
  const parts: string[] = [`## Block: ${block.title}`, "", block.description, ""];
  parts.push(`- Docs: ${site.url}/docs/blocks/${block.name}`);
  parts.push(`- Install: \`npx ${site.cli} add ${block.name}\``, "");
  if (doc) {
    for (const line of doc.notes) parts.push(`- ${line}`);
    parts.push("");
  }
  return parts.join("\n");
}

/** The full reference: every component's install command, API, keyboard, and accessibility notes. */
export function llmsFull() {
  const parts = [intro, docsSection(), faqSection()];
  for (const group of componentGroups) {
    for (const item of group.items) parts.push(componentMarkdown(item.name));
  }
  for (const block of blocks) parts.push(blockMarkdown(block.name));
  return parts.join("\n");
}
