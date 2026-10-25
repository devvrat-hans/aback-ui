"use client";

import { useCallback, useSyncExternalStore, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

export type ConsentDecision = "accepted" | "rejected";

export interface CookieConsentBlockProps {
  /** What you are asking for and what happens either way. Be specific. */
  message: ReactNode;
  /** Called with the visitor's choice. Load optional scripts only after "accepted". */
  onDecision: (decision: ConsentDecision) => void;
  /** Where the choice is remembered. Pass null to keep nothing, for example in a preview. */
  storageKey?: string | null;
  acceptLabel?: string;
  rejectLabel?: string;
  /** Your cookie or privacy policy. */
  policyHref?: string;
  policyLabel?: string;
}

const EVENT = "aback-ui:consentchange";

function readDecision(key: string | null): ConsentDecision | null {
  if (!key) return null;
  try {
    const value = window.localStorage.getItem(key);
    return value === "accepted" || value === "rejected" ? value : null;
  } catch {
    return null;
  }
}

/**
 * A consent banner that does not block the page: no overlay, no scroll lock,
 * and two equally prominent buttons, so declining is as easy as accepting.
 * It appears until the visitor answers and remembers the answer.
 */
export function CookieConsentBlock({
  message,
  onDecision,
  storageKey = "cookie-consent",
  acceptLabel = "Allow analytics",
  rejectLabel = "Decline",
  policyHref,
  policyLabel = "Cookie policy",
}: CookieConsentBlockProps) {
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  // The server snapshot reports "answered" so the banner never flashes in the
  // HTML for a visitor who already chose; it appears after hydration if needed.
  const decided = useSyncExternalStore(
    subscribe,
    () => readDecision(storageKey ?? null) !== null,
    () => true,
  );

  if (decided && storageKey) return null;

  function decide(decision: ConsentDecision) {
    if (storageKey) {
      try {
        window.localStorage.setItem(storageKey, decision);
      } catch {
        // Not remembered, but the decision still applies to this page view.
      }
      window.dispatchEvent(new Event(EVENT));
    }
    onDecision(decision);
  }

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 p-3 shadow-[0_-2px_8px_rgb(0_0_0/0.06)] backdrop-blur-sm sm:p-4"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {message}
          {policyHref ? (
            <>
              {" "}
              <a
                href={policyHref}
                className="font-medium text-link underline underline-offset-4 hover:text-link-hover"
              >
                {policyLabel}
              </a>
            </>
          ) : null}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <Button type="button" size="sm" variant="outline" className="flex-1 sm:flex-none" onClick={() => decide("rejected")}>
            {rejectLabel}
          </Button>
          <Button type="button" size="sm" variant="brand" className="flex-1 sm:flex-none" onClick={() => decide("accepted")}>
            {acceptLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
