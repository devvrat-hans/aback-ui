import * as React from "react";
import { IconAlertCircle } from "@tabler/icons-react";

import { cn } from "../lib/utils";

/** The attributes Field hands to the control so the label, hint, and error all reach it. */
export interface FieldControlProps {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
  "aria-required"?: true;
}

export interface FieldProps extends Omit<React.ComponentProps<"div">, "children"> {
  /**
   * The control id this field labels. Leave it out and Field wires the control
   * itself: it uses the control's own `id`, or generates one.
   */
  htmlFor?: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  /** Sits at the end of the label row: a copy button, a counter, a "Forgot password?" link. */
  action?: React.ReactNode;
  /** `horizontal` puts the control beside its label, for a checkbox or a switch. */
  orientation?: "vertical" | "horizontal";
  /**
   * The control. Pass a function when the control is wrapped, such as an input
   * inside an InputGroup, and spread the argument onto the control itself.
   */
  children?: React.ReactNode | ((control: FieldControlProps) => React.ReactNode);
}

type ControlElementProps = {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
  "aria-required"?: React.AriaAttributes["aria-required"];
};

function joinIds(...ids: Array<string | false | null | undefined>) {
  const unique = new Set(ids.flatMap((id) => (id ? id.split(/\s+/) : [])).filter(Boolean));
  return unique.size > 0 ? [...unique].join(" ") : undefined;
}

/**
 * A label, hint, and error for one form control. Field links them to the
 * control: the label through `id`, the hint and error through
 * `aria-describedby`, and the error state through `aria-invalid`.
 *
 * Give it the control as its only child and it sets those attributes for you.
 * When the control sits inside a wrapper, pass a function and spread the
 * attributes where they belong. Passing `htmlFor` with a control of another id
 * leaves the control untouched.
 */
function Field({
  htmlFor,
  label,
  description,
  error,
  required,
  action,
  orientation = "vertical",
  className,
  children,
  ...props
}: FieldProps) {
  const generatedId = React.useId();
  const element = React.isValidElement<ControlElementProps>(children) ? children : null;
  const id = htmlFor ?? element?.props.id ?? generatedId;
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  const control: FieldControlProps = {
    id,
    "aria-describedby": joinIds(description ? descriptionId : null, error ? errorId : null),
    "aria-invalid": error ? true : undefined,
    "aria-required": required ? true : undefined,
  };

  let content: React.ReactNode;
  if (typeof children === "function") {
    content = children(control);
  } else if (element && (htmlFor === undefined || element.props.id === htmlFor)) {
    // The child is the control. Whatever it already sets wins; Field only
    // fills in what is missing, and adds its ids to an existing description.
    content = React.cloneElement(element, {
      id,
      "aria-describedby": joinIds(element.props["aria-describedby"], control["aria-describedby"]),
      "aria-invalid": element.props["aria-invalid"] ?? control["aria-invalid"],
      "aria-required": element.props["aria-required"] ?? control["aria-required"],
    });
  } else {
    content = children;
  }

  const horizontal = orientation === "horizontal";

  const labelElement = (
    <label
      htmlFor={id}
      className={cn(
        "flex items-center gap-1 text-sm font-medium text-foreground",
        horizontal ? "leading-5" : "leading-none",
      )}
    >
      {label}
      {required ? (
        <span aria-hidden="true" className="text-destructive">
          *
        </span>
      ) : null}
    </label>
  );

  const descriptionElement = description ? (
    <p id={descriptionId} className="text-xs leading-relaxed text-muted-foreground">
      {description}
    </p>
  ) : null;

  const errorElement = error ? (
    <p
      id={errorId}
      role="alert"
      className="flex items-start gap-1.5 text-xs font-medium leading-relaxed text-danger"
    >
      <IconAlertCircle aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
      {error}
    </p>
  ) : null;

  if (horizontal) {
    return (
      <div
        data-slot="field"
        data-orientation="horizontal"
        className={cn("flex items-start gap-2.5", className)}
        {...props}
      >
        {/* One text line tall, so a checkbox or switch centres on the label. */}
        <div data-slot="field-control" className="flex h-5 shrink-0 items-center">
          {content}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {labelElement}
          {descriptionElement}
          {errorElement}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    );
  }

  return (
    <div
      data-slot="field"
      data-orientation="vertical"
      className={cn("flex flex-col gap-1.5", className)}
      {...props}
    >
      {action ? (
        <div className="flex min-h-5 flex-wrap items-center justify-between gap-x-3 gap-y-1">
          {labelElement}
          <div className="flex shrink-0 items-center gap-1">{action}</div>
        </div>
      ) : (
        labelElement
      )}
      {content}
      {descriptionElement}
      {errorElement}
    </div>
  );
}

export { Field };
