import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));
const ui = path.resolve(root, "../packages/ui/src");
const registry = path.resolve(root, "../registry");

// Blocks import the installed aliases (@/components/ui/*, @/lib/utils), so the
// tests resolve them to the canonical source, exactly as the website does.
// The app's tsconfig sets jsx to "preserve" for Next.js, so the test transform
// is told to compile JSX itself.
export default defineConfig({
  oxc: {
    jsx: { runtime: "automatic" },
  },
  resolve: {
    alias: [
      { find: /^@\/components\/ui\/(.*)$/, replacement: `${ui}/components/$1` },
      { find: /^@\/lib\/utils$/, replacement: `${ui}/lib/utils.ts` },
      { find: /^@aback-ui\/ui$/, replacement: `${ui}/index.ts` },
      { find: /^@registry\/(.*)$/, replacement: `${registry}/$1` },
      { find: /^@\/(.*)$/, replacement: `${root}/src/$1` },
    ],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["../packages/ui/src/test-setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    restoreMocks: true,
    css: false,
  },
});
