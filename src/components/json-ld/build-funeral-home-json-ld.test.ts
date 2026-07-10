import { buildFuneralHomeJsonLd } from './build-funeral-home-json-ld';

describe('buildFuneralHomeJsonLd', () => {
  describe('when called with the site data', () => {
    it('should build a FuneralHome JSON-LD object with the expected type and address', () => {
      const result = buildFuneralHomeJsonLd({
        name: 'Cochería Nogués & Martínez',
        description: 'Cochería en José C. Paz, Buenos Aires.',
        url: 'https://cocherianoguesmartinez.com.ar',
        telephone: '+5491161512447',
        address: 'Av. Gaspar Campos 4848',
        locality: 'José C. Paz',
        region: 'Buenos Aires',
        imageUrl: 'https://cocherianoguesmartinez.com.ar/og.png',
      });

      expect(result['@context']).toBe('https://schema.org');
      expect(result['@type']).toBe('FuneralHome');
      expect(result.address).toEqual({
        '@type': 'PostalAddress',
        streetAddress: 'Av. Gaspar Campos 4848',
        addressLocality: 'José C. Paz',
        addressRegion: 'Buenos Aires',
        addressCountry: 'AR',
      });
    });
  });
});
