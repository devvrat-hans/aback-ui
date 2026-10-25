"use client";

import { IconCode, IconEye } from "@tabler/icons-react";

import { Tabs, TabsContent, TabsList, TabsTrigger, cn } from "@aback-ui/ui";

// An underline tab: the active tab is marked by a 2px ink rule, not a fill.
const trigger =
  "-mb-px h-10 gap-1.5 border-b-2 border-transparent px-3 data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none";

/**
 * The live example and its exact source, one tab each. The preview is the
 * installed component rendered on the page, not a picture of it.
 */
export function ComponentPreview({
  preview,
  code,
  label,
  className,
}: {
  preview: React.ReactNode;
  code: React.ReactNode;
  /** Names the tab list, such as "Button example". */
  label: string;
  className?: string;
}) {
  return (
    <Tabs defaultValue="preview" className={cn("gap-0", className)}>
      <div className="flex items-end justify-between border-b border-border">
        <TabsList aria-label={label} className="h-10 gap-0 border-0 bg-transparent p-0">
          <TabsTrigger value="preview" className={trigger}>
            <IconEye aria-hidden="true" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="code" className={trigger}>
            <IconCode aria-hidden="true" />
            Code
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="preview" className="mt-4">
        <div className="relative flex min-h-[22rem] items-center justify-center overflow-x-auto border border-border bg-background p-6 sm:p-10">
          <div aria-hidden="true" className="docs-grid-lines docs-grid-fade pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative flex w-full justify-center">{preview}</div>
        </div>
      </TabsContent>
      <TabsContent value="code" className="mt-4">
        {code}
      </TabsContent>
    </Tabs>
  );
}
