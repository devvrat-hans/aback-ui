import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { CodeBlock } from "./code-block.js";

const source = `import { Button } from "@/components/ui/button";\n\nexport function Save() {\n  return <Button>Save</Button>;\n}\n`;

describe("CodeBlock", () => {
  it("renders the source as text in a named, focusable region", () => {
    render(<CodeBlock code={source} filename="save.tsx" language="tsx" />);
    const region = screen.getByLabelText("save.tsx source");
    expect(region.tagName).toBe("PRE");
    expect(region).toHaveAttribute("tabindex", "0");
    expect(region).toHaveTextContent("return <Button>Save</Button>;");
    expect(screen.getByText("tsx")).toBeInTheDocument();
  });

  it("copies the exact source", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn(() => Promise.resolve());
    render(<CodeBlock code={source} showLineNumbers />);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });

    await user.click(screen.getByRole("button", { name: "Copy code" }));
    expect(writeText).toHaveBeenCalledWith(source);
  });

  it("numbers lines without adding numbers to the text", () => {
    const { container } = render(<CodeBlock code={"one\ntwo\nthree\n"} showLineNumbers />);
    const lines = container.querySelectorAll("code > span");
    expect(lines).toHaveLength(3);
    expect(container.querySelector("code")).toHaveTextContent(/^onetwothree$/);
  });

  it("can omit the copy button and caption", () => {
    const { container } = render(<CodeBlock code="echo ok" copyable={false} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(container.querySelector("figcaption")).not.toBeInTheDocument();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<CodeBlock code={source} filename="save.tsx" language="tsx" />);
    await expectNoA11yViolations(container);
  });
});
