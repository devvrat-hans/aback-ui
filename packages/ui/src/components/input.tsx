import * as React from "react";

import { cn } from "../lib/utils";

const inputClassName = [
  "flex h-9 w-full min-w-0 border border-input bg-transparent px-3 py-1 text-sm text-foreground shadow-xs",
  "outline-none transition-[color,background-color,border-color,box-shadow] duration-200",
  "placeholder:text-muted-foreground",
  "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
  "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
  "dark:bg-input/30",
].join(" ");

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  function Input({ className, type, ...props }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="input"
        className={cn(inputClassName, className)}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input, inputClassName };
