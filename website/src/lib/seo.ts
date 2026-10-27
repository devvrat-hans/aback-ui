import type { Metadata } from "next";

import { getRoute, type SiteRoute } from "@/data/routes";
import { site } from "@/data/site";

/** The generated 1200x630 social card for a route, from app/og. */
export function ogImagePath(path: string) {
  return `/og${path === "/" ? "/index" : path}.png`;
}

/** `/docs/theming` becomes `https://abackui.com/docs/theming`; `/` stays the bare origin. */
export function absoluteUrl(path: string) {
  return path === "/" ? site.url : `${site.url}${path}`;
}

/**
 * Metadata for an indexable page, read from the route list in data/routes so
 * the title, description, canonical, Open Graph, and Twitter tags always
 * agree with each other and with the sitemap. Child metadata replaces the
 * root layout's openGraph and twitter objects wholesale in Next.js, which is
 * why every field is set here rather than inherited.
 */
export function pageMetadata(path: string, overrides: Partial<Pick<SiteRoute, "title" | "description">> = {}): Metadata {
  const route = getRoute(path);
  if (!route) throw new Error(`No route entry for ${path}. Add it to src/data/routes.ts.`);
  const title = overrides.title ?? route.title;
  const description = overrides.description ?? route.description;
  // The home page carries its full title; the layout template appends the site name elsewhere.
  const socialTitle = path === "/" ? title : `${title} | ${site.name}`;
  const image = { url: ogImagePath(path), width: 1200, height: 630, alt: socialTitle };
  const isArticle = route.kind === "post";

  return {
    title: path === "/" ? { absolute: title } : title,
    description,
    keywords: route.keywords,
    alternates: {
      canonical: path,
      types: route.markdown ? { "text/markdown": route.markdown } : undefined,
    },
    openGraph: {
      type: isArticle ? "article" : "website",
      url: path,
      siteName: site.name,
      locale: "en_US",
      title: socialTitle,
      description,
      images: [image],
      ...(isArticle
        ? {
            publishedTime: route.published,
            modifiedTime: route.lastModified,
            authors: [site.author],
            tags: route.keywords,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image.url],
    },
  };
}
