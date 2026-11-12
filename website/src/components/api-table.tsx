import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@aback-ui/ui";

import { InlineText } from "@/components/inline-text";
import type { ApiRow } from "@/data/component-docs";

/**
 * A component's props. In a wide column it is a four-column table. In a
 * narrow one, such as a phone or the docs column beside the sidebar on a
 * tablet, each prop becomes its own block, so the type, default, and
 * description are all on screen without scrolling sideways.
 *
 * The switch follows the width of the column, not the viewport. Only one of
 * the two layouts is rendered to assistive technology at a time.
 */
export function ApiTable({ rows, label }: { rows: ApiRow[]; label: string }) {
  return (
    <div className="@container">
      <dl className="flex flex-col divide-y divide-border border border-border @[40rem]:hidden">
        {rows.map((row) => (
          <div key={row.prop} className="flex flex-col gap-2 px-4 py-4">
            <dt>
              <code className="font-mono text-[13px] font-semibold text-link [overflow-wrap:anywhere]">
                {row.prop}
              </code>
            </dt>
            <dd className="flex flex-col gap-2">
              <code className="font-mono text-xs leading-relaxed text-foreground [overflow-wrap:anywhere]">
                {row.type}
              </code>
              {row.defaultValue ? (
                <span className="text-xs text-muted-foreground">
                  Default{" "}
                  <code className="bg-muted px-1 font-mono text-foreground">{row.defaultValue}</code>
                </span>
              ) : null}
              <span className="text-sm leading-relaxed text-muted-foreground">
                <InlineText text={row.description} />
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <div className="hidden @[40rem]:block">
        <Table containerProps={{ "aria-label": label }}>
          <TableHeader>
            <TableRow>
              <TableHead>Prop</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Default</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.prop}>
                <TableCell className="align-top">
                  <code className="font-mono text-xs font-semibold text-link">{row.prop}</code>
                </TableCell>
                <TableCell className="max-w-[17rem] align-top">
                  <code className="font-mono text-xs leading-relaxed text-foreground">{row.type}</code>
                </TableCell>
                <TableCell className="whitespace-nowrap align-top font-mono text-xs text-muted-foreground">
                  {row.defaultValue ?? "None"}
                </TableCell>
                <TableCell className="min-w-[15rem] align-top text-sm leading-relaxed text-muted-foreground">
                  <InlineText text={row.description} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
