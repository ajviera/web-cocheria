jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(
    async () => (key: string) =>
      key === 'brand' ? 'Cocheria Nogues & Martinez' : key,
  ),
}));

import manifest from './manifest';

describe('manifest', () => {
  describe('when called', () => {
    it('should return the app manifest with the site name', async () => {
      const result = await manifest();
      expect(result.name).toBe('Cocheria Nogues & Martinez');
      expect(result.short_name).toBe('Cocheria Nogues & Martinez');
      expect(result.icons).toEqual([
        { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      ]);
    });
  });
});
