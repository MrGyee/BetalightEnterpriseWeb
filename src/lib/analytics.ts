"use client";

// Thin wrapper around the GA4 gtag() call already loaded in
// components/shared/cookie-consent.tsx. No-ops if analytics hasn't loaded
// (e.g. the user declined cookies), so callers never need to guard this.
type GtagFn = (command: "event", eventName: string, params?: Record<string, unknown>) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
  }
}

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", eventName, params);
}
