describe('robots', () => {
  const originalEnv = process.env.VERCEL_ENV;
  afterEach(() => {
    process.env.VERCEL_ENV = originalEnv;
    jest.resetModules();
  });

  describe('when running in production', () => {
    it('should allow all crawling', async () => {
      process.env.VERCEL_ENV = 'production';
      jest.resetModules();
      const { default: robots } = await import('./robots');
      expect(robots()).toEqual({
        rules: { userAgent: '*', allow: '/' },
        sitemap: 'http://localhost:3000/sitemap.xml',
      });
    });
  });

  describe('when not running in production', () => {
    it('should disallow all crawling', async () => {
      process.env.VERCEL_ENV = 'preview';
      jest.resetModules();
      const { default: robots } = await import('./robots');
      expect(robots()).toEqual({
        rules: { userAgent: '*', disallow: '/' },
        sitemap: 'http://localhost:3000/sitemap.xml',
      });
    });
  });
});
