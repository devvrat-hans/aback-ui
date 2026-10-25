import { DocsSidebar } from "@/components/docs-sidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[1600px]">
      <DocsSidebar />
      <div className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-4xl px-4 py-10 md:px-8 lg:py-14">
          {children}
        </div>
      </div>
    </div>
  );
}
