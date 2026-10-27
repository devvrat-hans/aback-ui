import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import { getRoute, routes } from "@/data/routes";

/**
 * One 1200x630 social card per indexable page, rendered at build time into
 * out/og/<path>.png. The card reads its title and label from data/routes,
 * the same entry the page's metadata uses, so the two cannot drift.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return routes.map((route) => {
    const segments = route.path === "/" ? ["index"] : route.path.slice(1).split("/");
    segments[segments.length - 1] = `${segments.at(-1)}.png`;
    return { slug: segments };
  });
}

const fontDir = path.join(process.cwd(), "node_modules", "geist", "dist", "fonts", "geist-sans");
const assets = Promise.all([
  readFile(path.join(fontDir, "Geist-Regular.ttf")),
  readFile(path.join(fontDir, "Geist-SemiBold.ttf")),
  readFile(path.join(fontDir, "Geist-Bold.ttf")),
  readFile(path.join(process.cwd(), "public", "aback-logo-128.png")),
]);

/** Social cards stay legible at thumbnail size, so long text is cut at a word. */
function clip(text: string, max: number) {
  if (text.length <= max) return text;
  return `${text.slice(0, text.lastIndexOf(" ", max - 1))}…`;
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const joined = slug.join("/").replace(/\.png$/, "");
  const route = getRoute(joined === "index" ? "/" : `/${joined}`);
  if (!route) return new Response("Not found", { status: 404 });

  const [regular, semibold, bold, logo] = await assets;
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const title = route.path === "/" ? "The building blocks behind better applications." : route.title;
  const titleSize = title.length > 48 ? 60 : 72;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          color: "#fafafa",
          fontFamily: "Geist",
          borderTop: "8px solid #009bf9",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <img src={logoSrc} width={56} height={56} alt="" />
            <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em" }}>Aback UI</span>
          </div>
          <span
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "#33b7ff",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              border: "1px solid rgba(51,183,255,0.5)",
              padding: "8px 16px",
            }}
          >
            {route.eyebrow}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
              maxWidth: 1040,
            }}
          >
            {clip(title, 90)}
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.4, color: "#a1a1a1", maxWidth: 1000 }}>
            {clip(route.description, 150)}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 22,
            color: "#a1a1a1",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            paddingTop: 24,
          }}
        >
          <span>{`abackui.com${route.path === "/" ? "" : route.path}`}</span>
          <span style={{ color: "#fafafa", fontWeight: 600 }}>Open source · React · Tailwind CSS v4</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
        { name: "Geist", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
