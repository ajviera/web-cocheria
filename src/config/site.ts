/**
 * Public site configuration sourced from NEXT_PUBLIC_* environment variables.
 * These are inlined at build time. Values are safe to expose (no secrets).
 * See `.env` for the committed baseline; override in `.env.local` for a clone.
 */
export const SITE = {
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '', // display "15-6151-2447"
  tel: process.env.NEXT_PUBLIC_CONTACT_TEL ?? '', // "+5491161512447"
  whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP ?? '', // "5491161512447"
  address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS ?? '', // dirección
} as const;

/** `tel:` href with spaces stripped, for the phone number. */
export const telHref = (tel: string): string => `tel:${tel.replace(/\s+/g, '')}`;

/** WhatsApp click-to-chat link for a digits-only number. */
export const whatsappHref = (n: string): string => `https://wa.me/${n}`;
