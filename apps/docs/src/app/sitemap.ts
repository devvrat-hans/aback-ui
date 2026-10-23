import type { MetadataRoute } from "next";

import { components } from "@/data/component-catalog";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { url: "/", priority: 1, changeFrequency: "weekly" },
      { url: "/docs", priority: 0.9, changeFrequency: "weekly" },
      { url: "/docs/installation", priority: 0.9, changeFrequency: "weekly" },
      { url: "/docs/components", priority: 0.9, changeFrequency: "weekly" },
      { url: "/docs/theming", priority: 0.8, changeFrequency: "monthly" },
      { url: "/docs/tokens", priority: 0.8, changeFrequency: "monthly" },
      { url: "/docs/registry", priority: 0.8, changeFrequency: "monthly" },
      { url: "/docs/accessibility", priority: 0.7, changeFrequency: "monthly" },
      { url: "/built-with", priority: 0.6, changeFrequency: "monthly" },
    ] as const
  ).map((route) => ({
    ...route,
    url: `${site.url}${route.url}`,
    lastModified,
  }));

  const componentRoutes: MetadataRoute.Sitemap = components.map((component) => ({
    url: `${site.url}/docs/components/${component.name}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...componentRoutes];
}
