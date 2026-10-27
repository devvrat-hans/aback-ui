import { Code } from "@/components/code";
import { Callout } from "@/components/docs-ui";
import { A, KeyTakeaways } from "@/components/prose";

export const toc = [
  { id: "the-checklist", title: "The checklist at a glance" },
  { id: "role-and-name", title: "1. Role and accessible name" },
  { id: "focus-entry", title: "2. Move focus into the dialog" },
  { id: "focus-trap", title: "3. Keep focus inside" },
  { id: "escape", title: "4. Close on Escape" },
  { id: "focus-return", title: "5. Return focus to the trigger" },
  { id: "inert-background", title: "6. Make the background inert" },
  { id: "scroll-lock", title: "7. Lock page scroll" },
  { id: "alert-dialogs", title: "8. Use an alert dialog for confirmations" },
  { id: "native-dialog", title: "What about the native dialog element?" },
  { id: "testing", title: "How to test each item" },
];

export const faq = [
  {
    question: "Does an accessible modal need aria-modal='true'?",
    answer:
      "The WAI-ARIA Authoring Practices dialog pattern uses role='dialog' with aria-modal='true' for modal dialogs. Many libraries also hide the rest of the page with aria-hidden or the inert attribute, which makes the background unavailable to assistive technology even where aria-modal support is incomplete.",
  },
  {
    question: "Where should focus go when a modal dialog opens?",
    answer:
      "Generally to the first focusable element inside the dialog. If the dialog starts with content that would scroll out of view, focus a static element at the top instead, and for a destructive confirmation consider focusing the least destructive action.",
  },
  {
    question: "Should clicking the backdrop close a dialog?",
    answer:
      "It is a common convenience for ordinary dialogs, but it should never be the only way to close one, and it should not dismiss a confirmation that requires a decision. Escape and a visible close or cancel button are the reliable paths.",
  },
  {
    question: "Is the native HTML dialog element accessible?",
    answer:
      "showModal() gives you a modal dialog in the top layer, makes the rest of the page inert, and closes on Escape. You still need to provide an accessible name, decide initial focus, and add scroll locking if you want it.",
  },
];

export default function Post() {
  return (
    <>
      <p>
        An accessible modal dialog in React needs a <code>dialog</code> role with an accessible name,
        focus moved inside when it opens, focus kept inside while it is open, Escape to close, focus
        returned to the trigger when it closes, and a background that assistive technology and the
        pointer cannot reach. Each of these can be tested in a few lines, and each one is easy to get
        subtly wrong when you build the dialog yourself.
      </p>

      <KeyTakeaways
        items={[
          <>
            Use <code>role=&quot;dialog&quot;</code> and <code>aria-modal=&quot;true&quot;</code>,
            labelled by the visible title with <code>aria-labelledby</code>.
          </>,
          "Focus goes in on open, stays in while open, and returns to the trigger on close.",
          "Escape closes the dialog; Tab and Shift+Tab wrap inside it.",
          <>
            Hide the background from assistive technology with <code>inert</code> or{" "}
            <code>aria-hidden</code>, and lock page scroll.
          </>,
          <>
            Confirmations that require a decision use <code>role=&quot;alertdialog&quot;</code>.
          </>,
        ]}
      />

      <h2 id="the-checklist">The checklist at a glance</h2>
      <p>
        The behaviour below follows the{" "}
        <A href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/">
          WAI-ARIA Authoring Practices dialog pattern
        </A>
        , which is the reference most component libraries implement.
      </p>
      <table>
        <thead>
          <tr>
            <th>Requirement</th>
            <th>What to check</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Role and name</td>
            <td>Screen readers announce &quot;dialog&quot; and its title</td>
          </tr>
          <tr>
            <td>Focus entry</td>
            <td>Focus lands inside the dialog on open</td>
          </tr>
          <tr>
            <td>Focus trap</td>
            <td>Tab and Shift+Tab never reach the page behind</td>
          </tr>
          <tr>
            <td>Escape</td>
            <td>Escape closes the dialog</td>
          </tr>
          <tr>
            <td>Focus return</td>
            <td>Focus goes back to the element that opened it</td>
          </tr>
          <tr>
            <td>Inert background</td>
            <td>Screen reader virtual cursor cannot read the page behind</td>
          </tr>
          <tr>
            <td>Scroll lock</td>
            <td>The page behind does not scroll</td>
          </tr>
          <tr>
            <td>Visible focus</td>
            <td>Every control in the dialog shows a focus indicator</td>
          </tr>
        </tbody>
      </table>

      <h2 id="role-and-name">1. Role and accessible name</h2>
      <p>
        The container needs <code>role=&quot;dialog&quot;</code> so assistive technology announces
        it as a dialog, and <code>aria-modal=&quot;true&quot;</code> to say that content outside it
        is unavailable. Give it a name with <code>aria-labelledby</code> pointing at the visible
        title, and optionally a description with <code>aria-describedby</code>:
      </p>
      <Code
        language="tsx"
        code={`<div role="dialog" aria-modal="true" aria-labelledby="edit-title" aria-describedby="edit-desc">
  <h2 id="edit-title">Edit profile</h2>
  <p id="edit-desc">Changes are visible to your team.</p>
  {/* fields and actions */}
</div>`}
      />
      <p>
        A dialog without a name is announced as just &quot;dialog&quot;. If the design has no
        visible title, keep one for screen readers with a visually hidden heading rather than
        dropping it.
      </p>

      <h2 id="focus-entry">2. Move focus into the dialog</h2>
      <p>
        When the dialog opens, focus must move inside it. Otherwise a keyboard user is left on the
        trigger, behind an overlay, and a screen reader user may not know anything opened. The APG
        guidance:
      </p>
      <ul>
        <li>By default, focus the first focusable element.</li>
        <li>
          If the content is long and focusing the first control would scroll the start out of view,
          focus a static element at the top, such as the title, with{" "}
          <code>tabIndex={"{-1}"}</code>.
        </li>
        <li>
          For a destructive confirmation, consider focusing the least destructive action, so a
          stray Enter does not delete anything.
        </li>
      </ul>

      <h2 id="focus-trap">3. Keep focus inside</h2>
      <p>
        While a modal dialog is open, Tab from the last focusable element wraps to the first, and
        Shift+Tab from the first wraps to the last. Hand-rolled traps commonly break on details: a
        list of focusable selectors that misses <code>[contenteditable]</code> or a disabled
        button, a focusable element added after open, or a nested popover rendered in a portal
        outside the trap. A maintained primitive handles these cases; that is a strong reason not to
        write your own.
      </p>

      <h2 id="escape">4. Close on Escape</h2>
      <p>
        Escape closes the dialog. Listen on the dialog, not the window, so that an open select or
        menu inside it can handle Escape first and close itself without closing the whole dialog.
        Most primitives expose a hook for this, such as an <code>onEscapeKeyDown</code> callback,
        for the rare case where closing must be prevented, for example while a save is in progress.
      </p>

      <h2 id="focus-return">5. Return focus to the trigger</h2>
      <p>
        When the dialog closes, focus returns to the element that opened it, so keyboard users
        continue where they were. Two edge cases:
      </p>
      <ul>
        <li>
          If the trigger no longer exists, for example because the dialog deleted the row it lived
          in, move focus to a logical place such as the next row or the list heading. Losing focus to{" "}
          <code>&lt;body&gt;</code> sends keyboard users back to the top of the page.
        </li>
        <li>
          If the dialog completes a flow, moving focus to the result can make more sense than
          returning to the trigger.
        </li>
      </ul>

      <h2 id="inert-background">6. Make the background inert</h2>
      <p>
        A focus trap only covers the Tab key. Screen reader users navigate with a virtual cursor that
        ignores focus, so the content behind the dialog must also be hidden from the accessibility
        tree. Three tools exist:
      </p>
      <ul>
        <li>
          <code>aria-modal=&quot;true&quot;</code> on the dialog, which tells assistive technology to
          ignore the rest of the page. Support has historically varied between screen readers.
        </li>
        <li>
          <code>aria-hidden=&quot;true&quot;</code> on every sibling of the dialog&apos;s container,
          which is what many libraries do.
        </li>
        <li>
          The{" "}
          <A href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert">
            inert attribute
          </A>{" "}
          on the rest of the page, which removes it from the accessibility tree and also blocks
          focus and pointer interaction.
        </li>
      </ul>
      <p>
        Pointer events outside the dialog should not activate anything either. An overlay covers the
        page visually; make sure it also receives the clicks.
      </p>

      <h2 id="scroll-lock">7. Lock page scroll</h2>
      <p>
        Scrolling the page behind a modal is disorienting, especially on touch devices where a swipe
        inside a short dialog can scroll the page instead. Lock scrolling on the document while the
        dialog is open, and compensate for the scrollbar width so the layout does not shift when the
        scrollbar disappears. Keep the dialog itself scrollable when its content is taller than the
        viewport, so nothing becomes unreachable at high zoom.
      </p>

      <h2 id="alert-dialogs">8. Use an alert dialog for confirmations</h2>
      <p>
        A confirmation that interrupts the user and requires a response, such as &quot;Delete this
        project?&quot;, is an{" "}
        <A href="https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/">alert dialog</A>. It uses{" "}
        <code>role=&quot;alertdialog&quot;</code> and the same focus rules. In practice it should not
        close on an outside click, since that would dismiss a decision without an answer. Label the
        actions with what they do, such as &quot;Delete project&quot; and &quot;Cancel&quot;, rather
        than &quot;OK&quot;.
      </p>

      <Callout type="tip" title="How Aback UI handles this">
        The <A href="/docs/components/dialog">Dialog</A>,{" "}
        <A href="/docs/components/alert-dialog">Alert Dialog</A>, and{" "}
        <A href="/docs/components/sheet">Sheet</A> components are built on Radix UI primitives. For
        Dialog in its default modal mode, Radix renders <code>role=&quot;dialog&quot;</code> labelled by{" "}
        <code>DialogTitle</code> and described by <code>DialogDescription</code>, traps focus, closes
        on Escape, returns focus to the trigger, sets <code>aria-hidden</code> on the content outside
        the dialog, and locks page scroll. Alert Dialog uses <code>role=&quot;alertdialog&quot;</code> with the same focus handling. You still have to render a title.
      </Callout>
      <Code
        language="tsx"
        filename="components/edit-profile.tsx"
        code={`import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function EditProfile() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Changes are visible to your team.</DialogDescription>
        </DialogHeader>
        {/* fields */}
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`}
      />

      <h2 id="native-dialog">What about the native dialog element?</h2>
      <p>
        The HTML <code>&lt;dialog&gt;</code> element opened with <code>showModal()</code> covers
        several items on this list natively: it renders in the top layer above everything else,
        makes the rest of the document inert, and closes on Escape. See{" "}
        <A href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog">
          the dialog element on MDN
        </A>
        .
      </p>
      <p>
        It does not do everything. You still need an accessible name (<code>aria-labelledby</code>{" "}
        on the element), a deliberate initial focus (the <code>autofocus</code> attribute on the
        right control), and your own scroll lock. Calling <code>show()</code> instead of{" "}
        <code>showModal()</code> opens a non-modal dialog without any of the modal behaviour. Test
        focus return on close in every browser you support rather than assuming it.
      </p>
      <p>
        In React, the main friction is that <code>&lt;dialog&gt;</code> is imperative: you call{" "}
        <code>showModal()</code> from an effect when your <code>open</code> state changes, and sync
        state back from the <code>close</code> event. That is workable for simple cases. For
        dialogs that contain menus, popovers, or comboboxes, a primitive library that coordinates
        nested layers is usually less work.
      </p>

      <h2 id="testing">How to test each item</h2>
      <p>
        Most of the checklist can be automated with Testing Library and{" "}
        <code>user-event</code>, which simulates real keyboard input:
      </p>
      <Code
        language="tsx"
        filename="edit-profile.test.tsx"
        code={`import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
// toHaveFocus needs @testing-library/jest-dom in your test setup.

import { EditProfile } from "./edit-profile";

test("dialog is named, traps focus, and returns focus", async () => {
  const user = userEvent.setup();
  render(<EditProfile />);

  const trigger = screen.getByRole("button", { name: "Edit profile" });
  await user.click(trigger);

  // 1. Role and name
  const dialog = screen.getByRole("dialog", { name: "Edit profile" });

  // 2. Focus moved inside
  expect(dialog.contains(document.activeElement)).toBe(true);

  // 3. Tab stays inside
  await user.tab();
  await user.tab();
  await user.tab();
  expect(dialog.contains(document.activeElement)).toBe(true);

  // 4 and 5. Escape closes and focus returns
  await user.keyboard("{Escape}");
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(trigger).toHaveFocus();
});`}
      />
      <p>
        Add an automated scan with axe for structural problems, such as a missing name. Then do what
        automation cannot:
      </p>
      <ul>
        <li>Open and close the dialog with only a keyboard, in each browser you support.</li>
        <li>
          Use a screen reader, such as VoiceOver or NVDA, and confirm that the title is announced and
          that the virtual cursor cannot reach the page behind.
        </li>
        <li>Zoom to 200% and on a narrow viewport check that every control is reachable.</li>
        <li>
          Check focus indicators and text inside the dialog against its background with the{" "}
          <A href="/tools/contrast-checker">contrast checker</A>. The thresholds are in{" "}
          <A href="/blog/wcag-color-contrast-guide">WCAG colour contrast for UI developers</A>.
        </li>
      </ul>
      <p>
        Aback UI documents which of these checks it has run and which are still pending on its{" "}
        <A href="/docs/accessibility">accessibility page</A>, including the keyboard behaviour of
        each component.
      </p>
    </>
  );
}
