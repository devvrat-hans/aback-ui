import type { MetadataRoute } from "next";

import { routes } from "@/data/routes";
import { absoluteUrl, ogImagePath } from "@/lib/seo";

// Generated once at build time; the site is a static export.
export const dynamic = "force-static";

/**
 * Every indexable page from data/routes. lastModified is the newest commit
 * to the files a page is built from, so search engines can tell which pages
 * really changed instead of seeing every URL touched on each deploy.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: route.lastModified,
    images: [absoluteUrl(ogImagePath(route.path))],
  }));
}
