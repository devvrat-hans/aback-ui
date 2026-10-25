import { DocsSidebar } from "@/components/docs-sidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page md:grid md:grid-cols-[13.5rem_minmax(0,1fr)] md:gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
      <DocsSidebar />
      <div className="min-w-0 pb-20 pt-8 md:pt-10 lg:pt-12">{children}</div>
    </div>
  );
}
