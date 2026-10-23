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
