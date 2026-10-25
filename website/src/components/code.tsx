import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

import { CopyButton, cn } from "@aback-ui/ui";

import { CodeCollapse } from "@/components/code-collapse";

// Highlighting runs on the server at build time. Visitors receive plain
// markup with two CSS variables per token, so no highlighter ships to the
// browser and the theme switch is pure CSS.
const languages = ["tsx", "ts", "bash", "css", "json", "html"] as const;
export type CodeLanguage = (typeof languages)[number];

let highlighter: Promise<HighlighterCore> | undefined;

function getHighlighter() {
  highlighter ??= createHighlighterCore({
    themes: [import("shiki/themes/github-light-default.mjs"), import("shiki/themes/github-dark-default.mjs")],
    langs: [
      import("shiki/langs/tsx.mjs"),
      import("shiki/langs/typescript.mjs"),
      import("shiki/langs/bash.mjs"),
      import("shiki/langs/css.mjs"),
      import("shiki/langs/json.mjs"),
      import("shiki/langs/html.mjs"),
    ],
    engine: createJavaScriptRegexEngine(),
  });
  return highlighter;
}

const aliases: Record<string, CodeLanguage> = {
  typescript: "ts",
  sh: "bash",
  shell: "bash",
  jsx: "tsx",
};

function resolveLanguage(language?: string): CodeLanguage | undefined {
  if (!language) return undefined;
  const key = language.toLowerCase();
  if ((languages as readonly string[]).includes(key)) return key as CodeLanguage;
  return aliases[key];
}

/** Highlighted lines as HTML. Shiki escapes the source, so the output is safe to inject. */
export async function highlight(code: string, language?: string) {
  const lang = resolveLanguage(language);
  const shiki = await getHighlighter();
  return shiki.codeToHtml(code.replace(/\n$/, ""), {
    lang: lang ?? "text",
    themes: { light: "github-light-default", dark: "github-dark-default" },
    defaultColor: false,
    // The light theme's comment grey is 4.4:1 on the code surface; this one is 5.5:1.
    colorReplacements: { "github-light-default": { "#6e7781": "#59636e" } },
    transformers: [
      {
        pre(node) {
          // The wrapper owns focus and scrolling.
          node.properties = { class: "shiki" };
        },
      },
    ],
  });
}

export interface CodeProps {
  code: string;
  language?: string;
  filename?: string;
  /** Collapse sources longer than this many lines behind an Expand button. */
  collapseAfter?: number;
  className?: string;
  copyLabel?: string;
}

/**
 * The documentation code sample: the same captioned frame as the library's
 * CodeBlock, with server-side syntax highlighting.
 */
export async function Code({
  code,
  language,
  filename,
  collapseAfter,
  className,
  copyLabel = "Copy code",
}: CodeProps) {
  const html = await highlight(code, language);
  const lineCount = code.replace(/\n$/, "").split("\n").length;
  const collapsible = collapseAfter !== undefined && lineCount > collapseAfter;
  // The figure is named by its caption; the scroll area only needs to be
  // reachable by keyboard so a long line can be scrolled.
  const body = (
    <div
      tabIndex={0}
      className="docs-code overflow-x-auto p-4 font-mono text-[13px] leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );

  return (
    <figure
      data-slot="code-block"
      className={cn("min-w-0 overflow-hidden border border-border bg-code", className)}
    >
      <figcaption className="flex min-h-10 items-center justify-between gap-3 border-b border-border bg-background px-4 py-1">
        <span className="flex min-w-0 items-center gap-3">
          {filename ? <span className="truncate font-mono text-xs text-foreground">{filename}</span> : null}
          {language ? (
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
              {language}
            </span>
          ) : null}
        </span>
        <CopyButton value={code} label={copyLabel} />
      </figcaption>
      {collapsible ? <CodeCollapse lines={lineCount}>{body}</CodeCollapse> : body}
    </figure>
  );
}
