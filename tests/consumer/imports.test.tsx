import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

// Every import below resolves through the packed tarballs the script installs
// into this directory, not the monorepo source. If the exports map, the dist
// build, the dependency graph, or the type declarations are wrong, this file
// is where it breaks.
import {
  AvatarGroup,
  Avatar,
  AvatarFallback,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CodeBlock,
  CopyButton,
  Dropzone,
  Field,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  PageHeader,
  Rating,
  RelativeTime,
  Spinner,
  Stat,
  Step,
  Steps,
  Switch,
  ThemeToggle,
  formatRelativeTime,
} from "@aback-ui/ui";

describe("packed @aback-ui/ui", () => {
  it("renders a Button from the published entry point", () => {
    render(<Button>Save changes</Button>);

    const button = screen.getByRole("button", { name: "Save changes" });
    expect(button).toHaveAttribute("data-variant", "default");
    expect(button).toHaveClass("bg-primary");
  });

  it("composes a Card from the published entry point", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Plan usage</CardTitle>
          <CardDescription>How much you have used.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>128 of 500 builds.</p>
        </CardContent>
        <CardFooter>
          <p>Resets on the 1st.</p>
        </CardFooter>
      </Card>,
    );

    expect(screen.getByRole("heading", { level: 3, name: "Plan usage" })).toBeInTheDocument();
    expect(screen.getByText("128 of 500 builds.")).toBeInTheDocument();
  });

  it("associates a Field label with its Input", () => {
    render(
      <Field htmlFor="email" label="Work email">
        <Input id="email" />
      </Field>,
    );

    expect(screen.getByLabelText("Work email")).toBeInTheDocument();
  });

  it("renders the PageHeader title as the page heading", () => {
    render(<PageHeader title="API keys" description="Create and revoke keys." />);

    expect(screen.getByRole("heading", { level: 1, name: "API keys" })).toBeInTheDocument();
  });

  it("honours the PageHeader heading level override", () => {
    render(<PageHeader as="h2" title="API keys" />);

    expect(screen.getByRole("heading", { level: 2, name: "API keys" })).toBeInTheDocument();
  });

  it("renders a Switch with checked semantics", () => {
    render(<Switch defaultChecked />);

    expect(screen.getByRole("switch")).toHaveAttribute("data-state", "checked");
  });

  it("renders a Spinner with its status role and label", () => {
    render(<Spinner label="Deploying" />);

    expect(screen.getByRole("status")).toHaveTextContent("Deploying");
  });

  it("exposes typed variants through the shipped declarations", () => {
    // This file is also compiled by tsc in the verification step, so a broken
    // .d.ts fails the build rather than shipping.
    const variant: React.ComponentProps<typeof Button>["variant"] = "brand";
    const size: React.ComponentProps<typeof Button>["size"] = "lg";

    render(
      <Button variant={variant} size={size}>
        Publish
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Publish" });
    expect(button).toHaveAttribute("data-variant", "brand");
    expect(button).toHaveAttribute("data-size", "lg");
  });

  it("renders the newer components from the published entry point", () => {
    render(
      <div>
        <CopyButton value="npm install @aback-ui/ui" label="Copy install" />
        <ThemeToggle />
        <Rating aria-label="Rate the docs" />
        <Stat label="Launches" value="32" />
        <Steps aria-label="Setup">
          <Step status="current" title="Install" />
        </Steps>
        <AvatarGroup aria-label="Team" max={1}>
          <Avatar>
            <AvatarFallback>AR</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>BK</AvatarFallback>
          </Avatar>
        </AvatarGroup>
        <Dropzone onFilesAccepted={() => {}} label="Upload a file" />
        <InputGroup>
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupInput aria-label="Price" />
        </InputGroup>
        <CodeBlock code="echo ok" language="bash" />
        <RelativeTime date={Date.now() - 3_600_000} locale="en" />
      </div>,
    );

    expect(screen.getByRole("button", { name: "Copy install" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Switch to dark theme" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(5);
    expect(screen.getByRole("list", { name: "Setup" })).toBeInTheDocument();
    expect(screen.getByText("and 1 more")).toBeInTheDocument();
    expect(screen.getByLabelText("Upload a file")).toHaveAttribute("type", "file");
    expect(screen.getByRole("textbox", { name: "Price" })).toBeInTheDocument();
    expect(screen.getByText("1 hour ago")).toBeInTheDocument();
    expect(formatRelativeTime(0, 86_400_000, "en")).toBe("yesterday");
  });
});
