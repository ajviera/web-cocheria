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

// RootLayout returns a full <html>…</html> tree. Rendering it into RTL's default
// <div> container triggers an invalid-DOM-nesting warning ("<html> cannot be a
// child of <div>"). Render it into the document node instead so <html> is a valid
// child; RTL still queries within document.body and cleans up between tests.
const renderLayout = (ui: React.ReactElement) => {
  const documentNode = document as unknown as HTMLElement;
  return render(ui, { container: documentNode, baseElement: documentNode });
};

describe('RootLayout', () => {
  describe('when rendered', () => {
    it('should render its children', async () => {
      const ui = await RootLayout({ children: <div>hijo</div> });

      renderLayout(ui);

      expect(screen.getByText('hijo')).toBeInTheDocument();
    });

    it('should render a JSON-LD script tag', async () => {
      const ui = await RootLayout({ children: <div>hijo</div> });

      renderLayout(ui);

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
