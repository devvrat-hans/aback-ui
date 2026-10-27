import { getRoute, type SiteRoute } from "@/data/routes";
import { site } from "@/data/site";
import { absoluteUrl, ogImagePath } from "@/lib/seo";

/**
 * schema.org structured data. Every node gets a stable @id so pages can
 * reference the organization, website, and library instead of repeating
 * them, and search engines and answer engines can join the graph. Nothing
 * here asserts a fact the site does not show: no ratings, review counts, or
 * download numbers.
 */

type Thing = Record<string, unknown>;

export const ids = {
  organization: `${site.url}/#organization`,
  website: `${site.url}/#website`,
  library: `${site.url}/#library`,
  cli: `${site.url}/#cli`,
};

export function organizationSchema(): Thing {
  return {
    "@type": "Organization",
    "@id": ids.organization,
    name: site.author,
    url: "https://aback.group",
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/icon-512.png`,
      width: 512,
      height: 512,
    },
    sameAs: [site.repository, "https://www.npmjs.com/org/aback-ui"],
  };
}

export function websiteSchema(): Thing {
  return {
    "@type": "WebSite",
    "@id": ids.website,
    name: site.name,
    alternateName: "abackui.com",
    url: site.url,
    description: site.description,
    inLanguage: "en",
    publisher: { "@id": ids.organization },
  };
}

/** The component library itself: source, license, language, and where to get it. */
export function librarySchema(): Thing {
  return {
    "@type": "SoftwareSourceCode",
    "@id": ids.library,
    name: site.name,
    description:
      "Open-source React components, blocks, and design tokens for Tailwind CSS v4, installed as source with the aback-ui CLI or imported from the @aback-ui/ui npm package.",
    url: site.url,
    codeRepository: site.repository,
    programmingLanguage: [
      { "@type": "ComputerLanguage", name: "TypeScript" },
      { "@type": "ComputerLanguage", name: "CSS" },
    ],
    runtimePlatform: ["React 19", "Tailwind CSS v4"],
    license: "https://opensource.org/licenses/MIT",
    isAccessibleForFree: true,
    author: { "@id": ids.organization },
    publisher: { "@id": ids.organization },
    keywords: "React, components, design system, Tailwind CSS, accessibility, design tokens",
  };
}

/** The aback-ui CLI as an installable developer application. Free, so the offer is zero. */
export function cliSchema(): Thing {
  return {
    "@type": "SoftwareApplication",
    "@id": ids.cli,
    name: "aback-ui CLI",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "macOS, Linux, Windows (Node.js 20.9 or later)",
    url: `${site.url}/docs/cli`,
    downloadUrl: "https://www.npmjs.com/package/aback-ui",
    softwareRequirements: "Node.js",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    license: "https://opensource.org/licenses/MIT",
    publisher: { "@id": ids.organization },
  };
}

export interface Crumb {
  label: string;
  href?: string;
}

/** Breadcrumbs as shown on the page. The last item is the current page and needs no URL. */
export function breadcrumbSchema(crumbs: Crumb[], currentPath?: string): Thing {
  const trail = [{ label: "Home", href: "/" }, ...crumbs];
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => {
      const href = crumb.href ?? (index === trail.length - 1 ? currentPath : undefined);
      return {
        "@type": "ListItem",
        position: index + 1,
        name: crumb.label,
        ...(href ? { item: absoluteUrl(href) } : {}),
      };
    }),
  };
}

function imageFor(route: SiteRoute) {
  return { "@type": "ImageObject", url: absoluteUrl(ogImagePath(route.path)), width: 1200, height: 630 };
}

/** The WebPage node for any route, typed by what the page is. */
export function webPageSchema(route: SiteRoute, type = "WebPage"): Thing {
  return {
    "@type": type,
    "@id": `${absoluteUrl(route.path)}#webpage`,
    url: absoluteUrl(route.path),
    name: route.title,
    description: route.description,
    inLanguage: "en",
    isPartOf: { "@id": ids.website },
    primaryImageOfPage: imageFor(route),
    dateModified: route.lastModified,
  };
}

/** Documentation pages: a TechArticle about the library. */
export function techArticleSchema(route: SiteRoute): Thing {
  return {
    "@type": "TechArticle",
    "@id": `${absoluteUrl(route.path)}#article`,
    headline: route.title,
    description: route.description,
    url: absoluteUrl(route.path),
    mainEntityOfPage: { "@id": `${absoluteUrl(route.path)}#webpage` },
    image: imageFor(route),
    dateModified: route.lastModified,
    inLanguage: "en",
    proficiencyLevel: route.kind === "component" || route.kind === "block" ? "Beginner" : "Expert",
    author: { "@id": ids.organization },
    publisher: { "@id": ids.organization },
    about: { "@id": ids.library },
    ...(route.keywords ? { keywords: route.keywords.join(", ") } : {}),
  };
}

export function blogPostingSchema(route: SiteRoute): Thing {
  return {
    "@type": "BlogPosting",
    "@id": `${absoluteUrl(route.path)}#article`,
    headline: route.title,
    description: route.description,
    url: absoluteUrl(route.path),
    mainEntityOfPage: { "@id": `${absoluteUrl(route.path)}#webpage` },
    image: imageFor(route),
    datePublished: route.published,
    dateModified: route.lastModified,
    inLanguage: "en",
    author: { "@id": ids.organization },
    publisher: { "@id": ids.organization },
    isPartOf: { "@id": `${site.url}/blog#blog` },
    ...(route.keywords ? { keywords: route.keywords.join(", ") } : {}),
  };
}

/** Free browser tools: a WebApplication that costs nothing and needs no account. */
export function webApplicationSchema(route: SiteRoute, features: string[]): Thing {
  return {
    "@type": "WebApplication",
    "@id": `${absoluteUrl(route.path)}#app`,
    name: route.title,
    description: route.description,
    url: absoluteUrl(route.path),
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any (runs in the browser)",
    browserRequirements: "Requires JavaScript.",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: features,
    publisher: { "@id": ids.organization },
  };
}

/** A list page: its items in order, each with a URL and name. */
export function itemListSchema(items: { name: string; path: string }[]): Thing {
  return {
    "@type": "ItemList",
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(items: { question: string; answer: string }[]): Thing {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** The structured data every route shares: its WebPage node and breadcrumbs. */
export function routeGraph(path: string, crumbs: Crumb[], extra: Thing[] = []): Thing[] {
  const route = getRoute(path);
  if (!route) throw new Error(`No route entry for ${path}. Add it to src/data/routes.ts.`);
  const pageType =
    route.kind === "catalog" ? "CollectionPage" : route.path === "/about" ? "AboutPage" : "WebPage";
  const page = webPageSchema(route, pageType);
  const nodes: Thing[] = [{ ...page, breadcrumb: breadcrumbSchema(crumbs, path) }];
  if (route.kind === "guide" || route.kind === "component" || route.kind === "block") {
    nodes.push(techArticleSchema(route));
  }
  return [...nodes, ...extra];
}
