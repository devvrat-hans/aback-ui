"use client";

import * as React from "react";
import {
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandReddit,
  IconBrandWhatsapp,
  IconBrandX,
  IconMail,
  IconShare,
  type Icon,
} from "@tabler/icons-react";

import { cn } from "../lib/utils";
import { buttonVariants } from "./button";
import { CopyButton } from "./copy-button";

export type ShareNetwork = "x" | "linkedin" | "facebook" | "whatsapp" | "reddit" | "email";

interface NetworkConfig {
  name: string;
  icon: Icon;
  href: (url: string, title: string) => string;
}

const networks: Record<ShareNetwork, NetworkConfig> = {
  x: {
    name: "X",
    icon: IconBrandX,
    href: (url, title) =>
      `https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  linkedin: {
    name: "LinkedIn",
    icon: IconBrandLinkedin,
    href: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  facebook: {
    name: "Facebook",
    icon: IconBrandFacebook,
    href: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  whatsapp: {
    name: "WhatsApp",
    icon: IconBrandWhatsapp,
    href: (url, title) => `https://wa.me/?text=${encodeURIComponent(title ? `${title} ${url}` : url)}`,
  },
  reddit: {
    name: "Reddit",
    icon: IconBrandReddit,
    href: (url, title) =>
      `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
  email: {
    name: "email",
    icon: IconMail,
    href: (url, title) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
  },
};

/** Builds the share URL for one network. Exported for custom layouts. */
function shareUrl(network: ShareNetwork, url: string, title = "") {
  return networks[network].href(url, title);
}

function subscribeNothing() {
  return () => {};
}

export interface ShareButtonsProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** The absolute URL being shared. */
  url: string;
  /** Used as the post text or email subject where the network supports it. */
  title?: string;
  networks?: ShareNetwork[];
  /** Add a copy-link button. */
  copyLink?: boolean;
  /** Add a native share button where the browser offers the Web Share API. */
  nativeShare?: boolean;
  /** Show network names next to the icons. */
  showLabels?: boolean;
}

/**
 * Share links for a page. Each network is a plain link that opens in a new
 * tab with `noopener`, so nothing loads from a third party until someone
 * chooses to share. Every control has an accessible name.
 */
function ShareButtons({
  url,
  title = "",
  networks: selected = ["x", "linkedin"],
  copyLink = true,
  nativeShare = false,
  showLabels = false,
  className,
  "aria-label": ariaLabel = "Share",
  ...props
}: ShareButtonsProps) {
  const canShare = React.useSyncExternalStore(
    subscribeNothing,
    () => typeof navigator !== "undefined" && typeof navigator.share === "function",
    () => false,
  );
  const size = showLabels ? "sm" : "icon-sm";

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      data-slot="share-buttons"
      className={cn("flex flex-wrap items-center gap-1.5", className)}
      {...props}
    >
      {nativeShare && canShare ? (
        <button
          type="button"
          className={buttonVariants({ variant: "outline", size })}
          aria-label={showLabels ? undefined : "Share"}
          onClick={() => {
            navigator.share({ url, title: title || undefined }).catch(() => {
              // The visitor closed the share sheet; nothing to report.
            });
          }}
        >
          <IconShare aria-hidden="true" />
          {showLabels ? "Share" : null}
        </button>
      ) : null}
      {selected.map((network) => {
        const config = networks[network];
        const Icon = config.icon;
        const label = network === "email" ? "Share by email" : `Share on ${config.name}`;
        return (
          <a
            key={network}
            href={shareUrl(network, url, title)}
            target={network === "email" ? undefined : "_blank"}
            rel={network === "email" ? undefined : "noopener noreferrer"}
            aria-label={showLabels ? undefined : label}
            title={showLabels ? undefined : label}
            className={cn(buttonVariants({ variant: "outline", size }), "text-muted-foreground hover:text-foreground")}
          >
            <Icon aria-hidden="true" />
            {showLabels ? <span>{network === "email" ? "Email" : config.name}</span> : null}
          </a>
        );
      })}
      {copyLink ? (
        <CopyButton
          value={url}
          variant="outline"
          label="Copy link"
          copiedLabel="Link copied"
          showLabel={showLabels}
          className="text-muted-foreground hover:text-foreground"
        />
      ) : null}
    </div>
  );
}

export { ShareButtons, shareUrl };
