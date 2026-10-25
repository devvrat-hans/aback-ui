import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { blockPreviewMap } from "@/blocks";
import { FrameBridge } from "@/components/frame-bridge";
import { blocks, getBlock } from "@/data/blocks";

export const dynamicParams = false;

export function generateStaticParams() {
  return blocks.map((block) => ({ slug: block.name }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const block = getBlock(slug);
  if (!block) return {};
  return {
    title: `${block.title} preview`,
    description: block.description,
    alternates: { canonical: `/docs/blocks/${block.name}` },
    // The documentation page is the indexable one; this is its preview frame.
    robots: { index: false, follow: true },
  };
}

const ROOT_ID = "block-preview-root";

export default async function BlockViewPage({ params }: PageProps) {
  const { slug } = await params;
  const Preview = blockPreviewMap[slug];
  if (!Preview) notFound();

  return (
    <div id={ROOT_ID} className="flow-root bg-background">
      <Preview />
      <FrameBridge rootId={ROOT_ID} />
    </div>
  );
}
