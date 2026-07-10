import { render, screen } from '@testing-library/react';

jest.mock('next/font/google', () => ({
  Inter: () => ({ variable: 'font-inter', className: 'font-inter' }),
  Cormorant_Garamond: () => ({ variable: 'font-cormorant', className: 'font-cormorant' }),
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
  });
});

describe('generateMetadata', () => {
  describe('when called', () => {
    it('should return the title and description from translations', async () => {
      const metadata = await generateMetadata();

      expect(metadata).toEqual({ title: 'title', description: 'description' });
    });
  });
});
