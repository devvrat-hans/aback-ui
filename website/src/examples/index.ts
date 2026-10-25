import type { ComponentType } from "react";

import { AccordionExample } from "./accordion";
import { AlertExample } from "./alert";
import { AlertDialogExample } from "./alert-dialog";
import { AvatarExample } from "./avatar";
import { BadgeExample } from "./badge";
import { BreadcrumbsExample } from "./breadcrumbs";
import { ButtonExample } from "./button";
import { CalendarExample } from "./calendar";
import { CardExample } from "./card";
import { CheckboxExample } from "./checkbox";
import { CodeBlockExample } from "./code-block";
import { CollapsibleExample } from "./collapsible";
import { ComboboxExample } from "./combobox";
import { CommandExample } from "./command";
import { CopyButtonExample } from "./copy-button";
import { DatePickerExample } from "./date-picker";
import { DescriptionListExample } from "./description-list";
import { DialogExample } from "./dialog";
import { DropdownMenuExample } from "./dropdown-menu";
import { DropzoneExample } from "./dropzone";
import { EmptyStateExample } from "./empty-state";
import { FieldExample } from "./field";
import { HoverCardExample } from "./hover-card";
import { InputExample } from "./input";
import { InputGroupExample } from "./input-group";
import { KbdExample } from "./kbd";
import { LabelExample } from "./label";
import { LayoutExample } from "./layout";
import { PageHeaderExample } from "./page-header";
import { PaginationExample } from "./pagination";
import { PopoverExample } from "./popover";
import { ProgressExample } from "./progress";
import { RadioGroupExample } from "./radio-group";
import { RatingExample } from "./rating";
import { ReadingProgressExample } from "./reading-progress";
import { RelativeTimeExample } from "./relative-time";
import { ScrollAreaExample } from "./scroll-area";
import { SectionHeadingExample } from "./section-heading";
import { SelectExample } from "./select";
import { SeparatorExample } from "./separator";
import { ShareButtonsExample } from "./share-buttons";
import { SheetExample } from "./sheet";
import { SkeletonExample } from "./skeleton";
import { SkipLinkExample } from "./skip-link";
import { SliderExample } from "./slider";
import { SpinnerExample } from "./spinner";
import { StatExample } from "./stat";
import { StepsExample } from "./steps";
import { SwitchExample } from "./switch";
import { TableExample } from "./table";
import { TableOfContentsExample } from "./table-of-contents";
import { TabsExample } from "./tabs";
import { TextareaExample } from "./textarea";
import { ThemeToggleExample } from "./theme-toggle";
import { ToastExample } from "./toast";
import { ToggleGroupExample } from "./toggle-group";
import { TooltipExample } from "./tooltip";

export const exampleMap: Record<string, ComponentType> = {
  accordion: AccordionExample,
  alert: AlertExample,
  "alert-dialog": AlertDialogExample,
  avatar: AvatarExample,
  badge: BadgeExample,
  breadcrumbs: BreadcrumbsExample,
  button: ButtonExample,
  calendar: CalendarExample,
  card: CardExample,
  checkbox: CheckboxExample,
  "code-block": CodeBlockExample,
  collapsible: CollapsibleExample,
  combobox: ComboboxExample,
  command: CommandExample,
  "copy-button": CopyButtonExample,
  "date-picker": DatePickerExample,
  "description-list": DescriptionListExample,
  dialog: DialogExample,
  "dropdown-menu": DropdownMenuExample,
  dropzone: DropzoneExample,
  "empty-state": EmptyStateExample,
  field: FieldExample,
  "hover-card": HoverCardExample,
  input: InputExample,
  "input-group": InputGroupExample,
  kbd: KbdExample,
  label: LabelExample,
  layout: LayoutExample,
  "page-header": PageHeaderExample,
  pagination: PaginationExample,
  popover: PopoverExample,
  progress: ProgressExample,
  "radio-group": RadioGroupExample,
  rating: RatingExample,
  "reading-progress": ReadingProgressExample,
  "relative-time": RelativeTimeExample,
  "scroll-area": ScrollAreaExample,
  "section-heading": SectionHeadingExample,
  select: SelectExample,
  separator: SeparatorExample,
  "share-buttons": ShareButtonsExample,
  sheet: SheetExample,
  skeleton: SkeletonExample,
  "skip-link": SkipLinkExample,
  slider: SliderExample,
  spinner: SpinnerExample,
  stat: StatExample,
  steps: StepsExample,
  switch: SwitchExample,
  table: TableExample,
  "table-of-contents": TableOfContentsExample,
  tabs: TabsExample,
  textarea: TextareaExample,
  "theme-toggle": ThemeToggleExample,
  toast: ToastExample,
  "toggle-group": ToggleGroupExample,
  tooltip: TooltipExample,
};
