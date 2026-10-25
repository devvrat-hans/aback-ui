import { CodeBlock } from "@/components/ui/code-block";

const component = `import { Button } from "@/components/ui/button";

export function SaveBar() {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline">Cancel</Button>
      <Button>Save changes</Button>
    </div>
  );
}
`;

export function CodeBlockExample() {
  return (
    <div className="flex w-full flex-col gap-6">
      <CodeBlock code={component} filename="components/save-bar.tsx" language="tsx" showLineNumbers />
      <CodeBlock code="npx aback-ui@latest add button" language="bash" />
    </div>
  );
}
