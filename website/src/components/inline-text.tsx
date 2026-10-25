/**
 * Renders documentation strings that mark code with backticks, such as
 * "Pass `onSubmit`", as text with inline code. Nothing else is interpreted.
 */
export function InlineText({ text }: { text: string }) {
  const parts = text.split(/`([^`]+)`/);
  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <code key={index} className="bg-muted px-1 font-mono text-[0.9em] text-foreground">
            {part}
          </code>
        ) : (
          part
        ),
      )}
    </>
  );
}
