export const LOCALES = ['es-419'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'es-419';

export const LOCALE_COOKIE = 'NEXT_LOCALE';

export const isLocale = (value: string | undefined | null): value is Locale =>
  !!value && (LOCALES as readonly string[]).includes(value);
