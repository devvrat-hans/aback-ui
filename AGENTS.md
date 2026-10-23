# ABACK UI — AGENTS.md

## Product, Design System, Component Engineering, Registry, Documentation, Security, Accessibility, Quality, and Release Contract

> **Purpose:** This is the primary implementation contract for humans and AI coding agents building Aback UI. Read it before planning, editing, generating components, changing architecture, or publishing packages.
>
> **Product:** Aback UI  
> **Parent:** Aback Group  
> **Website/domain:** `abackui.com` (working product direction; verify repository configuration before changing domains)  
> **Product type:** Open-source UI design system, reusable React component library, application blocks, design tokens, registry, and developer documentation  
> **Initial business model:** Free and open source; do not introduce paid gates or monetization flows without explicit owner approval  
> **Primary audience:** Developers building Aback Group applications  
> **Secondary audience:** External developers and teams seeking reusable, accessible, customizable UI components and application blocks  
> **Working product promise:** The building blocks behind better applications.  
> **Product philosophy:** Build it for Aback, engineer it for reuse, release it for everyone.  
> **Design authority:** The repository's `DESIGN.md` is authoritative for Aback brand identity, color roles, typography, spacing, shape, layout, motion, component states, accessibility, and visual conventions.  
> **Reference files:** The supplied `AGENTS.md`, `DESIGN.md`, and `AGENTS-aback-analytics.md` are ecosystem references. Their product-specific requirements do not automatically apply to Aback UI.

---

# 0. NON-NEGOTIABLE RULES FOR AI CODING AGENTS

1. **Audit before editing.** Inspect the repository, current files, package manager, framework versions, scripts, workspace configuration, package exports, build system, lint/type-check/test setup, deployment target, and existing conventions before changing code.
2. **Read the actual design authority.** Read this `AGENTS.md` and the repository's `DESIGN.md` before implementing UI. If the supplied design file is absent from the repository, report that and use the available reference only until the owner resolves it. Do not invent a competing design system.
3. **Aback UI is a product, not just a landing page.** Prioritize a working component library, component documentation, real previews, installable components, examples, and a reliable developer workflow. Marketing pages must not substitute for the actual product.
4. **No fake functionality.** Every visible control must work, navigate to a valid destination, or be clearly labelled as unavailable/not yet implemented. Do not ship dead buttons, fake search, nonfunctional copy buttons, fabricated install commands, or previews that differ from the real component.
5. **One source of truth.** Do not maintain separate hand-written implementations of the same component for the package, docs preview, and registry. Establish a canonical source and generate or compose distribution formats from it where practical.
6. **Reusable by design, not generic at all costs.** A component must solve a real repeated UI need. Do not add abstractions that make simple use cases harder, and do not bake an Aback product's business logic into a general-purpose component.
7. **Audit before extracting.** Code in another Aback repository is not automatically reusable, owned, license-compatible, secure, or suitable for public release. Inspect provenance, dependencies, license obligations, embedded secrets, internal APIs, product assumptions, and sensitive data before publishing.
8. **Do not copy product-specific internals.** Extract visual patterns and genuinely reusable behavior. Do not publish private API clients, tenant/account logic, billing code, internal endpoints, proprietary integrations, customer data, credentials, analytics payloads, or product-specific business rules as generic UI.
9. **Accessibility is part of correctness.** Use semantic HTML, keyboard-operable interactions, visible focus, appropriate accessible names, correct labels and descriptions, reduced-motion support, and sufficient contrast. Do not claim accessibility based only on appearance.
10. **Use the design tokens.** Avoid arbitrary hex values, ad hoc spacing, one-off radii, and isolated typography decisions. Add or change tokens deliberately and document the reason. Do not use the Aback Blue brand color as the default fill for every action.
11. **Do not overstate compatibility.** Declare actual framework, React, browser, runtime, and peer-dependency support. Test published entry points. Do not claim a component works in a framework or environment that has not been validated.
12. **Preserve public APIs.** Component names, props, exports, CSS variables, token names, registry identifiers, CLI flags, install instructions, and package paths are public contracts once released. Prefer additive changes; document and deprecate breaking changes.
13. **Keep dependencies intentional.** Before adding a dependency, explain what it provides, whether the existing stack can meet the need, its bundle/runtime cost, maintenance status, license, and security implications.
14. **Respect upstream licenses and attribution.** Verify the license for code and assets copied or adapted from third-party sources. Preserve required copyright and notices. Never assume a public GitHub repository is MIT-licensed.
15. **No secrets in the repository or browser.** Never commit API keys, tokens, private registry credentials, production environment files, customer data, or secrets in examples, screenshots, tests, fixtures, or generated docs.
16. **Do not silently change architecture.** Do not replace the agreed stack, registry format, package manager, styling approach, or monorepo strategy without a documented technical reason and owner approval when the change is consequential.
17. **Respect user work.** Inspect `git status` and diffs before broad edits. Do not overwrite unrelated changes, delete files merely because they seem unused, or reset/reformat the entire repository without need.
18. **Verify claims and examples.** Commands in docs must be executable, imports must exist, previews must render, and API examples must match the actual implementation. Do not invent package versions, URLs, component props, or CLI behavior.
19. **Build in vertical slices.** Deliver a small set of polished, tested, documented, installable components before expanding into a large catalogue. Do not create dozens of placeholders to imply progress.
20. **Finish with evidence.** Run relevant build, lint, type-check, unit, accessibility, and integration checks where available. Report exactly what ran, what passed or failed, and what remains unverified. Never claim a check passed if it was not run.
21. **Do not expose internal implementation details in public docs.** Public documentation should explain how users use the library, not leak private environment details, credentials, internal paths, or Aback product internals.
22. **When requirements are ambiguous,** state the ambiguity, choose the smallest reversible option, and ask the owner only when the decision materially affects API compatibility, security, license, architecture, or product direction.

---

# 1. PRODUCT DEFINITION

## 1.1 What Aback UI Is

Aback UI is the shared interface foundation for Aback Group applications and an open-source library for outside developers. It should make it easier to create coherent, accessible, polished web interfaces without re-solving the same component and layout problems in every repository.

The product is expected to bring together:

- **Design tokens:** Semantic color, typography, spacing, layout, shape, elevation, motion, focus, and status tokens.
- **Core components:** Small, composable primitives and common interface controls.
- **Application components:** Reusable navigation, page headers, empty states, data display, settings patterns, feedback patterns, and other common app UI.
- **Blocks:** Composed, production-minded patterns such as settings sections, onboarding steps, authentication layouts, data tables, dashboards, filters, and command/search surfaces when justified by real use cases.
- **Registry and installation:** A reliable way to install package components and, where supported, copy customizable source components/blocks into an application.
- **Documentation and playground:** Searchable documentation, real component previews, variants, API references, accessibility notes, and copyable installation/use examples.
- **Integration guidance:** Clear instructions for using Aback UI in Aback Group applications and external projects.

The library should support both centralized maintenance and developer ownership. Package-installed components should be straightforward to upgrade; source-copy components should be easy to customize without forcing consumers to depend on a hidden runtime.

## 1.2 Working positioning

> **Aback UI — The building blocks behind better applications.**

The core proposition is consistency without lock-in: use the shared Aback design language, reuse well-engineered components, and customize the implementation when a product requires it.

Do not market Aback UI as a complete design system for every framework or as a replacement for every UI library. Describe what is actually shipped and tested.

## 1.3 Primary and secondary users

**Primary: Aback Group developers**
- Need consistent components across multiple Aback products.
- Need to ship product features without rebuilding the same patterns.
- Need a shared visual language, documented APIs, and predictable updates.
- Need components that can accommodate different product workflows without leaking business logic across repositories.

**Secondary: External developers**
- Need clear setup and installation instructions.
- Need useful components without mandatory account creation or a proprietary service.
- Need accessible defaults, customization options, source transparency, and stable APIs.
- Need to know whether a component is stable, experimental, or dependent on a specific framework.

Do not optimize the first release for every framework, design tool, platform, and application category. Establish a strong React/web baseline first unless the existing repository and owner-approved direction specify otherwise.

## 1.4 Product boundaries

Aback UI is initially not:

- A hosted application backend or authentication service.
- A complete application framework.
- A replacement for React, CSS, Tailwind, or every component library.
- A mandatory cloud service or account-gated component catalogue.
- A visual page builder or no-code application builder.
- A private source-code mirror for every Aback product.
- A place to publish every component merely because it exists in an internal repository.
- A guarantee that components are accessible, secure, or production-ready without testing.
- A collection of disconnected demo components that do not install or work outside the documentation site.

Features outside the library, documentation, registry, and developer workflow need explicit validation and owner approval.

## 1.5 Product principles, in priority order

1. Correctness and predictable behavior.
2. Accessibility and semantic interaction.
3. Reusability and API clarity.
4. Design consistency with `DESIGN.md`.
5. Customizability and low lock-in.
6. Developer experience and documentation.
7. Performance and minimal dependency cost.
8. Security, provenance, and license compliance.
9. Maintainability and release discipline.
10. Visual polish.

Component count, novelty, animations, and superficial similarity to competitors are not goals by themselves.

---

# 2. REPOSITORY AUDIT AND INITIAL WORKFLOW

## 2.1 Before making changes

Perform a concise audit and record findings in the response or an appropriate repository document:

- Repository structure and current git status.
- Existing `AGENTS.md`, `DESIGN.md`, README, license, contribution rules, and code owners.
- Package manager and lockfile; do not replace one casually.
- Node.js/runtime requirements and package manager version.
- Framework and React versions.
- TypeScript configuration and strictness.
- Styling system and current token definitions.
- Workspace/monorepo configuration and package boundaries.
- Build, lint, type-check, test, and format scripts.
- Current app routes and documentation framework.
- Existing component patterns and dependency conventions.
- Current deployment and preview environment.
- Current package name, scope, exports, versioning, and publishing state.
- Available CI checks and release workflows.
- Existing accessibility, visual regression, and browser tests.
- License and provenance of any imported components.

Do not begin by replacing the repository with a fresh scaffold. Preserve sound working code and existing conventions unless they conflict with an explicit requirement.

## 2.2 Initial deliverables

After the audit, establish or update the following as appropriate:

- `README.md` — what Aback UI is, quick start, package/registry distinction, links to docs and contribution guide.
- `AGENTS.md` — this engineering contract.
- `DESIGN.md` — authoritative design language and component rules.
- `CONTRIBUTING.md` — contribution, tests, component proposal, and pull request workflow.
- `LICENSE` — only after confirming intended license and rights.
- `CHANGELOG.md` or release notes workflow.
- `docs/architecture.md` — source-of-truth and package/registry architecture.
- `docs/component-status.md` or a component metadata catalogue — status, API maturity, dependencies, and limitations.
- `docs/provenance.md` or equivalent tracking record for extracted/adapted components, where needed.
- `docs/accessibility.md` — supported patterns and testing expectations.
- `docs/release-process.md` — versioning, validation, publishing, and rollback.

Do not create empty files simply to make the repository look complete. Each created document should contain useful, current information.

## 2.3 Work in small, reviewable slices

For each task:

1. State the user problem and intended outcome.
2. Inspect the current implementation and related patterns.
3. Identify public API, accessibility, dependency, license, and compatibility impacts.
4. Propose the smallest coherent change.
5. Implement the component or feature with its states.
6. Add tests and examples.
7. Update docs and changelog when the public contract changes.
8. Run relevant checks.
9. Review the diff for accidental changes.
10. Report results and known limitations.

Avoid large rewrites that combine architecture, styling, package migration, and unrelated component changes in one step.

---

# 3. TECHNICAL DIRECTION AND ARCHITECTURE

## 3.1 Preferred direction

Unless the repository already has a functioning, owner-approved alternative, use the following as the working baseline:

- React and TypeScript for the web component library.
- Next.js or the existing suitable React framework for the documentation website.
- Tailwind CSS if it is already the agreed styling foundation and can be used without compromising component portability.
- A monorepo/workspace when it genuinely simplifies shared packages, documentation, registry, and examples.
- A package distribution path for centrally maintained components.
- A source registry path for components/blocks that users should own and customize.
- CI that validates source, built package exports, registry output, docs examples, and release artifacts.

These are defaults, not permission to discard a working repository. Audit first and preserve established choices unless there is a concrete reason to change them.

## 3.2 Suggested logical architecture

The exact directories must follow the repository's current state, but the architecture should keep clear boundaries among:

- **Documentation app:** Public website, docs routes, component catalogue, examples, search, and playground.
- **Tokens:** Design tokens and generated CSS/TypeScript artifacts where useful.
- **Core UI:** Canonical reusable React components.
- **Hooks/utilities:** Shared behavior only where there is a real repeated need.
- **Blocks:** Higher-level compositions built from core components.
- **Registry definitions:** Metadata and source packaging for copyable components/blocks.
- **Examples:** Minimal examples and integration fixtures used to validate consumer experience.
- **Tests and tooling:** Unit, accessibility, integration, build, visual, and registry checks.
- **Scripts:** Code generation, validation, and release helpers with documented behavior.

Possible monorepo shape:

```text
aback-ui/
├── apps/
│   └── docs/
├── packages/
│   ├── tokens/
│   ├── ui/
│   ├── hooks/              # only if independently useful
│   └── config/             # only if shared config is warranted
├── registry/
│   ├── components/
│   └── blocks/
├── examples/
├── scripts/
├── tests/
├── AGENTS.md
├── DESIGN.md
├── README.md
├── CONTRIBUTING.md
├── LICENSE
└── package.json
```

Do not create every suggested package at the start if it adds empty abstractions. Start with the fewest boundaries that support the real workflow.

## 3.3 Dependency direction

Prefer a dependency graph that points inward:

- Tokens should not depend on UI components.
- Core UI components may depend on tokens and approved low-level utilities.
- Blocks may depend on core UI components.
- Documentation may depend on the library and examples.
- Registry generation may consume canonical component sources and metadata.
- Core UI must not import from the documentation app.
- A product-specific Aback application must not become a dependency of the public UI library.
- The package build must not require the documentation site to run.
- The registry must not require a live Aback service to install components.

Avoid circular dependencies, import-time side effects, and unnecessary runtime coupling.

## 3.4 Package and registry strategy

Support the following paths only when they are implemented and tested:

### Package installation
- Components are imported from documented package entry points.
- Package exports are explicit; avoid accidental deep-import requirements.
- Peer dependencies are correctly declared.
- Styling and token requirements are documented.
- The built package works in a clean consumer app, not just in the monorepo.
- Package versions and changelog accurately reflect API changes.

### Source-copy registry
- Registry items contain metadata, valid dependencies, required files, and documented install instructions.
- Copied source remains functional after installation.
- Component files do not depend on undocumented aliases or hidden monorepo paths.
- Registry output is validated in a fixture app.
- Dependencies and CSS/token requirements are reported before or during installation.
- The installation command must be real and tested; do not invent a CLI command or imply shadcn compatibility until compatibility is demonstrated.
- Do not silently overwrite consumer files. If an installer writes files, provide a clear overwrite strategy and show what will be changed.

A component should have one canonical implementation. Do not manually fork a package version and registry version unless a documented technical constraint makes it unavoidable.

## 3.5 Public API and compatibility

Treat these as public contracts after release:

- Component names and exports.
- Prop names, types, defaults, and callback semantics.
- CSS variable and token names.
- Theme attributes and provider behavior.
- Package entry points and peer dependency requirements.
- Registry names, metadata, install commands, and output paths.
- CLI commands and flags, if introduced.
- Documented keyboard behavior and accessibility semantics.

Rules:
- Prefer additive, backward-compatible changes.
- Do not remove or rename public props without a migration path.
- Mark deprecated APIs clearly and state the removal target when known.
- Use semantic versioning where appropriate and document the chosen policy.
- Do not publish unstable APIs as stable by accident.
- Keep migration guidance for breaking changes.
- Test both source and built output.

---

# 4. DESIGN SYSTEM AUTHORITY

## 4.1 `DESIGN.md` is normative

`DESIGN.md` is the source of truth for visual decisions. Read the actual file before UI changes. Follow its token names, semantic color roles, typography, spacing, square-corner philosophy, border/elevation hierarchy, icon rules, motion, responsive behavior, component specifications, and accessibility requirements.

Do not casually reinterpret the design system from screenshots or memory. If a component cannot be built cleanly using existing tokens, determine whether the need is a genuine gap, document it, and propose a deliberate token/specification update.

## 4.2 Aback brand and neutral UI

The Aback Blue brand anchor is `#009bf9`, with the primary ramp defined in `DESIGN.md`. Use the specified semantic roles rather than using raw brand blue everywhere.

Important distinction:
- The default primary/action role in the design reference is neutral ink, not necessarily Aback Blue.
- Brand color is used where the design system assigns a brand role: links, selected states, focus indicators, brand accents, or explicit brand actions.
- Destructive, success, warning, and informational states must use their semantic tokens.
- Do not communicate status using color alone.
- Third-party brand colors must be restricted to appropriate contexts and must not replace Aback semantic tokens.

Never create an alternate palette in a component stylesheet. If a token is missing, propose a semantic token and define its light/dark behavior.

## 4.3 Theme support

- Respect the light and dark semantic values defined by `DESIGN.md`.
- Use semantic variables for surfaces, text, borders, inputs, focus, overlays, and statuses.
- Do not hardcode a light-theme color into a reusable component when it should adapt to the current theme.
- Theme changes must preserve readable contrast and visible focus.
- Components should inherit the consumer's theme unless the API explicitly documents a local theme override.
- Avoid flash-of-wrong-theme behavior in the documentation app when a theme preference is supported.
- Test key components in both themes.
- Do not add a theme provider if CSS variables and an existing provider already solve the problem.

## 4.4 Shape, spacing, and typography

- Follow the square-corner direction in `DESIGN.md`; do not add rounded cards and pill controls by habit.
- Use the documented spacing scale and layout primitives.
- Use Geist and Geist Mono stacks as specified when available, with sensible system fallbacks.
- Use the correct typography roles rather than arbitrary font sizes.
- Maintain a consistent content width, page gutter, and responsive rhythm.
- Do not add decorative gradients to application UI unless explicitly allowed by the design reference for that surface.
- Marketing/social artwork rules must not leak into component or dashboard UI.

## 4.5 Motion and interaction feedback

- Use motion only to explain a state change, support orientation, or give useful feedback.
- Follow documented durations and easing.
- Respect `prefers-reduced-motion`.
- Avoid infinite animation, parallax, large hover transforms, or motion that delays essential interaction.
- Hover effects must not be the only signal that an element is interactive.
- Loading indicators must represent real loading work.
- Disabled, loading, selected, invalid, success, and error states must be visually and semantically distinguishable.

## 4.6 Do not copy a screenshot instead of the system

A screenshot can inform layout, but the implementation must use real components, tokens, responsive rules, and accessible interactions. Avoid pixel-matching one viewport while allowing the layout to fail on other screen sizes or with longer localized text.

---

# 5. COMPONENT TAXONOMY AND SCOPE

## 5.1 Component layers

Classify each contribution before implementing it.

### Layer 1 — Foundation
Examples: button, link, text input, textarea, checkbox, radio, switch, select, label, separator, spinner, skeleton, tooltip, popover, dialog, and visually hidden utility.

### Layer 2 — Composed UI
Examples: form field, input group, dropdown menu, tabs, accordion, alert, toast, badge, avatar, card, pagination, command menu, breadcrumbs, and navigation primitives.

### Layer 3 — Application patterns
Examples: page header, empty state, error state, loading panel, settings row, filter bar, searchable table toolbar, confirmation flow, metric tile, and responsive sidebar shell.

### Layer 4 — Blocks
Examples: onboarding flow, sign-in/sign-up layout, settings page section, dashboard shell, searchable data table, filtering/reporting panel, and a complete but customizable empty-state section.

These are candidate examples, not a requirement to build them all immediately. Audit existing Aback repositories and prioritize components that are genuinely reused and broadly applicable.

## 5.2 Core component quality bar

A component is suitable for the shared library when:

- It solves a recognizable repeated UI problem.
- Its API is understandable without reading its implementation.
- Its behavior is not tied to one Aback product's backend or data model.
- It works with realistic content and edge cases.
- It has documented states, keyboard behavior, and accessibility semantics.
- It can be styled through supported tokens or documented extension points.
- It has a reasonable dependency footprint.
- It is tested and documented.
- Its source provenance and license are clear.

Do not promote a one-off layout to the core package merely to increase the component count.

## 5.3 Components versus blocks

**Components** should be relatively focused, reusable, and composable.  
**Blocks** may combine multiple components to accelerate common workflows, but must remain customizable and should not force a product's data model, routing, auth, billing, or backend assumptions on the consumer.

Blocks must state:
- What problem they solve.
- Which components and dependencies they use.
- Which parts are intended to be customized.
- Which data or callbacks the consumer must provide.
- Responsive and accessibility behavior.
- Whether the block is stable, experimental, or illustrative.

A block with mock data must clearly label it as example/demo data and must not imply that it is connected to a real backend.

## 5.4 Naming

- Use consistent, descriptive, unsurprising names.
- Follow existing naming conventions in the repository.
- Prefer standard terms developers already recognize.
- Do not create multiple components with nearly identical purpose unless the difference is documented.
- Avoid product-branded names for generic primitives.
- Avoid names that promise more than the component supports.
- Use explicit variants rather than proliferating near-duplicate components where the API remains clear.

---

# 6. COMPONENT API AND IMPLEMENTATION STANDARDS

## 6.1 TypeScript

- Use TypeScript for component source unless the established repository explicitly dictates otherwise.
- Keep public props typed and exported where consumers need them.
- Avoid `any`; if unavoidable, contain it and explain why.
- Prefer inference for internal details and explicit types for public contracts.
- Use discriminated unions for genuinely different component modes.
- Type callback parameters and return behavior accurately.
- Do not expose internal implementation types unnecessarily.
- Ensure declarations and built types are included in package output.
- Validate the consumer-facing types with a clean package build.

## 6.2 React behavior

- Follow the React version and patterns supported by the repository.
- Do not use deprecated APIs or rely on undocumented framework behavior.
- Avoid unnecessary state and effects; derive values where possible.
- Clean up subscriptions, event listeners, observers, and timers.
- Avoid unstable keys and state updates after unmount.
- Keep expensive work out of render paths.
- Make controlled and uncontrolled modes explicit if both are supported.
- Define behavior for reset, disabled, loading, invalid, and empty values where relevant.
- Avoid global event listeners or portals unless the interaction requires them.
- Do not introduce hydration errors or server/client divergence in the documentation site.

## 6.3 Styling

- Use the repository's established styling system and design tokens.
- Avoid inline styles for static design values unless a dynamic value genuinely requires them.
- Keep selectors scoped and avoid global CSS side effects.
- Avoid specificity escalation and repeated `!important`.
- Do not require undocumented CSS selectors to customize a component.
- Document CSS variables, data attributes, slots, or class-name extension points that are intentionally public.
- Avoid styling based on fragile DOM structure.
- Test long text, localization-like strings, zoom, and narrow viewports.
- Do not assume every consumer uses the same Tailwind config unless the installation model guarantees and documents it.

## 6.4 Component composition

- Prefer composition and slots/children where they make the component more flexible.
- Avoid prop explosions and Boolean combinations that create unclear states.
- Do not create a universal component with dozens of unrelated modes.
- Keep lower-level components independent of application routing and backend services.
- Ensure composition does not break focus order, accessible names, or event propagation.
- Provide sensible defaults without hiding important behavioral choices.
- Do not swallow consumer callbacks or keyboard events without a clear reason.

## 6.5 Forms and validation

- Associate labels with controls.
- Provide accessible descriptions and error messages.
- Distinguish invalid state from help text.
- Do not rely only on color or placeholder text to explain a field.
- Preserve keyboard operation and expected browser form behavior.
- Do not implement fake validation that claims server-side validation occurred.
- Keep validation logic configurable and avoid imposing a schema library unless the feature justifies it.
- Document how form components work with native forms and any supported form libraries.

## 6.6 Overlays, menus, and popovers

- Handle focus entry, focus return, Escape, outside interaction, and stacking correctly.
- Use correct semantics for dialogs, menus, listboxes, and popovers; these patterns are not interchangeable.
- Prevent background interaction when a modal dialog requires modality.
- Avoid clipping content unexpectedly.
- Ensure portals work with themes and CSS scoping.
- Test nested overlay behavior where supported.
- Avoid hand-rolling complex keyboard interactions if a mature, license-compatible primitive can be used.
- Make destructive actions explicit and never trigger them from an ambiguous menu interaction.

## 6.7 Icons

- Follow the icon library and sizing rules in `DESIGN.md`.
- Use consistent stroke/visual weight and alignment.
- Mark decorative icons as hidden from assistive technology.
- Give icon-only buttons accessible names and tooltips where appropriate.
- Do not use emoji as a substitute for interface icons.
- Do not copy third-party icon assets without verifying their license.
- Avoid arbitrary icon containers, fills, and brand-colored badges.

---

# 7. ACCESSIBILITY REQUIREMENTS

Accessibility is a release requirement, not a later polish task.

## 7.1 Semantic HTML

- Use native elements when they provide the correct semantics and behavior.
- Use a button for an action and a link for navigation.
- Do not make generic `div` or `span` elements interactive without a compelling reason and complete keyboard semantics.
- Preserve heading hierarchy and landmarks.
- Use correct labels, descriptions, fieldsets, legends, and table semantics.
- Avoid positive `tabindex` values.
- Do not use ARIA to recreate native semantics unnecessarily.

## 7.2 Keyboard interaction

For every interactive component, document and test:
- How it receives focus.
- Which keys operate it.
- How focus moves between items.
- How it closes or exits.
- Where focus returns after dismissal.
- What happens when the component is disabled or removed.

At minimum, verify Tab/Shift+Tab, Enter, Space, Escape, and arrow keys where the pattern requires them. Do not invent keyboard conventions for established widgets.

## 7.3 Focus and screen readers

- Ensure focus is clearly visible against all supported themes.
- Never remove outlines without a strong replacement.
- Keep focus indicators inside viewport and not hidden under sticky content.
- Provide accessible names for icon-only controls.
- Use live regions only where useful; avoid announcing every minor visual update.
- Ensure status, validation, loading, and error changes are available to assistive technology.
- Do not duplicate accessible names by adding redundant labels and ARIA attributes.

## 7.4 Contrast, motion, and zoom

- Follow contrast requirements documented in `DESIGN.md` and applicable WCAG guidance.
- Test text, disabled states where required, borders that communicate essential boundaries, and focus indicators.
- Do not use color alone to indicate errors, selection, success, or status.
- Respect reduced-motion settings.
- Support browser zoom and larger text without clipping core controls.
- Test keyboard-only use and at least one screen-reader workflow for complex components when tooling is available.

## 7.5 Testing expectations

Use automated accessibility checks where available, but do not treat an automated scan as proof of full accessibility. Combine:
- Unit/component tests.
- Keyboard interaction tests.
- Automated axe or equivalent checks if the repository supports them.
- Manual review for complex focus and screen-reader behavior.
- Responsive and theme checks.

Record known limitations rather than claiming full compliance without evidence.

---

# 8. RESPONSIVE DESIGN AND VISUAL QUALITY

## 8.1 Responsive behavior

- Follow breakpoints and layout rules in `DESIGN.md`.
- Design for small screens and touch targets, not only desktop screenshots.
- Avoid horizontal overflow except in explicitly scrollable regions such as wide tables or code blocks.
- Keep navigation, dialogs, popovers, menus, and tables usable on narrow viewports.
- Avoid hover-only interactions.
- Do not shrink text or controls to force a desktop layout into mobile width.
- Ensure fixed and sticky elements do not obscure content or focus.

## 8.2 Visual QA

Review the actual rendered component, not just the source code. Where available, use screenshots at representative widths, both themes, and key states.

For a typical component, inspect:
- Default state.
- Hover, focus, pressed, disabled, loading, selected, invalid, success, and error states as applicable.
- Light and dark themes.
- Narrow, medium, and wide viewports.
- Long labels and overflowing content.
- Empty and populated states.
- Keyboard focus and overlay stacking.
- Reduced-motion behavior if animated.

Do not introduce gratuitous visual complexity. Visual quality means hierarchy, consistency, legibility, and appropriate feedback—not more shadows, gradients, borders, or animation.

## 8.3 Real previews only

The documentation preview must render the actual exported component or the exact source intended for installation. Do not create a visually similar mock component for the docs. Example data may be static if clearly presented as an example, but interactions and component behavior must be real.

---

# 9. REPOSITORY EXTRACTION, PROVENANCE, AND OPEN-SOURCE SAFETY

Aback UI is intended to reuse patterns from Aback Group applications, but extraction must be deliberate.

## 9.1 Audit workflow

For each candidate component or block found in another repository:

1. Identify its source repository, file path, current owner, and relevant commit/version.
2. Determine whether it is original Aback code, adapted third-party code, generated code, or a wrapper around a dependency.
3. Check the source repository's license and any relevant third-party licenses/notices.
4. Inspect dependencies and hidden assumptions.
5. Remove product-specific API calls, routes, business logic, account/tenant assumptions, billing rules, private endpoints, and data models.
6. Search for secrets, private URLs, internal identifiers, customer information, and sensitive telemetry.
7. Check accessibility, responsive behavior, API quality, test coverage, and design-token compatibility.
8. Refactor into the shared design system only after the above review.
9. Add tests, docs, and a provenance note when appropriate.
10. Validate the component in at least one real Aback product and in the public documentation/consumer fixture.

Do not infer that code is safe to publish merely because it is visible to the agent or present in an Aback repository.

## 9.2 Provenance records

Where extracted/adapted code creates ambiguity, record:
- Component or block name.
- Original repository and source path.
- Original author/ownership information where known.
- Whether code was copied, adapted, or independently reimplemented.
- Relevant commit or date.
- Third-party dependencies and licenses.
- Required notices or attribution.
- Review outcome and any excluded product-specific logic.

Do not add fabricated authorship or claim all code is original if that has not been verified.

## 9.3 Open-source license

The product is intended to be free and open source, but the final repository license must be confirmed by the owner and compatible with the code/assets being published. Do not unilaterally change license terms. Do not assume MIT is appropriate for every extracted asset or dependency. Preserve third-party notices and explain mixed-license constraints.

Before the first public release, verify:
- Root license is present and intentional.
- Package license metadata matches the actual license.
- Third-party notices are included where required.
- No private or unlicensed source has entered the public package.
- Examples and screenshots contain no real secrets or customer data.
- Contribution terms and copyright expectations are documented.

---

# 10. DOCUMENTATION WEBSITE AND DEVELOPER EXPERIENCE

## 10.1 Website is part of the product

The docs website should help a developer discover, understand, install, customize, and troubleshoot Aback UI. It should not be only a marketing homepage.

Core surfaces should include, as justified by the repository's current stage:
- Home / introduction.
- Installation and setup.
- Getting started.
- Components catalogue.
- Individual component pages.
- Blocks catalogue and block pages.
- Design tokens and themes.
- Registry/CLI installation guide if shipped.
- Examples and recipes.
- Accessibility guidance.
- Theming and customization.
- Migration and release notes.
- Contribution guide.
- GitHub/source links.
- Clear component status labels.

Do not create routes that only contain a title and placeholder. If a route is visible, it must contain useful content or be explicitly marked as not yet available.

## 10.2 Component documentation contract

Each stable component page should include, as applicable:

1. Name and concise purpose.
2. Stability status.
3. Installation command or source-copy instructions that have been verified.
4. Import path and required styles/tokens.
5. Live preview using the actual component.
6. Minimal usage example.
7. API/prop reference, including defaults where meaningful.
8. Variants and sizes.
9. Composition examples.
10. Keyboard behavior and accessibility notes.
11. Theme and responsive behavior.
12. Dependencies and peer dependencies.
13. Customization points.
14. Known limitations.
15. Related components.
16. Version or last-reviewed metadata when useful.

Examples must compile and should be kept in sync with the public API. Do not document a prop before it exists or leave removed props in the docs.

## 10.3 Search, navigation, and command UI

If the site includes component search, command search, filters, or navigation:
- Search must return relevant real routes/items.
- Empty results need a useful recovery path.
- Keyboard navigation and Escape behavior must work.
- The trigger must have an accessible name and shortcut labels must match actual shortcuts.
- Do not advertise a shortcut that is not implemented.
- Preserve direct URLs and browser back/forward behavior.
- Do not require an account to browse public documentation unless the owner explicitly changes the product direction.

## 10.4 SEO and public metadata

- Use accurate page titles, descriptions, canonical URLs, and social metadata.
- Avoid duplicate or misleading metadata.
- Use semantic headings and crawlable links.
- Keep structured data factual and valid.
- Do not generate indexable pages with thin or duplicate content just to increase route count.
- Do not claim compatibility, security, accessibility, or feature support without evidence.
- Keep documentation examples accessible and useful even if JavaScript enhancements fail where practical.

## 10.5 Performance

- Avoid shipping the entire component catalogue to every page.
- Keep documentation examples and syntax highlighting reasonably efficient.
- Use code splitting where appropriate.
- Avoid unnecessary client components and hydration.
- Do not add heavy animation or visualization packages without a clear need.
- Measure before optimizing and record meaningful regressions.
- Ensure the docs site remains usable on a slow connection and on mobile.

---

# 11. DESIGN TOKENS AND THEMING IMPLEMENTATION

## 11.1 Token architecture

Use semantic tokens for roles and primitive tokens for palette/scale values where appropriate. The exact implementation should follow `DESIGN.md` and the existing repository.

Typical semantic roles include:
- Canvas/background and surface/card/popover.
- Foreground/ink and muted text.
- Primary/action and on-action.
- Brand accents and on-brand text.
- Border/hairline/separator/input.
- Focus ring.
- Destructive, success, warning, and informational statuses.
- Overlay and scrollbar.
- Typography roles, spacing, sizing, breakpoints, elevation, motion, and z-index.

Do not add a new token name for every isolated visual occurrence. Prefer reusing the correct semantic role. Avoid ambiguous names such as `blue`, `gray2`, or `lightBorder` in component APIs when a semantic role is clearer.

## 11.2 Token source and generated output

If tokens are represented in multiple formats (CSS, TypeScript, Tailwind configuration, JSON), define which file is canonical and how derived files are generated. Do not manually maintain multiple divergent copies.

If code generation is used:
- The generator must be deterministic.
- Generated files must be clearly identified.
- The generation command must be documented and tested.
- CI should detect stale generated output where practical.
- Do not hand-edit generated artifacts unless the workflow explicitly permits it.

## 11.3 Theme and consumer integration

Document:
- How the consumer imports CSS.
- How the theme is selected.
- Which CSS variables are public.
- How to override a token safely.
- How components inherit a consumer theme.
- How dark mode behaves.
- What assumptions the package makes about Tailwind or CSS processing.

Do not force a global reset or theme that unexpectedly changes unrelated consumer application styles.

---

# 12. SECURITY AND PRIVACY

A component library has a smaller service surface than a SaaS product, but public code, install commands, docs, and build tooling still create risk.

## 12.1 General security rules

- Treat all user-provided strings and rendered content as untrusted.
- Avoid unsafe HTML injection. If raw HTML is genuinely needed, document and sanitize the boundary.
- Do not use `eval`, `new Function`, or dynamic code execution for ordinary component behavior.
- Do not put secrets in client bundles or public examples.
- Do not fetch or execute remote code at runtime unless explicitly required, reviewed, and documented.
- Avoid dependencies with known unresolved critical vulnerabilities.
- Keep dependency versions and lockfiles consistent with the chosen package manager.
- Validate URLs and link targets where they come from user-controlled input.
- Use safe external-link behavior and appropriate `rel` attributes where needed.
- Avoid logging form contents, secrets, or private consumer data in examples or telemetry.

## 12.2 Registry and install tooling

If an installer or registry CLI exists:
- Validate package names, paths, URLs, and registry metadata.
- Prevent path traversal and writes outside the intended project directory.
- Never execute scripts from registry content automatically without clear, informed user action.
- Do not overwrite files silently.
- Make network destinations transparent.
- Validate checksums/signatures if the distribution architecture supports them.
- Provide a dry-run or preview where it is practical and safe.
- Handle malformed or malicious registry metadata without arbitrary code execution.
- Keep the registry schema versioned and validate it in CI.

## 12.3 Documentation and demo safety

- Use synthetic example data.
- Never embed production API keys, access tokens, private customer names, or internal service URLs.
- Ensure copyable examples do not encourage insecure patterns.
- Do not present a frontend-only permission check as authorization.
- Make it clear when examples omit server-side validation for brevity.
- Do not make demos call real Aback production endpoints by default.

## 12.4 Privacy

- Public docs should not require user accounts for ordinary browsing or installation.
- Any analytics/telemetry added to the documentation site must be minimal, disclosed, and consistent with the owner's privacy direction.
- Do not collect code snippets, clipboard contents, form values, or component props for analytics.
- Do not introduce tracking pixels or third-party scripts without review.
- Keep privacy claims accurate and based on the actual implementation.

---

# 13. DEPENDENCIES AND THIRD-PARTY INTEGRATIONS

Before adding a dependency, check:
- Does the existing platform or code already solve the problem?
- Is the dependency actively maintained and compatible with supported React/runtime versions?
- What is its package size and runtime impact?
- What is its license and attribution requirement?
- Does it add client-only behavior, CSS assumptions, or global side effects?
- Is it necessary for the core library or only for a docs demo?
- Can it be an optional peer dependency rather than mandatory?
- Does it introduce security or supply-chain risk?
- Does it create a public API commitment?

Prefer established, accessible low-level primitives for complex interactions when license and architecture allow. Do not reimplement a complex dialog, menu, combobox, or focus manager from scratch just to avoid a small dependency. Conversely, do not add a large library for a trivial component.

Document external dependencies and the minimum versions needed. Keep documentation-only dependencies out of the core package.

---

# 14. TESTING STRATEGY

## 14.1 Test pyramid

Use the repository's existing test stack where it is sound. The overall strategy should include:

### Unit/component tests
- Rendering and default behavior.
- Prop/variant behavior.
- Controlled/uncontrolled behavior if supported.
- Callback semantics.
- Disabled and loading behavior.
- Empty, invalid, and boundary values.
- Keyboard interactions.
- Focus management for interactive components.
- Theme and token assumptions where testable.

### Accessibility tests
- Accessible names and roles.
- Label and description relationships.
- Keyboard navigation.
- Focus return and dismissal.
- Automated axe or equivalent checks where supported.
- Manual review for complex widgets.

### Integration tests
- Components composed together.
- Overlay stacking and portals.
- Forms and validation.
- Registry installation into a fixture project.
- Package consumption from built output.
- Theme behavior in a consumer application.

### Visual/regression tests
- Representative viewport sizes.
- Light and dark themes.
- Key interactive states.
- Long text and overflow.
- Only add screenshot tooling when it provides reliable value and can be maintained.

### Build and release tests
- Type-check.
- Lint.
- Unit and integration tests.
- Package build.
- Public export checks.
- Documentation build.
- Registry schema validation.
- Consumer fixture install/build.
- Package contents and license notice checks.

## 14.2 Required test quality

- Test behavior rather than implementation details.
- Avoid brittle snapshots as the only evidence of correctness.
- Use realistic but synthetic data.
- Do not mock the very behavior the test claims to validate.
- Test failure and cancellation paths, not only happy paths.
- Do not skip a failing test without documenting the reason and follow-up.
- Keep tests deterministic and independent of network availability where possible.
- If a test requires external access, clearly label it and provide a stable alternative for CI.

## 14.3 Minimum release gate

Before a stable release, relevant checks must pass:
- Type-check and lint.
- Unit tests.
- Build all published packages.
- Build the documentation site.
- Validate package exports and type declarations.
- Validate registry entries and install them in a clean fixture.
- Check representative components for keyboard and accessibility behavior.
- Verify examples and install commands.
- Inspect package contents for accidental private files.
- Review dependency and license changes.
- Confirm changelog and version changes.

If a check cannot run in the environment, report it explicitly and do not claim release readiness without explaining the gap.

---

# 15. COMPONENT STATUS AND MATURITY

Use explicit maturity labels in docs and metadata. Suggested statuses:

- **Experimental:** API or behavior may change; limited validation.
- **Beta:** Useful and tested, but known gaps or expected API evolution remain.
- **Stable:** Public API, behavior, docs, and tests are maintained under the compatibility policy.
- **Deprecated:** A replacement or removal path is documented.
- **Removed:** No longer part of the current release; migration guidance remains if needed.

Do not label a component stable just because it renders. Stable means it has a clear API, accessibility review, theme support, tests, docs, and an understood dependency/compatibility profile.

Keep a component catalogue or status file updated when status changes. Do not imply that every component has equal maturity.

---

# 16. VERSIONING, RELEASES, AND DISTRIBUTION

## 16.1 Versioning

- Use a consistent versioning strategy appropriate to the published package(s).
- Explain whether packages are versioned together or independently.
- Follow semantic versioning where it accurately communicates compatibility.
- Document breaking changes and migration steps.
- Do not publish from an unclean or unreviewed state.
- Do not publish a package version manually if the repository has an established release pipeline that should be used.

## 16.2 Release checklist

Before publishing:
1. Confirm the intended branch and working tree.
2. Review the full diff and public API changes.
3. Run all required checks.
4. Build packages and docs from a clean state.
5. Validate registry entries and a clean consumer installation.
6. Inspect package contents and generated files.
7. Review dependency, license, and security changes.
8. Update changelog/release notes.
9. Confirm version and tag consistency.
10. Verify that publishing credentials are supplied securely by the release environment.
11. Publish only through the approved workflow.
12. Verify the published artifact and installation instructions.
13. Record known issues and rollback procedure.

Do not print or expose release tokens. Do not publish or deploy unless the user explicitly requested the action and the environment permits it.

## 16.3 Free/open-source direction

The initial product is intended to be free and open source. Do not add paywalls, sign-in requirements, paid component tiers, usage quotas, Dodo Payments, Stripe, or another billing provider unless the owner explicitly approves a product-direction change. Do not add hosted dependencies that make basic component use contingent on Aback's infrastructure.

---

# 17. PERFORMANCE AND PACKAGE QUALITY

- Keep core runtime dependencies lean.
- Avoid importing the entire icon set or component catalogue when a small import is sufficient.
- Preserve tree-shaking and avoid unnecessary top-level side effects.
- Avoid shipping documentation-only code in production packages.
- Do not require large global CSS bundles without a clear reason and documented tradeoff.
- Lazy-load heavy docs previews or advanced demos when useful.
- Avoid layout shifts in documentation previews.
- Keep components responsive during state updates.
- Test large data examples for tables, lists, and command interfaces.
- Do not claim a bundle-size target without measuring the built artifact.
- Measure package output and runtime impact before and after major dependencies.

---

# 18. CONTRIBUTIONS AND MAINTENANCE

## 18.1 Contribution expectations

A contribution should include, as appropriate:
- Clear problem statement.
- Proposed behavior and API.
- Design-token alignment.
- Tests.
- Documentation and usage example.
- Accessibility review.
- Dependency/license notes.
- Screenshot or visual evidence for meaningful UI changes.
- Migration note for public API changes.

## 18.2 Component proposal checklist

Before adding a new component, ask:
- Is this a repeated problem or a one-off product layout?
- Does an existing component already cover it?
- Should it be a primitive, composed component, application pattern, or block?
- What is the smallest useful public API?
- Which accessibility pattern applies?
- What are the loading, disabled, error, empty, and responsive states?
- Does it need a dependency?
- Does it work without Aback-specific backend services?
- Is its provenance clear?
- Can it be documented and tested at a reasonable maintenance cost?

## 18.3 Avoid unnecessary complexity

Do not add abstractions, packages, configuration layers, code generators, plugins, or release automation before there is a concrete need. Prefer boring, understandable engineering. A small well-maintained component library is better than a sophisticated platform with unclear benefits.

---

# 19. PHASED IMPLEMENTATION PLAN

This is a recommended sequence, not permission to skip repository audit or ignore existing progress. Adjust it based on what is already implemented and record the reason for changes.

## Phase 0 — Audit and foundation

- Inspect repository and current architecture.
- Confirm package manager, framework, styling system, test setup, publishing intent, and license.
- Read `DESIGN.md` and inventory design tokens.
- Audit the referenced Aback repositories for reusable components and blocks.
- Create a provenance/inventory table with source, dependencies, reuse potential, license, accessibility gaps, and priority.
- Define canonical source and package/registry strategy.
- Write architecture and contribution guidance as needed.

**Exit criteria:** Repository is understood, license/provenance risks are recorded, design authority is clear, and a small first component slice is selected.

## Phase 1 — Tokens and component foundation

- Implement semantic tokens and light/dark theme behavior.
- Establish styling conventions and package exports.
- Build a small set of foundational components with high reuse value.
- Add tests, examples, and component docs for every published component.
- Verify the library can be consumed from a minimal fixture app.

**Exit criteria:** A real consumer app can install and render the first components with documented styles and correct types.

## Phase 2 — Core interactions

- Add commonly needed form controls, overlays, navigation primitives, and feedback components based on actual use cases.
- Verify keyboard and focus behavior.
- Test light/dark themes and responsive states.
- Add dependency/license documentation where relevant.

**Exit criteria:** Core components behave consistently and have meaningful automated and manual validation.

## Phase 3 — Documentation and developer experience

- Build a searchable component catalogue.
- Use actual components in previews.
- Add install instructions, API references, examples, and accessibility notes.
- Implement working copy controls and route navigation.
- Add a component status catalogue.
- Ensure direct links, mobile navigation, and theme selection work.

**Exit criteria:** An external developer can find a component, understand it, install it, and use it without undocumented repository knowledge.

## Phase 4 — Registry and blocks

- Implement a registry only after the canonical component source and schema are stable enough.
- Add a small set of high-value blocks based on recurring patterns in Aback apps.
- Test registry installation in a clean fixture.
- Document customization, dependencies, overwrite behavior, and upgrade tradeoffs.

**Exit criteria:** A copied component/block works outside the monorepo and does not rely on hidden paths or private services.

## Phase 5 — Real product integration

- Integrate selected components into at least one Aback application.
- Validate that the abstraction supports real product needs.
- Record integration friction and API gaps.
- Avoid changing the shared API solely to accommodate one app if composition can solve it.
- Ensure product-specific code stays in the consuming app.

**Exit criteria:** Components are proven in real product use and remain independent of product-specific business logic.

## Phase 6 — Public open-source release

- Confirm license and provenance.
- Complete documentation and contribution guidance.
- Verify package and registry artifacts.
- Run security, accessibility, and clean-install checks.
- Add release notes and issue/reporting instructions.
- Publish only after owner approval.

**Exit criteria:** External developers can install and use the published artifacts, and maintainers can support and version them responsibly.

---

# 20. DEFINITION OF DONE

A component, block, feature, or release is done only when the applicable requirements below are satisfied.

## Component done
- Solves a clear reusable problem.
- Has a coherent typed API and sensible defaults.
- Uses the design tokens and theme rules.
- Has correct semantics and keyboard behavior.
- Handles relevant loading, disabled, error, empty, and boundary states.
- Works at supported viewport sizes.
- Has tests appropriate to its complexity.
- Has a real documentation example and API notes.
- Has no undocumented private product dependencies.
- Has provenance and license reviewed.
- Has dependency and compatibility notes where relevant.

## Registry item done
- Has valid schema and metadata.
- References canonical source or a documented generated artifact.
- Has correct dependency information.
- Installs into a clean fixture.
- Uses no hidden monorepo aliases.
- Does not overwrite files silently.
- Has documentation and a stable identifier.
- Has any necessary license notices.

## Documentation feature done
- Real route and useful content exist.
- Links and navigation work.
- Code examples match the actual API.
- Copy/install actions work.
- Previews use the actual implementation.
- Search/filters behave correctly if present.
- Mobile and keyboard behavior are verified.
- SEO metadata is accurate.
- No private data or unverified claims appear.

## Release done
- Required checks ran and their results are recorded.
- Packages and docs build.
- Public exports and types are validated.
- Registry installs in a clean fixture.
- License/provenance and dependency changes are reviewed.
- Changelog and version are correct.
- Published artifact is verified if publishing was authorized.
- Known limitations and unverified areas are disclosed.

---

# 21. REQUIRED AGENT REPORT

At the end of meaningful work, provide a concise report with:

1. **Summary:** What changed and why.
2. **Files:** Important files created or modified.
3. **Design/API decisions:** Public props, tokens, package exports, or architecture decisions.
4. **Validation:** Exact commands run and pass/fail results.
5. **Visual/accessibility review:** What was checked and what was not.
6. **Compatibility:** Consumer/package/registry validation performed.
7. **License/provenance:** Any source extraction or dependency implications.
8. **Remaining work:** Known issues, assumptions, risks, and unverified claims.

Never report “all tests passed” without listing or otherwise identifying the tests actually run. If validation was impossible, state why and give the next command or action needed.

---

# 22. OWNER APPROVAL REQUIRED

Ask for explicit owner approval before:
- Changing the product's free/open-source direction or adding monetization.
- Changing the core framework, package manager, registry architecture, or distribution strategy in a consequential way.
- Changing or relicensing existing code/assets or choosing a root license when ownership is unclear.
- Publishing packages or deploying the public site when the request did not authorize it.
- Introducing telemetry or third-party tracking.
- Publishing extracted code when provenance, license, or ownership is uncertain.
- Making a breaking public API change without an approved migration strategy.
- Adding a dependency with significant security, licensing, bundle, or maintenance impact.
- Adding features that require a hosted Aback service for ordinary library usage.
- Deleting or replacing substantial existing code.
- Claiming compatibility, accessibility compliance, or security guarantees that have not been validated.

For ordinary implementation choices, do not block on approval when a small, reversible, standards-aligned decision is sufficient. State the assumption and proceed.

---

# 23. FINAL PRODUCT RULE

**Aback UI must make real applications easier to build—not merely make the documentation website look impressive.**

Every component should earn its place through reuse, clarity, accessibility, and maintainability. Every public example should work. Every extracted source should be safe and license-compatible to publish. Every release should be supported by evidence.

Build for Aback first, engineer for reuse, and release responsibly for everyone.
