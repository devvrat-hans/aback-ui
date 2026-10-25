"use client";

import * as React from "react";
import { IconUpload } from "@tabler/icons-react";

import { cn } from "../lib/utils";

export type FileRejectionReason = "type" | "size" | "count";

export interface FileRejection {
  file: File;
  reason: FileRejectionReason;
}

/**
 * True when a file satisfies an `accept` string in the same syntax as the
 * native input: extensions (".pdf"), exact MIME types ("image/png"), and
 * wildcards ("image/*"). The picker filters by `accept`, but dropped files do
 * not, so every file is checked here before it is reported as accepted.
 */
function fileMatchesAccept(file: File, accept?: string) {
  if (!accept) return true;
  const tokens = accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
  if (tokens.length === 0) return true;

  const name = file.name.toLowerCase();
  const type = (file.type || "").toLowerCase();
  return tokens.some((token) => {
    if (token.startsWith(".")) return name.endsWith(token);
    if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
}

/** "980 B", "14.2 KB", "3.1 MB". Uses 1024-based units, like file managers. */
function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`;
}

export interface DropzoneProps
  extends Omit<React.ComponentProps<"div">, "onDrop" | "onChange" | "children"> {
  /** Called with the files that passed type, size, and count checks. */
  onFilesAccepted: (files: File[]) => void;
  /** Called with each refused file and the reason, so the page can explain it. */
  onFilesRejected?: (rejections: FileRejection[]) => void;
  /** Accepted types, in native `accept` syntax. Checked for dropped files too. */
  accept?: string;
  multiple?: boolean;
  /** Largest accepted file in bytes. */
  maxSize?: number;
  /** Most files accepted from one selection. Defaults to 1 unless `multiple`. */
  maxFiles?: number;
  disabled?: boolean;
  /** Primary line, also the input's accessible name. */
  label?: React.ReactNode;
  /** Secondary line under the label. */
  description?: React.ReactNode;
  /** Formats and limits, such as "PNG or JPG, up to 10 MB". Announced as the description. */
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  /** Props for the underlying file input, such as `id`, `name`, or `aria-describedby`. */
  inputProps?: Omit<
    React.ComponentProps<"input">,
    "type" | "accept" | "multiple" | "disabled" | "onChange"
  >;
}

/**
 * A drag-and-drop area backed by a real file input. The input is visually
 * hidden but stays focusable, so Tab reaches it, Enter or Space opens the
 * picker, and the frame shows the focus ring. Files are validated the same way
 * whether they were dropped or picked.
 */
function Dropzone({
  onFilesAccepted,
  onFilesRejected,
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  disabled = false,
  label = "Drop a file here",
  description = "or click to browse",
  hint,
  icon,
  inputProps,
  className,
  ...props
}: DropzoneProps) {
  const generatedId = React.useId();
  const inputId = inputProps?.id ?? `${generatedId}-input`;
  const labelId = `${generatedId}-label`;
  const descriptionId = `${generatedId}-description`;
  const hintId = `${generatedId}-hint`;
  const [dragging, setDragging] = React.useState(false);
  const depth = React.useRef(0);

  const limit = maxFiles ?? (multiple ? Number.POSITIVE_INFINITY : 1);

  function handleFiles(list: FileList | File[] | null) {
    if (!list || disabled) return;
    const files = Array.from(list);
    const accepted: File[] = [];
    const rejected: FileRejection[] = [];

    for (const file of files) {
      if (!fileMatchesAccept(file, accept)) {
        rejected.push({ file, reason: "type" });
      } else if (maxSize !== undefined && file.size > maxSize) {
        rejected.push({ file, reason: "size" });
      } else if (accepted.length >= limit) {
        rejected.push({ file, reason: "count" });
      } else {
        accepted.push(file);
      }
    }

    if (accepted.length > 0) onFilesAccepted(accepted);
    if (rejected.length > 0) onFilesRejected?.(rejected);
  }

  function handleDragEnter(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (disabled) return;
    depth.current += 1;
    setDragging(true);
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (disabled) return;
    event.dataTransfer.dropEffect = "copy";
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    depth.current = Math.max(0, depth.current - 1);
    if (depth.current === 0) setDragging(false);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    depth.current = 0;
    setDragging(false);
    handleFiles(event.dataTransfer.files);
  }

  const describedBy = [
    description ? descriptionId : null,
    hint ? hintId : null,
    inputProps?.["aria-describedby"],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      data-slot="dropzone"
      data-dragging={dragging ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 border-dashed border-muted-foreground/25 bg-background transition-colors duration-200",
        "has-[input:focus-visible]:border-solid has-[input:focus-visible]:border-focus-ring",
        "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-focus-ring has-[input:focus-visible]:ring-offset-2 has-[input:focus-visible]:ring-offset-background",
        !disabled && "hover:border-primary-300 hover:bg-muted/50 dark:hover:border-primary-600",
        dragging && "border-primary-500 bg-brand-wash",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
      {...props}
    >
      <input
        {...inputProps}
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        aria-labelledby={labelId}
        aria-describedby={describedBy || undefined}
        className={cn("sr-only", inputProps?.className)}
        onChange={(event) => {
          handleFiles(event.target.files);
          // Clear the value so choosing the same file again fires a change.
          event.target.value = "";
        }}
      />
      <label
        htmlFor={inputId}
        className={cn(
          "flex flex-col items-center gap-3 p-8 text-center",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
        )}
      >
        <span
          aria-hidden="true"
          className="flex size-12 items-center justify-center bg-brand-chip text-brand-icon [&_svg]:size-6"
        >
          {icon ?? <IconUpload />}
        </span>
        <span className="flex flex-col gap-1">
          <span id={labelId} className="text-sm font-medium text-foreground">
            {label}
          </span>
          {description ? (
            <span id={descriptionId} className="text-sm text-muted-foreground">
              {description}
            </span>
          ) : null}
        </span>
        {hint ? (
          <span id={hintId} className="text-xs text-muted-foreground">
            {hint}
          </span>
        ) : null}
      </label>
    </div>
  );
}

export { Dropzone, fileMatchesAccept, formatFileSize };
