import type { Metadata } from "next";

import { Badge } from "@aback-ui/ui";

import { DocsPage, DocsPageHeader } from "@/components/docs-page";
import { GuidePager } from "@/components/docs-ui";
import { readChangelog } from "@/lib/changelog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/docs/changelog");

const groupTone: Record<string, "success" | "info" | "warning" | "muted"> = {
  Added: "success",
  Changed: "info",
  Fixed: "warning",
};

/** Renders `code`, **bold**, and [links](url) inside one changelog line. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={index} className="bg-muted px-1 font-mono text-[0.9em] text-foreground">
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={index} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (link) {
          // Repository-relative links point at files that are not on this site.
          return /^https?:\/\//.test(link[2] ?? "") ? (
            <a key={index} href={link[2]} className="font-medium text-link underline underline-offset-4">
              {link[1]}
            </a>
          ) : (
            <code key={index} className="bg-muted px-1 font-mono text-[0.9em] text-foreground">
              {link[1]}
            </code>
          );
        }
        return part;
      })}
    </>
  );
}

export default async function ChangelogPage() {
  const releases = await readChangelog();
  const toc = releases.map((release) => ({ id: release.id, title: release.title }));

  return (
    <DocsPage toc={toc}>
      <DocsPageHeader
        path="/docs/changelog"
        eyebrow="Resources"
        title="Changelog"
        description="Every change a consumer can observe, newest first. Aback UI is pre-1.0, so minor versions may change an API; each change says what to do."
        crumbs={[{ label: "Docs", href: "/docs" }, { label: "Changelog" }]}
      />

      <div className="mt-10 flex flex-col gap-16">
        {releases.map((release) => (
          <section key={release.id} aria-labelledby={release.id} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 border-b border-border pb-3">
              <h2 id={release.id} className="scroll-mt-20 text-2xl font-bold tracking-tight text-foreground">
                {release.title}
              </h2>
              {release.intro.map((line) => (
                <p key={line} className="text-sm text-muted-foreground">
                  <Inline text={line} />
                </p>
              ))}
            </div>
            {release.groups.map((group, groupIndex) => (
              <div key={`${group.title}-${groupIndex}`} className="flex flex-col gap-3">
                <h3 className="flex items-center gap-2">
                  <Badge variant={groupTone[group.title] ?? "muted"}>{group.title}</Badge>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {group.bullets.length} {group.bullets.length === 1 ? "change" : "changes"}
                  </span>
                </h3>
                <ul className="flex max-w-[80ch] flex-col gap-2.5">
                  {group.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-primary-400" />
                      <span className="flex min-w-0 flex-col gap-1.5">
                        <span>
                          <Inline text={bullet.text} />
                        </span>
                        {bullet.children.length ? (
                          <ul className="flex flex-col gap-1.5 border-l border-border pl-4">
                            {bullet.children.map((child, childIndex) => (
                              <li key={childIndex}>
                                <Inline text={child} />
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ))}

        <GuidePager href="/docs/changelog" />
      </div>
    </DocsPage>
  );
}
