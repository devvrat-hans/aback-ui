export interface ApiRow {
  prop: string;
  type: string;
  defaultValue?: string;
  description: string;
}

export interface KeyboardRow {
  key: string;
  action: string;
}

export interface ComponentDoc {
  api: ApiRow[];
  accessibility: string[];
  keyboard?: KeyboardRow[];
  related: string[];
  note?: string;
}

export const componentDocs: Record<string, ComponentDoc> = {
  accordion: {
    api: [
      {
        prop: "type",
        type: '"single" | "multiple"',
        description: "Whether one or several panels can be open at once. Required.",
      },
      {
        prop: "collapsible",
        type: "boolean",
        defaultValue: "false",
        description: "In single mode, allows the open panel to close when activated again.",
      },
      {
        prop: "defaultValue",
        type: "string | string[]",
        description: "Panels open on first render in uncontrolled mode.",
      },
      {
        prop: "value / onValueChange",
        type: "string | string[] / (value) => void",
        description: "Controlled open state. Use either the uncontrolled or controlled API.",
      },
      {
        prop: "forceMount",
        type: "boolean",
        description:
          "On AccordionContent, keeps closed answers in the DOM for SEO. Pair with hidden styling.",
      },
    ],
    accessibility: [
      "Each trigger is a real button inside a heading, with aria-expanded and aria-controls managed by Radix.",
      "The trigger order forms a single tab stop; arrow keys, Home, and End move between headers.",
      "Closed content is unmounted by default. Pass forceMount when the answer must exist in the initial HTML.",
      "The chevron is decorative and hidden from assistive technology; the label alone names the control.",
    ],
    keyboard: [
      { key: "Enter / Space", action: "Toggle the focused panel." },
      { key: "ArrowDown / ArrowUp", action: "Move focus to the next or previous header." },
      { key: "Home / End", action: "Move focus to the first or last header." },
    ],
    related: ["tabs", "card", "dialog"],
    note:
      "Avoid fixed max heights on answers. The content animates from its measured height so long localized text is never clipped.",
  },
  alert: {
    api: [
      {
        prop: "variant",
        type: '"info" | "success" | "warning" | "destructive" | "muted"',
        defaultValue: '"info"',
        description: "Sets the semantic tone and surface. It never changes the accessible role.",
      },
      {
        prop: "role",
        type: '"alert" | "status"',
        description:
          "Set explicitly. Use alert for an error that interrupts, and status for a confirmation.",
      },
      {
        prop: "className",
        type: "string",
        description: "Layout adjustments only. Do not override the semantic colors.",
      },
    ],
    accessibility: [
      "Every variant pairs color with an icon and a visible title, so meaning is never carried by hue alone.",
      "Error messages should use role alert and sit next to the control or action that caused them.",
      "A static informational alert needs no live role; adding one announces content on first paint.",
      "Description text inherits the variant color, which meets AA on its tinted surface.",
    ],
    related: ["badge", "field", "dialog"],
  },
  badge: {
    api: [
      {
        prop: "variant",
        type: '"default" | "secondary" | "outline" | "brand" | "success" | "warning" | "destructive" | "muted"',
        defaultValue: '"secondary"',
        description: "Semantic label style. Success and warning include a matching surface.",
      },
      {
        prop: "className",
        type: "string",
        description: "Use for a mono registry type or similar metadata treatment.",
      },
    ],
    accessibility: [
      "A badge is a label, not a control. It has no hover state and no keyboard behavior.",
      "Keep the text meaningful without the color, since color is supplementary.",
      "For a status that changes, wrap the badge in a live region or pair it with visible text.",
      "Do not put an icon-only badge in place of a labeled action.",
    ],
    related: ["card", "alert", "table"],
  },
  breadcrumbs: {
    api: [
      {
        prop: "items",
        type: "BreadcrumbItem[]",
        description: "Ordered trail. The last item renders as the current page.",
      },
      {
        prop: "aria-label",
        type: "string",
        defaultValue: '"Breadcrumb"',
        description: "Names the navigation landmark.",
      },
      {
        prop: "className",
        type: "string",
        description: "Layout adjustments only.",
      },
    ],
    accessibility: [
      "Renders nav and ol semantics, with a chevron separator hidden from assistive technology.",
      "The final item uses aria-current=page and is not a link, even if an href is supplied.",
      "The component uses native anchors so it works in any framework. Swap in your router link for client-side navigation.",
      "Place breadcrumbs directly below the page H1, not above it.",
    ],
    related: ["page-header", "tabs"],
  },
  button: {
    api: [
      {
        prop: "variant",
        type: '"default" | "brand" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
        defaultValue: '"default"',
        description: "default is neutral ink. brand is Aback Blue and is reserved for brand actions.",
      },
      {
        prop: "size",
        type: '"xs" | "sm" | "default" | "lg" | "icon" | "icon-sm" | "icon-xs" | "icon-lg"',
        defaultValue: '"default"',
        description: "Controls height, padding, and icon size on the 36px control grid.",
      },
      {
        prop: "asChild",
        type: "boolean",
        defaultValue: "false",
        description: "Renders the child element with button styles, typically a link.",
      },
      {
        prop: "type",
        type: '"button" | "submit" | "reset"',
        defaultValue: "Native default",
        description: "Set submit explicitly on form actions. Native buttons submit inside a form.",
      },
      {
        prop: "disabled",
        type: "boolean",
        description: "Removes pointer events and reduces opacity. Prefer explaining why when possible.",
      },
    ],
    accessibility: [
      "Renders a real button unless asChild is used, so Enter and Space both activate it.",
      "Icon-only sizes require an aria-label; the icon itself is hidden from assistive technology.",
      "Focus uses a two-pixel brand ring with an offset on both themes.",
      "Disabled buttons are removed from interaction but remain readable. Do not use disabled as a validation message.",
    ],
    related: ["input", "field", "dialog"],
  },
  card: {
    api: [
      {
        prop: "CardTitle as",
        type: '"h2" | "h3" | "h4"',
        defaultValue: '"h3"',
        description: "Keeps the heading order correct without changing the visual style.",
      },
      {
        prop: "CardHeader / CardContent / CardFooter",
        type: "div",
        description: "Layout slots. Header and content use 24px page insets.",
      },
      {
        prop: "className",
        type: "string",
        description: "Layout adjustments only. Borders and shadow come from the system.",
      },
    ],
    accessibility: [
      "A card is a visual grouping, not a landmark. Do not add role region without a label.",
      "CardTitle renders a real heading. Choose the level that continues the page outline.",
      "Interactive cards should put the link on a real anchor inside the title, not on the whole div.",
      "Keep one clear action hierarchy per card; do not place two subtle ghost actions side by side.",
    ],
    related: ["badge", "alert", "table"],
  },
  checkbox: {
    api: [
      {
        prop: "checked",
        type: "boolean | \"indeterminate\"",
        description: "Controlled state. Use defaultChecked for uncontrolled usage.",
      },
      {
        prop: "onCheckedChange",
        type: "(checked: boolean | \"indeterminate\") => void",
        description: "Fires when the user toggles the control.",
      },
      {
        prop: "disabled",
        type: "boolean",
        description: "Prevents interaction and reduces opacity.",
      },
      {
        prop: "name / value / required",
        type: "string / string / boolean",
        description: "Native form integration through a hidden input managed by Radix.",
      },
    ],
    accessibility: [
      "Radix exposes role checkbox, aria-checked, and keyboard support. Space toggles the value.",
      "Associate a visible Label with htmlFor; clicking the label toggles the box.",
      "Indeterminate is announced as mixed. Use it for a parent selection, not for a third user state.",
      "Focus is visible on the box itself, so the control must not be wrapped in an overflow-hidden label.",
    ],
    keyboard: [
      { key: "Space", action: "Toggle the checkbox." },
      { key: "Tab", action: "Move focus into or out of the control." },
    ],
    related: ["switch", "label", "field"],
  },
  dialog: {
    api: [
      {
        prop: "open / defaultOpen / onOpenChange",
        type: "boolean / boolean / (open: boolean) => void",
        description: "Controlled or uncontrolled visibility.",
      },
      {
        prop: "modal",
        type: "boolean",
        defaultValue: "true",
        description: "Locks background interaction and traps focus while open.",
      },
      {
        prop: "showCloseButton",
        type: "boolean",
        defaultValue: "true",
        description: "On DialogContent, renders the top-right close control.",
      },
      {
        prop: "DialogTitle / DialogDescription",
        type: "component",
        description: "Title is required for the accessible name. Description supplies the accessible description.",
      },
    ],
    accessibility: [
      "Radix traps focus, sets aria-modal, locks page scroll, closes on Escape, and returns focus to the trigger.",
      "Always render DialogTitle. Hide it visually if the design has no title, but never omit the accessible name.",
      "The overlay click closes the dialog. Destructive flows should still require an explicit action in the footer.",
      "The close button is 32px with a visible focus ring and a screen-reader label.",
    ],
    keyboard: [
      { key: "Escape", action: "Close the dialog and return focus to the trigger." },
      { key: "Tab / Shift+Tab", action: "Cycle focus inside the dialog." },
      { key: "Enter", action: "Activate the focused control." },
    ],
    related: ["dropdown-menu", "tooltip", "tabs"],
  },
  "dropdown-menu": {
    api: [
      {
        prop: "open / defaultOpen / onOpenChange",
        type: "boolean / boolean / (open: boolean) => void",
        description: "Controlled or uncontrolled visibility.",
      },
      {
        prop: "DropdownMenuContent align",
        type: '"start" | "center" | "end"',
        defaultValue: '"center"',
        description: "Alignment relative to the trigger.",
      },
      {
        prop: "DropdownMenuItem variant",
        type: '"default" | "destructive"',
        defaultValue: '"default"',
        description: "Destructive items are separated and styled as danger.",
      },
      {
        prop: "DropdownMenuCheckboxItem / RadioItem",
        type: "component",
        description: "Stateful items with an indicator and managed selection.",
      },
    ],
    accessibility: [
      "Uses menu semantics, not a listbox or navigation. Use it for actions, not for page links.",
      "Arrow keys move between items, Home and End jump, typeahead selects by label, Escape closes and returns focus.",
      "Keep a destructive action behind a separator and a clear verb. Never make it the default item.",
      "The trigger must have an accessible name; icon-only triggers need an aria-label.",
    ],
    keyboard: [
      { key: "Enter / Space / ArrowDown", action: "Open the menu and focus the first item." },
      { key: "ArrowUp / ArrowDown", action: "Move focus between items." },
      { key: "Home / End", action: "Jump to the first or last item." },
      { key: "Escape", action: "Close the menu and return focus to the trigger." },
    ],
    related: ["dialog", "button", "tooltip"],
  },
  "empty-state": {
    api: [
      {
        prop: "title",
        type: "ReactNode",
        description: "Short statement of the empty condition.",
      },
      {
        prop: "description",
        type: "ReactNode",
        description: "What will appear and the first step to create it.",
      },
      {
        prop: "icon",
        type: "ReactNode",
        description: "Optional decorative icon. Defaults to an inbox.",
      },
      {
        prop: "action",
        type: "ReactNode",
        description: "The primary next step, usually a Button or link.",
      },
    ],
    accessibility: [
      "The title is a paragraph so it cannot break the page heading order. The surrounding section owns the heading.",
      "The icon is decorative. Do not put meaning in it only.",
      "The action should be the same action named in the description.",
      "Announce a newly emptied list with a status message in addition to rendering the empty state.",
    ],
    related: ["skeleton", "alert", "button"],
  },
  field: {
    api: [
      {
        prop: "htmlFor",
        type: "string",
        description: "The id of the control this field labels. Required.",
      },
      {
        prop: "label",
        type: "ReactNode",
        description: "Visible label text. Required.",
      },
      {
        prop: "description",
        type: "ReactNode",
        description: "Rendered under the control with an id of `{htmlFor}-description`.",
      },
      {
        prop: "error",
        type: "ReactNode",
        description: "Rendered under the control with role alert and an id of `{htmlFor}-error`.",
      },
      {
        prop: "required",
        type: "boolean",
        description: "Adds a decorative asterisk. Also set required on the control.",
      },
    ],
    accessibility: [
      "Field renders the label and associates it with htmlFor. It does not inject props into the control.",
      "When a description or error is present, set aria-describedby on the control to the generated id.",
      "Set aria-invalid on the control when error is present; the Input and Select components style it.",
      "Use a visible label. A placeholder is an example, not a label.",
    ],
    related: ["input", "textarea", "select"],
  },
  input: {
    api: [
      {
        prop: "type",
        type: '"text" | "email" | "password" | "number" | ...',
        defaultValue: '"text"',
        description: "Native input type. Use number with inputMode for numeric keyboard hints.",
      },
      {
        prop: "aria-invalid",
        type: "boolean | \"true\" | \"false\"",
        description: "Turns the border destructive and pairs with a Field error.",
      },
      {
        prop: "disabled",
        type: "boolean",
        description: "Prevents interaction and reduces opacity.",
      },
      {
        prop: "className",
        type: "string",
        description: "Layout adjustments only; control height and focus stay on the system grid.",
      },
    ],
    accessibility: [
      "Always pair with a visible Label or Field. Placeholders disappear and are not a substitute.",
      "Error text must be associated through aria-describedby and the control marked aria-invalid.",
      "The control keeps native autofill, form submission, and mobile keyboard behavior.",
      "Do not use opacity on entered text or value text.",
    ],
    related: ["field", "label", "textarea"],
  },
  kbd: {
    api: [
      {
        prop: "children",
        type: "ReactNode",
        description: "The key label, such as Ctrl, K, or Esc.",
      },
      {
        prop: "className",
        type: "string",
        description: "Layout adjustments only.",
      },
    ],
    accessibility: [
      "Renders a real kbd element so assistive technology can identify it.",
      "Always state what the shortcut does in adjacent visible text.",
      "Do not rely on the keycap alone to communicate an action.",
      "Mark decorative keycaps aria-hidden when they only repeat visible text.",
    ],
    related: ["tooltip", "button"],
  },
  label: {
    api: [
      {
        prop: "htmlFor",
        type: "string",
        description: "The control id. Required unless the control is nested inside the label.",
      },
      {
        prop: "className",
        type: "string",
        description: "For example font-normal when the label is a checkbox row.",
      },
    ],
    accessibility: [
      "Renders a native label. Clicking it focuses or toggles the associated control.",
      "Do not use a label as a heading. Use a real heading for structure.",
      "Peer-disabled styling applies when the control is disabled, but the label remains readable.",
      "Keep labels visible; do not replace them with placeholder text.",
    ],
    related: ["input", "field", "checkbox"],
  },
  "page-header": {
    api: [
      {
        prop: "title",
        type: "ReactNode",
        description: "Rendered as the page's single h1. Required.",
      },
      {
        prop: "description",
        type: "ReactNode",
        description: "One or two sentences that state the outcome of the page.",
      },
      {
        prop: "eyebrow",
        type: "ReactNode",
        description: "Optional uppercase context label above the title.",
      },
      {
        prop: "actions",
        type: "ReactNode",
        description: "Primary and secondary actions for the page.",
      },
      {
        prop: "as",
        type: '"h1" | "h2" | "h3"',
        defaultValue: '"h1"',
        description:
          "Heading element for the title. Use the default on a page, or h2 in a section or preview that already has a page heading.",
      },
    ],
    accessibility: [
      "Renders one heading at the level you choose. A page should contain exactly one h1.",
      "Breadcrumbs belong below the header, not inside it.",
      "Actions are rendered in source order, which is also the keyboard order.",
      "Keep the description factual and under roughly three lines at desktop width.",
    ],
    related: ["breadcrumbs", "card", "empty-state"],
  },
  select: {
    api: [
      {
        prop: "defaultValue / value / onChange",
        type: "native select props",
        description: "Controlled or uncontrolled native selection.",
      },
      {
        prop: "disabled",
        type: "boolean",
        description: "Prevents interaction and reduces opacity.",
      },
      {
        prop: "aria-invalid",
        type: "boolean | \"true\" | \"false\"",
        description: "Styles the border as destructive and pairs with a Field error.",
      },
      {
        prop: "className",
        type: "string",
        description: "Width and layout adjustments.",
      },
    ],
    accessibility: [
      "Renders a real select, so screen readers, mobile pickers, and keyboard behavior are native.",
      "Always use a visible label. An unlabeled select is not fixed by a placeholder option.",
      "Use optgroup for long lists and keep option labels short and unambiguous.",
      "A native select is not a combobox. If you need search, use a command menu rather than recreating one here.",
    ],
    keyboard: [
      { key: "Space / Enter", action: "Open the native picker." },
      { key: "ArrowUp / ArrowDown", action: "Change the selected option." },
      { key: "Escape", action: "Close the picker without changing the value." },
    ],
    related: ["field", "label", "input"],
  },
  separator: {
    api: [
      {
        prop: "orientation",
        type: '"horizontal" | "vertical"',
        defaultValue: '"horizontal"',
        description: "Direction of the rule.",
      },
      {
        prop: "decorative",
        type: "boolean",
        defaultValue: "true",
        description: "Removes the separator from the accessibility tree when it is purely visual.",
      },
      {
        prop: "className",
        type: "string",
        description: "Spacing adjustments only.",
      },
    ],
    accessibility: [
      "With decorative set to false, Radix exposes role separator and the orientation.",
      "Use the separator token for page chrome and the hairline for content dividers.",
      "Never draw two adjacent one-pixel rules; use divide-y lists instead.",
      "A separator is not a spacing utility. Use gap or padding for rhythm.",
    ],
    related: ["card", "table", "tabs"],
  },
  skeleton: {
    api: [
      {
        prop: "className",
        type: "string",
        description: "Set the size and shape to match the content that will replace it.",
      },
      {
        prop: "aria-hidden",
        type: "boolean",
        defaultValue: "true",
        description: "The placeholder is hidden from assistive technology.",
      },
    ],
    accessibility: [
      "Skeletons are decorative. Announce loading on the parent with aria-busy and a status message.",
      "Reserve the final layout size so content does not jump when it arrives.",
      "Do not leave a skeleton on screen indefinitely; show an error or empty state when loading ends.",
      "Pair pulse animation with reduced-motion handling, which the theme applies globally.",
    ],
    related: ["spinner", "empty-state", "card"],
  },
  spinner: {
    api: [
      {
        prop: "size",
        type: '"sm" | "md" | "lg"',
        defaultValue: '"md"',
        description: "16, 20, or 24 pixel indicator.",
      },
      {
        prop: "label",
        type: "string",
        defaultValue: '"Loading"',
        description: "Screen-reader text. Make it specific: Saving, Deploying, Loading invoices.",
      },
      {
        prop: "className",
        type: "string",
        description: "Color and layout adjustments, for example text-primary-foreground in a button.",
      },
    ],
    accessibility: [
      "Renders role status with a visually hidden label, so the loading state is announced.",
      "Use a specific label. Generic Loading gives no useful context.",
      "Inside a button, keep the visible verb and disable the button while the action runs.",
      "Do not animate indefinitely after a failure; replace the spinner with a message.",
    ],
    related: ["skeleton", "button", "alert"],
  },
  switch: {
    api: [
      {
        prop: "checked / defaultChecked",
        type: "boolean",
        description: "Controlled or uncontrolled on state.",
      },
      {
        prop: "onCheckedChange",
        type: "(checked: boolean) => void",
        description: "Fires when the user toggles the control.",
      },
      {
        prop: "disabled",
        type: "boolean",
        description: "Prevents interaction and reduces opacity.",
      },
      {
        prop: "name / value / required",
        type: "string / string / boolean",
        description: "Native form integration through a hidden input managed by Radix.",
      },
    ],
    accessibility: [
      "Radix exposes role switch and aria-checked, and Space or Enter toggles it.",
      "Use a switch for a setting that takes effect immediately, not for a form choice that needs saving.",
      "Pair with a visible Label and, where useful, a description of the effect.",
      "The state is conveyed by thumb position and aria-checked, not by color alone.",
    ],
    keyboard: [
      { key: "Enter / Space", action: "Toggle the switch." },
      { key: "Tab", action: "Move focus into or out of the control." },
    ],
    related: ["checkbox", "label", "field"],
  },
  table: {
    api: [
      {
        prop: "TableCaption",
        type: "component",
        description: "A visible caption that also names the table for assistive technology.",
      },
      {
        prop: "TableHead scope",
        type: '"col" | "row"',
        defaultValue: '"col"',
        description: "Set to row for a table whose first cell in each row is a header.",
      },
      {
        prop: "containerProps",
        type: "React.ComponentProps<'div'>",
        description:
          "Props for the scroll container. Pass an aria-label to name a horizontally scrollable region.",
      },
      {
        prop: "className",
        type: "string",
        description: "Column width and alignment adjustments.",
      },
    ],
    accessibility: [
      "Use a caption or a nearby heading to name the table. A table without a name is hard to navigate.",
      "Keep header cells in thead and set scope row when the first column identifies each row.",
      "The scroll container is keyboard focusable so wide tables can be scrolled without a pointer.",
      "Do not use table layout for page structure. Use CSS grid or flex instead.",
      "Numbers belong in tabular-nums cells and should be right aligned with their header.",
    ],
    related: ["badge", "card", "empty-state"],
  },
  tabs: {
    api: [
      {
        prop: "defaultValue / value / onValueChange",
        type: "string / string / (value: string) => void",
        description: "Controlled or uncontrolled selected tab.",
      },
      {
        prop: "orientation",
        type: '"horizontal" | "vertical"',
        defaultValue: '"horizontal"',
        description: "Arrow-key direction. Also set aria-orientation on the list.",
      },
      {
        prop: "TabsTrigger value",
        type: "string",
        description: "Matches the corresponding TabsContent value. Required.",
      },
      {
        prop: "disabled",
        type: "boolean",
        description: "On TabsTrigger, removes it from the tab order.",
      },
    ],
    accessibility: [
      "Radix manages tablist, tab, and tabpanel roles, aria-selected, and aria-controls.",
      "Arrow keys move between tabs, Home and End jump to the ends, and activation follows focus.",
      "Give the tab list an accessible name with aria-label so it is distinguishable from other tab groups.",
      "Only the selected panel is rendered, so do not hide essential page content behind a tab.",
    ],
    keyboard: [
      { key: "ArrowLeft / ArrowRight", action: "Move between horizontal tabs." },
      { key: "ArrowUp / ArrowDown", action: "Move between vertical tabs." },
      { key: "Home / End", action: "Move to the first or last tab." },
    ],
    related: ["accordion", "card", "dialog"],
  },
  textarea: {
    api: [
      {
        prop: "rows",
        type: "number",
        description: "Initial visible height. The control still resizes vertically.",
      },
      {
        prop: "aria-invalid",
        type: "boolean | \"true\" | \"false\"",
        description: "Turns the border destructive and pairs with a Field error.",
      },
      {
        prop: "disabled",
        type: "boolean",
        description: "Prevents interaction and reduces opacity.",
      },
      {
        prop: "className",
        type: "string",
        description: "Width and minimum height adjustments.",
      },
    ],
    accessibility: [
      "Pair with a visible Label or Field, and associate descriptions and errors with aria-describedby.",
      "The control resizes vertically only, so horizontal layout is never broken.",
      "Use font-mono only when the content is code or data, not for ordinary prose.",
      "Set a sensible maxLength and show a remaining character count when the limit matters.",
    ],
    related: ["input", "field", "label"],
  },
  tooltip: {
    api: [
      {
        prop: "delayDuration",
        type: "number",
        defaultValue: "200",
        description: "Milliseconds before the tooltip appears.",
      },
      {
        prop: "side / align / sideOffset",
        type: "Radix placement props",
        defaultValue: 'sideOffset="6"',
        description: "Position relative to the trigger.",
      },
      {
        prop: "TooltipContent",
        type: "component",
        description: "The short label. Render through a portal so it escapes overflow.",
      },
    ],
    accessibility: [
      "The tooltip is supplementary. The trigger still needs its own accessible name.",
      "Focus or hover reveals it, and Escape dismisses it without moving focus.",
      "Never put interactive content or essential instructions in a tooltip.",
      "Keep the label short and match the visible action verb.",
    ],
    keyboard: [
      { key: "Tab", action: "Focus the trigger and reveal the tooltip." },
      { key: "Escape", action: "Dismiss the tooltip while focus stays on the trigger." },
    ],
    related: ["button", "dialog", "dropdown-menu"],
  },
};
