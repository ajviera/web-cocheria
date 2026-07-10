import sitemap from './sitemap';

describe('sitemap', () => {
  describe('when called', () => {
    it('should return a single entry for the site root', () => {
      const [entry] = sitemap();
      expect(entry.url).toBe('http://localhost:3000');
      expect(entry.changeFrequency).toBe('monthly');
      expect(entry.priority).toBe(1);
      expect(entry.lastModified).toBeInstanceOf(Date);
    });
  });
});
