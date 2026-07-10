import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SITE, SITE_URL } from '@/config/site';
import { JsonLd, buildFuneralHomeJsonLd } from '@/components/json-ld';
import '@/styles/tokens.css';
import '@/styles/global.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');
  const nav = await getTranslations('nav');
  const title = t('title');
  const description = t('description');

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: '/' },
    openGraph: {
      title,
      description,
      url: '/',
      siteName: nav('brand'),
      // Facebook does not recognize 'es_419'; use 'es_LA' as the umbrella
      // locale for Latin American Spanish. Do not confuse with <html lang> (es-419).
      locale: 'es_LA',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
  };
}

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations('metadata');
  const nav = await getTranslations('nav');

  const jsonLd = buildFuneralHomeJsonLd({
    name: nav('brand'),
    description: t('description'),
    url: SITE_URL,
    telephone: SITE.tel,
    address: SITE.address,
    locality: SITE.locality,
    region: SITE.region,
    imageUrl: `${SITE_URL}/opengraph-image.png`,
  });

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <body>
        <JsonLd data={jsonLd} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};

export default RootLayout;
