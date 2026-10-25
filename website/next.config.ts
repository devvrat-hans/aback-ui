import type { NextConfig } from "next";

// Every route is prerendered, so the site ships as static files (`out/`) and
// is served by Cloudflare Workers static assets. Response headers live in
// public/_headers, because Next.js does not apply `headers()` to an export.
const nextConfig: NextConfig = {
  output: "export",
  poweredByHeader: false,
  transpilePackages: ["@aback-ui/ui"],
  experimental: {
    optimizePackageImports: ["@tabler/icons-react"],
  },
};

export default nextConfig;
