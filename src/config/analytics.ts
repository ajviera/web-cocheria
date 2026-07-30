/**
 * Conversion events measured with @vercel/analytics.
 *
 * These are the actions that actually matter for this site: there is no cart and
 * no form, so a "conversion" is a family reaching out. Names are snake_case and
 * **stable** — renaming one splits the series in the Vercel Analytics dashboard,
 * so treat them as an append-only contract.
 *
 * Every event carries a `location` property so the same action can be told apart
 * by where it was triggered (which CTA is actually earning the contact).
 */
export const ANALYTICS_EVENTS = {
  whatsappClick: 'whatsapp_click',
  telClick: 'tel_click',
  directionsClick: 'directions_click',
} as const;

/** Where in the page a tracked action was triggered. */
export const ANALYTICS_LOCATIONS = {
  hero: 'hero',
  contact: 'contact',
  footer: 'footer',
} as const;
