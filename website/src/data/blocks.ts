import { registryItems, type RegistryItemSummary } from "./registry.generated";

export const blocks: RegistryItemSummary[] = registryItems
  .filter((item) => item.type === "registry:block")
  .sort((a, b) => a.title.localeCompare(b.title));

export function getBlock(name: string) {
  return blocks.find((block) => block.name === name);
}

export interface BlockDoc {
  notes: string[];
  accessibility: string[];
  related: string[];
}

export const blockDocs: Record<string, BlockDoc> = {
  "dashboard-shell": {
    notes: [
      "Pass your real navigation as `nav` with `href`s from your router. The shell renders anchors; swap them for your link component if you need client-side navigation.",
      "`activeHref` is matched exactly against the item's `href`. For nested sections, pass the parent item's href as the active one, or compute it from the current path.",
      "`onSearch` and `onSignOut` are optional. Omit them and the corresponding controls are not rendered, so the shipped page never shows a button that does nothing.",
      "The content region is a div so the shell can sit inside an existing `<main>`. When the shell owns the page, replace that container with `<main>`; do not end up with two main landmarks.",
      "The preview adds example metrics and activity. Those live outside the block source; replace them with your own data and keep the labelled example badge off the real page.",
    ],
    accessibility: [
      "The desktop sidebar and the mobile sheet each expose a labelled Primary navigation landmark, and the current section is marked with aria-current=page.",
      "The mobile trigger is a labelled button; the sheet has a title and description, traps focus while open, and returns focus to the trigger on close.",
      "The user menu is a real button with an accessible name that includes the person's name, and it only appears when it has at least one destination.",
      "Navigation is ordinary links, so middle-click, copy link, and browser history work. Icons are decorative and hidden from assistive technology.",
      "The sidebar is hidden at narrow widths rather than compressed; below md the same sections are available through the sheet.",
    ],
    related: ["sheet", "dropdown-menu", "avatar", "button", "breadcrumbs"],
  },
  "sign-in": {
    notes: [
      "Replace `onSubmit` with your auth client call. The block owns no authentication, network request, or session state.",
      "Swap the two anchors for your router's link component so the auth flow keeps client-side navigation.",
      "Render server errors by passing them into the form: mark the field `aria-invalid` and add a Field error. Do not rely on the password length or an empty email as validation.",
      "If your product supports passkeys or SSO, add them above the divider and keep the email form as the fallback.",
    ],
    accessibility: [
      "The block renders a section labelled by its h2; your page supplies the h1 and breadcrumbs.",
      "Every control has a visible label. The remember option pairs Checkbox with a real Label, so clicking the text toggles it.",
      "Enter submits the form natively, and the button is a real submit button. Password managers can fill both fields.",
      "Error messages are not included by default: add them with role alert next to the field and connect them through aria-describedby.",
    ],
    related: ["input", "field", "checkbox", "button"],
  },
  "users-table": {
    notes: [
      "Pass real members from a server component. The built-in list is clearly example data and should be replaced, not fetched by the block.",
      "`onInvite` and `onManage` are optional by design. When provided, the toolbar and row menu call your dialogs or routes; when absent, no dead actions are rendered.",
      "Filtering, sorting, and paging run locally over the provided array. For a large directory, move the query to the server and keep the same table, empty-state, and pagination contract.",
      "Copy email writes to the clipboard and announces the result in a visually hidden status region. Replace it if your workspace does not expose member emails.",
    ],
    accessibility: [
      "The table has a caption, column headers with scope=col, and a labelled scroll container, so it is navigable as a table rather than a wall of cells.",
      "The search field has an accessible name, and every row action names its row (Actions for Aditi Rao) instead of opening an unlabelled icon button.",
      "Status is conveyed by the badge text as well as its colour. Sorting is a real button with an explicit ascending/descending label.",
      "Filtering to zero rows replaces the table with an empty state that offers a recovery action, instead of leaving an unexplained blank region.",
    ],
    related: ["table", "pagination", "avatar", "dropdown-menu", "empty-state"],
  },
  "settings-section": {
    notes: [
      "Pass `initialValues` from the server and implement `onSave`. Until then the block is local state and says so.",
      "Extend the preference rows as you add settings. Each Switch needs a Label and a sentence that explains the effect, not just the name.",
      "The danger zone is deliberate. Keep the AlertDialog and the explicit Delete workspace action; do not replace it with an immediate delete.",
      "Wire `onDelete` to a server action and return a result the page can announce. The block does not navigate or toast on success.",
    ],
    accessibility: [
      "Heading order starts at h2 for the section and h3 inside each card, so it slots under an existing page heading.",
      "Switch exposes role switch and aria-checked; the adjacent text describes the effect, so state is never carried by colour alone.",
      "The save result is a role status message inside the section. It is not a toast that disappears before it can be read.",
      "Deletion requires an alertdialog with a named action and a cancel path, and focus returns to the trigger on dismissal.",
    ],
    related: ["switch", "alert-dialog", "field", "button"],
  },
  "site-header": {
    notes: [
      "Pass `brand` as your logo link and `links` from your route config. Swap the anchors for your router's link component to keep client-side navigation.",
      "`activePath` marks a link active when the current path equals or starts with its href, so nested pages keep their section highlighted.",
      "`onSearch` is optional. Without it no search control renders; with it, wire the same handler to your keyboard shortcut and pass that shortcut as `searchShortcut`.",
      "`actions` render on the right from md and at the bottom of the mobile sheet, so a sign-in or CTA is never lost on phones.",
    ],
    accessibility: [
      "The header holds a labelled Primary navigation landmark, and the sheet holds a separate Mobile navigation with a title.",
      "The current section carries aria-current=page and a brand wash, not colour alone.",
      "The mobile trigger is a labelled button; the sheet traps focus, closes on Escape, and returns focus to the trigger.",
      "Add a Skip Link before the header so keyboard users can jump to the content.",
    ],
    related: ["sheet", "theme-toggle", "skip-link", "kbd"],
  },
  "site-footer": {
    notes: [
      "Each column is a navigation landmark named by its title. Keep column titles short and distinct.",
      "Mark links to other sites `external`: they open in a new tab with noopener, show an arrow, and say so to screen readers.",
      "Put legal links such as privacy and terms in `legal`, not in a column, so they stay in the bottom bar on every page.",
    ],
    accessibility: [
      "The footer element is the page's contentinfo landmark. Render one per page.",
      "External links announce \"opens in a new tab\" instead of surprising the visitor.",
      "Links meet the 12px text floor and keep a visible focus ring on the muted background.",
    ],
    related: ["site-header", "separator"],
  },
  hero: {
    notes: [
      "The hero renders the page's h1. Use it once, at the top of a landing page.",
      "`highlight` is the second line of the same h1 in the link colour. Do not use gradient text; it fails contrast and the design system bans it.",
      "Only claim `highlights` you can back up. The preview's numbers are labelled example data; pass real figures from your server.",
      "Put a product shot, a live stat panel, or a demo in `aside`. It moves below the actions on narrow screens.",
    ],
    accessibility: [
      "The section is labelled by the h1, and the announcement is an ordinary link with descriptive text.",
      "The primary action is a link styled as a button because it navigates. Use a real button only for an in-page action.",
      "Proof points are a list with decorative check icons.",
      "The arrow nudge stops under prefers-reduced-motion.",
    ],
    related: ["section-heading", "stat", "button", "cta-banner"],
  },
  "feature-grid": {
    notes: [
      "Use three or four features with icons that mean something. Six is the most a reader will scan.",
      "Give a feature an `href` to make the whole cell one link to its page. The title is the link's name.",
      "Pass a unique `headingId` when a page has more than one feature grid.",
    ],
    accessibility: [
      "The section is labelled by its heading, and features are a list of h3s.",
      "Icon chips are decorative; the title carries the meaning.",
      "Linked cells show a focus ring inside the cell and a hover wash, with no layout shift.",
    ],
    related: ["section-heading", "card", "hero"],
  },
  pricing: {
    notes: [
      "Prices are monthly amounts per period: `{ monthly: 29, yearly: 23 }` shows $23 per month, billed yearly. 0 renders as Free.",
      "Pass `currency` and `locale` so Intl formats the amount. Never concatenate a currency symbol.",
      "Keep `yearlyLabel` truthful. If you say \"save 20%\", make the yearly prices 20% lower.",
      "Use `footnote` for tax, trial, and refund terms that belong next to the prices.",
    ],
    accessibility: [
      "The billing switch is a labelled toggle group with a single selection.",
      "Each plan is a list item with an h3. Excluded features say \"Not included\" to screen readers, not only a dash.",
      "Every call to action names its plan, so a list of links reads \"Choose Growth, Growth plan\" rather than three identical labels.",
      "The highlighted plan is marked by the badge text as well as the border.",
    ],
    related: ["toggle-group", "badge", "card", "faq"],
  },
  faq: {
    notes: [
      "Answers are plain strings so they can be mirrored into structured data. Separate paragraphs with a blank line.",
      "Set `structuredData` only for questions answered on this page. Search engines treat mismatched FAQ markup as spam.",
      "The first answer starts open; all answers stay in the HTML, so in-page search and crawlers can find them.",
    ],
    accessibility: [
      "Each question is a button with aria-expanded inside a heading, the standard accordion pattern.",
      "Several answers can be open at once, so readers can compare.",
      "The JSON-LD escapes angle brackets, so an answer cannot break out of its script tag.",
    ],
    related: ["accordion", "section-heading"],
  },
  newsletter: {
    notes: [
      "Implement `onSubscribe` with your email provider and return `{ ok, message }`. The block shows exactly that message; it never claims success on its own.",
      "Use double opt-in and say so in the success message: \"Check your inbox to confirm.\"",
      "Say what you send and how to leave in `consent`. Do not pre-tick anything.",
      "The inline variant fits a sidebar or footer column; the card variant suits the end of an article.",
    ],
    accessibility: [
      "The email field has a label (visually hidden in this layout), the email type, and autocomplete=email.",
      "The button is disabled while submitting and its text changes, so the state is not only a spinner.",
      "The result is written to a status region and linked to the field with aria-describedby.",
    ],
    related: ["input-group", "button", "field"],
  },
  "cta-banner": {
    notes: [
      "One primary action. A second, quieter action is optional. More than two dilutes the banner.",
      "Use the brand tone at the end of a marketing page and the muted tone on dense product pages.",
    ],
    accessibility: [
      "The banner is a section labelled by its h2.",
      "Actions are links because they navigate. The arrow is decorative.",
      "On phones the actions stack at full width, so touch targets stay large.",
    ],
    related: ["hero", "button", "section-heading"],
  },
  "cookie-consent": {
    notes: [
      "Load optional scripts only after `onDecision(\"accepted\")`. The block decides nothing for you.",
      "Write `message` plainly: what you ask for, and what happens if the visitor declines.",
      "The choice is stored under `storageKey`. Give people a way to change it later, such as a link on your cookie policy page that clears the key.",
      "Check the rules where you operate. This block is a pattern, not legal advice or a consent management platform.",
    ],
    accessibility: [
      "It is a labelled region, not a modal: no focus trap, no overlay, no scroll lock, so the page stays usable.",
      "Accept and decline are real buttons of equal size, so declining is as easy as accepting.",
      "The server render shows nothing, so a visitor who already chose never sees a flash of the banner.",
    ],
    related: ["button", "alert"],
  },
  "not-found": {
    notes: [
      "Render it from your framework's not-found route so the response is a real 404, not a 200 with an error message.",
      "Fill `links` from your analytics: the pages people were most likely looking for.",
      "Only pass `searchHint` if your site actually has search and the shortcut works.",
    ],
    accessibility: [
      "The block renders the page's h1, so the page is announced as \"Page not found\".",
      "Every way forward is a real link with descriptive text.",
      "The error badge is text, not an icon alone.",
    ],
    related: ["empty-state", "button", "badge"],
  },
  "contact-form": {
    notes: [
      "Implement `onSubmit` with your server action or API route and validate again on the server. Client checks only catch typos.",
      "Return `{ ok: false, message }` for a failure you can explain, such as a rate limit. Thrown errors show a generic retry message.",
      "Change `topics` to match how your team triages messages, and keep a catch-all option.",
      "Add spam protection on the server, such as Turnstile, before going live.",
    ],
    accessibility: [
      "Every field has a visible label and a required marker; errors are linked with aria-describedby and mark the field aria-invalid.",
      "On an invalid submit, focus moves to the first field with an error, so the reader lands on the problem.",
      "The character count is the message field's description, so it is announced with the field.",
      "The success view replaces the form inside a status region, with a clear next step.",
    ],
    related: ["field", "input", "textarea", "select"],
  },
  "article-layout": {
    notes: [
      "Pass your rendered article as children. Plain h2, h3, p, lists, blockquotes, links, and inline code are styled inside the block only.",
      "Give each h2 and h3 an id and list them in `toc`. Generate both from your Markdown or CMS headings so they cannot drift.",
      "The contents aside appears when the block's container is at least 48rem wide (a container query), so it also works inside a narrow layout.",
      "`readingTime` should come from the real word count. `publishedAt` renders as a stable absolute date, so cached pages do not change.",
    ],
    accessibility: [
      "The article is labelled by its h1 and starts with breadcrumbs and a meta bar with a machine-readable time element.",
      "The contents list is a nav landmark with aria-current=location on the section in view; on narrow screens it is a disclosure above the body.",
      "The reading progress bar is decorative and hidden from assistive technology.",
      "Body text is capped at 72 characters per line for readability.",
    ],
    related: ["table-of-contents", "reading-progress", "share-buttons", "breadcrumbs"],
  },
};
