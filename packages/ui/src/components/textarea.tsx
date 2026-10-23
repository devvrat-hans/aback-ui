import * as React from "react";

import { cn } from "../lib/utils";

const textareaClassName = [
  "flex min-h-20 w-full resize-y border border-input bg-transparent p-3 text-sm text-foreground shadow-xs",
  "outline-none transition-[color,background-color,border-color,box-shadow] duration-200",
  "placeholder:text-muted-foreground",
  "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
  "dark:bg-input/30",
].join(" ");

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      className={cn(textareaClassName, className)}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea, textareaClassName };
