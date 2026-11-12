# Provenance

Aback UI is built for Aback Group products first, then engineered for reuse. This record covers the origin of the initial source.

## Source review

| Source | What was reviewed | Outcome |
| --- | --- | --- |
| Aback Tools (`abacktools.com`) | `src/components/ui`, `src/components/common`, `src/app/globals.css`, `DESIGN.md` | Patterns and tokens were reviewed, product logic removed, and components reimplemented for a general API. |
| Aback Launch (`abacklaunch.com`) | `src/components/ui`, `src/app/globals.css`, component usage across the launch, blog, and account surfaces | Overlay, alert, data display, and form patterns informed the shared implementations. No auth, billing, or launch-specific code was copied. |
| Aback Group (`aback.group`) | `components/ui`, `components/site-header.tsx`, `components/sections`, `components/products/product-status.tsx`, `components/theme-toggle.tsx` | Header, section heading, status badge, and theme toggle patterns informed the shared implementations. No product directory data was copied. |

No Aback product's API clients, internal endpoints, tenant or account assumptions, billing rules, analytics payloads, or customer data are part of this repository. Components are independent of Aback product backends.

## Third-party software

| Dependency | License | Use |
| --- | --- | --- |
| React | MIT | Component runtime |
| Radix UI (`radix-ui`) | MIT | Accessible dialog, menu, select, tooltip, tabs, accordion, checkbox, switch, label, separator, slot primitives |
| Tabler Icons | MIT | Interface icons |
| Tailwind CSS | MIT | Styling primitives |
| class-variance-authority | Apache-2.0 | Variant APIs |
| clsx | MIT | Class composition |
| tailwind-merge | MIT | Class conflict resolution |
| Geist (font) | SIL Open Font License 1.1 | Typeface, self-hosted through the `geist` package |

No third-party component source was copied verbatim. Behavior follows the public WAI-ARIA Authoring Practices and each primitive's documented API.

The Aback mark and Aback Blue color are brand assets of Aback Group. The MIT license covers the code, not the trademarks.

## Additions

Add a row here when a component is adapted from another repository or a third-party source, including the source path, commit or date, license, required notices, and a summary of what changed. Do not publish extracted code while ownership or license is unclear.

### October 2026: patterns from the three Aback products

Reviewed at Aback Tools `ba7a6e621`, Aback Launch `837a71a`, and Aback Group `df744d0` (all 2026-10-24/25). The three repositories carry no license file and are owned by Aback Group. Nothing below was copied: each item was **independently reimplemented** from the pattern for a general API, at the owner's request.

| Aback UI item | Source pattern | Excluded from the source |
| --- | --- | --- |
| Copy Button | Tools `common/CopyButton.tsx`, Launch `launch/CopyTextButton.tsx` | i18n hooks, agent markers (`data-agent-*`) |
| Input Group | Tools `common/field-affix.tsx`, `common/SearchBar.tsx` | i18n hooks |
| Dropzone | Tools `common/DropZone.tsx`, `common/MultiDropZone.tsx` | Tool text provider, agent markers |
| Rating | Launch `feedback/components/FeedbackRatingStars.tsx` | Feedback form wiring |
| Stat | Tools `common/StatTile.tsx`, `common/StatGrid.tsx`; Launch `sections/stats/StatItem.tsx` | Tone aliases, legacy colour mapping, i18n |
| Description List | Tools `common/KeyValueRows.tsx` | i18n hooks |
| Relative Time | Launch `common/RelativeTime.tsx` | English-only formatter (replaced by `Intl.RelativeTimeFormat`) |
| Steps | Launch `sections/how-it-works/StepCard.tsx`; DESIGN.md 11.8 step marker | Launch copy |
| Code Block | Tools `blog/BlogCodeBlock.tsx`, `common/TextOutputBox.tsx` | Download action, blog styling |
| Layout | Tools `layout-primitives`, Launch `layout-primitives` | The deprecated numeric `Stack` |
| Section Heading | Group `sections/section-heading.tsx`, Tools `common/SectionHeader.tsx` | None |
| Theme Toggle | Tools `common/ThemeToggle.tsx`, Group `theme-toggle.tsx` | next-themes provider, i18n |
| Skip Link | DESIGN.md 11.3 and the shells of all three products | None |
| Table of Contents | Tools `blog/BlogTableOfContents.tsx`, Launch `legal/LegalTableOfContents.tsx` | Blog-specific markup |
| Reading Progress | Tools and Launch `BlogReadingProgress.tsx` | None |
| Share Buttons | Tools `blog/BlogShareButtons.tsx`, Launch `launch/ShareButton.tsx` | Share analytics events |
| Avatar Group | Launch `sections/social-proof/FounderAvatarCluster.tsx` | Analytics impression event, founder data |
| Badge `danger`, `info`, `dot` | Group `products/product-status.tsx`, Tools `common/StatusBadge.tsx` | Product status map |
| Site header, Site footer | Group `site-header.tsx`, `site-footer.tsx`; Launch `navigation/Navbar.tsx`, `sections/footer`; Tools `layout/Navbar.tsx`, `layout/Footer.tsx` | Locale switcher, ad slots, product links |
| Hero, Feature grid, Call to action | Launch `sections/hero`, `sections/features`, `sections/cta`; Group `sections/hero.tsx` | Live platform stats, launch scheduler |
| Pricing | Launch `sections/pricing/PricingCard.tsx` | Geo pricing, checkout |
| FAQ | Tools `common/FAQSection.tsx`, `FAQSchema.tsx`; Launch `sections/faq` | Product questions |
| Newsletter signup | Tools `layout/NewsletterSignup.tsx`, Launch `newsletter/components/NewsletterInlineForm.tsx` | Provider API calls, analytics |
| Cookie consent | Launch `analytics/AnalyticsConsentBanner.tsx` | Google tag loading |
| Not found | Tools 404 page, Launch `common/NotFoundContent.tsx` | Product links |
| Contact form | Launch `contact/ContactForm.tsx` | Server action, rate limiting |
| Article layout | Tools `blog/BlogPostLayout.tsx`, `guides/GuidePostLayout.tsx`; Launch `blog/BlogPostView.tsx` | Ad slots, CMS loading, related posts |

### November 2026: gaps found in Aback Tools, Aback Launch, and Aback Audit

Reviewed at Aback Tools `f1e8241af`, Aback Launch `da02873`, and Aback Audit `a9ac6f5` (all read on 2026-11-11). The three repositories carry no license file and are owned by Aback Group. Nothing below was copied: each item was **independently reimplemented** from the pattern for a general API, at the owner's request. Aback Audit already imports the published packages, so its source was read for what it had to write by hand.

| Aback UI item | Source pattern | Excluded from the source |
| --- | --- | --- |
| Button `loading`, `loadingText` | Tools `common/ActionButton.tsx` (DESIGN.md 11.1); Launch `contact/components/ContactSubmitButton.tsx`; Audit's inline spinner buttons | i18n hooks, agent markers (`data-agent-action`), the `icon` prop (the spinner replaces the button's own icon instead) |
| Field wiring, `orientation`, `action` | Tools `common/LabeledInput.tsx`, `LabeledNumberInput.tsx`, `LabeledSelect.tsx`, `CheckboxGroup.tsx`, `TextOutputBox.tsx`; Launch `contact/components/FormFieldWrapper.tsx`, `ui/field-error.tsx` | Agent field keys, the value and onChange wrappers (the control keeps its own props), focus helpers |
| Meter | Tools' hand-written score and usage bars (844 `role="progressbar"` elements used as readings); Launch `karma/KarmaSummary.tsx`; Audit `report/ReportPage.tsx` score bars | Score thresholds and rating words, which stay in the product |
| Item | Tools `common/FeatureItem.tsx`, `UseCaseItem.tsx`, `InfoBlock.tsx` (icon mode), `RelatedToolCard.tsx`, `FileInfo.tsx` (DESIGN.md 9.3, 11.7); Audit's link cards | The icon-prop resolver, bold-marker text parsing, tool registry lookups |
| Panel | Tools `common/Panel.tsx` (DESIGN.md 11.6 options panel) | Tool text provider |
| Prose | Aback UI website `components/prose.tsx` (original to this repository, now removed in favour of the component); Audit `web/styles/globals.css` `.prose-aback`; DESIGN.md 11.8 | The `display: block` table rule from Audit, which can drop table semantics in some browsers |
| Listbox | Launch `ui/select.tsx`, a Radix Select wrapper; Audit `scripts/lib/select.ts`, a hand-written listbox | Launch's rounded and item-aligned defaults |
| Theme focus outline | Audit `web/styles/globals.css`, which restores the outline the theme removed | None |

Listbox is built on the Radix UI Select primitive from the `radix-ui` package already listed above (MIT). No dependency was added.

### Brand assets

`website/public/aback-logo-128.png` is copied from Aback Tools `public/` (identical to Aback Group's). `apple-touch-icon.png`, `icon-192.png`, and `icon-512.png` are copied from Aback Launch `public/`. They are Aback Group trademarks used by the documentation site, not part of any npm package or registry item, and not covered by the MIT license.
