import { Meter } from "@/components/ui/meter";

const categories = [
  { label: "Performance", score: 96 },
  { label: "Accessibility", score: 82 },
  { label: "Structured data", score: 54 },
];

/** The tone follows the score, and the words beside it say the same thing. */
function rate(score: number) {
  if (score >= 90) return { tone: "success", word: "Good" } as const;
  if (score >= 70) return { tone: "warning", word: "Fair" } as const;
  return { tone: "danger", word: "Poor" } as const;
}

export function MeterExample() {
  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <div className="flex flex-col gap-4">
        {categories.map(({ label, score }) => {
          const { tone, word } = rate(score);
          return (
            <Meter
              key={label}
              label={label}
              value={score}
              tone={tone}
              valueLabel={`${score} / 100, ${word}`}
            />
          );
        })}
      </div>

      <Meter label="Storage" value={7.2} max={10} valueLabel="7.2 of 10 GB" />

      <Meter
        label="Password strength"
        value={1}
        max={4}
        tone="danger"
        size="sm"
        valueLabel="Weak"
        valueText="Weak, 1 of 4"
      />

      <div className="flex items-center gap-3 text-sm">
        <span className="shrink-0 text-muted-foreground">Readability</span>
        <Meter aria-label="Readability" value={64} tone="neutral" size="lg" />
        <span className="shrink-0 tabular-nums">64%</span>
      </div>
    </div>
  );
}
