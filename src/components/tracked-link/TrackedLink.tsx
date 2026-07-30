'use client';

import { track } from '@vercel/analytics';

export interface TrackedLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'onClick'> {
  /** Event name from `ANALYTICS_EVENTS`. */
  event: string;
  /** Extra dimensions sent with the event (e.g. `{ location: 'hero' }`). */
  eventProperties?: Record<string, string>;
}

/**
 * Anchor that reports a conversion event before following the link.
 *
 * `onClick` is intentionally omitted from the props: this component owns the
 * click, so accepting a second handler would silently drop one of the two.
 * Navigation is never blocked — `track` is fire-and-forget, and a failed beacon
 * must not cost a family the call.
 */
export const TrackedLink = ({
  event,
  eventProperties,
  children,
  ...anchorProps
}: TrackedLinkProps) => (
  <a {...anchorProps} onClick={() => track(event, eventProperties)}>
    {children}
  </a>
);
