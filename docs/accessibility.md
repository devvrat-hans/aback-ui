# Accessibility

Accessibility is part of correctness, not a polish phase. This document states what Aback UI requires and what has actually been verified.

## Requirements for every component

- Prefer semantic HTML: `button` for actions, `a` for navigation, native form controls where possible.
- Every interactive element is reachable and operable by keyboard.
- Focus is visible with at least 3:1 contrast against its background, using `focus-visible`.
- Icon-only controls have an accessible name.
- Decorative icons are hidden from assistive technology.
- State is never communicated by color alone.
- Text meets WCAG AA contrast; the lowest readable tier is `text-muted-foreground` with no opacity reduction.
- Motion respects `prefers-reduced-motion`.
- Long labels, 200% zoom, and a 375px viewport do not clip essential controls.
- Status messages use `role="status"` or `role="alert"`; errors are associated with the control that caused them.

## Keyboard model

| Pattern | Keys |
| --- | --- |
| Button, link, checkbox, switch | Enter, Space |
| Dialog | Escape closes; focus is trapped inside; focus returns to the trigger |
| Dropdown menu | Enter, Space, ArrowDown open; arrows move; Home/End jump; Escape closes; typeahead supported |
| Tabs | ArrowLeft/ArrowRight move between tabs; Home/End jump |
| Accordion | Enter/Space toggles the focused header; arrows move between headers |
| Tooltip | Focus or hover reveals; Escape dismisses |
| Select | Native browser behavior (the component renders a real `select`) |
| Rating | Native radio group: Tab enters, arrows change the rating, Space selects or clears |
| Dropzone | Tab focuses the hidden file input (the frame shows the ring); Enter or Space opens the picker |
| Copy Button | Enter or Space copies; the result is announced in a polite live region |
| Skip Link | First Tab stop on the page; Enter moves focus to `#main-content` |
| Table of Contents | Ordinary links; the section in view carries `aria-current="location"` |
| Block preview width | Toggle group: arrows move between Desktop, Tablet, and Mobile |

## Automated checks

- `bun run test` runs component behavior tests and axe checks on representative renders, plus an axe check on every block preview (`apps/docs/src/blocks/blocks.test.tsx`). Those checks have already caught duplicate heading ids, indistinguishable landmarks, and a skipped heading level in block previews.
- axe runs in jsdom. It cannot evaluate computed color contrast, so contrast is verified from measured token pairs in `DESIGN.md` and reviewed visually.
- The docs site is checked for one H1 per page, landmarks, skip link, and keyboard-operable navigation.

## Not yet verified

- Manual screen-reader sessions across NVDA, JAWS, and VoiceOver.
- Browser and assistive-technology combinations outside the current development environment.
- Automated visual regression.

Do not describe Aback UI as WCAG conformant until those reviews are complete. Report gaps as issues with the component, the environment, and the steps to reproduce.
