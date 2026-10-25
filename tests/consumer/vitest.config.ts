import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./setup.ts"],
    include: ["*.test.{ts,tsx}"],
    restoreMocks: true,
    css: false,
  },
});
