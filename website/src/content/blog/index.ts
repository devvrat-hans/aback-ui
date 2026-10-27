import type { ComponentType } from "react";

import * as accessibleDialog from "./accessible-react-dialog-checklist";
import * as abackVsShadcn from "./aback-ui-vs-shadcn-ui";
import * as copyPaste from "./copy-paste-components-vs-npm-package";
import * as darkMode from "./dark-mode-without-flash-react";
import * as oklch from "./oklch-colors-css-design-systems";
import * as tokens from "./tailwind-css-v4-design-tokens";
import * as contrast from "./wcag-color-contrast-guide";

export interface PostModule {
  default: ComponentType;
  toc: { id: string; title: string }[];
  faq: { question: string; answer: string }[];
}

/** Each post's body, keyed by slug. data/posts.ts holds the metadata. */
export const postModules: Record<string, PostModule> = {
  "copy-paste-components-vs-npm-package": copyPaste,
  "tailwind-css-v4-design-tokens": tokens,
  "dark-mode-without-flash-react": darkMode,
  "accessible-react-dialog-checklist": accessibleDialog,
  "wcag-color-contrast-guide": contrast,
  "oklch-colors-css-design-systems": oklch,
  "aback-ui-vs-shadcn-ui": abackVsShadcn,
};
