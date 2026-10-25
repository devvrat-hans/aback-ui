import { readFile } from "node:fs/promises";
import path from "node:path";

export async function readExampleSource(slug: string) {
  const file = path.join(process.cwd(), "src", "examples", `${slug}.tsx`);
  try {
    return await readFile(file, "utf8");
  } catch {
    return null;
  }
}

export async function readBlockSource(slug: string) {
  // Block source lives with the registry, outside the website.
  const file = path.join(process.cwd(), "..", "registry", "blocks", `${slug}.tsx`);
  try {
    return await readFile(file, "utf8");
  } catch {
    return null;
  }
}

/**
 * The named exports of an installed component file, read from the canonical
 * source, so the import snippets on its page always match what ships.
 */
export async function readComponentExports(files: string[] = []) {
  const target = files.find((file) => file.startsWith("components/ui/"));
  if (!target) return null;
  // Registry targets are components/ui/x.tsx; the source lives in packages/ui/src/components.
  const file = path.join(process.cwd(), "..", "packages", "ui", "src", "components", path.basename(target));
  let source: string;
  try {
    source = await readFile(file, "utf8");
  } catch {
    return null;
  }

  const names = [...source.matchAll(/^export\s*\{([^}]+)\}/gm)]
    .flatMap((match) => (match[1] ?? "").split(","))
    .map((name) => name.trim())
    .filter((name) => name && !name.startsWith("type "))
    .map((name) => name.split(/\s+as\s+/).pop() ?? name)
    .filter((name) => !name.endsWith("Variants"));
  if (names.length === 0) return null;
  return { names, module: `@/${target.replace(/\.tsx?$/, "")}` };
}

/** An import statement, wrapped onto lines when it names more than three exports. */
export function formatImport(names: string[], module: string) {
  return names.length > 3
    ? `import {\n${names.map((name) => `  ${name},`).join("\n")}\n} from "${module}";`
    : `import { ${names.join(", ")} } from "${module}";`;
}
