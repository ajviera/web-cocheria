import { render, type RenderOptions } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactElement } from 'react';
import messagesEs from '../../messages/es-419.json';
import type { Locale } from '@/i18n/config';

const MESSAGES: Record<Locale, Record<string, unknown>> = {
  'es-419': messagesEs,
};

interface RenderWithIntlOptions extends Omit<RenderOptions, 'wrapper'> {
  locale?: Locale;
}

export const renderWithIntl = (
  ui: ReactElement,
  { locale = 'es-419', ...rest }: RenderWithIntlOptions = {},
) =>
  render(
    <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]}>
      {ui}
    </NextIntlClientProvider>,
    rest,
  );
