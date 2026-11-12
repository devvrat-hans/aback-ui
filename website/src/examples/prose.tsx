import { Prose } from "@/components/ui/prose";

export function ProseExample() {
  return (
    <Prose>
      <h2 id="prose-example-contrast">What contrast does body text need?</h2>
      <p>
        WCAG 2.2 Level AA asks for a contrast ratio of at least <strong>4.5:1</strong> for body text
        and 3:1 for large text. The ratio is a minimum, so <code>4.48:1</code> fails. Read the{" "}
        <a href="/blog/wcag-color-contrast-guide">contrast guide</a> for the full rules.
      </p>
      <ul>
        <li>Check every theme you ship, not only the light one.</li>
        <li>
          Check states too:
          <ul>
            <li>hover and focus</li>
            <li>disabled text that still has to be read</li>
          </ul>
        </li>
      </ul>
      <h3 id="prose-example-levels">Levels at a glance</h3>
      <table>
        <thead>
          <tr>
            <th scope="col">Text</th>
            <th scope="col">AA</th>
            <th scope="col">AAA</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Body</td>
            <td>4.5:1</td>
            <td>7:1</td>
          </tr>
          <tr>
            <td>Large</td>
            <td>3:1</td>
            <td>4.5:1</td>
          </tr>
        </tbody>
      </table>
      <blockquote>A colour that passes on white can fail on a tinted surface.</blockquote>
      <pre>
        <code>{`:root {\n  --link: #005d95; /* 7.0:1 on white */\n}`}</code>
      </pre>
    </Prose>
  );
}
