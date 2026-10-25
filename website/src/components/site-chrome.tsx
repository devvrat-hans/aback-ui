import { SkipLink } from "@aback-ui/ui";

import { DocsToaster } from "@/components/docs-toaster";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/** The header, main landmark, and footer shared by every documentation page. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter />
      <DocsToaster />
    </>
  );
}
