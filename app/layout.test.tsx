import { render, screen } from '@testing-library/react';

jest.mock('next/font/google', () => ({
  Inter: () => ({ variable: 'font-inter', className: 'font-inter' }),
  Cormorant_Garamond: () => ({ variable: 'font-cormorant', className: 'font-cormorant' }),
  Tangerine: () => ({ variable: 'font-tangerine', className: 'font-tangerine' }),
}));

jest.mock('next-intl/server', () => ({
  getLocale: jest.fn(async () => 'es-419'),
  getMessages: jest.fn(async () => ({})),
  getTranslations: jest.fn(
    async () =>
      (key: string) =>
        key,
  ),
}));

jest.mock('@vercel/analytics/next', () => ({
  Analytics: () => null,
}));

jest.mock('@vercel/speed-insights/next', () => ({
  SpeedInsights: () => null,
}));

import RootLayout, { generateMetadata } from './layout';

describe('RootLayout', () => {
  describe('when rendered', () => {
    it('should render its children', async () => {
      const ui = await RootLayout({ children: <div>hijo</div> });

      render(ui);

      expect(screen.getByText('hijo')).toBeInTheDocument();
    });

    it('should render a JSON-LD script tag', async () => {
      const ui = await RootLayout({ children: <div>hijo</div> });

      render(ui);

      expect(document.querySelector('script[type="application/ld+json"]')).toBeInTheDocument();
    });
  });
});

describe('generateMetadata', () => {
  describe('when called', () => {
    it('should return SEO metadata built from translations and SITE_URL', async () => {
      const metadata = await generateMetadata();

      const { metadataBase } = metadata;
      if (metadataBase === null || metadataBase === undefined || typeof metadataBase === 'string') {
        throw new Error('expected metadataBase to be a URL');
      }
      expect(metadataBase.href).toBe('http://localhost:3000/');

      expect(metadata.title).toBe('title');
      expect(metadata.description).toBe('description');
      expect(metadata.alternates?.canonical).toBe('/');
      expect(metadata.openGraph?.siteName).toBe('brand');
      expect(metadata.openGraph?.locale).toBe('es_LA');
      expect(metadata.openGraph?.url).toBe('/');

      const { openGraph } = metadata;
      if (!openGraph || !('type' in openGraph)) {
        throw new Error('expected openGraph.type to be set');
      }
      expect(openGraph.type).toBe('website');

      const { twitter } = metadata;
      if (!twitter || !('card' in twitter)) {
        throw new Error('expected twitter.card to be set');
      }
      expect(twitter.card).toBe('summary_large_image');

      const { robots } = metadata;
      if (robots === null || robots === undefined || typeof robots === 'string') {
        throw new Error('expected robots to be an object');
      }
      const { googleBot } = robots;
      if (googleBot === undefined || typeof googleBot === 'string') {
        throw new Error('expected googleBot to be an object');
      }
      expect(googleBot['max-image-preview']).toBe('large');
    });
  });
});
