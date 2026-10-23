# @aback-ui/tokens

The Aback theme: semantic color roles, the Aback Blue ramp, square geometry, base element styles, and light and dark values.

```css
@import "tailwindcss";
@import "@aback-ui/tokens/tokens.css";
```

The file contains an `@theme inline` map, a `:root` block for light, and a `.dark` block for dark. Components read semantic utilities such as `bg-card`, `text-muted-foreground`, `text-link`, `bg-brand-fill`, and `ring-focus-ring`.

## Rules

- `primary` is neutral ink, not Aback Blue.
- `brand-fill` is a filled brand action, used sparingly.
- Every radius is zero. The only rounded element is the native scrollbar thumb.
- Readable text never drops below 12px and is never faded with opacity.
- Pair every light value with its dark counterpart.

Do not fork the token names in a component. If a role is missing, propose a semantic token rather than adding a one-off hex value.

The registry installs this file as `styles/aback.css` through the `theme` item. The canonical source here is the same file.
