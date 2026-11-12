"use client";

import { IconAdjustments, IconFileAnalytics } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { DescriptionList, DescriptionListDetails, DescriptionListItem, DescriptionListTerm } from "@/components/ui/description-list";
import { Field } from "@/components/ui/field";
import { Panel } from "@/components/ui/panel";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function PanelExample() {
  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle as="h2" className="text-lg">
          Compress image
        </CardTitle>
        <CardDescription>The card is the surface. Panels divide it without nesting another card.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Panel
          title="Options"
          icon={<IconAdjustments />}
          description="Applied to every file in the batch."
        >
          <Field label="Output format">
            <Select defaultValue="webp">
              <option value="webp">WebP</option>
              <option value="avif">AVIF</option>
              <option value="jpeg">JPEG</option>
            </Select>
          </Field>
          <Panel variant="card" size="sm" title="Advanced" as="h4">
            <Field orientation="horizontal" label="Strip metadata" description="Removes location and camera details.">
              <Switch defaultChecked />
            </Field>
          </Panel>
        </Panel>

        <Panel
          title="Result"
          icon={<IconFileAnalytics />}
          actions={
            <>
              <Badge variant="success">Example data</Badge>
              <CopyButton value="612 KB, 75% smaller" label="Copy result" />
            </>
          }
        >
          <DescriptionList className="bg-card">
            <DescriptionListItem>
              <DescriptionListTerm>Original</DescriptionListTerm>
              <DescriptionListDetails>2.4 MB</DescriptionListDetails>
            </DescriptionListItem>
            <DescriptionListItem>
              <DescriptionListTerm>Compressed</DescriptionListTerm>
              <DescriptionListDetails tone="success">612 KB, 75% smaller</DescriptionListDetails>
            </DescriptionListItem>
          </DescriptionList>
        </Panel>
      </CardContent>
    </Card>
  );
}
