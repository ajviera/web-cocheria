jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(
    async () => (key: string) =>
      key === 'brand' ? 'Cochería Nogués & Martínez' : key,
  ),
}));

import manifest from './manifest';

describe('manifest', () => {
  describe('when called', () => {
    it('should return the app manifest with the site name', async () => {
      const result = await manifest();
      expect(result.name).toBe('Cochería Nogués & Martínez');
      expect(result.short_name).toBe('Cochería Nogués & Martínez');
      expect(result.icons).toEqual([
        { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      ]);
    });
  });
});
