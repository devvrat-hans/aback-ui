import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Dropzone, fileMatchesAccept, formatFileSize } from "./dropzone.js";

function file(name: string, type: string, size = 10) {
  const value = new File(["x".repeat(Math.min(size, 64))], name, { type });
  Object.defineProperty(value, "size", { value: size });
  return value;
}

describe("Dropzone", () => {
  it("labels the file input with the visible text", () => {
    render(
      <Dropzone
        onFilesAccepted={() => {}}
        label="Upload a logo"
        hint="PNG or SVG, up to 2 MB"
      />,
    );
    const input = screen.getByLabelText("Upload a logo");
    expect(input).toHaveAttribute("type", "file");
    expect(input).toHaveAccessibleDescription("or click to browse PNG or SVG, up to 2 MB");
  });

  it("accepts a picked file", async () => {
    const user = userEvent.setup();
    const onFilesAccepted = vi.fn();
    render(<Dropzone onFilesAccepted={onFilesAccepted} accept="image/*" label="Image" />);

    const png = file("logo.png", "image/png");
    await user.upload(screen.getByLabelText("Image"), png);

    expect(onFilesAccepted).toHaveBeenCalledWith([png]);
  });

  it("validates dropped files by type, size, and count", () => {
    const onFilesAccepted = vi.fn();
    const onFilesRejected = vi.fn();
    const { container } = render(
      <Dropzone
        onFilesAccepted={onFilesAccepted}
        onFilesRejected={onFilesRejected}
        accept=".pdf,image/*"
        maxSize={100}
        multiple
        maxFiles={2}
      />,
    );

    const a = file("a.pdf", "application/pdf");
    const b = file("b.png", "image/png");
    const tooBig = file("c.png", "image/png", 500);
    const wrongType = file("d.txt", "text/plain");
    const extra = file("e.jpg", "image/jpeg");

    const zone = container.querySelector("[data-slot='dropzone']")!;
    fireEvent.drop(zone, { dataTransfer: { files: [a, b, tooBig, wrongType, extra] } });

    expect(onFilesAccepted).toHaveBeenCalledWith([a, b]);
    expect(onFilesRejected).toHaveBeenCalledWith([
      { file: tooBig, reason: "size" },
      { file: wrongType, reason: "type" },
      { file: extra, reason: "count" },
    ]);
  });

  it("marks the drag state and ignores drops while disabled", () => {
    const onFilesAccepted = vi.fn();
    const { container, rerender } = render(<Dropzone onFilesAccepted={onFilesAccepted} />);
    const zone = container.querySelector("[data-slot='dropzone']")!;

    fireEvent.dragEnter(zone, { dataTransfer: { files: [] } });
    expect(zone).toHaveAttribute("data-dragging");
    fireEvent.dragLeave(zone, { dataTransfer: { files: [] } });
    expect(zone).not.toHaveAttribute("data-dragging");

    rerender(<Dropzone onFilesAccepted={onFilesAccepted} disabled />);
    fireEvent.drop(zone, { dataTransfer: { files: [file("a.png", "image/png")] } });
    expect(onFilesAccepted).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Drop a file here")).toBeDisabled();
  });

  it("matches accept tokens and formats sizes", () => {
    expect(fileMatchesAccept(file("photo.JPG", "image/jpeg"), "image/*")).toBe(true);
    expect(fileMatchesAccept(file("notes.md", ""), ".md")).toBe(true);
    expect(fileMatchesAccept(file("notes.md", "text/markdown"), "application/pdf")).toBe(false);
    expect(formatFileSize(980)).toBe("980 B");
    expect(formatFileSize(14_540)).toBe("14 KB");
    expect(formatFileSize(3_250_000)).toBe("3.1 MB");
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <Dropzone onFilesAccepted={() => {}} hint="Any file up to 10 MB" />,
    );
    await expectNoA11yViolations(container);
  });
});
