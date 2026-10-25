import { readFile } from "node:fs/promises";
import path from "node:path";

// CHANGELOG.md at the repository root is the record; the changelog page is
// rendered from it at build time so the two can never disagree. Only the
// Markdown the file actually uses is understood: release and group headings,
// paragraphs, and bullets one level deep.

export interface ChangelogBullet {
  text: string;
  children: string[];
}

export interface ChangelogGroup {
  title: string;
  bullets: ChangelogBullet[];
}

export interface ChangelogRelease {
  id: string;
  title: string;
  intro: string[];
  groups: ChangelogGroup[];
}

function slug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function readChangelog(): Promise<ChangelogRelease[]> {
  const file = path.join(process.cwd(), "..", "CHANGELOG.md");
  const source = await readFile(file, "utf8");
  const releases: ChangelogRelease[] = [];
  let release: ChangelogRelease | undefined;
  let group: ChangelogGroup | undefined;

  for (const line of source.split("\n")) {
    if (line.startsWith("## ")) {
      const title = line.slice(3).trim();
      release = { id: slug(title), title, intro: [], groups: [] };
      releases.push(release);
      group = undefined;
    } else if (line.startsWith("### ") && release) {
      group = { title: line.slice(4).trim(), bullets: [] };
      release.groups.push(group);
    } else if (line.startsWith("- ") && group) {
      group.bullets.push({ text: line.slice(2).trim(), children: [] });
    } else if (/^\s{2,}- /.test(line) && group) {
      group.bullets.at(-1)?.children.push(line.trim().slice(2));
    } else if (line.trim() && release && !group) {
      release.intro.push(line.trim());
    }
  }

  return releases;
}
