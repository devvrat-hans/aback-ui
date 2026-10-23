"use client";

import { useState } from "react";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export function SwitchExample() {
  const [analytics, setAnalytics] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  return (
    <div className="flex max-w-md flex-col">
      <div className="flex items-center justify-between gap-6 py-3">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="switch-analytics" className="font-normal">
            Usage analytics
          </Label>
          <p className="text-xs text-muted-foreground">Share anonymous product usage data.</p>
        </div>
        <Switch id="switch-analytics" checked={analytics} onCheckedChange={setAnalytics} />
      </div>

      <Separator />

      <div className="flex items-center justify-between gap-6 py-3">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="switch-newsletter" className="font-normal">
            Product newsletter
          </Label>
          <p className="text-xs text-muted-foreground">One email a month with new components.</p>
        </div>
        <Switch id="switch-newsletter" checked={newsletter} onCheckedChange={setNewsletter} />
      </div>

      <p className="pt-2 text-xs text-muted-foreground">
        Analytics is {analytics ? "on" : "off"}. Newsletter is {newsletter ? "on" : "off"}.
      </p>
    </div>
  );
}
