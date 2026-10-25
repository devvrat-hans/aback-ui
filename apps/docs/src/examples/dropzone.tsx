"use client";

import { useState } from "react";
import { IconFile, IconX } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Dropzone, formatFileSize, type FileRejection } from "@/components/ui/dropzone";

const MAX_SIZE = 5 * 1024 * 1024;

const reasons: Record<FileRejection["reason"], string> = {
  type: "is not a PNG, JPG, or PDF",
  size: "is larger than 5 MB",
  count: "is over the three-file limit",
};

export function DropzoneExample() {
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState("");

  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <Dropzone
        accept="image/png,image/jpeg,.pdf"
        multiple
        maxFiles={3}
        maxSize={MAX_SIZE}
        label="Drop invoices here"
        hint="PNG, JPG, or PDF. Up to three files, 5 MB each."
        onFilesAccepted={(accepted) => {
          setFiles((current) => [...current, ...accepted].slice(0, 3));
          setMessage(`${accepted.length} file${accepted.length === 1 ? "" : "s"} added.`);
        }}
        onFilesRejected={(rejected) => {
          setMessage(rejected.map(({ file, reason }) => `${file.name} ${reasons[reason]}.`).join(" "));
        }}
      />

      <p role="status" className="min-h-5 text-xs text-muted-foreground">
        {message}
      </p>

      {files.length ? (
        <ul aria-label="Selected files" className="flex flex-col gap-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 border border-border bg-muted/30 p-3"
            >
              <IconFile aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{file.name}</span>
              <span className="text-xs tabular-nums text-muted-foreground">
                {formatFileSize(file.size)}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Remove ${file.name}`}
                onClick={() => setFiles((current) => current.filter((_, i) => i !== index))}
              >
                <IconX aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
