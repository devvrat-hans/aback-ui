"use client";

import { useState } from "react";
import {
  IconArrowRight,
  IconBolt,
  IconDeviceLaptop,
  IconFileTypePdf,
  IconLock,
  IconPhoto,
  IconX,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

const features = [
  { icon: IconLock, title: "Private by default", text: "Files are processed on your device and never uploaded." },
  { icon: IconBolt, title: "No waiting", text: "Results appear as soon as the file is read." },
  { icon: IconDeviceLaptop, title: "Works offline", text: "Once the page has loaded, the tool needs no connection." },
];

const links = [
  { href: "/docs/components/meter", icon: IconPhoto, title: "Image resizer", text: "Resize a photo to exact pixel dimensions." },
  { href: "/docs/components/panel", icon: IconFileTypePdf, title: "PDF merger", text: "Combine several PDF files into one document." },
];

const initialFiles = [
  { name: "holiday-photo.png", size: "2.4 MB" },
  { name: "invoice-october.pdf", size: "184 KB" },
];

export function ItemExample() {
  const [files, setFiles] = useState(initialFiles);

  return (
    <div className="flex w-full max-w-xl flex-col gap-8">
      <ul className="grid gap-6 sm:grid-cols-2">
        {features.map(({ icon: Icon, title, text }) => (
          <Item key={title} asChild>
            <li>
              <ItemMedia>
                <Icon aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle as="h3">{title}</ItemTitle>
                <ItemDescription>{text}</ItemDescription>
              </ItemContent>
            </li>
          </Item>
        ))}
      </ul>

      <div className="grid gap-3 sm:grid-cols-2">
        {links.map(({ href, icon: Icon, title, text }) => (
          <Item key={title} variant="outline" asChild>
            <a href={href}>
              <ItemMedia variant="icon">
                <Icon aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{title}</ItemTitle>
                <ItemDescription>{text}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <IconArrowRight
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover/item:translate-x-0.5 motion-reduce:transition-none"
                />
              </ItemActions>
            </a>
          </Item>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {files.length === 0 ? (
          <p className="border border-border bg-muted/10 p-4 text-sm text-muted-foreground">
            No files in the queue.{" "}
            <button
              type="button"
              className="font-medium text-link underline underline-offset-4 hover:text-link-hover"
              onClick={() => setFiles(initialFiles)}
            >
              Restore the example files
            </button>
          </p>
        ) : (
          files.map((file) => (
            <Item key={file.name} variant="muted" size="sm" align="center">
              <ItemContent className="gap-0">
                <ItemTitle className="truncate">{file.name}</ItemTitle>
                <ItemDescription className="tabular-nums">{file.size}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => setFiles((current) => current.filter((entry) => entry.name !== file.name))}
                >
                  <IconX aria-hidden="true" />
                </Button>
              </ItemActions>
            </Item>
          ))
        )}
      </div>
    </div>
  );
}
