/**
 * Public site configuration sourced from NEXT_PUBLIC_* environment variables.
 * These are inlined at build time. Values are safe to expose (no secrets).
 * See `.env` for the committed baseline; override in `.env.local` for a clone.
 */
export const SITE = {
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '', // display "15-6151-2447"
  tel: process.env.NEXT_PUBLIC_CONTACT_TEL ?? '', // "+5491161512447"
  whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP ?? '', // "5491161512447"
  address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS ?? '', // address (free-form string)
  locality: process.env.NEXT_PUBLIC_CONTACT_LOCALITY ?? '', // "José C. Paz"
  region: process.env.NEXT_PUBLIC_CONTACT_REGION ?? '', // "Buenos Aires"
} as const;

/**
 * Production domain, used by metadataBase/canonical/sitemap/robots/JSON-LD.
 * Falls back to localhost so `next dev`/tests never crash on an unset env.
 * Must match EXACTLY the link published in the GBP (no trailing slash).
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/** `tel:` href with spaces removed. */
export const telHref = (tel: string): string => `tel:${tel.replace(/\s+/g, '')}`;

/** WhatsApp click-to-chat for a digits-only number. */
export const whatsappHref = (n: string): string => `https://wa.me/${n}`;
