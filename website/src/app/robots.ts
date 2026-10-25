import type { MetadataRoute } from "next";

import { site } from "@/data/site";

// Generated once at build time; the site is a static export.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/view/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
