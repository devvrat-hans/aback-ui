import { SkipLink } from "@/components/ui/skip-link";

export function SkipLinkExample() {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="relative border border-border">
        <SkipLink href="#skip-link-demo-content" className="focus:absolute focus:left-3 focus:top-3">
          Skip to content
        </SkipLink>
        <div className="flex h-12 items-center gap-4 border-b border-border px-4 text-sm">
          <span className="font-semibold">Example header</span>
          <a href="#skip-link-demo-content" className="text-muted-foreground hover:text-foreground">
            Docs
          </a>
          <a href="#skip-link-demo-content" className="text-muted-foreground hover:text-foreground">
            Blog
          </a>
        </div>
        <div id="skip-link-demo-content" tabIndex={-1} className="p-4 text-sm text-muted-foreground outline-none">
          Main content. Focus lands here after the skip link.
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Click in the frame above, then press Tab from the top of this preview to reveal the link. This
        site has its own skip link: press Tab on any page.
      </p>
    </div>
  );
}
