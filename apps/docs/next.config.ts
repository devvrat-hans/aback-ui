import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  transpilePackages: ["@aback-ui/ui"],
  experimental: {
    optimizePackageImports: ["@tabler/icons-react"],
  },
  async headers() {
    return [
      {
        source: "/r/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Content-Type", value: "application/json; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=300, s-maxage=3600" },
        ],
      },
    ];
  },
};

export default nextConfig;
