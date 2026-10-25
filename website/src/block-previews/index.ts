import type { ComponentType } from "react";

import { DashboardShellPreview } from "./dashboard-shell-preview";
import {
  ArticleLayoutPreview,
  ContactFormPreview,
  CookieConsentPreview,
  CtaBannerPreview,
  FaqPreview,
  FeatureGridPreview,
  HeroPreview,
  NewsletterPreview,
  NotFoundPreview,
  PricingPreview,
  SiteFooterPreview,
  SiteHeaderPreview,
} from "./previews";
import { SettingsSectionBlock } from "@registry/blocks/settings-section";
import { SignInBlock } from "@registry/blocks/sign-in";
import { UsersTableBlock } from "@registry/blocks/users-table";

export const blockPreviewMap: Record<string, ComponentType> = {
  "sign-in": SignInBlock,
  "dashboard-shell": DashboardShellPreview,
  "settings-section": SettingsSectionBlock,
  "users-table": UsersTableBlock,
  "site-header": SiteHeaderPreview,
  "site-footer": SiteFooterPreview,
  hero: HeroPreview,
  "feature-grid": FeatureGridPreview,
  pricing: PricingPreview,
  faq: FaqPreview,
  newsletter: NewsletterPreview,
  "cta-banner": CtaBannerPreview,
  "cookie-consent": CookieConsentPreview,
  "not-found": NotFoundPreview,
  "contact-form": ContactFormPreview,
  "article-layout": ArticleLayoutPreview,
};
