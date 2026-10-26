import { describe, expect, it } from "vitest";

import { parseJsonc } from "./config.js";

describe("parseJsonc", () => {
  it("reads the tsconfig that create-next-app writes", () => {
    const source = `{
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}`;
    expect(parseJsonc(source)).toEqual({
      compilerOptions: { plugins: [{ name: "next" }], paths: { "@/*": ["./*"] } },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
      exclude: ["node_modules"],
    });
  });

  it("strips comments and trailing commas outside strings", () => {
    const source = `{
  // line comment
  "a": "http://example.com", /* block */
  "b": ["x, ]", "y",],
  "c": "quote \\" // not a comment",
}`;
    expect(parseJsonc(source)).toEqual({
      a: "http://example.com",
      b: ["x, ]", "y"],
      c: 'quote " // not a comment',
    });
  });
});
