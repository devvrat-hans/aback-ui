"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconCircleCheck,
  IconFile,
  IconRocket,
  IconUsers,
  IconWorld,
  IconX,
} from "@tabler/icons-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarGroup,
  Badge,
  Button,
  Calendar,
  CopyButton,
  Dropzone,
  Field,
  Input,
  Label,
  Rating,
  Separator,
  Stat,
  StatGrid,
  Step,
  Steps,
  Switch,
  ToggleGroup,
  ToggleGroupItem,
  formatCalendarDate,
  formatFileSize,
} from "@aback-ui/ui";

function Card({
  uses,
  className,
  children,
}: {
  /** The components this card renders, linked to their pages. */
  uses: { title: string; slug: string }[];
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`mb-4 flex break-inside-avoid flex-col border border-border bg-card ${className ?? ""}`}>
      <div className="flex-1 p-5">{children}</div>
      <p className="flex flex-wrap items-center gap-x-1.5 gap-y-1 border-t border-border px-5 py-2.5 text-xs text-muted-foreground">
        {uses.map((item, index) => (
          <span key={item.slug} className="flex items-center gap-1.5">
            {index > 0 ? <span aria-hidden="true">·</span> : null}
            <Link
              href={`/docs/components/${item.slug}`}
              className="font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-link hover:underline"
            >
              {item.title}
            </Link>
          </span>
        ))}
      </p>
    </div>
  );
}

function SettingsCard() {
  const [digest, setDigest] = useState(true);
  const [alerts, setAlerts] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <Card
      uses={[
        { title: "Field", slug: "field" },
        { title: "Switch", slug: "switch" },
        { title: "Button", slug: "button" },
      ]}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(true);
        }}
        onChange={() => setSaved(false)}
        className="flex flex-col gap-4"
      >
        <div>
          <p className="text-base font-semibold text-foreground">Workspace</p>
          <p className="text-sm text-muted-foreground">Shown to everyone you invite.</p>
        </div>
        <Field htmlFor="home-workspace" label="Workspace name">
          <Input id="home-workspace" defaultValue="Northwind Studio" />
        </Field>
        <Separator />
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label htmlFor="home-digest">Weekly digest</Label>
            <p className="mt-1 text-xs text-muted-foreground">Every Monday at 09:00.</p>
          </div>
          <Switch
            id="home-digest"
            checked={digest}
            onCheckedChange={(value) => {
              setDigest(value);
              setSaved(false);
            }}
          />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <Label htmlFor="home-alerts">Security alerts</Label>
            <p className="mt-1 text-xs text-muted-foreground">Sign-ins and permission changes.</p>
          </div>
          <Switch
            id="home-alerts"
            checked={alerts}
            onCheckedChange={(value) => {
              setAlerts(value);
              setSaved(false);
            }}
          />
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
          <span role="status" className="mr-auto flex items-center gap-1.5 text-xs text-success-strong">
            {saved ? (
              <>
                <IconCircleCheck aria-hidden="true" className="size-4" />
                Saved in this preview
              </>
            ) : null}
          </span>
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </Card>
  );
}

function StatsCard() {
  return (
    <Card uses={[{ title: "Stat", slug: "stat" }]}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-base font-semibold text-foreground">This week</p>
        <Badge variant="muted">Example data</Badge>
      </div>
      <StatGrid columns={2} joined>
        <Stat
          label="Launches"
          value="32"
          icon={<IconRocket />}
          trend={{ direction: "up", label: "+8 vs last week" }}
        />
        <Stat
          label="Founders"
          value="802"
          icon={<IconUsers />}
          trend={{ direction: "flat", label: "Same as last week" }}
        />
      </StatGrid>
      <Stat
        className="mt-3"
        label="Page views"
        value="961"
        hint="Last 30 days"
        icon={<IconWorld />}
        trend={{ direction: "down", label: "-4% vs previous 30 days" }}
      />
    </Card>
  );
}

function StepsCard() {
  const [step, setStep] = useState(1);
  const titles = ["Create a workspace", "Invite your team", "Connect a domain"];
  const descriptions = [
    "Name it and choose a data region.",
    "Members get a sign-in link by email.",
    "Point a CNAME record at your workspace.",
  ];

  return (
    <Card uses={[{ title: "Steps", slug: "steps" }]}>
      <p className="mb-4 text-base font-semibold text-foreground">Get set up</p>
      <Steps aria-label="Workspace setup">
        {titles.map((title, index) => (
          <Step
            key={title}
            title={title}
            description={descriptions[index]}
            status={index < step ? "complete" : index === step ? "current" : "upcoming"}
          >
            {index === step ? (
              <div className="mt-2">
                <Button size="sm" variant="outline" onClick={() => setStep((value) => value + 1)}>
                  Mark as done
                </Button>
              </div>
            ) : null}
          </Step>
        ))}
      </Steps>
      {step >= titles.length ? (
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
          <span className="text-sm text-success-strong">All set.</span>
          <Button size="sm" variant="ghost" onClick={() => setStep(0)}>
            Start over
          </Button>
        </div>
      ) : null}
    </Card>
  );
}

function RatingCard() {
  const [value, setValue] = useState(0);
  return (
    <Card
      uses={[
        { title: "Rating", slug: "rating" },
        { title: "Avatar", slug: "avatar" },
      ]}
    >
      <p id="home-rating-label" className="text-base font-semibold text-foreground">
        Rate this release
      </p>
      <Rating
        aria-labelledby="home-rating-label"
        name="home-rating"
        value={value}
        onValueChange={setValue}
        clearable
        size="lg"
        className="mt-3"
      />
      <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
        {value ? `You gave it ${value} out of 5.` : "Choose a star, or use the arrow keys."}
      </p>
      <Separator className="my-4" />
      <div className="flex items-center gap-3">
        <AvatarGroup aria-label="Reviewers" max={3} total={8} size="sm">
          {["AR", "BK", "CW", "DM"].map((initials) => (
            <Avatar key={initials} size="sm">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
        <span className="text-xs text-muted-foreground">8 reviewers</span>
      </div>
    </Card>
  );
}

const plans = {
  monthly: { price: "$12", note: "per seat, billed monthly" },
  yearly: { price: "$10", note: "per seat, billed yearly" },
} as const;

function PricingCard() {
  const [period, setPeriod] = useState<keyof typeof plans>("yearly");
  return (
    <Card
      uses={[
        { title: "Toggle Group", slug: "toggle-group" },
        { title: "Badge", slug: "badge" },
      ]}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-base font-semibold text-foreground">Team plan</p>
        <ToggleGroup
          type="single"
          size="sm"
          variant="outline"
          aria-label="Billing period"
          value={period}
          onValueChange={(value) => {
            if (value === "monthly" || value === "yearly") setPeriod(value);
          }}
        >
          <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
          <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <p className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-extrabold tracking-tight tabular-nums text-foreground">
          {plans[period].price}
        </span>
        <span className="text-sm text-muted-foreground">{plans[period].note}</span>
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge variant="brand">Most popular</Badge>
        {period === "yearly" ? <Badge variant="success">Save 17%</Badge> : null}
        <Badge variant="muted">Example pricing</Badge>
      </div>
    </Card>
  );
}

function CopyCard() {
  const token = "abk_test_4f9c2e1a7b";
  return (
    <Card uses={[{ title: "Copy Button", slug: "copy-button" }]}>
      <p className="text-base font-semibold text-foreground">API key</p>
      <p className="mt-1 text-sm text-muted-foreground">Example value, not a real credential.</p>
      <div className="mt-4 flex items-center gap-2">
        <code className="flex h-9 min-w-0 flex-1 items-center truncate border border-input bg-muted/30 px-3 font-mono text-xs text-foreground">
          {token}
        </code>
        <CopyButton value={token} variant="outline" size="default" showLabel label="Copy key" />
      </div>
    </Card>
  );
}

function UploadCard() {
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState("");

  return (
    <Card uses={[{ title: "Dropzone", slug: "dropzone" }]}>
      <p className="mb-3 text-base font-semibold text-foreground">Attachments</p>
      <Dropzone
        accept="image/png,image/jpeg,.pdf"
        multiple
        maxFiles={3}
        maxSize={5 * 1024 * 1024}
        label="Drop files or browse"
        hint="PNG, JPG, or PDF up to 5 MB. Files stay in this browser."
        onFilesAccepted={(accepted) => {
          setFiles((current) => [...current, ...accepted].slice(0, 3));
          setMessage(`${accepted.length} file${accepted.length === 1 ? "" : "s"} added.`);
        }}
        onFilesRejected={(rejected) => {
          setMessage(`${rejected.length} file${rejected.length === 1 ? " was" : "s were"} not accepted.`);
        }}
      />
      <p role="status" className="mt-2 min-h-4 text-xs text-muted-foreground">
        {message}
      </p>
      {files.length ? (
        <ul aria-label="Selected files" className="mt-2 flex flex-col gap-1.5">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className="flex items-center gap-2 border border-border px-2.5 py-1.5">
              <IconFile aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate text-xs font-medium">{file.name}</span>
              <span className="text-xs tabular-nums text-muted-foreground">{formatFileSize(file.size)}</span>
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label={`Remove ${file.name}`}
                onClick={() => setFiles((current) => current.filter((_, i) => i !== index))}
              >
                <IconX aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  );
}

function CalendarCard() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 10, 12));
  return (
    <Card uses={[{ title: "Calendar", slug: "calendar" }]}>
      <p className="text-base font-semibold text-foreground">Launch date</p>
      <p className="mt-1 text-xs text-muted-foreground" aria-live="polite">
        {date ? formatCalendarDate(date, "en-US") : "No date selected"}
      </p>
      <div className="-mx-1 mt-3 flex justify-center">
        <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={new Date(2026, 10, 1)} />
      </div>
    </Card>
  );
}

function StatusCard() {
  return (
    <Card
      uses={[
        { title: "Alert", slug: "alert" },
        { title: "Badge", slug: "badge" },
      ]}
    >
      <div className="flex flex-col gap-3">
        <Alert variant="success">
          <IconCircleCheck aria-hidden="true" />
          <div>
            <AlertTitle>Deployed to production</AlertTitle>
            <AlertDescription>Build 1.4.2 is live in every region.</AlertDescription>
          </div>
        </Alert>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="success" dot>
            Operational
          </Badge>
          <Badge variant="warning" dot>
            Degraded
          </Badge>
          <Badge variant="danger" dot>
            Outage
          </Badge>
          <Badge variant="outline">Draft</Badge>
        </div>
      </div>
    </Card>
  );
}

/**
 * The homepage component wall. Every card is the shipped component with
 * working state, and its footer links to the documentation it came from.
 */
export function HomeShowcase() {
  return (
    <div className="columns-1 gap-4 md:columns-2 xl:columns-3">
      <SettingsCard />
      <StatusCard />
      <CopyCard />
      <StatsCard />
      <StepsCard />
      <CalendarCard />
      <PricingCard />
      <RatingCard />
      <UploadCard />
    </div>
  );
}
