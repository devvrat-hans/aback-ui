import { TableOfContents } from "@/components/ui/table-of-contents";

export function TableOfContentsExample() {
  return (
    <div className="grid w-full gap-6 sm:grid-cols-[220px_1fr]">
      <TableOfContents
        title="On this page"
        items={[
          { id: "install", title: "Installation" },
          { id: "preview", title: "Preview" },
          { id: "usage", title: "Usage" },
          { id: "api", title: "API" },
          { id: "accessibility", title: "Accessibility" },
          { id: "used-in", title: "Used in production", depth: 2 },
        ]}
      />
      <p className="text-sm leading-relaxed text-muted-foreground">
        This list points at the sections of this page. Scroll and the active entry follows the
        section in view; select an entry to jump to it. The links are ordinary anchors, so they work
        before JavaScript loads and update the address bar.
      </p>
    </div>
  );
}
