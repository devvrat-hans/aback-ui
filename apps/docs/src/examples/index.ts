import type { ComponentType } from "react";

import { AccordionExample } from "./accordion";
import { AlertExample } from "./alert";
import { BadgeExample } from "./badge";
import { BreadcrumbsExample } from "./breadcrumbs";
import { ButtonExample } from "./button";
import { CardExample } from "./card";
import { CheckboxExample } from "./checkbox";
import { DialogExample } from "./dialog";
import { DropdownMenuExample } from "./dropdown-menu";
import { EmptyStateExample } from "./empty-state";
import { FieldExample } from "./field";
import { InputExample } from "./input";
import { KbdExample } from "./kbd";
import { LabelExample } from "./label";
import { PageHeaderExample } from "./page-header";
import { SelectExample } from "./select";
import { SeparatorExample } from "./separator";
import { SkeletonExample } from "./skeleton";
import { SpinnerExample } from "./spinner";
import { SwitchExample } from "./switch";
import { TableExample } from "./table";
import { TabsExample } from "./tabs";
import { TextareaExample } from "./textarea";
import { TooltipExample } from "./tooltip";

export const exampleMap: Record<string, ComponentType> = {
  accordion: AccordionExample,
  alert: AlertExample,
  badge: BadgeExample,
  breadcrumbs: BreadcrumbsExample,
  button: ButtonExample,
  card: CardExample,
  checkbox: CheckboxExample,
  dialog: DialogExample,
  "dropdown-menu": DropdownMenuExample,
  "empty-state": EmptyStateExample,
  field: FieldExample,
  input: InputExample,
  kbd: KbdExample,
  label: LabelExample,
  "page-header": PageHeaderExample,
  select: SelectExample,
  separator: SeparatorExample,
  skeleton: SkeletonExample,
  spinner: SpinnerExample,
  switch: SwitchExample,
  table: TableExample,
  tabs: TabsExample,
  textarea: TextareaExample,
  tooltip: TooltipExample,
};
