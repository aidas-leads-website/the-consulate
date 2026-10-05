// Vendor-neutral analytics events for the goals in Requirements.md
// (reserve clicks per session, share of sessions that scroll past the globe scene).
// Pushes to Google Tag Manager / GA4 and Plausible when either is installed; otherwise a no-op.

type W = Window & {
  dataLayer?: Record<string, unknown>[];
  plausible?: (event: string, opts?: { props?: Record<string, string> }) => void;
};

export function track(event: string, props: Record<string, string> = {}) {
  const w = window as W;
  try {
    w.dataLayer?.push({ event, ...props });
    w.plausible?.(event, { props });
  } catch {
    /* analytics must never break the page */
  }
}
