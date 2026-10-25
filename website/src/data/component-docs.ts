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
  calendar: {
    api: [
      {
        prop: "mode",
        type: '"single" | "multiple" | "range"',
        defaultValue: '"single"',
        description:
          "Selection mode. It also determines the shape of selected and the argument passed to onSelect.",
      },
      {
        prop: "selected / onSelect",
        type: "Date | Date[] | DateRange | undefined / (value) => void",
        description:
          "Controlled selection. In range mode the value is { from, to } and either end may be missing while the visitor is choosing.",
      },
      {
        prop: "defaultMonth / month / onMonthChange",
        type: "Date / Date / (month: Date) => void",
        description:
          "The visible month. Use defaultMonth for an initial month and month for full control, such as a month picker.",
      },
      {
        prop: "disabled",
        type: "Matcher | Matcher[]",
        description:
          "Dates that cannot be selected, for example { before: min } or { dayOfWeek: [0, 6] }. Disabled days remain announced but are not focusable targets for selection.",
      },
      {
        prop: "numberOfMonths",
        type: "number",
        defaultValue: "1",
        description:
          "Months rendered side by side. Two months suit range selection on wide screens; check the narrow layout before using more than two.",
      },
      {
        prop: "captionLayout",
        type: '"label" | "dropdown" | "dropdown-months" | "dropdown-years"',
        defaultValue: '"label"',
        description:
          "Adds month or year dropdowns for jumping across a long range. Keep startMonth and endMonth set so the options stay bounded.",
      },
      {
        prop: "showOutsideDays",
        type: "boolean",
        defaultValue: "true",
        description:
          "Shows the adjacent month's days in the leading and trailing cells. They are styled muted and remain selectable unless disabled.",
      },
      {
        prop: "autoFocus",
        type: "boolean",
        defaultValue: "false",
        description:
          "Moves focus into the grid when the calendar mounts. DatePicker sets this when its popover opens.",
      },
      {
        prop: "classNames / className",
        type: "Partial<ClassNames> / string",
        description:
          "Adjust one slot or add layout around the calendar. Omitted slots keep the Aback token styling.",
      },
    ],
    accessibility: [
      "Days are buttons in a labelled grid, not a pile of divs. The grid announces the month, and each day announces its full date and selected state.",
      "Keyboard navigation follows the ARIA grid pattern: arrows move by day or week, Home and End move within the week, Page Up and Page Down change month, and Shift with Page Up or Page Down changes year.",
      "Disabled dates keep their place in the grid so the month structure does not jump, but they cannot be selected.",
      "The month caption is a polite live region, so a keyboard month change is announced without interrupting the user.",
      "The calendar is a non-modal surface. Do not trap focus in it; inside a dialog, let the dialog own Escape and focus return.",
    ],
    keyboard: [
      { key: "Arrow keys", action: "Move focus by one day or one week." },
      { key: "Home / End", action: "Move to the first or last day of the focused week." },
      { key: "Page Up / Page Down", action: "Move to the previous or next month." },
      { key: "Shift + Page Up / Page Down", action: "Move to the previous or next year." },
      { key: "Enter / Space", action: "Select the focused day." },
    ],
    related: ["date-picker", "popover", "field"],
    note:
      "Dates are local calendar days. If the value must represent an instant across time zones, store an ISO timestamp and convert deliberately rather than passing a UTC midnight into the grid.",
  },
  combobox: {
    api: [
      {
        prop: "options",
        type: "ComboboxOption[]",
        description:
          "The list: { value, label, description?, disabled?, keywords? }. Labels are visible and searchable; keywords add hidden search terms.",
      },
      {
        prop: "value / onValueChange",
        type: "string | undefined / (value: string) => void",
        description:
          "Controlled selection. The component renders the matching option's label, so the consumer keeps owning the value.",
      },
      {
        prop: "placeholder",
        type: "string",
        defaultValue: '"Select an option"',
        description: "Shown on the trigger when no option is selected.",
      },
      {
        prop: "searchPlaceholder / emptyMessage",
        type: "string / string",
        description:
          "Copy for the search field and the no-results state. Give a recovery hint rather than only saying nothing matched.",
      },
      {
        prop: "disabled",
        type: "boolean",
        description: "Disables the trigger. Use aria-describedby to explain why when the reason is not obvious.",
      },
      {
        prop: "name",
        type: "string",
        description:
          "Renders a hidden input with the selected value so the field submits with a native form.",
      },
      {
        prop: "aria-label / aria-labelledby / aria-describedby / aria-invalid",
        type: "string / string / string / boolean",
        description:
          "Names the trigger and dialog and connects help or error text. Pass a visible label through aria-labelledby when one is present.",
      },
      {
        prop: "className / triggerClassName / align",
        type: 'string / string / "start" | "center" | "end"',
        description: "Layout and placement hooks; the selected state and keyboard behavior stay intact.",
      },
    ],
    accessibility: [
      "The trigger is a button with aria-haspopup=listbox and aria-expanded, so the closed field is announced as a control, not a text input.",
      "The search field is the combobox and owns the listbox. Arrow keys, Home, End, Enter, and Escape operate the list.",
      "The selected option is marked with a check icon and aria-selected; the check is hidden from assistive technology so the announcement is not doubled.",
      "Disabled options stay in the list with aria-disabled, so the option set does not change shape between searches.",
      "The trigger keeps its value label; nothing relies on placeholder text alone to explain the field.",
    ],
    keyboard: [
      { key: "Enter / Space", action: "Open the list from the trigger." },
      { key: "Arrow Down / Arrow Up", action: "Move through the filtered options." },
      { key: "Home / End", action: "Jump to the first or last option." },
      { key: "Enter", action: "Select the active option and close the list." },
      { key: "Escape", action: "Close the list and return focus to the trigger." },
    ],
    related: ["select", "command", "popover"],
    note:
      "Use Combobox when the option set is long enough to need search. For a short, fixed set, the native Select is simpler and keeps the platform's mobile picker.",
  },
  "date-picker": {
    api: [
      {
        prop: "value / onChange",
        type: "Date | DateRange | undefined / (value) => void",
        description:
          "The selected date, or range in DateRangePicker. The consumer owns the value; the field does not drift out of sync with a form library.",
      },
      {
        prop: "placeholder",
        type: "string",
        defaultValue: '"Pick a date"',
        description: "Shown when there is no value. It is never the only label for the field.",
      },
      {
        prop: "min / max",
        type: "Date / Date",
        description:
          "Bounds for selectable dates. Days outside the bounds are rendered disabled and cannot be chosen from the grid.",
      },
      {
        prop: "locale / format",
        type: "string / (date: Date) => string",
        description:
          "Controls the trigger label. The default uses Intl.DateTimeFormat with the visitor's locale, so no date library is required.",
      },
      {
        prop: "clearable",
        type: "boolean",
        defaultValue: "true",
        description:
          "Shows a Clear action in the popover footer when a value is set. Set it to false for required fields.",
      },
      {
        prop: "name",
        type: "string",
        description:
          "DatePicker renders a hidden input with a yyyy-mm-dd value for native form submission. DateRangePicker has no name because a range is two values; submit the two dates explicitly.",
      },
      {
        prop: "defaultMonth / numberOfMonths",
        type: "Date / number",
        description:
          "Opening month and, for DateRangePicker, how many months are shown side by side. Defaults to the selected date and one month.",
      },
      {
        prop: "aria-describedby / aria-labelledby / aria-invalid",
        type: "string / string / boolean",
        description: "Connects the field to help text, a visible label, and validation state.",
      },
    ],
    accessibility: [
      "The field is a button, not a text input pretending to be a calendar. Enter or Space opens the dialog and the current value is part of the button's name.",
      "Focus moves into the calendar grid when the popover opens, and Escape closes it and returns focus to the trigger.",
      "The calendar is labelled Choose a date or Choose a date range, so the dialog is not anonymous.",
      "The Clear action is a real button inside the popover; clearing does not rely on a decorative icon on the trigger.",
      "A DatePicker with a name submits an ISO yyyy-mm-dd value, preserving native form behavior and server-side parsing.",
    ],
    keyboard: [
      { key: "Enter / Space", action: "Open the calendar from the field." },
      { key: "Arrow keys / Home / End", action: "Move through days in the open calendar." },
      { key: "Page Up / Page Down", action: "Change month; add Shift to change year." },
      { key: "Enter / Space", action: "Choose the focused day." },
      { key: "Escape", action: "Close without changing the value and return focus to the field." },
    ],
    related: ["calendar", "popover", "field"],
    note:
      "Do not close a range picker on the first click: react-day-picker represents that first click as a one-day range. The picker stays open until the two ends differ, and shows the anchor date in the meantime.",
  },
  collapsible: {
    api: [
      {
        prop: "open / defaultOpen / onOpenChange",
        type: "boolean / boolean / (open: boolean) => void",
        description: "Controlled or uncontrolled visibility.",
      },
      {
        prop: "CollapsibleTrigger asChild",
        type: "boolean",
        defaultValue: "false",
        description:
          "Renders the trigger styles onto a child button or link. The child keeps its native semantics.",
      },
      {
        prop: "CollapsibleContent forceMount",
        type: "boolean",
        defaultValue: "false",
        description:
          "Keeps closed content in the DOM for search or measurement. Hide it visually and from assistive technology.",
      },
      {
        prop: "className",
        type: "string",
        description: "Layout adjustments only. The content is overflow-hidden so animated height cannot escape.",
      },
    ],
    accessibility: [
      "Radix sets aria-expanded and aria-controls on the trigger and removes collapsed content from the accessibility tree.",
      "The trigger is a real button. If you use asChild, keep the child focusable and do not nest another interactive control inside it.",
      "Do not animate height with a fixed pixel value; let the content size itself or use the Radix content-height variable.",
      "A collapsible is not navigation. Use Accordion when several related sections form one set, and Tabs when the content is a view switch.",
    ],
    related: ["accordion", "tabs", "card"],
  },
  "hover-card": {
    api: [
      {
        prop: "open / defaultOpen / onOpenChange",
        type: "boolean / boolean / (open: boolean) => void",
        description: "Controlled or uncontrolled visibility, usually left to hover and focus.",
      },
      {
        prop: "openDelay / closeDelay",
        type: "number",
        defaultValue: "700 / 300",
        description: "Milliseconds before opening or closing. Keep the open delay long enough to avoid accidental cards.",
      },
      {
        prop: "HoverCardContent align / sideOffset",
        type: '"start" | "center" | "end" / number',
        defaultValue: '"center" / 8',
        description: "Placement relative to the trigger.",
      },
      {
        prop: "aria-label / aria-labelledby",
        type: "string",
        description:
          "Names the floating content when it has no visible heading. Pair it with the trigger's accessible name.",
      },
    ],
    accessibility: [
      "The card supplements the trigger; it must never be the only way to reach essential information or an action.",
      "Radix opens on hover and keyboard focus, so a focusable trigger (link or button) is required. Touch users cannot hover: make the same destination reachable by tapping the trigger.",
      "Keep the content short and non-interactive. Interactive content belongs in Popover, where focus and dismissal are explicit.",
      "Give the content a name when it contains a distinct subject, and keep the trigger text meaningful without the card.",
    ],
    related: ["tooltip", "popover", "avatar"],
    note:
      "HoverCard has no built-in close button and is not a dialog. Do not place destructive actions or required form controls inside it.",
  },
  pagination: {
    api: [
      {
        prop: "page / pageCount",
        type: "number",
        description: "Current page (1-based) and the number of pages. Values are clamped to the valid range.",
      },
      {
        prop: "onPageChange",
        type: "(page: number) => void",
        description: "Called when a page button is activated. Required in button mode.",
      },
      {
        prop: "hrefFor",
        type: "(page: number) => string",
        description:
          "Renders real links instead of buttons. Use this for server-rendered lists so URLs remain shareable.",
      },
      {
        prop: "siblingCount",
        type: "number",
        defaultValue: "1",
        description: "Pages shown on each side of the current page before collapsing into an ellipsis.",
      },
      {
        prop: "labels",
        type: "{ previous?, next?, navigation? }",
        description: "Localized control labels. The navigation label defaults to Pagination.",
      },
    ],
    accessibility: [
      "Renders a nav landmark with an accessible name, so it appears in the landmark list and can be skipped.",
      "The current page uses aria-current=page and is not a control. Disabled previous and next are aria-disabled spans, not focusable dead ends.",
      "Use hrefFor whenever the list has real URLs; buttons alone lose deep links, back/forward, and open-in-new-tab.",
      "Ellipses are decorative and hidden from assistive technology. Every numbered page keeps a descriptive accessible name.",
    ],
    related: ["table", "button", "empty-state"],
    note:
      "Keep the page size stable across navigation and move focus to the results heading after a page change so keyboard users do not start at the end of the list.",
  },
  command: {
    api: [
      {
        prop: "label",
        type: "string",
        description:
          "Accessible name for the search input. Required; cmdk renders a visually hidden label from it.",
      },
      {
        prop: "shouldFilter",
        type: "boolean",
        defaultValue: "true",
        description:
          "Filters items by the query. Turn it off when results come from a server and you filter them yourself.",
      },
      {
        prop: "CommandDialog open / onOpenChange",
        type: "boolean / (open: boolean) => void",
        description:
          "Renders the palette in a modal Dialog. The dialog title and description are visually hidden but announced.",
      },
      {
        prop: "CommandItem value / onSelect",
        type: "string / (value: string) => void",
        description:
          "The value used for filtering and the callback that runs on click or Enter.",
      },
      {
        prop: "CommandShortcut",
        type: "component",
        description:
          "A right-aligned keyboard hint. It is decorative text; the action must remain understandable without it.",
      },
    ],
    accessibility: [
      "The `label` prop is not decoration: it names the combobox input. Without it the input is announced as an unnamed edit field.",
      "CommandDialog renders a real Dialog with an accessible title and description, focus trapping, Escape, and focus return.",
      "cmdk manages the combobox, listbox, and option roles, aria-activedescendant, and the selected state.",
      "Filtering keeps the list in sync with aria-activedescendant. Keep items short and do not put a second interactive control inside an item.",
    ],
    keyboard: [
      { key: "ArrowUp / ArrowDown", action: "Move the active option." },
      { key: "Enter", action: "Run the active option." },
      { key: "Escape", action: "Close the dialog and return focus to the trigger." },
    ],
    related: ["dialog", "dropdown-menu", "popover"],
    note:
      "Open the palette with an explicit trigger or a global shortcut. If you advertise ⌘K, implement it and show Ctrl K on non-Apple platforms.",
  },
  slider: {
    api: [
      {
        prop: "label",
        type: "string",
        description:
          "Accessible name for the thumb. Required unless you pass aria-labelledby to a visible label.",
      },
      {
        prop: "value / defaultValue / onValueChange",
        type: "number[] / number[] / (value: number[]) => void",
        description: "Controlled or uncontrolled value. The array holds one entry per thumb.",
      },
      {
        prop: "min / max / step",
        type: "number",
        defaultValue: "0 / 100 / 1",
        description: "Range and increment. Keep steps coarse enough to hit with a keyboard.",
      },
      {
        prop: "orientation",
        type: '"horizontal" | "vertical"',
        defaultValue: '"horizontal"',
        description: "Slider direction. Arrow keys follow the orientation.",
      },
      {
        prop: "disabled",
        type: "boolean",
        description: "Prevents interaction and reduces opacity.",
      },
    ],
    accessibility: [
      "Renders role slider on the thumb with aria-valuenow, aria-valuemin, and aria-valuemax.",
      "The thumb needs a name from label or aria-labelledby. A visible label and value beside the slider is the clearest pattern.",
      "Arrow keys change the value, Home and End jump to the range edges, and Page Up/Down move in larger steps.",
      "The square thumb follows the Aback geometry. The checked fill and the numeric value both communicate state, not colour alone.",
    ],
    keyboard: [
      { key: "ArrowLeft / ArrowRight", action: "Change the value by one step." },
      { key: "Home / End", action: "Jump to the minimum or maximum." },
      { key: "PageUp / PageDown", action: "Move in a larger increment." },
    ],
    related: ["input", "progress", "field"],
  },
  "scroll-area": {
    api: [
      {
        prop: "scrollbarVisibility",
        type: '"auto" | "always" | "scroll" | "hover"',
        defaultValue: '"hover"',
        description:
          "When the custom scrollbar appears. Use always for a container that must advertise overflow at rest.",
      },
      {
        prop: "aria-label / aria-labelledby",
        type: "string",
        description:
          "Names the focusable scroll region. Give it a name when the content is a distinct list or panel.",
      },
      {
        prop: "className",
        type: "string",
        description: "Set a height or width; the root clips and the viewport scrolls.",
      },
    ],
    accessibility: [
      "The viewport is focusable, so the region can be scrolled with the keyboard without a pointer.",
      "When a name is provided, the viewport becomes a named region landmark. Do not wrap it in another landmark with the same name.",
      "The scrollbar thumb uses the published scrollbar tokens and is visible in both themes.",
      "Do not put the only copy of essential content in a fixed-height scroller; keep the full content reachable and avoid nested scroll areas.",
    ],
    related: ["table", "card", "sheet"],
  },
  "alert-dialog": {
    api: [
      {
        prop: "open / defaultOpen / onOpenChange",
        type: "boolean / boolean / (open: boolean) => void",
        description: "Controlled or uncontrolled visibility.",
      },
      {
        prop: "AlertDialogAction / AlertDialogCancel",
        type: "component",
        description:
          "Both close the dialog. Action runs the destructive callback; Cancel dismisses. Style Action as destructive when the action is irreversible.",
      },
      {
        prop: "AlertDialogTitle / AlertDialogDescription",
        type: "component",
        description:
          "Title names the decision and is required. Description states the consequence in one or two sentences.",
      },
      {
        prop: "className",
        type: "string",
        description: "Layout adjustments only.",
      },
    ],
    accessibility: [
      "Renders role alertdialog, which screen readers announce as a decision that needs a response.",
      "Radix traps focus, closes on Escape, and returns focus to the trigger.",
      "Use this pattern only when the action is destructive or irreversible; routine forms belong in Dialog.",
      "The action button must name the verb (Delete project), not Yes, so the choice is clear out of context.",
    ],
    keyboard: [
      { key: "Escape", action: "Close without running the action." },
      { key: "Tab / Shift+Tab", action: "Move between Cancel and the action." },
      { key: "Enter / Space", action: "Activate the focused action." },
    ],
    related: ["dialog", "sheet", "button"],
    note:
      "The action is not a red button by default. Pass the destructive classes when the consequence warrants it, and keep the label specific either way.",
  },
  avatar: {
    api: [
      {
        prop: "size",
        type: '"xs" | "sm" | "default" | "lg" | "xl"',
        defaultValue: '"default"',
        description: "Sets the square footprint and the fallback type size.",
      },
      {
        prop: "AvatarImage src / alt",
        type: "string / string",
        description: "Alt text is required when the avatar identifies a person. Use an empty alt for a decorative avatar.",
      },
      {
        prop: "AvatarFallback",
        type: "component",
        description: "Rendered while the image loads and whenever it fails. Keep it to one or two initials.",
      },
      {
        prop: "className",
        type: "string",
        description: "Layout adjustments only.",
      },
      {
        prop: "AvatarGroup max / total / size",
        type: "number / number / AvatarSize",
        description: "Overlap avatars, collapse the rest into a +N count, and count people beyond the rendered ones. Size the count to match the avatars.",
      },
    ],
    accessibility: [
      "The image keeps real alt text. If the person's name appears next to it, the avatar is decorative and the alt can be empty.",
      "Initials are a fallback, not a substitute for the name in the surrounding row.",
      "Do not signal presence or role with avatar colour alone; add text or a labelled status.",
      "The square shape is deliberate. Do not add rounded-full for a circle that conflicts with the system geometry.",
      "AvatarGroup is a group; name it with aria-label. The overflow count reads as \"and 5 more\".",
    ],
    related: ["badge", "card", "table"],
  },
  popover: {
    api: [
      {
        prop: "open / defaultOpen / onOpenChange",
        type: "boolean / boolean / (open: boolean) => void",
        description: "Controlled or uncontrolled visibility.",
      },
      {
        prop: "PopoverContent align / sideOffset",
        type: '"start" | "center" | "end" / number',
        defaultValue: '"center" / 6',
        description: "Placement relative to the trigger.",
      },
      {
        prop: "aria-label / aria-labelledby",
        type: "string",
        description: "The panel is a dialog and needs a name when it has no visible heading.",
      },
      {
        prop: "className",
        type: "string",
        description: "Width and layout adjustments. The default is 288px.",
      },
    ],
    accessibility: [
      "Content renders in a portal with role dialog and is not modal by default, so the page remains reachable.",
      "Escape closes the panel and returns focus to the trigger; clicking outside also dismisses it.",
      "Give the panel a name with a heading and aria-labelledby, or aria-label when the content has no heading.",
      "Use Popover for interactive content. A sentence of explanation belongs in Tooltip, and a blocking decision belongs in Dialog.",
    ],
    keyboard: [
      { key: "Enter / Space", action: "Open the popover from the trigger." },
      { key: "Tab / Shift+Tab", action: "Move through the controls inside the panel." },
      { key: "Escape", action: "Close and return focus to the trigger." },
    ],
    related: ["tooltip", "dropdown-menu", "dialog"],
  },
  progress: {
    api: [
      {
        prop: "value",
        type: "number | null",
        defaultValue: "null",
        description:
          "Completed amount. Pass null when the total is unknown; the bar renders indeterminate and no value is announced.",
      },
      {
        prop: "max",
        type: "number",
        defaultValue: "100",
        description: "Upper bound of the value range.",
      },
      {
        prop: "label",
        type: "string",
        description:
          "Accessible name and visible caption. Required unless you pass aria-label on the root.",
      },
      {
        prop: "showValue",
        type: "boolean",
        defaultValue: "false",
        description: "Shows the rounded percentage beside the label.",
      },
      {
        prop: "indicatorClassName",
        type: "string",
        description: "Colour override for a semantic result, used sparingly.",
      },
    ],
    accessibility: [
      "Renders role progressbar with aria-valuenow, aria-valuemin, and aria-valuemax.",
      "The bar needs a name. Use a visible label when the work has a subject, and aria-label when the layout cannot fit one.",
      "Indeterminate work announces no number. Add a status message when the job starts and when it finishes.",
      "The fill uses a transform transition and is disabled under prefers-reduced-motion.",
    ],
    related: ["spinner", "skeleton", "alert"],
  },
  "radio-group": {
    api: [
      {
        prop: "value / defaultValue / onValueChange",
        type: "string / string / (value: string) => void",
        description: "Controlled or uncontrolled selection.",
      },
      {
        prop: "orientation",
        type: '"horizontal" | "vertical"',
        description: "Arrow-key direction for the group.",
      },
      {
        prop: "RadioGroupItem value",
        type: "string",
        description: "The value submitted and announced for this option. Required.",
      },
      {
        prop: "disabled",
        type: "boolean",
        description: "Removes one option or the whole group from interaction.",
      },
      {
        prop: "aria-label",
        type: "string",
        description: "Names the group when no visible legend or heading does.",
      },
    ],
    accessibility: [
      "Radix exposes radiogroup and radio roles with aria-checked and a single tab stop for the group.",
      "Arrow keys move between options and select as they go; Tab enters and leaves the group.",
      "Associate a visible label with every item using htmlFor. Do not rely on the option value alone.",
      "The checked state uses a solid fill and an inner mark, not colour alone. The square indicator is intentional.",
    ],
    keyboard: [
      { key: "Tab", action: "Enter or leave the group." },
      { key: "ArrowUp / ArrowDown", action: "Move and select in a vertical group." },
      { key: "ArrowLeft / ArrowRight", action: "Move and select in a horizontal group." },
      { key: "Space", action: "Select the focused option without moving." },
    ],
    related: ["checkbox", "switch", "field"],
  },
  sheet: {
    api: [
      {
        prop: "open / defaultOpen / onOpenChange",
        type: "boolean / boolean / (open: boolean) => void",
        description: "Controlled or uncontrolled visibility.",
      },
      {
        prop: "side",
        type: '"top" | "right" | "bottom" | "left"',
        defaultValue: '"right"',
        description: "Edge the panel slides in from. Right suits settings and filters.",
      },
      {
        prop: "showCloseButton",
        type: "boolean",
        defaultValue: "true",
        description: "Renders a labelled 32px close control in the top corner.",
      },
      {
        prop: "SheetTitle / SheetDescription",
        type: "component",
        description: "Title is the accessible name and is required. Description supplies the accessible description.",
      },
    ],
    accessibility: [
      "Renders a modal dialog, traps focus, locks background scroll, closes on Escape, and returns focus to the trigger.",
      "Always render SheetTitle. If the design shows no title, hide it visually instead of omitting the accessible name.",
      "The panel scrolls internally and is capped at 85dvh on top and bottom edges, so long forms stay reachable.",
      "The close button has a screen-reader label. Do not make the overlay the only way to dismiss the sheet.",
    ],
    keyboard: [
      { key: "Escape", action: "Close and return focus to the trigger." },
      { key: "Tab / Shift+Tab", action: "Cycle focus inside the panel." },
      { key: "Enter / Space", action: "Activate the focused control." },
    ],
    related: ["dialog", "alert-dialog", "popover"],
  },
  "toggle-group": {
    api: [
      {
        prop: "type",
        type: '"single" | "multiple"',
        description: "One active option or several. Required.",
      },
      {
        prop: "value / defaultValue / onValueChange",
        type: "string | string[]",
        description: "Controlled or uncontrolled selection, shaped by type.",
      },
      {
        prop: "variant",
        type: '"default" | "outline"',
        defaultValue: '"default"',
        description: "Separated or bordered items. Outline keeps the outer frame.",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg"',
        defaultValue: '"default"',
        description: "32, 36, or 40 pixel control height.",
      },
      {
        prop: "ToggleGroupItem value",
        type: "string",
        description: "Identifies the option. Required, and must be unique.",
      },
    ],
    accessibility: [
      "In single mode Radix exposes a radiogroup with radio items; in multiple mode each item is a button with aria-pressed.",
      "Arrow keys move between items, and the group is a single tab stop.",
      "Icon-only items need an aria-label. Do not rely on the glyph or the selected fill to explain the action.",
      "Use the group for view state such as alignment or density. For settings that save, use Switch or Checkbox.",
    ],
    keyboard: [
      { key: "Tab", action: "Enter or leave the group." },
      { key: "ArrowLeft / ArrowRight", action: "Move focus between items." },
      { key: "Space / Enter", action: "Toggle the focused item." },
    ],
    related: ["tabs", "button", "radio-group"],
  },
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
        type: '"default" | "secondary" | "outline" | "brand" | "success" | "warning" | "danger" | "info" | "destructive" | "muted"',
        defaultValue: '"secondary"',
        description: "Semantic label style. Success, warning, danger, and info are soft status surfaces; destructive is a solid fill.",
      },
      {
        prop: "dot",
        type: "boolean",
        defaultValue: "false",
        description: "Leads with a small square dot in the badge colour, for live, beta, and planned states. It is decorative.",
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
  toast: {
    note: "Mount `<Toaster />` once in the root layout — not on each page — then import `toast` from the same module anywhere, including plain event handlers.",
    api: [
      {
        prop: "theme",
        type: '"light" | "dark" | "system"',
        defaultValue: '"system"',
        description:
          "Pass the app's resolved theme when the theme is a class rather than the OS preference.",
      },
      {
        prop: "position",
        type: '"top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center"',
        defaultValue: '"top-right"',
        description:
          "Where the stack appears. Top right keeps it clear of the content being read.",
      },
      {
        prop: "closeButton / richColors / offset",
        type: "boolean / boolean / number | object",
        defaultValue: "true / true / 16",
        description:
          "The close control, status tinting, and the gap from the viewport edge or a sticky header.",
      },
      {
        prop: "toast(message, options)",
        type: "(message: ReactNode, options?: ToastOptions) => string",
        description:
          "Shows a neutral toast and returns its id. Options include description, action, cancel, duration, and id.",
      },
      {
        prop: "toast.success / error / warning / info",
        type: "same signature as toast",
        description:
          "Status variants. They use the same soft/strong token pairs as Alert, in both themes.",
      },
      {
        prop: "toast.dismiss(id?)",
        type: "(id?: string) => void",
        description:
          "Dismisses one toast, or every toast when no id is given. Use it before a navigation that would otherwise leave a stale message.",
      },
      {
        prop: "action.label / onClick",
        type: "string / () => void",
        defaultValue: "—",
        description:
          "A single reversible action, such as Undo. The toast dismisses after it runs unless you pass `duration: Infinity`.",
      },
    ],
    accessibility: [
      "Toasts are announced through a polite live region. Do not use one for a validation error: put the message next to the field so it is read in context and remains on screen.",
      "The close button and the action are real, focusable buttons. They are the only interactive parts; the rest of the toast is not a link.",
      "Never make a toast the only way to reach essential information or the only confirmation that data was saved. Pair it with a persistent state on the page.",
      "Use `duration: Infinity` when the message contains an action the person may need time to consider, and let them dismiss it explicitly.",
      "Emit one toast per outcome. Repeating the same message on every render creates a stream of announcements.",
      "The status colour is never the only signal: every variant also has an icon and a title that names the outcome.",
      "Motion is suppressed when the visitor requests reduced motion.",
    ],
    keyboard: [
      { key: "Tab", action: "Move focus to the action and close buttons while the toast is visible." },
      { key: "Enter / Space", action: "Run the focused action or dismiss the toast." },
      { key: "Alt + T", action: "Move focus into the toast region (sonner's default hotkey)." },
      { key: "Escape", action: "Dismiss the focused toast." },
    ],
    related: ["alert", "button", "field"],
  },
  "copy-button": {
    api: [
      { prop: "value", type: "string", description: "The exact text written to the clipboard. An empty string disables the button. Required." },
      { prop: "label / copiedLabel / errorLabel", type: "string", defaultValue: '"Copy" / "Copied" / "Copy failed"', description: "Accessible name in each state, and the visible text when showLabel is on. Localize all three." },
      { prop: "showLabel", type: "boolean", defaultValue: "false", description: "Shows the label next to the icon. Icon-only buttons keep the label as their accessible name and title." },
      { prop: "timeout", type: "number", defaultValue: "2000", description: "Milliseconds before the copied or error state returns to idle." },
      { prop: "onCopy / onCopyError", type: "(value: string) => void / (error: unknown) => void", description: "Called after a successful write, or when both the Clipboard API and the fallback fail." },
      { prop: "variant / size", type: "Button variant / size", defaultValue: '"ghost" / "icon-sm" or "sm"', description: "Any Button variant and size. The default size follows showLabel." },
      { prop: "copyToClipboard(value)", type: "(value: string) => Promise<void>", description: "The exported helper the button uses, for copying from your own controls." },
    ],
    accessibility: [
      "It is a real button with an accessible name in every state, and a polite live region announces \"Copied to clipboard\" or the failure.",
      "A refused write shows and announces an error state instead of claiming success.",
      "The confirmation stays next to the control. There is no toast that disappears before it can be read.",
      "Icons are decorative. The check and cross also change the label, so colour never carries the result alone.",
    ],
    keyboard: [
      { key: "Enter / Space", action: "Copy the value." },
    ],
    related: ["code-block", "button", "input-group"],
  },
  "input-group": {
    api: [
      { prop: "InputGroup", type: "div", description: "The 36px frame. It owns the border, the focus ring, and the invalid and disabled styling of the control inside it." },
      { prop: "InputGroupInput", type: "input", description: "The control. Every native input prop passes through, including id, aria-invalid, and aria-describedby." },
      { prop: "InputGroupAddon align", type: '"start" | "end"', defaultValue: '"start"', description: "Which side the addon sits on. End addons are ordered after the control." },
      { prop: "InputGroupAddon variant", type: '"text" | "inline"', defaultValue: '"text"', description: "text is a boxed segment for units and prefixes. inline sits inside the field for an icon or a compact button." },
    ],
    accessibility: [
      "Label the InputGroupInput, not the group. Field's htmlFor points at the input id as usual.",
      "When an addon carries meaning, such as a unit or currency, give it an id and add it to the input's aria-describedby so it is announced.",
      "Pressing a non-interactive addon focuses the input, the way a native label does. Buttons and links inside an addon keep their own behavior.",
      "An icon-only button in an addon needs an aria-label, such as Clear search.",
    ],
    related: ["input", "field", "button"],
  },
  dropzone: {
    api: [
      { prop: "onFilesAccepted", type: "(files: File[]) => void", description: "Called with files that passed the type, size, and count checks. Required." },
      { prop: "onFilesRejected", type: "(rejections: { file, reason }[]) => void", description: 'Called with each refused file and a reason of "type", "size", or "count", so the page can explain it.' },
      { prop: "accept", type: "string", description: 'Native accept syntax: ".pdf", "image/png", "image/*". It filters the picker and is also enforced for dropped files.' },
      { prop: "multiple / maxFiles", type: "boolean / number", defaultValue: "false / 1 or unlimited", description: "Allow several files, and cap how many one selection may add." },
      { prop: "maxSize", type: "number", description: "Largest accepted file in bytes." },
      { prop: "label / description / hint", type: "ReactNode", defaultValue: '"Drop a file here" / "or click to browse"', description: "The label is the input's accessible name; the description and hint are its description." },
      { prop: "icon / disabled / inputProps", type: "ReactNode / boolean / input props", description: "Replace the upload glyph, disable the area, or pass name, id, or extra aria attributes to the file input." },
      { prop: "fileMatchesAccept / formatFileSize", type: "helpers", description: "The exported accept check and a 1024-based size formatter for file rows." },
    ],
    accessibility: [
      "A real file input sits under the area, visually hidden but focusable. Tab reaches it, Enter or Space opens the picker, and the frame shows the focus ring.",
      "The visible label names the input and the hint describes it, so the accepted formats are announced before choosing.",
      "Dropping is a convenience, not the only path: the picker always works.",
      "Announce results yourself. The example writes accepted and rejected outcomes to a role=status line instead of relying on colour.",
    ],
    keyboard: [
      { key: "Tab", action: "Focus the file input." },
      { key: "Enter / Space", action: "Open the system file picker." },
    ],
    related: ["button", "progress", "alert"],
  },
  rating: {
    api: [
      { prop: "value / defaultValue / onValueChange", type: "number / number / (value: number) => void", description: "Controlled or uncontrolled rating. 0 means no rating." },
      { prop: "max", type: "number", defaultValue: "5", description: "Number of stars." },
      { prop: "name", type: "string", description: "Form field name. The checked radio submits its value with a native form." },
      { prop: "readOnly", type: "boolean", defaultValue: "false", description: "Displays a value instead of collecting one. Fractions such as 4.5 render as partial stars inside one image with a text alternative." },
      { prop: "clearable", type: "boolean", defaultValue: "false", description: "A second press on the selected star clears the rating." },
      { prop: "size / disabled", type: '"sm" | "default" | "lg" / boolean', description: "Star size and a disabled state." },
      { prop: "getItemLabel / getValueLabel", type: "(value, max) => string", defaultValue: '"3 stars" / "Rated 4.5 out of 5"', description: "Accessible names for each option and for the read-only image. Use them to localize." },
    ],
    accessibility: [
      "An interactive rating is a native radio group, so screen readers announce \"3 stars, radio button, 3 of 5\" and form submission works without scripts.",
      "Name the group with aria-label or aria-labelledby pointing at a visible question.",
      "The filled star uses the warning token, which meets non-text contrast. The selected value is also a checked radio, not only a colour.",
      "Read-only ratings are one image with a sentence alternative, not five announced icons.",
    ],
    keyboard: [
      { key: "Tab", action: "Enter or leave the rating." },
      { key: "ArrowRight / ArrowUp", action: "Select one more star." },
      { key: "ArrowLeft / ArrowDown", action: "Select one fewer star." },
      { key: "Space", action: "Select the focused star, or clear it when clearable." },
    ],
    related: ["radio-group", "field", "toggle-group"],
  },
  stat: {
    api: [
      { prop: "label / value", type: "ReactNode", description: "The term and the formatted number. Format the value before passing it, with Intl.NumberFormat for locales. Required." },
      { prop: "unit / hint", type: "ReactNode", description: "A muted unit after the value and a sub-line under it." },
      { prop: "icon / badge", type: "ReactNode", description: "A decorative 16px icon in a brand chip, and a badge after the label." },
      { prop: "tone / emphasis", type: '"neutral" | "success" | "warning" | "danger" | "info" / boolean', defaultValue: '"neutral" / false', description: "Colours the value, and with emphasis tints the tile. Always pair a tone with words." },
      { prop: "trend", type: '{ direction: "up" | "down" | "flat"; label: string; tone? }', description: "A change with an arrow. The label must carry the change on its own, such as \"+8 vs last week\". Up is success and down is danger unless you set tone, for metrics where lower is better." },
      { prop: "size", type: '"sm" | "default" | "lg"', defaultValue: '"default"', description: "Value size: a compact result tile, a KPI tile, or a headline number." },
      { prop: "StatGrid columns / joined", type: "2 | 3 | 4 / boolean", defaultValue: "3 / false", description: "Responsive columns that start at one on phones, and a joined panel with hairline dividers." },
    ],
    accessibility: [
      "The label and value are a dt and dd pair, so the value is announced with its label rather than as a stray number.",
      "The value is not a live region. A ticking counter does not interrupt a screen reader; announce important changes separately.",
      "Trend direction is shown by an arrow and stated in the trend label. Colour is supplementary.",
      "Icons are decorative and hidden from assistive technology.",
    ],
    related: ["description-list", "card", "badge"],
  },
  "description-list": {
    api: [
      { prop: "DescriptionList bordered", type: "boolean", defaultValue: "true", description: "Draws the outer border. Turn it off inside a card that already has one." },
      { prop: "DescriptionListItem emphasis", type: "boolean", defaultValue: "false", description: "A bold row with a heavier rule, for a total." },
      { prop: "DescriptionListTerm mono", type: "boolean", defaultValue: "false", description: "Monospace terms for header names and other technical keys." },
      { prop: "DescriptionListDetails tone", type: '"neutral" | "success" | "warning" | "danger" | "info"', defaultValue: '"neutral"', description: "Colours a value, such as a discount. Keep a sign or a word with it." },
    ],
    accessibility: [
      "It renders dl, dt, and dd, so assistive technology pairs every term with its value.",
      "Rows wrap on narrow screens instead of truncating, so long values such as header contents stay readable.",
      "Name a standalone list with aria-label when nearby text does not already describe it.",
      "Tone is supplementary. A discount reads as -$29.00, not as a green number alone.",
    ],
    related: ["stat", "table", "card"],
  },
  "relative-time": {
    api: [
      { prop: "date", type: "Date | string | number", description: "The moment to describe: a Date, an ISO string, or a timestamp. Invalid dates render nothing. Required." },
      { prop: "locale", type: "string", description: "BCP 47 locale for Intl. Defaults to the browser's language on the client." },
      { prop: "refreshInterval", type: "number", defaultValue: "60000", description: "How often the phrase updates. Components with the same interval share one timer; 0 renders once." },
      { prop: "absoluteFormat", type: "Intl.DateTimeFormatOptions", defaultValue: "medium date, short time, UTC", description: "The format of the server render and of the hover title." },
      { prop: "formatRelativeTime(date, now, locale)", type: "function", description: "The exported formatter, for places where you need the phrase as a string." },
    ],
    accessibility: [
      "It renders a time element with a machine-readable dateTime, and the exact date is the title.",
      "The server and the first client render show the absolute date, so cached pages hydrate without a mismatch.",
      "The phrase updates silently. It is not a live region, so a feed of timestamps does not chatter.",
      "Counts are truncated, never rounded up: 2 hours 50 minutes is \"2 hours ago\".",
    ],
    related: ["badge", "table", "description-list"],
  },
  steps: {
    api: [
      { prop: "Steps orientation", type: '"vertical" | "horizontal"', defaultValue: '"vertical"', description: "Vertical for onboarding and checklists. Horizontal for how-it-works rows; it stacks on phones." },
      { prop: "Step title / description", type: "ReactNode", description: "The step name and a sentence about it. Required title." },
      { prop: "Step status", type: '"complete" | "current" | "upcoming"', defaultValue: '"upcoming"', description: "Complete shows a check, current is highlighted and marked aria-current=step." },
      { prop: "Step statusLabel", type: "string", description: "Replaces the screen-reader status prefix, such as \"Completed\", for localization." },
      { prop: "Step children", type: "ReactNode", description: "Extra content under the description, such as the action for the current step." },
    ],
    accessibility: [
      "Steps is an ordered list, so the count and each position are announced.",
      "Each step starts with a visually hidden status: Completed, Current step, or Not started. Status is never colour alone.",
      "The current step carries aria-current=step.",
      "Step numbers come from a CSS counter and markers are decorative, so numbers are not read twice.",
    ],
    related: ["progress", "card", "button"],
  },
  "code-block": {
    api: [
      { prop: "code", type: "string", description: "The exact source. It is rendered as text and is what the copy button writes. Required." },
      { prop: "language / filename", type: "string", description: "Shown in the caption bar. The filename also names the scroll region." },
      { prop: "copyable / copyLabel", type: "boolean / string", defaultValue: 'true / "Copy code"', description: "Show the copy button and set its accessible name." },
      { prop: "showLineNumbers", type: "boolean", defaultValue: "false", description: "Numbers lines with a CSS counter. Numbers are never selected or copied." },
      { prop: "maxHeight", type: "number | string", description: "Caps the height and scrolls, for long files." },
    ],
    accessibility: [
      "The pre element is focusable and named, so keyboard users can scroll long lines.",
      "The copy button is a Copy Button: it announces the result and reports a refused write.",
      "Code renders as text, never as injected HTML. Pass pre-highlighted markup through your own wrapper if you need colour.",
      "Line numbers are generated content and are not read as part of the code.",
    ],
    keyboard: [
      { key: "Tab", action: "Focus the code region, then the copy button." },
      { key: "Arrow keys", action: "Scroll the focused code region." },
    ],
    related: ["copy-button", "card", "tabs"],
  },
  layout: {
    api: [
      { prop: "Container size", type: '"sm" | "md" | "lg" | "xl" | "full"', defaultValue: '"lg"', description: "Max width of a centred column, with the 16px mobile and 24px md gutter." },
      { prop: "Stack gap", type: '"none" | "xs" | "sm" | "md" | "lg" | "xl"', defaultValue: '"md"', description: "Vertical flow: 0, 4, 8, 16, 24, or 32px between children." },
      { prop: "Group gap / align / justify / wrap", type: "LayoutGap / align / justify / boolean", defaultValue: '"sm" / "center" / "start" / true', description: "A horizontal row for toolbars. It wraps by default so action rows never overflow a phone." },
      { prop: "Grid columns / gap", type: "1 | 2 | 3 | 4 | 6 / LayoutGap", defaultValue: '3 / "md"', description: "A card grid that starts at one column (two for six) and steps up at sm and lg." },
      { prop: "asChild", type: "boolean", defaultValue: "false", description: "Render the child element, so a Container can be the page's main or a section." },
    ],
    accessibility: [
      "The primitives are plain divs by default and add no roles. Use asChild to put landmark elements such as main or section in place.",
      "Visual order follows source order. Do not reorder content with CSS in a way that breaks the reading and focus order.",
      "Group wraps instead of shrinking controls, so touch targets keep their size on narrow screens.",
      "Every gap maps to a literal Tailwind class, so nothing depends on dynamically generated class names.",
    ],
    related: ["section-heading", "card", "separator"],
  },
  "section-heading": {
    api: [
      { prop: "title", type: "ReactNode", description: "The section heading. Required." },
      { prop: "eyebrow / description", type: "ReactNode", description: "A short brand-coloured label above the title and a sentence below it." },
      { prop: "action", type: "ReactNode", description: "A link or button for the section, such as View all. It moves to the right from md." },
      { prop: "as", type: '"h2" | "h3" | "h4"', defaultValue: '"h2"', description: "The heading level. Keep the outline in order under the page's h1." },
      { prop: "size / align", type: '"sm" | "default" | "lg" / "start" | "center"', defaultValue: '"default" / "start"', description: "Title scale and alignment. Centre is for marketing sections, start for product pages." },
      { prop: "headingId", type: "string", description: "An id for the heading, so the wrapping section can use aria-labelledby." },
    ],
    accessibility: [
      "Renders a real heading at the level you choose, so the page outline stays navigable.",
      "Pair it with a section labelled by headingId to create a named region.",
      "The eyebrow uses the link token, which meets text contrast in both themes.",
      "Use PageHeader for the page's h1. SectionHeading is for everything below it.",
    ],
    related: ["page-header", "layout", "breadcrumbs"],
  },
  "theme-toggle": {
    api: [
      { prop: "ThemeToggle storageKey", type: "string", defaultValue: '"theme"', description: "The localStorage key that remembers the choice." },
      { prop: "ThemeToggle toDarkLabel / toLightLabel", type: "string", defaultValue: '"Switch to dark theme" / "Switch to light theme"', description: "The accessible name in each state. Localize both." },
      { prop: "ThemeToggle variant / size", type: "Button variant / size", defaultValue: '"ghost" / "icon"', description: "Any Button variant and size." },
      { prop: "useTheme(storageKey?)", type: "() => { theme, resolvedTheme, setTheme }", description: 'theme is "light", "dark", or "system"; resolvedTheme is what is on screen. Every hook and toggle stays in sync, across tabs too.' },
      { prop: "ThemeScript storageKey / nonce", type: "string / string", description: "Render in head to apply the stored theme before paint. Pass a CSP nonce if your policy requires one." },
    ],
    accessibility: [
      "The toggle is a button whose name says what it will do, such as Switch to dark theme.",
      "The icon follows the dark class through CSS, so it is correct before hydration, and the name updates after.",
      "A system preference is respected until the visitor chooses, and system changes apply live.",
      "Blocked storage does not break the toggle; the theme still changes for the current page.",
    ],
    keyboard: [
      { key: "Enter / Space", action: "Switch between light and dark." },
    ],
    note: "The contract matches the Aback theme CSS: a dark class on html. Add suppressHydrationWarning to the html element, because ThemeScript changes its class before React hydrates.",
    related: ["button", "toggle-group", "dropdown-menu"],
  },
  "skip-link": {
    api: [
      { prop: "href", type: "string", defaultValue: '"#main-content"', description: "The hash of the main content's id." },
      { prop: "children", type: "ReactNode", defaultValue: '"Skip to content"', description: "The link text. Localize it." },
      { prop: "className", type: "string", description: "Adjust the revealed position, for example below a fixed banner." },
    ],
    accessibility: [
      "Place it first in the body so it is the first tab stop on every page.",
      "It is visually hidden until focused, then appears at the top left with a visible focus ring.",
      "Give the target an id and tabIndex={-1} if it is not natively focusable, so focus actually moves there.",
      "This satisfies WCAG 2.4.1 Bypass Blocks for repeated headers and navigation.",
    ],
    keyboard: [
      { key: "Tab", action: "Reveal the link from the top of the page." },
      { key: "Enter", action: "Move focus to the main content." },
    ],
    related: ["breadcrumbs", "table-of-contents"],
  },
  "table-of-contents": {
    api: [
      { prop: "items", type: "{ id: string; title: ReactNode; depth?: 1 | 2 | 3 }[]", description: "One entry per heading, using the heading's id. Required. An empty list renders nothing." },
      { prop: "title", type: "ReactNode", defaultValue: '"On this page"', description: "The visible heading of the list. It also names the navigation landmark." },
      { prop: "offset", type: "number", defaultValue: "96", description: "Pixels from the top of the viewport where a heading counts as reached. Match your sticky header." },
      { prop: "trackActive", type: "boolean", defaultValue: "true", description: "Follow the section in view. Turn it off for a static list." },
    ],
    accessibility: [
      "It is a nav landmark named by its visible title, with a list of ordinary anchor links.",
      "The active entry has aria-current=location, and a brand left border as well as colour.",
      "Links work before JavaScript loads and update the URL hash, so they can be shared.",
      "Give each heading scroll-margin-top so it is not hidden under a sticky header after the jump.",
    ],
    related: ["reading-progress", "breadcrumbs", "skip-link"],
  },
  "reading-progress": {
    api: [
      { prop: "target", type: "RefObject<HTMLElement | null>", description: "The element being read, such as the article. Without it, progress follows the whole document." },
      { prop: "className", type: "string", description: "Move or restyle the bar, such as below a fixed header with top-16." },
    ],
    accessibility: [
      "The bar is decorative and aria-hidden. Scroll position is already available to everyone.",
      "It never intercepts pointer events and is hidden when printing.",
      "Updates run once per animation frame and write a transform directly, so scrolling never re-renders the page.",
      "It sits at z-index 100, the top of the documented stack, so it is not covered by sticky headers.",
    ],
    related: ["table-of-contents", "progress"],
  },
  "share-buttons": {
    api: [
      { prop: "url / title", type: "string / string", description: "The absolute URL to share, and the text or subject where a network supports it. url is required." },
      { prop: "networks", type: '("x" | "linkedin" | "facebook" | "whatsapp" | "reddit" | "email")[]', defaultValue: '["x", "linkedin"]', description: "Which share links to render, in order." },
      { prop: "copyLink / nativeShare", type: "boolean / boolean", defaultValue: "true / false", description: "Add a copy-link button, and a native share button where the browser offers the Web Share API." },
      { prop: "showLabels", type: "boolean", defaultValue: "false", description: "Show network names next to the icons." },
      { prop: "shareUrl(network, url, title)", type: "function", description: "The exported URL builder, for your own share layout." },
    ],
    accessibility: [
      "The controls are a named group, and every icon-only link has a name such as Share on LinkedIn.",
      "Network links are plain anchors that open in a new tab with noopener. Nothing loads from a third party until someone chooses to share.",
      "Copy link announces the result through Copy Button's live region.",
      "The native share button only renders where the browser supports it, so there is never a dead control.",
    ],
    related: ["copy-button", "button", "dropdown-menu"],
  },
};
